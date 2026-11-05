# NEBULA LANCE — Technical Design Document

## Stack & tooling
- **Renderer:** Three.js (`^0.169`) — 2.5D (3D models on a flat play plane).
- **Build:** Vite (`^5`), ES modules, `base: './'` so the static build serves from any
  subpath (e.g. `/nebula-lance/`). Target `es2019`.
- **No gameplay dependencies** beyond Three.js. Headless sim has zero imports of Three.

## Architecture — strict sim/render split
The same proven shape as the PrismDefense3D samples:

- **Simulation (`src/sim/`)** is headless and deterministic: no DOM, no Three.js, no
  `Math.random` in the step that would desync (a small seeded RNG is used for spawn
  jitter so the headless smoke test is reproducible). It owns all game state and advances
  on a **fixed timestep** (`FIXED_DT = 1/60`).
- **Rendering (`src/render/`)** reads sim state and **interpolates** between the previous
  and current step using the loop's `alpha`. It never mutates the sim. It owns every GPU
  resource and disposes them; **GPU memory stays flat across restarts** (verified via
  `renderer.info` logging — geometries/textures/programs constant after N restarts).
- **Loop (`src/core/loop.js`)** is a fixed-timestep accumulator; `render(alpha)` runs once
  per frame. **Events (`src/core/events.js`)** is a tiny emitter decoupling sim → audio/fx.

## Coordinate system
Sim space is screen-fixed (the "scroll" is conceptual, driven by `stageTime` spawns plus
render-only parallax). World units: x ∈ [-9, 9] (right is forward), y ∈ [-5, 5] (up).
The player is clamped to the left-center region. Enemies enter at x ≈ +9.5 and move left.

## System breakdown
- **SimGame** — owns pools and state; `reset()`, `step(dt)`, input intents
  (`setMove`, `fireDown`, `fireUp`, `toggleForceSide`, `launchOrRecallForce`), queries
  (`getScore`), and emits events (`shot`, `charged`, `enemyDied`, `explosion`,
  `powerup`, `forceState`, `playerHit`, `bossWarning`, `bossPhase`, `won`, `lost`).
- **Player** — position/velocity, charge state, fire streams, lives, invuln, shield.
- **Wave Cannon** — `fireDown` starts charging; `fireUp` fires a normal shot (low charge)
  or a piercing beam whose tier/damage scales with charge.
- **Force** — state machine: `front` | `rear` | `detached`; invulnerable while attached,
  blocks enemy bullets, fires its current weapon (`spread`/`laser`/`homing`); launch/recall.
- **Enemies** — pooled; types `gunner`, `weaver`, `carrier` (drops power-up), `turret`
  (wall-mounted, aimed fire), `minion` (boss-spawned). Per-type movement + fire patterns.
- **Boss** — single entity, `phase` 1–3, each phase a destructible core; pattern timers
  for fans/beams/spawns; telegraphs via events.
- **Projectiles** — `playerBullets`, `enemyBullets` pools; circle collision by radius.
- **Power-ups** — pooled pickups; apply to player/Force on contact.
- **Stage director** — an authored timeline keyed by `stageTime` (waves, carrier drops,
  hazard window, lull, boss trigger).

## Data flow
Input → intent setters on `SimGame` → `step(dt)` mutates pools and emits events →
`render(alpha)` packs interpolated transforms into **InstancedMesh** buffers (one per
entity category) → HUD reads scalar sim fields → audio/fx react to events.

## Input strategy (`src/input/input.js`)
- **Touch (mobile-first):** left-half drag = move (virtual analog from drag delta);
  on-screen buttons: **FIRE** (hold to charge / release), **FORCE** (tap = toggle
  front/rear, double-tap / dedicated button = launch-recall).
- **Keyboard:** arrows/WASD move; `J`/`Space` fire (hold to charge); `K` toggle Force
  side; `L` launch/recall Force; `P`/`Esc` pause; `M` mute.
- One pointer code path for touch and mouse; no hover.

## Rendering
- One **InstancedMesh** per entity category (player bullets, enemy bullets, each enemy
  type, minions, power-ups) sized to its pool cap; `frustumCulled = false` because counts
  change per frame. Player ship, Force, and boss are single meshes. Flat-color
  `MeshStandardMaterial`/`MeshLambertMaterial` placeholders, swapped in place for loaded
  GLB/OBJ geometry+material (same in-place-upgrade pattern as `PrismDefense3DAssetsGen`).
- **Camera:** fixed perspective looking down -Z at the play plane, slight tilt for depth.
- **Parallax:** 2–3 large textured quads scrolling at different speeds behind the plane
  (procedural starfield gradient placeholder; generated nebula art when available).
- **FX:** pooled explosion/flash sprites and a charge glow on the ship; all pre-allocated.

## Save data (`src/save/storage.js`)
`localStorage`: `nebulalance.highscore`, `nebulalance.muted`. Wrapped in try/catch
(private-mode safe).

## Performance budget
- Fixed pools, zero per-step allocation in steady state (scratch payloads reused for
  events). DPR capped at 2. Instanced draw calls bounded (~12 instanced meshes + ship +
  boss + parallax). Target 60fps on mid mobile.

## Assets (placeholder-first, optional AI upgrade)
Placeholders are procedural: primitive meshes (cones/capsules/boxes) with flat glowing
colors, Web Audio synthesized SFX, and a generative procedural music bed. Real assets are
an **optional** upgrade via `/generate-assets` (fal.ai) when `FAL_KEY` is set: 3D models
(ship/enemies/boss), parallax/nebula images, menu key-art + **image-to-video** menu
cinematic, SFX, and music — dropped onto the same names/paths with `.provenance.json`
sidecars and recorded in `generated-assets.json`. Generation is gated on the cost-confirm
policy (`rules/common/asset-pipeline.md`).

## Testing
- **Headless sim smoke** (`scripts/sim-smoke.mjs`, `npm run smoke`): runs the sim with no
  DOM. Asserts a **lose path** (idle player → lives reach 0) and a **win path** (scripted
  auto-aim bot clears the boss), and reports stats. Deterministic via the seeded RNG.
- **Browser smoke** (manual via Playwright during the build): boot, start, play, restart
  cycles with `renderer.info` flat-memory assertions.

## Deployment
Static `npm run build` → `dist/`; deployable behind a Caddy `handle_path` block like the
other samples (e.g. `/nebula-lance/`).
