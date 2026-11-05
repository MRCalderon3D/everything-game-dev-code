---
name: web-3d-rendering
description: Build real-time 3D scenes for browser games — scene/camera/light setup, glTF pipeline, GPU budgets, and disposal discipline.
origin: everything-game-dev-code
category: web
---

# Web 3D Rendering

## Purpose
Build real-time 3D scenes for browser games — scene/camera/light setup, glTF pipeline, GPU budgets, and disposal discipline.

## Use When
- starting or reviewing a 3D browser game (Three.js, Babylon.js, or raw WebGL2)
- a 2D canvas project is moving to 3D and rendering conventions need definition
- frame time, GPU memory, or load time problems trace back to the 3D scene

## Inputs
- chosen 3D stack and target browsers/devices (weakest device defines budgets)
- camera and unit-scale conventions, or the need to define them
- 3D asset inventory and export pipeline (DCC tool, formats)
- scene/screen flow so teardown boundaries are known

## Process
1. wrap the renderer, scene, camera, and resize handling in one rendering module; gameplay code talks to a scene API, never to the framework's globals
2. integrate with the game loop: simulation updates on the fixed timestep, rendering interpolates and draws once per animation frame; cap devicePixelRatio and resize the drawing buffer explicitly
3. define camera and unit conventions once (projection, FOV, near/far, meters-per-unit) and document them where asset exporters and gameplay code both see them
4. load models through one glTF pipeline: a loader wrapper that applies compression decoders (Draco/Meshopt, KTX2 textures when adopted), normalizes scale/orientation, and hands ownership to the scene owner
5. light deliberately: prefer baked or faked lighting for static content, budget dynamic and shadow-casting lights per scene, and configure tone mapping and color space at project start
6. keep GPU cost visible: track draw calls, triangles, and texture memory via renderer statistics; use instancing for repeated meshes and share materials/geometries instead of cloning them per entity
7. give every geometry, material, texture, and render target a disposal owner; scene teardown disposes what it owns, and a repeated enter/leave cycle is verified flat using renderer memory stats

## Outputs
- rendering module design (renderer/scene/camera ownership, resize and DPR policy)
- camera and unit-scale convention notes
- glTF loading pipeline design with compression decisions
- per-scene GPU budgets (draw calls, triangles, texture memory, lights) and disposal checklist

## Quality Bar
- gameplay code never touches the rendering framework directly outside the rendering module
- the simulation runs on the fixed timestep and rendering never mutates game state
- every model enters through the glTF pipeline at correct scale and orientation without per-asset hacks
- draw calls, triangles, and GPU memory are measurable and within the budgets set for the weakest target device
- repeated scene enter/leave cycles hold GPU memory flat (verified with renderer statistics, not assumed)

## Common Failure Modes
- creating framework objects (materials, vectors, geometries) inside the frame loop, causing GC and GPU churn
- uncapped devicePixelRatio rendering at native density on mobile, silently consuming the frame budget
- per-entity cloned materials breaking batching, so draw calls scale with entity count
- disposing nothing on scene change because "the garbage collector handles it" — GPU memory grows until the tab dies
- mixing units and axes per asset, so every import needs a magic scale factor somewhere in gameplay code

## Related Agents
- web-reviewer
- gameplay-programmer
- performance-reviewer

## Related Commands
- web-review
- web-scene-audit
- perf-budget

## Related Skills
- web-canvas-rendering
- web-performance
- web-game-architecture

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- `rules/web/rendering-3d.md` is the policy this skill implements; `web-canvas-rendering` remains the right skill for 2D canvas projects.
