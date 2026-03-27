# Testing

## Purpose
Define shared automated and semi-automated testing rules for gameplay logic, systems, content validation, tooling, and regressions.

## Scope
Applies to unit, integration, functional, smoke, content-validation, and performance-supporting tests.

## Testing Principles
- Testing should protect decision-critical behavior and recurring failure patterns.
- Not everything needs the same test depth; prioritize by risk and change frequency.
- Determinism matters for automation credibility.
- Test suites should support fast feedback and release confidence.

## Coverage Rules
- Core logic with meaningful branching should have automated coverage where feasible.
- Save/load, progression, economy, entitlement, and platform-sensitive systems should receive elevated regression attention.
- Content validation should catch missing references, broken data, invalid states, and pipeline errors where practical.
- Smoke tests should cover startup, basic navigation, a representative gameplay loop, and shutdown or save flows.

## Design Rules
- Systems should expose seams for deterministic testing.
- Avoid architecture that makes validation possible only through full manual playthroughs.
- Use fixtures and test data that clearly express intent.

## Maintenance Rules
- Flaky tests are defects and must be fixed, isolated, or removed.
- Broken tests must not linger without owner and remediation plan.
- Test suites should be reviewed when architecture or content pipelines change.

## CI Rules
- Fast tests should run on every meaningful integration point.
- Slower suites may run on scheduled or milestone gates, but their ownership and purpose must be explicit.
- Build pipelines should surface failing tests clearly and attach logs or artifacts when useful.

## Deliverables
- Test strategy.
- Automated test taxonomy.
- Smoke suite definition.
- Content validation checks.
- Regression suite ownership map.

## Done Criteria
Testing is effective when it catches high-value regressions early, stays trustworthy, and aligns with the project’s actual risk profile.
