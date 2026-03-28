# Emberfall Technical Design Handoff

## What The GDD Already Decides

- Player verbs and intended feel
- Progression model and unlock logic at a high level
- Encounter readability requirements
- Accessibility expectations for UI communication

## What Technical Design Must Decide Next

- Save/load boundaries
- Telemetry event model
- Content data ownership
- Engine-specific scene or level composition strategy
- Performance budget instrumentation

## Engine Isolation Rule

Keep the design document engine-neutral.
Move implementation detail into:
- Unity technical design when the project is implemented in Unity
- Unreal technical design when the project is implemented in Unreal
- Godot technical design when the project is implemented in Godot
