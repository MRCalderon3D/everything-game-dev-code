# PrismDefense (Visuals variant) — Game Design Document

> This variant of `samples/PrismDefense3D/` keeps gameplay identical and
> upgrades only the visual layer: CC0 textures (ambientCG) on the board, path,
> and terrain, a gradient sky with fog, and a pulsing crystal glow. The Art
> Direction section below describes the original placeholder look.

## Concept

PrismDefense is a small, complete 3D tower defense for the browser. Enemies march
along a fixed S-curve path across a 12x12 tile board toward the player's crystal
base. The player places towers on free tiles to stop them. Survive all 10 waves
to win; lose when base lives reach 0.

- **Genre:** Tower defense (fixed path, no maze-building)
- **Platform:** Web (HTML5, 3D via Three.js / WebGL2)
- **Target devices:** Mobile-first (touch phones, portrait and landscape) and desktop
- **Session length:** 10–15 minutes, single run
- **Audience:** Casual TD players; anyone testing the scaffold's web 3D layer

## Core Loop (every 30 seconds)

1. Watch the incoming wave march the path; towers fire automatically.
2. Earn gold per kill and a bonus per cleared wave.
3. Between waves (countdown), spend gold: place a new tower, or upgrade/sell one.
4. Start the next wave (or let the countdown auto-start it).

The tension is gold allocation: coverage (more towers) vs. power (upgrades),
anti-swarm (Cannon/Laser) vs. crowd control (Frost).

## Board and Path

- 12x12 tile board, one fixed map.
- Hardcoded S-curve path (grid `[col,row]`):
  `(0,2) → (8,2) → (8,5) → (3,5) → (3,8) → (10,8)`.
  Enemies spawn at the west edge and walk the polyline; the crystal base sits on
  the final tile `(10,8)`.
- Path tiles and the base tile are not buildable. Every other tile is.

## Towers

| Tower | Cost | Role | L1 stats | L2 (upgrade) | Upgrade cost |
|---|---|---|---|---|---|
| Cannon | 50 | Single target, medium damage. Targets the enemy furthest along the path. | 26 dmg, range 2.6, 1.0 shots/s | 48 dmg, range 2.9, 1.25 shots/s | 60 |
| Frost | 60 | Area pulse: slows every enemy in radius, light damage. | 5 dmg, range 2.3, 0.8 pulses/s, 50% slow for 2.0s | 9 dmg, range 2.7, 0.9 pulses/s, 65% slow for 2.5s | 70 |
| Laser | 70 | Fast weak hits. Prioritizes the strongest (highest current HP) enemy in range. | 7 dmg, range 3.1, 4 shots/s | 12 dmg, range 3.4, 5 shots/s | 80 |

- One upgrade level per tower (L1 → L2).
- Sell refunds 70% of total invested (build + upgrade), rounded down.
- No targeting menus (out of scope) — targeting rules are fixed per tower type.

## Enemies

| Enemy | Base HP | Speed (tiles/s) | Gold | Lives lost on leak | Shape |
|---|---|---|---|---|---|
| Runner | 38 | 2.1 | 8 | 1 | small capsule, lime |
| Tank | 150 | 0.95 | 20 | 2 | cube, crimson |
| Boss (wave 10 only) | 2600 | 0.65 | 250 | 10 | large cube, purple |

Enemy HP scales per wave with a multiplier (1.0 on wave 1 up to 2.8 on wave 10).

## Waves

10 waves, auto-started after a between-wave countdown (first wave 4s, then 6s);
a button allows starting the next wave early. Composition:

| Wave | HP mult | Composition |
|---|---|---|
| 1 | 1.00 | 8 Runners |
| 2 | 1.15 | 12 Runners |
| 3 | 1.30 | 10 Runners + 2 Tanks |
| 4 | 1.45 | 14 Runners + 3 Tanks |
| 5 | 1.60 | 8 Runners + 6 Tanks |
| 6 | 1.80 | 18 Runners + 4 Tanks |
| 7 | 2.00 | 14 Runners + 8 Tanks |
| 8 | 2.25 | 22 Runners + 8 Tanks |
| 9 | 2.50 | 30 Runners + 12 Tanks (stress wave: 40+ concurrent enemies) |
| 10 | 2.80 | 20 Runners + 10 Tanks + 1 Boss |

## Economy

- Starting gold: **120**. Starting lives: **10**.
- Gold per kill: per enemy table above.
- Wave completion bonus: `25 + 5 × wave number`.
- Score: `waves cleared × 1000 + gold on hand`; high score persisted in
  `localStorage`.

## Win / Lose

- **Win:** wave 10 fully cleared (boss included) with lives > 0.
- **Lose:** lives reach 0 at any point (the run ends immediately).

## Controls

### Touch (first-class)
- **Tap a free tile** → bottom build sheet (3 tower cards with cost); tap a card to confirm.
- **Tap a tower** → bottom sheet with Upgrade / Sell (refund shown).
- **Tap empty space / close** → dismiss sheet.
- **One-finger drag** → orbit camera. **Two-finger pinch** → zoom.
- No hover-dependent UI anywhere; all touch targets ≥ 48px, anchored to safe areas.

### Mouse / keyboard
- Click = tap. Drag = orbit. Wheel = zoom.

## Camera

Orbital rig around the board center: free yaw, pitch clamped (~17°–80°), zoom
clamped so the board never leaves the frame. Default ~45° pitch, distance
auto-fit to the viewport so the full board is framed in both portrait and
landscape.

## UI Screens

- **Menu:** title, high score, "Tap to play" (the same tap unlocks WebAudio).
- **HUD:** gold, lives, wave x/10 (top, safe-area aware), next-wave button with
  countdown (bottom), pause and mute buttons, boss HP bar during wave 10.
- **Build/Tower sheet:** bottom panel (thumb reach), see Controls.
- **Pause overlay:** resume / restart / mute.
- **Game over / Victory:** score, high score, "Play again".

## Art Direction (placeholders)

All visuals are flat-color 3D primitives per the placeholder-asset-pipeline —
no external assets, no textures. One distinct color per entity category so
everything reads instantly:

- Tiles: dark slate boxes; **path**: sand-colored boxes (recessed).
- **Base:** cyan crystal (two cones forming a diamond).
- **Towers:** Cannon = orange cone, Frost = ice-blue sphere, Laser = magenta pillar.
  Upgraded towers render 25% larger.
- **Enemies:** Runner = lime capsule, Tank = crimson cube, Boss = large purple cube.
  Slowed enemies tint blue; damage darkens the body tint.
- **Projectiles:** pale-gold spheres (cannon), pink bolts (laser); frost emits an
  expanding cyan ring.

## Audio Direction (procedural WebAudio)

No audio files. Everything synthesized at runtime through master/music/sfx buses:

- Build placement: low thunk (sine drop).
- Shot: short blip (rate-throttled so laser spam doesn't clip).
- Frost pulse: soft noise whoosh.
- Enemy death: bright rising chirp. Leak: descending blip.
- Wave horn: sawtooth chord. Win: small fanfare. Lose: low buzz.
- Music: generative pentatonic arpeggio over a two-note bass, ~100 BPM, low gain.
- Mute toggle persisted; audio context unlocks on the first user gesture (the
  same gesture that starts the game).

## Scope Boundaries

**IN:** one map, 10 waves, 3 towers (1 upgrade each), 2 enemies + boss, economy,
high score, orbital camera, touch + mouse input, procedural audio, pause, mute.

**OUT (explicitly):** multiple maps, meta progression, tower targeting menus,
pathfinding (path is fixed), real art/audio assets, settings beyond mute,
accessibility options, localization, multiplayer, monetization.
