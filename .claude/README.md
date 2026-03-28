# Claude Adapter

This adapter maps the shared scaffold to Claude Code.

## How Claude should consume this repo
- The repository root `CLAUDE.md` is the main persistent instruction file for Claude Code.
- `rules/`, `agents/`, `commands/`, `skills/`, `contexts/`, and `hooks/` are the shared source of truth.
- The `.claude/` folder exists to explain how those shared layers should be interpreted when working in Claude-centered workflows.

## Adapter responsibilities
- keep Claude-specific guidance thin
- avoid duplicating the common source of truth
- point Claude toward the right shared layer for each task
- preserve engine isolation between Unity, Unreal, and Godot

## Expected workflow
1. Read root `CLAUDE.md`.
2. Route planning to `agents/` and `commands/`.
3. Use `rules/common` plus exactly one engine layer when the task is engine-specific.
4. Use `skills/` for repeatable workflows.
5. Use `hooks/` for automated guards, summaries, and quality checks.
