---
name: 2d-animation-pipeline
description: Define authoring, import, and state machine rules for frame-by-frame and skeletal 2D animations.
origin: everything-game-dev-code
category: art-audio-content
---

# 2D Animation Pipeline

## Purpose
Define authoring, import, and state machine rules for 2D animations so they play correctly, transition cleanly, and stay within performance budgets.

## Use When
- the project uses frame-by-frame sprite animations or skeletal 2D animations
- animation state machines need standardization across characters or entities
- new animated entities are being added and need to follow project conventions
- placeholder animations are being replaced with final art

## Inputs
- art bible or visual direction for animation style
- animation list per entity (idle, run, jump, attack, death, etc.)
- frame rate and loop settings per animation type
- skeletal rig requirements (if using Spine, DragonBones, or engine-native skeletal 2D)

## Process
1. define animation naming convention and folder structure per entity
2. set frame rate, loop mode, and blend settings per animation type
3. establish sprite sheet layout for frame-by-frame or export rules for skeletal rigs
4. configure animation state machine transitions and parameters
5. validate animation playback, transition smoothness, and memory footprint

## Outputs
- animation naming and folder convention
- frame rate and loop settings per animation type
- state machine transition map (states, parameters, conditions)
- validation checklist for new animation submissions

## Quality Bar
- every animation follows naming convention and lives in the correct folder
- frame rate is consistent within each animation type — no mixed rates
- state machine transitions are complete — no missing states or dead ends
- animation memory footprint stays within the platform budget

## Common Failure Modes
- inconsistent frame rates that cause jitter or timing mismatches
- missing state machine transitions that leave entities stuck in a state
- oversized sprite sheets that waste memory on unused frames
- skeletal rigs with incompatible bone counts or naming across entities

## Related Agents
- 2d-artist
- animation-programmer
- technical-artist

## Related Commands
- art-2d-pass
- perf-budget
- unity-placeholders

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
