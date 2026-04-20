# Codex Adapter

This adapter maps the shared scaffold to OpenAI Codex.

## How Codex should consume this repo
- The repository root `AGENTS.md` is the main always-on instruction file for Codex.
- `.codex/config.toml` defines recommended Codex profiles for this scaffold.
- `rules/`, `agents/`, `commands/`, `skills/`, `contexts/`, and `hooks/` remain the shared source of truth.
- The `.codex/` folder explains how those shared layers map to Codex features without becoming a second copy of them.

## Adapter responsibilities
- keep Codex-specific guidance thin
- route slash-style command requests to `commands/`
- map role requests to `agents/` and orchestration docs
- map reusable workflows to repo skills and Codex skill/plugin surfaces where available
- preserve engine isolation between Unity, Unreal, Godot, and HTML/JS work

## Expected workflow
1. Read root `AGENTS.md`.
2. If the user invokes `/command`, read `commands/<command>.md`.
3. Use `docs/orchestration/command-agent-map.md` and `agents/` for role ownership.
4. Use `skills/` for repeatable workflows and progressive context loading.
5. Use `rules/common/` plus exactly one engine layer when implementation is engine-specific.
6. Run validation with `npm run validate` or targeted scripts when scaffold structure changes.

## Codex capability mapping
| Claude-centered scaffold feature | Codex-facing equivalent |
| --- | --- |
| `CLAUDE.md` memory | Root `AGENTS.md` plus `.codex/AGENTS.md` adapter notes |
| `.claude/commands/*.md` wrappers | `.codex/commands/*.md` routing wrappers |
| Claude agents/team routing | Shared `agents/` plus Codex multi-agent delegation when available |
| Claude skills adapter | Shared `skills/` and Codex-compatible `SKILL.md` content |
| Claude hooks | Shared `hooks/` plus `npm run validate` and future Codex hooks integration |
| Claude MCP/tool config | `mcp-configs/` plus `codex mcp` configuration guidance |

## Stability rule
Prefer stable Codex surfaces first: `AGENTS.md`, profiles, shell execution, review mode, MCP, plugins, and skills. Treat experimental Codex hooks or nested AGENTS behavior as optional adapter targets until they are stable.
