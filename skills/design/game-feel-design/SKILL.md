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
Defaults to start from; verify each one in play.

**Hit-stop**
- freeze briefly on every meaningful contact, in any genre; also on a boss kill and on the player's own defeat, so the moment registers
- scale the freeze with damage, then apply a per-move multiplier, so heavy moves read as heavy
- during the freeze, shake the receiver strongly and the attacker slightly — move only the visuals, never the hit or hurt volumes
- shake horizontally for grounded targets and add vertical only for airborne ones; start large and settle
- blend the receiver into its hurt pose over a few frames rather than snapping or holding still
- increase shake amplitude as the camera gets farther, so distant hits still read

**Response and tempo**
- show acceptance on the first frame of an input with a visibly different pose; never let automatic blending delay the response
- no button press should produce nothing — acknowledge even rejected input (recovery, cooldown) with a muted cue
- treat slowness as the one flaw nobody forgives: count wait time, fades, blackouts, and time-to-retry, and cut them until it feels slightly too tight
- restart after failure fast; how quickly control returns matters more than how heavy the penalty is

**Movement and camera**
- tune jumps to the game's goal: rise and fall speeds, hold-to-adjust height, and air control each change the decisions a jump creates; a faster fall than rise reads as weight
- do not lock the camera target to the character — soften vertical follow so height is felt, and lead slightly toward the direction of travel
- decide per action whether it can carry the character off a ledge; attacks and dodges usually should not
- re-check feel on target hardware after any optimization or platform move: a changed processing speed changes difficulty

**Diagnosis order**
- "no impact": hit-stop, then hit marks, then the attack transient of the sound, then shake and flash, then anticipation snap and hit pose
- "sluggish": share of time spent actually playing, transition and retry length, first-frame response, blending that softens poses

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
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
