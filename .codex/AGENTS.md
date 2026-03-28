# AGENTS.md for Codex

## Project purpose
This repository is a game-development agent scaffold with shared layers for rules, agents, commands, skills, contexts, hooks, and harness adapters.

## Instruction hierarchy
- Root-level project guidance belongs in this file and in the repo's main `AGENTS.md`.
- Shared workflow logic lives in `agents/`, `commands/`, `skills/`, and `rules/`.
- Use engine-neutral guidance by default.
- Only load one engine-specific rule/skill family at a time unless the task is explicitly comparative research.

## How to work in this repo
1. Start from `commands/` if the task maps to a named workflow.
2. Use `agents/` to pick role ownership.
3. Use `skills/` for repeatable execution patterns.
4. Use `rules/common/` plus one engine layer if implementation is engine-specific.
5. Keep docs, QA, telemetry, and release implications explicit.

## Engine isolation
Never mix Unity, Unreal, and Godot implementation advice in the same production task.

## Expected outputs
- plans with owners and risks
- design and technical docs when needed
- implementation that respects the chosen engine layer
- verification notes and doc updates when behavior changes
