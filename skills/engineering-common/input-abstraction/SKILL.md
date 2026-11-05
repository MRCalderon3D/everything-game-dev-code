---
name: input-abstraction
description: Design input around player intent and supported device families instead of hardcoding device-specific behavior everywhere.
origin: everything-game-dev-code
category: engineering-common
---

# Input Abstraction

## Purpose
Design input around player intent and supported device families instead of hardcoding device-specific behavior everywhere.

## Use When
- multiple input devices are supported
- rebinds or accessibility matter
- UI and gameplay input are becoming tangled

## Inputs
- action list
- supported devices
- UI flow
- accessibility requirements

## Process
1. define actions by intent
2. separate raw device input from gameplay/UI action handling
3. document action states and context switching
4. support rebinding and persistence where needed
5. test edge cases around focus, pause, and overlays

## Outputs
- action map
- context model
- device support notes
- rebinding requirements

## Quality Bar
- gameplay consumes named actions, never raw device inputs
- rebinding, device switching, and multiple control schemes work without touching gameplay code
- input contexts (gameplay, menu, cutscene) are explicit, with defined push/pop behavior
- dead zones, buffering, and repeat behavior are configured per action, not hardcoded

## Common Failure Modes
- raw key or button checks scattered through gameplay code
- input consumed by multiple contexts at once (menu and gameplay both react)
- device-specific assumptions that break on controller or touch
- buffering and coyote-time tuning embedded in mechanics instead of the input layer

## Related Agents
- ui-programmer
- accessibility-reviewer
- gameplay-programmer

## Related Commands
- ui-flow-review
- verify
- tech-design

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
