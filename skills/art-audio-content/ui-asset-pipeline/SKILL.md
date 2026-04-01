---
name: ui-asset-pipeline
description: Define import, 9-slice, atlas packing, theming, and naming rules for UI visual assets (buttons, panels, icons, bars).
origin: everything-game-dev-code
category: art-audio-content
---

# UI Asset Pipeline

## Purpose
Define import, 9-slice configuration, atlas packing, theming, and naming rules for UI visual assets so they scale correctly across resolutions, remain consistent with the visual theme, and are replaceable without code changes.

## Use When
- the project needs UI visual assets (buttons, panels, icons, progress bars, backgrounds)
- placeholder UI rectangles are being replaced with styled assets
- a UI theme or skin system needs standardization
- new UI screens are being added and need visual assets that follow project conventions

## Inputs
- art bible or UI style guide (palette, typography, spacing, border radius)
- target resolutions and aspect ratios
- UI element inventory (buttons, panels, icons, bars, dividers, tooltips)
- 9-slice requirements per element type
- atlas packing strategy (single UI atlas vs per-screen)

## Process
1. define UI asset categories, naming convention, and folder structure
2. set resolution, format, and import settings per category (sprites vs raw textures)
3. establish 9-slice borders for scalable elements (buttons, panels, dialogs)
4. configure UI atlas packing groups and max atlas size
5. define theme structure (base palette, variant overrides, font pairing)
6. validate that all UI assets render correctly at min and max supported resolutions

## Outputs
- UI asset naming and folder convention document
- import settings template per UI asset category
- 9-slice border specification per scalable element
- UI atlas packing configuration
- theme definition (palette, fonts, spacing, variants)
- validation checklist for new UI asset submissions

## Quality Bar
- every UI asset follows the naming convention and lives in the correct folder
- 9-slice borders are correct — no stretching artifacts at any supported resolution
- UI atlas does not exceed platform texture memory budget
- theme is applied consistently — no one-off color or font overrides in individual screens
- all UI elements are legible at the smallest supported resolution

## Common Failure Modes
- 9-slice borders set incorrectly, causing visual distortion on resize
- inconsistent padding or margin between UI elements across screens
- UI atlas too large because high-res assets were used where 9-slice would suffice
- theme colors hardcoded per element instead of referenced from a central palette
- icons rendered at wrong resolution, appearing blurry or oversized

## Related Agents
- 2d-artist
- ui-ux-designer
- ui-programmer

## Related Commands
- ui-asset-pass
- ui-flow-review
- perf-budget

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- UI assets can be generated programmatically via Editor scripts (Texture2D.SetPixel, SetPixels32) — this skill's conventions apply equally to hand-drawn and code-generated assets.
