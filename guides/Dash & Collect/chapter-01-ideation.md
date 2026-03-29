# Chapter 1 — Ideation

**Goal:** Define what "Dash & Collect" is, who it is for, and what its design pillars are.

**Context:** `contexts/ideation.md`

> **Start a new Claude Code session for this chapter.**
> Each phase uses a different context — a fresh session ensures the previous phase's decisions don't carry over unintentionally.

---

## Scaffold Features Used

| Feature | Specific Item | Purpose |
|---------|--------------|---------|
| `contexts/` | `contexts/ideation.md` | Activate ideation phase — sets active agents and priorities |
| `commands/` | `/plan` | Frame the concept exploration |
| `commands/` | `/gdd` | Start the Game Design Document |
| `agents/` | `gdd-designer`, `systems-designer`, `planner`, `producer` | Ideation-phase active agents |
| `skills/` | `skills/workflow/gdd-writing/SKILL.md` | GDD authoring process |
| `skills/` | `skills/design/core-loop-design/SKILL.md` | Define the core loop |
| `docs/templates/` | `docs/templates/game-design-document.md` | GDD template structure |
| `rules/` | `rules/common/game-design.md` | Core loop integrity, player agency, design pillars |

---

## Steps

### 1. Load the ideation context

In your new Claude Code session, tell Claude to read and apply the ideation context:

```
Read contexts/ideation.md and apply it to this session.
```

This activates the ideation-phase agents (`gdd-designer`, `systems-designer`, `planner`,
`producer`) and sets the priority to design exploration. No engine-specific rules are active
yet — ideation is engine-neutral by design.

### 2. Invoke /plan to structure the concept work

```
/plan Define the concept for a 2D endless runner targeting casual players on PC and mobile.
```

The `planner` agent returns a structured concept exploration that resolves the key open
questions before any document is written:

- What is the player fantasy?
- What are the 2-3 design pillars?
- What is the minimum feature set for the vertical slice?
- Who is the target audience?

**Review the output before continuing.** The agent may surface open questions or risks —
address them in the same session before moving to the next step. You follow the chapter steps,
not the agent's suggested next steps. The agent's output is content to review, not a workflow
to execute.

### 3. Invoke /gdd to write the Game Design Document

Once you are satisfied with the /plan output, invoke /gdd in the same session:

```
/gdd Create the Game Design Document for "Dash & Collect" — a 2D endless runner targeting casual players on PC and mobile.
```

The `gdd-designer` agent uses the concept already established by /plan to produce a structured
GDD following the `docs/templates/game-design-document.md` template. It uses
`skills/workflow/gdd-writing` and `skills/design/core-loop-design` internally.

**Example GDD excerpt — Core Loop:**

```
## Core Loop

1. Run starts automatically
2. Player sees obstacle approaching
3. Player taps/presses jump at the right moment
4. Player lands, continues running
5. Coins appear between obstacles — player must time jumps to collect
6. Speed increases every 10 seconds
7. Player hits obstacle → game over → score shown → instant retry

Loop duration: 5–90 seconds per run
```

**Example GDD excerpt — Design Pillars:**

```
## Design Pillars

1. Instant Restart
   - Game over to running again in under 2 seconds
   - No loading screens between runs

2. Satisfying Jump
   - Jump must feel weighty and precise
   - Coyote time: 100ms grace window at ledge edge
   - No double jump — skill ceiling from timing alone

3. Escalating Tension
   - Speed increases are noticeable but never feel unfair
   - Obstacle density ramps with speed
   - High score is always visible on the HUD
```

### 4. Validate against rules/common/game-design.md

The `gdd-designer` agent automatically checks output against `rules/common/game-design.md`.
Key checks:

- Core loop has a clear trigger → action → feedback → repeat cycle
- Player agency is present (jump is skill-based, not random)
- Design pillars are distinct and non-contradictory
- Scope is realistic for the target team size

### 5. Lock the concept

Before proceeding to pre-production, confirm:

- [ ] GDD created from `docs/templates/game-design-document.md`
- [ ] Core loop defined
- [ ] 3 design pillars defined
- [ ] Target audience defined (casual, PC + mobile)
- [ ] Reference titles noted (Flappy Bird, Canabalt, Subway Surfers)
- [ ] GDD reviewed against `rules/common/game-design.md`

---

## Scaffold Features in Action (Behind the Scenes)

- `contexts/ideation.md` keeps the session engine-neutral — no Unity or Unreal rules fire here
- `skills/design/core-loop-design` ensures the GDD defines a loop, not just a feature list
- `docs/templates/game-design-document.md` provides the structure so the GDD is consistent
  with every other GDD in the scaffold ecosystem

---

## What You Have After This Chapter

- `GDD: Dash & Collect` — complete design document with core loop, pillars, audience, and scope
- A shared vocabulary for the rest of the project: "the jump," "the run," "the tension ramp"

---

## Next

[Chapter 2 — Pre-Production](./chapter-02-preproduction.md)
