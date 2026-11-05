# Web Patterns

## Purpose
Define approved architecture patterns for browser game runtime code.

## Scope
Applies to game loops, state management, entity organization, and system decoupling.

## Game Loop Rules
- Drive frames with requestAnimationFrame and accumulate elapsed time for fixed-timestep simulation updates.
- Keep simulation updates deterministic against the fixed timestep; let rendering run per frame and interpolate.
- Clamp large frame deltas so tab switches and breakpoints do not produce update spirals.

## Composition Rules
- Prefer entity composition (components, mixins, or data-driven entities) over deep inheritance trees.
- Use state machines for entity and game-flow behavior with explicit, named states and transitions.
- Use event-driven decoupling where it clarifies ownership, but document event ownership and lifecycle.

## Anti-Patterns
- monolithic main-loop files that own all gameplay behavior
- hidden cross-module coupling through shared mutable globals
- per-frame polling for systems that should be event-driven

## Done Criteria
A web pattern is acceptable when it clarifies ownership, scales with project complexity, and remains reviewable.
