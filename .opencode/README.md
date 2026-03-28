# OpenCode Adapter

This adapter maps the shared scaffold to OpenCode.

## Key conventions
- OpenCode supports project rules via `AGENTS.md`.
- OpenCode supports JSON or JSONC config files.
- OpenCode supports custom commands and custom tools.

## Adapter strategy
- keep durable project instructions in shared `AGENTS.md`
- keep workflow definitions in `commands/`, `skills/`, and `rules/`
- use `.opencode/` for OpenCode-specific config, command routing, and tool/plugin notes
