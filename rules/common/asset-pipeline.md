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

## AI-Generated Asset Rules
- AI generation is an OPTIONAL capability, never a dependency. It is gated on the active provider's API key existing in the environment (`apiKeyEnv`, e.g. `FAL_KEY`). When no key is present, the asset workflow falls back to the scaffold's built-in tooling — the engine placeholder commands and the procedural/Canvas/WebAudio pipelines (`placeholder-asset-pipeline`) — and behaves exactly as it did before this capability existed. A project built entirely on placeholders is valid; generation is an enhancement.
- Never fabricate, hand-place, or substitute assets to stand in for an unavailable API. The fallback is the placeholder pipeline, not improvised content.
- **Resolution order per capability.** For image-shaped capabilities (`image`, `skybox` — see `nativeFirstCapabilities` in the registry), prefer a harness-native image generator (e.g. Codex `$imagegen`) when the running harness exposes one, because it is free and needs no external key; then the paid API provider if a key is set; then procedural placeholders. For non-image capabilities (`model3d`, `sfx`, `music`, `speech`, `video`) there is no harness-native path — only the API provider or placeholders. This harness (Claude Code) has no built-in image generator, so its order is API-then-placeholder.
- **Confirm before spending.** API generation costs real money and sends prompts to an external service. A directly invoked generation command is consent for that command's described scope, but autonomous or multi-asset flows (e.g. `/full-game`) must not spend by default: keep placeholders as the default and ask once, with an estimate, before generating. The generator (`scripts/generate-assets.js`) enforces a cost gate — runs at or above `confirmOverUsd` (registry default, overridable via `--confirm-over` / `ASSET_GEN_CONFIRM_OVER`) refuse to start without explicit acknowledgement (`--yes`, or `ASSET_GEN_YES=1` to pre-authorize). Surface the printed estimate to the user before confirming.
- **Quality vs price is the user's dial.** Each capability defines three tiers in the registry (`byQuality`: `budget` / `balanced` / `premium`) selected with `--quality` (or `ASSET_GEN_QUALITY`, or the registry `defaultQuality`). Before a generation batch, ask the user once which tier they want — cheaper models, balanced, or top quality — and pass `--quality` accordingly; default to `balanced` if they do not answer. The cost gate is the guardrail (it prevents overspend); the quality tier is the lever (it sets how much you spend). An explicit `--model` overrides the tier.
- Generation must go through the provider registry (`manifests/asset-providers.json`); model ids must not be hardcoded in project code or docs.
- Generation is engine-neutral: outputs land in neutral formats (PNG, GLB, MP3/WAV, MP4) in a staging area, and engine import follows the active engine layer only.
- Every generated file must keep a provenance record (provider, model, prompt, seed, request id, timestamp) — an asset without provenance is treated as unlicensed third-party content.
- Provider API keys live only in environment variables (the registry's `apiKeyEnv`); they are never committed or written to disk.
- Generated assets pass the same acceptance, naming, budget, and review gates as authored content; raster outputs follow the generated-raster acceptance contract.
- Generation cost is managed deliberately: iterate on fast/cheap models with fixed seeds, finalize on higher-fidelity models, and confirm cost before batch video runs.
- Provider and upstream model license terms must be reviewed before shipping generated content commercially.

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
