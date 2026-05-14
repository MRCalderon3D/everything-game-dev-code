# PAC-MAN Claude — Technical Design Document

## 1. Stack

- **Language:** Vanilla JavaScript (ES modules)
- **Rendering:** HTML5 Canvas 2D
- **Audio:** Web Audio API (procedural)
- **Storage:** `localStorage`
- **Build tooling:** None — files are loaded directly via `<script type="module">`
- **Deployment:** Static hosting. Any static file server (`npx serve`, `python -m http.server`, or a local server already in this scaffold) works.

The game is small enough that a bundler adds no value. Direct module loading keeps the project zero-dependency and inspectable.

## 2. Architecture

Pattern: **state machine + module composition**.

- A single `GameStateMachine` owns one active state at a time.
- States receive the same context: `{ canvas, ctx, input, audio, storage, renderer, switchState }`.
- Gameplay state owns entity instances (maze, player, ghosts) and drives them through `update(dt)` + `render(ctx)`.
- Systems (input, audio, storage, renderer) are stateless modules created once and shared.

```
main.js
  └─ creates Canvas, GameContext, StateMachine
     └─ MenuState ↔ PlayState ↔ PauseState ↔ GameOverState
                       └─ Maze, Player, Ghost[4]
```

## 3. Module Layout

```
src/
├── main.js                # Entry: boot canvas, build context, start state machine
├── constants.js           # Tile size, colors, maze data, timings
├── entities/
│   ├── maze.js            # Maze grid, pellet bookkeeping, wall lookup
│   ├── player.js          # PAC-MAN movement + animation
│   └── ghost.js           # Ghost AI (4 personalities, mode FSM)
├── systems/
│   ├── renderer.js        # Maze + entity rendering primitives
│   ├── input.js           # Keyboard + touch (swipe + on-screen D-pad)
│   ├── audio.js           # Procedural Web Audio events
│   └── storage.js         # localStorage wrapper for high score
└── states/
    ├── state-machine.js   # Active-state container
    ├── menu-state.js      # Title screen
    ├── play-state.js      # Core game loop
    ├── pause-state.js     # Overlay
    └── gameover-state.js  # Results screen
```

## 4. Data Flow

1. `main.js` builds the shared context and pushes `MenuState`.
2. State `enter(ctx)` runs once; `update(dt)` and `render(ctx)` run every frame from a `requestAnimationFrame` loop.
3. `PlayState` reads `input.direction` per frame, applies it to `player`, ticks ghosts, resolves collisions against `maze`, and triggers `audio` + `storage` on events.
4. State transitions go through `ctx.switchState(NextState)` which calls `exit()` on the old and `enter()` on the new.

## 5. Maze Representation

- A `MAZE` string array (one row per string).
- Symbols:
  - `#` wall
  - `.` pellet
  - `o` power pellet
  - ` ` empty corridor
  - `-` ghost-house door (one-way passable for ghosts in/out)
  - `G` ghost spawn marker (initialized to corridor on load)
  - `P` player spawn marker (initialized to corridor on load)
- The maze is mutable: pellet tiles flip to corridor when eaten so collision-with-pellet is `O(1)`.

## 6. Movement Model

- All entities live on a 16px tile grid but interpolate in pixels at constant speed.
- An entity has `tileX, tileY, x, y, dir, nextDir`.
- At each tile center the entity attempts to apply `nextDir`; if the resulting neighbor is not a wall it adopts that direction.
- Tunnel logic wraps `tileX` across the row 14 horizontal exits.

## 7. Ghost AI

Each ghost runs a mode FSM:

- **SCATTER:** target a fixed corner.
- **CHASE:** personality-specific target tile.
- **FRIGHTENED:** random direction at each junction; slower speed.
- **EATEN:** beeline back to ghost house, then re-enter idle and exit again.

Targeting at each junction picks the legal direction (no reverse, no walls) that minimizes squared distance to the target tile.

## 8. Input

- **Desktop:** Arrow keys + WASD (movement), Esc/P (pause), Enter/Space (menu confirm).
- **Mobile:** Swipe to move; an optional on-screen D-pad always rendered below the canvas; tap-to-confirm on menus.
- The input system exposes:
  - `getDirection()` — last requested direction
  - `wasPressed(action)` — edge-triggered for menus/pause
  - `bindTouchSurface(canvas)`

## 9. Audio

- One shared `AudioContext` created on first user gesture (browser policy).
- `audio.play('event-name')` triggers a short procedurally synthesized oscillator/noise envelope.
- A single low-volume background tone runs while in `PlayState`, modulated by remaining pellets.

## 10. Storage

```
localStorage['pacman-claude/highscore'] = number
```

Saved on game-over if greater than current. Loaded on menu open.

## 11. Performance Budget

Target: 60 fps on a modern phone browser.

- Single canvas, no off-screen buffers.
- Per-frame allocation is avoided (entity objects are mutated, no new vectors).
- The maze is redrawn each frame because it is tiny (28×31 tiles) and clearing the canvas costs less than partial dirty-rect logic.

## 12. Tested Failure Modes

- AudioContext blocked until user gesture → `audio.play` is a no-op until `audio.unlock()` runs in input handler.
- Tab loses focus → `requestAnimationFrame` pauses naturally; on resume, `dt` is clamped to 1/30s to prevent tunneling through walls.
- localStorage unavailable (private mode) → storage wrapper silently falls back to in-memory only.
