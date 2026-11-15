---
name: onboarding-tutorial-design
description: Teach the player the game clearly, gradually, and in a way that supports retention rather than overload.
origin: everything-game-dev-code
category: design
---

# Onboarding Tutorial Design

## Purpose
Teach the player the game clearly, gradually, and in a way that supports retention rather than overload.

## Use When
- new players churn early
- systems are hard to learn
- a feature needs tutorialization

## Inputs
- core loop
- player friction points
- UI flows
- failure states

## Process
1. identify what players must know immediately versus later
2. sequence learning by relevance and readiness
3. teach through action whenever possible
4. design revisitable help for complex systems
5. test whether onboarding creates understanding or just compliance

## Heuristics
Defaults to start from; verify each one in play.

- deliver the game's fun within the first three minutes; open on a highlight, not on a long intro, backstory, or explanation
- teach inside real play: no empty practice room and no wall of text — fold each lesson into a live situation where the player acts
- the more complex the controls, the earlier the plan for teaching them must exist; decide it in the concept, not at the end
- show one instruction at a time and advance when the player has done it; skip what they have already demonstrated
- a player who cannot read the language should still reach gameplay by pressing confirm repeatedly from the title screen
- every logo, intro, event, and cutscene must be skippable and pausable
- write help text in plain words that say what the option does for the player, not a restatement of its label
- difficulty should start lower than the team expects — developers are far more practised than a new player; play with a self-imposed handicap to feel it
- never let a player become stuck with no way forward: after repeated failure offer an easier setting or a skip, in a way that does not humiliate
- watch first-time players instead of interviewing them; where they stall or lose interest is the finding

## Outputs
- onboarding flow
- tutorial beat list
- help-system requirements
- first-session improvement targets

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- adding systems that do not serve the core loop
- shipping vague rules that QA and engineering must guess at
- tuning without instrumentation or hypotheses

## Related Agents
- ui-ux-designer
- systems-designer
- level-designer

## Related Commands
- onboarding
- playtest-report
- ui-flow-review

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
