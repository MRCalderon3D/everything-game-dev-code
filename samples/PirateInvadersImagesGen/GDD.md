# Pirate Invaders — Game Design Document

## Game Concept

**Genre:** 2D Arcade Shooter (Space Invaders variant)
**Platform:** Web (HTML5 — Phaser 3)
**Target Audience:** Casual players, arcade fans, all ages
**Session Length:** 2–10 minutes

A pirate-themed Space Invaders where the player commands a pirate ship at the bottom of the screen, firing cannonballs at descending waves of Royal Navy vessels. Each wave brings more enemies, faster movement, and heavier fire. Power-ups drop from destroyed enemies. The game ends when the player loses all lives.

---

## Core Loop (30 seconds)

1. Move ship left/right to dodge incoming fire
2. Fire cannonballs at enemy formation
3. Destroy enemies for points
4. Collect power-ups that drop from destroyed ships
5. Survive the wave → next wave spawns harder
6. Repeat until death

---

## Player Mechanics

- **Movement:** Horizontal only, left/right arrow keys or A/D
- **Fire:** Spacebar fires a cannonball upward; max 3 on screen at once
- **Lives:** 3 lives; lose one on enemy bullet hit or enemy reaching the bottom
- **Power-ups (timed, 8 seconds):**
  - **Triple Shot:** fires 3 cannonballs in a spread
  - **Shield:** golden glow; absorbs one hit without losing a life
  - **Rapid Fire:** fire rate doubled

---

## Enemy Types

| Type | HP | Points | Speed | Fire Rate | Color |
|------|----|--------|-------|-----------|-------|
| Sloop | 1 | 10 | Slow | Low | Green |
| Brigantine | 2 | 25 | Medium | Medium | Blue |
| Galleon | 3 | 50 | Slow | High (spread) | Red |

- Enemies move in a grid formation, shifting left/right and stepping down when hitting screen edges
- Galleons fire 3 bullets in a spread pattern
- Enemy speed increases as fewer enemies remain in the wave

---

## Wave Structure

| Wave | Sloops | Brigantines | Galleons | Formation |
|------|--------|-------------|----------|-----------|
| 1 | 15 | 0 | 0 | 5x3 grid |
| 2 | 10 | 5 | 0 | 5x3 grid |
| 3 | 8 | 5 | 2 | 5x3 grid |
| 4 | 5 | 8 | 2 | 5x3 grid |
| 5+ | 5 | 5 | 5 | 5x3 grid, speed +10% per wave |

- Power-up drop chance: 15% per destroyed enemy
- Wave complete bonus: 100 * wave number

---

## Scoring

- Points per enemy: see enemy table
- Wave clear bonus: 100 * wave number
- High score persisted in localStorage
- Score displayed on HUD and Game Over screen

---

## UI Screens and Flow

```
[Menu] --Play--> [Game] --Death--> [GameOver] --Retry--> [Game]
  |                |                    |
  |              Pause               Menu
  |                |
  |            [Pause]
  |              Resume
  |              Menu
  |
  High Scores overlay
```

### Main Menu
- Title: "PIRATE INVADERS" with skull-and-crossbones motif
- Buttons: PLAY, HIGH SCORES
- Background: dark ocean blue

### Gameplay HUD
- Top-left: Score
- Top-right: Wave number
- Bottom-left: Lives (ship icons)
- Active power-up indicator (icon + timer bar)

### Pause Screen
- Overlay with semi-transparent background
- Buttons: RESUME, MAIN MENU

### Game Over Screen
- "YE BE SUNK!" title
- Final score, high score, new high score indicator
- Buttons: PLAY AGAIN, MAIN MENU

---

## Audio Direction

**Style:** 8-bit / chiptune with pirate flavor

### SFX List
| Event | Sound |
|-------|-------|
| Cannon fire | Short percussive boom (low-mid frequency burst) |
| Enemy hit | Crunch impact (noise + mid tone) |
| Enemy destroyed | Explosion (noise sweep down) |
| Player hit | Heavy thud (low frequency) |
| Power-up collect | Bright ascending arpeggio |
| Wave complete | Short triumphant fanfare (ascending chord) |
| Game over | Descending low tone |
| Menu select | Click (short high ping) |

### Music
- Gameplay: procedural sea-shanty-style loop (simple repeating melody)
- Menu: slower, ambient version

---

## Art Direction

**Style:** Flat geometric shapes with bold outlines (placeholder-ready)
**Palette:**
- Ocean background: dark navy (#1a1a2e)
- Player ship: warm brown (#8B4513) with white sails
- Sloop: green (#2ecc71)
- Brigantine: blue (#3498db)
- Galleon: red (#e74c3c)
- Cannonballs: dark grey (#333)
- Enemy bullets: bright yellow (#f1c40f)
- Power-ups: gold (#ffd700)
- UI text: white (#ffffff) with gold accents

---

## Scope Boundaries

### IN
- Single-player arcade gameplay
- 5 defined waves + infinite scaling after wave 5
- 3 enemy types
- 3 power-up types
- Local high score persistence
- Procedural placeholder art and audio
- Keyboard input

### OUT
- Multiplayer
- Mobile touch controls
- Leaderboard server
- Achievements
- Ship customization
- Boss enemies
- Story/narrative
- Controller support
