---
name: dialogue-content-pipeline
description: Manage dialogue and text content so it remains editable, implementable, localizable, and testable.
origin: everything-game-dev-code
category: art-audio-content
---

# Dialogue Content Pipeline

## Purpose
Manage dialogue and text content so it remains editable, implementable, localizable, and testable.

## Use When
- dialogue volume is increasing
- quest and narrative content are branching
- text implementation is brittle

## Inputs
- narrative brief
- quest logic
- VO constraints
- localization pipeline

## Process
1. define content structure and identifiers
2. separate speaker, condition, and line content clearly
3. track implementation state, review state, and localization state
4. test branch logic and fallback lines
5. prevent canon drift and naming inconsistency

## Outputs
- dialogue content model
- branching rules
- review checklist
- implementation status notes

## Quality Bar
- is usable by content creators without tribal knowledge
- respects quality bars and runtime constraints together
- defines validation and ownership for content flow

## Common Failure Modes
- style consistency that ignores gameplay readability
- manual pipeline steps that create drift
- content that cannot be validated before release

## Related Agents
- narrative-designer
- level-designer
- ui-ux-designer

## Related Commands
- quest-design
- update-docs
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
