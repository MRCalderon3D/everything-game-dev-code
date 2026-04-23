export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const COLORS = {
  background: 0x1a1a2e,
  player: 0x8b4513,
  playerSail: 0xffffff,
  sloop: 0x2ecc71,
  brigantine: 0x3498db,
  galleon: 0xe74c3c,
  playerBullet: 0x333333,
  enemyBullet: 0xf1c40f,
  powerup: 0xffd700,
  shield: 0xffd700,
  uiText: 0xffffff,
  uiGold: 0xffd700,
  panelBg: 0x16213e,
};

export const PLAYER = {
  speed: 300,
  fireRate: 300,
  maxBullets: 3,
  startLives: 3,
  y: GAME_HEIGHT - 50,
  width: 40,
  height: 30,
};

export const ENEMIES = {
  sloop: { hp: 1, points: 10, fireRate: 3000, speed: 40, key: 'sloop' },
  brigantine: { hp: 2, points: 25, fireRate: 2000, speed: 50, key: 'brigantine' },
  galleon: { hp: 3, points: 50, fireRate: 1500, speed: 35, key: 'galleon', spread: true },
  stepDown: 20,
  bulletSpeed: 200,
};

export const POWERUPS = {
  dropChance: 0.15,
  duration: 8000,
  fallSpeed: 80,
  types: ['tripleShot', 'shield', 'rapidFire'],
};

export const WAVES = [
  { sloops: 15, brigantines: 0, galleons: 0 },
  { sloops: 10, brigantines: 5, galleons: 0 },
  { sloops: 8, brigantines: 5, galleons: 2 },
  { sloops: 5, brigantines: 8, galleons: 2 },
  { sloops: 5, brigantines: 5, galleons: 5 },
];

export const FORMATION = {
  cols: 5,
  rows: 3,
  spacingX: 70,
  spacingY: 55,
  startX: 200,
  startY: 80,
};

export const BULLET = {
  playerSpeed: -400,
  width: 6,
  height: 10,
};
