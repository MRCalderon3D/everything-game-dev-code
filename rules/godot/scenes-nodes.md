# Godot Scenes and Nodes

## Purpose
Define architecture rules for scene composition, node ownership, reusability, and runtime hierarchy design in Godot.

## Scope
Applies to gameplay scenes, UI scenes, reusable prefabs, instanced sub-scenes, and scene tree design.

## Scene Principles
- Scenes should encapsulate a meaningful unit of behavior, presentation, or composition.
- Node trees must remain understandable without hidden assumptions spread across unrelated scripts.
- Reuse through scene instancing should improve clarity, not create fragile nesting.

## Ownership Rules
- Each major scene must have clear responsibilities, public inputs, and expected children or dependencies.
- Avoid giant root scenes that centralize too much unrelated behavior.
- Favor stable scene contracts over deep implicit node-path coupling.

## Composition Rules
- Node hierarchy should reflect runtime responsibilities, not editor convenience alone.
- Scene transitions and dynamic instancing must define ownership, cleanup, and data handoff.
- Avoid brittle assumptions about node paths when more explicit references or setup patterns are available.

## Done Criteria
Scene and node architecture is ready when composition is modular, ownership is visible, and hierarchy changes do not routinely break unrelated systems.
