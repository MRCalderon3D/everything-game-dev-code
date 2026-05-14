# Neon Maze Chase

A PAC-MAN style arcade maze game for HTML5 Canvas, generated through the `/full-game` workflow.

## Run

```bash
cd samples/pacmanAI_Codex
npm run dev
```

Open the URL printed by `serve`. The game also works by opening `index.html` directly in a browser.

## Controls

| Action | Input |
| --- | --- |
| Move | Arrow keys / WASD / swipe / touch buttons |
| Start / confirm | Enter / Space / tap canvas |
| Pause | P / Escape |
| Settings | S from menu or pause |
| Restart after game over | R / Enter / Space |
| Return to menu | M |
| Volume down / up | `[` / `]` |
| Toggle mute | `0` |

## Features

- Grid-based maze chase gameplay.
- Regular pellets, four power pellets, frightened ghost mode, and ghost combo scoring.
- Four ghosts with different chase targets.
- Scatter/chase timing loop.
- Lives, levels, ready message, pause, game over, and high score persistence.
- Settings overlay for volume and mute.
- Procedural Canvas visuals with no external images.
- Web Audio API sound effects with persisted volume and mute settings.
- Keyboard, swipe, and mobile touch controls.

## Project Structure

```text
pacmanAI_Codex/
├── .gitignore
├── GDD.md
├── TDD.md
├── README.md
├── index.html
├── package.json
└── src/
    ├── main.js
    └── styles.css
```

## Placeholder Assets

All assets are generated at runtime. The player is a yellow animated wedge, ghosts are colored Canvas shapes with eyes, pellets are small bright dots, power pellets pulse, and sound effects are synthesized with oscillators.

## Next Steps

1. Replace procedural shapes with original pixel art.
2. Add fruit bonuses and score tables.
3. Add a maze-clear flash animation with a short delay before the next level.
4. Tune ghost speed and scatter/chase timing per level.
5. Add optional controller support.
