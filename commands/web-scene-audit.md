---
description: Audit web game scenes, screen flow, state transitions, and teardown patterns.
---

# /web-scene-audit

## Purpose
Audit scene/screen structure, state transitions, and teardown in a web (HTML5/canvas) game, covering scene managers or state machines in vanilla canvas projects and scene lifecycles in framework-based (e.g. Phaser 3) projects, including listener cleanup, timer cancellation, and pooled-object release.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- web-reviewer
- ui-programmer

## Required Skills
- web-game-architecture
- web-canvas-rendering

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Pay special attention to teardown leaks: dangling event listeners, uncancelled animation frames, and audio nodes left running across transitions.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
