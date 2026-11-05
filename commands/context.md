---
description: Activate a project phase context and align agents, commands, and priorities to it.
---

# /context

## Purpose
Activate a project phase context from `contexts/` and align active agents, key commands, priorities, and escalation rules to that phase.

## Use When
- The project moves into a new phase (ideation, preproduction, production, qa, release, liveops, research, review, performance).
- The team needs to confirm which agents and priorities apply right now.
- Behavior should follow a declared phase context instead of ad hoc judgment.

## Invokes Agents
- producer
- planner

## Required Skills
- orchestration-patterns
- milestone-planning

## Expected Output
- The matching `contexts/<phase>.md` read and applied: active agents, key commands, priorities, and escalation rules confirmed for the current phase.
- A short summary of what changes versus the previously active phase.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Phase names map 1:1 to files in `contexts/`. If the requested phase does not exist, list the available phases instead of guessing.
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
