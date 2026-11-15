---
name: animation-state-patterns
description: Structure animation state, blending, events, and sync so authored motion remains reliable under gameplay pressure.
origin: everything-game-dev-code
category: engineering-common
---

# Animation State Patterns

## Purpose
Structure animation state, blending, events, and sync so authored motion remains reliable under gameplay pressure.

## Use When
- the project has complex stateful animation
- animation bugs create gameplay errors
- authored transitions are hard to reason about

## Inputs
- gameplay state model
- animation set
- event requirements
- network or timing constraints

## Process
1. define animation states and transition ownership
2. separate gameplay truth from presentation timing where possible
3. document event usage and failure handling
4. prevent state explosion with clear grouping and priorities
5. verify edge cases such as interruptions, stun, equip, hit reactions, and cancel windows

## Heuristics
Defaults to start from; verify each one in play.

- structure an attack as idle, anticipation, strike, follow-through; settle the idle pose first because every other pose departs from it
- change the pose sharply on the first frame of the input so acceptance is visible — responsiveness outranks smooth in-betweens
- hold the anticipation, then deliver the strike in very few frames; leaving it to automatic interpolation makes the motion soft
- the pose held at the moment of contact (during hit-stop) is the one players remember: exaggerate it, break symmetry, twist the torso, and choose the angle with the clearest silhouette for the game's camera
- the follow-through is on screen longest and sets the impression: put the active frames in the first quarter to third of the move, make the rest recovery, give strong moves long recovery, and place cancel windows inside it
- specify a move with four values: idle pose, strike pose, the frame the hit becomes active, and total frames
- exaggerate past the point that looks right in isolation, more so for small or distant characters
- the first frame of a hurt reaction should be an extreme pose unlike the idle; vary reactions by hit location and strength
- express move data (active frame, recovery, cancel window) as named tuning values that design can change without re-authoring the animation

## Outputs
- animation state map
- event contract notes
- sync rules
- test cases for transitions

## Quality Bar
- makes ownership, state flow, and failure behavior explicit
- improves maintainability without over-abstracting
- supports testing, debugging, and safe iteration

## Common Failure Modes
- coupling systems through hidden globals or timing assumptions
- writing logic that is hard to test or debug
- optimizing the wrong layer before measuring

## Related Agents
- animation-programmer
- combat-designer
- ai-programmer

## Related Commands
- tech-design
- verify
- playtest-report

## Related Skills
- 2d-animation-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns runtime state-machine architecture; `2d-animation-pipeline` owns animation authoring, import, and wiring conventions.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
