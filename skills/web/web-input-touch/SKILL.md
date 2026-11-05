---
name: web-input-touch
description: Abstract input into named actions across keyboard, mouse, touch, and gamepad, including mobile on-screen controls.
origin: everything-game-dev-code
category: web
---

# Web Input and Touch

## Purpose
Abstract input into named actions across keyboard, mouse, touch, and gamepad, including mobile on-screen controls.

## Use When
- adding or unifying input handling for a browser game
- gameplay code reads raw key codes or touch coordinates directly
- the game needs to be playable on mobile, desktop, and gamepad from one codebase

## Inputs
- list of gameplay actions (move, jump, fire, pause, confirm)
- supported devices per platform target
- mobile layout constraints for on-screen controls
- framework input facilities, if any

## Process
1. define named actions and bind devices to them in one input module; gameplay code queries actions, never raw events
2. track per-action edge state (just pressed, held, just released) sampled once per frame, so simulation steps see stable input
3. use pointer events for mouse and touch together, set touch-action none on the game surface, and prevent default scrolling, zooming, and context menus over it
4. poll connected gamepads every frame (the gamepad interface is poll-based), map buttons and axes to the same named actions, and apply axis dead zones
5. design on-screen touch controls as a separate layer bound to actions: thumb-sized targets, anchored to safe areas, multi-touch aware, and only shown when touch is the active modality

## Outputs
- action map (action to device bindings)
- input module design with per-frame sampling
- on-screen control layout notes
- device-detection and modality-switch rules

## Quality Bar
- no gameplay code references key codes, button indices, or touch coordinates outside the input module
- pressed and released edges are correct even when the simulation runs multiple fixed steps in one frame
- touch play causes no page scroll, pinch zoom, text selection, or 300ms-delay artifacts on the game surface
- on-screen controls support simultaneous touches (move plus fire) and sit inside device safe areas
- the first user gesture is also used to unlock audio, so input and sound activation never fight each other

## Common Failure Modes
- listening for input events inside gameplay objects, scattering bindings across the codebase
- reading keydown events directly in update code and missing or double-counting presses across fixed steps
- separate mouse and touch handlers drifting apart instead of one pointer-event path
- gamepad support wired to connection events only, missing pads that were connected before page load
- single-touch on-screen controls that drop movement the moment the player fires

## Related Agents
- gameplay-programmer
- ui-programmer
- ui-ux-designer

## Related Commands
- web-review
- qa-plan
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Framework input plugins can implement the device layer, but the named-action map should remain project-owned so rebinding and new devices stay cheap.
