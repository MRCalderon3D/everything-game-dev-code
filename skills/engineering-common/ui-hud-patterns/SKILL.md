---
name: ui-hud-patterns
description: Structure HUD and menu implementation so UI remains understandable, maintainable, and aligned with UX goals.
origin: everything-game-dev-code
category: engineering-common
---

# UI Hud Patterns

## Purpose
Structure HUD and menu implementation so UI remains understandable, maintainable, and aligned with UX goals.

## Use When
- HUD complexity is growing
- UI logic is leaking into gameplay code
- navigation and state are hard to maintain

## Inputs
- flow maps
- screen inventory
- input model
- localization and accessibility needs

## Process
1. separate state, navigation, and presentation
2. define UI ownership and update triggers
3. minimize coupling between gameplay systems and widget hierarchies
4. support localization, scaling, and platform variation
5. verify focus, persistence, and feedback loops

## Outputs
- UI architecture notes
- HUD ownership map
- navigation model
- integration constraints

## Quality Bar
- UI reads game state through a defined binding layer, never by reaching into gameplay internals
- HUD elements update from events or observed state changes, not per-frame polling of unrelated systems
- screen flow (stack, transitions, modality) is owned by one navigation system
- UI is testable with mocked game state

## Common Failure Modes
- gameplay code directly manipulating UI widgets
- HUD logic duplicated per screen instead of shared binding patterns
- navigation state spread across individual screens, causing stuck or double-open menus
- layouts that break at non-default resolutions or aspect ratios

## Related Agents
- ui-programmer
- ui-ux-designer
- accessibility-reviewer

## Related Commands
- ui-flow-review
- tech-design
- verify

## Related Skills
- ui-animation-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns runtime HUD architecture and data binding; `ui-animation-pipeline` owns UI motion authoring and tuning conventions.
