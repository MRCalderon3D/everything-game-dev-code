---
name: 3d-asset-pipeline
description: Define export, scale, pivot, and naming rules for 3D assets so every model imports correctly without per-asset fixes.
origin: everything-game-dev-code
category: art-audio-content
---

# 3D Asset Pipeline

## Purpose
Define export, scale, pivot, and naming rules for 3D assets so every model imports correctly without per-asset fixes.

## Use When
- the project ships 3D models and no export/import convention exists yet
- imported models need manual scale, rotation, or pivot fixes per asset
- multiple artists or DCC tools feed the same project and outputs diverge

## Inputs
- DCC tools in use (Blender, Maya, etc.) and target engine or runtime
- interchange format decision (glTF/GLB preferred for web and Godot, FBX where the engine pipeline expects it)
- unit scale and axis conventions of the target
- entity inventory with intended gameplay sizes

## Process
1. fix the unit scale (meters per unit) and axis convention once, configure every DCC export preset to match, and document them where artists and programmers both see them
2. define pivot/origin rules per asset category: characters at feet, props at base or grip, modular pieces at a snapping corner — chosen for placement, not authoring convenience
3. standardize naming and folder structure per category (characters, props, environment, modular kits) consistent with the art bible
4. define the export preset per format: applied transforms, triangulation, smoothing/normals, tangents, and which channels (UVs, vertex colors) are required
5. budget polycount and texture resolution per asset category against the weakest target platform
6. validate on import, not on complaint: a checklist (scale probe, orientation, pivot, naming, polycount) every new asset passes before integration
7. keep source files (.blend, .ma) in source control or a documented store, separate from exported runtime assets

## Outputs
- unit/axis/pivot convention sheet
- export presets per DCC tool and format
- naming and folder convention per asset category
- polycount/texture budgets and the import validation checklist

## Quality Bar
- any new model imports at correct size and orientation with zero per-asset fixes in engine or code
- pivots support placement and snapping without runtime offsets
- every asset passes the import checklist before it reaches a scene
- source art and exported runtime assets never mix in one folder

## Common Failure Modes
- per-asset magic scale factors scattered through scenes or code because exports never matched the unit convention
- pivots at world origin or authoring position, forcing offset parents everywhere
- mixed normals/tangent settings causing lighting seams between assets
- runtime folders polluted with source files, making it unclear what ships

## Related Agents
- technical-artist
- level-designer
- performance-reviewer

## Related Commands
- art-3d-pass
- perf-budget
- verify

## Related Skills
- materials-shading-pipeline
- asset-management
- art-bible

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns geometry/export conventions; `materials-shading-pipeline` owns surfacing; `rigging-skinning-pipeline` owns deformation.
