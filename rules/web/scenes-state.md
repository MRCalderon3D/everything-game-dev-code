# Web Scenes and State

## Purpose
Define scene and screen management rules for browser games.

## Scope
Applies to framework scene systems, hand-rolled state stacks, transitions, and per-scene state ownership.

## Scene Rules
- Use a framework scene system or a hand-rolled state stack; either is acceptable when boundaries are explicit.
- Each scene owns its state, entities, listeners, and timers; nothing may outlive the scene by accident.
- Transitions must define what is preserved, what is reset, and who owns state shared across scenes.

## Teardown Rules
- Every scene must implement deterministic teardown: remove listeners, cancel timers and animation frames, release assets.
- Re-entering a scene must produce a clean state, not residue from a previous visit.
- Overlay states such as pause and dialogs must declare whether the underlying scene keeps updating.

## Done Criteria
Scene management is healthy when transitions are predictable, ownership is explicit, and teardown leaves no residue.
