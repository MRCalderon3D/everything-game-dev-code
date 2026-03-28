# Unity Serialization and Data

## Purpose
Define rules for Unity serialization, save/load boundaries, ScriptableObject usage, inspector-authored data, and migration safety.

## Scope
Applies to serialized fields, assets, scene data, prefabs, save data, and configuration data in Unity projects.

## Serialization Principles
- Treat serialization as a design constraint, not an implementation afterthought.
- Runtime correctness must not depend on fragile serialized state that is hard to audit.
- Serialized fields should support authoring clarity, not replace architecture.

## ScriptableObject Rules
- Use ScriptableObjects for authored data, shared configuration, or tooling workflows when that improves iteration.
- Do not use ScriptableObjects as mutable hidden global runtime state unless that behavior is explicit, documented, and tested.
- Shared data assets with major gameplay impact require ownership and change review.

## Save Data Rules
- Save data formats, versioning, and migration strategy must be documented.
- Save corruption, partial writes, missing fields, and backward-compatibility behavior must be handled intentionally.
- Scene references and transient Unity object references must not leak into persistent save state in unsafe ways.

## Inspector Data Rules
- Inspector-assigned references must be validated for required dependencies.
- Use custom validation or authored tooling when large amounts of data are configured manually.
- Avoid relying on default inspector order or hidden implicit setup for critical systems.

## Migration Rules
- Refactors that rename serialized fields, move types, or restructure assets must account for migration impact.
- Breaking serialization changes require explicit review before release branches or live content updates.

## Done Criteria
Unity data architecture is ready when authored data is understandable, runtime state is controlled, and serialization changes are survivable.
