---
name: godot-input-patterns
description: Implement Godot input through InputMap actions with correct event propagation, device support, and rebinding.
origin: everything-game-dev-code
category: godot
---

# Godot Input Patterns

## Purpose
Implement Godot input through InputMap actions with correct event propagation, device support, and rebinding.

## Use When
- adding or unifying input handling for a Godot game
- gameplay scripts read raw keycodes, scancodes, or joypad button indices directly
- input behaves differently between gameplay, UI, and pause states and the propagation order is unclear

## Inputs
- list of gameplay actions (move, jump, fire, pause, confirm)
- supported devices (keyboard/mouse, joypad, touch) per platform target
- UI flow and pause/overlay states that consume input
- rebinding and accessibility requirements

## Process
1. define every action in the InputMap (project settings or at startup) and bind devices to actions; gameplay code calls `Input.is_action_*` or handles `InputEvent` actions, never raw keycodes
2. choose polling versus events deliberately: poll continuous state (movement axes via `Input.get_vector`) in `_physics_process`, and handle discrete edges (just pressed/released) through events or `is_action_just_pressed`
3. respect the propagation order — `_input`, then Control `_gui_input`, then `_unhandled_input` — and put gameplay input in `_unhandled_input` so UI consumes events first; call `set_input_as_handled()` explicitly when a layer swallows an event
4. handle joypads through actions with deadzone configured per action, listen to `joy_connection_changed` for hot-plug, and verify mappings on each exported platform
5. for touch targets, decide between `InputEventScreenTouch` handling and `emulate_mouse_from_touch`, and keep on-screen controls as a separate Control layer bound to the same actions
6. implement rebinding by editing InputMap at runtime (`action_erase_events` / `action_add_event`), persist bindings to user settings, and expose them through the accessibility options
7. define how paused state affects input: which nodes keep processing via `process_mode`, and which actions (pause/menu) must work while the tree is paused

## Outputs
- InputMap action inventory with device bindings and deadzones
- propagation rules: which layer handles what, in which callback
- rebinding and persistence design
- device and platform test scenarios (hot-plug, focus loss, touch emulation)

## Quality Bar
- no gameplay script references keycodes, scancodes, or joypad indices outside the InputMap setup
- UI reliably consumes events before gameplay, and nothing double-handles an event after `set_input_as_handled()`
- movement uses `Input.get_vector` (or equivalent) with per-action deadzones, not per-frame keycode checks
- pause/menu actions keep working while the tree is paused, and nothing else does
- rebinds survive a restart and are reflected in any input prompts shown to the player

## Common Failure Modes
- mixing `_input` and `_process` polling for the same action, double-counting presses across frames
- gameplay input in `_input` so UI clicks also fire gameplay actions underneath
- hardcoded joypad button indices that differ between controller types and platforms
- pause menus that cannot be closed because their own input stopped processing with the tree
- touch handled through mouse emulation only, breaking multi-touch (move plus fire) on mobile

## Related Agents
- godot-reviewer
- gameplay-programmer
- ui-programmer

## Related Commands
- input-review
- godot-review
- verify

## Related Skills
- godot-signals-patterns
- godot-scene-architecture

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- The engine-neutral action-abstraction policy lives in `engineering-common/input-abstraction`; this skill is the Godot-specific implementation of it.
