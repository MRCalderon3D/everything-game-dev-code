---
name: lighting-lod-pipeline
description: Define lighting policy, light budgets, LOD chains, and culling rules so 3D scenes look intentional and hit frame budgets.
origin: everything-game-dev-code
category: art-audio-content
---

# Lighting and LOD Pipeline

## Purpose
Define lighting policy, light budgets, LOD chains, and culling rules so 3D scenes look intentional and hit frame budgets on the weakest target.

## Use When
- 3D scenes need a lighting approach and nothing is decided beyond defaults
- frame cost traces to lights, shadows, or geometry density at distance
- environments grow and need LODs, culling, and draw-distance policy

## Inputs
- art direction for mood, time-of-day needs, and dynamism (static vs day cycle)
- target platforms and their lighting capabilities (baking, shadow budgets)
- scene inventory: interiors/exteriors, scale, density
- frame budget allocation for lighting and geometry

## Process
1. decide the lighting policy explicitly: what is baked (or faked with blob shadows/light textures), what is dynamic, and which single light owns real-time shadows in a typical scene
2. budget lights per scene category: dynamic light count, shadow-casting count, and shadow resolution against the weakest target
3. define the ambient/indirect strategy (baked GI, probes, flat ambient plus tuned materials) consistent with the art direction
4. define LOD chains per asset category: reduction targets per level, switch distances tied to on-screen size, and whether the last level is an impostor or culled
5. set culling and draw-distance policy: occlusion strategy for interiors, distance culling tiers for props and detail layers
6. validate on target: light/shadow cost and LOD transitions measured on the weakest device, with popping checked at gameplay camera speeds

## Outputs
- lighting policy sheet (baked/dynamic split, shadow ownership, ambient strategy)
- per-scene light and shadow budgets
- LOD chain conventions per asset category with switch-distance rules
- culling/draw-distance policy and the on-target validation checklist

## Quality Bar
- every scene states which lights are dynamic and which cast shadows — defaults are decisions, not accidents
- lighting cost is measured within its frame-budget allocation on the weakest target
- LOD switches are not visible at normal gameplay camera distance and speed
- distant or occluded content is demonstrably culled, not just unlit

## Common Failure Modes
- every light dynamic and shadow-casting because that was the default when it was placed
- LODs authored once at arbitrary reductions and never tuned to on-screen size, popping constantly
- ambient handled by cranking material emissive or fog until baked and dynamic objects no longer match
- interiors paying for the whole exterior because no occlusion or portal strategy was decided

## Related Agents
- technical-artist
- level-designer
- performance-reviewer

## Related Commands
- art-3d-pass
- perf-budget
- level-beat

## Related Skills
- materials-shading-pipeline
- 3d-asset-pipeline
- vfx-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns lighting/LOD policy for content; engine-specific render pipeline settings (e.g. URP/HDRP configuration) belong to the engine layer.
