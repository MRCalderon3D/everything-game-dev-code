// Single source of truth for all gameplay tuning. No DOM, no Three.js.

export const BOARD_SIZE = 12;

// S-curve path as [col,row] waypoints; enemies walk the polyline in order.
// The last waypoint is the crystal base tile.
export const PATH_WAYPOINTS = [
  [0, 2],
  [8, 2],
  [8, 5],
  [3, 5],
  [3, 8],
  [10, 8],
];

export const START_GOLD = 120;
export const START_LIVES = 10;
export const SELL_REFUND = 0.7;
export const WAVE_BONUS_BASE = 25;
export const WAVE_BONUS_PER_WAVE = 5;
export const FIRST_WAVE_COUNTDOWN = 4;
export const BETWEEN_WAVE_COUNTDOWN = 6;

export const MAX_ENEMIES = 80;
export const MAX_PROJECTILES = 64;

export const TOWER_TYPES = {
  cannon: {
    name: 'Cannon',
    cost: 50,
    upgradeCost: 60,
    projectileSpeed: 9,
    color: 0xff8c42,
    // L1, L2 (single upgrade level)
    levels: [
      { damage: 26, range: 2.6, rate: 1.0 },
      { damage: 48, range: 2.9, rate: 1.25 },
    ],
  },
  frost: {
    name: 'Frost',
    cost: 60,
    upgradeCost: 70,
    projectileSpeed: 0, // radial pulse, no projectile
    color: 0x4cc9f0,
    levels: [
      { damage: 5, range: 2.3, rate: 0.8, slow: 0.5, slowTime: 2.0 },
      { damage: 9, range: 2.7, rate: 0.9, slow: 0.65, slowTime: 2.5 },
    ],
  },
  laser: {
    name: 'Laser',
    cost: 70,
    upgradeCost: 80,
    projectileSpeed: 14,
    color: 0xf72585,
    levels: [
      { damage: 7, range: 3.1, rate: 4 },
      { damage: 12, range: 3.4, rate: 5 },
    ],
  },
};

export const ENEMY_TYPES = {
  runner: { hp: 38, speed: 2.1, gold: 8, leak: 1, radius: 0.2 },
  tank: { hp: 150, speed: 0.95, gold: 20, leak: 2, radius: 0.3 },
  boss: { hp: 2600, speed: 0.65, gold: 250, leak: 10, radius: 0.5 },
};

// entries: spawned in parallel streams; delay offsets a stream's first spawn.
export const WAVES = [
  { hpMul: 1.0, entries: [{ type: 'runner', count: 8, interval: 0.9, delay: 0 }] },
  { hpMul: 1.15, entries: [{ type: 'runner', count: 12, interval: 0.8, delay: 0 }] },
  {
    hpMul: 1.3,
    entries: [
      { type: 'runner', count: 10, interval: 0.8, delay: 0 },
      { type: 'tank', count: 2, interval: 2.0, delay: 3 },
    ],
  },
  {
    hpMul: 1.45,
    entries: [
      { type: 'runner', count: 14, interval: 0.7, delay: 0 },
      { type: 'tank', count: 3, interval: 1.8, delay: 2 },
    ],
  },
  {
    hpMul: 1.6,
    entries: [
      { type: 'runner', count: 8, interval: 0.6, delay: 0 },
      { type: 'tank', count: 6, interval: 1.5, delay: 1 },
    ],
  },
  {
    hpMul: 1.8,
    entries: [
      { type: 'runner', count: 18, interval: 0.55, delay: 0 },
      { type: 'tank', count: 4, interval: 1.6, delay: 2 },
    ],
  },
  {
    hpMul: 2.0,
    entries: [
      { type: 'runner', count: 14, interval: 0.5, delay: 0 },
      { type: 'tank', count: 8, interval: 1.3, delay: 1 },
    ],
  },
  {
    hpMul: 2.25,
    entries: [
      { type: 'runner', count: 22, interval: 0.45, delay: 0 },
      { type: 'tank', count: 8, interval: 1.2, delay: 2 },
    ],
  },
  // Stress wave: 42 enemies, intentionally pushes 40+ concurrent.
  {
    hpMul: 2.5,
    entries: [
      { type: 'runner', count: 30, interval: 0.35, delay: 0 },
      { type: 'tank', count: 12, interval: 1.0, delay: 1 },
    ],
  },
  {
    hpMul: 2.8,
    entries: [
      { type: 'runner', count: 20, interval: 0.4, delay: 0 },
      { type: 'tank', count: 10, interval: 1.1, delay: 2 },
      { type: 'boss', count: 1, interval: 1, delay: 8 },
    ],
  },
];

export const SCORE_PER_WAVE = 1000;

// Grid <-> world mapping shared by sim and render: tile (col,row) center sits
// at world (col - 5.5, row - 5.5) on the XZ plane, 1 unit per tile.
export function tileToWorldX(col) {
  return col - (BOARD_SIZE - 1) / 2;
}

export function tileToWorldZ(row) {
  return row - (BOARD_SIZE - 1) / 2;
}

export function worldToCol(x) {
  return Math.floor(x + BOARD_SIZE / 2);
}

export function worldToRow(z) {
  return Math.floor(z + BOARD_SIZE / 2);
}
