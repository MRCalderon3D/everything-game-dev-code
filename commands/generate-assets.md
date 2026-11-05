---
description: Generate real game assets — images, textures, skyboxes, 3D models, SFX, music, voice, and intro/cinematic video — from text prompts via the generative provider registry.
---

# /generate-assets

## Purpose
Generate production-candidate assets from text prompts using the provider registry
(`manifests/asset-providers.json`, default: fal.ai) and `scripts/generate-assets.js`,
so a project can upgrade from procedural placeholders to real content without
leaving the scaffold. Generation is engine-neutral; import stays in the active
engine layer.

## Capability Gate (read first)
This command is an **optional upgrade**, not a dependency. It is available only when
the active provider's API key exists in the environment (`FAL_KEY` for the default
fal.ai provider). Decide before doing anything else:

- **Key present** → AI generation is available; proceed with this command.
- **Key absent** → AI generation is unavailable. Do not block, fabricate assets, or
  treat it as an error. Fall back to the scaffold's built-in asset tooling exactly
  as before this capability existed: the engine placeholder commands
  (`/unity-placeholders`, `/godot-placeholders`, `/web-placeholders`) and the
  procedural / Canvas / WebAudio pipelines via `placeholder-asset-pipeline`. Tell
  the user the API path is available if they set a key, then continue with placeholders.

## Resolution Order (per capability)
- For `image` and `skybox` (see `nativeFirstCapabilities` in the registry): prefer a
  harness-native image generator if the running harness has one (e.g. Codex
  `$imagegen` — free, no key), then the API provider if a key is set, then
  placeholders. This harness (Claude Code) has no native image generator, so it goes
  API-then-placeholder.
- For `model3d`, `sfx`, `music`, `speech`, `video`: no harness-native path exists —
  only the API provider (if a key is set) or placeholders.

## Quality vs Price (ask first)
- Each capability has three tiers in the registry (`budget` / `balanced` / `premium`).
  Before generating a batch, ask the user once which they want — save money, balanced,
  or best quality — and pass `--quality <tier>` (default `balanced` if they don't answer).
  Example spread: a full game-asset pass is ~$2-3 on `budget`, ~$5-7 on `balanced`,
  ~$10+ on `premium`. An explicit `--model` overrides the tier.

## Cost & Confirmation
- API generation costs real money. A directly typed `/generate-assets` is consent for
  the scope the user described, but always `--dry-run` first to see the printed cost
  estimate, and explicitly confirm before expensive runs (video, large batches).
- The script enforces a gate: runs estimated at or above the registry `confirmOverUsd`
  threshold refuse to start without `--yes`. When that happens, surface the estimate
  to the user, get a yes, then re-run with `--yes` — do not auto-bypass with
  `ASSET_GEN_YES=1` on the user's behalf.
- Cheaper-first: iterate on the low-cost default model, switch to a higher-fidelity
  alternative only for finals; for `image`/`skybox` prefer the free native path.

## Use When
- placeholder assets exist and the project is ready for real visuals, audio, or video
- a specific asset is missing and no artist is available: a sprite, a tileable
  texture, a skybox, a static 3D model, a sound effect, a music loop, a voice line,
  or an intro/cinematic video
- concept art has been accepted and should be lifted into 3D or into motion
- a previous generation needs to be reproduced or re-rolled from its provenance record

## Invokes Agents
- technical-artist
- 2d-artist
- audio-designer

## Required Skills
- ai-asset-generation
- generated-raster-asset-pipeline
- placeholder-asset-pipeline
- 3d-asset-pipeline

## Expected Output
- An acceptance contract per requested asset, defined before generation (size,
  background policy, poly budget, length, loopability, aspect ratio — whichever apply)
- Generated files in neutral formats (PNG, GLB, MP3/WAV, MP4) in a staging directory,
  each with a `.provenance.json` sidecar (provider, model, prompt, seed, request id)
- Accepted assets moved onto the project's existing placeholder names and paths so no
  code changes are needed, with raster acceptances recorded in `generated-assets.json`
- A hand-off note routing engine import and review to the active engine layer and the
  matching pass command (`/art-2d-pass`, `/art-3d-pass`, `/audio-pass`)

## Notes
- The API key comes from the provider's `apiKeyEnv` environment variable (`FAL_KEY`
  for fal.ai); it is never committed. Without a key, the capability is simply
  unavailable — fall back to the scaffold's placeholder/procedural tooling (see the
  Capability Gate above); never fabricate or hand-place assets as a substitute.
- Always `--dry-run` first; for video (the most expensive capability) confirm cost
  expectations with the user before batch generation.
- Use a fixed `--seed` while iterating so accepted prompts are reproducible.
- Model ids live only in `manifests/asset-providers.json`; if a model id is rejected
  by the provider, update the registry rather than patching call sites.
- Rigged or animated 3D output is out of scope — generated meshes are static; route
  rigging needs through `rigging-skinning-pipeline`.
- If the project has no placeholder structure yet, run the engine's placeholder
  command first so generated assets have names and paths to drop into.
