# unity/ui

Extends `../common/ui-ux.md` with Unity-specific content.

## UI Architecture
- Separate UI state, navigation flow, and view-layer behavior as project complexity increases.
- UI prefabs should be reusable and resilient to localization, accessibility, and platform differences.
- Avoid coupling gameplay-critical logic to fragile scene hierarchy assumptions.

## Navigation Rules
- Focus, back behavior, popup stacks, and input routing must be explicit.
- Test navigation separately for controller, keyboard/mouse, touch, or other supported input families.

## Done Criteria
Unity UI is acceptable when flow, focus, and platform behavior are consistent and testable.
