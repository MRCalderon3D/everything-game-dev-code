# Codex Rules Adapter

Codex should treat `rules/` as the authoritative behavior layer.

## Rule loading
- Start from `rules/common/` for engine-neutral standards.
- Add exactly one of `rules/unity/`, `rules/unreal/`, or `rules/godot/` when implementation is engine-specific.
- Use HTML/JS sample guidance only when the active project is explicitly web-based.

## Engine isolation
Never mix implementation guidance from Unity, Unreal, and Godot in the same production task.

## Codex usage
When a task changes code, architecture, QA expectations, release readiness, or documentation, Codex should read the relevant rule file before making or recommending changes.
