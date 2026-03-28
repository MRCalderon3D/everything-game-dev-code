# Godot Agents

## Purpose
Define engine-specific responsibilities for Godot-focused agents without duplicating the common multi-agent rules.

## Scope
Applies to Godot gameplay, tools, UI, content integration, testing, optimization, and release work.

## Role Extensions
- `godot-gameplay-engineer` owns scene composition, gameplay scripts, node architecture, signals, and runtime system integration.
- `godot-tools-engineer` owns editor plugins, import automation, custom inspectors, and content authoring tooling.
- `godot-ui-engineer` owns Control tree architecture, theme setup, navigation flow, responsive layouts, and UI input behavior.
- `godot-build-engineer` owns export presets, CI export validation, platform configuration, and release packaging.
- `godot-qa-specialist` owns Godot-specific regression strategy around scenes, signals, save data, exports, and platform behavior.

## Boundary Rules
- Godot agents may refine implementation strategy for nodes, scenes, resources, autoloads, signals, and export settings.
- They must not override common design ownership, milestone authority, or review expectations.
- Engine-specific implementation decisions must stay in Godot deliverables and must not leak into Unity or Unreal packs.

## Handoff Expectations
- Every Godot implementation handoff must identify: authoritative scene or script entry points, relevant resources, autoload dependencies, signal contracts, and export implications.
- Technical reviews must call out coupling risk between scenes, autoloads, resources, and editor authoring workflows.

## Escalation Triggers
Escalate when:
- scene ownership becomes unclear
- autoloads begin acting as hidden global state
- signals create invisible control flow
- export settings diverge across platforms without documentation
- GDScript and C# boundaries become inconsistent or duplicated

## Done Criteria
Godot agent collaboration is healthy when scene ownership, runtime flow, tooling boundaries, and export expectations are explicit and maintainable.
