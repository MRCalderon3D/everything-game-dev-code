---
name: blender-environment-pipeline
description: Build a level environment procedurally in Blender (live through the BlenderMCP add-on), organised in gameplay layers, optimised and exported for engine assembly.
origin: everything-game-dev-code
category: art-audio-content
---

# Blender Environment Pipeline

## Purpose
Build a level environment procedurally in Blender (live through the BlenderMCP add-on), organised in gameplay layers, optimised, visually verified against its reference, and exported for engine assembly. The result is reproducible from a script, not from a hand-edited `.blend`.

## Use When
- a level or set piece must be built in 3D from 2D art, concept images or owner photos
- an environment needs realistic surfacing (Poly Haven CC0 textures/HDRIs) without a full modelling team
- a previous environment needs a reproducible rebuild after design feedback

## Inputs
- reference images for every visible area (exterior, interiors, signage); ask for any that are missing
- camera and genre (e.g. side-scrolling beat'em up with a fixed side view), walkable area, travel direction
- gameplay contract: breakable props, doors and gates, finish area, decal slots
- polygon/texture budgets per layer (from the TDD or `/perf-budget`)
- the setting's culture, era and materials (what the place is actually built from)

## Process
1. **Connect.** Blender with the BlenderMCP add-on server started (N panel → BlenderMCP, Poly Haven enabled, port 9876). If the harness `blender` MCP server cannot be installed (e.g. the network blocks `files.pythonhosted.org`), drive the add-on directly with `scripts/blender-bridge.py` (`info`, `run <script.py>`, `cmd <type> <json>`). It needs only the standard library.
2. **Plan the layers before modelling.**
   - **A, playable:** real 3D with collisions and walkable surfaces.
   - **B, midground:** low-cost meshes or cards at real depth.
   - **C, backdrop:** a rendered matte card for distant content, with alpha so the engine sky shows through.
   Put interiors in their own collection, and the camera-facing wall of any enterable building in a cutaway collection. Make each destructible a separate object.
3. **Lay out for gameplay.** Entrances and stairs face the player's arrival and land on the walkable surface. Pillars and furniture leave the combat space readable. Size everything in real metres.
4. **Write the build script.** One `build_scene.py` (plus focused modules, e.g. `dojo.py`) that clears and rebuilds everything: helpers for boxes, cylinders and foliage; world-space or per-face UVs; collections. Build in final world coordinates: avoid build-then-rotate hacks that hide unbuilt faces.
5. **Surface it truthfully.** Pick Poly Haven textures for the real materials of the setting (download them in the session first). For colour variation that must survive export, use 3-step discrete material sets assigned per mesh island, not node graphs. Use per-slope UVs for roofs, per-face triplanar UVs for boards and planks, and real-scale tiling.
6. **Make geometry clean and solid.** Triangle fans instead of large n-gons (solidify turns n-gons into self-intersecting polygons). Give props thickness and closed bases. Merge static meshes per material to keep draw calls low.
7. **Optimise while authoring.** Mesh detail only near the camera (e.g. the first rows of a forest); move the rest into the layer C render. Use fewer, larger foliage cards. Report polygon counts per collection after every build and compare them with the budget.
8. **Verify visually after every step.** Render from the gameplay camera, a close-up of each set piece and an interior cutaway, and compare with the reference. Fix before reporting. Known traps: EEVEE world volumes can black out the frame; untextured materials render white.
9. **Export.** One FBX per collection (`apply_scale_options=FBX_SCALE_UNITS`, `axis_forward=-Z`, `axis_up=Y`, `bake_space_transform=True`). Recentre destructible pivots to their base before exporting. Save the textures used next to the exports, because add-on images are packed and FBX `path_mode=COPY` does not copy them. Render the backdrop card with `film_transparent`.
10. **Decals and signs.** Generate them as textures: derive from the owner's reference photo when given (paint = darker than its local background, keeping stroke texture and drips), and render text with a font that has the required glyphs (e.g. Yu Gothic for kanji).
11. **Commit** the scripts, exports (via LFS), reference renders and decals, one step per commit. Record the layer contract for the engine skill.

## Outputs
- `build_scene.py` (+ modules), `export_*.py`, `save_textures.py`, decal scripts
- one FBX per collection, textures, transparent backdrop render, decal textures
- reference renders (gameplay camera, close-ups, interior cutaway)
- layer contract: collection names, destructible objects, walkable meshes, cutaway wall, decal slots, polygon counts

## Quality Bar
- the scene rebuilds from scripts with one command, and exports import with zero per-asset fixes
- materials and construction match the setting (no anachronistic or foreign materials)
- the layout respects the camera and genre: reachable entrances, readable combat space, nothing busy behind fighters
- polygon budgets met per layer; every destructible is a separate object with a base pivot; no n-gons on props
- reviewed against the reference from the gameplay camera before handing over

## Common Failure Modes
- inventing materials or details the reference contradicts (brick or slate in a timber building)
- one texture mapped across a whole multi-plane object (roof tiles running the wrong way on some slopes)
- layout that ignores the camera: entrances facing the camera in a side-scroller, pillars blocking the doorway
- rotating a finished building into place and exposing faces that were never built
- procedural shader variation that disappears on FBX export
- a dense mesh forest everywhere instead of a near band plus a rendered backdrop
- reporting without rendering: issues found by the owner that one review render would have shown

## Related Agents
- 3d-environment-artist
- technical-artist
- level-designer
- performance-reviewer

## Related Commands
- environment-build
- art-3d-pass
- perf-budget

## Related Skills
- 3d-asset-pipeline
- materials-shading-pipeline
- lighting-lod-pipeline
- generated-raster-asset-pipeline
- unity-environment-assembly

## Notes
- Engine-neutral authoring. Engine import and scene assembly are covered by the engine skill (`unity-environment-assembly` for Unity).
- Keep the build scripts in the game project (e.g. `Tools/Blender/<level>/`) so environments evolve with the code that uses them.
- Poly Haven assets are CC0; record which ones a level uses in the build script docstring.
