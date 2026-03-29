# Chapter 2 — Pre-Production

**Goal:** Lock the engine (Unity), write the Technical Design Document, plan the vertical slice, set performance and memory budgets, and define milestones.

**Context:** `contexts/preproduction.md`

> **Start a new Claude Code session for this chapter.**
> Each phase uses a different context — a fresh session ensures the previous phase's decisions don't carry over unintentionally.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/preproduction.md` | Adds `technical-design-lead`, `architect`, `qa-lead` to active agents |
| `commands/` | `/unity-setup` | Initialize the Unity project structure |
| `commands/` | `/tech-design` | Write the Technical Design Document |
| `commands/` | `/vertical-slice` | Define the vertical slice scope |
| `commands/` | `/perf-budget` | Set performance targets |
| `commands/` | `/memory-budget` | Set memory targets |
| `commands/` | `/milestone-plan` | Plan production milestones |
| `agents/` | `technical-design-lead`, `architect`, `planner`, `producer`, `qa-lead`, `unity-reviewer` | Pre-production agents |
| `skills/` | `skills/workflow/technical-design-document/SKILL.md` | TDD authoring process |
| `skills/` | `skills/workflow/vertical-slice-planning/SKILL.md` | Vertical slice scoping |
| `skills/` | `skills/workflow/milestone-planning/SKILL.md` | Milestone planning process |
| `skills/` | `skills/engineering-common/gameplay-architecture/SKILL.md` | Core game loop architecture |
| `skills/` | `skills/engineering-common/performance-budgeting/SKILL.md` | Performance budget definition |
| `skills/` | `skills/engineering-common/memory-budgeting/SKILL.md` | Memory budget definition |
| `skills/` | `skills/unity/unity-project-structure/SKILL.md` | Unity folder organization |
| `docs/templates/` | `docs/templates/technical-design-document.md` | TDD template |
| `docs/templates/` | `docs/templates/vertical-slice-plan.md` | Vertical slice plan template |
| `docs/templates/` | `docs/templates/milestone-plan.md` | Milestone plan template |
| `rules/` | `rules/common/technical-design.md` | System design principles |
| `rules/` | `rules/common/project-structure.md` | Folder hierarchy standards |
| `rules/` | `rules/unity/project-structure.md` | Unity-specific folder standards |
| `rules/` | `rules/unity/assembly-definitions.md` | Assembly definition guidance |
| `hooks/` | `engine-profile-guard` | Fires on `/unity-setup` to confirm profile is set |

---

## Steps

### 1. Switch to the pre-production context

```
contexts/preproduction.md
```

This activates `technical-design-lead`, `architect`, and `qa-lead` in addition to the
ideation agents. The `unity-reviewer` agent is now available for all Unity-specific review.

### 2. Initialize the Unity project — /unity-setup

```
/unity-setup
```

The `engine-profile-guard` hook fires first to confirm `GAME_DEV_PROFILE=unity` is set.
The `unity-reviewer` and `architect` agents then use `skills/unity/unity-project-structure`
and apply `rules/unity/project-structure.md` and `rules/unity/assembly-definitions.md`.

**Resulting Unity project folder structure:**

```
Assets/
  _Project/
    Scripts/
      Core/          ← GameManager, SceneLoader
      Gameplay/      ← PlayerController, SpawnManager, CollisionHandler
      Systems/       ← ScoreManager, SaveSystem, AudioManager
      UI/            ← HUDController, MainMenuController, GameOverController
      Input/         ← InputHandler
    Prefabs/
      Player/
      Obstacles/
      Collectibles/
      UI/
    Scenes/
      MainMenu.unity
      Gameplay.unity
      GameOver.unity
    Audio/
    Art/
  Tests/
    EditMode/
    PlayMode/
```

Assembly definitions are created per domain (`Core.asmdef`, `Gameplay.asmdef`, etc.)
per `rules/unity/assembly-definitions.md`.

### 3. Write the Technical Design Document — /tech-design

```
/tech-design
```

The `technical-design-lead` and `architect` agents use `skills/workflow/technical-design-document`
and `skills/engineering-common/gameplay-architecture`. Output follows
`docs/templates/technical-design-document.md`.

**Example TDD excerpt — Systems Overview:**

```
## Systems

### GameManager
- Owns game state machine: Menu → Playing → GameOver
- Exposes events: OnGameStart, OnGameOver, OnGameRestart
- Singleton — lifecycle managed by scene loading

### PlayerController
- Rigidbody2D-based movement (auto-run: constant horizontal velocity)
- Jump: AddForce impulse, single jump only, coyote time 100ms
- Ground detection: OverlapCircle with LayerMask

### SpawnManager
- Procedural spawn: obstacles and coins on a timer, randomized gap distance
- Object pool: 10 obstacles, 20 coins pre-warmed at scene load
- Speed ramp: spawn interval decreases 5% every 10 seconds

### CollisionHandler
- OnTriggerEnter2D: obstacle → GameManager.TriggerGameOver()
- OnTriggerEnter2D: coin → ScoreManager.AddCoin(), deactivate coin

### ScoreManager
- Tracks: distance (time × speed), coins collected
- Emits: OnScoreChanged, OnHighScoreBeaten
- Persists: high score via SaveSystem

### SaveSystem
- PlayerPrefs-backed, single save slot
- Saves: int highScore
- Validates: corrupt/missing data defaults to 0

### AudioManager
- Singleton, DontDestroyOnLoad
- Plays: jump SFX, coin SFX, death SFX, background music (loop)
- Controls: master volume, SFX volume, music volume
```

### 4. Define the vertical slice — /vertical-slice

```
/vertical-slice
```

The `planner`, `producer`, and `gdd-designer` agents use `skills/workflow/vertical-slice-planning`.
Output follows `docs/templates/vertical-slice-plan.md`.

**Vertical slice scope:**

```
IN SCOPE for vertical slice:
- Player auto-run and jump (one obstacle type)
- One coin type
- Score counter (distance only)
- Game-over trigger and restart button
- No audio
- No high-score persistence
- Placeholder art (Unity primitives)

SUCCESS CRITERIA:
- Player can run, jump, die, and restart in under 30 seconds of play
- Frame rate holds at 60fps on target hardware
- No crashes in 10 consecutive runs
```

### 5. Set performance and memory budgets

```
/perf-budget
/memory-budget
```

The `performance-reviewer` uses `skills/engineering-common/performance-budgeting` and
`skills/engineering-common/memory-budgeting`.

**Performance budget:**

```
Target platform: PC (primary), Android (secondary)
Frame budget: 16.6ms (60fps)
  - Gameplay logic: ≤ 4ms
  - Physics: ≤ 3ms
  - Rendering: ≤ 6ms
  - UI: ≤ 1ms
  - Audio: ≤ 1ms
  - Headroom: ≥ 1.6ms
```

**Memory budget:**

```
Total: ≤ 512MB (Android) / 1GB (PC)
  - Base Unity overhead: ~150MB
  - Textures: ≤ 100MB
  - Audio: ≤ 50MB
  - Code + data: ≤ 50MB
  - Headroom: ≥ 162MB (Android)
GC alloc per frame: ≤ 0 (zero-alloc hot path)
```

### 6. Plan milestones — /milestone-plan

```
/milestone-plan
```

**Milestones:**

```
M0 — Scaffold Setup       Chapter 0
M1 — Concept Locked       Chapter 1: GDD approved
M2 — Vertical Slice       Chapter 2: TDD + slice plan approved
M3 — Core Systems         Chapter 3: gameplay loop playable
M4 — Full Feature         Chapter 4: UI + audio + save complete
M5 — Code Review          Chapter 5: review pass complete, no blocking issues
M6 — Performance Pass     Chapter 6: all budgets met
M7 — QA Sign-off          Chapter 7: zero P0/P1 bugs, QA plan passed
M8 — Release              Chapter 8: build certified, notes published
M9 — Live Ops Active      Chapter 9: telemetry live, first update planned
```

### 7. Lock pre-production

Confirm before proceeding:

- [ ] Unity project initialized per `rules/unity/project-structure.md`
- [ ] Assembly definitions created per `rules/unity/assembly-definitions.md`
- [ ] TDD written from `docs/templates/technical-design-document.md`
- [ ] Vertical slice scope locked
- [ ] Performance budget documented
- [ ] Memory budget documented
- [ ] Milestones defined from `docs/templates/milestone-plan.md`

---

## Scaffold Features in Action (Behind the Scenes)

- `rules/unity/project-structure.md` prevents ad hoc folder creation — every script has a
  defined home before a line of code is written
- `rules/unity/assembly-definitions.md` enforces compilation boundaries so no gameplay code
  can accidentally import editor-only utilities
- `hooks/engine-profile-guard` fires on `/unity-setup` — if someone runs this against a
  Godot project with the wrong profile, it is caught immediately

---

## What You Have After This Chapter

- Unity project folder structure ready
- TDD covering all 7 systems
- Vertical slice scope locked
- Performance and memory budgets documented
- 9-milestone plan for the full project

---

## Next

[Chapter 3 — Core Systems](./chapter-03-core-systems.md)
