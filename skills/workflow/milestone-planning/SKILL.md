---
name: milestone-planning
description: Build milestone plans that are dependency-aware, risk-aware, and tied to real delivery outcomes.
origin: everything-game-dev-code
category: workflow
---

# Milestone Planning

## Purpose
Build milestone plans that are dependency-aware, risk-aware, and tied to real delivery outcomes.

## Use When
- entering pre-production or production
- scope has changed materially
- the team needs a realistic plan instead of a loose backlog

## Inputs
- current scope
- team capacity
- dependencies
- risk register
- technical and content constraints

## Process
1. define milestone purpose, entry criteria, and exit criteria
2. break work into feature-sized deliverables with owners
3. sequence dependencies and identify blockers early
4. reserve capacity for integration, QA, and rework
5. mark candidate descopes and optional stretch items

## Outputs
- milestone plan
- dependency map
- ownership list
- risk-aware scope breakdown

## Quality Bar
- each milestone has exit criteria a reviewer can check without interpretation
- dependencies between workstreams are mapped before dates are committed
- every milestone names its owner and the decision that unblocks the next one
- risks carry probability, impact, and a named mitigation owner

## Common Failure Modes
- milestones defined by dates instead of demonstrable outcomes
- hidden dependencies discovered mid-milestone, invalidating the schedule
- "90% done" syndrome — no binary exit criteria to call a milestone complete
- risk lists written once at kickoff and never re-reviewed

## Related Agents
- producer
- planner
- technical-design-lead

## Related Commands
- milestone-plan
- plan
- orchestrate

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
