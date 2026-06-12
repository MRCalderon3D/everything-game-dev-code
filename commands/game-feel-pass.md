---
description: Review moment-to-moment feedback, response timing, and juice so core actions feel readable and satisfying.
---

# /game-feel-pass

## Purpose
Review moment-to-moment feedback, response timing, and juice so core actions feel readable and satisfying.

## Use When
- Playtests report actions feeling flat, mushy, or unresponsive.
- Feedback layers (animation, camera, audio, haptics) need a coherent budget and priority.
- Juice additions are starting to hurt readability or competitive clarity.

## Invokes Agents
- gameplay-programmer
- ui-ux-designer
- audio-designer

## Required Skills
- game-feel-design
- ui-animation-pipeline

## Expected Output
- A feedback stack review per core action with response timing targets.
- A juice budget that states where intensity helps and where it harms readability.
- A tuning variable list so feel can be iterated without code changes.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Coordinate with `/animation-pass` when timing issues trace back to animation assets or state machines.
- Coordinate with `/accessibility-pass` for shake reduction, flash limits, and haptic toggles.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
