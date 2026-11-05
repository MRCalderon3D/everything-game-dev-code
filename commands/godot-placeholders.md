---
description: Generate placeholder textures, scenes, 3D primitive meshes, and audio stubs for a Godot project so the game is visually testable before final assets exist.
---

# /godot-placeholders

## Purpose
Generate a Godot editor script that creates placeholder assets — colored rectangle/circle
textures, placeholder scenes, and procedurally generated audio streams — so the game can
be run and tested visually and audibly before any final art or audio is produced.

## Use When
- Core gameplay systems are implemented but no real assets exist yet.
- You need a runnable game loop to observe and test before artists deliver assets.
- You want a clean asset structure that final assets can drop into without scene or code changes.

## Invokes Agents
- godot-reviewer
- architect

## Required Skills
- godot-project-structure
- placeholder-asset-pipeline

## Expected Output
- A `@tool` EditorScript (GDScript) the user runs once from the Godot script editor
- Placeholder textures for each game entity generated via `Image` and `ImageTexture` and saved as `.png`
- Placeholder scenes (`.tscn`) for each entity in the correct project folder
- For 3D projects, placeholder scenes built from primitive meshes (`BoxMesh`, `SphereMesh`, `CapsuleMesh`, `PlaneMesh`) with flat-color `StandardMaterial3D` and matching collision shapes
- Procedurally generated audio via `AudioStreamWAV` with synthesized PCM data (sine waves, noise, pitch sweeps — not silent stubs) saved as `.wav` or `.tres`
- Instructions to run the script via File > Run in the script editor and delete it afterward

## Notes
- Placeholder assets must match the folder structure defined by `/godot-setup`.
- Texture sizes should match the intended gameplay scale so physics and collision shapes work correctly.
- 3D primitive placeholders must use correct gameplay scale with collision shapes that match their meshes, and one flat-color material per entity category so entities stay distinguishable.
- All placeholder scenes and resources must have the same name and path as the final assets will use — this allows final assets to be dropped in without any scene or code changes.
- Audio placeholders are generated procedurally by filling `AudioStreamWAV.data` with math-based PCM synthesis. No external audio tools or APIs are needed.
- Escalate to `godot-reviewer` if the project structure is not yet initialized.
