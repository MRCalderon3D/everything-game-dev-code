---
name: ai-asset-generation
description: Generate real game assets (images, skyboxes, 3D models, SFX, music, voice, video) from text prompts through the provider registry, with provenance and acceptance gates.
origin: everything-game-dev-code
category: art-audio-content
---

# AI Asset Generation

## Purpose
Generate production-candidate game assets from text prompts through the generative
provider registry (`manifests/asset-providers.json`) so projects can move from
procedural placeholders to real content without leaving the scaffold — while
keeping generation engine-neutral, reproducible, provenance-tracked, and subject
to the same acceptance gates as authored content.

## Optional Capability — Gate Before Use
AI generation is an optional layer, not a dependency. It is available only when the
active provider's API key is set in the environment (`FAL_KEY` for the default
fal.ai provider). The scaffold's asset workflow does not require it:

- **Key present** → this skill is available; the project may upgrade placeholders to
  generated content.
- **Key absent** → this skill is inert. Fall back to the default scaffold tooling
  exactly as before the capability existed — `placeholder-asset-pipeline` and the
  engine placeholder commands (`/unity-placeholders`, `/godot-placeholders`,
  `/web-placeholders`) for sprites, 3D primitives, and procedural audio. A project
  built entirely on placeholders is a fully valid, shippable-to-prototype outcome;
  generation is an enhancement, never a gate.

Detecting the gate is cheap: the generator (`scripts/generate-assets.js`) reads the
key from the environment and reports clearly when it is missing, pointing back to
the placeholder path. Never fabricate or hand-place assets to "stand in" for the API.

## Resolution Order and Cost
- **Prefer free before paid.** For `image`/`skybox` (the registry's
  `nativeFirstCapabilities`), if the running harness has a native image generator
  (e.g. Codex `$imagegen`), use it instead of the paid API — keep the same names,
  paths, and acceptance gates. Fall to the API only when no native generator exists
  and a key is set; fall to placeholders otherwise. `model3d`/`sfx`/`music`/`speech`/
  `video` have no native path — API or placeholders only.
- **Confirm before spending.** Every run prints an estimated cost; the generator
  refuses runs at or above `confirmOverUsd` without `--yes`. For a single asset the
  user explicitly asked for, dry-run, show the estimate, and proceed if cheap. For
  autonomous or batch flows, get a clear yes on the total before running. Iterate on
  the cheap default model; reserve the expensive alternative and video for finals.
- **Quality vs price tier.** Ask the user once, before a batch, which tier to use —
  `budget`, `balanced`, or `premium` — and pass `--quality` (default `balanced`). The
  registry's `byQuality` map picks the model per capability (e.g. image: flux-schnell /
  nano-banana-2 / nano-banana-pro; video: Wan / Seedance / Veo). Budget can keep a whole
  video run under the cost gate; premium crosses it and needs `--yes`. Tier sets the
  spend; the gate prevents surprises.

## Use When
- placeholder assets exist and the project is ready to upgrade them to real content
- a game needs images, textures, skyboxes, 3D models, sound effects, music, voice
  lines, or intro/cinematic video that no artist is available to produce
- concept art needs to be lifted into 3D (image-to-3D) or into motion (image-to-video)
- the team wants reproducible asset generation runs (prompt + seed + model recorded)
  instead of one-off results pasted from a chat tool

## Inputs
- the provider registry (`manifests/asset-providers.json`) and a valid API key in the
  provider's `apiKeyEnv` environment variable (never committed)
- art bible or visual direction document, and the audio direction where relevant
- asset inventory: which entities need which asset type, at which target size or length
- the placeholder manifest of the project, so generated files can adopt the same
  names and paths (drop-in replacement contract)
- a staging directory outside the engine's import folders

## Process
1. classify each requested asset by capability: `image`, `skybox`, `model3d`,
   `sfx`, `music`, `speech`, or `video`
2. define the acceptance contract before generating (for raster assets this is the
   `generated-raster-asset-pipeline` contract: background policy, display size,
   collision envelope; for audio: length, loopability, loudness target; for 3D:
   poly budget, scale, pivot; for video: duration, aspect ratio, codec)
3. resolve the model from the registry — do not hardcode model ids in project code;
   pass `--model` only to deviate intentionally
4. dry-run first to review the resolved payload:
   `node scripts/generate-assets.js --type <capability> --prompt "..." --out <staging> --dry-run`
5. generate with a fixed `--seed` where the model supports it, iterating on the
   cheap/fast default model and switching to the higher-fidelity alternative for finals
6. review candidates against the acceptance contract before any engine import
7. move accepted files into the project under the placeholder names and paths, keep
   the `.provenance.json` sidecar next to each accepted asset, and record raster
   assets in the project's `generated-assets.json` manifest
8. import through the active engine layer only (Unity/Unreal/Godot/web import rules
   stay in their engine packs), then run the matching review command
   (`/art-2d-pass`, `/art-3d-pass`, `/audio-pass`)

## Outputs
- generated asset files in neutral formats (PNG, GLB, MP3/WAV, MP4) staged and then
  integrated under the project's existing names and paths
- a `.provenance.json` sidecar per generation run: provider, model, prompt, seed,
  request id, timestamp, source URLs, license note
- updated `generated-assets.json` entries for accepted raster assets
- a short generation log in the project docs: what was generated, with which model,
  what was rejected and why

## Quality Bar
- every generated file has a provenance sidecar; an asset without provenance is
  treated as unlicensed third-party content
- generation is reproducible: prompt, seed, and model id recorded, so a lost file
  can be regenerated or deliberately re-rolled
- generated assets pass the same acceptance gates as authored content — no
  "the AI made it" exemption from naming, budget, or review rules
- engine isolation holds: the generation step never writes into engine-specific
  import folders directly
- cost is managed deliberately: iterate cheap, finalize expensive, and dry-run
  video (the costliest capability) before batch runs

## Common Failure Modes
- hardcoding a model id in project code or docs and having it rot when the provider
  catalog rotates — the registry is the only source of truth
- accepting a "transparent" sprite with a baked checkerboard background (run the
  raster acceptance contract; `validate:generated-assets` catches PNGs)
- treating a generated skybox as valid without checking the equirectangular 2:1
  projection and horizon continuity
- importing a generated GLB at the wrong scale because the poly/scale/pivot contract
  was never defined before generation
- generating voice lines outside the localization pipeline and discovering the
  text was never source-controlled
- burning budget on video generation iterations that an image-to-video workflow
  with an accepted still would have art-directed for a fraction of the cost

## Related Agents
- technical-artist
- 2d-artist
- audio-designer

## Related Commands
- generate-assets
- art-2d-pass
- art-3d-pass
- audio-pass

## Related Skills
- generated-raster-asset-pipeline
- placeholder-asset-pipeline
- 3d-asset-pipeline
- cinematic-pipeline
- audio-implementation

## Notes
- The registry's default provider is fal.ai because a single pay-per-use key covers
  every capability; the design is provider-agnostic and a second provider is a
  manifest entry away.
- Rigging and animation of generated 3D models are out of scope for the current
  registry — generated meshes are static; route rigging through the
  `rigging-skinning-pipeline` skill and a dedicated tool or provider.
- An optional `fal-media` MCP server (see `mcp-configs/mcp-servers.json`) exposes the
  same catalog interactively for exploration; reproducible production runs should go
  through `scripts/generate-assets.js` so provenance is written.
