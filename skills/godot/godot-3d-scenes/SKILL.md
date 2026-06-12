---
name: godot-3d-scenes
description: Compose Godot 3D scenes with sound Node3D structure, cameras, physics bodies, environment ownership, and 3D performance patterns.
origin: everything-game-dev-code
category: godot
---

# Godot 3D Scenes

## Purpose
Compose Godot 3D scenes with sound Node3D structure, cameras, physics bodies, environment ownership, and 3D performance patterns.

## Use When
- starting or reviewing a 3D Godot project (or adding 3D to a 2D one)
- 3D entities, cameras, or physics bodies are composed inconsistently across scenes
- frame cost traces to lights, draw calls, or scene density in 3D levels

## Inputs
- gameplay entity inventory and their physics behavior (static, dynamic, character, trigger)
- camera requirements (follow, orbit, fixed, first-person)
- unit scale and asset conventions from the 3D asset pipeline
- target platforms and their 3D performance budgets

## Process
1. compose each 3D entity as its own inheritable scene with a single root Node3D whose transform is the entity's transform; children never compensate for a misplaced root
2. keep visual mesh, collision shape, and gameplay script as distinct children with conventional names so entities stay swappable and auditable
3. choose physics bodies deliberately: StaticBody3D for level geometry, CharacterBody3D for player/NPC movement, RigidBody3D only when the simulation should own motion, Area3D for triggers — and keep collision shapes simple primitives that match visuals at gameplay scale
4. define collision layers and masks as a named project-level table; bodies declare what they are (layer) and what they scan (mask), never "everything collides with everything"
5. build camera rigs as their own scenes (Camera3D plus pivot/arm nodes), manage the current camera explicitly on scene transitions, and fix FOV/near/far conventions once
6. give each level exactly one WorldEnvironment owner and place lights against the budgets from the lighting/LOD pipeline; a DirectionalLight3D plus baked or ambient fill is the default starting point
7. control 3D density with visibility ranges or LODs, occlusion culling where interiors justify it, and MultiMeshInstance3D for many repeated meshes
8. validate scenes in isolation: every entity scene must instantiate and run standalone (F6) without depending on siblings or absolute node paths

## Outputs
- 3D entity scene template (root transform, mesh/collision/script children)
- collision layer/mask table with named layers
- camera rig conventions and current-camera handover rules
- WorldEnvironment/lighting ownership notes and 3D density checklist

## Quality Bar
- every 3D entity scene runs standalone with its root transform as the single source of position
- physics body types match gameplay intent and collision uses named layers/masks, not defaults
- exactly one WorldEnvironment per level and lights stay within the scene budget
- repeated meshes demonstrably batch via MultiMesh or shared meshes, verified with the renderer profiler

## Common Failure Modes
- entity position split between root and offset children, so code moves one and physics uses the other
- RigidBody3D used for player movement and then fought with forces every frame instead of CharacterBody3D
- collision left on default layer 1 project-wide, making every raycast and area hit everything
- multiple WorldEnvironments fighting per level, or environment settings duplicated per scene
- thousands of individual MeshInstance3D nodes for repeated props where one MultiMesh would do

## Related Agents
- godot-reviewer
- gameplay-programmer
- level-designer

## Related Commands
- godot-scene-audit
- godot-review
- perf-budget

## Related Skills
- godot-scene-architecture
- godot-performance
- godot-resource-management

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Boundary: `godot-scene-architecture` owns general scene/autoload/signal structure; this skill owns the 3D-specific layer on top of it. Engine-neutral 3D content policy (assets, materials, lighting budgets) lives in the art-audio-content 3D pipeline skills.
