---
description: Build a 3D level environment from references in Blender, export it in gameplay layers, and assemble it into the engine as a playable, verified level.
---

# /environment-build

## Purpose
Build a 3D level environment from design references (2D level art, concept images, owner photos) procedurally in Blender, export it in gameplay layers, and assemble it in the engine as a playable, optimised, verified level.

## Use When
- a level, set piece or building must be created in 3D (not only reviewed)
- an existing environment must be rebuilt after design or owner feedback
- 2D levels are being ported to 3D with realistic layered backgrounds

## Invokes Agents
- 3d-environment-artist
- technical-artist
- level-designer
- performance-reviewer

## Required Skills
- blender-environment-pipeline
- 3d-asset-pipeline
- materials-shading-pipeline
- lighting-lod-pipeline
- unity-environment-assembly

Select only the engine assembly skill that matches the active engine profile (today: `unity-environment-assembly` for Unity).

## Expected Output
- a layer plan (playable / destructibles / midground / interior / cutaway / backdrop) agreed before modelling
- reproducible Blender build and export scripts, committed with the project
- exported assets per layer, a transparent backdrop render, decal textures, and reference renders from the gameplay camera
- the engine scene assembled by an editor builder via the engine skill (`unity-environment-assembly` for Unity), with gameplay wiring
- a polygon and texture budget report per layer, and an updated project plan with the next steps

## Notes
- Authoring is engine-neutral. Engine assembly uses the engine-specific skill for the active profile.
- Ask for missing references (interiors, materials, entrances) before building them. Use owner-provided images directly where possible.
- Review renders after every significant step. Do not hand over work that has not been compared with its reference.
- Hand performance concerns to `performance-reviewer` and layout or gameplay conflicts to `level-designer`.
