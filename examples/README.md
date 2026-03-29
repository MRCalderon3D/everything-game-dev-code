# examples/

Example projects demonstrate how to configure the scaffold for specific game types and team sizes. Each example includes a recommended install profile, sample documents filled in for a fictional game, and notes on which agents, commands, and skills are most relevant for that configuration.

## What examples do

The scaffold has many moving parts. Examples show how they fit together for a concrete scenario:

- which installation profile to select
- which agents are active and what they own
- which commands to reach for first
- which skills provide the most value for the project type
- what risks to watch for specific to that configuration

Examples are not starter templates. They do not contain engine project files. They are reference configurations and sample documents that illustrate the scaffold in use.

## Available examples

### cross-engine-gdd/

**Game:** Emberfall — third-person action adventure for PC and console
**Purpose:** Shows how to write an engine-neutral game design document that works across all three engines without leaking implementation details.

Key characteristics:
- GDD written entirely without engine-specific component patterns
- Player verbs and systems defined abstractly (move, jump, dash, interact, attack, guard)
- Technical design handoff document included, showing where engine-specific detail belongs
- Intentionally defers engine selection to demonstrate the `preproduction-design-heavy` profile

Files: `game-design-document.md`, `technical-design-handoff.md`, `README.md`

---

### godot-2d-platformer/

**Game:** Clockspring — 2D precision platformer for a small indie team
**Profile:** `godot-indie-2d`

Recommended agents: `planner`, `level-designer`, `gameplay-programmer`, `godot-reviewer`, `qa-lead`, `doc-updater`

Key commands: `/plan`, `/vertical-slice`, `/godot-setup`, `/godot-review`, `/godot-scene-audit`, `/verify`

High-value skills: `godot-project-structure`, `godot-scene-architecture`, `godot-gdscript-standards`, `godot-performance`, `level-design`, `onboarding-tutorial-design`, `qa-test-matrix`

Risks to watch: scene sprawl, signal misuse, save/load inconsistency, physics feel drift, editor-only assumptions in release builds

Files: `install-profile.example.json`, `playtest-report.md`, `qa-test-matrix.md`, `README.md`

---

### unity-action-rpg/

**Game:** Ashen Veil — action RPG for a small-to-mid team targeting PC and console
**Profile:** `unity-production` + `domain:design` + `domain:art-audio-content`

Recommended agents: `planner`, `systems-designer`, `combat-designer`, `gameplay-programmer`, `unity-reviewer`, `qa-lead`, `technical-artist`, `release-manager`

Key commands: `/plan`, `/gdd`, `/tech-design`, `/combat-design`, `/unity-setup`, `/unity-review`, `/perf-budget`, `/release-check`

High-value skills: `unity-project-structure`, `unity-gameplay-patterns`, `unity-performance`, `unity-addressables`, `combat-design`, `progression-design`, `qa-test-matrix`

Risks to watch: prefab sprawl, ScriptableObject misuse, Addressables drift, scene initialization order bugs, memory spikes on level load

Files: `install-profile.example.json`, `vertical-slice-plan.md`, `telemetry-plan.md`, `README.md`

---

### unreal-fps/

**Game:** Unreal-based first-person shooter targeting PC and console
**Profile:** `unreal-production` (or `unreal-aaa-console` for larger scope)

Recommended agents: `planner`, `gameplay-programmer`, `network-programmer`, `unreal-reviewer`, `performance-reviewer`, `qa-lead`, `release-manager`

Key commands: `/plan`, `/tech-design`, `/unreal-setup`, `/unreal-review`, `/unreal-blueprint-audit`, `/perf-budget`, `/multiplayer-review`, `/release-check`

High-value skills: `unreal-project-structure`, `unreal-gameplay-framework`, `unreal-cpp-standards`, `unreal-blueprint-patterns`, `unreal-performance`, `unreal-replication`, `console-certification`

Files: `release-checklist.md`, `README.md`

## How to use an example

1. Read the example's `README.md` to confirm the project type matches your situation.
2. Copy the `install-profile.example.json` to your project root and rename it `install-profile.json`.
3. Run `node scripts/install-profile.js` to install the recommended scaffold subset.
4. Use the sample documents as a format reference when authoring your own GDD, TDD, or test plans.

## Relationship to other folders

- **manifests/** — each example references a profile from `install-profiles.json`
- **docs/templates/** — sample documents in examples are filled-in instances of the templates
- **contexts/** — examples note which context files are most relevant for the starting phase
- **scripts/** — `install-profile.js` executes the profile referenced in the example's JSON
