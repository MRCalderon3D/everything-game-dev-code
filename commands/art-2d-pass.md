---
description: Review 2D art assets for naming, resolution, atlas config, animation, tilemap rules, and placeholder readiness.
---

# /art-2d-pass

## Purpose
Review the project's 2D art assets — sprites, tilemaps, animations, and placeholders — against the art bible and pipeline conventions. Produces a structured report with issues, warnings, and recommendations.

## Use When
- New 2D art assets have been added and need validation before merge.
- Placeholder assets are being replaced with final art and drop-in compatibility must be verified.
- A milestone review requires confirmation that all 2D assets meet quality bar.
- The art pipeline conventions have changed and existing assets need re-validation.

## Invokes Agents
- 2d-artist
- technical-artist

## Required Skills
- sprite-pipeline
- tilemap-pipeline
- 2d-animation-pipeline
- placeholder-asset-pipeline
- art-bible

## Expected Output
- A structured review report covering:
  - sprite naming, resolution, and atlas compliance
  - tileset completeness and auto-tile rule correctness
  - animation frame rate, state machine, and memory validation
  - placeholder-to-final replacement readiness
- Clear pass/fail per category with actionable fix recommendations.
- Escalation notes for issues that affect performance budgets or gameplay.

## Notes
- This command is engine-neutral. For engine-specific import settings, defer to the relevant engine reviewer.
- Run after `/unity-placeholders` or equivalent to verify placeholder quality before gameplay testing.
- Escalate to `performance-reviewer` when atlas size or animation memory exceeds platform budgets.
