# Pirate Invaders — Technical Design Document

## Architecture Overview

**Framework:** Phaser 3.60+ (ES module build)
**Build Tool:** Vite 5
**Language:** JavaScript (ES modules)
**Pattern:** Scene-based state machine with manager singletons

Phaser's built-in scene manager handles game state transitions. Gameplay systems are
implemented as manager classes instantiated per-scene. Entities extend Phaser's arcade
physics sprites.

---

## System Breakdown

### Scenes (state machine)

| Scene | Responsibility |
|-------|---------------|
| `BootScene` | Generate all placeholder textures and audio, preload |
| `MenuScene` | Title screen, navigation to game or high scores |
| `GameScene` | Core gameplay loop — player, enemies, bullets, scoring |
| `PauseScene` | Overlay scene launched on top of GameScene |
| `GameOverScene` | Final score display, retry/menu navigation |

### Entities

| Entity | Base Class | Physics |
|--------|-----------|---------|
| `Player` | Phaser.Physics.Arcade.Sprite | Arcade body, horizontal movement |
| `Enemy` | Phaser.Physics.Arcade.Sprite | Arcade body, formation movement |
| `Bullet` | Phaser.Physics.Arcade.Sprite | Arcade body, vertical velocity |
| `PowerUp` | Phaser.Physics.Arcade.Sprite | Arcade body, downward drift |

### Systems

| System | Responsibility |
|--------|---------------|
| `WaveManager` | Spawn enemy formations, track wave progression, scale difficulty |
| `ScoreManager` | Track score, wave bonus, high score comparison |
| `AudioManager` | Procedural sound generation (Web Audio API), playback, volume |
| `SaveManager` | localStorage read/write for high scores and settings |
| `AssetGenerator` | Generate all textures and sounds during boot |

---

## Data Flow

```
Input (keyboard) → Player movement/fire
Player fires → Bullet spawned (player group)
Enemy fires → Bullet spawned (enemy group)
Collision: player bullet + enemy → enemy.hit(), score.add(), maybe powerup.spawn()
Collision: enemy bullet + player → player.hit(), lives--
Collision: player + powerup → powerup.activate()
All enemies dead → WaveManager.nextWave()
Lives === 0 → scene.start('GameOverScene')
```

---

## Input Handling

All input via Phaser's keyboard manager:
- `cursors.left` / `A` — move left
- `cursors.right` / `D` — move right
- `SPACE` — fire
- `ESC` / `P` — pause toggle
- `ENTER` — menu confirmations

No abstraction layer needed — Phaser's input is sufficient for web-only.

---

## Scene Management

Phaser's scene manager handles transitions:
- `this.scene.start('SceneName')` for full transitions
- `this.scene.launch('PauseScene')` for overlay
- `this.scene.resume('GameScene')` when unpausing
- Data passed between scenes via `this.scene.start('GameOverScene', { score, wave })`

---

## Save Data Structure

```json
{
  "highScore": 0,
  "settings": {
    "sfxVolume": 1.0,
    "musicVolume": 0.5
  }
}
```

Storage: `localStorage` under key `pirate-invaders-save`.

---

## Placeholder Asset Generation

### Textures (Phaser Graphics → generateTexture)
- Ship shapes drawn with `graphics.fillStyle()` + polygon/rect
- Each entity gets a distinct color and silhouette
- Generated in `BootScene.create()` before any scene needs them

### Audio (Web Audio API → Phaser sound cache)
- `AudioContext` creates `AudioBuffer` for each sound
- Synthesis: sine/square oscillators, noise buffers, pitch sweeps
- Buffers converted to WAV blobs, loaded into Phaser's cache as audio
- Music: procedural loop using repeating tone sequence

---

## Performance Notes

- **Bullet pooling:** use Phaser groups with `maxSize` to recycle bullets
- **Enemy group:** single physics group for all enemies enables fast overlap checks
- **No per-frame allocation:** all objects pre-created or pooled
- **Canvas size:** 800x600, scales via Phaser's scale manager (FIT mode)

---

## Project Structure

```
PirateInvaders/
├── package.json
├── vite.config.js
├── index.html
├── GDD.md
├── TDD.md
├── .gitignore
└── src/
    ├── main.js          — Phaser game config and boot
    ├── config.js        — game constants (speeds, sizes, colors)
    ├── scenes/
    │   ├── BootScene.js
    │   ├── MenuScene.js
    │   ├── GameScene.js
    │   ├── PauseScene.js
    │   └── GameOverScene.js
    ├── entities/
    │   ├── Player.js
    │   ├── Enemy.js
    │   ├── Bullet.js
    │   └── PowerUp.js
    ├── systems/
    │   ├── WaveManager.js
    │   ├── ScoreManager.js
    │   ├── AudioManager.js
    │   └── SaveManager.js
    └── utils/
        └── AssetGenerator.js
```
