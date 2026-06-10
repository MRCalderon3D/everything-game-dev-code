# Web UI

## Purpose
Define UI architecture rules for browser games across in-canvas and DOM-based presentation.

## Scope
Applies to HUDs, menus, overlays, responsive layout, and font handling.

## Architecture Rules
- Choose in-canvas UI or a DOM overlay deliberately; document the trade-off for input, styling, accessibility, and performance.
- Keep UI state separate from simulation state with explicit update boundaries.
- HUD elements must update only when their backing values change, not unconditionally every frame.

## Layout Rules
- Validate layout across supported resolutions, aspect ratios, and orientations, including mobile safe areas.
- Load fonts explicitly and handle the unloaded window so text does not flash, shift, or measure incorrectly.
- DOM overlays must stay aligned with canvas scaling and resize behavior.

## Done Criteria
UI design is healthy when presentation choices are deliberate, updates are disciplined, and layout survives every supported viewport.
