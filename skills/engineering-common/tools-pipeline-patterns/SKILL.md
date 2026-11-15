---
name: tools-pipeline-patterns
description: Design internal tools and content pipelines that reduce manual work and make authoring safer.
origin: everything-game-dev-code
category: engineering-common
---

# Tools Pipeline Patterns

## Purpose
Design internal tools and content pipelines that reduce manual work and make authoring safer.

## Use When
- repeated manual steps create errors
- content scale is growing
- editor or import workflows need structure

## Inputs
- current workflow pain points
- content ownership
- automation opportunities
- team skill profile

## Process
1. identify repeatable pain and error sources
2. define the smallest useful tool or pipeline intervention
3. build safe validation and rollback into the workflow
4. document ownership and onboarding
5. measure whether the tool actually saves time or defects

## Heuristics
Defaults to start from; verify each one in play.

- keep every value someone will want to tune outside the code, in data that non-programmers can edit; the code is the skeleton, the parameters are the muscle
- name tunable values in the spec exactly as they will be named in data, so the document and the parameter table stay one thing
- apply changed values to the running game with a single action — the number of iterations a team can afford sets how deep the tuning goes
- ship a debug mode usable from the normal controller: set health, freeze the frame, free the camera, swap characters, toggle and ghost individual parts
- consider promoting useful debug views into player-facing features such as a training mode
- name files so they sort into meaningful groups (category first, then direction or number)
- aim testing at the places bugs concentrate — moves that take control of another character, presentation that crosses a scene change, extreme geometry, and parameter or growth systems — because exhaustive coverage is impossible
- seed random numbers from a value that is not fixed, so the same sequence does not appear after every restart
- pin the build version across a test pass and file defects as tickets with reproduction steps, worked in order of severity

## Outputs
- tooling proposal
- pipeline workflow notes
- validation behavior
- ownership and maintenance notes

## Quality Bar
- makes ownership, state flow, and failure behavior explicit
- improves maintainability without over-abstracting
- supports testing, debugging, and safe iteration

## Common Failure Modes
- coupling systems through hidden globals or timing assumptions
- writing logic that is hard to test or debug
- optimizing the wrong layer before measuring

## Related Agents
- tools-programmer
- technical-artist
- producer

## Related Commands
- tools-pass
- tech-design
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
