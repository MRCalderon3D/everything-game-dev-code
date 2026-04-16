# Game Design Document — Tetris 2D Mutation

## 1. Game Concept

**Title:** Tetris 2D Mutation
**Genre:** Puzzle / Arcade
**Platform:** Web (HTML5 Canvas)
**Target Audience:** Casual-to-mid-core puzzle game fans (13+)
**Session Length:** 2–10 minutes

**Elevator Pitch:** Classic Tetris with a twist — pieces can mutate into different shapes mid-fall, and players manage a basket to store and swap unwanted pieces. Strategy meets reflex.

---

## 2. Core Loop (every 30 seconds)

1. A tetromino spawns at the top of the board.
2. The player rotates and moves it while it falls.
3. **Mutation chance:** at random intervals during the fall, the piece may mutate into a different tetromino shape. A brief visual warning (flash + shake) precedes the mutation by 0.5s.
4. The player can press the **Basket key** to send the current piece to the basket (if the basket is not full) and receive the next piece from the queue.
5. On the **next** piece spawn, the player can press the **Swap key** to pull a piece from the basket instead of using the queued piece.
6. When a row is completed, it clears with a flash and the score increases.
7. Speed increases every 10 cleared lines.

---

## 3. Player Mechanics and Abilities

| Action         | Key (default)  | Description                                       |
|----------------|----------------|---------------------------------------------------|
| Move left      | Arrow Left / A | Move piece one cell left                          |
| Move right     | Arrow Right / D| Move piece one cell right                         |
| Soft drop      | Arrow Down / S | Accelerate fall speed                             |
| Hard drop      | Space          | Instantly drop piece to landing position          |
| Rotate CW      | Arrow Up / W   | Rotate piece 90° clockwise                       |
| Rotate CCW     | Z              | Rotate piece 90° counter-clockwise               |
| Send to Basket | C              | Store current piece in basket, get next from queue|
| Swap from Basket| X             | Replace falling piece with one from the basket    |

---

## 4. Game Systems

### 4.1 Mutation System
- Each piece has a **mutation probability** that starts at 10% and increases by 2% per level (max 40%).
- Mutation check happens once per piece, at a random point between 30%–70% of the piece's total fall distance.
- When a mutation triggers: 0.5s warning (piece flashes), then the piece transforms into a random *different* tetromino shape, keeping the same position and rotation index (clamped to valid rotations).
- If the mutated shape would collide, the mutation is cancelled.

### 4.2 Basket System
- The basket holds up to **3 pieces**.
- **Send to Basket (C):** The current falling piece is stored. The next piece from the queue spawns. If the basket is full (3 pieces), the action is denied (brief UI shake).
- **Swap from Basket (X):** Only available at the moment a new piece spawns (first 0.5s window). Opens a quick-select showing basket contents; pressing 1/2/3 selects which piece to swap. The selected piece replaces the falling piece; the falling piece is NOT sent to the basket (it is discarded from queue).
- Basket contents persist across the entire game session.

### 4.3 Scoring
| Event               | Points                    |
|----------------------|---------------------------|
| Single line clear    | 100 × level               |
| Double line clear    | 300 × level               |
| Triple line clear    | 500 × level               |
| Tetris (4 lines)     | 800 × level               |
| Soft drop            | 1 per cell                |
| Hard drop            | 2 per cell                |
| Mutation survived    | 50 (piece placed after mutation) |

### 4.4 Progression
- **Level** starts at 1, increases every 10 lines cleared.
- **Fall speed** decreases from 1000ms per cell (level 1) to 100ms per cell (level 15+).
- **Mutation chance** increases with level.
- **High score** is saved to localStorage.

---

## 5. Level / World Structure

Single endless board:
- **Width:** 10 cells
- **Height:** 20 cells (+ 2 hidden rows at top for spawn)
- Background darkens subtly as level increases.

---

## 6. UI Screens and Flow

```
[Main Menu] → [Gameplay] → [Game Over]
     ↓              ↓
 [Settings]     [Pause]
     ↓              ↓
 [Main Menu]   [Gameplay / Main Menu]
```

### 6.1 Main Menu
- Title: "TETRIS MUTATION"
- Buttons: Play, Settings, High Scores
- Animated background: slow-falling ghost pieces

### 6.2 Gameplay HUD
- **Left panel:** Next piece preview (next 3 pieces)
- **Right panel:** Basket contents (up to 3 slots)
- **Top bar:** Score, Level, Lines cleared
- **Center:** 10×20 game board
- **Mutation warning:** Flashing overlay on piece when mutation is imminent

### 6.3 Pause Screen
- Overlay on gameplay
- Buttons: Resume, Restart, Settings, Quit to Menu
- Board is blurred/dimmed behind overlay

### 6.4 Game Over Screen
- Final score, level, lines cleared
- "NEW HIGH SCORE!" flash if applicable
- Buttons: Play Again, Main Menu

### 6.5 Settings Screen
- Music volume slider (0–100)
- SFX volume slider (0–100)
- Controls reference (read-only)
- Back button

### 6.6 High Scores Screen
- Top 10 local scores with date
- Back button

---

## 7. Audio Direction

### Music
- **Style:** Chiptune / electronic lo-fi
- **Gameplay:** Procedurally generated loop — upbeat, increases tempo with level
- **Menu:** Slower, ambient version of the main theme

### SFX List
| Event               | Sound Description               |
|----------------------|---------------------------------|
| Piece move           | Short click/tick                |
| Piece rotate         | Quick mechanical whir           |
| Piece land           | Solid thud                      |
| Line clear (single)  | Bright ascending chime          |
| Line clear (multi)   | Escalating chime cascade        |
| Tetris (4 lines)     | Triumphant fanfare burst        |
| Mutation warning      | Rising alarm wobble             |
| Mutation transform    | Glitchy morph/warp sound        |
| Send to basket       | Soft whoosh + click             |
| Swap from basket     | Reverse whoosh + pop            |
| Basket full (denied) | Dull buzz / error tone          |
| Game over            | Descending tone + static        |
| Menu select          | UI click                        |
| Level up             | Ascending arpeggio              |
| Hard drop            | Heavy impact thump              |

---

## 8. Art Direction

- **Style:** Neon-on-dark — glowing colored blocks on a dark grid
- **Palette:**
  - Background: `#0a0a1a` (near-black blue)
  - Grid lines: `#1a1a3a` (faint blue)
  - I-piece: `#00f0f0` (cyan)
  - O-piece: `#f0f000` (yellow)
  - T-piece: `#a000f0` (purple)
  - S-piece: `#00f000` (green)
  - Z-piece: `#f00000` (red)
  - J-piece: `#0000f0` (blue)
  - L-piece: `#f0a000` (orange)
  - Ghost piece: 30% opacity of active piece color
  - UI panels: `#12122a` with `#2a2a4a` borders
  - Text: `#e0e0ff`
  - Mutation glow: `#ff00ff` (magenta pulse)

---

## 9. Scope Boundaries

### IN Scope
- Full Tetris gameplay with 7 standard tetrominoes
- Mutation mechanic (random mid-fall shape change)
- Basket system (store up to 3, swap on next spawn)
- Scoring, levels, speed progression
- All UI screens (menu, gameplay, pause, game over, settings, high scores)
- Procedural audio (Web Audio API)
- Canvas-rendered graphics (no external images)
- Local high score persistence (localStorage)
- Keyboard controls

### OUT of Scope
- Touch / mobile controls
- Multiplayer
- Online leaderboards
- Customizable controls
- Gamepad support
- T-spin detection
- Wall kick system (use simple rotation only)
- Combo system
