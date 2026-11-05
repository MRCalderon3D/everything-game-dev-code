---
description: Design or revise dialogue structure, branching, variables, and the content pipeline for conversations.
---

# /dialogue-design

## Purpose
Design or revise dialogue structure, branching, variables, and the content pipeline for conversations.

## Use When
- Conversations need branching structure, state variables, or conditional availability.
- The dialogue content pipeline (authoring, review, integration) needs definition.
- Narrative tone and character voice need consistency rules writers can follow.

## Invokes Agents
- narrative-designer
- gdd-designer

## Required Skills
- narrative-design
- dialogue-content-pipeline

## Expected Output
- A dialogue structure spec with branching rules, variables, and state handling.
- Authoring conventions covering tone, voice, and length constraints.
- Pipeline notes for how dialogue content moves from writing to integration.

## Notes
- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.
- Coordinate with `/quest-design` when dialogue gates or advances quest state.
- Run `/localization-pass` early if the game ships in multiple languages — branching dialogue multiplies translation cost.
- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.
