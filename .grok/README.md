# Grok Build Adapter

This adapter keeps Grok Build (xAI's `grok` CLI) configuration thin and routes
behavior back to the shared scaffold.

## What Grok Build picks up natively

- **Instructions**: Grok Build reads `AGENTS.md` (and `AGENTS.override.md`) from
  the repo root as its project instructions — the same shared entry point Codex
  and OpenCode use. No Grok-specific instructions file is needed.
- **MCP servers**: `.grok/config.toml` is the project-scoped Grok config; its
  `[mcp_servers.*]` sections are **generated** from `mcp-configs/mcp-servers.json`
  by `npm run sync:mcp` — do not edit it by hand. `${VAR}` env values (e.g.
  `FAL_KEY`) are expanded by Grok at launch, so no secret is written to disk.

## Rule

Never duplicate the shared scaffold into Grok configuration.
Route to `rules/`, `agents/`, `skills/`, and `commands/` in the shared scaffold instead.

## Commands

Grok Build has no project-scoped custom slash commands. When a workflow mentions
a command such as `/plan` or `/gdd`, type the command name in chat and ask Grok
to read and execute the matching `commands/<name>.md` workflow.

## Support tier

Registered in `manifests/harnesses.json` (rules via `AGENTS.md`, pre-wired MCP,
no command wrappers, no hooks). See `docs/harness-support.md`.
