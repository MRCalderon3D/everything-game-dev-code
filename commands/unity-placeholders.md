---
description: Generate placeholder sprites, prefabs, and audio stubs for a Unity project so the game is visually testable before final assets exist.
---

# /unity-placeholders

## Purpose
Generate a Unity Editor script that creates placeholder assets — colored rectangle/circle
sprites, prefabs, and procedurally generated audio clips — so the game can be run and
tested visually and audibly before any final art or audio is produced.

## Use When
- Core gameplay systems are implemented but no real assets exist yet.
- You need a runnable game loop to observe and test before artists deliver assets.
- You want a clean asset structure that final assets can drop into without code changes.

## Invokes Agents
- unity-reviewer
- architect

## Required Skills
- unity-project-structure
- placeholder-asset-pipeline

## Expected Output
- A Unity Editor script at `Assets/_Project/Editor/PlaceholderAssetGenerator.cs`
- Placeholder sprites for each game entity (player, obstacles, collectibles, environment)
- Prefabs for each entity in the correct project folder
- Procedurally generated AudioClip assets for all required sound events (synthesized via AudioClip.Create + SetData using sine waves, noise, and pitch sweeps — not silent stubs)
- Instructions to run the script via the Unity Editor menu and delete it afterward

## Notes
- Placeholder assets must match the folder structure defined by `/unity-setup`.
- Sprite sizes should match the intended gameplay scale so physics and colliders work correctly.
- All placeholder prefabs must have the same name and path as the final assets will use —
  this allows final assets to be dropped in without any code or scene changes.
- Audio placeholders are generated procedurally using `AudioClip.Create()` and `SetData()` with
  math-based synthesis (sine waves, square waves, white noise, pitch sweeps). No external
  audio tools or APIs are needed. The generated clips are saved as `.wav` assets.
- Escalate to `unity-reviewer` if the project structure is not yet initialized.
