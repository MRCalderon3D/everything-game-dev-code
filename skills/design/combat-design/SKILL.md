---
name: combat-design
description: Design combat verbs, enemy pressure, resource economy, readability, and tuning hooks.
origin: everything-game-dev-code
category: design
---

# Combat Design

## Purpose
Design combat verbs, enemy pressure, resource economy, readability, and tuning hooks.

## Use When
- building a combat game or combat-heavy feature
- combat feels unreadable or shallow
- balance changes need stronger structure

## Inputs
- player fantasy
- weapon or ability roster
- enemy roster
- target pace and difficulty

## Process
1. define player verbs, counters, risk/reward, and pacing
2. design enemy roles and pressure patterns
3. specify feedback, resource use, and fail states
4. identify tuning variables and telemetry needs
5. test clarity, fairness, and skill expression

## Heuristics
Defaults to start from; verify each one in play.

- define depth as risk and return: the player accepts danger to gain advantage, and mastery is taking the return while containing the risk
- place risk and return close together and matched in size — the range at which an attack lands is the range at which the player can be hit; a move with a long recovery earns large damage
- be able to state the risk and the return of every verb (jump, dash, melee, ranged, dodge, parry); a verb with no risk is not a decision
- mix an opposing element into every pleasure: speed needs a condition that slows it, a narrow escape needs a real cost for failing
- build encounters as pressure then release: apply stress, then let the player remove it through skill, growth, or progress
- more risk means more depth and less accessibility — decide the audience first, then size the risk; a small risk for a veteran is a large one for a newcomer
- sharpen every character and enemy until its trait fits in one sentence; even a stationary hazard creates tactics through placement
- balance without flattening: averaging strengths and weaknesses makes everything the same, so when a move is too strong keep its power and adjust another axis (startup, recovery, range, hit volume)
- make hit volumes slightly more generous than the visuals — a hit that looks like it connected and did not is pure frustration
- use randomness for freshness, not to decide skill contests; random options that still reward skilled use are accepted far more readily than random outcomes
- make strong computer opponents aggressive rather than perfectly defensive, and give them a human reaction delay
- leave in-game shortcuts and exploits that players discover on their own unless they break the experience; they are often what players remember

## Outputs
- combat spec
- tuning variable list
- enemy-role matrix
- playtest questions

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- adding systems that do not serve the core loop
- shipping vague rules that QA and engineering must guess at
- tuning without instrumentation or hypotheses

## Related Agents
- combat-designer
- systems-designer
- ui-ux-designer

## Related Commands
- combat-design
- playtest-report
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
