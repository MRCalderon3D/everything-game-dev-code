# Quality Assurance

## Purpose
Define shared QA rules for planning, execution, bug reporting, risk assessment, and release confidence.

## Scope
Applies to manual QA, exploratory testing, structured test passes, regression, and quality communication.

## QA Principles
- QA starts at planning, not after implementation.
- The goal is risk discovery and release confidence, not only bug counting.
- Reproduction quality matters as much as defect volume.
- Severity and priority must reflect player impact and milestone risk.

## Planning Rules
- Every milestone should define its QA objectives, scope, and exit criteria.
- High-risk features require test strategy before implementation completes.
- QA coverage should include onboarding, progression, save/load, settings, input, failure recovery, and major feature loops.

## Test Case Rules
- Use explicit steps, expected results, environment details, and build identifiers.
- Keep test cases focused on outcomes that matter to players or release risk.
- Maintain a mix of scripted regression coverage and exploratory testing.

## Bug Reporting Rules
- Bugs must include environment, build, reproduction steps, observed result, expected result, severity, and attachments when useful.
- Bugs that cannot be reproduced should still capture hypotheses and attempted conditions.
- Duplicate bugs should be linked, not silently closed without context.

## Severity Rules
- Crashes, progression blockers, save corruption, entitlement failures, and security issues are top-tier release risks.
- Visual or audio defects can still be release-blocking when they affect clarity, compliance, or player trust.
- Cosmetic severity must not be used to hide systemic frequency or discoverability.

## Collaboration Rules
- QA must participate in readiness and release reviews.
- QA findings must be traceable to owners and milestone decisions.
- Designers and engineers should review bug trends, not only individual tickets.

## Exit Criteria
- Each milestone must define acceptable open bug thresholds by severity and domain.
- Known issues shipped intentionally require explicit waiver and player-impact understanding.

## Deliverables
- QA plan.
- Test suites and exploratory charters.
- Bug taxonomy and reporting template.
- Milestone exit criteria.
- Release readiness reports.

## Done Criteria
QA is effective when risk areas are visible early, defect reports are actionable, and release confidence is based on evidence instead of intuition.
