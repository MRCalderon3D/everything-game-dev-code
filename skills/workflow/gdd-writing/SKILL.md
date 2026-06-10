---
name: gdd-writing
description: Create or update a Game Design Document that is actionable for design, engineering, QA, production, and content teams.
origin: everything-game-dev-code
category: workflow
---

# GDD Writing

## Purpose
Create or update a Game Design Document that is actionable for design, engineering, QA, production, and content teams.

## Use When
- starting a new game or major feature
- the current design intent is fragmented across chats and tickets
- systems, loops, or content rules need a durable source of truth

## Inputs
- product pillars and target audience
- core loop assumptions
- feature list and scope constraints
- known technical or production constraints

## Process
1. define the player promise, pillars, and target audience
2. describe core and supporting loops with clear rules
3. document feature behavior, progression, UI, content, and edge cases
4. separate goals, assumptions, decisions, and open questions
5. hand off sections that need technical, QA, or production follow-up

## Outputs
- current GDD
- feature sections with acceptance criteria
- open questions list
- cross-discipline follow-up items

## Quality Bar
- every system section states player-facing rules concretely enough that a developer could implement them without asking the designer
- each feature section carries acceptance criteria QA can test against
- decisions, assumptions, and open questions are kept in separate, labeled lists
- the document reflects the game as currently intended — superseded sections are removed or marked, never left to contradict

## Common Failure Modes
- describing intent ("combat should feel punchy") without rules a developer can implement
- features documented without acceptance criteria, leaving QA to guess
- the GDD silently diverging from what was actually built after iteration
- open questions buried inside prose instead of tracked in the open questions list

## Related Agents
- gdd-designer
- planner
- systems-designer
- producer

## Related Commands
- gdd
- plan
- update-docs

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
