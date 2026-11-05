# Web Canvas Rendering

## Purpose
Define rendering rules for canvas 2D and WebGL based browser games.

## Scope
Applies to context choice, resolution and DPI handling, layering, draw batching, and pixel-art presentation.

## Context Rules
- Choose canvas 2D or WebGL deliberately based on draw volume, effects, and team familiarity; document the choice.
- This rule covers 2D presentation; real-time 3D games follow `rules/web/rendering-3d.md` instead.
- For pixel art, disable image smoothing, set the image-rendering style appropriately, and scale by integer factors.
- Handle devicePixelRatio explicitly so backing-store resolution matches display density without blurring.

## Draw Rules
- Separate world, effects, and UI layers; redraw only the layers that changed when it measurably pays off.
- Batch draws by texture or atlas to reduce state changes and draw calls.
- Keep render code free of simulation side effects; rendering reads state, it does not mutate it.

## Done Criteria
Rendering is healthy when the context choice is justified, output is crisp across displays, and draw cost is measurable.
