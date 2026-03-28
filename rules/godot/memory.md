# godot/memory

Extends `../common/memory.md` with Godot-specific content.

## Asset Lifetime
- Define ownership for loaded scenes, resources, cached assets, autoload-held references, and long-lived UI or world content.
- Large maps, shared resources, audio content, textures, and UI assets must have platform-aware memory budgets.

## Data Rules
- Save data, runtime state, config resources, and content-authored defaults must have explicit boundaries.
- Avoid accidental retention through broad singleton or autoload references when controlled loading would be safer.

## Streaming Rules
- Large-world loading, scene switching, and resource loading strategies must be documented for content-heavy projects.
- Memory spikes during scene changes, cutscenes, loading-heavy transitions, or large UI flows must be profiled and owned.

## Done Criteria
Godot memory management is healthy when residency, loading, and ownership are explicit and testable.
