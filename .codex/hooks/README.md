# Codex Hooks Adapter

Codex should treat `hooks/` and `scripts/hooks/` as shared workflow guard definitions.

## Current strategy
- Use `npm run validate` for scaffold-wide validation.
- Use targeted scripts such as `npm run validate:hooks`, `npm run validate:structure`, and `npm run validate:references` during maintenance.
- Use `.githooks/` through `npm run setup:hooks` when repository-level Git hooks are desired.

## Codex strategy
Codex hook support should remain a thin adapter over `hooks/hooks.json` and `scripts/hooks/` when available. Do not create Codex-only hook behavior that bypasses the shared hook definitions.
