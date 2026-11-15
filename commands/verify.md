---
description: Run a structured verification pass across implementation, quality, and risk.
---

# /verify

## Purpose
Run a structured verification pass across implementation, quality, and risk.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- qa-lead
- code-reviewer
- performance-reviewer

## Required Skills
- verification-loop
- qa-test-matrix

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- When an independent review was run: its findings, each with the criterion it fails, a proposed fix, and the author's disposition.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- For risky, feel-critical, or player-facing work, add the independent review described in `verification-loop`: a reviewer who did not build the work (another person, or a fresh agent) checks it against the acceptance criteria and the relevant skills.
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
