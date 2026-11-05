import { TILE, COLS, ROWS, GHOST_SPEED, GHOST_FRIGHTENED_SPEED, GHOST_TUNNEL_SPEED } from '../constants.js';

const MODE_SCATTER = 'scatter';
const MODE_CHASE = 'chase';
const MODE_FRIGHTENED = 'frightened';
const MODE_EATEN = 'eaten';
const MODE_HOUSE = 'house';

export class Ghost {
    constructor(name, color, maze, exitOrder) {
        this.name = name;
        this.color = color;
        this.maze = maze;
        this.tileX = 13 + (exitOrder % 2);
        this.tileY = 12;
        this.px = this.tileX * TILE + TILE / 2;
        this.py = this.tileY * TILE + TILE / 2;
        this.dirX = 0;
        this.dirY = -1;
        this.mode = MODE_HOUSE;
        this.exitTimer = exitOrder * 3.0;
        this.exitOrder = exitOrder;
        this.frightenedTimer = 0;
        this.scared = false;
        this.eaten = false;
    }

    reset() {
        this.tileX = 13 + (this.exitOrder % 2);
        this.tileY = 12;
        this.px = this.tileX * TILE + TILE / 2;
        this.py = this.tileY * TILE + TILE / 2;
        this.dirX = 0;
        this.dirY = -1;
        this.mode = MODE_HOUSE;
        this.exitTimer = this.exitOrder * 3.0;
        this.frightenedTimer = 0;
        this.scared = false;
        this.eaten = false;
    }

    resetAfterDeath() {
        this.mode = MODE_EATEN;
        this.scared = false;
        this.eaten = true;
    }

    enterFrightened() {
        if (this.mode === MODE_EATEN || this.mode === MODE_HOUSE) return;
        this.mode = MODE_FRIGHTENED;
        this.scared = true;
        this.frightenedTimer = 0;
        this.dirX = -this.dirX;
        this.dirY = -this.dirY;
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

    getSpeed(globalMode, tunnelSpeed) {
        if (this.mode === MODE_EATEN) return GHOST_SPEED * 1.5;
        if (this.mode === MODE_HOUSE) return GHOST_SPEED * 0.6;
        if (globalMode === MODE_FRIGHTENED || this.mode === MODE_FRIGHTENED) {
            return GHOST_FRIGHTENED_SPEED;
        }
        if (this.tileY === 14 && (this.tileX <= 5 || this.tileX >= 22)) return tunnelSpeed;
        return tunnelSpeed;
    }

    getTarget(player, blinky, globalMode) {
        if (this.mode === MODE_EATEN) {
            return { x: 13, y: 12 };
        }
        if (this.mode === MODE_HOUSE) {
            return { x: 13, y: 10 };
        }
        if (globalMode === MODE_FRIGHTENED || this.mode === MODE_FRIGHTENED) {
            return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        }
        if (this.mode === MODE_SCATTER) {
            const corners = { blinky: { x: 25, y: -3 }, pinky: { x: 2, y: -3 }, inky: { x: 27, y: 34 }, clyde: { x: 0, y: 34 } };
            return corners[this.name];
        }

        const px = player.getTileX();
        const py = player.getTileY();
        switch (this.name) {
            case 'blinky':
                return { x: px, y: py };
            case 'pinky': {
                const dir = player.dirX !== 0 || player.dirY !== 0
                    ? { dx: player.dirX, dy: player.dirY }
                    : { dx: 0, dy: -1 };
                return { x: px + dir.dx * 4, y: py + dir.dy * 4 };
            }
            case 'inky': {
                const aheadX = px + (player.dirX || 0) * 2;
                const aheadY = py + (player.dirY || -1) * 2;
                const bx = blinky.getTileX();
                const by = blinky.getTileY();
                return { x: aheadX + (aheadX - bx), y: aheadY + (aheadY - by) };
            }
            case 'clyde': {
                const gx = this.tileX;
                const gy = this.tileY;
                const dist = Math.sqrt((gx - px) ** 2 + (gy - py) ** 2);
                if (dist > 8) return { x: px, y: py };
                return { x: 0, y: 34 };
            }
            default:
                return { x: px, y: py };
        }
    }

    getValidDirections() {
        const cx = this.tileX;
        const cy = this.tileY;
        const dirs = [];
        const candidates = [
            { dx: 0, dy: -1, name: 'up' },
            { dx: 0, dy: 1, name: 'down' },
            { dx: -1, dy: 0, name: 'left' },
            { dx: 1, dy: 0, name: 'right' },
        ];

        if (this.mode === MODE_EATEN) {
            for (const d of candidates) {
                const nx = this.maze.wrapX(cx + d.dx);
                const ny = cy + d.dy;
                if (!this.maze.isWall(nx, ny)) {
                    dirs.push(d);
                }
            }
        } else if (this.mode === MODE_HOUSE) {
            const candidates2 = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }];
            for (const d of candidates2) {
                const nx = cx + d.dx;
                const ny = cy + d.dy;
                if (ny >= 11 && ny <= 13 && !this.maze.isWall(nx, ny)) {
                    dirs.push({ dx: d.dx, dy: d.dy, name: d.dy < 0 ? 'up' : 'down' });
                }
            }
        } else {
            const reverseDx = -this.dirX;
            const reverseDy = -this.dirY;
            for (const d of candidates) {
                if (d.dx === reverseDx && d.dy === reverseDy && !this.scared && this.mode !== MODE_FRIGHTENED) {
                    if (candidates.length > 2) continue;
                }
                const nx = this.maze.wrapX(cx + d.dx);
                const ny = cy + d.dy;
                if (!this.maze.isWallNoTunnel(nx, ny) && ny >= 0 && ny < ROWS) {
                    dirs.push(d);
                }
            }
        }
        return dirs;
    }

    chooseDirection(target) {
        const dirs = this.getValidDirections();
        if (dirs.length === 0) return { dx: -this.dirX, dy: -this.dirY };
        if (dirs.length === 1) return { dx: dirs[0].dx, dy: dirs[0].dy };

        const gx = this.tileX;
        const gy = this.tileY;
        let bestDir = dirs[0];
        let bestDist = Infinity;

        for (const d of dirs) {
            const nx = this.maze.wrapX(gx + d.dx);
            const ny = gy + d.dy;
            const dist = (nx - target.x) ** 2 + (ny - target.y) ** 2;
            if (dist < bestDist) {
                bestDist = dist;
                bestDir = d;
            }
        }
        return { dx: bestDir.dx, dy: bestDir.dy };
    }

    update(dt, player, blinky, globalMode, globalFrightenedTimer) {
        if (this.mode === MODE_HOUSE) {
            this.exitTimer -= dt;
            if (this.tileY === 11 && this.exitTimer <= 0 && this.maze.canGhostExit(this.tileX, this.tileY - 1)) {
                this.tileY = 11;
                this.py = this.tileY * TILE + TILE / 2;
                this.mode = globalMode;
                this.dirX = 0;
                this.dirY = -1;
            }
        }

        if (this.mode === MODE_EATEN) {
            if (Math.abs(this.tileX - 13) <= 1 && this.tileY === 12) {
                this.tileX = 13 + (this.exitOrder % 2);
                this.tileY = 12;
                this.px = this.tileX * TILE + TILE / 2;
                this.py = this.tileY * TILE + TILE / 2;
                this.mode = MODE_HOUSE;
                this.scared = false;
                this.eaten = false;
                this.exitTimer = 1.5;
                return;
            }
        }

        if (globalMode === MODE_FRIGHTENED && this.mode !== MODE_EATEN) {
            this.mode = MODE_FRIGHTENED;
            this.scared = true;
            this.frightenedTimer = globalFrightenedTimer;
        } else if (globalMode !== MODE_FRIGHTENED && this.mode === MODE_FRIGHTENED) {
            this.mode = globalMode;
            this.scared = false;
        }

        if (this.mode !== MODE_HOUSE && this.isAlignedToTile()) {
            this.px = this.tileX * TILE + TILE / 2;
            this.py = this.tileY * TILE + TILE / 2;

            const target = this.getTarget(player, blinky, globalMode);
            const newDir = this.chooseDirection(target);
            this.dirX = newDir.dx;
            this.dirY = newDir.dy;
        }

        const speed = this.getSpeed(globalMode, globalMode === MODE_FRIGHTENED ? GHOST_FRIGHTENED_SPEED : GHOST_SPEED);
        const move = speed * dt;
        this.px += this.dirX * move;
        this.py += this.dirY * move;

        if (this.px < 0) this.px += COLS * TILE;
        if (this.px >= COLS * TILE) this.px -= COLS * TILE;

        this.tileX = Math.floor((this.px + TILE / 2) / TILE);
        if (this.tileX < 0) this.tileX += COLS;
        if (this.tileX >= COLS) this.tileX -= COLS;
        this.tileY = Math.floor((this.py + TILE / 2) / TILE);
    }
}
