---
name: procgen-design
description: Design procedural content systems with seeds, constraints, and validation gates so generated output stays fun and shippable.
origin: everything-game-dev-code
category: design
---

# Procedural Generation Design

## Purpose
Design procedural content systems with seeds, constraints, and validation gates so generated output stays fun and shippable.

## Use When
- levels, loot, encounters, or world content will be generated rather than authored
- generated output quality varies wildly and needs constraints
- determinism, seed sharing, or reproducibility matters for testing or community features

## Inputs
- content type and generation goals (variety, replayability, scale)
- authored content that generation must complement
- difficulty and pacing constraints
- determinism and seed requirements

## Process
1. define what generation must guarantee versus what may vary
2. choose the authored-versus-generated split per content type
3. specify seed handling, determinism scope, and reproducibility rules
4. define validation gates that reject degenerate output before the player sees it
5. plan telemetry to detect quality drift in shipped generation
6. define how designers tune generators without touching generation code

## Outputs
- generation constraint specification
- seed and determinism rules
- validation gate definitions with rejection criteria
- tuning surface for designers

## Quality Bar
- supports the core fantasy and player goals
- defines readable rules, edge cases, and feedback
- creates concrete hooks for tuning, telemetry, and QA

## Common Failure Modes
- generation without validation gates, shipping degenerate output
- non-deterministic systems that QA cannot reproduce
- variety goals that ignore pacing and difficulty constraints

## Related Agents
- systems-designer
- level-designer
- gameplay-programmer

## Related Commands
- procgen-design
- level-beat
- qa-plan

## Related Skills
- level-design
- core-loop-design

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
