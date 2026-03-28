# review

Technical, design, and quality review. Structured evaluation of a milestone, build, or feature against defined exit criteria before advancing to the next phase.

## Purpose
Provide a structured gate that prevents defects, design drift, and technical debt from accumulating across milestones. Review is not a one-time event — it is a recurring discipline applied at every milestone boundary and at feature completion.

## Active Agents
- `planner` — schedules reviews and tracks which items are blocked pending review outcomes
- `code-reviewer` — reviews all code changes for correctness, maintainability, and adherence to engine standards
- `technical-design-lead` — reviews architecture decisions and verifies alignment with the TDD
- `gdd-designer` — reviews feature implementations against design intent in the GDD
- `qa-lead` — reviews test coverage and validates that acceptance criteria have been met
- `performance-reviewer` — reviews build metrics against performance and memory budgets
- `security-reviewer` — reviews third-party integrations, SDK usage, and data handling

## Key Commands
- `/plan` — structure a review session with explicit scope, reviewers, and exit criteria
- `/gdd` — reference design intent when evaluating feature implementations
- `/tech-design` — reference architecture decisions when evaluating code structure
- `/playtest-report` — attach playtest findings to a review gate
- `/perf-budget` — verify performance compliance as part of milestone review

## Source-of-Truth Documents
- `GDD` — baseline for design intent review
- `TDD` — baseline for technical review
- `Milestone plan` — defines the exit criteria for each review gate
- `QA test plan` — defines required test coverage for review sign-off
- `Risk register` — updated when review reveals new risks

## Priorities
1. Define review scope and exit criteria before the review starts, not during it.
2. Review against the GDD and TDD — not against informal expectations or memory.
3. Separate blocking issues from non-blocking observations; do not let observations block ship.
4. Performance and memory review must happen at every milestone, not only pre-release.
5. Security review must happen when third-party plugins, SDKs, or online features are introduced.
6. Document review outcomes — decisions, deferred items, and waivers — in writing.

## Escalate When
- A feature fails design review and the GDD itself needs to be updated to reflect what was built
- A code review reveals architectural drift that cannot be fixed in the current milestone
- Performance review finds a budget violation with no scoped fix
- Security review finds a risk in a third-party dependency that blocks release
- Review scope is contested and the team cannot agree on what constitutes passing

## What to Avoid
- Running review as a rubber-stamp after the fact rather than a genuine gate
- Mixing blocking issues with stylistic preferences in review feedback
- Allowing review to expand in scope mid-session without resetting the timeline
- Skipping technical review to hit a deadline
- Treating review sign-off as implicit — it must be explicit and recorded
