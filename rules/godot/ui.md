# godot/ui

Extends `../common/ui-ux.md` with Godot-specific content.

## UI Architecture
- Separate UI state, navigation flow, and visual behavior as project complexity increases.
- Control nodes and UI scenes must be structured so that flow, ownership, and data sources remain understandable.
- Avoid coupling gameplay-critical logic to fragile node hierarchy assumptions.

## Navigation Rules
- Focus, back behavior, popup stacks, input routing, and platform-specific UX must be explicit.
- Test navigation separately for controller, keyboard/mouse, touch, or other supported input families.

## Done Criteria
Godot UI is acceptable when flow, focus, and platform behavior are consistent and testable.
