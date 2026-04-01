---
description: Generate a Unity Editor script that populates a scene with GameObjects, attaches scripts, wires inspector references, and saves — making the game immediately playable.
---

# /scene-bootstrap

## Purpose
Generate a Unity Editor script that opens a target scene, instantiates prefabs and empty
GameObjects, attaches the correct scripts, wires all inspector references, and saves the
scene — so the game is immediately playable in the Unity Editor without any manual setup.

## Use When
- Placeholder assets exist (via `/unity-placeholders`) and need to be placed in a scene.
- Core systems are implemented and need to be connected in the scene for the first time.
- You want to verify the full game loop is wired correctly before writing UI or audio.

## Invokes Agents
- unity-reviewer
- architect

## Required Skills
- unity-project-structure
- gameplay-architecture
- placeholder-asset-pipeline

## Expected Output
- A Unity Editor script at `Assets/_Project/Editor/SceneBootstrapper.cs`
- The target scene populated with all required GameObjects at correct positions
- Scripts attached to the correct GameObjects
- Inspector references wired between systems (e.g. GameManager ← Player, SpawnManager ← prefabs)
- Camera configured for the game's projection and aspect ratio
- Scene saved and ready for Play mode
- Instructions to run the script via the Unity Editor menu and delete it afterward

## Notes
- Run after `/unity-placeholders` — this command expects prefabs to already exist.
- Script must use `EditorSceneManager` to open and save the scene safely.
- All wired references must use `SerializedObject` / `SerializedProperty` to avoid
  dirty scene warnings.
- Escalate to `unity-reviewer` if any script component is missing from the project.
