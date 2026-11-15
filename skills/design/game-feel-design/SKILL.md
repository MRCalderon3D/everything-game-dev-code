---
name: game-feel-design
description: Design moment-to-moment feedback — hit-stop, screen shake, tweening, and response timing — so actions feel readable and satisfying.
origin: everything-game-dev-code
category: design
---

# Game Feel Design

## Purpose
Design moment-to-moment feedback — hit-stop, screen shake, tweening, and response timing — so actions feel readable and satisfying.

## Use When
- core actions feel flat, mushy, or unresponsive in playtests
- feedback layers (visual, audio, haptic) need a coherent budget and priority
- juice additions start hurting readability or competitive clarity

## Inputs
- core loop and action set
- input-to-response timing measurements
- existing feedback inventory (VFX, SFX, camera, haptics)
- readability and accessibility constraints

## Process
1. inventory each player action and its current feedback stack
2. define target response timing per action (anticipation, contact, recovery)
3. assign feedback layers per action: animation, camera, audio, haptics, UI
4. set a juice budget — where intensity helps and where it harms readability
5. define tuning variables and exposure so feel can be iterated without code changes
6. validate against accessibility needs (shake reduction, flash limits, haptic toggles)

## Heuristics
Defaults to start from; verify each one in play. Detail lives in the references below.

- freeze briefly on every meaningful contact, and scale the freeze with the weight of the hit
- show acceptance on the first frame of an input; no button press should produce nothing
- treat slowness as the one flaw nobody forgives — waits, fades, and time-to-retry all count
- tune movement to the decisions it should create, and let the camera show height and direction of travel

**Diagnosis order**
- "no impact": hit-stop, then hit marks, then the attack transient of the sound, then shake and flash, then anticipation snap and hit pose
- "sluggish": share of time spent actually playing, transition and retry length, first-frame response, blending that softens poses

## References
Load a reference only when the task needs that detail.

- [Hit-stop](references/hit-stop.md) — read when adding or tuning contact feedback: freeze length, shake on attacker and receiver, hurt-pose blend, camera-distance correction
- [Response and tempo](references/response-and-tempo.md) — read when actions feel unresponsive or the game feels slow: first-frame response, rejected input, waits, retry time
- [Movement and camera](references/movement-and-camera.md) — read when tuning jumps, camera follow, or ledge behaviour, and after any optimization or platform move

## Outputs
- feedback stack specification per core action
- response timing targets
- juice budget with readability limits
- tuning variable list for iteration

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- stacking effects until readability collapses
- tuning feel by anecdote without timing measurements
- feedback that cannot be reduced or disabled for accessibility

## Related Agents
- gameplay-programmer
- ui-ux-designer
- audio-designer

## Related Commands
- game-feel-pass
- audio-pass
- ui-flow-review

## Related Skills
- accessibility-design
- combat-design

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section and the reference files are distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
