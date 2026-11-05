---
name: web-game-architecture
description: Structure the game loop, fixed-timestep simulation, state machines, and decoupled systems for a browser game.
origin: everything-game-dev-code
category: web
---

# Web Game Architecture

## Purpose
Structure the game loop, fixed-timestep simulation, state machines, and decoupled systems for a browser game.

## Use When
- designing or refactoring the core loop and system layout of a browser game
- gameplay behaves differently across monitor refresh rates or after tab switches
- systems are entangled and cross-call each other directly

## Inputs
- target frame budget and simulation rate
- list of systems (input, simulation, rendering, audio, UI, persistence)
- scene and game-state flow (boot, menu, play, pause, game over)
- framework constraints, if any

## Process
1. drive rendering with requestAnimationFrame and run simulation on a fixed-timestep accumulator, clamping large frame deltas so a stalled tab cannot trigger a catch-up spiral
2. keep simulation state separate from rendering; render reads state (interpolated if needed) and never mutates it
3. model game flow as an explicit state machine with single-owner transitions, instead of scattered boolean flags
4. decouple systems through events or message queues with named contracts, reserving direct calls for tight owner-child relationships
5. handle the page lifecycle deliberately: pause simulation and audio on visibility loss, and resume cleanly with a reset delta

## Outputs
- loop and timestep design
- system boundary map with communication contracts
- game-state machine diagram or table
- page-lifecycle handling notes

## Quality Bar
- simulation advances in fixed steps regardless of display refresh rate; 60 Hz and 144 Hz players experience the same game
- frame delta is clamped, so returning to a backgrounded tab never freezes or fast-forwards the game
- every game state and transition is explicit, with one owner per transition
- rendering code cannot mutate simulation state, and systems communicate through declared events rather than reaching into each other
- pausing stops simulation, audio, and timers together, not just the draw calls

## Common Failure Modes
- physics and movement multiplied by raw frame delta, making the game speed depend on the monitor
- a death spiral after tab restore because the accumulator tries to replay seconds of missed updates
- game flow encoded in overlapping booleans (isPaused, isMenu, isDead) that drift out of sync
- an event bus used for everything, hiding ownership and making update order untraceable
- timers based on wall-clock time that keep running while the game is paused or hidden

## Related Agents
- architect
- gameplay-programmer
- web-reviewer

## Related Commands
- web-setup
- web-review
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Frameworks that own the loop (such as Phaser) still benefit from fixed-step simulation logic and explicit state machines inside their scene structure.
