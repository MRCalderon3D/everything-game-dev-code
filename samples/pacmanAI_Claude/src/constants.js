export const TILE = 16;
export const COLS = 28;
export const ROWS = 31;

export const PLAYER_SPEED = 80;
export const GHOST_SPEED = 75;
export const GHOST_FRIGHTENED_SPEED = 45;
export const GHOST_EATEN_SPEED = 150;
export const GHOST_TUNNEL_SPEED = 40;

export const FRIGHTENED_DURATION = 7.0;
export const FRIGHTENED_FLASH_AT = 5.0;
export const SCATTER_DURATION = 7.0;
export const CHASE_DURATION = 20.0;

export const PELLET_SCORE = 10;
export const POWER_PELLET_SCORE = 50;
export const GHOST_SCORES = [200, 400, 800, 1600];
export const EXTRA_LIFE_AT = 10000;
export const STARTING_LIVES = 3;

export const COLORS = {
  bg: '#000000',
  wall: '#1f2bbf',
  wallShadow: '#0c1267',
  pellet: '#ffd6a5',
  powerPellet: '#ffd6a5',
  player: '#ffea00',
  playerOutline: '#ffce00',
  ghostBlinky: '#ff3b3b',
  ghostPinky: '#ffa6e0',
  ghostInky: '#3df0ff',
  ghostClyde: '#ffb84d',
  ghostFrightened: '#3b4dff',
  ghostFrightenedFlash: '#ffffff',
  ghostEyes: '#ffffff',
  ghostPupils: '#1c2bb0',
  text: '#ffea00',
  textDim: '#ffd6a5',
  textAlt: '#ffffff',
};

export const DIR = {
  NONE: { x: 0, y: 0, name: 'none' },
  UP:    { x: 0, y: -1, name: 'up' },
  DOWN:  { x: 0, y: 1, name: 'down' },
  LEFT:  { x: -1, y: 0, name: 'left' },
  RIGHT: { x: 1, y: 0, name: 'right' },
};

export function oppositeDir(d) {
  if (d === DIR.UP) return DIR.DOWN;
  if (d === DIR.DOWN) return DIR.UP;
  if (d === DIR.LEFT) return DIR.RIGHT;
  if (d === DIR.RIGHT) return DIR.LEFT;
  return DIR.NONE;
}

export const MAZE = [
  '############################',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#o####.#####.##.#####.####o#',
  '#.####.#####.##.#####.####.#',
  '#..........................#',
  '#.####.##.########.##.####.#',
  '#.####.##.########.##.####.#',
  '#......##....##....##......#',
  '######.##### ## #####.######',
  '######.##### ## #####.######',
  '######.##          ##.######',
  '######.## ###--### ##.######',
  '######.## #      # ##.######',
  '      .   #      #   .      ',
  '######.## #      # ##.######',
  '######.## ######## ##.######',
  '######.##          ##.######',
  '######.## ######## ##.######',
  '######.## ######## ##.######',
  '#............##............#',
  '#.####.#####.##.#####.####.#',
  '#.####.#####.##.#####.####.#',
  '#o..##.......  .......##..o#',
  '###.##.##.########.##.##.###',
  '###.##.##.########.##.##.###',
  '#......##....##....##......#',
  '#.##########.##.##########.#',
  '#.##########.##.##########.#',
  '#..........................#',
  '############################',
];

export const TUNNEL_ROW = 14;

export const PLAYER_SPAWN = { col: 13.5, row: 23 };

export const GHOST_SPAWNS = {
  blinky: { col: 13.5, row: 11, scatterTarget: { col: 25, row: 0 } },
  pinky:  { col: 13.5, row: 14, scatterTarget: { col: 2,  row: 0 } },
  inky:   { col: 11.5, row: 14, scatterTarget: { col: 27, row: 30 } },
  clyde:  { col: 15.5, row: 14, scatterTarget: { col: 0,  row: 30 } },
};

export const GHOST_HOUSE_EXIT = { col: 13.5, row: 11 };

export const STORAGE_KEY = 'pacman-claude/highscore';
