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
