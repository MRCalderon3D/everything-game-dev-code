# commands/

Commands are the preferred entry points for work in this scaffold. Each command defines a specific task, the conditions under which it applies, and which agents it invokes. Starting work through a command ensures the right roles are activated and the right standards are applied.

## What commands do

A command is a structured task trigger. When you invoke a command:

- the purpose and scope of the task are declared upfront
- the correct agents are activated for that task type
- engine isolation is preserved — engine-scoped commands only invoke engine-scoped agents
- the output format and quality bar are defined in advance

Commands do not replace judgment. They channel it.

## Command index

### Engine setup

| Command | Purpose |
|---------|---------|
| `/unity-setup` | Initialize Unity project structure, packages, and CI configuration |
| `/unreal-setup` | Initialize Unreal project structure, modules, and build toolchain |
| `/godot-setup` | Initialize Godot project structure, scene layout, and export profiles |
| `/onboarding` | Orient a new contributor to the project scaffold and active context |

### Planning and design

| Command | Purpose |
|---------|---------|
| `/plan` | Break a task into phases, surface risks, wait for confirmation |
| `/gdd` | Author or update the game design document |
| `/tech-design` | Author or update a technical design document |
| `/combat-design` | Design or tune combat systems, abilities, and encounters |
| `/quest-design` | Design quest structure, objectives, and narrative hooks |
| `/level-beat` | Define level beat, pacing, and landmark layout |
| `/milestone-plan` | Define milestone scope, sequencing, and exit criteria |
| `/vertical-slice` | Scope and plan a vertical slice as the core loop proof |

### Development and implementation

| Command | Purpose |
|---------|---------|
| `/tdd` | Implement a feature using test-driven development |
| `/evolve` | Iteratively refine an existing system or feature |
| `/tools-pass` | Improve or extend editor and pipeline tooling |
| `/audio-pass` | Review and implement audio integration for a system or scene |
| `/learn` | Synthesize a learning objective into reusable scaffold knowledge |
| `/skill-create-game` | Create a new game-dev skill for this scaffold |

### Engine review and audit

| Command | Purpose |
|---------|---------|
| `/unity-review` | Review Unity code, scenes, and prefabs for quality and compliance |
| `/unity-scene-audit` | Audit a Unity scene for structural issues and performance risk |
| `/unreal-review` | Review Unreal Blueprints and C++ for quality and compliance |
| `/unreal-blueprint-audit` | Audit Unreal Blueprints for complexity and anti-patterns |
| `/godot-review` | Review Godot GDScript/C# and scenes for quality and compliance |
| `/godot-scene-audit` | Audit a Godot scene for structural issues and performance risk |
| `/multiplayer-review` | Review network architecture, replication, and latency handling |
| `/save-system-review` | Review save/load implementation for correctness and resilience |

### Build and fix

| Command | Purpose |
|---------|---------|
| `/unity-build-fix` | Diagnose and resolve Unity build failures |
| `/unreal-build-fix` | Diagnose and resolve Unreal build failures |
| `/godot-build-fix` | Diagnose and resolve Godot build failures |

### Testing and quality

| Command | Purpose |
|---------|---------|
| `/qa-plan` | Define the test plan for a feature, milestone, or release |
| `/bug-triage` | Classify, prioritize, and assign reported bugs |
| `/playtest-report` | Synthesize playtest session data into a structured report |
| `/cert-check` | Validate a build against console certification requirements |

### Performance and optimization

| Command | Purpose |
|---------|---------|
| `/perf-budget` | Define or review performance budgets for a platform target |
| `/memory-budget` | Define or review memory budgets and allocation patterns |

### Release and live operations

| Command | Purpose |
|---------|---------|
| `/release-check` | Run the full release readiness checklist |
| `/patch-notes` | Generate structured patch notes from recent changes |
| `/liveops-brief` | Plan a live ops event, update, or seasonal content drop |
| `/telemetry-plan` | Define instrumentation strategy and event taxonomy |

### Maintenance and documentation

| Command | Purpose |
|---------|---------|
| `/refactor-clean` | Identify and remove dead code or structural debt |
| `/update-docs` | Sync source-of-truth documents with current implementation |
| `/verify` | Run the full scaffold validation suite |

### Orchestration

| Command | Purpose |
|---------|---------|
| `/orchestrate` | Coordinate a multi-agent workflow across a complex task |

## How to invoke a command

Prefix the command name with `/` when directing the agent:

```
/plan add a combo system to the combat loop
/unity-review Assets/Scripts/Combat/
/release-check build 1.2.0
```

For engine-specific commands, the active engine profile must match the command family. Running `/unity-review` on a Godot project will produce incorrect guidance.

## Relationship to other folders

- **agents/** — each command invokes one or more agents to carry out its work
- **skills/** — agents execute skills as the implementation step within a command
- **rules/** — commands enforce the engine isolation rule by routing to the correct engine layer
- **contexts/** — the active context determines which commands are most relevant for the current phase
- **hooks/** — certain commands trigger hook checks (e.g., build commands trigger the engine profile guard)
- **docs/orchestration/command-agent-map.md** — authoritative mapping of commands to their invoked agents
