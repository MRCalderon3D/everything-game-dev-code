# manifests/

Manifest files define how the scaffold is divided into installable units and how those units are combined for specific project types. They are the configuration layer between the full scaffold repository and the subset of it that a given project actually needs.

## What manifests do

Not every project needs every part of the scaffold. A Godot indie project does not need Unreal rules. A pre-production team does not need live ops skills. Manifests let you install a focused subset:

- **components** group scaffold blocks into logical units (baseline, engine, domain, capability)
- **modules** map each component to the actual files it installs, using glob patterns
- **profiles** combine components into predefined configurations for common project types

A profile install activates the right rules, agents, commands, skills, and docs for the project — and excludes everything else.

## Files

### engines.json

The engine layer registry — the single source of truth for which engine layers exist. Scripts, tests, and hooks derive engine lists from this file instead of hardcoding them: `scripts/lib/profile-resolution.js` (valid profiles and path detection), `tests/lib/engine-isolation.test.js` (isolation prefixes), and `scripts/validate-engines.js` (structural contract per engine). Array order is path-detection priority — engines with the most specific markers come first.

Each entry declares an `id` (kebab-case, matching `rules/<id>/`, `skills/<id>/`, `agents/<id>-*`, `commands/<id>-*`), a `display` name, `pathMarkers` for project detection, and whether the layer ships a dedicated `buildResolverAgent`.

To add a new engine layer, run `npm run new:engine` rather than editing this file by hand.

### install-components.json

Defines the 18 components that form the scaffold's logical groupings.

**Component families:**

| Family | Components | Purpose |
|--------|-----------|---------|
| `baseline` | rules, agents, commands, skills, docs, contexts | Core scaffold — required for all profiles |
| `engine` | unity, unreal, godot, web | Engine-specific rules, skills, commands, and review agents |
| `domain` | workflow, design, engineering-common, art-audio-content, qa-release | Discipline-specific skill and agent subsets |
| `capability` | multiplayer, liveops, mobile-f2p | Cross-cutting feature capability packs |

Each component declares an `id` (family:name), a `summary`, and the list of `modules` it pulls in.

### install-modules.json

Maps each component to the actual files it installs using glob patterns.

Each module entry specifies:
- `includes` — glob patterns for files to include (e.g., `rules/common/**`, `skills/unity/**/SKILL.md`)
- `excludes` — optional patterns for files to exclude
- `notes` — guidance on how the module should be applied

Modules are the file-resolution layer. Components reference modules by name; modules resolve to paths.

### install-profiles.json

Defines 10 predefined installation profiles for common project configurations.

| Profile | Use when |
|---------|---------|
| `baseline-core` | Exploring the scaffold without committing to an engine |
| `unity-production` | Standard Unity project for a small-to-mid team |
| `unreal-production` | Standard Unreal project for a small-to-mid team |
| `godot-production` | Standard Godot project for a small-to-mid team |
| `web-production` | Standard web (HTML5/canvas) browser game project |
| `unity-multiplayer` | Unity project with explicit multiplayer architecture support |
| `unreal-aaa-console` | Unreal project at AAA or console scale |
| `godot-indie-2d` | Small Godot team with a constrained scope (2D platformer, puzzle, etc.) |
| `mobile-f2p-liveops` | Cross-engine live game with F2P and live ops requirements |
| `preproduction-design-heavy` | Concept and GDD phase before engine selection |

Each profile lists its component set. Profiles that include an engine component should activate only one engine at a time.

## Installation policy

> **One engine at a time.** Installing multiple engine packs in the same active profile causes cross-engine contamination. The manifests enforce `default_active_engine_count: 1`. Install a second engine pack only for comparison, migration planning, or cross-engine research — never for production work.

## How to use manifests

1. Choose the profile that matches your project type from `install-profiles.json`.
2. Run the resolver script: `node scripts/install-profile.js --profile <profile-id>`
3. The script resolves the profile to its component list, then resolves each component to its module list, and records the result under `.game-dev/` (`install-state.json`, `profile.json`, and `install-report.json` with the full resolved file list). Nothing is copied or moved — the scaffold is consumed in place, and the state files tell agents and hooks which profile and engine are active.

To see what a profile installs before running it, inspect the profile's `components` array in `install-profiles.json`, then trace each component's `modules` in `install-components.json`, then check each module's `includes` in `install-modules.json`.

## Relationship to other folders

- **schemas/** — each manifest file is validated against a corresponding JSON schema in `schemas/`
- **scripts/** — `install-profile.js` and `setup-profile.js` resolve manifests into `.game-dev/` state files
- **rules/**, **agents/**, **commands/**, **skills/**, **docs/**, **contexts/** — manifests reference files in all of these folders via module glob patterns
- **examples/** — each example includes an `install-profile.example.json` showing the recommended profile for that project type
