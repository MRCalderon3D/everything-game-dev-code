---
name: placeholder-asset-pipeline
description: Define creation, naming, and replacement rules for placeholder assets so the game is testable before final art exists.
origin: everything-game-dev-code
category: art-audio-content
---

# Placeholder Asset Pipeline

## Purpose
Define creation, naming, and replacement rules for placeholder assets so the game is visually testable and gameplay-verifiable before final art, audio, or VFX assets are produced.

## Use When
- core systems are implemented but no final assets exist yet
- the game needs to be runnable for playtesting or QA before art delivery
- new entities are added and need immediate visual representation for testing
- final assets are being swapped in and the drop-in replacement path needs validation

## Inputs
- entity list from the GDD or milestone plan (player, enemies, collectibles, environment, UI)
- gameplay scale and collision requirements per entity
- folder structure and naming convention from the art bible or project setup
- target platform constraints (resolution, texture budget)

## Process
1. inventory all entities that need visual representation for the current milestone
2. generate placeholder assets (colored shapes for visuals, procedural audio for sounds) at correct gameplay scale
3. place placeholders in the same folder path and with the same file name that final assets will use
4. wire placeholders into prefabs or scenes so the game is immediately playable
5. document the replacement checklist — what to swap, where, and how to validate after swapping

## Outputs
- placeholder assets for all milestone entities (sprites, prefabs, procedurally generated audio clips)
- drop-in replacement guide (file paths, naming, validation steps)
- scene or prefab configuration with placeholders wired and playable
- replacement validation checklist

## Quality Bar
- every placeholder uses the exact name and path that the final asset will use — zero code changes on swap
- placeholder scale matches gameplay requirements — colliders and physics work correctly
- the game is fully playable with placeholders alone — no missing references or null errors
- the replacement guide is complete enough that a non-programmer can swap assets

## Common Failure Modes
- placeholder names that do not match the final asset convention, causing rework on swap
- incorrect scale that makes gameplay testing unreliable
- missing placeholder for an entity that blocks testing of a system
- placeholders wired into code by reference rather than by name, breaking the drop-in path

## Related Agents
- 2d-artist
- technical-artist
- unity-reviewer

## Related Commands
- unity-placeholders
- scene-bootstrap
- art-2d-pass

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- This skill is engine-neutral. Engine-specific placeholder commands (e.g. `/unity-placeholders`) implement the concrete generation step using this skill's standards.
- Audio placeholders should be procedurally generated (sine waves, square waves, noise, pitch sweeps) — not silent stubs. A placeholder sound that represents the intended audio event (e.g. a rising tone for a coin collect, a short burst for a jump) makes gameplay testing far more effective than silence.
