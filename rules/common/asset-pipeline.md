# Asset Pipeline

## Purpose
Define shared rules for creating, naming, importing, validating, versioning, and shipping content assets across art, audio, UI, animation, VFX, and narrative pipelines.

## Scope
These rules are engine-neutral. Engine-specific importer settings and folder conventions belong in engine packs.

## Source of Truth
- Raw source files must be preserved outside the exported runtime asset whenever practical.
- Ownership of each asset class must be clear: concept, source, export, runtime, and final integration.
- Asset metadata must identify owner, status, version, and intended usage.

## Naming Rules
- Names must be descriptive, stable, and searchable.
- Use consistent prefixes or category markers only when they improve scale and discoverability.
- Avoid ambiguous names such as `final`, `new`, `temp`, or `fixed`.
- Renames must consider references, automation, and build impact.

## Structure Rules
- Separate source assets, exported runtime assets, prototypes, third-party assets, and deprecated content.
- Keep reusable assets distinct from feature-specific or one-off assets.
- Avoid duplicate assets that differ only by path or naming drift.
- Archive or deprecate unused assets explicitly rather than leaving them as implicit clutter.

## Import and Validation Rules
- Import settings must be intentional and documented for each asset category.
- Runtime cost must be evaluated for textures, audio, meshes, animation, VFX, and fonts.
- Compression choices must balance quality, platform limits, memory budgets, and iteration cost.
- Assets with gameplay impact must be validated in representative gameplay contexts, not only isolated previews.
- Generated raster assets must declare background policy, intended runtime display size, and gameplay body envelope before acceptance.
- Transparent generated assets must be checked for real alpha; baked checkerboard or mock-transparency backgrounds are invalid runtime content.
- Source image dimensions must not be treated as gameplay size by default; display size and collision size are separate integration contracts.

## Performance Rules
- Every asset class must have platform-aware memory and runtime budgets.
- Large assets require explicit justification and budget owner sign-off.
- Reuse, atlasing, streaming, LODs, instancing, and pooling strategies should be planned, not retrofitted.

## Dependency Rules
- Assets with shared dependencies must declare those dependencies where breakage risk is high.
- Avoid hidden coupling between gameplay logic and content naming or directory paths.
- Replacing a shared asset must trigger impact review for all known consumers.

## Third-Party Content Rules
- Third-party assets must track license, source, version, modification status, and allowed usage.
- Vendor content must be wrapped or documented so it can be upgraded or replaced safely.
- Never commit content with unclear ownership or usage rights.

## Review Rules
- Art, audio, UI, and animation integration should be reviewed in target gameplay context.
- Asset reviews must consider readability, style fit, technical cost, and reuse potential.
- Temporary assets must be tagged with replacement expectations and milestone deadlines.

## Build Rules
- Build pipelines should fail on missing references, unsupported formats, or invalid metadata where feasible.
- Shipping builds must exclude test-only, deprecated, or unlicensed content.

## Deliverables
- Asset taxonomy and folder map.
- Naming standard.
- Import setting reference by asset class.
- Budget sheet for major asset categories.
- Third-party asset register.

## Done Criteria
An asset pipeline is production-ready when assets are traceable, budgeted, validated, and safe to move through build and release without manual guesswork.
