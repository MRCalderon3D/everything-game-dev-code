import { TILE, COLS, PLAYER_SPEED } from '../constants.js';

export class Player {
    constructor(maze) {
        this.maze = maze;
        this.tileX = 14;
        this.tileY = 23;
        this.px = this.tileX * TILE + TILE / 2;
        this.py = this.tileY * TILE + TILE / 2;
        this.dirX = 0;
        this.dirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;
        this.speed = PLAYER_SPEED;
        this.mouthAngle = 0;
        this.mouthOpen = true;
        this.mouthTimer = 0;
        this.dead = false;
        this.deathTimer = 0;
    }

    reset() {
        this.tileX = 14;
        this.tileY = 23;
        this.px = this.tileX * TILE + TILE / 2;
        this.py = this.tileY * TILE + TILE / 2;
        this.dirX = 0;
        this.dirY = 0;
        this.nextDirX = 0;
        this.nextDirY = 0;
        this.dead = false;
        this.deathTimer = 0;
        this.mouthTimer = 0;
    }

    setDirection(dx, dy) {
        this.nextDirX = dx;
        this.nextDirY = dy;
    }

    getCenterX() { return this.px; }
    getCenterY() { return this.py; }

    getTileX() { return this.tileX; }
    getTileY() { return this.tileY; }

    isAlignedToTile(threshold = 2) {
        const cx = this.tileX * TILE + TILE / 2;
        const cy = this.tileY * TILE + TILE / 2;
        return Math.abs(this.px - cx) < threshold && Math.abs(this.py - cy) < threshold;
    }

    update(dt) {
        if (this.dead) {
            this.deathTimer -= dt;
            return;
        }

        this.mouthTimer += dt;
        if (this.mouthTimer > 0.05) {
            this.mouthTimer = 0;
            this.mouthOpen = !this.mouthOpen;
            this.mouthAngle = this.mouthOpen ? 0.8 : 0.15;
        }

        if (this.isAlignedToTile()) {
            this.px = this.tileX * TILE + TILE / 2;
            this.py = this.tileY * TILE + TILE / 2;

            const nx = this.nextDirX;
            const ny = this.nextDirY;
            if (nx !== 0 || ny !== 0) {
                const testX = this.tileX + nx;
                const testY = this.tileY + ny;
                const wrappedX = this.maze.wrapX(testX);
                if (!this.maze.isWallNoTunnel(wrappedX, testY)) {
                    this.dirX = nx;
                    this.dirY = ny;
                }
            }

            if (this.dirX !== 0 || this.dirY !== 0) {
                const testX = this.tileX + this.dirX;
                const testY = this.tileY + this.dirY;
                const wrappedX = this.maze.wrapX(testX);
                if (this.maze.isWallNoTunnel(wrappedX, testY)) {
                    this.dirX = 0;
                    this.dirY = 0;
                }
            }
        }

        const move = this.speed * dt;
        this.px += this.dirX * move;
        this.py += this.dirY * move;

        if (this.px < 0) this.px += COLS * TILE;
        if (this.px >= COLS * TILE) this.px -= COLS * TILE;

        this.tileX = Math.floor((this.px + TILE / 2) / TILE);
        if (this.tileX < 0) this.tileX += COLS;
        if (this.tileX >= COLS) this.tileX -= COLS;
        this.tileY = Math.floor((this.py + TILE / 2) / TILE);
    }

    startDeath() {
        this.dead = true;
        this.deathTimer = 1.5;
        this.dirX = 0;
        this.dirY = 0;
    }
}
