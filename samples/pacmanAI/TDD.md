# Technical Design Document — PAC-MAN AI

## 1. Architecture Overview

**Pattern:** State Machine + Entity-Component (lightweight)
**Framework:** Vanilla JavaScript ES Modules + HTML5 Canvas
**Build:** No build step — open index.html directly or use `npx serve .`

## 2. System Breakdown

| System | File | Responsibility |
|---|---|---|
| Game Loop | `main.js` | rAF loop, delta time, dispatch to state machine |
| Renderer | `renderer.js` | Canvas 2D drawing for maze, entities, UI |
| Input | `input.js` | Keyboard state + touch swipe detection |
| Audio | `audio.js` | Web Audio API procedural SFX + music loops |
| Storage | `storage.js` | localStorage high scores |
| State Machine | `state-machine.js` | Game state transitions |
| Menu State | `menu-state.js` | Main menu screen |
| Play State | `play-state.js` | Core gameplay loop |
| Pause State | `pause-state.js` | Pause overlay |
| GameOver State | `gameover-state.js` | Game over screen |
| Player | `player.js` | PAC-MAN movement, animation, death |
| Ghost | `ghost.js` | Ghost AI (scatter/chase/frightened), movement |
| Maze | `maze.js` | Maze data, collision, dot/pellet management |
| Constants | `constants.js` | Game dimensions, speeds, timing, maze layout |

## 3. Data Flow

```
Input System → State Machine → Entity Updates → Renderer
                    ↓
              Audio System (triggered by events)
                    ↓
              Storage (save/load high scores)
```

## 4. Maze Data Structure

- 2D array (31 rows × 28 cols)
- Each cell: 0 = empty path, 1 = wall, 2 = dot, 3 = power pellet, 4 = ghost house door, 5 = ghost house interior
- Maze sourced from classic PAC-MAN layout
- Tile size: 20px × 20px, canvas: 560×620

## 5. Entity Movement

- PAC-MAN and ghosts move tile-to-tile with smooth interpolation
- Movement is grid-aligned: entities occupy a tile, moving direction is queued
- PAC-MAN: next direction can be buffered (player presses right while moving up)
- Cornering: if buffered direction becomes valid (aligned to tile center ± threshold), immediate turn
- Movement speed: PAC-MAN at 80% ghost speed normally, 90% when frightened (ghosts slow down)
- Tunnel: entities wrap from x=0 to x=27

## 6. Ghost AI

Each ghost has a target tile recalculated every frame:

- **Blinky:** target = PAC-MAN's current tile
- **Pinky:** target = tile 4 ahead of PAC-MAN's facing direction
- **Inky:** pivot = tile 2 ahead of PAC-MAN; target = pivot + (pivot - Blinky position)
- **Clyde:** target = PAC-MAN if distance > 8 tiles, else scatter corner

When choosing direction at intersection:
- Ghosts cannot reverse (except when switching modes)
- Pick valid direction that minimizes distance to target tile
- In frightened mode: pick random direction at each intersection

## 7. Input Handling
- Keyboard: keydown/keyup tracking for held keys
- Touch: swipe detection (directional) + tap for menu/buttons
- Input is polled each frame, not event-driven

## 8. Audio (Web Audio API)
- Create AudioContext on first user interaction
- SFX: short oscillator-based sounds with envelope (attack/decay)
- Music: looping oscillator patterns for menu, gameplay, frightened modes
- Volume control: master gain node

## 9. Scene/Screen Management
- State machine manages screens: menu, playing, paused, gameover
- Each state has enter(), update(dt), render(), handleClick(x,y)
- Play state owns the game world (maze, player, ghosts, pellets)
- State transitions: menu→playing, playing→paused, playing↔gameover, gameover→menu

## 10. Save Data
- High scores array of {score, date} stored in localStorage
- Max 10 entries
- Loaded at startup, written on game over if score qualifies

## 11. Canvas Layout
- Total canvas: 560px × 720px
- Maze area: 560px × 620px (28×31 tiles at 20px)
- HUD area: top 100px (score, lives, level)
- Maze tiles: 20px each, maze occupies full width
