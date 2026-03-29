# rules/

Rules define what good looks like. They are non-negotiable quality standards that apply across every agent, command, and skill in the scaffold. Rules say what to do. Skills explain how to do it.

## How the rule layers work

Rules are organized into a base layer and three engine-specific override layers. When an agent applies rules, it always starts with `common/` and then applies exactly one engine layer — never two.

```
rules/common/      ← universal game development standards
rules/unity/       ← Unity-only additions and overrides
rules/unreal/      ← Unreal-only additions and overrides
rules/godot/       ← Godot-only additions and overrides
```

The engine layer does not replace `common/`. It extends and specializes it. A rule that exists in `common/` and also in an engine layer means: follow the common principle, then apply the engine-specific implementation detail.

## Rule domains

### common/ — 18 rule files

| Rule | Scope |
|------|-------|
| `accessibility` | Input remapping, visual options, audio alternatives, cognitive load |
| `agents` | Agent behavior, role boundaries, escalation, and handoff |
| `asset-pipeline` | Asset naming, organization, import settings, and runtime loading |
| `build-release` | Build configuration, CI requirements, artifact naming, and platform packaging |
| `coding-style` | Correctness, clarity, explicit intent, data-driven approaches, testability |
| `documentation` | Source-of-truth documents, update triggers, and doc ownership |
| `game-design` | Core loop integrity, player agency, feedback loops, and balance principles |
| `memory` | Allocation budgets, pooling, reference lifetime, and platform limits |
| `narrative` | Story structure, dialogue quality, world-building consistency |
| `performance` | Budget-first approach, profiling on representative scenarios, systemic optimization |
| `production-workflow` | Milestone discipline, scope management, risk visibility |
| `project-structure` | Folder hierarchy, naming conventions, separation of concerns |
| `qa` | Test coverage requirements, regression discipline, bug triage standards |
| `security` | Save data integrity, network input validation, anti-cheat surface |
| `technical-design` | System design principles, interface contracts, dependency direction |
| `telemetry` | Instrumentation standards, event taxonomy, data retention |
| `testing` | Test structure, what to test, acceptable test doubles |
| `ui-ux` | HUD clarity, menu navigation, controller support, information hierarchy |

### unity/ — 23 rule files

Extends `common/` with Unity-specific implementation guidance for addressables, assembly definitions, packages, Play Mode architecture, prefabs and scenes, serialization, and the full common domain list adapted for Unity's engine model.

### unreal/ — 28 rule files

Extends `common/` with Unreal-specific guidance for Blueprints, config files, content cooking, modules and plugins, the UObject and reflection system, rendering pipeline, and the full common domain list adapted for Unreal's architecture.

### godot/ — 26 rule files

Extends `common/` with Godot-specific guidance for GDScript and C#, autoloads and singletons, the editor tooling model, networking, scene and node patterns, signals, resource management, and the full common domain list adapted for Godot's scene graph model.

## Resolution order

When an agent applies rules for a task:

1. Load all applicable rules from `rules/common/`
2. Determine the active engine from the project profile
3. Load the engine-specific rules from `rules/<engine>/`
4. Apply `common/` as the baseline; use engine rules for implementation specifics

**Never combine two engine layers.** Applying `rules/unity/` and `rules/godot/` in the same pass produces contradictory guidance and breaks engine isolation.

## Relationship to other folders

- **skills/** — skills reference rules for implementation detail; they do not duplicate rules
- **agents/** — every agent applies the common rules plus one engine layer
- **contexts/** — the active phase context does not change which rules apply, but it changes which rules are most frequently triggered
- **hooks/** — the engine profile guard hook enforces that an active engine profile is set before engine-specific rules are applied
- **.claude/rules/README.md** — harness adapter that directs the AI to treat this folder as the authoritative behavior layer
