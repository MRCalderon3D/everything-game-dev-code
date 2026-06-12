---
description: Review 3D art assets for export conventions, rigs, animation clips, materials, lighting, and LOD compliance.
---

# /art-3d-pass

## Purpose
Review the project's 3D art assets — models, rigs, animation clips, materials, and lighting/LOD setup — against the art bible and pipeline conventions. Produces a structured report with issues, warnings, and recommendations.

## Use When
- New 3D assets have been added and need validation before merge.
- Placeholder 3D primitives are being replaced with final models and drop-in compatibility must be verified.
- A milestone review requires confirmation that 3D assets meet the quality bar.
- Frame or memory budgets point at geometry, materials, lights, or LODs.

## Invokes Agents
- technical-artist
- animation-programmer
- performance-reviewer

## Required Skills
- 3d-asset-pipeline
- rigging-skinning-pipeline
- 3d-animation-pipeline
- materials-shading-pipeline
- lighting-lod-pipeline
- placeholder-asset-pipeline
- art-bible

## Expected Output
- A structured review report covering:
  - import correctness: scale, orientation, pivots, naming, and polycount budgets
  - rig compliance: skeleton conventions, bone/influence budgets, deformation quality
  - animation clips: naming, root motion policy, loops/blends, compression artifacts
  - materials: library usage, texture packing/color spaces, batching verification
  - lighting and LODs: budget compliance, switch distances, culling behavior
  - placeholder-to-final replacement readiness
- Clear pass/fail per category with actionable fix recommendations.
- Escalation notes for issues that affect performance budgets or gameplay.

## Notes
- This command is engine-neutral. For engine-specific import or render pipeline settings, defer to the relevant engine reviewer.
- Run after the engine's placeholder command to verify 3D placeholder quality before gameplay testing.
- Escalate to `performance-reviewer` when triangle counts, material counts, or light budgets exceed platform targets.
