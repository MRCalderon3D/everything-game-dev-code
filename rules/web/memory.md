# Web Memory

## Purpose
Define memory management rules for browser games across assets, listeners, and scene lifecycles.

## Scope
Applies to asset lifetime, texture memory, event listeners, timers, and teardown audits.

## Asset Lifetime Rules
- Define ownership for loaded images, audio buffers, atlases, and long-lived caches.
- Track texture memory deliberately; decoded images and WebGL textures consume far more than file size suggests.
- GPU resources (geometries, materials, textures, render targets) are not garbage collected; each needs a disposal owner, and scene teardown must dispose what it owns.
- Release or drop references to large assets when scenes no longer need them.

## Leak Rules
- Event listeners, intervals, timeouts, and animation-frame callbacks must be removed by their owner on teardown.
- Avoid accidental retention through closures, module-level caches, and detached DOM nodes.
- Audit scene teardown with devtools heap snapshots; repeated scene cycles must not grow memory.

## Done Criteria
Web memory management is healthy when ownership is explicit, teardown is audited, and repeated play sessions stay flat.
