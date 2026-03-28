# Godot Resources and Serialization

## Purpose
Define how Godot projects should handle resources, saved data, serialization, and content-driven configuration.

## Scope
Applies to Resource-based data, custom resources, save files, config files, imported data, and serialization strategy.

## Resource Rules
- Use resources intentionally for authoring data, configuration, and reusable content definitions.
- Mutable runtime state should not silently write back into authored resources unless that workflow is explicitly designed.
- Resource ownership and lifecycle must be clear where resources are shared across scenes.

## Save and Serialization Rules
- Save formats must be versioned when live projects or long-running test branches can produce compatibility risk.
- Serialization boundaries must be documented for progression, settings, and player data.
- Unsafe assumptions about file paths, permissions, or platform storage behavior must be reviewed.

## Review Triggers
Escalate when:
- scene instances rely on mutating shared resource assets at runtime
- save compatibility is unclear
- resource references become difficult to trace
- data ownership is split between scenes, autoloads, and serialized files without documentation

## Done Criteria
Resource and serialization design is healthy when authored data, runtime state, and persisted data have explicit boundaries and compatibility expectations.
