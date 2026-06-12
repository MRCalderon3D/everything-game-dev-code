# PrismDefense — Technical Design Document

## Stack

- **Renderer:** Three.js (WebGL2 baseline; no WebGPU). Chosen per `rules/web/rendering-3d.md`
  for a scene-graph framework fitting a 3D game with a small bundle budget.
- **Build tooling:** Vite. `npm run dev` for development, `npm run build` →
  static `dist/` with `base: './'` so the build serves from any subpath
  (deployment target: `/prism-defense/`).
- **Language:** Plain ES modules (no TypeScript, no framework). Kebab-case file names.
- **UI:** DOM/CSS overlays (HUD, sheets, screens) on top of the WebGL canvas.

## Architecture Overview

Strict simulation/rendering split (per `rules/web/rendering-3d.md`):

- **Simulation (`src/sim/`)** is pure JavaScript with zero DOM and zero Three.js
  imports. It runs on a fixed timestep and is fully headless — the smoke test in
  `scripts/sim-smoke.mjs` runs it under Node.
- **Rendering (`src/render/`)** owns the renderer, scene, camera, lights, and all
  GPU resources. It *reads* sim state every frame and interpolates between the
  previous and current fixed step (alpha blending of `prev`/`curr` positions).
  Rendering never mutates sim state.
- **Gameplay code never touches Three.js outside the rendering module.** The one
  bridge is `rendering.pickTile(clientX, clientY)` (screen → board tile), owned
  by the rendering module because raycasting needs the camera.

```
src/
  main.js              composition root: wires sim, rendering, input, ui, audio
  style.css            HUD/sheet/overlay styles, safe-area handling
  core/
    events.js          tiny event emitter (sim → ui/audio/fx decoupling)
    loop.js            rAF loop, fixed timestep accumulator, interpolation alpha
  sim/                 ── headless, deterministic-ish, no DOM/Three ──
    config.js          ALL tuning data: board, path, towers, enemies, waves, economy
    path.js            S-curve polyline, cumulative lengths, posAt(dist), path tile set
    sim-game.js        SimGame class: state machine, spawning, movement, targeting,
                       projectiles, slows, economy, win/lose
  render/              ── owns Three.js, all GPU resources ──
    rendering.js       renderer/scene/camera/lights owner; views; pickTile; fx pools
    camera-rig.js      orbit/zoom rig with pitch+zoom clamps and viewport auto-fit
  input/
    input.js           pointer events: tap vs drag detection, pinch zoom, wheel
  ui/
    hud.js             gold/lives/wave readouts, wave button, boss bar (DOM)
    build-menu.js      bottom sheet: build / upgrade / sell
    screens.js         menu, pause, win/lose overlays
  audio/
    audio.js           WebAudio: unlock-on-gesture, buses, procedural SFX, music loop
  save/
    storage.js         localStorage high score + mute preference
```

## Game Loop

- `requestAnimationFrame` drives rendering; simulation advances with a fixed
  timestep `DT = 1/60 s` via an accumulator (clamped to 0.25 s to survive tab
  stalls). Render call receives `alpha = accumulator / DT` for interpolation.
- Every sim entity that moves stores `prevX/prevZ` (copied at the start of each
  step); the render layer lerps `prev → curr` by alpha.
- `visibilitychange` auto-pauses a running game; an explicit pause button exists.

## Simulation Systems (sim-game.js)

- **State machine:** `menu → playing → won | lost`; `reset()` returns every pool
  and counter to initial state without reallocating.
- **Pools, no per-frame allocation:** enemies (80), projectiles (64) are
  preallocated arrays of mutable records with an `active` flag. Spawning waits
  for a free slot if the pool is momentarily full.
- **Path movement:** enemies advance `pathDist += speed × slowFactor × dt`;
  position is computed from the precomputed polyline. Reaching the end leaks
  lives and deactivates the enemy.
- **Targeting:** Cannon → max `pathDist` in range; Laser → max current HP in
  range; Frost → radial pulse (no projectile) applying slow + light damage to
  all enemies in range.
- **Projectiles:** homing points (always hit; deactivate if target dies).
- **Waves:** spawn queue with per-entry timers; wave clears when the queue is
  empty and no enemies are alive → bonus gold → countdown to next wave (early
  start allowed). Clearing wave 10 wins.
- **Events out:** `waveStart, waveClear, towerBuilt, towerUpgraded, towerSold,
  shot, frostPulse, enemyDied, leak, bossSpawn, won, lost` — consumed by HUD,
  audio, and render fx. Sim never calls UI/audio directly.

## Rendering (rendering.js)

- **Draw-call budget (weak-phone first):** everything per-category is instanced
  or shares geometry+material:
  - Tiles: 1 `InstancedMesh` (buildable) + 1 (path tiles).
  - Enemies: 1 `InstancedMesh` per type (runner capsule ×80, tank box ×40,
    boss box ×1) with `instanceColor` for slow tint / damage darkening / hit flash.
  - Towers: 1 `InstancedMesh` per type (×40 each); upgrade = bigger scale.
  - Projectiles: 1 `InstancedMesh` per projectile type.
  - FX: two small pre-built ring pools (build/death white, frost cyan) created
    once at startup.
  - Selection: one ring + one range-circle mesh, repositioned.
  - Total: ~15 draw calls for the whole game scene.
- **Materials:** flat-color `MeshLambertMaterial`, one per entity category.
  No textures, no external assets.
- **Lighting:** hemisphere + one directional light, **shadows disabled**
  (flat-color placeholders read fine without them; cheapest option).
- **Pixel ratio:** capped at 2; drawing buffer resized explicitly on resize.
- **No per-frame allocations:** shared `Object3D` dummy, `Color`/`Vector3` temps.
- **Disposal ownership:** all GPU resources are created once at startup and
  reused across runs; `reset()`/restart only rewrites instance matrices and
  counts, so GPU memory is flat by construction. `rendering.getInfo()` exposes
  `renderer.info` and a restart logs it (`window.__pd.info()` debug hook) to
  verify across repeated restarts. A full `dispose()` exists for teardown.

## Camera (camera-rig.js)

Spherical orbit around board center. Yaw free; pitch clamped [0.30, 1.40] rad;
zoom clamped [8, fit×1.45] where `fit` is recomputed per resize from vertical
and horizontal FOV so the 12x12 board stays framed in portrait and landscape.
Default: pitch ≈ 0.80 rad (~45°), distance = fit.

## Input (input.js)

Pointer Events only (covers mouse + touch uniformly), `touch-action: none` on
the canvas:

- 1 pointer, moved < 9 px → **tap** (callback with client coords).
- 1 pointer, moved ≥ 9 px → **orbit drag** (dx/dy to camera rig).
- 2 pointers → **pinch zoom** (distance ratio); tap suppressed.
- `wheel` → zoom (desktop).

## Audio (audio.js)

`AudioContext` created/resumed on the first user gesture (the menu tap that
starts the game; a global one-shot `pointerdown` fallback also unlocks). Graph:
sources → sfx/music gain buses → master gain → destination. All SFX are
oscillator/noise envelopes; shot SFX rate-throttled (min 50 ms gap). Music is a
lookahead scheduler (~100 ms interval, 25 ms ahead-of-time scheduling) playing a
pentatonic arpeggio + bass loop. Mute persisted via `storage.js`.

## Save Data (storage.js)

`localStorage`: `prismdefense.highscore` (number), `prismdefense.muted` ("1"/"0").
Wrapped in try/catch (private-mode safe).

## Performance Budget (weak phone)

- ≤ 20 draw calls, ≤ ~10k triangles, 0 textures, 0 shadow maps.
- 0 allocations in the steady-state frame (sim + render).
- DPR ≤ 2. Target: 60 fps desktop, stable pacing with 40+ enemies (wave 9) on a
  mid-range phone.

## Verification

- `scripts/sim-smoke.mjs` (Node): lose path (no towers → lives 0), win path
  (scripted build-out → wave 10 cleared), pacing stats.
- Manual: desktop mouse run, mobile touch run on the deployed URL,
  `window.__pd.info()` flat across 3 restarts.
