# Chapter 9 — Post-Launch & Live Ops

**Goal:** Instrument the live game with telemetry, plan the first post-launch update, and capture lessons learned back into the scaffold.

**Context:** `contexts/liveops.md`

> **Start a new Claude Code session for this chapter.**
> Each phase uses a different context — a fresh session ensures the previous phase's decisions don't carry over unintentionally.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/liveops.md` | Activates live ops agents and rules |
| `commands/` | `/telemetry-plan` | Define instrumentation strategy |
| `commands/` | `/liveops-brief` | Plan a post-launch content update |
| `commands/` | `/evolve` | Capture lessons learned into reusable patterns |
| `commands/` | `/learn` | Synthesize learning into scaffold knowledge |
| `agents/` | `telemetry-analyst`, `liveops-manager`, `systems-designer`, `doc-updater` | Live ops agents |
| `skills/` | `skills/engineering-common/telemetry-instrumentation/SKILL.md` | Event taxonomy and instrumentation |
| `skills/` | `skills/design/liveops-design/SKILL.md` | Live event design |
| `skills/` | `skills/design/progression-design/SKILL.md` | Progression curve analysis |
| `skills/` | `skills/workflow/continuous-learning/SKILL.md` | Lessons learned capture |
| `docs/templates/` | `docs/templates/telemetry-plan.md` | Telemetry plan template |
| `rules/` | `rules/common/telemetry.md` | Instrumentation standards |
| `rules/` | `rules/unity/telemetry.md` | Unity telemetry specifics |

---

## Steps

### 1. Switch to the live ops context

```
contexts/liveops.md
```

This activates `telemetry-analyst` and `liveops-manager` as the lead agents. The
development agents (`gameplay-programmer`, `qa-lead`) remain available but in a support role.

### 2. Define the telemetry plan — /telemetry-plan

```
/telemetry-plan
```

The `telemetry-analyst` uses `skills/engineering-common/telemetry-instrumentation` and
`docs/templates/telemetry-plan.md`, applying `rules/common/telemetry.md` and
`rules/unity/telemetry.md`.

**Event taxonomy:**

```
## Session Events
| Event           | When                        | Properties                    |
|-----------------|-----------------------------|-------------------------------|
| session_start   | App opens                   | platform, version, is_new_user|
| session_end     | App closes or backgrounds   | duration_seconds              |

## Gameplay Events
| Event           | When                        | Properties                    |
|-----------------|-----------------------------|-------------------------------|
| run_started     | GameManager.StartGame()     | run_number (session count)    |
| run_ended       | GameManager.TriggerGameOver | distance, coins, death_cause, |
|                 |                             | duration_seconds, speed_step  |
| high_score_set  | ScoreManager fires event    | new_high_score, previous_high |
| coin_collected  | CollisionHandler coin hit   | total_coins_this_run          |

## Onboarding Events
| Event           | When                        | Properties                    |
|-----------------|-----------------------------|-------------------------------|
| onboarding_shown| First run started           | —                             |
| onboarding_done | First jump completed        | time_to_first_jump_seconds    |
```

**Key questions this telemetry answers:**

1. Where do players die most often? (`death_cause` + `speed_step` on `run_ended`)
2. What is the average run length? (`duration_seconds` on `run_ended`)
3. Do players come back? (session count over time)
4. Where do players drop off in onboarding? (`onboarding_shown` vs `onboarding_done`)
5. Is the difficulty curve working? (`distance` distribution across `speed_step` values)

**Implementation note:**

```csharp
// Telemetry calls are fire-and-forget, non-blocking
// They do not affect gameplay behavior
// All calls go through a single TelemetryService interface
// for easy mocking in tests and swapping analytics providers

public interface ITelemetryService
{
    void Track(string eventName, Dictionary<string, object> properties = null);
}

// Example: instrument CollisionHandler
private void OnObstacleHit()
{
    telemetry.Track("run_ended", new Dictionary<string, object>
    {
        { "distance", scoreManager.Distance },
        { "coins", scoreManager.Coins },
        { "death_cause", "obstacle" },
        { "duration_seconds", runTimer },
        { "speed_step", spawnManager.CurrentSpeedStep }
    });
    gameManager.TriggerGameOver();
}
```

**Rules applied:**
- `rules/common/telemetry.md` — events must not contain PII (no user names, device IDs
  without consent, location data)
- `rules/unity/telemetry.md` — telemetry calls must not block the main thread; use
  async/fire-and-forget pattern

### 3. Analyze early data — progression review

After the game has been live for 1–2 weeks, invoke the progression review:

The `telemetry-analyst` uses `skills/design/progression-design` to analyze the `run_ended`
data and identify where the difficulty curve needs adjustment.

**Questions to answer from data:**

- At which `speed_step` do most players die? (should be step 5–7, not step 1–2)
- Is the median run duration increasing over time? (players getting better — good)
- Is there a cliff where run duration suddenly drops? (unfair difficulty spike — fix it)

### 4. Plan the first update — /liveops-brief

```
/liveops-brief
```

The `liveops-manager` uses `skills/design/liveops-design` to plan the first content update
based on telemetry findings.

**Example liveops brief — v1.1.0:**

```
## Update: Dash & Collect v1.1.0

### Motivation
Telemetry shows 60% of players die at speed step 4 (the largest single-step gap decrease).
Playtest feedback from the community confirms this feels unfair.

### Changes
1. Speed ramp step 4: gap decrease from 40% → 25% (smoothed)
2. New obstacle type: low wall (duck mechanic — adds variety after step 5)
3. New coin skin: golden coin (unlocked at 1000 total coins collected)

### Success Criteria
- Median run duration increases by ≥ 10% at step 4
- No increase in step 5+ death rate
- Golden coin unlock rate: 20% of returning players within 2 weeks
```

### 5. Capture lessons learned — /evolve

```
/evolve
```

The `doc-updater` and `planner` agents use `skills/workflow/continuous-learning` to capture
lessons learned from the full development cycle of "Dash & Collect."

**Lessons learned structure:**

```
## What Worked Well
- TDD from Chapter 3 caught the CollisionHandler race condition early
- Object pooling designed in pre-production — no retrofit needed
- Input abstraction made PlayMode tests straightforward
- /qa-plan acceptance criteria caught the retry button delay before release

## What Was Harder Than Expected
- Unity Test Framework PlayMode test setup time is significant
  → For small projects, consider fewer PlayMode tests and more EditMode tests
- Scene audit (Chapter 5) found 3 prefab instance overrides that could have been
  caught earlier with a pre-commit hook
  → Add a prefab instance override check to hooks.json for future projects

## Scaffold Gaps Identified
- No command for input system validation (e.g., confirming all platforms tested)
  → Candidate for a new /input-review command
- The Audio Bible template is very long for a small project
  → Consider a /audio-bible-lite variant for projects with < 10 audio events
```

### 6. Push learnings into scaffold — /learn

```
/learn
```

The `planner` synthesizes the lessons from `/evolve` and identifies which ones should
become permanent scaffold improvements:

- New hook candidate: prefab instance override check → propose to scaffold maintainers
- New command candidate: `/input-review` → create a skill stub in `skills/engineering-common/`
- Rule update: add a note to `rules/unity/testing.md` about EditMode vs PlayMode trade-offs

These proposals are added to the scaffold's backlog via `CHANGELOG.md`, not implemented
immediately. The scaffold is updated in a separate development session.

---

## What You Have After This Chapter

- Telemetry instrumented and live with 8 events
- First post-launch update planned based on real data
- Lessons learned captured and proposals submitted to scaffold backlog
- Full development cycle documented end to end

---

## Full Milestone Summary

| Milestone | Chapter | Criteria |
|-----------|---------|----------|
| M0 — Scaffold Setup | 0 | Profile installed, hooks configured |
| M1 — Concept Locked | 1 | GDD approved |
| M2 — Vertical Slice Planned | 2 | TDD + slice plan approved, budgets set |
| M3 — Core Systems | 3 | Vertical slice playable, 5 systems tested |
| M4 — Full Feature | 4 | All 8 systems complete, full loop playable |
| M5 — Review Complete | 5 | Code clean, scenes valid, docs in sync |
| M6 — Performance | 6 | All budgets met, GC zero |
| M7 — QA Sign-off | 7 | 33 tests pass, zero P0/P1 |
| M8 — Release | 8 | Build certified, notes published |
| M9 — Live Ops Active | 9 | Telemetry live, first update planned |

---

## Scaffold Features in Action (Behind the Scenes)

- `skills/workflow/continuous-learning` closes the loop: the scaffold learns from every
  project it supports, and those learnings improve the scaffold for future projects
- `rules/common/telemetry.md` ensures the game respects player privacy from day one —
  no PII in events, no dark patterns in data collection
- `/evolve` and `/learn` are what distinguish a scaffold from a template: a template
  is static, but a scaffold gets better with every project it supports

---

## End of Guide

You have now built "Dash & Collect" — a complete Unity 2D endless runner — using every
major feature of the everything-game-dev-code scaffold:

- All 9 context phases activated
- All 10 hooks triggered at natural workflow moments
- 27 commands invoked across 10 chapters
- Agents from every role category used
- Skills from 6 of 8 skill domains exercised
- Manifests, schemas, templates, and orchestration docs all touched

For your next project, start at Chapter 0 and select the appropriate engine profile.
The scaffold — and the lessons learned from this project — will be waiting for you.
