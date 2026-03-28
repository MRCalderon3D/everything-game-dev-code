# release

Ship checklist, certification, and submission. Structured process for preparing, validating, and delivering a build to platform holders and players.

## Purpose
Ensure that the final build meets all platform requirements, passes certification, and is delivered to players without last-minute surprises. Release is not a phase — it is a checklist-driven process with explicit go/no-go gates.

## Active Agents
- `producer` — owns the release checklist, coordinates submission timelines, and makes the final go/no-go call
- `qa-lead` — runs the final certification test pass and verifies that all platform requirements are met
- `technical-design-lead` — validates build configuration, final platform settings, and submission build integrity
- `gameplay-programmer` — resolves any certification-blocking defects found during the final test pass
- `security-reviewer` — performs a final review of data handling, permissions, and compliance requirements
- `release-manager` — manages build submission, store listing, and communication with platform holders

## Key Commands
- `/plan` — build the release checklist and submission timeline
- `/milestone-plan` — confirm that all production milestones are complete before release begins
- `/playtest-report` — review final certification playtest findings
- `/perf-budget` — confirm that the submission build meets all platform performance requirements

## Source-of-Truth Documents
- `Release checklist` — all tasks required before submission, with owner and status
- `Certification test plan` — platform-specific requirements and first-party guidelines
- `QA sign-off` — documented QA approval for the submission build
- `Build manifest` — exact build version, configuration, and submission metadata

## Priorities
1. Do not enter release without a complete and signed-off QA pass — partial sign-off is not sign-off.
2. Certify against the actual platform guidelines, not memory of past submissions.
3. Treat every certification failure as a blocker — do not submit knowing about failures.
4. Maintain a rollback plan for every submission in case a critical issue is found post-launch.
5. Lock the submission build — no changes after sign-off without restarting the certification pass.
6. Communicate submission status and timelines to all stakeholders before and during release.

## Escalate When
- Certification testing reveals a blocking defect in the submission build
- Platform holder guidelines have changed since the last submission
- The submission timeline is at risk due to an unresolved defect or missing asset
- A post-certification patch is needed and its scope exceeds a hotfix
- Localization, rating, or compliance requirements are incomplete at submission time

## What to Avoid
- Submitting a build that has not been tested in submission configuration
- Treating the release checklist as optional — every item exists because something went wrong without it
- Making code or content changes to the submission build without restarting the certification pass
- Allowing the launch date to override the go/no-go criteria — a bad launch is worse than a delayed launch
- Skipping the rollback plan because the team expects the launch to go smoothly
