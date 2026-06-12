---
description: Review animation implementation, state machines, transitions, and gameplay readability.
---

# /animation-pass

## Purpose
Review animation implementation, state machines, transitions, and gameplay readability.

## Use When
- Animation state machines or transition logic need a structured review.
- Animation timing affects gameplay feel, responsiveness, or hit feedback.
- 2D or UI animation pipelines need validation against naming and asset conventions.

## Invokes Agents
- animation-programmer
- 2d-artist
- technical-artist

## Required Skills
- 2d-animation-pipeline
- animation-state-patterns
- ui-animation-pipeline

## Expected Output
- An animation review covering state machine structure, transitions, and event hooks.
- A readability assessment of gameplay-critical animations (telegraphs, hits, recovery).
- Follow-up tasks for pipeline, naming, or timing issues found during the pass.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Coordinate with `/game-feel-pass` when timing issues are about feedback rather than asset quality.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
