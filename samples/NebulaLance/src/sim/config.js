// All gameplay constants, entity definitions, and the authored stage timeline.
// Pure data + tiny helpers — no DOM, no Three.js. Shared by sim and render.

// ---- world bounds (sim space; right is "forward") ----
export const FIELD = { xMin: -9, xMax: 9, yMin: -5, yMax: 5 };
export const PLAYER_BOUNDS = { xMin: -8.4, xMax: 6, yMin: -4.6, yMax: 4.6 };
export const SPAWN_X = 9.6; // enemies enter just off the right edge
export const DESPAWN_X = -10.2; // off the left edge

// ---- pool capacities ----
export const MAX_PLAYER_BULLETS = 64;
export const MAX_ENEMY_BULLETS = 220;
export const MAX_ENEMIES = 40;
export const MAX_POWERUPS = 8;
export const MAX_MINIONS = 12;

// ---- player ----
export const PLAYER = {
  radius: 0.32,
  baseSpeed: 7.5,
  speedPerLevel: 1.4,
  startLives: 3,
  respawnInvuln: 1.7,
  bulletSpeed: 16,
  bulletRadius: 0.14,
  bulletDamage: 1,
  fireGap: 0.12, // min seconds between press-shots
  streamSpacing: 0.42, // y gap between parallel streams at power>1
};

// ---- wave cannon (charge beam) ----
export const WAVE = {
  chargeTime: 1.4, // seconds to full
  minBeamCharge: 0.35, // below this a release does nothing extra
  beamSpeed: 22,
  beamLifetime: 0.6,
  // tier by charge: damage and half-height of the piercing beam
  tiers: [
    { at: 0.35, damage: 6, halfH: 0.35 },
    { at: 0.7, damage: 12, halfH: 0.55 },
    { at: 1.0, damage: 22, halfH: 0.8 },
  ],
};

// ---- Force pod ----
export const FORCE = {
  radius: 0.42,
  frontOffset: 0.95,
  rearOffset: -0.95,
  followLerp: 0.25,
  launchSpeed: 14,
  recallSpeed: 16,
  contactDamage: 4, // per step while overlapping an enemy (detached or attached)
  fireGap: 0.22,
  weapons: ['spread', 'laser', 'homing'],
};

// ---- power-ups ----
export const POWERUP_KINDS = ['force', 'power', 'speed', 'shield'];
export const POWERUP = { radius: 0.4, driftSpeed: 2.2 };
export const MAX_POWER_LEVEL = 3;
export const MAX_SPEED_LEVEL = 3;

// ---- scoring ----
export const COMBO_WINDOW = 2.5; // seconds to chain a kill
export const COMBO_PER_TIER = 5; // kills per +1 multiplier
export const MAX_MULTIPLIER = 8;

// ---- enemy archetypes ----
// move(e, t, dt) mutates position; fire cadence in seconds (0 = never).
export const ENEMY_TYPES = {
  gunner: { hp: 2, radius: 0.38, score: 100, speed: 3.2, fireGap: 1.7, bulletSpeed: 5.5, color: 0x49e0c8 },
  weaver: { hp: 1, radius: 0.34, score: 80, speed: 5.0, fireGap: 0, bulletSpeed: 0, color: 0x8a7bff },
  carrier: { hp: 7, radius: 0.62, score: 250, speed: 1.9, fireGap: 0, bulletSpeed: 0, color: 0xffb24c, dropsPowerup: true },
  turret: { hp: 4, radius: 0.44, score: 150, speed: 2.4, fireGap: 1.4, bulletSpeed: 6.5, color: 0xff5c8a },
  minion: { hp: 1, radius: 0.3, score: 50, speed: 4.2, fireGap: 0, bulletSpeed: 0, color: 0xff4dd2 },
};
export const ENEMY_BULLET_RADIUS = 0.16;

// ---- boss "THE MAW" ----
export const BOSS = {
  enterFrom: 12,
  anchorX: 5.4,
  enterSpeed: 2.8,
  bodyRadius: 1.9,
  coreRadius: 0.62,
  coreOffsetX: -1.6, // core sits at the boss's front (left) face
  bobAmplitude: 2.6,
  contactDamage: true,
  phases: [
    { coreHp: 42, bobSpeed: 0.7, fanGap: 2.2, fanCount: 7, fanSpeed: 5.5, beam: false, minionGap: 0 },
    { coreHp: 58, bobSpeed: 1.0, fanGap: 2.6, fanCount: 9, fanSpeed: 6.0, beam: true, beamGap: 4.2, minionGap: 4.5 },
    { coreHp: 78, bobSpeed: 1.35, fanGap: 1.7, fanCount: 11, fanSpeed: 6.5, beam: true, beamGap: 3.2, minionGap: 3.2 },
  ],
  beamWarn: 0.8,
  beamActive: 0.55,
  beamHalfH: 0.7,
};

// ---- mid-stage hazard (closing organic corridor) ----
// Keyframes of the corridor half-gap over the gauntlet window; the corridor
// narrows then reopens. It never closes below 2*minGap so it stays navigable.
export const HAZARD = {
  start: 22,
  end: 42,
  minGap: 1.6, // half-gap at tightest (player half-height fits with margin)
  maxGap: 4.8,
  wallThickness: 1.2,
};

// ---- authored stage timeline ----
// Each entry: { t, type, y, count?, gap?, side? }. `wave` expands to `count`
// enemies of `type` spaced by `gap` seconds starting at `t`.
export const STAGE = {
  bossTime: 52,
  spawns: [
    { t: 2.0, type: 'gunner', y: 2.0, count: 4, gap: 0.6 },
    { t: 3.5, type: 'weaver', y: -2.4, count: 5, gap: 0.45 },
    { t: 5.0, type: 'carrier', y: 0.5 }, // drops the Force-granting power-up
    { t: 8.0, type: 'gunner', y: -1.5, count: 4, gap: 0.55 },
    { t: 9.5, type: 'weaver', y: 3.0, count: 6, gap: 0.4 },
    { t: 13.0, type: 'gunner', y: 0.0, count: 5, gap: 0.5 },
    { t: 15.0, type: 'weaver', y: -3.2, count: 6, gap: 0.4 },
    { t: 18.0, type: 'carrier', y: -1.0 },
    // gauntlet: turrets ride the closing walls
    { t: 24.0, type: 'turret', y: 3.6, count: 3, gap: 2.2 },
    { t: 25.5, type: 'turret', y: -3.6, count: 3, gap: 2.2 },
    { t: 30.0, type: 'gunner', y: 0.0, count: 4, gap: 0.7 },
    { t: 34.0, type: 'turret', y: 3.4, count: 2, gap: 2.0 },
    { t: 35.0, type: 'turret', y: -3.4, count: 2, gap: 2.0 },
    // lull + prep
    { t: 44.0, type: 'carrier', y: 0.0 },
    { t: 47.0, type: 'weaver', y: 2.5, count: 4, gap: 0.5 },
  ],
};

export function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
