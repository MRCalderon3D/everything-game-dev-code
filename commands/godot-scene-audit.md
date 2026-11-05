---
description: Audit Godot scenes, nodes, autoloads, and scene composition patterns.
---

# /godot-scene-audit

## Purpose
Audit Godot scenes, nodes, autoloads, and scene composition patterns.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- godot-reviewer

## Required Skills
- godot-scene-architecture

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- For 3D scenes, audit through the `godot-3d-scenes` skill as well: root transforms, physics body choice, collision layers/masks, WorldEnvironment ownership, and 3D density.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
