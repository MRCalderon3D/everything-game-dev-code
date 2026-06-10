---
description: Review a web (HTML5) project for structure, architecture, maintainability, and risk.
---

# /web-review

## Purpose
Review a web (HTML5/canvas) game project for structure, architecture, maintainability, and risk, including the game loop (requestAnimationFrame with fixed-timestep updates), rendering approach, asset pipeline, save persistence, and GC-pressure hotspots.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- web-reviewer
- code-reviewer

## Required Skills
- web-game-architecture
- web-project-structure

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Apply the same review depth to vanilla canvas and framework-based (e.g. Phaser 3) projects.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
