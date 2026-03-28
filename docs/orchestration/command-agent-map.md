# Command / Agent Map

This file defines the default agent routing for each command. Commands may invoke multiple agents, but one primary owner should remain responsible for the final output.

## Usage Rules
- The first listed agent is the default owner.
- Additional agents are supporting contributors or reviewers.
- If a command affects scope, architecture, and release risk at once, involve `planner`, `producer`, and the relevant lead role.

## Core Planning and Documentation

### /plan
Primary: `planner`
Support:
- `producer`
- `technical-design-lead`
- `gdd-designer`

### /gdd
Primary: `gdd-designer`
Support:
- `systems-designer`
- `producer`
- `doc-updater`

### /tech-design
Primary: `technical-design-lead`
Support:
- `architect`
- `gameplay-programmer`
- `doc-updater`

### /vertical-slice
Primary: `planner`
Support:
- `producer`
- `gdd-designer`
- `technical-design-lead`

### /milestone-plan
Primary: `producer`
Support:
- `planner`
- `technical-design-lead`
- `qa-lead`

### /orchestrate
Primary: `planner`
Support:
- whichever domain leads are required by the request

### /update-docs
Primary: `doc-updater`
Support:
- current document owner
- `producer` when milestone docs are affected

## Verification, Testing, and Review

### /tdd
Primary: `technical-design-lead`
Support:
- `gameplay-programmer`
- `code-reviewer`
- `qa-lead`

### /verify
Primary: `qa-lead`
Support:
- `code-reviewer`
- `performance-reviewer`
- relevant engine reviewer

### /qa-plan
Primary: `qa-lead`
Support:
- `producer`
- `technical-design-lead`
- domain owner

### /playtest-report
Primary: `playtest-analyst`
Support:
- `gdd-designer`
- `systems-designer`
- `producer`

### /bug-triage
Primary: `qa-lead`
Support:
- `producer`
- owning implementation agent
- `release-manager` when milestone risk is affected

### /refactor-clean
Primary: `refactor-cleaner`
Support:
- `architect`
- `code-reviewer`
- owning implementation agent

## Design Commands

### /combat-design
Primary: `combat-designer`
Support:
- `systems-designer`
- `playtest-analyst`

### /economy-balance
Primary: `economy-designer`
Support:
- `systems-designer`
- `telemetry-analyst`
- `mobile-f2p-analyst`

### /level-beat
Primary: `level-designer`
Support:
- `gdd-designer`
- `narrative-designer`

### /quest-design
Primary: `narrative-designer`
Support:
- `level-designer`
- `systems-designer`

### /onboarding
Primary: `ui-ux-designer`
Support:
- `gdd-designer`
- `systems-designer`
- `accessibility-reviewer`

### /liveops-brief
Primary: `liveops-manager`
Support:
- `economy-designer`
- `telemetry-analyst`
- `release-manager`

### /telemetry-plan
Primary: `telemetry-analyst`
Support:
- `technical-design-lead`
- `economy-designer`
- `qa-lead`

## Technical Budget and Systems Review

### /perf-budget
Primary: `performance-reviewer`
Support:
- `technical-artist`
- `build-engineer`
- relevant engine reviewer

### /memory-budget
Primary: `performance-reviewer`
Support:
- `technical-artist`
- `build-engineer`
- relevant engine reviewer

### /multiplayer-review
Primary: `network-programmer`
Support:
- `technical-design-lead`
- relevant engine reviewer
- `qa-lead`

### /save-system-review
Primary: `technical-design-lead`
Support:
- `gameplay-programmer`
- `qa-lead`
- relevant engine reviewer

### /ui-flow-review
Primary: `ui-ux-designer`
Support:
- `ui-programmer`
- `accessibility-reviewer`
- `qa-lead`

### /audio-pass
Primary: `audio-designer`
Support:
- `accessibility-reviewer`
- `qa-lead`

### /tools-pass
Primary: `tools-programmer`
Support:
- `technical-artist`
- `code-reviewer`

## Release and Compliance

### /release-check
Primary: `release-manager`
Support:
- `qa-lead`
- `producer`
- `build-engineer`
- `console-compliance-reviewer` when needed

### /cert-check
Primary: `console-compliance-reviewer`
Support:
- `release-manager`
- `qa-lead`
- relevant engine reviewer

### /patch-notes
Primary: `release-manager`
Support:
- `producer`
- `doc-updater`
- domain owners as needed

## Learning and Skill Evolution

### /learn
Primary: `doc-updater`
Support:
- `planner`
- `producer`
- domain owner

### /evolve
Primary: `planner`
Support:
- `doc-updater`
- `technical-design-lead`
- relevant domain lead

### /skill-create-game
Primary: `planner`
Support:
- `doc-updater`
- owning domain lead

## Engine-Specific Commands

### /unity-setup
Primary: `unity-reviewer`
Support:
- `technical-design-lead`
- `build-engineer`

### /unity-review
Primary: `unity-reviewer`
Support:
- owning domain agent
- `code-reviewer`

### /unity-build-fix
Primary: `unity-build-resolver`
Support:
- `build-engineer`
- `unity-reviewer`

### /unity-scene-audit
Primary: `unity-reviewer`
Support:
- `technical-artist`
- `qa-lead`

### /unreal-setup
Primary: `unreal-reviewer`
Support:
- `technical-design-lead`
- `build-engineer`

### /unreal-review
Primary: `unreal-reviewer`
Support:
- owning domain agent
- `code-reviewer`

### /unreal-build-fix
Primary: `unreal-build-resolver`
Support:
- `build-engineer`
- `unreal-reviewer`

### /unreal-blueprint-audit
Primary: `unreal-reviewer`
Support:
- `technical-artist`
- `qa-lead`

### /godot-setup
Primary: `godot-reviewer`
Support:
- `technical-design-lead`
- `build-engineer`

### /godot-review
Primary: `godot-reviewer`
Support:
- owning domain agent
- `code-reviewer`

### /godot-build-fix
Primary: `godot-build-resolver`
Support:
- `build-engineer`
- `godot-reviewer`

### /godot-scene-audit
Primary: `godot-reviewer`
Support:
- `technical-artist`
- `qa-lead`
