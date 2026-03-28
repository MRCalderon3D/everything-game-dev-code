# unity/asset-pipeline

Extends `../common/asset-pipeline.md` with Unity-specific content.

## Import Rules
- Import settings are part of the source of truth.
- Use presets, postprocessors, or validation tooling when repeated manual configuration would drift.
- Platform overrides must be intentional and documented for high-cost asset types.

## Content Types
- Textures, models, audio, sprites, animation, VFX, and fonts need category-specific import strategy.
- Do not apply one generic import profile to all assets.

## Validation
- Catch missing references, oversized imports, incorrect presets, and unsupported formats as early as possible.
- High-risk assets should be reviewable in representative gameplay contexts, not only in isolation.

## Done Criteria
The Unity asset pipeline is healthy when import behavior is intentional, repeatable, and aligned with runtime budgets.
