# Codex MCP Adapter

Codex should use `mcp-configs/` as the shared MCP configuration reference.

## Usage
- Keep reusable MCP server definitions in `mcp-configs/`.
- Register local MCP servers with `codex mcp add` when a Codex environment needs them.
- Do not store personal credentials or machine-local secrets in this repository.

## Rule
MCP configuration should extend the scaffold with tools, not replace the shared command, agent, skill, or rule layers.
