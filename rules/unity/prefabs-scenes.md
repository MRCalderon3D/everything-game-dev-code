# Unity Prefabs and Scenes

## Purpose
Define rules for prefab authoring, scene composition, nested prefab usage, variants, and reference hygiene.

## Scope
Applies to all Unity scenes and prefabs.

## Prefab Rules
- Prefabs should represent intentional reusable composition units.
- Prefer prefab variants when variation is stable and inheritance remains understandable.
- Avoid deeply fragile nesting that makes overrides impossible to reason about.
- Serialized references inside prefabs must be reviewed for lifecycle and dependency implications.

## Scene Rules
- Scenes should have a clear ownership model and purpose.
- Avoid using scenes as undocumented containers for hidden global state.
- Scene setup should be reproducible from docs and validated by tooling where possible.
- Temporary debug objects should not remain in shipping scenes by accident.

## Reference Hygiene
- Missing references, duplicate listeners, and accidental cross-scene dependencies are release risks.
- Avoid broad Find-based wiring as a substitute for explicit composition.
- Dependencies that must be assigned in the inspector should be validated.

## Authoring Rules
- Content creators need stable authoring patterns for prefab structure, naming, and override usage.
- Technical art and design workflows should not depend on undocumented scene rituals.

## Review Rules
- Large prefab or scene changes require attention to merge risk, override breakage, and test coverage.
- Shared prefabs with broad project impact require ownership and change communication.

## Done Criteria
Unity prefab and scene usage is ready when composition is reusable, references are stable, and authoring workflows are understandable.
