# unity/testing

Extends `../common/testing.md` with Unity-specific content.

## Test Layers
- Use plain C# tests for deterministic domain logic when possible.
- Use edit mode tests for engine-integrated logic that does not need full play mode.
- Use play mode tests for scene flow, lifecycle, async loading, and integration-sensitive behavior only when justified.

## Coverage Priorities
- Protect systems that frequently fail due to serialization, scene composition, initialization order, input, save/load, or package integration.
- Include smoke coverage for startup, settings, one representative gameplay path, and shutdown or save flow.

## Reliability Rules
- Minimize hidden scene assumptions in tests.
- Flaky tests are defects and must be fixed, isolated, or removed with justification.

## Done Criteria
Unity testing is healthy when test layers are chosen deliberately and Unity-specific regressions are caught early.
