---
description: Review accessibility coverage for input, readability, audio, and difficulty options against design intent.
---

# /accessibility-pass

## Purpose
Review accessibility coverage for input, readability, audio, and difficulty options against design intent.

## Use When
- A feature relies on reaction speed, color, audio cues, or precision input.
- The accessibility option set needs definition, review, or verification targets.
- Certification or store requirements call for documented accessibility support.

## Invokes Agents
- accessibility-reviewer
- ui-ux-designer

## Required Skills
- accessibility-design
- ui-hud-patterns

## Expected Output
- An accessibility review with barriers, equivalent-outcome proposals, and option coverage.
- Verification targets QA can test without guessing intent.
- A known limitation log for barriers that cannot be fully solved.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Run before `/cert-check` when the target platform reviews accessibility compliance.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
