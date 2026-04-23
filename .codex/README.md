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

## Raster asset generation in Codex
- When a task is bitmap-first, prefer Codex `$imagegen` over ad-hoc placeholder code or external prompt text files.
- Pair `$imagegen` with the shared scaffold skills that define quality bars and naming rules:
  - `skills/art-audio-content/art-bible/SKILL.md`
  - `skills/art-audio-content/sprite-pipeline/SKILL.md`
  - `skills/art-audio-content/ui-asset-pipeline/SKILL.md`
  - `skills/art-audio-content/placeholder-asset-pipeline/SKILL.md`
- Good fits: concept sheets, painted or textured source art, sprite source PNGs, UI mockups, menu backgrounds, marketing art, and in-project bitmap edits.
- Do not use `$imagegen` for deterministic placeholder generation when `/unity-placeholders` or equivalent is the intended workflow, and do not use it for vector/icon-system work that should stay code-native or SVG-native.
- If the selected image becomes a project asset, move or copy it from `$CODEX_HOME/generated_images/...` into the workspace before treating it as source-of-truth content.

## Stability rule
Prefer stable Codex surfaces first: `AGENTS.md`, profiles, shell execution, review mode, MCP, plugins, and skills. Treat experimental Codex hooks or nested AGENTS behavior as optional adapter targets until they are stable.
