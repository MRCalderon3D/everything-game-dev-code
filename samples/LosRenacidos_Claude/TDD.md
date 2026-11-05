# TDD — Los Renacidos: Ecos de Talasaria (web slice)

## 1. Stack

- **Language:** Vanilla JavaScript (ES modules).
- **Rendering:** HTML5 Canvas 2D, top-down view (the canonical isometric/3D camera is out of scope for this MVP slice — the web sample uses a 2D top-down approximation to deliver the same gameplay loop).
- **Audio:** Web Audio API, all procedurally synthesized.
- **Storage:** `localStorage` for the Archivo de Ecos and high scores.
- **Tooling:** none — direct module loading, no bundler. Any static server (`npx serve`, `python -m http.server`) runs it.

## 2. Architecture

Pattern: **state machine + entity/system composition**.

- `GameStateMachine` owns one active state. Each state receives a shared `context` with `{ canvas, renderer, input, audio, storage, save, notifications, switchState }`.
- States manage their own scenes (menu, Minoc hub, run map, combat room, dialog overlay, archive, game over).
- Combat rooms host `Player`, `Enemy[]`, and `Particle[]` instances driven by `update(dt)` + `render(ctx)`.

```
main.js
  └─ Canvas, GameContext, StateMachine
     └─ MenuState ↔ HubState ↔ RunState ↔ RoomState ↔ DialogState ↔ ArchiveState ↔ GameOverState
                                                └─ Player, Enemy[], Particle[], Notifications, SaveData
```

## 3. Module Layout

```
src/
├── main.js                   # Entry: build canvas, context, state machine
├── constants.js              # Palette, tunings, screen sizes
├── data/
│   ├── enemies.js            # Stat tables for boar, rabbit, goblin, bandit, boss
│   ├── npcs.js               # NPC dialog trees (Thorpe, Garrett, Elara, Aldous, Aldric)
│   ├── rooms.js              # Procedural room templates + spawn lists
│   └── skills.js             # Skill definitions (xp curves, names, descriptions)
├── entities/
│   ├── player.js             # Erik: movement, attack arc, dodge, block, stats
│   ├── enemy.js              # Generic enemy + AI behaviors per archetype
│   └── npc.js                # Hub NPC anchor + sprite
├── world/
│   ├── room.js               # Tilemap-lite arena, wall collisions
│   └── map-gen.js            # Procedural run map (5–7 nodes graph)
├── systems/
│   ├── renderer.js           # Canvas 2D primitives, HUD, system-message styling
│   ├── input.js              # Keyboard + mouse + touch
│   ├── audio.js              # Procedural Web Audio events
│   ├── storage.js            # localStorage wrapper
│   ├── save.js               # Archivo de Ecos: persistent unlocks
│   ├── notifications.js      # Floating system messages "[ESGRIMA +1]"
│   └── particles.js          # Hit sparks, dodge dust, corruption motes
└── states/
    ├── state-machine.js
    ├── menu-state.js
    ├── hub-state.js          # Minoc: walk around NPCs, talk, depart
    ├── run-state.js          # Procedural map node selection (Slay-the-Spire-style)
    ├── room-state.js         # Real-time top-down combat in one room
    ├── dialog-state.js       # Overlay for NPC conversations
    ├── archive-state.js      # Archivo de Ecos viewer + meta upgrades
    └── gameover-state.js     # Death screen / run summary
```

## 4. Data Flow

1. `main.js` boots a context, pushes `MenuState`.
2. State `enter(ctx)` runs once; `update(dt)` and `render(r)` run every frame.
3. `HubState` lets the player walk around Minoc. Pressing E near an NPC opens `DialogState`; dialog can accept the active quest, sell, buy or open the archive.
4. `RunState` shows a procedural node graph; selecting a node pushes `RoomState` with the room template.
5. `RoomState` runs the real-time combat loop, awarding XP to skills, generating notifications, and triggering `audio` + `particles` on events.
6. On boss clear → run is "extracted", rewards + Archivo de Ecos updated → returns to hub.
7. On player death → `GameOverState` shows run summary and returns to hub.

## 5. Stats Model

Player:

```
stats = {
  fuerza, destreza, inteligencia, fama,
  saludMax, salud, manaMax, mana, resistenciaMax, resistencia,
  corrupcion,
  skills: { esgrima, parada, tactica, supervivencia, anatomia, curacion, meditacion, negociacion }
}
```

- Skills have integer levels with XP buckets (`xp_to_next = 8 + level * 4`).
- Each level up emits a `[SKILL +1]` notification and a system chime.
- Stats are recomputed from base + Ecos modifiers when entering a run.

Damage formula: `dmg = base_weapon_dmg * (1 + fuerza * 0.05) * crit_mult`. Crit chance scales with `destreza` and `anatomia`.

## 6. Combat Loop

- Player owns `attackTimer`, `dodgeTimer`, `blockHeld`, `facing`.
- Light attack: short arc hitbox in front of player, 0.25s wind-down. Stamina cost: 8.
- Dodge: 0.35s i-frames, fixed-distance roll. Stamina cost: 15.
- Block: continuous; reduces damage by 70%, drains stamina while holding; **parry window** in first 0.2s reflects damage and pumps Parada XP.
- Stamina regen: 25/s when not blocking, 10/s when blocking, paused for 0.4s after taking damage.

Enemy AI: state machine per archetype (`idle → seek → telegraph → attack → recover`). All values come from `data/enemies.js`.

## 7. Map Generation

`generateRunMap(seed)` returns an array of columns (4 columns × 1–3 nodes each), edges encoded as a list of (fromIdx, toIdx). Node types: `combat`, `event`, `rest`, `elite`, `boss`. Last column is always a single `boss` node (Jabalí Maldito Alfa).

`RoomState` consumes the node's `template` field from `data/rooms.js`: arena size + wall layout + spawn list. Walls are an axis-aligned rectangle set; collision is `point-vs-rect`.

## 8. Procedural Audio

`audio.play(event)` fires a short envelope-shaped oscillator/noise burst. Event catalog: `swing`, `hit`, `parry`, `block`, `dodge`, `enemy-hurt`, `enemy-die`, `player-hurt`, `skill-up`, `quest-accept`, `quest-complete`, `boss-roar`, `death`, `pickup`, `level-cleared`, `menu-select`. A low-volume ambient drone plays during combat rooms.

## 9. Persistence

`save.js` reads/writes a single localStorage entry:

```
storageKey: 'los-renacidos-claude/save'
shape: {
  ecos: { jabaliAlfaSlain: false, bandidosCleared: false, hierbasCount: 0, ... },
  unlocks: { esgrimaBase: 0, paradaBase: 0, vidasExtra: 0, ... },
  fama: 0,
  cobre: 0,
  highestRun: 0,
}
```

Ecos transfer to base stats on next run. Failed runs reset the run-local skills but keep `unlocks`.

## 10. Performance and Safety

- Per-frame allocations avoided: entity objects are mutated, not recreated.
- `dt` clamp to 1/30s on tab regain to avoid tunneling.
- AudioContext created lazily on first input event.
- localStorage unavailable (private mode) → in-memory fallback in `storage.js`.
- Canvas 480×640 logical, scales by CSS to fit viewport; D-pad and action buttons appear on coarse pointers.
