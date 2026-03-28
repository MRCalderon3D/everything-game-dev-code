# Godot UI and Input

## Purpose
Define UI architecture and input handling rules for Godot projects.

## Scope
Applies to Control scenes, themes, navigation, accessibility affordances, input maps, rebinding, and device-specific interaction.

## UI Rules
- UI scenes must have clear ownership and reuse boundaries.
- Layout behavior should be validated across supported resolutions, aspect ratios, and localization expansions.
- Theme usage and style overrides should be organized so visual changes are manageable.

## Input Rules
- Input actions must be centralized and named consistently.
- Game logic should respond to intent-level input actions rather than hard-coded device assumptions.
- Rebinding, controller support, and focus/navigation flows must be considered early when they matter to the product.

## Risk Areas
- Mixed mouse, keyboard, touch, and controller interaction can create hidden edge cases.
- UI focus behavior, modal layering, and paused-state input must be reviewed carefully.

## Done Criteria
UI and input design is healthy when flows are consistent, device assumptions are explicit, and players can navigate critical paths reliably.
