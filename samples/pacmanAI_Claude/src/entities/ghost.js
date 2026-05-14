import {
  TILE, COLS, ROWS, GHOST_SPEED, GHOST_FRIGHTENED_SPEED, GHOST_EATEN_SPEED,
  GHOST_TUNNEL_SPEED, DIR, oppositeDir, TUNNEL_ROW, GHOST_HOUSE_EXIT,
} from '../constants.js';

const MODE = {
  HOUSE: 'house',
  LEAVING: 'leaving',
  SCATTER: 'scatter',
  CHASE: 'chase',
  FRIGHTENED: 'frightened',
  EATEN: 'eaten',
};

export class Ghost {
  constructor(name, spawn, color, releaseDelay = 0) {
    this.name = name;
    this.spawn = spawn;
    this.color = color;
    this.releaseDelay = releaseDelay;
    this.reset();
  }

  reset() {
    this.col = this.spawn.col;
    this.row = this.spawn.row;
    this.x = (this.col + 0.5) * TILE;
    this.y = (this.row + 0.5) * TILE;
    this.dir = this.name === 'blinky' ? DIR.LEFT : DIR.UP;
    this.mode = this.name === 'blinky' ? MODE.SCATTER : MODE.HOUSE;
    this.houseTimer = this.releaseDelay;
    this.frightenedTimer = 0;
    this.eatenScored = false;
    this.bobAnim = 0;
  }

  get isEdible() {
    return this.mode === MODE.FRIGHTENED;
  }

  get isEaten() {
    return this.mode === MODE.EATEN;
  }

  get isActive() {
    return this.mode !== MODE.HOUSE && this.mode !== MODE.EATEN;
  }

  applyMode(globalMode) {
    if (this.mode === MODE.FRIGHTENED || this.mode === MODE.EATEN ||
        this.mode === MODE.HOUSE || this.mode === MODE.LEAVING) return;
    if (this.mode !== globalMode) {
      this.dir = oppositeDir(this.dir);
      this.mode = globalMode;
    }
  }

  frighten(duration) {
    if (this.mode === MODE.EATEN || this.mode === MODE.HOUSE || this.mode === MODE.LEAVING) return;
    this.dir = oppositeDir(this.dir);
    this.mode = MODE.FRIGHTENED;
    this.frightenedTimer = duration;
    this.eatenScored = false;
  }

  getEaten(globalMode) {
    this.mode = MODE.EATEN;
    this.eatenScored = false;
    this.targetMode = globalMode;
  }

  update(dt, maze, player, blinky, globalMode) {
    this.bobAnim = (this.bobAnim + dt * 6) % (Math.PI * 2);

    if (this.mode === MODE.HOUSE) {
      this.houseTimer -= dt;
      this.bobInHouse(dt);
      if (this.houseTimer <= 0) {
        this.mode = MODE.LEAVING;
      }
      return;
    }

    if (this.mode === MODE.LEAVING) {
      const exitX = (GHOST_HOUSE_EXIT.col + 0.5) * TILE;
      const exitY = (GHOST_HOUSE_EXIT.row + 0.5) * TILE;
      const dx = exitX - this.x;
      const dy = exitY - this.y;
      const speed = GHOST_SPEED * 0.65;
      if (Math.abs(dx) > 0.5) {
        const step = Math.min(Math.abs(dx), speed * dt);
        this.x += Math.sign(dx) * step;
        this.dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
      } else if (Math.abs(dy) > 0.5) {
        const step = Math.min(Math.abs(dy), speed * dt);
        this.y += Math.sign(dy) * step;
        this.dir = dy > 0 ? DIR.DOWN : DIR.UP;
      } else {
        this.x = exitX;
        this.y = exitY;
        this.dir = DIR.LEFT;
        this.mode = globalMode === MODE.SCATTER ? MODE.SCATTER : MODE.CHASE;
      }
      this.col = Math.floor(this.x / TILE);
      this.row = Math.floor(this.y / TILE);
      return;
    }

    if (this.mode === MODE.FRIGHTENED) {
      this.frightenedTimer -= dt;
      if (this.frightenedTimer <= 0) {
        this.mode = globalMode === MODE.SCATTER ? MODE.SCATTER : MODE.CHASE;
      }
    }

    if (this.mode === MODE.EATEN) {
      const targetX = (this.spawn.col + 0.5) * TILE;
      const targetY = (this.spawn.row + 0.5) * TILE;
      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) {
        this.x = targetX;
        this.y = targetY;
        this.mode = MODE.LEAVING;
        this.houseTimer = 0;
        return;
      }
      const step = Math.min(GHOST_EATEN_SPEED * dt, dist);
      this.x += (dx / dist) * step;
      this.y += (dy / dist) * step;
      if (Math.abs(dx) > Math.abs(dy)) this.dir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
      else this.dir = dy > 0 ? DIR.DOWN : DIR.UP;
      this.col = Math.floor(this.x / TILE);
      this.row = Math.floor(this.y / TILE);
      return;
    }

    const target = this.chooseTarget(player, blinky);
    let speed = this.mode === MODE.FRIGHTENED ? GHOST_FRIGHTENED_SPEED : GHOST_SPEED;
    if (this.row === TUNNEL_ROW) speed = Math.min(speed, GHOST_TUNNEL_SPEED);
    this.stepGrid(dt, maze, target, speed, false);
  }

  bobInHouse(dt) {
    const baseY = (this.spawn.row + 0.5) * TILE;
    this.y = baseY + Math.sin(this.bobAnim) * 3;
  }

  chooseTarget(player, blinky) {
    if (this.mode === MODE.SCATTER) return this.spawn.scatterTarget;
    if (this.mode === MODE.FRIGHTENED) {
      return { col: Math.floor(Math.random() * COLS), row: Math.floor(Math.random() * ROWS) };
    }
    switch (this.name) {
      case 'blinky':
        return { col: player.col, row: player.row };
      case 'pinky': {
        return { col: player.col + player.dir.x * 4, row: player.row + player.dir.y * 4 };
      }
      case 'inky': {
        const aheadCol = player.col + player.dir.x * 2;
        const aheadRow = player.row + player.dir.y * 2;
        return {
          col: aheadCol + (aheadCol - blinky.col),
          row: aheadRow + (aheadRow - blinky.row),
        };
      }
      case 'clyde': {
        const dx = player.col - this.col;
        const dy = player.row - this.row;
        const distSq = dx * dx + dy * dy;
        if (distSq > 64) return { col: player.col, row: player.row };
        return this.spawn.scatterTarget;
      }
      default:
        return { col: player.col, row: player.row };
    }
  }

  moveToward(target, dt, speed, allowDoor) {
    const tx = (target.col + 0.5) * TILE;
    const ty = (target.row + 0.5) * TILE;
    const dx = tx - this.x;
    const dy = ty - this.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.5) return;
    const step = Math.min(speed * dt, len);
    this.x += (dx / len) * step;
    this.y += (dy / len) * step;
    this.col = Math.floor(this.x / TILE);
    this.row = Math.floor(this.y / TILE);
  }

  stepGrid(dt, maze, target, speed, allowDoor) {
    const tc = Math.floor(this.x / TILE);
    const tr = Math.floor(this.y / TILE);
    const centerX = (tc + 0.5) * TILE;
    const centerY = (tr + 0.5) * TILE;
    const atCenter = Math.abs(this.x - centerX) < 0.8 && Math.abs(this.y - centerY) < 0.8;

    if (atCenter) {
      this.x = centerX;
      this.y = centerY;
      this.dir = this.pickDirection(maze, tc, tr, target, allowDoor);
    }

    let dx = this.dir.x * speed * dt;
    let dy = this.dir.y * speed * dt;

    if (this.dir.x !== 0) {
      const ahead = tc + this.dir.x;
      if (!maze.isWalkable(ahead, tr, { allowDoor }) && tr !== TUNNEL_ROW) {
        if ((this.dir.x > 0 && this.x + dx > centerX) || (this.dir.x < 0 && this.x + dx < centerX)) {
          this.x = centerX;
          dx = 0;
        }
      }
      this.y = centerY;
    } else if (this.dir.y !== 0) {
      const ahead = tr + this.dir.y;
      if (!maze.isWalkable(tc, ahead, { allowDoor })) {
        if ((this.dir.y > 0 && this.y + dy > centerY) || (this.dir.y < 0 && this.y + dy < centerY)) {
          this.y = centerY;
          dy = 0;
        }
      }
      this.x = centerX;
    }

    this.x += dx;
    this.y += dy;

    if (this.x < -TILE / 2) this.x = COLS * TILE + TILE / 2 - 1;
    if (this.x > COLS * TILE + TILE / 2) this.x = -TILE / 2 + 1;

    this.col = Math.floor(this.x / TILE);
    this.row = Math.floor(this.y / TILE);
  }

  pickDirection(maze, tc, tr, target, allowDoor) {
    const candidates = [DIR.UP, DIR.LEFT, DIR.DOWN, DIR.RIGHT];
    const reverse = oppositeDir(this.dir);
    let best = null;
    let bestDist = Infinity;
    for (const d of candidates) {
      if (d === reverse) continue;
      const nc = tc + d.x;
      const nr = tr + d.y;
      if (!maze.isWalkable(nc, nr, { allowDoor })) continue;
      const dx = (nc - target.col);
      const dy = (nr - target.row);
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    if (this.mode === MODE.FRIGHTENED && best) {
      const legal = candidates.filter(d => {
        if (d === reverse) return false;
        return maze.isWalkable(tc + d.x, tr + d.y, { allowDoor });
      });
      if (legal.length > 0) {
        best = legal[Math.floor(Math.random() * legal.length)];
      }
    }
    return best || reverse;
  }
}

export const GHOST_MODE = MODE;
