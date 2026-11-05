import { TILE, COLS, PLAYER_SPEED, DIR, oppositeDir, TUNNEL_ROW } from '../constants.js';

export class Player {
  constructor(spawn) {
    this.spawn = spawn;
    this.reset();
  }

  reset() {
    this.col = this.spawn.col;
    this.row = this.spawn.row;
    this.x = (this.col + 0.5) * TILE;
    this.y = (this.row + 0.5) * TILE;
    this.dir = DIR.LEFT;
    this.nextDir = DIR.LEFT;
    this.mouthAnim = 0;
    this.alive = true;
    this.dyingTimer = 0;
  }

  setNextDir(dir) {
    if (!dir || dir === DIR.NONE) return;
    this.nextDir = dir;
  }

  update(dt, maze) {
    if (!this.alive) {
      this.dyingTimer += dt;
      return;
    }
    this.mouthAnim = (this.mouthAnim + dt * 10) % (Math.PI * 2);

    const tc = Math.floor(this.x / TILE);
    const tr = Math.floor(this.y / TILE);
    const centerX = (tc + 0.5) * TILE;
    const centerY = (tr + 0.5) * TILE;

    const nearCenterX = Math.abs(this.x - centerX) < 1.0;
    const nearCenterY = Math.abs(this.y - centerY) < 1.0;
    const atCenter = nearCenterX && nearCenterY;

    if (this.nextDir !== this.dir && this.nextDir !== DIR.NONE) {
      const isOpposite = this.nextDir === oppositeDir(this.dir);
      if (isOpposite) {
        this.dir = this.nextDir;
      } else if (atCenter) {
        const nc = tc + this.nextDir.x;
        const nr = tr + this.nextDir.y;
        if (maze.isWalkable(nc, nr)) {
          this.dir = this.nextDir;
          this.x = centerX;
          this.y = centerY;
        }
      }
    }

    let dx = this.dir.x * PLAYER_SPEED * dt;
    let dy = this.dir.y * PLAYER_SPEED * dt;

    if (this.dir.x !== 0) {
      const ahead = tc + this.dir.x;
      if (!maze.isWalkable(ahead, tr) && tr !== TUNNEL_ROW) {
        const limitX = centerX;
        if ((this.dir.x > 0 && this.x + dx > limitX) || (this.dir.x < 0 && this.x + dx < limitX)) {
          this.x = limitX;
          dx = 0;
        }
      }
      this.y = centerY;
    } else if (this.dir.y !== 0) {
      const ahead = tr + this.dir.y;
      if (!maze.isWalkable(tc, ahead)) {
        const limitY = centerY;
        if ((this.dir.y > 0 && this.y + dy > limitY) || (this.dir.y < 0 && this.y + dy < limitY)) {
          this.y = limitY;
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

  die() {
    this.alive = false;
    this.dyingTimer = 0;
  }

  isDeathAnimationDone() {
    return !this.alive && this.dyingTimer > 1.6;
  }

  mouthOpenAmount() {
    if (!this.alive) {
      return Math.max(0, 1 - this.dyingTimer / 1.4) * 0.9;
    }
    return 0.15 + 0.35 * (Math.sin(this.mouthAnim) * 0.5 + 0.5);
  }
}
