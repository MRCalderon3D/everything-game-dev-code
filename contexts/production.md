# production

Implementation, integration, and content pipeline. The team is building to the milestone plan established in pre-production.

## Purpose
Deliver features, content, and systems against a defined milestone plan. Maintain quality bar, scope discipline, and integration stability throughout the full production cycle.

## Active Agents
- `planner` — tracks milestone progress, flags scope drift, and manages backlog prioritization
- `gdd-designer` — maintains the GDD as the authoritative source of design intent; evaluates change requests
- `technical-design-lead` — keeps the TDD current as systems are built; owns architecture decisions
- `gameplay-programmer` — implements core systems, mechanics, and player-facing features
- `systems-designer` — validates that implemented systems match design intent; adjusts balance parameters
- `level-designer` — builds and iterates levels or content zones against the vertical slice quality bar
- `ui-ux-designer` — implements and iterates UI systems and player-facing flows
- `audio-designer` — integrates audio assets and validates mix against the audio budget
- `producer` — runs milestone reviews, manages scope trade-offs, and tracks delivery risk
- `qa-lead` — runs regression and integration tests against each milestone candidate
- `performance-reviewer` — tracks frame time, memory, and load times against established budgets
- `code-reviewer` — reviews all code changes before merge

## Key Commands
- `/plan` — track milestone progress or reprioritize the backlog
- `/gdd` — update or reference design intent for a feature in development
- `/tech-design` — document implementation decisions or update the TDD
- `/playtest-report` — capture structured feedback from internal playtests
- `/perf-budget` — check current performance status against targets
- `/memory-budget` — check current memory usage against targets
- `/milestone-plan` — review or revise the production milestone roadmap

## Source-of-Truth Documents
- `GDD` — design intent and feature scope for all active work
- `TDD` — architecture and system implementation decisions
- `Milestone plan` — what ships in each milestone, entry and exit criteria
- `QA test plan` — regression and integration coverage requirements
- `Risk register` — actively tracked; updated as new risks surface

## Priorities
1. Ship each milestone to its defined scope and quality bar — do not borrow from future milestones.
2. Keep the GDD and TDD current so that implementation decisions are traceable.
3. Integrate continuously — do not allow long-running feature branches that create merge risk.
4. Track performance and memory budgets at every milestone, not only at alpha.
5. Treat scope changes as explicit decisions with documented trade-offs, not silent additions.
6. Ensure QA has test coverage for every shipped feature before milestone close.

## Escalate When
- A feature cannot be implemented within the milestone without compromising the quality bar
- A scope change would push a milestone or affect another team's dependencies
- Performance or memory budgets are exceeded and no fix is scoped
- A design decision in the GDD conflicts with what engineering has already built
- A critical bug blocks milestone completion and no workaround exists

## What to Avoid
- Treating the milestone plan as a wish list rather than a binding commitment
- Implementing features not in the GDD without an explicit change request
- Skipping code review to hit a deadline
- Deferring performance or memory fixes until the milestone after the one where the budget was broken
- Allowing the GDD or TDD to drift from what is actually built
