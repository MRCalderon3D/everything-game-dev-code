---
name: progression-design
description: Structure long-term and short-term progression so players experience growth, goals, and retention without uncontrolled complexity.
origin: everything-game-dev-code
category: design
---

# Progression Design

## Purpose
Structure long-term and short-term progression so players experience growth, goals, and retention without uncontrolled complexity.

## Use When
- adding unlocks, levels, upgrades, or mastery layers
- players lack motivation between sessions
- content cadence needs stronger reward structure

## Inputs
- core loop
- content cadence
- session goals
- economy assumptions

## Process
1. define progression layers and how they reinforce the core loop
2. set reward timing, pacing, and gating rules
3. prevent front-loaded complexity and dead progression lanes
4. identify reset, catch-up, and balance risks
5. map telemetry needed to monitor progression health

## Heuristics
Defaults to start from; verify each one in play.

- decide the rewards as soon as the skeleton of the game works; progress that yields nothing feels empty
- the most effective reward is the character becoming plainly stronger; in competitive games, where power growth is unfair, reward with unlocks (characters, stages, music, collectibles, modes)
- pair every numeric reward with a use, and let the player choose what to spend it on
- keep the next goal visible and near: how much is left to the next level, the item that is almost affordable
- treat achievements as goals handed to the player rather than as rewards
- praise the player with presentation — a cheer, applause, a celebration of the winner — it costs little and lands
- reframe scores in a scale people already understand so the number means something
- do not make strength a straight slope: alternate hard gates that demand a strategy with flat stretches and places to farm
- do not scale enemies to the player's level; it erases the meaning of growth
- customization needs a visible effect, sharply opposed strengths and weaknesses, easy selection (sort, auto-equip), a way to try it on the spot, and appeal in how it looks
- a rank number alone discourages everyone but first place; express standing relative to the whole population instead

## Outputs
- progression model
- reward pacing rules
- gating logic
- progression metrics

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- adding systems that do not serve the core loop
- shipping vague rules that QA and engineering must guess at
- tuning without instrumentation or hypotheses

## Related Agents
- systems-designer
- economy-designer
- telemetry-analyst

## Related Commands
- gdd
- economy-balance
- telemetry-plan

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
