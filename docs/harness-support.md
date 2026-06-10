# Harness Support Matrix

Each AI harness gets a declared support tier. The tier states what an adapter
exposes — and what it deliberately does not — so coverage differences are a
documented decision instead of silent drift.

## Tiers

- **Full** — command wrappers for all shared commands, generated from
  `commands/` (`npm run sync:wrappers`); rules routing; validated parity.
- **Rules + hooks** — no command surface; the harness consumes shared rules
  and runs the workflow hooks.
- **Rules only** — the harness consumes shared rules/steering docs.
- **Experimental** — reserved structure, no commitment.

## Matrix

| Adapter | Tier | Commands | Rules | Hooks | Notes |
|---------|------|----------|-------|-------|-------|
| `.claude/` | Full | 50 generated wrappers | `CLAUDE.md` + shared `rules/` | 10, generated `settings.json` block (warn-only adapter) | Primary harness; plugin packaging lives in `.claude-plugin/` |
| `.codex/` | Full | 50 generated wrappers | `AGENTS.md` + shared `rules/` | none (run `npm run validate` manually) | |
| `.opencode/` | Full | 50 generated wrappers + `opencode.json` registry | `AGENTS.md` + shared `rules/` | none | |
| `.cursor/` | Rules + hooks | none by design | `.cursor/rules/*.mdc` | 10, generated `hooks.json` | |
| `.kiro/` | Rules only | none by design | `.kiro/steering/*.md` | none | |
| `.agents/` | Experimental | none | none | none | Reserved for external-agent compatibility |

## Generation and enforcement

All Full-tier command wrappers and all hook wiring are generated — never edit
them by hand:

- `npm run sync:wrappers` regenerates command wrappers and the OpenCode
  command registry from `commands/*.md` frontmatter and `Invokes Agents`.
- `npm run sync:hook-wiring` regenerates `.claude/settings.json` (hooks block)
  and `.cursor/hooks.json` from `hooks/hooks.json`.
- `npm run validate` fails when committed wrappers or wiring drift from what
  the generators would produce (`validate:wrappers`, `validate:hooks`).

To raise an adapter's tier, add a builder to the generators rather than
hand-copying content — one source of truth per concept.
