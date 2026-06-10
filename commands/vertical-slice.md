---
description: Define or review a vertical slice with clear goals, proof points, and acceptance criteria.
---

# /vertical-slice

## Purpose
Define or review a vertical slice with clear goals, proof points, and acceptance criteria.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- planner
- producer
- gdd-designer

## Required Skills
- vertical-slice-planning

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
- Phase context: run `/context preproduction` (see `contexts/preproduction.md`) first so phase agents and priorities are active.
