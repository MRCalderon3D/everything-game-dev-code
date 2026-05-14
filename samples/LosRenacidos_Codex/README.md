# Los Renacidos: Echoes of Talasaria

An HTML5 Canvas action roguelike vertical slice generated with the `/full-game` workflow from the supplied GDD.

## Run

```bash
cd samples/LosRenacidos_Codex
npm run dev
```

Open the local URL printed by `serve`. The game can also be launched by opening `index.html` directly.

## Controls

| Action | Input |
| --- | --- |
| Move | WASD / Arrow keys |
| Light attack | J / Left mouse |
| Heavy attack | K |
| Dodge | Space |
| Block | Shift |
| Bandage | Q |
| Confirm / interact | E / Enter |
| Choices | 1-4 |
| Pause | P / Escape |

## Built Features

- Erik-focused action roguelike MVP.
- Procedural route map with combat, event, rest, merchant, training, elite, and boss nodes.
- Real-time arena combat with stamina, dodge, block, light/heavy attacks, and bandages.
- Skills by use: Swordsmanship, Tactics, Parry, Healing, Survival, Negotiation.
- Corruption pressure that increases danger and reward.
- Persistent Archive fragments and mastery through `localStorage`.
- Hub, map, combat HUD, events, rewards, archive, settings, pause, and run-end screens.
- Procedural Canvas visuals and Web Audio sound effects.

## Project Structure

```text
LosRenacidos_Codex/
├── .gitignore
├── GDD.md
├── TDD.md
├── README.md
├── index.html
├── package.json
├── assets/
│   └── images/
│       ├── alpha-boar.png
│       ├── archive-map.png
│       ├── arena-frontier.png
│       ├── erik.png
│       ├── goblin.png
│       └── title-hub.png
└── src/
    ├── main.js
    └── styles.css
```

## Placeholder Assets

The build uses generated bitmap art for the title/hub background, archive/map background, combat arena, Erik sprite, Alpha Cursed Boar sprite, and goblin sprite. Procedural Canvas drawing remains as a fallback for UI, effects, props, and any missing image.

## Source Adaptation Notes

The source GDD describes a large PC-first 2.5D/3D roguelike. This sample implements the proposed MVP scope as a browser-playable vertical slice: Erik, Minoc, the Frontier, procedural routes, skill growth by use, corruption, and an Alpha Cursed Boar boss.
