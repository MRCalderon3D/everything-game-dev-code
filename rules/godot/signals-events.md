# Godot Signals and Events

## Purpose
Define how signals and event-driven coordination should be used in Godot projects.

## Scope
Applies to built-in signals, custom signals, UI callbacks, gameplay event flow, and event-bus style patterns.

## Usage Principles
- Signals should make ownership and flow clearer, not more mysterious.
- Use signals for decoupling where it improves maintainability, not as a substitute for all direct relationships.
- Prefer a small number of clear event paths over sprawling webs of hidden callbacks.

## Contract Rules
- Custom signals must have clear names and predictable payloads.
- Document who emits a signal, who is expected to listen, and what side effects are expected.
- Connection strategy should be understandable: editor wiring, code wiring, or centralized setup.

## Risk Controls
- Avoid duplicate listeners, lifecycle leaks, and hard-to-trace chains of side effects.
- Review event-bus patterns carefully; they can simplify some systems while hiding ownership in others.

## Done Criteria
Signal usage is healthy when event flow is explicit enough to debug, review, and safely extend.
