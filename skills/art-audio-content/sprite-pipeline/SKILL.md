---
name: sprite-pipeline
description: Define import, slicing, atlas packing, and naming rules for 2D sprite assets.
origin: everything-game-dev-code
category: art-audio-content
---

# Sprite Pipeline

## Purpose
Define import, slicing, atlas packing, and naming rules for 2D sprite assets so they are consistent, performant, and replaceable across the project.

## Use When
- the project uses 2D sprites as its primary visual representation
- sprite sheets or atlas configuration needs standardization
- placeholder sprites are being replaced with final art and naming or sizing must be validated
- new sprite assets are being added and need to follow project conventions

## Inputs
- art bible or visual direction document
- target resolution and platform constraints
- sprite categories (characters, environment, UI, VFX, collectibles)
- atlas packing strategy (per-category, per-scene, global)

## Process
1. define sprite categories, naming convention, and folder structure
2. set resolution, pixel density, and import settings per category
3. establish sprite sheet layout rules (grid size, padding, pivot points)
4. configure atlas packing groups and max atlas size per platform
5. validate that sprites match the art bible and meet runtime budgets

## Outputs
- sprite naming and folder convention document
- import settings template per sprite category
- atlas packing configuration
- validation checklist for new sprite submissions

## Quality Bar
- every sprite follows the naming convention and lives in the correct folder
- import settings are applied consistently — no manual per-asset overrides
- atlas packing does not exceed platform memory budget
- pivot points and slice boundaries are correct for gameplay use

## Common Failure Modes
- inconsistent naming that breaks asset lookup at runtime
- oversized sprites that waste atlas space or exceed texture memory
- missing padding between atlas entries causing bleed artifacts
- pivot points that cause visual offset during gameplay

## Related Agents
- 2d-artist
- technical-artist
- performance-reviewer

## Related Commands
- art-2d-pass
- unity-placeholders
- perf-budget

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
