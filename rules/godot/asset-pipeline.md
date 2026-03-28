# godot/asset-pipeline

Extends `../common/asset-pipeline.md` with Godot-specific content.

## Import Rules
- Import settings, compression, texture flags, audio load behavior, mesh import options, and resource setup are part of the source of truth.
- Asset naming and folder conventions must support searchability, ownership, and safe refactoring.
- High-cost asset categories require documented import expectations and validation.

## Content Types
- Textures, materials, meshes, animations, audio, particles, fonts, and UI assets need category-specific strategy.
- Do not apply one generic import profile to all assets.

## Validation
- Catch broken resource references, oversized imports, unsupported formats, and incorrect import options as early as possible.
- High-risk assets should be reviewed in representative gameplay context, not only in isolated previews.

## Done Criteria
The Godot asset pipeline is healthy when import behavior is intentional, repeatable, and aligned with runtime budgets.
