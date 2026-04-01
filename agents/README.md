# agents/

Agent files define the specialized roles that carry out work in this scaffold. Each agent has a fixed identity, a set of responsibilities, and a declared toolset. When a command invokes an agent, it activates that agent's behavior and constraints for the duration of the task.

## What agents do

Agents are not generic AI assistants. Each agent represents a specific game development role with bounded authority:

- it knows what it is responsible for
- it knows what it should escalate or hand off
- it uses only the tools its role requires
- it applies only the rules relevant to its domain

Agents do not self-select. Commands route work to agents. Agents do not cross engine boundaries unless explicitly scoped to do so.

## Agent roster

### Programming

| Agent | Responsibility |
|-------|---------------|
| `gameplay-programmer` | Core game loop, player systems, game state |
| `ai-programmer` | NPC behavior, pathfinding, decision systems |
| `animation-programmer` | Animation state machines, rigging integration |
| `physics-programmer` | Physics simulation, collision, ragdoll |
| `network-programmer` | Multiplayer, replication, latency handling |
| `ui-programmer` | HUD, menus, input binding, controller support |
| `tools-programmer` | Editor extensions, pipeline automation, CI tooling |

### Engine-specific review and build

| Agent | Responsibility |
|-------|---------------|
| `unity-reviewer` | Code and scene quality review for Unity projects |
| `unity-build-resolver` | Diagnose and fix Unity build failures |
| `unreal-reviewer` | Blueprint and C++ quality review for Unreal projects |
| `unreal-build-resolver` | Diagnose and fix Unreal build failures |
| `godot-reviewer` | GDScript/C# and scene quality review for Godot projects |
| `godot-build-resolver` | Diagnose and fix Godot build failures |

### Design

| Agent | Responsibility |
|-------|---------------|
| `gdd-designer` | Game design document authoring and maintenance |
| `systems-designer` | Gameplay systems architecture and interconnections |
| `combat-designer` | Combat feel, tuning, ability and encounter design |
| `level-designer` | Level layout, pacing, landmark placement |
| `narrative-designer` | Story structure, dialogue, quest writing |
| `economy-designer` | Resource balance, progression curves, monetization design |
| `ui-ux-designer` | Player-facing interface flow, accessibility, clarity |
| `technical-artist` | Shaders, VFX, rig constraints, art-to-engine pipeline |
| `2d-artist` | 2D art pipeline — sprites, tilemaps, 2D animations, placeholders |

### Production and leadership

| Agent | Responsibility |
|-------|---------------|
| `planner` | Breaks work into phases, identifies risks, waits for confirmation |
| `producer` | Milestone tracking, scope management, team coordination |
| `architect` | High-level system design decisions, technical tradeoffs |
| `technical-design-lead` | Technical design document ownership, cross-system consistency |
| `build-engineer` | Build pipeline setup, CI configuration, platform toolchains |
| `release-manager` | Release checklist, submission coordination, hotfix triage |

### Quality assurance

| Agent | Responsibility |
|-------|---------------|
| `qa-lead` | Test plan ownership, regression coordination, bug triage |
| `playtest-analyst` | Synthesizing playtest session data into actionable findings |
| `performance-reviewer` | Profiling review, budget validation, systemic optimization |
| `code-reviewer` | Code quality, readability, maintainability |
| `accessibility-reviewer` | Accessibility standards, input remapping, visual options |
| `security-reviewer` | Save data integrity, network security, anti-cheat surface |
| `console-compliance-reviewer` | Platform certification requirements (Sony, Microsoft, Nintendo) |

### Analytics and live operations

| Agent | Responsibility |
|-------|---------------|
| `telemetry-analyst` | Instrumentation review, funnel analysis, retention signals |
| `liveops-manager` | Event scheduling, patch coordination, economy health |
| `mobile-f2p-analyst` | F2P retention loops, monetization health, content cadence |

### Documentation and maintenance

| Agent | Responsibility |
|-------|---------------|
| `doc-updater` | Keeping source-of-truth documents current with implementation |
| `refactor-cleaner` | Identifying and removing dead code, structural debt |

## How to select an agent

Commands handle agent selection automatically. If you are routing work manually:

1. Match the task domain to the agent's responsibility column above.
2. If the task spans multiple domains, start with the primary domain agent and let it hand off.
3. For engine-specific work, always use an engine-scoped agent (`unity-*`, `unreal-*`, `godot-*`) rather than a generic programming agent.
4. Use `planner` before any non-trivial multi-step task to get a confirmed plan first.

## Agent file format

Each agent file uses a standard YAML frontmatter block followed by role definition:

```yaml
---
name: agent-name
description: One-line purpose statement
tools: [Read, Grep, Glob, Edit, Write, Bash]
model: opus
---
```

The body defines the role, responsibilities, escalation triggers, and handoff rules.

## Relationship to other folders

- **commands/** — commands invoke agents; an agent does not run without a command routing to it
- **rules/** — agents apply `rules/common/` plus one engine-specific layer; they do not cross engines
- **skills/** — agents execute skills as the concrete work unit within a task
- **contexts/** — active context determines which agents are primary for the current phase
- **hooks/** — hooks can surface warnings that block or redirect agent behavior
