# Web UI and Input

## Purpose
Define input handling rules for browser games across keyboard, mouse, touch, and gamepad devices.

## Scope
Applies to input abstraction, action mapping, mobile touch controls, and browser default behavior.

## Input Rules
- Centralize input behind named, intent-level actions; game logic must not read raw device events directly.
- Support keyboard, mouse, touch, and gamepad through the same action layer so devices can be added without gameplay changes.
- Poll gamepads each frame through the Gamepad API and handle connect and disconnect events.

## Browser Rules
- Prevent default browser behaviors (scrolling, zooming, context menus, key shortcuts) deliberately and only on game surfaces.
- Mobile touch controls must define touch targets, multi-touch expectations, and visual affordances.
- Handle focus loss and visibility changes by releasing held inputs and pausing where appropriate.

## Risk Areas
- Mixed pointer, touch, and keyboard interaction creates hidden edge cases; test device combinations explicitly.

## Done Criteria
Input handling is healthy when actions are device-agnostic, defaults are suppressed intentionally, and every supported device can complete critical paths.
