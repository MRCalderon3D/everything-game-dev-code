# Web Asset Pipeline

## Purpose
Define how browser games load, organize, and validate textures, audio, fonts, and data assets.

## Scope
Applies to preloading, texture atlases, asset naming, generated-asset acceptance, and loading states.

## Loading Rules
- Preload critical assets before gameplay starts and show an explicit loading state with failure handling.
- Pack sprites into texture atlases for batched drawing; avoid many small image requests.
- Defer non-critical assets behind explicit progress reporting or background loading strategies.

## Acceptance Rules
- Asset naming and folder conventions must support searchability, ownership, and safe refactoring.
- Generated raster assets follow the shared validation flow: declared background policy, intended display size, real alpha, and gameplay envelope before acceptance.
- Catch broken paths, oversized files, and unsupported formats early; verify assets in gameplay context, not only in isolated previews.

## Done Criteria
The web asset pipeline is healthy when loading is intentional, repeatable, and aligned with runtime budgets.
