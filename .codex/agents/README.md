# Codex Agent Adapter

Codex should use the shared `agents/` directory as the role source of truth.

## Recommended use
- planning -> `planner`, `producer`
- technical design -> `technical-design-lead`, `architect`
- engine review -> engine-specific reviewer and build resolver
- verification -> `qa-lead`, `code-reviewer`, `performance-reviewer`

## Codex delegation
When Codex multi-agent delegation is available and appropriate, use these shared agent files as role contracts for delegated work. Keep ownership clear, avoid overlapping write scopes, and merge results through the command or plan that started the task.

## Rule
Do not create Codex-only role logic that diverges from the shared agent contracts.
