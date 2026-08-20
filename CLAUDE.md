# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a game**. It is a layered workflow *scaffold* for AI-assisted game development:
a coordinated system of rules, agents, commands, skills, and contexts that a coding assistant
loads to do design, technical design, implementation, QA, release, and live-ops work — while
keeping the Unity, Unreal, Godot, and web (HTML5) execution layers strictly isolated.

The repository's own "code" is a Node.js (>=18, zero runtime deps) tooling layer under `scripts/`
that **validates and generates** the scaffold's content so it can never drift out of sync.

## Commands

```bash
npm test            # node tests/run-all.js — scaffold self-tests
npm run validate    # full validation gate (12 validators + markdown lint); this is what CI runs
npm run doctor      # diagnose install: env, hooks, active engine profile, artifact drift
npm run setup:hooks # install the git pre-commit hook (first-time setup)
```

Individual validators (run when iterating on one concern — faster than the full gate):
`validate:manifests`, `validate:engines`, `validate:hooks`, `validate:schemas`,
`validate:structure`, `validate:references`, `validate:generated-assets`,
`validate:structure-artifacts`, `validate:wrappers`, `validate:graph`, `lint:markdown`.

Run a single test file directly: `node tests/<path>.test.js` (e.g. `node tests/lib/engine-isolation.test.js`).

CI (`.github/workflows/ci.yml`) runs exactly `npm test` then `npm run validate` on Node 18.
The validator list lives **only** in package.json's `validate` script so CI and local runs can't diverge.

## Source of truth vs. generated artifacts

This is the most important thing to understand before editing. Several files are **generated** —
editing them by hand is the failure mode CI guards against (a `*:check` validator re-derives them
and fails if they'd change).

| Edit this (source of truth) | Generates this (do NOT hand-edit) | Sync / check |
|---|---|---|
| `commands/*.md` | `.claude/commands/*`, `.codex/commands/*`, `.opencode/*` | `npm run sync:wrappers` / `validate:wrappers` |
| tracked file tree | `STRUCTURE-TREE.txt`, `docs/structure-overview.md` | `npm run sync:structure` / `validate:structure-artifacts` |
| `hooks/hooks.json` | harness hook wiring | `npm run sync:hook-wiring` |
| scaffold layers | `docs/dependency-graph.*` | `npm run sync:graph` / `validate:graph` |

Workflow when you change a source file: edit the source → run the matching `sync:*` → commit both.
The pre-commit hook (`.githooks/pre-commit`) auto-runs `sync:structure` + structure/markdown
validation and stages the regenerated artifacts, so structure drift is caught before it lands.

Structure artifacts are derived from `git ls-files`, not a filesystem walk — untracked/gitignored
content never leaks in, and local output matches what CI regenerates from a clean checkout.

## Architecture

**Layered scaffold (engine-neutral core, top of repo):**
- `rules/` — policy and "what good looks like". Resolution order is `rules/common/` first, then
  exactly **one** engine layer (`rules/unity/` | `rules/unreal/` | `rules/godot/` | `rules/web/`).
- `agents/` — flat list of specialized roles (who owns the work).
- `commands/` — flat list of workflow entry points. A slash command like `/gdd` resolves to
  `commands/gdd.md`; read that file and follow its declared agents/skills/output before acting.
- `skills/` — reusable execution patterns, **grouped by category**, each leaf a folder with a `SKILL.md`.
- `contexts/` — phase-specific priority shifts (e.g. prototype vs. release).
- `hooks/` — workflow safety automation (`hooks/hooks.json` is the source).
- `manifests/` — install profiles/components and three key registries: `engines.json` (the single
  source of truth for which engine layers exist; array order is path-detection priority),
  `harnesses.json` (which harness adapters exist and what each supports — wrappers, MCP, and
  doctor checks derive from it), and `asset-providers.json` (capability→model routing for AI
  asset generation).
- `schemas/` — JSON Schema (ajv) validation for every manifest, hook config, and plugin.
- `docs/templates/` — structured deliverable templates (GDD, TDD, QA plan, etc.).

**Tooling layer (`scripts/`):** generators (`generate-*`, `new-engine`, `sync-*`), validators
(`validate-*`), and `doctor.js`. Shared logic lives in `scripts/lib/` — notably `engines.js`
(all engine lists derive from `manifests/engines.json`), `structure-artifacts.js`, and
`profile-resolution.js`. Per-event hook implementations are in `scripts/hooks/`.

**Harness adapters** (`.claude/`, `.codex/`, `.cursor/`, `.opencode/`, `.kiro/`, `.grok/`, `.kilo/`): each points back
to the shared scaffold rather than being a second source of truth. Their command wrappers are generated.

## Engine isolation (hard rule)

Never combine two engine layers in one implementation pass, and never put engine-specific runtime
details into a `common/` document. Shared docs describe **intent, ownership, and quality bars**;
engine docs describe **implementation conventions inside that one engine only**. This is enforced
by `tests/lib/engine-isolation.test.js` and `engine-content-isolation.test.js` — adding cross-engine
references will fail the suite.

Adding a new engine layer is done via `npm run new:engine` (driven by `manifests/engines.json`),
not by hand-creating directories. Likewise, a new harness adapter is added via
`npm run new:harness` (driven by `manifests/harnesses.json`).

## Conventions to preserve

- Keep `agents/` and `commands/` **flat**; keep `skills/` **grouped** with a `SKILL.md` per leaf.
- Prefer a command if one exists; prefer a reusable skill over one-off instructions; prefer the
  common layer for standards and the engine layer for implementation detail.
- Don't create duplicate sources of truth or invent new top-level structure without justification.
- When a decision changes design/tech/test/telemetry/release expectations, update the relevant
  source-of-truth doc (or recommend it) — keep documents alive.
- Plan before non-trivial (multi-step / multi-role / architectural) work.
