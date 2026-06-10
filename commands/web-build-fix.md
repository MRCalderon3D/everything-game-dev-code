---
description: Diagnose and resolve web build, bundling, or deployment issues.
---

# /web-build-fix

## Purpose
Diagnose and resolve web build, bundling, or deployment issues, including bundler configuration (e.g. vite), no-build ES-module serving, asset path and base-URL problems, and static-host deployment targets such as itch.io and GitHub Pages.

## Use When
- The task needs a repeatable command entry point rather than an ad hoc workflow.
- The scope is clear enough to define expected outputs and validation.
- The result should align with the scaffold rules and agent boundaries.

## Invokes Agents
- web-reviewer
- gameplay-programmer

## Required Skills
- web-build-release
- web-testing

## Expected Output
- A structured result that can be reviewed, acted on, or handed off.
- Clear assumptions, risks, and open questions where relevant.
- Updated documentation or follow-up tasks when the command changes project understanding.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Verify fixes against the browser/device QA matrix before declaring the build healthy.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
