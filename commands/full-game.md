---
description: Build a complete game from idea to playable build, executing every phase end-to-end.
---

# /full-game

## Purpose
Take a game idea and a target platform, then execute the full development pipeline — from
design documents through implementation, art, audio, review, QA, and release — producing a
playable game with real code, real assets (placeholder where needed), and real project structure.

This is not a planning command. It executes every phase, writes every file, and delivers a
project the user can open and run.

## Input
The user provides two things:

1. **Game idea** — anything from a single sentence ("a tower defense with cats") to a full
   design brief. The command works with whatever level of detail is given.
2. **Target platform** — one of:
   - `unity` — C# project using Unity engine
   - `unreal` — C++/Blueprint project using Unreal Engine
   - `godot` — GDScript or C# project using Godot engine
   - `web` — HTML5 game; the command selects the best framework for the game type:
     - Phaser for 2D arcade/platformer/puzzle games
     - Three.js for 3D or heavy visual games
     - Pixi.js for 2D games needing raw rendering performance
     - Kaboom.js for very simple/jam-style games
     - Vanilla Canvas for ultra-minimal games that need no library

## Invokes Agents
- planner
- gdd-designer
- systems-designer
- architect
- technical-design-lead
- gameplay-programmer
- ui-programmer
- ui-ux-designer
- 2d-artist
- producer
- code-reviewer
- qa-lead
- performance-reviewer
- release-manager
- Engine-specific: unity-reviewer | unreal-reviewer | godot-reviewer (based on target)

## Required Skills
- gdd-writing
- core-loop-design
- technical-design-document
- vertical-slice-planning
- milestone-planning
- gameplay-architecture
- ui-hud-patterns
- input-abstraction
- placeholder-asset-pipeline
- performance-budgeting
- qa-test-matrix
- release-readiness
- unity-project-structure
- unity-build-release
- unreal-project-structure
- unreal-build-release
- godot-project-structure
- godot-build-release

Select only the engine-specific skills that match the target platform. For web targets, use standard web development practices and do not load an engine skill.

## Execution Flow

Execute each phase sequentially. Do NOT skip phases. Do NOT ask for confirmation between
phases — run the entire pipeline to completion. If a decision is ambiguous, make the best
judgment call based on the game idea and move on.

---

### Phase 1 — Design (context: ideation)

**Goal:** Produce the foundational design documents.

1. **GDD** — Write a complete Game Design Document:
   - Game concept, genre, target audience, platform
   - Core loop (what the player does every 30 seconds)
   - Player mechanics and abilities
   - Game systems (scoring, progression, economy if any)
   - Level/world structure
   - UI screens and flow (main menu, gameplay HUD, pause, game over, settings)
   - Audio direction (music style, SFX list, ambient)
   - Art direction (style, palette, reference mood)
   - Scope boundaries — what is IN and what is explicitly OUT

2. **TDD** — Write a Technical Design Document:
   - Architecture overview (which patterns: state machine, ECS, component, MVC, etc.)
   - System breakdown with responsibilities
   - Data flow between systems
   - Input handling strategy
   - Scene/screen management approach
   - Save data structure (if applicable)
   - Platform-specific technical notes
   - For web: chosen framework, build tooling, deployment target

Write both documents to the project directory as `GDD.md` and `TDD.md`.

---

### Phase 2 — Project Setup (context: preproduction)

**Goal:** Create the runnable project structure.

Based on the target platform:

- **Unity:** Execute the setup equivalent to `/unity-setup` — folder structure, assembly
  definitions, `.gitignore`, initial scene, packages.
- **Unreal:** Execute the setup equivalent to `/unreal-setup` — module structure, Build.cs,
  `.gitignore`, initial map, plugins.
- **Godot:** Execute the setup equivalent to `/godot-setup` — folder structure, project.godot,
  `.gitignore`, initial scene, autoloads.
- **Web:** Create project structure:
  - `package.json` with the chosen framework dependency
  - `index.html` entry point
  - `src/` folder with game entry, organized by system
  - Build config (Vite, esbuild, or plain depending on complexity)
  - `.gitignore`

---

### Phase 3 — Core Systems (context: production)

**Goal:** Implement every gameplay system defined in the TDD.

Write ALL the code for:
1. Game state management (game loop, state machine, scene transitions)
2. Player controller (movement, input, abilities)
3. Core mechanic systems (whatever the game's main interaction is)
4. Entity/enemy/obstacle systems
5. Collision and physics (appropriate to the platform)
6. Scoring/progression system
7. Spawn/level generation system

Every script must be complete, compilable, and follow the conventions of the target platform.
No stubs. No TODOs. No "implement this later" comments.

---

### Phase 4 — UI and Supporting Systems (context: production)

**Goal:** Implement all UI screens and supporting systems.

1. **UI screens** — Implement every screen from the GDD:
   - Main menu (play, settings, quit/credits)
   - Gameplay HUD (score, lives, timer, whatever the game needs)
   - Pause screen
   - Game over / results screen
   - Settings (audio volume, controls if applicable)

2. **Audio system** — Implement audio manager and integration:
   - Music playback with scene-based tracks
   - SFX triggers wired to gameplay events
   - Volume control connected to settings

3. **Save system** — If the GDD defines persistent data (high scores, unlocks, settings):
   - Implement save/load using platform-appropriate storage
   - Wire to UI (show high score, persist settings)

4. **Input system** — Ensure all input is properly abstracted:
   - Keyboard/mouse for desktop/web
   - Touch for mobile if in scope
   - Controller if in scope

---

### Phase 5 — Placeholder Assets (context: production)

**Goal:** Create all visual and audio assets so the game is fully playable.

Based on target platform:

- **Unity:** Generate a `PlaceholderAssetGenerator.cs` editor script that creates:
  - Colored rectangle/circle sprites for every entity
  - Prefabs for every game object
  - Procedurally generated AudioClips (sine waves, noise, sweeps) for every SFX event
  - A music loop generated procedurally
  - UI sprites (buttons, panels, backgrounds)

- **Unreal:** Generate equivalent placeholder assets:
  - Basic materials with distinct colors for each entity
  - Blueprint actors with placeholder meshes/sprites
  - MetaSound or procedural audio for SFX

- **Godot:** Generate placeholder resources:
  - ColorRect or Sprite2D with generated textures
  - Packed scenes for every entity
  - AudioStreamGenerator for SFX

- **Web:** Generate assets directly in code:
  - Canvas-drawn sprites or SVG for visual entities
  - Web Audio API procedural sounds (oscillators, noise buffers)
  - CSS-based UI elements with proper theming

All placeholders must be wired — the game must be visually and audibly playable
after this phase with no manual setup.

---

### Phase 6 — Scene Wiring (context: production)

**Goal:** Connect everything so the game runs end-to-end.

- **Unity:** Generate a `SceneBootstrapper.cs` that places all GameObjects, attaches scripts,
  wires inspector references, sets up the camera, and saves the scene. The game must enter
  Play mode and be playable.

- **Unreal:** Wire the game mode, player controller, HUD, and level blueprint so the game
  runs from PIE (Play In Editor).

- **Godot:** Wire autoloads, scene tree, signals, and the main scene so F5 runs the game.

- **Web:** Ensure `index.html` → `main.js` → game loop is complete. Opening `index.html`
  (or running the dev server) starts the game immediately.

---

### Phase 7 — Review and Polish (context: review)

**Goal:** Review everything produced and fix issues.

1. **Code review pass** — Review all code for:
   - Naming consistency
   - Dead code or unused imports
   - Obvious bugs or logic errors
   - Platform convention violations
   Fix issues inline — do not just list them.

2. **Gameplay review** — Verify against the GDD:
   - Are all mechanics implemented?
   - Is the core loop complete?
   - Are all UI screens wired?
   - Is audio connected to events?
   Fix any gaps found.

3. **Performance check** — Flag any obvious performance concerns:
   - Allocation in update loops
   - Unoptimized rendering
   - Memory leaks
   Fix what can be fixed without restructuring.

---

### Phase 8 — Final Output

**Goal:** Deliver a summary and run instructions.

Produce a final message to the user with:

1. **Project structure** — tree view of all created files
2. **How to run** — exact steps to open and play the game:
   - Unity: which Unity version, how to open, which scene to load, press Play
   - Unreal: which UE version, how to open, press PIE
   - Godot: which Godot version, how to open, press F5
   - Web: `npm install && npm run dev` or just open `index.html`
3. **What was built** — brief recap of systems, screens, and features
4. **What placeholder assets look like** — describe what the player will see/hear
5. **Next steps** — what the user should do to replace placeholders with real assets

---

## Notes
- This command produces a COMPLETE game. Every file is real, every system is implemented,
  every screen is wired. The user should be able to open the project and play immediately.
- For web games, all code goes in the current working directory unless the user specifies otherwise.
- For engine games (Unity/Unreal/Godot), code goes in the current working directory unless
  the user specifies a project path.
- Make design decisions confidently. If the game idea says "a platformer" and doesn't specify
  jump height, pick a good default. Do not stop to ask.
- Placeholder art should be visually distinct — use different colors, shapes, and sizes so
  the player can immediately tell what everything is.
- Placeholder audio should be functionally correct — a jump sound should sound like a jump
  (short rising tone), a coin should sound like a pickup (bright chirp), death should sound
  like failure (low buzz). Use procedural synthesis, not silence.
- The total output will be large. That is expected and correct.
