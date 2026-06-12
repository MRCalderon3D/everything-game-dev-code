---
name: materials-shading-pipeline
description: Define material libraries, PBR texture conventions, and shader budgets so surfacing stays consistent and batchable.
origin: everything-game-dev-code
category: art-audio-content
---

# Materials and Shading Pipeline

## Purpose
Define material libraries, PBR texture conventions, and shader budgets so surfacing stays consistent, batchable, and within performance budgets.

## Use When
- 3D assets need surfacing and no material convention exists
- material or shader counts grow per asset instead of per library
- visual inconsistency or draw-call costs trace back to ad hoc materials

## Inputs
- art direction (stylized vs realistic, palette, roughness language)
- target runtime's material/shader model and instancing support
- texture budgets per platform (resolution, compression, memory)
- asset categories and their reuse expectations

## Process
1. build a material library: a small set of master materials/shaders with instances (or parameter variants) per use, instead of unique materials per asset
2. define the PBR texture set and channel packing convention (e.g. base color, normal, and a packed ORM map), naming, and resolution tiers per asset category
3. set texture authoring rules: texel density targets, atlas/trim-sheet usage for modular kits and props, and palette/gradient atlases where the style allows
4. budget shader complexity and material count per scene; treat every new master shader as a reviewed decision, not a per-asset convenience
5. define color-space rules (sRGB for color maps, linear for data maps) and compression settings per map type and platform
6. validate batching in the runtime: shared materials must actually batch/instance, and material count per scene stays within budget

## Outputs
- master material/shader catalog with instancing rules
- texture set, channel packing, naming, and resolution-tier conventions
- texel density and atlas/trim-sheet guidance
- per-scene material/shader budgets and validation checklist

## Quality Bar
- assets are surfaced from the library — new master materials are rare, reviewed events
- texture sets follow the packing/naming convention and import with correct color spaces
- repeated assets share materials and demonstrably batch or instance in the runtime
- texture memory and material counts stay within scene budgets on the weakest target

## Common Failure Modes
- one unique material per asset, so draw calls scale with asset count and nothing batches
- normal maps imported as sRGB or data maps compressed as color, silently breaking shading
- texel density chosen per asset, making surfaces look mixed-resolution side by side
- shader variants exploding because every feature toggle was added to one master shader

## Related Agents
- technical-artist
- performance-reviewer

## Related Commands
- art-3d-pass
- perf-budget
- memory-budget

## Related Skills
- 3d-asset-pipeline
- lighting-lod-pipeline
- technical-art-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns surfacing conventions; `technical-art-pipeline` owns the broader tech-art tooling; `lighting-lod-pipeline` owns how surfaces are lit.
