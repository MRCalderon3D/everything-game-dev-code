# Clockspring QA Test Matrix

## Critical Coverage Areas

- Spawn and respawn flow
- Checkpoint persistence
- Input rebinding and controller navigation
- Scene transition stability
- Export parity between editor and target build

## High-Risk Test Cases

- Reload from checkpoint after collecting a traversal unlock
- Pause, remap input, and resume during a movement challenge
- Fail repeatedly in a moving-platform room and verify state reset
- Return to the level select flow after a partial run

## Review Signals

- Scene tree changes in movement-critical rooms
- New global autoload dependencies
- Signal chains that affect death, checkpoint, or unlock state
