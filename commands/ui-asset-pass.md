---
description: Review UI visual assets for naming, 9-slice config, atlas packing, theme consistency, and animation conventions.
---

# /ui-asset-pass

## Purpose
Review the project's UI visual assets — buttons, panels, icons, bars, fonts, and UI animations — against the UI style guide and pipeline conventions. Produces a structured report with issues, warnings, and recommendations. Complements `/ui-flow-review` which covers logic and UX flow.

## Use When
- New UI assets have been added and need validation before merge.
- Placeholder UI elements are being replaced with styled assets and drop-in compatibility must be verified.
- A milestone review requires confirmation that all UI assets meet quality bar.
- UI animations need validation for timing, easing, and accessibility compliance.

## Invokes Agents
- 2d-artist
- ui-ux-designer
- accessibility-reviewer

## Required Skills
- ui-asset-pipeline
- ui-animation-pipeline
- placeholder-asset-pipeline
- generated-raster-asset-pipeline
- accessibility-design

## Expected Output
- A structured review report covering:
  - UI asset naming, resolution, and import compliance
  - 9-slice border correctness for all scalable elements
  - UI atlas packing size and efficiency
  - transparency readiness, crop cleanliness, and generated-raster acceptance checks where applicable
  - theme consistency (palette, fonts, spacing) across all screens
  - animation timing, easing, and reduced-motion fallback coverage
  - declared display-size expectations for generated UI skins and icons
  - placeholder-to-final replacement readiness
- Clear pass/fail per category with actionable fix recommendations.
- Escalation notes for issues that affect accessibility or performance.

## Notes
- This command reviews **visual assets**, not UX logic — use `/ui-flow-review` for navigation, flow, and interaction review.
- Run after generating UI assets to verify quality before gameplay testing.
- Treat externally generated raster UI art the same as hand-authored UI art: validate naming, 9-slice setup, atlas impact, and placeholder replacement compatibility before accepting it.
- Escalate to `performance-reviewer` when UI atlas size exceeds platform budgets.
- Escalate to `accessibility-reviewer` when reduced-motion fallbacks are missing.
