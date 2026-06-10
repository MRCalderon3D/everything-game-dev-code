---
description: Set up or normalize a web (HTML5) project according to the scaffold rules.
---

# /web-setup

## Purpose
Set up or normalize a web (HTML5/canvas) game project according to the scaffold rules, covering both no-build ES-module setups served via a local server and bundler-based setups such as vite, for vanilla canvas or framework-based (e.g. Phaser 3) projects.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- web-reviewer
- architect

## Required Skills
- web-project-structure
- web-js-ts-standards

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Recommend patterns that work for both vanilla canvas and framework-based projects; do not mandate one framework.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
