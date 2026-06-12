---
description: Design or review procedural generation systems, seeds, constraints, and validation gates.
---

# /procgen-design

## Purpose
Design or review procedural generation systems, seeds, constraints, and validation gates.

## Use When
- Levels, loot, encounters, or world content will be generated rather than authored.
- Generated output quality varies and needs constraints and rejection criteria.
- Determinism, seed sharing, or reproducibility matters for testing or community features.

## Invokes Agents
- systems-designer
- level-designer
- gameplay-programmer

## Required Skills
- procgen-design
- level-design

## Expected Output
- A generation constraint specification: what is guaranteed versus what may vary.
- Seed and determinism rules QA can use to reproduce issues.
- Validation gate definitions that reject degenerate output before the player sees it.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Coordinate with `/level-beat` when generation shapes level pacing or encounter structure.
- Coordinate with `/qa-plan` to make seeded reproduction part of the test matrix.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
