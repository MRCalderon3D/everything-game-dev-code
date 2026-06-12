---
description: Review input handling, device coverage, buffering, and control responsiveness from an engine-neutral perspective.
---

# /input-review

## Purpose
Review input handling, device coverage, buffering, and control responsiveness from an engine-neutral perspective.

## Use When
- Input handling spans multiple devices (gamepad, keyboard/mouse, touch) and needs coverage review.
- Responsiveness issues need analysis (buffering, dead zones, repeat rates, input latency).
- Rebinding, accessibility input options, or input abstraction layers need design or review.

## Invokes Agents
- gameplay-programmer
- ui-programmer

## Required Skills
- input-abstraction

## Expected Output
- An input coverage review across supported devices and contexts (gameplay, menus, text entry).
- A responsiveness assessment covering buffering, dead zones, and edge cases like device hot-swap.
- Follow-up tasks for abstraction-layer gaps or device-specific risks.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Hand off to the matching engine layer (for example `unity-input-system` or `web-input-touch` skills) when implementation detail is required.
- Coordinate with `/accessibility-pass` for remapping and input accessibility options.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
