# Neon Maze Chase Technical Design Document

## Architecture Overview
The game is a vanilla HTML5 Canvas project with one script entry point. It uses object-oriented runtime classes for the core systems:
- `Game`: state container, frame loop, input routing, score/life/level progression.
- `Maze`: grid data, passability, pellet bookkeeping.
- `Actor`: shared movement behavior.
- `Player`: buffered tile movement and mouth animation.
- `Ghost`: per-ghost targeting, scatter/chase/frightened behavior.
- `AudioSystem`: Web Audio synthesis and persisted volume settings.

This keeps the project static-host friendly and avoids framework dependencies.

## Data Flow
1. Browser loads `index.html`, CSS, and `src/main.js`.
2. `Game` creates the maze, player, ghosts, audio system, input listeners, and animation loop.
3. Input writes a queued direction to the player.
4. Each frame updates timers, player movement, ghost movement, pellet collection, collisions, and level transitions.
5. The renderer draws HUD, maze, entities, and any active overlay to the same Canvas.

## Game State Management
Game state is represented by a string:
- `menu`
- `playing`
- `paused`
- `settings`
- `gameover`

The animation loop always renders. Simulation only advances while the state is `playing`.

## Input Strategy
Keyboard:
- Arrow keys or WASD move.
- Enter or Space starts and confirms.
- P or Escape pauses/resumes.
- S opens settings from menu or pause.
- M returns from pause/game-over to menu.
- R restarts from game-over.
- `[` and `]` adjust volume.
- `0` toggles mute.

Touch:
- Canvas swipe maps to movement direction.
- On-screen directional buttons support coarse pointer devices.

## Movement And Collision
Movement uses floating tile coordinates. Actors may turn only near tile centers, then snap to exact grid coordinates before selecting a new direction. This prevents drift and keeps collision checks deterministic. The horizontal tunnel wraps actors across the maze on row 10.

## Ghost AI
Ghosts evaluate legal directions at intersections and select a target according to mode:
- Scatter: each ghost targets a fixed corner.
- Chase: each ghost uses its personality-specific target.
- Frightened: legal direction is randomized and speed is reduced.
- Captured: the ghost jumps back to home, pauses briefly, and rejoins.

## Save Data
Browser `localStorage` stores:
- `nmc_high_score`
- `nmc_volume`
- `nmc_muted`

The game remains playable if storage is empty.

## Rendering
Canvas 2D draws all assets procedurally:
- Rectangular neon wall tiles with inner highlights.
- Pellet circles and pulsing power pellets.
- Wedge-shaped animated player.
- Ghost bodies, eyes, and frightened color shifts.
- Text overlays for menu, pause, ready, and game over.

## Audio
The Web Audio API is initialized lazily after user interaction to comply with browser autoplay restrictions. Effects use oscillators, short envelopes, and pitch slides.

## Performance Notes
The maze is small and static. Rendering is immediate-mode Canvas drawing over 23 x 21 tiles, well within budget for desktop and mobile browsers. Runtime allocation is limited to small targeting objects and the static entity list.

## Deployment
No build step is required. The game can run through any static file server:

```bash
npm run dev
```

Opening `index.html` directly also works in modern browsers because the project does not use ES modules or remote assets.
