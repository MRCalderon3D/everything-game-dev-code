---
description: Review localization readiness for text, UI expansion, locale risks, and translation workflow.
---

# /localization-pass

## Purpose
Review localization readiness for text, UI expansion, locale risks, and translation workflow.

## Use When
- The game will ship in more than one language and text is accumulating.
- UI screens need validation against text expansion, truncation, or RTL layouts.
- The translation export/import workflow needs definition or review.

## Invokes Agents
- narrative-designer
- ui-ux-designer
- doc-updater

## Required Skills
- localization-pipeline

## Expected Output
- A localization readiness report covering text inventory, key management, and workflow gaps.
- A locale risk list with screens and systems sensitive to expansion, fonts, or RTL.
- A QA localization checklist and follow-up tasks for unresolved risks.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Coordinate with `/ui-flow-review` when expansion risks concentrate in menus or HUD.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
