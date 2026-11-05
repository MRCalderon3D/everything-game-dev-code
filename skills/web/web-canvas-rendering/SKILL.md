---
name: web-canvas-rendering
description: Apply canvas 2D and WebGL rendering conventions for crisp scaling, clean layering, and batched draws.
origin: everything-game-dev-code
category: web
---

# Web Canvas Rendering

## Purpose
Apply canvas 2D and WebGL rendering conventions for crisp scaling, clean layering, and batched draws.

## Use When
- setting up rendering for a new browser game
- art looks blurry, shimmery, or inconsistently scaled across devices
- draw time dominates the frame and needs batching or layering work

## Inputs
- art style (pixel art or high-resolution) and reference resolution
- renderer choice (canvas 2D, WebGL, or a framework renderer)
- sprite and atlas inventory
- target devices and display pixel ratios

## Process
1. choose the renderer deliberately: canvas 2D for modest sprite counts and simplicity, WebGL (directly or via a framework) when draw volume or effects demand it
2. size the backing store from the device pixel ratio and scale to CSS pixels, so output is sharp on high-density displays
3. for pixel art, disable image smoothing, scale by integer factors where possible, and keep camera and sprite positions snapped to whole texture pixels
4. define a fixed internal resolution with letterboxing or safe-area extension for mismatched aspect ratios, and document the scaling policy
5. pack sprites into texture atlases and order draws by layer and atlas so state changes and overdraw stay low; use separate canvases or render layers only for content that updates at different rates

## Outputs
- renderer decision and scaling policy
- device-pixel-ratio and resize handling notes
- layer and draw-order map
- atlas packing conventions

## Quality Bar
- output is crisp at every device pixel ratio; nothing is implicitly stretched by CSS
- pixel art shows no smoothing blur, half-pixel shimmer, or atlas-edge bleeding during camera movement
- aspect-ratio mismatch is handled by a declared policy (letterbox, extend, or crop), never by distortion
- frequently drawn sprites share atlases, and per-frame canvas state changes (transforms, blend modes, fills) are minimized
- static or slow-changing layers are not repainted every frame

## Common Failure Modes
- a canvas sized in CSS pixels only, rendering blurry on high-density screens
- fractional camera or sprite positions making pixel art shimmer in motion
- sampling neighboring atlas frames at scaled sizes because frames were packed without padding or extrusion
- hundreds of individual image draws with interleaved state changes where one atlas and sorted batches would do
- full-screen clears and redraws of backgrounds that never change

## Related Agents
- 2d-artist
- ui-programmer
- performance-reviewer
- web-reviewer

## Related Commands
- web-review
- art-2d-pass
- perf-budget

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Framework renderers batch automatically when atlases and layers are set up correctly; the conventions here describe what to feed them, not a replacement for them.
