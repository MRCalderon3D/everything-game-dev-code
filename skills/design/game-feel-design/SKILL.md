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
