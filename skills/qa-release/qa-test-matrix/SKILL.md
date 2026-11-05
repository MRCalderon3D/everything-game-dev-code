---
name: qa-test-matrix
description: Build a coverage matrix that shows what must be tested, on which configurations, and at what milestone confidence level.
origin: everything-game-dev-code
category: qa-release
---

# QA Test Matrix

## Purpose
Build a coverage matrix that shows what must be tested, on which configurations, and at what milestone confidence level.

## Use When
- a milestone or release is approaching
- test scope is unclear
- platform and feature combinations are multiplying

## Inputs
- feature list
- platform list
- risk areas
- release gates

## Process
1. map features to platforms, states, and risk classes
2. define must-pass versus nice-to-have coverage
3. highlight unsupported or unowned combinations
4. link each coverage area to owners and evidence sources
5. update the matrix as scope changes

## Outputs
- QA test matrix
- coverage gaps
- ownership map
- test-pass priorities

## Quality Bar
- every shipped feature is covered with at least its happy path, key edge cases, and failure handling
- each test case states preconditions, steps, and an observable expected result
- coverage is traceable: every GDD acceptance criterion maps to at least one test case
- platform and device variations appear as explicit matrix axes, not assumptions

## Common Failure Modes
- test cases written from implementation knowledge instead of player-facing behavior
- matrices that grow stale as features change, testing what no longer exists
- edge cases and failure paths omitted because the happy path passes
- no traceability, so removed features leave orphan tests and new ones ship untested

## Related Agents
- qa-lead
- release-manager
- producer

## Related Commands
- qa-plan
- release-check
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
