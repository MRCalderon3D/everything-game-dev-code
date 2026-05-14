# Game Design Document — PAC-MAN AI

## 1. Game Concept

**Title:** PAC-MAN AI
**Genre:** Arcade / Maze Chase
**Platform:** Web (HTML5 Canvas)
**Target Audience:** Casual players, retro game fans (all ages)
**Session Length:** 2–10 minutes

**Elevator Pitch:** Classic PAC-MAN brought to the browser — navigate the maze, eat all dots, avoid ghosts, grab power pellets to turn the tables.

## 2. Core Loop (every 30 seconds)

1. Player controls PAC-MAN through a maze using arrow keys / WASD / touch
2. PAC-MAN eats small dots for points (10 each)
3. Four ghosts roam the maze hunting PAC-MAN
4. Player eats a power pellet to make ghosts vulnerable (they turn blue/run away)
5. Eating a vulnerable ghost scores bonus points (200, 400, 800, 1600 in sequence)
6. After all dots are eaten, level advances with faster ghosts
7. Extra life at 10,000 points

## 3. Player Mechanics

| Action | Key (default) | Touch |
|---|---|---|
| Move Up | Arrow Up / W | Swipe up |
| Move Down | Arrow Down / S | Swipe down |
| Move Left | Arrow Left / A | Swipe left |
| Move Right | Arrow Right / D | Swipe right |
| Pause | Escape / P | Pause button |

## 4. Game Systems

### 4.1 Maze
- Classic PAC-MAN maze layout (28x31 tiles)
- Walls are solid, PAC-MAN and ghosts navigate corridors
- Tunnel wraps from left to right edge

### 4.2 Pellets
- 240 small dots scattered across maze corridors
- 4 power pellets in the corners of the maze
- Small dot: 10 points
- Power pellet: 50 points
- Clear all dots to advance level

### 4.3 Ghost AI
- 4 ghosts: Blinky (red), Pinky (pink), Inky (cyan), Clyde (orange)
- **Scatter mode:** each ghost targets a different corner
- **Chase mode:** each ghost has unique targeting logic:
  - Blinky: targets PAC-MAN's current tile
  - Pinky: targets 4 tiles ahead of PAC-MAN
  - Inky: uses vector-based targeting (complex)
  - Clyde: targets PAC-MAN if far, scatters if close
- Mode alternates: scatter(7s) → chase(20s) → scatter(7s) → chase(20s) → scatter(5s) → chase(20s) → scatter(5s) → chase(permanent)
- When a power pellet is eaten: all ghosts enter **Frightened mode** (15s at level 1, decreasing)
- At the end of Frightened mode, ghosts flash white as warning (last 3s)

### 4.4 Ghost House
- Center ghost house where ghosts start and respawn after being eaten
- Ghosts exit one at a time with delay
- Eaten ghosts return to ghost house as eyes only

### 4.5 Scoring
| Event | Points |
|---|---|
| Small dot | 10 |
| Power pellet | 50 |
| Ghost #1 eaten | 200 |
| Ghost #2 eaten | 400 |
| Ghost #3 eaten | 800 |
| Ghost #4 eaten | 1600 |
| Extra life | At 10,000 points |
| Level completion bonus | 500 × level |

### 4.6 Lives and Death
- Start with 3 lives
- Lose a life when touched by a non-frightened ghost
- Brief death animation (PAC-MAN shrinks/expands)
- Game over when lives = 0

### 4.7 Progression
- Ghost speed increases per level
- Power pellet duration decreases per level
- More chase time per level (scatter ratio decreases)

## 5. Level Structure
- Single classic maze layout with pellets
- Level advances when all 240 dots are eaten
- Same maze each level, pellets reset, speed increases

## 6. UI Screens and Flow

```
[Main Menu] → [Gameplay] → [Level Complete] → [Next Level]
     ↓              ↓              ↓
  [High Scores]  [Pause]      [Game Over]
                     ↓
               [Gameplay / Main Menu]
```

### 6.1 Main Menu
- Title: "PAC-MAN" with retro styling
- Buttons: Play, High Scores
- Animated ghost+PAC-MAN in background

### 6.2 Gameplay HUD
- Top: Score | Lives (PAC-MAN icons) | Level
- Center: Maze with PAC-MAN, ghosts, dots, power pellets
- Ghost state indicator (colored when chasing, blue when frightened)

### 6.3 Pause Screen
- Semi-transparent overlay on gameplay
- "PAUSED" text
- Buttons: Resume, Quit to Menu
- Maze dimmed behind overlay

### 6.4 Game Over Screen
- Final score, level reached
- "NEW HIGH SCORE!" if applicable
- Buttons: Play Again, Main Menu

### 6.5 Level Complete
- Brief "LEVEL X COMPLETE!" flash
- Auto-advances after 2 seconds
- Maze repopulated with dots

## 7. Audio Direction

### Music
- Menu: Slow retro melody loop
- Gameplay: Fast-paced siren-style loop that intensifies when ghosts are close
- Frightened: Urgent, higher-pitched loop

### SFX List
| Event | Sound Description |
|---|---|
| Munch dot | Quick "wakka" chirp (alternates pitch) |
| Eat power pellet | Deep bass sweep + high chirp |
| Eat ghost | Ascending trill |
| Ghost warning flash | Rapid beeps (accelerating) |
| PAC-MAN death | Descending tone + silence |
| Level complete | Triumphant arpeggio |
| Extra life | Bright ascending chime |
| Menu select | UI click |
| Pause | Short descending sweep |
| Unpause | Reverse of pause |

## 8. Art Direction

- **Style:** Neon-on-dark retro arcade — glowing characters on a black maze
- **Palette:**
  - Background: `#000000` (black)
  - Walls: `#0000ff` (dark blue outline)
  - PAC-MAN: `#ffff00` (yellow)
  - Blinky (ghost 1): `#ff0000` (red)
  - Pinky (ghost 2): `#ffb8ff` (pink)
  - Inky (ghost 3): `#00ffff` (cyan)
  - Clyde (ghost 4): `#ffb852` (orange)
  - Frightened ghost: `#2121ff` (dark blue)
  - Flashing ghost: `#ffffff` (white)
  - Dots: `#f0f0c0` (off-white)
  - Power pellet: `#f0f0c0` (off-white, larger, pulsing)
  - UI text: `#f0f0c0`
  - Score text: `#ffffff`

## 9. Scope Boundaries

### IN Scope
- Classic PAC-MAN maze (28x31)
- PAC-MAN player with smooth movement and cornering
- 4 ghosts with scatter/chase/frightened AI modes
- 240 small dots + 4 power pellets
- Score, lives, level progression
- All UI screens (menu, gameplay HUD, pause, game over)
- Procedural audio (Web Audio API)
- Canvas-rendered graphics (procedural sprites, no external images)
- Local high score persistence (localStorage)
- Keyboard + touch controls

### OUT of Scope
- Multiple maze layouts
- Fruit bonus items
- Cutscenes between levels
- Online leaderboards
- Gamepad support
- Difficulty selection
- Mobile-responsive full redesign (the game canvas has a fixed aspect ratio)
