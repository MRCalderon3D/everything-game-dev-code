# OpenCode Commands Adapter

This folder maps OpenCode-facing command use to the shared `commands/` layer.

## Rule
Do not redefine commands here unless OpenCode-specific prompt structure is truly required.

Each command wrapper should reference the shared command file and add OpenCode-specific adapter behavior (primary agent, engine isolation notes, routing hints).

## Command source of truth
All commands resolve to `commands/<name>.md` in the shared layer. The wrappers here provide OpenCode-specific routing, primary agent ownership, and engine isolation guidance.

## How OpenCode should execute commands
When a user types `/plan`, `/gdd`, `/unity-review`, or another scaffold command:

1. Resolve the name to `.opencode/commands/<name>.md`.
2. Read the wrapper for adapter behavior and primary agent.
3. Read the shared `commands/<name>.md` workflow.
4. Follow its invoked agents, required skills, expected output, and notes.

## Available commands (60)
`plan`, `verify`, `context`, `gdd`, `tdd`, `tech-design`, `vertical-slice`, `milestone-plan`, `orchestrate`, `full-game`, `update-docs`, `combat-design`, `economy-balance`, `level-beat`, `quest-design`, `dialogue-design`, `onboarding`, `art-2d-pass`, `audio-pass`, `ui-asset-pass`, `ui-flow-review`, `animation-pass`, `localization-pass`, `accessibility-pass`, `input-review`, `perf-budget`, `memory-budget`, `multiplayer-review`, `save-system-review`, `tools-pass`, `scene-bootstrap`, `qa-plan`, `playtest-report`, `bug-triage`, `release-check`, `cert-check`, `patch-notes`, `liveops-brief`, `telemetry-plan`, `learn`, `evolve`, `skill-create-game`, `refactor-clean`, `unity-setup`, `unity-review`, `unity-build-fix`, `unity-scene-audit`, `unity-placeholders`, `unreal-setup`, `unreal-review`, `unreal-build-fix`, `unreal-blueprint-audit`, `godot-setup`, `godot-review`, `godot-build-fix`, `godot-scene-audit`, `web-setup`, `web-review`, `web-build-fix`, `web-scene-audit`
