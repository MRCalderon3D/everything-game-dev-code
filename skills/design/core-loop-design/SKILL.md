---
name: core-loop-design
description: Define the primary player activity loop and the support loops that sustain mastery, variety, and progression.
origin: everything-game-dev-code
category: design
---

# Core Loop Design

## Purpose
Define the primary player activity loop and the support loops that sustain mastery, variety, and progression.

## Use When
- a concept needs gameplay structure
- the current loop feels unfocused
- new systems risk diluting the core fantasy

## Inputs
- product pillars
- target audience
- competitive references
- session and progression goals

## Process
1. state what the player repeatedly does and why it is satisfying
2. map supporting loops that reinforce the core loop
3. identify inputs, feedback, rewards, and failure points
4. test whether the loop fits the intended session length and mastery curve
5. cut systems that do not serve the loop

## Heuristics
Defaults to start from; verify each one in play.

- the goal is always the player's enjoyment; when a decision is hard, return to it and discount the team's convenience, taste, and effort
- find the fun by decomposition: take apart what makes a reference enjoyable, reason about why, and rebuild it in a new form instead of copying its surface
- "like game X" is not a concept — if it only resembles the original, players can play the original; stack several things the original does not offer
- the basic shape of fun is tension followed by release: something presses on the player, and their action resolves it
- state the core in one line as a risk the player takes and the return they get; if it cannot be stated, the loop is not defined yet
- play time is a cost the player pays, not a selling point: keep the parts that are fun and the parts that directly support them
- track the share of a session spent actually acting versus waiting, travelling back, or watching, and treat it as a loop health metric
- chores work only with a fitting reward, short gaps between small wins, freedom of route, and no dull trip back once the task is done

## Outputs
- core loop definition
- support loop map
- design constraints
- candidate tutorial beats

## Quality Bar
- the loop is expressible as a closed cycle of player actions, rewards, and re-entry motivation
- each loop step names the player verb, the feedback, and a duration target
- supporting loops (session, progression, economy) are explicitly connected to the core loop
- the loop is testable in a gray-box build without final art

## Common Failure Modes
- loops that depend on content volume instead of repeatable mechanics
- reward steps without a defined re-entry hook back into the loop
- a core loop tuned only on paper, never validated in a playable slice
- conflating the core loop with the meta progression that wraps it

## Related Agents
- systems-designer
- gdd-designer
- level-designer

## Related Commands
- gdd
- plan
- onboarding

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
