# preproduction

Design solidification, prototyping, risk retirement, and vertical slice definition. The goal is to validate that the game is buildable at the intended quality bar before full production begins.

## Purpose
Retire the highest risks through design, prototyping, and structured validation. Exit pre-production with a vertical slice that proves the core experience, a production plan that is credible, and a team aligned on scope and quality bar.

## Active Agents
- `planner` — owns the pre-production plan and tracks risk retirement progress
- `gdd-designer` — finalizes and maintains the GDD as design decisions are made
- `technical-design-lead` — writes the TDD and owns architecture decisions
- `architect` — validates system boundaries, data flow, and integration approach
- `producer` — builds the production milestone plan once the vertical slice proves feasibility
- `qa-lead` — defines early test strategy and acceptance criteria for the vertical slice
- `playtest-analyst` — runs structured playtests of prototypes and the vertical slice

## Key Commands
- `/vertical-slice` — define the scope, quality bar, and risk retirement goals of the slice
- `/gdd` — finalize player-facing design decisions
- `/tech-design` — document the architecture and integration approach
- `/milestone-plan` — plan the production phases after the vertical slice gate
- `/tdd` — apply test-driven practices to high-risk systems
- `/playtest-report` — capture and analyze vertical slice playtest findings
- `/perf-budget` — lock performance targets before production begins
- `/memory-budget` — lock memory targets before production begins

## Source-of-Truth Documents
- `GDD` — finalized design intent and feature scope
- `TDD` — architecture, system design, integration approach
- `Vertical slice plan` — scope, quality bar, exit criteria
- `Milestone plan` — production roadmap
- `QA test plan` (initial) — validation approach for the vertical slice
- `Risk register` — tracked and actively retired

## Priorities
1. Prove the core loop works and is fun through a playable vertical slice.
2. Lock the engine, platform targets, and core technology stack.
3. Resolve every design assumption that cannot survive into production as an unknown.
4. Define production entry criteria — what must be true before the team scales up.
5. Establish performance and memory budgets before content pipelines are built.
6. Ensure the GDD and TDD are consistent and co-owned by design and engineering.

## Escalate When
- The vertical slice cannot be scoped without absorbing production work
- Architecture choices cannot be finalized without design decisions that are still open
- Performance targets cannot be met with the current approach at prototype scale
- Playtest findings reveal fundamental problems with the core loop
- Production plan assumptions are inconsistent with the team size or schedule

## What to Avoid
- Entering production before the vertical slice has been played and reviewed
- Treating pre-production as a documentation phase — it must produce playable proof
- Locking a production plan before the vertical slice validates feasibility
- Allowing scope to grow during pre-production without explicit prioritization decisions
