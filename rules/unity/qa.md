# unity/QA

Extends `../common/qa.md` with Unity-specific content.

## Scope
Extends common QA rules for Unity runtime and content behavior.

## High-Risk Areas
- scene loading and transitions
- prefab reference integrity
- serialization and save/load behavior
- platform-specific input and UI navigation
- package integration regressions
- performance drift after content changes
- build-configuration mistakes
- Addressables or asset-delivery failures

## Validation Rules
- Test both editor reproducibility and player-build behavior for issues that may differ between them.
- Smoke tests must include startup, input, loading, settings persistence, and at least one representative gameplay path.
- Validate common content-authoring mistakes with tools when possible instead of relying only on manual QA.

## Reproduction Rules
- QA reports should capture Unity version, platform, scene or content path, build type, and whether the issue reproduces in editor, player, or both.
- Bugs involving timing or initialization order should include likely scene-flow or lifecycle conditions.

## Collaboration
- Unity engineers should expose debug affordances that help QA isolate data, scene, and initialization problems.
- Technical art and QA should coordinate on rendering, shader, import, and content integrity bugs.

## Done Criteria
Unity QA coverage is healthy when Unity-specific failure modes are anticipated, reproducible, and connected to engine-aware diagnostics.
