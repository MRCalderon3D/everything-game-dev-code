# skills/

Skills are reusable execution patterns. Where rules say what good looks like, and commands say how work starts, skills define how work is carried out well. Each skill is a self-contained, step-by-step procedure with explicit inputs, outputs, quality criteria, and failure modes.

## What skills do

A skill gives an agent a concrete, repeatable process for a specific task. Without a skill, an agent falls back on generic behavior. With a skill loaded:

- the agent follows a defined process rather than improvising
- inputs and outputs are declared, so handoffs are clean
- quality criteria are explicit, so done means done
- common failure modes are documented, so the agent avoids known pitfalls

Skills are invoked by agents when executing commands. They are not invoked directly.

## Skill domains

Skills are organized into eight domain folders. Each skill lives in its own subfolder with a `SKILL.md` file.

### art-audio-content/

Skills for producing and integrating creative assets.

| Skill | Purpose |
|-------|---------|
| `art-bible` | Define a visual direction artists, UI, technical art, and marketing can execute consistently |
| `audio-implementation` | Integrate audio assets into the engine with consistent mixing, triggering, and fallback rules |
| `cinematic-pipeline` | Define cutscene production from animatic to in-engine delivery |
| `dialogue-content-pipeline` | Structure dialogue authoring, localization handoff, and runtime integration |
| `localization-pipeline` | Prepare text, audio, and assets for localized builds |
| `technical-art-pipeline` | Define the shader, VFX, and rig pipeline from DCC tools to engine |
| `vfx-pipeline` | Produce and integrate visual effects from concept to in-game playback |

### design/

Skills for game design work across all genres and phases.

| Skill | Purpose |
|-------|---------|
| `accessibility-design` | Design input, visual, and audio options that meet accessibility standards |
| `combat-design` | Define the combat loop, ability vocabulary, and encounter tuning process |
| `core-loop-design` | Define the primary player activity and the support loops that sustain it |
| `economy-balancing` | Balance resource income, spend, and progression curves against player psychology |
| `level-design` | Design level layout, pacing, landmark placement, and player guidance |
| `liveops-design` | Design live events, seasonal content, and limited-time mechanics |
| `monetization-design` | Define monetization strategy and validate against retention and fairness |
| `narrative-design` | Structure story beats, character arcs, and world-building for player agency |
| `onboarding-tutorial-design` | Design first-hour experience that teaches through play, not interruption |
| `progression-design` | Define player growth curves, unlock gates, and mastery signals |
| `quest-design` | Design quest structure, objective clarity, and branching outcomes |

### engineering-common/

Engine-neutral engineering patterns applicable across Unity, Unreal, and Godot.

| Skill | Purpose |
|-------|---------|
| `ai-behavior-patterns` | Implement NPC behavior trees, state machines, and utility AI |
| `animation-state-patterns` | Structure animation graphs for readable, maintainable playback logic |
| `asset-management` | Organize, reference, and load assets with predictable runtime behavior |
| `build-pipeline-patterns` | Configure CI builds, artifact output, and platform packaging |
| `event-bus-patterns` | Decouple systems using an event bus with defined message contracts |
| `gameplay-architecture` | Structure the core game loop, scene lifecycle, and state management |
| `input-abstraction` | Abstract input handling for keyboard, gamepad, and touch with rebinding support |
| `memory-budgeting` | Track allocation by system, set platform budgets, and enforce limits |
| `multiplayer-netcode-patterns` | Implement authoritative server, prediction, and reconciliation patterns |
| `performance-budgeting` | Define per-platform CPU/GPU/memory budgets and enforce them during development |
| `physics-gameplay-patterns` | Use physics for gameplay feel with deterministic, tunable results |
| `save-system-patterns` | Implement save/load with versioning, corruption detection, and migration |
| `telemetry-instrumentation` | Instrument events for retention, funnel, and system-health analysis |
| `tools-pipeline-patterns` | Build editor extensions and pipeline scripts that reduce manual workflow |
| `ui-hud-patterns` | Structure HUD and menu systems for scalability and controller support |

### godot/

Godot-specific engineering skills. Only apply within a Godot project.

| Skill | Purpose |
|-------|---------|
| `godot-build-release` | Configure export profiles, signing, and release packaging for Godot |
| `godot-csharp-patterns` | Apply idiomatic C# in Godot with proper lifecycle and signal integration |
| `godot-editor-tooling` | Build Godot editor plugins and pipeline tools using EditorPlugin |
| `godot-gdscript-standards` | Write readable, maintainable GDScript following community standards |
| `godot-performance` | Profile and optimize Godot projects against platform performance budgets |
| `godot-project-structure` | Organize a Godot project for team clarity and maintainability |
| `godot-resource-management` | Load, cache, and unload Godot resources without memory leaks |
| `godot-scene-architecture` | Structure scenes for reuse, clear ownership, and minimal coupling |
| `godot-signals-patterns` | Use Godot signals for clean decoupled communication between nodes |
| `godot-testing` | Test GDScript and C# code using GUT or equivalent test frameworks |

### unity/

Unity-specific engineering skills. Only apply within a Unity project.

| Skill | Purpose |
|-------|---------|
| `unity-addressables` | Use Addressables with explicit grouping, loading, updating, and fallback rules |
| `unity-build-release` | Configure Unity build pipeline for target platforms and release packaging |
| `unity-csharp-standards` | Write idiomatic, testable C# in Unity respecting lifecycle order |
| `unity-editor-tooling` | Build custom inspectors, editor windows, and pipeline scripts in Unity |
| `unity-gameplay-patterns` | Structure Unity-specific gameplay systems for maintainability |
| `unity-input-system` | Implement the new Unity Input System with rebinding and multi-device support |
| `unity-performance` | Profile and optimize Unity projects against platform performance budgets |
| `unity-project-structure` | Organize a Unity project's Assets folder for team clarity and maintainability |
| `unity-testing` | Write Play Mode and Edit Mode tests using Unity Test Framework |
| `unity-urp-hdrp` | Use URP or HDRP render pipelines with correct settings and custom pass patterns |

### unreal/

Unreal Engine-specific engineering skills. Only apply within an Unreal project.

| Skill | Purpose |
|-------|---------|
| `unreal-blueprint-patterns` | Use Blueprints for designer-owned logic with clear C++ boundaries |
| `unreal-build-release` | Configure Unreal build, cooking, packaging, and platform submission |
| `unreal-cpp-standards` | Write idiomatic Unreal C++ respecting the UObject lifecycle and reflection system |
| `unreal-editor-tooling` | Build Unreal Editor utilities, slate widgets, and pipeline automation |
| `unreal-gameplay-framework` | Use GameMode, GameState, PlayerController, and Pawn correctly |
| `unreal-gas-patterns` | Implement the Gameplay Ability System with attributes, effects, and cues |
| `unreal-performance` | Profile and optimize Unreal projects against platform performance budgets |
| `unreal-project-structure` | Organize an Unreal project's Content and Source directories for team clarity |
| `unreal-replication` | Implement server-authoritative replication for multiplayer gameplay |
| `unreal-testing` | Write Unreal automated tests using the Automation Testing Framework |

### qa-release/

Skills for quality assurance and release delivery.

| Skill | Purpose |
|-------|---------|
| `bug-triage` | Classify, prioritize, and assign bugs with reproducible steps and severity |
| `compliance-checklists` | Validate builds against platform-holder technical requirements |
| `console-certification` | Prepare a build for Sony, Microsoft, or Nintendo certification submission |
| `crash-triage` | Diagnose crash reports with stack traces, repro steps, and root-cause analysis |
| `qa-test-matrix` | Define test coverage by feature, platform, and risk area |
| `release-readiness` | Validate that a build meets all exit criteria before submission |
| `store-submission` | Prepare store assets, metadata, and build packages for platform stores |

### workflow/

Skills for planning, documentation, and scaffold-level coordination.

| Skill | Purpose |
|-------|---------|
| `continuous-learning` | Capture and integrate lessons from playtests, incidents, and milestones |
| `gdd-writing` | Write and maintain a game design document as a living source of truth |
| `milestone-planning` | Define milestone scope, sequencing, and exit criteria |
| `orchestration-patterns` | Coordinate multi-agent workflows with clean handoffs and role boundaries |
| `playtest-analysis` | Synthesize playtest observations into prioritized, actionable findings |
| `risk-register` | Track production risks with likelihood, impact, and mitigation plans |
| `tdd-workflow` | Implement features test-first with clear acceptance criteria |
| `technical-design-document` | Write and maintain a technical design document as a living source of truth |
| `verification-loop` | Verify that implemented work matches its design intent and exits cleanly |
| `vertical-slice-planning` | Scope a vertical slice as a proof of the core loop, not a demo |

## Skill file format

Each skill uses a standard YAML frontmatter block followed by a ten-section body:

```yaml
---
name: skill-name
description: One-line purpose statement
origin: everything-game-dev-code
category: domain-name
---
```

The body sections are: **Purpose**, **Use When**, **Inputs**, **Process**, **Outputs**, **Quality Bar**, **Common Failure Modes**, **Related Agents**, **Related Commands**, **Notes**.

## Relationship to other folders

- **agents/** — agents execute skills; skills are the work unit, agents are the identity
- **commands/** — commands trigger agents which invoke the relevant skill for the task
- **rules/** — skills reference the rules layer for engine-specific implementation detail; they do not duplicate it
- **contexts/** — the active context signals which skill domains are highest priority for the current phase
- **docs/orchestration/agent-skill-matrix.md** — authoritative mapping of agents to their primary and secondary skills
