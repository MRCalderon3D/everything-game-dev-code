# hooks/

Hooks connect scaffold rules, agents, and commands to real workflow behavior. They are automated checks that fire at defined points in the agent's work cycle — before a risky action, after a build-like operation, or when a session ends. Hooks do not replace judgment; they surface warnings before mistakes compound.

## What hooks do

Without hooks, workflow problems are only caught after the fact — a scene file changed without a doc update, a build attempted without an active engine profile, a session ended without recording its decisions.

With hooks active:

- risky actions are flagged before the agent proceeds
- doc update prompts fire when design changes are detected
- session summaries are written automatically so decisions are not lost in chat history
- engine profile state is checked before engine-specific work begins

## Hook phases

Hooks fire at four points in the work cycle:

| Phase | When it fires | Typical use |
|-------|--------------|-------------|
| `PreToolUse` | Before the agent uses a tool | Warn about risky actions, check preconditions |
| `PostToolUse` | After the agent uses a tool | Capture context, log structured metadata |
| `Stop` | When the agent stops working | Write session summary |
| `SessionStart` | When a session begins | Restore context, check profile state |

## Active hooks

### PreToolUse — early warnings

| Hook | File | Triggers when |
|------|------|--------------|
| GDD sync warning | `gdd-sync-warning.js` | Design changes detected without a corresponding doc update |
| Engine profile guard | `engine-profile-guard.js` | Engine-specific work attempted without an active engine profile |
| Scene integrity check | `scene-integrity-check.js` | Heavy edits to scene, level, or mission files |
| Prefab/Blueprint/node warning | `prefab-blueprint-node-warning.js` | Significant changes to prefabs, Blueprints, or node hierarchies without clear ownership |
| Performance budget warning | `performance-budget-warning.js` | Modifications to performance-sensitive systems (rendering, physics, memory) |
| Asset size warning | `asset-size-warning.js` | Changes to asset categories with high binary size risk |

### PostToolUse — context capture

| Hook | File | Captures |
|------|------|---------|
| Build matrix capture | `build-matrix-capture.js` | Build configuration, test results, export context for debugging |
| Playtest capture | `playtest-capture.js` | Structured playtest note scaffolding |
| Crash log capture | `crash-log-capture.js` | Crash metadata, stack trace fragments, repro context |

### Stop — session wrap-up

| Hook | File | Produces |
|------|------|---------|
| Session summary | `session-summary.js` | Structured summary of decisions made, risks identified, and follow-ups required |

## Configuration

Hooks are declared in `hooks/hooks.json`. Each entry specifies:

- `matcher` — the condition string that triggers the hook
- `description` — human-readable purpose
- `command` or `script` — the handler to execute
- `enabled` — whether the hook is active (optional, defaults to true)
- `timeout_ms` — maximum execution time before the hook is abandoned (optional)

The JSON structure is validated against `schemas/hooks.schema.json`.

## Runtime conventions

- Hook handlers are Node.js scripts in `scripts/hooks/`
- Shared utilities are in `scripts/lib/`
- Hooks receive event context via stdin as JSON and return results via stdout
- The active engine profile is read from the `GAME_DEV_PROFILE` environment variable
- The workspace root is read from the `WORKSPACE_ROOT` environment variable

## How to adapt hooks to a different harness

The hook scripts are written as reusable Node-based templates. To port them to a different AI harness:

1. Map the harness's event model to the four hook phases above
2. Update the event format in `scripts/lib/utils.js` to match the harness's stdin/stdout contract
3. Confirm the `GAME_DEV_PROFILE` and `WORKSPACE_ROOT` environment variables are set by the harness
4. Validate the updated `hooks.json` against `schemas/hooks.schema.json`

## Relationship to other folders

- **scripts/hooks/** — hook handler implementations; hooks.json declares them, scripts execute them
- **schemas/** — `hooks.schema.json` validates hooks.json structure and field contracts
- **rules/** — the engine profile guard hook enforces the engine isolation rule at runtime
- **manifests/** — the engine profile state written by `scripts/setup-profile.js` is what the profile guard reads
- **tests/hooks/** — `hooks-config.test.js` validates hook configuration in CI
