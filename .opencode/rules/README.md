# OpenCode Rules Adapter

OpenCode should treat `rules/` as the authoritative behavior layer.

## Rule loading
- Start from `rules/common/` for engine-neutral standards.
- Add exactly one of `rules/unity/`, `rules/unreal/`, `rules/godot/`, or `rules/web/` when implementation is engine-specific.

## Engine isolation
Never mix implementation guidance from Unity, Unreal, Godot, and web in the same production task.

## OpenCode usage
When a task changes code, architecture, QA expectations, release readiness, or documentation, OpenCode should read the relevant rule file before making or recommending changes.
