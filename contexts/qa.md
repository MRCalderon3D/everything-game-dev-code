# qa

Focus on testing, regression, and stability. Structured validation that the build meets its defined acceptance criteria at every milestone and is stable enough to ship.

## Purpose
Prevent defects from reaching players and ensure that shipped features behave as designed under real play conditions. QA is most effective when it is embedded in the development cycle, not applied only at the end.

## Active Agents
- `qa-lead` — owns the test plan, manages regression coverage, and makes go/no-go recommendations at milestone gates
- `playtest-analyst` — runs structured play sessions to surface design and usability issues that automated tests miss
- `gameplay-programmer` — investigates and fixes bugs identified by QA; writes unit tests for fixed regressions
- `technical-design-lead` — triages bugs that may indicate architectural issues rather than implementation errors
- `producer` — manages defect prioritization and ensures critical bugs are scoped into the current milestone

## Key Commands
- `/plan` — scope the test pass for a milestone or feature, including coverage targets and acceptance criteria
- `/playtest-report` — document structured playtest findings with severity classifications
- `/tdd` — apply test-driven practices to high-risk systems to prevent defects before they occur
- `/perf-budget` — include performance regression as part of the QA pass
- `/milestone-plan` — verify that QA exit criteria are defined for each milestone gate

## Source-of-Truth Documents
- `QA test plan` — test coverage requirements, acceptance criteria, and regression scope per milestone
- `Defect log` — tracked bugs with severity, status, and owner
- `Playtest reports` — structured findings from play sessions
- `Milestone plan` — defines the QA sign-off required at each gate

## Priorities
1. Define acceptance criteria before testing begins — QA cannot pass or fail what has not been specified.
2. Prioritize regression coverage for previously fixed bugs — do not let closed bugs reopen silently.
3. Classify defects by severity immediately — blocking, major, minor, and cosmetic require different responses.
4. Test on target hardware and target platforms — do not rely solely on editor or developer builds.
5. Include performance and memory regression in every milestone QA pass.
6. Escalate blocking defects immediately — do not let them sit in a queue while a milestone closes.

## Escalate When
- A blocking defect cannot be fixed within the current milestone without cutting scope
- Regression testing reveals that a previously fixed bug has returned across multiple builds
- Test coverage is insufficient for a feature to receive sign-off
- The defect log grows faster than it is being resolved — a stability problem, not a resource problem
- A milestone cannot close because QA sign-off criteria were not defined in advance

## What to Avoid
- Treating QA as a final phase rather than a continuous embedded practice
- Approving a milestone when blocking defects are still open — defer the milestone, not the standard
- Writing test plans after the feature is already shipped
- Conflating playtest findings (design feedback) with defect reports (correctness failures)
- Allowing "works on my machine" to substitute for testing on target platforms
