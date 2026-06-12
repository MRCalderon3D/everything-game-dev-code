---
name: unreal-enhanced-input
description: Implement Unreal input with Enhanced Input — Input Actions, Mapping Contexts, triggers/modifiers, and runtime remapping.
origin: everything-game-dev-code
category: unreal
---

# Unreal Enhanced Input

## Purpose
Implement Unreal input with Enhanced Input — Input Actions, Mapping Contexts, triggers/modifiers, and runtime remapping.

## Use When
- adding or unifying input handling for an Unreal project (UE5 Enhanced Input)
- gameplay code binds raw keys/axes or legacy input names directly
- input must change by context (gameplay, vehicles, menus, cinematics) or support rebinding

## Inputs
- list of gameplay actions and their value types (bool, Axis1D/2D/3D)
- supported devices and platforms (keyboard/mouse, gamepad, touch)
- gameplay contexts that change available input (on foot, vehicle, UI, spectator)
- rebinding, accessibility, and local multiplayer requirements

## Process
1. model each action as an Input Action asset with an explicit value type; gameplay code binds to actions in `SetupPlayerInputComponent` via `UEnhancedInputComponent`, never to raw keys
2. group bindings into Input Mapping Contexts per gameplay state and add/remove them on the local player's `UEnhancedInputLocalPlayerSubsystem` with explicit priorities, instead of branching inside handlers
3. put press semantics into Triggers (Pressed, Released, Hold, Tap, Combo) and stick/axis shaping into Modifiers (dead zone, swizzle, negate, scalar) on the action or mapping — not re-implemented in C++/Blueprint handlers
4. route UI through CommonUI or input modes (`SetInputMode*`) so menus consume input cleanly, and treat "UI open" as a context switch rather than per-handler checks
5. implement rebinding with Player Mappable Keys (or `UEnhancedInputUserSettings` in newer versions), persist per user, and update on-screen prompts from the active mappings
6. for local multiplayer, keep contexts and rebinds per `ULocalPlayer` and validate device assignment per player on each target platform
7. test context transitions explicitly: entering/leaving vehicles, opening menus mid-hold, focus loss, and controller hot-plug

## Outputs
- Input Action and Mapping Context asset inventory with priorities
- trigger/modifier configuration per action
- context-switch rules (which contexts exist and what adds/removes them)
- rebinding and persistence design plus device test scenarios

## Quality Bar
- no gameplay code binds raw keys, legacy axis names, or `IsKeyDown` checks outside the Enhanced Input setup
- context switches are mapping-context adds/removes with priorities, not booleans inside input handlers
- hold/tap/combo semantics live in Triggers so designers can tune them without code changes
- rebinds persist per player, apply without restart, and drive the input prompts shown on screen
- a held action that loses its context (menu opens, vehicle exited) cancels cleanly instead of sticking

## Common Failure Modes
- one giant mapping context with handler-side branching instead of per-state contexts
- dead zones and sensitivity hardcoded in handlers, fighting the Modifiers configured on the mapping
- UI and gameplay both receiving the same press because input modes/CommonUI routing was skipped
- rebinding implemented against the legacy input ini, which Enhanced Input ignores
- local multiplayer sharing one set of contexts so player two remaps player one

## Related Agents
- unreal-reviewer
- gameplay-programmer
- ui-programmer

## Related Commands
- input-review
- unreal-review
- verify

## Related Skills
- unreal-gameplay-framework
- unreal-blueprint-patterns

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- The engine-neutral action-abstraction policy lives in `engineering-common/input-abstraction`; this skill is the Unreal-specific implementation of it.
