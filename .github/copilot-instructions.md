# GitHub Copilot Repository Instructions

This repository is a scaffold for structured AI-assisted game development across Unity, Unreal, and Godot.

## Repository Intent

Use this repository as a layered workflow system, not as a loose prompt collection.

Prioritize:
- engine isolation
- reusable workflow patterns
- explicit ownership
- source-of-truth documentation
- structured deliverables over ad hoc output

## How To Navigate The Repository

- Start with `README.md` for repository purpose and layout.
- Use `AGENTS.md` for shared agent behavior.
- Use `rules/common/` for engine-neutral standards.
- Use exactly one of `rules/unity/`, `rules/unreal/`, or `rules/godot/` when implementation is engine-specific.
- Use `commands/` as the preferred entry points for recurring workflows.
- Use `skills/` for reusable execution depth.
- Use `contexts/` to adapt priorities by project phase.
- Use `docs/orchestration/` for routing, ownership, and handoffs.

## Working Rules

- Do not mix Unity, Unreal, and Godot implementation guidance in the same production task.
- Keep common layers engine-neutral.
- Prefer extending existing scaffold structure over inventing new top-level patterns.
- Update related docs when design, technical, QA, telemetry, or release decisions change.
- Prefer plans, design docs, technical docs, checklists, and other structured deliverables when the task is non-trivial.

## Repository Maintenance

When changing the scaffold itself:
- keep repository-maintenance guidance in `AGENTS.override.md`
- keep audits, plans, and maintenance notes in `private/`
- preserve flat `agents/`
- preserve flat `commands/`
- preserve grouped `skills/` with `SKILL.md`
- preserve layered `rules/`
- keep harness-specific files thin and pointed back to shared source-of-truth content

## Decision Defaults

When uncertain:
- prefer the common layer for standards
- prefer an engine layer for implementation detail
- prefer a command if one already matches the workflow
- prefer reusable skills over one-off instructions
- prefer explicit updates to source-of-truth files over hidden assumptions
