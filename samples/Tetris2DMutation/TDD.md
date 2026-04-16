# Technical Design Document — Tetris 2D Mutation

## 1. Architecture Overview

**Pattern:** State Machine + Manager Singletons
**Rendering:** HTML5 Canvas 2D (single canvas element)
**Audio:** Web Audio API (procedural synthesis, no audio files)
**Storage:** localStorage for high scores and settings
**Build:** Vanilla JS with ES modules, served via simple HTTP server or opened directly
**Framework:** None — pure Canvas + Web Audio API

---

## 2. System Breakdown

### 2.1 Game State Machine (`GameStateMachine`)
Manages top-level states:
- `MENU` — main menu screen
- `PLAYING` — active gameplay
- `PAUSED` — gameplay paused
- `GAME_OVER` — game over screen
- `SETTINGS` — settings screen
- `HIGH_SCORES` — high scores screen
- `BASKET_SELECT` — brief overlay for picking a basket piece

Transitions are explicit; each state has `enter()`, `update(dt)`, `render(ctx)`, `exit()`.

### 2.2 Board (`Board`)
- 2D array `grid[22][10]` — 20 visible + 2 hidden spawn rows.
- Each cell: `null` or `{ color: string }`.
- Methods: `isValid(piece, x, y, rotation)`, `lock(piece)`, `clearLines()`, `reset()`.

### 2.3 Piece (`Piece`)
- Properties: `type` (I/O/T/S/Z/J/L), `x`, `y`, `rotation` (0–3), `color`.
- Static data: `SHAPES[type][rotation]` — 4×4 grid bitmaps for each rotation.
- Methods: `getBlocks()` → array of `{x, y}` world positions.

### 2.4 Mutation System (`MutationSystem`)
- On piece spawn: roll mutation chance → if yes, pick a random fall % (30–70%) for the trigger point.
- Each frame: check if piece has fallen past the trigger point.
- On trigger: start 0.5s warning (set `piece.mutationWarning = true`), then transform.
- Transform: pick random different type, create new Piece with same position, clamp rotation. Validate with Board. Cancel if invalid.

### 2.5 Basket System (`Basket`)
- Array of up to 3 `Piece` types (stored as type identifiers).
- `store(type)` → push if length < 3, else deny.
- `retrieve(index)` → remove and return the type at index.
- `isFull()`, `isEmpty()`, `getContents()`.

### 2.6 Scoring System (`ScoreSystem`)
- Tracks `score`, `level`, `lines`, `highScores[]`.
- `addLineClear(count)` — applies multiplier by level.
- `addDrop(cells, isHard)` — soft = 1pt/cell, hard = 2pt/cell.
- `addMutationSurvived()` — 50 pts.
- `checkLevelUp()` — every 10 lines.

### 2.7 Input System (`InputSystem`)
- Keyboard event listeners (keydown/keyup).
- Maps keycodes to action enums.
- DAS (Delayed Auto Shift): initial delay 170ms, repeat 50ms for left/right movement.
- Exposes `isPressed(action)`, `justPressed(action)`.
- Resets `justPressed` flags each frame.

### 2.8 Audio System (`AudioSystem`)
- Web Audio API `AudioContext`.
- `playSFX(name)` — triggers a procedural sound by name.
- `playMusic(track)` / `stopMusic()` — procedural looping music.
- `setMusicVolume(0-1)` / `setSFXVolume(0-1)`.
- All sounds generated with oscillators, noise buffers, and gain envelopes.

### 2.9 Renderer (`Renderer`)
- Owns the `<canvas>` element and 2D context.
- Methods per visual element: `drawBoard()`, `drawPiece()`, `drawGhost()`, `drawHUD()`, `drawNextQueue()`, `drawBasket()`, `drawParticles()`.
- Particle system for line clears and mutations.
- Ghost piece rendering (30% opacity projection of landing position).

### 2.10 UI Manager (`UIManager`)
- Handles menu screens via Canvas drawing (no DOM overlays).
- Button hit-testing via mouse click coordinates.
- Slider controls for settings.
- Manages screen transitions with fade effects.

---

## 3. Data Flow

```
InputSystem → GameStateMachine
                  ↓
             [PLAYING state]
                  ↓
        GameplayController
       /    |     |     \
   Board  Piece  Basket  MutationSystem
       \    |     |     /
        ScoreSystem
            ↓
        Renderer ← AudioSystem
            ↓
         Canvas
```

### Frame Loop
1. `InputSystem.update()` — poll key states
2. `GameStateMachine.currentState.update(dt)`
3. `GameStateMachine.currentState.render(ctx)`
4. `requestAnimationFrame(loop)`

---

## 4. Input Handling Strategy

All input goes through `InputSystem` which abstracts raw key events:

```
ArrowLeft / A  → MOVE_LEFT
ArrowRight / D → MOVE_RIGHT
ArrowDown / S  → SOFT_DROP
ArrowUp / W    → ROTATE_CW
Z              → ROTATE_CCW
Space          → HARD_DROP
C              → BASKET_STORE
X              → BASKET_SWAP
Escape / P     → PAUSE
Enter          → CONFIRM
```

DAS applies only to MOVE_LEFT and MOVE_RIGHT. All other actions are single-fire on keydown.

---

## 5. Scene / Screen Management

Each screen is a state object with the interface:
```
{ enter(), update(dt), render(ctx), exit(), handleClick(x, y) }
```

`GameStateMachine` holds the current state and delegates the frame loop to it. Transition calls `exit()` on current, `enter()` on next.

No DOM manipulation for screens — all UI is Canvas-rendered.

---

## 6. Save Data Structure

Stored in `localStorage` under key `tetris2dmutation`:

```json
{
  "highScores": [
    { "score": 12000, "level": 5, "lines": 42, "date": "2026-04-16" }
  ],
  "settings": {
    "musicVolume": 0.7,
    "sfxVolume": 0.8
  }
}
```

Max 10 high scores, sorted descending by score.

---

## 7. File Structure

```
Tetris2DMutation/
├── index.html
├── src/
│   ├── main.js              — Entry point, game loop
│   ├── constants.js          — Colors, dimensions, timing values
│   ├── input.js              — InputSystem
│   ├── board.js              — Board grid logic
│   ├── piece.js              — Piece shapes and rotation data
│   ├── mutation.js           — MutationSystem
│   ├── basket.js             — Basket storage system
│   ├── score.js              — ScoreSystem + high scores
│   ├── audio.js              — AudioSystem (Web Audio procedural)
│   ├── renderer.js           — Canvas rendering
│   ├── particles.js          — Particle effects
│   ├── ui.js                 — UIManager (menus, buttons, sliders)
│   ├── states/
│   │   ├── state-machine.js  — GameStateMachine
│   │   ├── menu-state.js     — Main menu
│   │   ├── play-state.js     — Gameplay
│   │   ├── pause-state.js    — Pause overlay
│   │   ├── gameover-state.js — Game over screen
│   │   ├── settings-state.js — Settings screen
│   │   └── highscores-state.js — High scores screen
│   └── storage.js            — localStorage wrapper
├── GDD.md
├── TDD.md
└── .gitignore
```

---

## 8. Platform-Specific Notes

- **No build step required** — ES modules loaded via `<script type="module">`.
- **No external dependencies** — zero npm packages.
- Works in any modern browser (Chrome, Firefox, Safari, Edge).
- Canvas auto-scales to fit viewport while maintaining aspect ratio.
- `requestAnimationFrame` drives the game loop with delta-time.
- All audio created procedurally — no audio files to load.
