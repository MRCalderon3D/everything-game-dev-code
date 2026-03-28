# CLAUDE.md

This repository is designed to support role-based, rule-grounded AI-assisted game development.

## Operating Summary

When working in this repository:

- use the scaffold layers intentionally
- keep engine-specific guidance isolated
- prefer structured deliverables over freeform advice
- respect the command → agent → skill → template flow
- update documentation when decisions change

## Preferred Working Order

For most non-trivial requests, the recommended progression is:

1. identify the command or workflow entry point
2. identify the owning agent or role
3. pull in the relevant rules
4. execute with the relevant skills
5. produce a template-backed deliverable when appropriate
6. identify the next validation or handoff step

## Engine Separation

Never blend Unity, Unreal, and Godot implementation patterns inside shared common outputs.

Use:

- `rules/common/` for shared policy
- `rules/unity/` for Unity-specific execution
- `rules/unreal/` for Unreal-specific execution
- `rules/godot/` for Godot-specific execution

The same separation principle should be applied to skills, examples, and install profiles.

## Expected Deliverables

Common deliverable types include:

- Game Design Documents
- Technical Design Documents
- Vertical Slice Plans
- Milestone Plans
- QA Test Plans
- Telemetry Plans
- Release Checklists
- Patch Notes
- Review outputs and audit summaries

## Routing Guidance

If a request is ambiguous, first determine whether it is primarily:

- planning
- design
- engineering
- QA
- release
- liveops
- engine setup or review

Then route it through the corresponding command and agent.

## Documentation Policy

When a decision affects behavior, architecture, quality gates, telemetry, or release expectations, the relevant source-of-truth document should be updated or flagged for update.

## Quality Bar

Outputs should be:

- structurally clear
- specific enough to execute
- aligned with the active engine and install profile
- explicit about risks and trade-offs
- testable and reviewable

## Recommended Files to Check First

- `README.md`
- `AGENTS.md`
- `docs/orchestration/`
- `manifests/install-profiles.json`
- the relevant engine rules pack

## Guiding Principle

Optimize for reusable, role-aware, production-safe outputs rather than one-off answers.
