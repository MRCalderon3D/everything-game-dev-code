# scripts/

Scripts automate scaffold setup, validate structural consistency, and power hook handlers. They are the operational layer that keeps the scaffold trustworthy — catching misalignment between agents, commands, skills, and documentation before it causes problems in production use.

## What scripts do

The scaffold is self-referential: agents reference commands, commands invoke agents, skills list related agents, orchestration documents map all three. Scripts verify that these cross-references are correct and that installed components match their declared manifests.

Scripts also handle runtime concerns: activating an engine profile, wiring git hooks, and running the full validation suite.

## Script categories

### Setup and installation

| Script | Purpose |
|--------|---------|
| `setup-profile.js` | Activate an engine profile by writing `.game-dev/profile.json` with the selected engine and a timestamp |
| `install-profile.js` | Bootstrap a profile installation from `install-profiles.json` by resolving components to modules to file paths |
| `setup-git-hooks.js` | Link git hooks to the scaffold's hook handlers for pre-commit validation |

**Usage:**
```bash
node scripts/setup-profile.js --engine unity
node scripts/install-profile.js --profile unity-production
```

### Validation

| Script | Purpose |
|--------|---------|
| `validate-structure.js` | Verify agents, commands, and skills against `command-agent-map.md` and `agent-skill-matrix.md` — catches dangling references |
| `validate-manifests.js` | Validate all three manifest files against their JSON schemas |
| `validate-hooks.js` | Validate `hooks/hooks.json` against `schemas/hooks.schema.json` |
| `validate-references.js` | Cross-reference validation across agents, commands, skills, and docs |
| `validate-generated-assets.js` | Validate accepted generated raster assets against their `generated-assets.json` manifests and PNG transparency rules |
| `validate-structure-artifacts.js` | Check generated artifact consistency between structure documents and actual file lists |
| `lint-markdown.js` | Lint all Markdown files for formatting and broken internal links |

**Usage:**
```bash
node scripts/validate-structure.js
node scripts/validate-manifests.js
node scripts/validate-hooks.js
```

Run all validations at once with the `/verify` command or `node tests/run-all.js`.

### Hook handlers — scripts/hooks/

These scripts are the implementations for the hooks declared in `hooks/hooks.json`. They run via the Node.js hook runtime and receive event context on stdin.

| Handler | Hook phase | Behavior |
|---------|-----------|---------|
| `gdd-sync-warning.js` | PreToolUse | Warn when design-affecting changes lack a corresponding doc update |
| `engine-profile-guard.js` | PreToolUse | Warn when engine-specific work runs without an active engine profile |
| `scene-integrity-check.js` | PreToolUse | Flag high-risk edits to scene, level, or mission files |
| `prefab-blueprint-node-warning.js` | PreToolUse | Warn on heavy changes to prefabs, Blueprints, or node hierarchies |
| `performance-budget-warning.js` | PreToolUse | Warn when performance-sensitive systems are modified |
| `asset-size-warning.js` | PreToolUse | Warn on changes to high-binary-size asset categories |
| `build-matrix-capture.js` | PostToolUse | Capture build and test context for debugging |
| `playtest-capture.js` | PostToolUse | Capture structured playtest note scaffolding |
| `crash-log-capture.js` | PostToolUse | Capture crash metadata and stack trace fragments |
| `session-summary.js` | Stop | Write a structured session summary with decisions, risks, and follow-ups |

### Shared libraries — scripts/lib/

| Library | Exports |
|---------|---------|
| `profile-resolution.js` | `getActiveProfile()`, `detectProfileFromPaths()` — read and infer the active engine profile |
| `structure-artifacts.js` | Agent, command, and skill enumeration; artifact generation for structure validation |
| `utils.js` | Shared I/O: file reading, stdin event parsing, JSON result formatting |
| `validation.js` | Markdown heading and bullet extraction; file listing; cross-reference checks |

## Relationship to other folders

- **hooks/** — hook handlers in `scripts/hooks/` are declared in `hooks/hooks.json`; scripts execute what hooks declare
- **schemas/** — validation scripts use schemas from `schemas/` to validate manifests and hook configuration
- **manifests/** — `install-profile.js` and `setup-profile.js` read from and write to the manifest layer
- **tests/** — the test suite in `tests/` calls many of these scripts to verify scaffold integrity in CI
- **docs/orchestration/** — `validate-structure.js` checks agents and commands against the orchestration maps in this folder
