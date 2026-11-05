# Web 3D Rendering

## Purpose
Define rendering rules for real-time 3D browser games built on WebGL or WebGPU.

## Scope
Applies to renderer and framework choice, scene graph ownership, cameras, lighting, 3D asset formats, GPU budgets, and resource disposal.

## Renderer Rules
- Choose the 3D stack deliberately — a scene-graph framework (for example Three.js or Babylon.js) or raw WebGL2 — based on team familiarity, feature needs, and bundle budget; document the choice.
- Treat WebGPU as a progressive enhancement: target WebGL2 as the baseline and adopt WebGPU only behind capability detection.
- Cap devicePixelRatio (typically at 2) and render at a deliberate resolution; full-density rendering on high-DPI mobile screens is a common silent frame-budget killer.
- Configure color management and tone mapping explicitly at project start; changing them later repaints every asset.

## Scene Rules
- Give the scene graph one owner per screen or level: creation, mutation, and teardown go through it rather than ad hoc additions from gameplay code.
- Define camera conventions once — projection, field of view, near/far planes, and the unit scale they assume — and keep gameplay distances consistent with them.
- Budget lights explicitly; dynamic lights and shadow-casting lights are per-frame costs, and baked or faked lighting is the default for anything static.
- Keep render code free of simulation side effects; rendering reads state, it does not mutate it.

## Asset Rules
- Use glTF (.glb) as the runtime 3D asset format; apply mesh and texture compression (for example Draco or Meshopt, and KTX2/basis textures) when size or decode time becomes measurable.
- Define unit scale and axis conventions for exported assets so every model imports at the right size and orientation without per-asset fixes.
- Budget triangles, draw calls, and texture memory per scene against the weakest target device; instancing is the first answer to many repeated meshes.

## Disposal Rules
- Geometries, materials, textures, and render targets allocate GPU memory that the garbage collector does not reclaim; every created resource needs a disposal owner.
- Scene or level teardown must dispose GPU resources it owns and verify, via renderer statistics, that repeated scene cycles do not grow GPU memory.

## Done Criteria
3D rendering is healthy when the stack choice is documented, scene ownership and camera conventions are explicit, GPU budgets are measurable on the weakest target, and repeated scene cycles hold GPU memory flat.
