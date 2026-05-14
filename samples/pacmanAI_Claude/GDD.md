# PAC-MAN Claude — Game Design Document

## 1. Concept

A classic arcade-style maze-chase game inspired by PAC-MAN. The player navigates a maze, eats every pellet, avoids four ghosts, and uses power pellets to turn the tables on their pursuers.

- **Genre:** Arcade / Maze Chase
- **Target audience:** All ages, casual to retro-arcade fans
- **Platform:** Web (HTML5, desktop + mobile browsers)
- **Session length:** 2–10 minutes per run

## 2. Core Loop

Every 30 seconds the player is:
1. Moving through the maze collecting pellets.
2. Avoiding ghosts that chase from different angles.
3. Eating a power pellet to flip ghosts into a vulnerable "frightened" state.
4. Chasing frightened ghosts for combo bonuses.
5. Clearing the maze to advance to the next, faster level.

## 3. Player Mechanics

- **Movement:** 4-directional (up/down/left/right). Continuous motion in the last queued direction. Direction changes apply at tile centers when the new direction is unblocked.
- **Eating pellets:** +10 points each; a level ends when all pellets are gone.
- **Power pellets:** 4 per level. Triggers frightened mode for ~7 seconds.
- **Ghost eating:** While ghosts are frightened, eating them awards 200/400/800/1600 in a combo chain.
- **Lives:** 3 starting lives; a collision with a non-frightened ghost costs a life.
- **Extra life:** Awarded once at 10,000 points.
- **Tunnels:** Horizontal screen-wrap tunnels at row 14.

## 4. Ghost AI

| Ghost | Color | Personality |
|-------|-------|-------------|
| Blinky | Red | Direct chase — targets PAC-MAN's tile. |
| Pinky | Pink | Ambush — targets 4 tiles ahead of PAC-MAN. |
| Inky | Cyan | Flanker — uses Blinky's position to triangulate. |
| Clyde | Orange | Erratic — chases when far, scatters when close. |

Modes cycle: scatter → chase → scatter → chase. On power pellet → frightened (slower, blue, reversible). When eaten → eyes return to ghost house and respawn.

## 5. Systems

- **Score:** pellets, power pellets, ghosts, fruit bonus per level.
- **Level progression:** ghost speed scales modestly each level (cap +30%).
- **High score:** persisted via `localStorage`.
- **Pause:** Esc or P at any time during gameplay.

## 6. Level / World

- Single classic maze: 28 columns × 31 rows of 16px tiles.
- 4 power pellets in corners.
- 1 ghost house in the center.
- Horizontal tunnels on row 14.

## 7. UI Screens

1. **Main menu** — title, "Press Enter / Tap to play", high score, instructions hint.
2. **Gameplay HUD** — top: score, high score, level. Bottom: lives, current combo.
3. **Pause screen** — overlay with "PAUSED — press P/Esc to resume".
4. **Game over** — final score, "New high score!" if applicable, prompt to restart or return to menu.

## 8. Audio Direction

All audio is procedural (Web Audio API, no external files):

| Event | Sound |
|-------|-------|
| Pellet eaten | Short rising chirp (alternating two tones) |
| Power pellet | Bright bell-like sustain |
| Ghost frightened | Wobbling siren downsweep |
| Ghost eaten | Triumphant ascending arpeggio |
| Player death | Descending dissonant sweep |
| Menu select | Soft click |
| Level cleared | Three-note ascending fanfare |
| Ambient | Soft alternating square-wave heartbeat that speeds up as the maze empties |

## 9. Art Direction

- **Style:** Retro arcade, flat colors, sharp pixel grid.
- **Palette:**
  - Maze walls: deep blue `#1f2bbf`
  - Pellets: warm cream `#ffd6a5`
  - Player: bright yellow `#ffea00`
  - Blinky: `#ff3b3b`
  - Pinky: `#ffa6e0`
  - Inky: `#3df0ff`
  - Clyde: `#ffb84d`
  - Frightened ghost: `#3b4dff`
  - Eyes (eaten state): white with blue pupils

All sprites are drawn with Canvas 2D primitives — no external images.

## 10. Scope

**In:**
- Single maze, classic layout
- 4 ghosts with distinct AI
- Power pellets + frightened mode
- Score, lives, level progression
- Procedural audio
- Touch controls (swipe + on-screen D-pad)
- High score persistence
- Pause, game over, settings

**Out:**
- Cutscenes
- Multiple mazes
- Multiplayer
- External assets (images, audio files)
- Achievements
