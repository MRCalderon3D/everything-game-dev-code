# Kilo Adapter

This adapter keeps Kilo configuration thin and routes behavior back to the
shared scaffold.

## What Kilo picks up natively

- **Instructions**: Kilo reads `AGENTS.md` from the repo root as project
  instructions — the same shared entry point Codex, OpenCode, and Grok Build
  use. No Kilo-specific instructions file is needed.
- **Commands**: `.kilo/command/` holds generated slash-command wrappers, one
  per `commands/*.md` (`npm run sync:wrappers`). Do not edit wrappers by hand.
- **MCP servers**: `.kilo/kilo.json` is the project-scoped Kilo config; its
  `mcp` object is **generated** from `mcp-configs/mcp-servers.json` by
  `npm run sync:mcp` — do not edit it by hand. The file is MCP-only so user
  model and permission settings in `./kilo.json` or the global config still
  merge. Env values use Kilo's `{env:VAR}` syntax (e.g. `{env:FAL_KEY}`); set
  the variable in the environment before launch.

## Rule

Never duplicate the shared scaffold into Kilo configuration.
Route to `rules/`, `agents/`, `skills/`, and `commands/` in the shared scaffold instead.

Do not copy `agents/` into `.kilo/agent/` — those files are workflow roles, not
Kilo primary/subagent definitions. Do not copy `skills/` into `.kilo/skills/`.

## Support tier

Registered in `manifests/harnesses.json` (Full: command wrappers + pre-wired MCP,
no hooks). See `docs/harness-support.md`.
