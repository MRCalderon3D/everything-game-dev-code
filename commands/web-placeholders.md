---
description: Generate placeholder sprites, 3D primitives, and audio stubs for a web (HTML5) game so it is visually testable before final assets exist.
---

# /web-placeholders

## Purpose
Generate a build-time script or runtime module that creates placeholder assets — canvas-drawn
sprites and procedurally synthesized audio — so the game can be run and tested visually and
audibly before any final art or audio is produced.

## Use When
- Core gameplay systems are implemented but no real assets exist yet.
- You need a runnable game loop to observe and test before artists deliver assets.
- You want a clean asset structure that final assets can drop into without code changes.

## Invokes Agents
- web-reviewer
- architect

## Required Skills
- web-project-structure
- placeholder-asset-pipeline

## Expected Output
- A Node script (preferred, writes real files) or a runtime placeholder module that generates assets on load
- Placeholder sprites for each game entity drawn with the Canvas 2D API and exported as `.png` files (build-time) or data URLs (runtime)
- An asset manifest mapping entity names to placeholder paths, matching the paths final assets will use
- For 3D projects, placeholder meshes built from the chosen 3D stack's primitive geometries (box, sphere, capsule, plane) with flat-color materials, exposed through the same manifest entries the final glTF assets will use
- Procedurally generated sound effects via the Web Audio API (OscillatorNode or synthesized `AudioBuffer` data — sine waves, noise, pitch sweeps, not silent stubs), exported as `.wav` files when generated at build time
- Instructions to run the generator and remove or disable it once final assets land

## Notes
- Placeholder assets must match the folder structure defined by `/web-setup`.
- Sprite dimensions should match the intended gameplay scale so collision and layout work correctly.
- All placeholder files must have the same name and path as the final assets will use — this allows final assets to be dropped in without any code changes.
- Prefer build-time generation: it keeps the runtime loading path identical to production. Use a runtime module only when the project has no build step.
- Audio placeholders are synthesized in code; no external audio tools or APIs are needed.
- 3D primitive placeholders follow `rules/web/rendering-3d.md`: correct gameplay scale, one shared flat-color material per entity category, and disposal ownership like any other GPU resource.
- Escalate to `web-reviewer` if the project structure is not yet initialized.
