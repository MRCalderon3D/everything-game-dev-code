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
  for fal.ai); it is never committed. Without a key, stop and report — do not fall
  back to fabricating assets.
- Always `--dry-run` first; for video (the most expensive capability) confirm cost
  expectations with the user before batch generation.
- Use a fixed `--seed` while iterating so accepted prompts are reproducible.
- Model ids live only in `manifests/asset-providers.json`; if a model id is rejected
  by the provider, update the registry rather than patching call sites.
- Rigged or animated 3D output is out of scope — generated meshes are static; route
  rigging needs through `rigging-skinning-pipeline`.
- If the project has no placeholder structure yet, run the engine's placeholder
  command first so generated assets have names and paths to drop into.
