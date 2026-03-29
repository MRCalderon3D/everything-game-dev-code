# Chapter 6 — Performance Pass

**Goal:** Profile and optimize the game against the budgets defined in pre-production.

**Context:** `contexts/performance.md`

> **Start a new Claude Code session for this chapter.**
> Each phase uses a different context — a fresh session ensures the previous phase's decisions don't carry over unintentionally.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/performance.md` | Activates performance-focused agents and rules |
| `commands/` | `/perf-budget` | Compare current frame times against targets |
| `commands/` | `/memory-budget` | Check allocation patterns against targets |
| `commands/` | `/tech-design` | Document any architectural changes required |
| `agents/` | `performance-reviewer`, `gameplay-programmer`, `technical-design-lead` | Performance agents |
| `skills/` | `skills/unity/unity-performance/SKILL.md` | Unity-specific profiling and optimization |
| `skills/` | `skills/engineering-common/performance-budgeting/SKILL.md` | Budget enforcement |
| `skills/` | `skills/engineering-common/memory-budgeting/SKILL.md` | Memory tracking |
| `rules/` | `rules/common/performance.md` | Budget-first approach, profiling discipline |
| `rules/` | `rules/common/memory.md` | Allocation budgets, object pooling |
| `rules/` | `rules/unity/performance.md` | Unity profiler usage, batching, GC |
| `rules/` | `rules/unity/memory.md` | Unity memory specifics |
| `hooks/` | `performance-budget-warning` | Continues to fire on performance-sensitive changes |

---

## Rule: Profile Before Optimizing

`rules/common/performance.md` enforces: **measure first, optimize second**.

Never guess where the performance problem is. Use the Unity Profiler to find the actual
bottleneck before writing any optimization code. The `performance-reviewer` agent will
reject optimization proposals that are not backed by profiler data.

---

## Steps

### 1. Switch to the performance context

```
contexts/performance.md
```

This activates the `performance-reviewer` as the lead agent for this phase.

### 2. Establish a profiling baseline

Before running `/perf-budget`, capture a profiling baseline in the Unity Profiler:

1. Open the Unity Profiler (`Window → Analysis → Profiler`)
2. Run the game for 60 seconds (a long-enough run to see the speed ramp)
3. Export the profiler data to `docs/performance/baseline.data`
4. Note the worst-frame CPU time, GC.Alloc per frame, and total memory usage

### 3. Check the performance budget — /perf-budget

```
/perf-budget
```

The `performance-reviewer` uses `skills/engineering-common/performance-budgeting` and
`skills/unity/unity-performance` to compare the profiler baseline against the targets
set in Chapter 2.

**Budget comparison template:**

```
Target platform: Android
Frame budget: 16.6ms (60fps)

                   Budget     Measured    Status
Gameplay logic     ≤ 4ms      2.1ms       PASS
Physics            ≤ 3ms      1.8ms       PASS
Rendering          ≤ 6ms      4.2ms       PASS
UI                 ≤ 1ms      0.4ms       PASS
Audio              ≤ 1ms      0.3ms       PASS
GC.Alloc/frame     0 bytes    2.4KB       FAIL ← investigate
Total frame        ≤ 16.6ms   8.8ms       PASS
```

### 4. Check the memory budget — /memory-budget

```
/memory-budget
```

**Memory budget comparison template:**

```
Platform: Android (512MB limit)

                      Budget      Measured    Status
Base Unity overhead   ~150MB      148MB       PASS
Textures              ≤ 100MB     22MB        PASS
Audio                 ≤ 50MB      8MB         PASS
Code + data           ≤ 50MB      12MB        PASS
Total                 ≤ 512MB     190MB       PASS (322MB headroom)
```

### 5. Investigate GC.Alloc violations

For any failed budget line, the `performance-reviewer` identifies the source using the
`skills/unity/unity-performance` skill.

**Common GC.Alloc sources in this project type:**

| Source | Fix |
|--------|-----|
| Score HUD using `string.Format` or `+` in Update | Cache string with `ToString("F0")` on event, not per frame |
| LINQ in SpawnManager interval calculation | Replace with explicit loop or cached value |
| `GetComponent<T>()` called in Update | Cache in Awake/Start |
| Delegate instantiation in event subscription | Cache the delegate as a field |
| `new WaitForSeconds()` in coroutines | Cache the WaitForSeconds instance |

**Profiler drill-down process:**

1. Deep Profile mode: identify the method generating the allocation
2. Confirm the method is in the hot path (called every frame)
3. Fix using one of the patterns above
4. Re-profile to confirm GC.Alloc drops to 0 for that method
5. Do not move on until the fix is verified in the profiler

### 6. Object pool validation

Verify the SpawnManager's object pool is working correctly:

- Obstacle instances reused: open the Hierarchy during play — obstacle count should
  stabilize after the pre-warm, not grow over time
- Coin instances reused: same check
- Pool size is sufficient: no new instantiation spikes in the profiler after the first
  3 seconds of play

If the pool is undersized, increase the pool size and re-profile. Do not increase pool
size without profiler evidence that it was being exhausted.

### 7. Rendering optimization (if needed)

If the rendering budget is exceeded:

- Check draw call count in the Frame Debugger
- Enable sprite atlasing for all UI sprites (`rules/unity/memory.md`)
- Enable GPU instancing for obstacles and coins if they share materials
- Disable shadow casting on 2D sprites (not needed for a 2D runner)

### 8. Document performance findings

If any architectural changes were required (e.g., caching a component reference that the
TDD said would be fetched dynamically), update the TDD:

```
/tech-design --update "Cached ScoreManager reference in HUDController.Awake per performance
optimization. Previously fetched via GetComponent in Update."
```

---

## Budget Sign-off Checklist

- [ ] All frame budget lines pass (≤ 16.6ms total on target platform)
- [ ] GC.Alloc per frame is 0 bytes in the hot path
- [ ] Total memory is within budget with headroom
- [ ] Object pool effectiveness confirmed in profiler
- [ ] Any TDD changes from optimization documented via `/tech-design`
- [ ] Profiler baseline exported to `docs/performance/`

This is the gate before QA. No QA sign-off until performance budgets are met.

---

## Scaffold Features in Action (Behind the Scenes)

- `hooks/performance-budget-warning` continues to fire during this phase whenever physics
  or rendering systems are touched — it is a reminder, not a blocker
- `rules/common/performance.md` and `rules/unity/performance.md` prevent the team from
  making speculative optimizations: every change must be backed by profiler data
- `rules/common/memory.md` specifically calls out object pooling as a requirement for
  spawnable game objects — verified here against the actual implementation

---

## What You Have After This Chapter

- Profiler baseline exported
- All frame and memory budgets met
- GC.Alloc zero in hot path
- Performance findings documented in TDD

---

## Next

[Chapter 7 — QA & Testing](./chapter-07-qa.md)
