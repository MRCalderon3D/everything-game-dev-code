---
name: narrative-design
description: Build narrative structure, world logic, dialogue intent, and player motivation that support the game loop.
origin: everything-game-dev-code
category: design
---

# Narrative Design

## Purpose
Build narrative structure, world logic, dialogue intent, and player motivation that support the game loop.

## Use When
- story, dialogue, lore, or character arcs need structure
- narrative and gameplay feel disconnected
- content growth is making canon hard to manage

## Inputs
- game pillars
- quest or mission structure
- world rules
- localization constraints

## Process
1. define narrative goals, arcs, and world rules
2. link story beats to gameplay and objective flow
3. write or outline dialogue with implementation constraints in mind
4. create a canon reference and naming consistency rules
5. plan subtitle, VO, and localization implications early

## Outputs
- narrative brief
- canon notes
- dialogue or quest specs
- localization and VO considerations

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- adding systems that do not serve the core loop
- shipping vague rules that QA and engineering must guess at
- tuning without instrumentation or hypotheses

## Related Agents
- narrative-designer
- gdd-designer
- audio-designer

## Related Commands
- gdd
- quest-design
- update-docs

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
