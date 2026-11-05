# NEBULA LANCE — Game Design Document

## Concept
A 2.5D horizontal side-scrolling shoot-'em-up; a modern homage to R-Type. The player
pilots a lone starfighter through a derelict bio-mechanical space station, fighting waves
of organic "Bydo-like" creatures and a massive three-phase final boss. The hook is the
twin R-Type signatures: the **Wave Cannon** (hold to charge a piercing beam) and the
**Force** (a detachable, invulnerable orbital pod that adds firepower and blocks fire).

- **Genre:** Side-scrolling shmup (bullet-light, weak-point boss design)
- **Target audience:** Arcade/retro shmup fans; mobile and desktop web
- **Platform:** Web (HTML5), 2.5D via Three.js — 3D models on a constrained 2D plane

## Core Loop (every ~30s)
Dodge enemy formations and terrain → tap-fire for chip damage / hold-charge the Wave
Cannon for burst damage → position the Force pod (front to push, rear to cover) → grab
power-ups from carriers → survive the mid-stage hazard → fight and out-pattern the boss.

## Player Mechanics
- **Movement:** free 2D movement within the screen (touch drag, or arrows/WASD).
- **Primary fire:** tap to fire a rapid normal shot.
- **Wave Cannon:** hold fire to fill a charge meter; release to fire a screen-piercing
  beam whose damage and width scale with charge tier (1–3). Below the minimum charge a
  release just fires a normal shot.
- **Force pod:** unlocked by the first power-up. Toggle-attach to the ship's **front**
  (offensive shield ahead) or **rear** (covers your tail); **launch** it forward as an
  invulnerable battering projectile and **recall** it. While attached it is invulnerable
  and destroys enemy bullets it touches, and fires the current Force weapon.
- **Lives:** 3. A hit costs a life and a brief respawn invulnerability; the combo
  multiplier resets on hit.

## Game Systems
- **Power-ups** (dropped by carrier enemies): `force` (grant/cycle Force weapon:
  spread → laser → homing), `power` (+1 normal-shot stream, up to 3), `speed` (+move
  speed), `shield` (absorb one hit).
- **Scoring:** points per kill scaled by enemy value; a **combo multiplier** rises with
  chained kills inside a short window and resets when the window lapses or the player is
  hit. High score persisted to `localStorage`.
- **Difficulty curve:** one authored stage with rising intensity (below).

## Level / Stage Structure (single stage, ~75s to boss)
1. **Approach (0–22s):** trash-mob waves — sine-weaving gunners; first **carrier**
   appears early and drops the Force-granting power-up.
2. **The Gauntlet (22–42s):** mid-stage hazard — organic **walls** close in from top and
   bottom to narrow the corridor, with surface **turrets** firing aimed shots.
3. **Lull (42–52s):** the corridor reopens; a lone carrier offers a power-up to prep.
4. **WARNING / Boss (52s+):** a klaxon announces the boss; the three-phase fight begins.

## Boss — "THE MAW" (3 phases)
A giant bio-mechanical entity that enters from the right and anchors at screen-right.
Each phase exposes a glowing **destructible weak-point core**; only the core takes damage.
- **Phase 1:** body drifts vertically; fires periodic **bullet fans**.
- **Phase 2:** faster drift; telegraphed **sweeping beam** + spawns minions.
- **Phase 3:** dense fans + beam; destroy the final core to win.

## UI Screens & Flow
- **Main menu:** full-screen looping **video background** behind the title and a Start
  button (poster image fallback). Shows best score.
- **HUD:** lives, score (+ combo multiplier), Wave Cannon **charge meter**, current
  Force weapon/state.
- **Pause:** resume + main menu.
- **Game over / Victory:** final score + best, play again + main menu.

## Audio Direction
- **Music:** tense synth menu theme; driving synth/orchestral battle loop for the stage.
- **SFX:** normal shot, charging hum, Wave Cannon release, enemy hit, explosion,
  power-up pickup, Force attach/detach/recall, boss **WARNING**, player death, victory.

## Art Direction
- **Style:** biomechanical sci-fi — dark metal hulls with glowing organic accents in
  **teal and magenta**; deep-space nebula parallax backdrops.
- **2.5D look:** real 3D models (ship, enemies, boss) lit dramatically, moving on a flat
  plane in front of scrolling parallax layers.
- **Placeholder-first:** flat-color primitive meshes stand in for every entity and are
  drop-in-replaced by generated 3D models, textures, and the menu video.

## Scope
**In:** one stage + 3-phase boss, ship + Wave Cannon + Force, 4 enemy types
(gunner, weaver, carrier, turret) + minions, 4 power-ups, full screen/UX flow, touch +
keyboard, procedural placeholder art/audio, optional AI-generated asset upgrade.
**Out:** multiple stages, branching, online leaderboard, local co-op, settings beyond
mute, controller support.
