# Los Renacidos: Echoes of Talasaria - Technical Design Document

## Technology
- Platform: Web.
- Rendering: HTML5 Canvas 2D.
- Audio: Web Audio API.
- Storage: `localStorage`.
- Build: No build step; static files can be served directly.

Vanilla Canvas was selected because this vertical slice needs deterministic custom combat, procedural UI, and simple deployment rather than a large framework.

## Runtime Architecture
The project uses a single JavaScript entry point with clear runtime modules implemented as classes and plain objects:
- `Game`: owns state, loop, input, routing, save/load, and high-level transitions.
- `AudioSystem`: lazy Web Audio setup, ambient drone, and procedural sound effects.
- `Player`: movement, stamina, attack actions, dodge, block, healing, and skill gains.
- `Enemy`: enemy AI, telegraphs, attacks, movement, and death rewards.
- `RouteMap`: procedural node generation and route progression.
- Renderer functions: draw menus, map, arena, HUD, panels, combat entities, and System logs.

## State Machine
The game screen state is one of:
- `title`
- `hub`
- `map`
- `combat`
- `event`
- `reward`
- `archive`
- `settings`
- `pause`
- `run-end`

Only `combat` advances real-time simulation. Other states render UI and process choices.

## Data Model
Persistent save:
- Archive fragments.
- Archive mastery level.
- Best boss depth reached.
- Volume and mute settings.

Run data:
- Current route column.
- Current node.
- Copper, supplies, corruption, archive fragments.
- Player health, stamina, bandages, stats, and skill levels.
- Temporary boons.

## Input
Keyboard:
- WASD or arrows: move.
- J or left mouse: light attack.
- K: heavy attack.
- Space: dodge.
- Shift: block.
- Q: use bandage.
- E / Enter: confirm.
- 1-4: menu and choice shortcuts.
- P / Escape: pause.

Pointer:
- Click buttons and map nodes.
- Left click attacks in combat.

## Combat Systems
The arena uses continuous positions, circular collision checks, and bounded movement. Enemy attacks have wind-up timers and range checks. Player attacks use an oriented cone/radius test based on facing direction. Stamina regenerates over time and is spent on dodge, block, and heavy attacks.

## Procedural Route
Each run generates five route columns:
- Column 0: combat or event.
- Columns 1-3: mixed combat, event, rest, merchant, training, or elite.
- Column 4: boss.

The player chooses one visible node per column. Node rewards and enemy compositions vary by biome and depth.

## Save And Metaprogression
Archive fragments earned in a run are added to persistent storage at run end. Every three total fragments grant an effective mastery level. Mastery increases Erik's starting health, stamina, and Swordsmanship, representing Corvus' Archive and Echo memory.

## Asset Pipeline
The game uses generated bitmap assets plus procedural fallback rendering:
- `assets/images/title-hub.png`: title and Minoc echo camp backdrop.
- `assets/images/arena-frontier.png`: combat arena backdrop.
- `assets/images/archive-map.png`: route map and archive backdrop.
- `assets/images/erik.png`: transparent Erik combat sprite.
- `assets/images/alpha-boar.png`: transparent boss/boar sprite.
- `assets/images/goblin.png`: transparent humanoid enemy sprite.
- UI panels, effects, prop overlays, and audio remain procedural.

## Performance
The game updates a small entity list and renders simple Canvas primitives. No external assets are loaded, and no large allocations are required during normal combat. The combat loop caps delta time to avoid instability after tab switching.

## Deployment
Run with:

```bash
npm run dev
```

The game can also be opened through `index.html` directly because it does not use modules or remote assets.
