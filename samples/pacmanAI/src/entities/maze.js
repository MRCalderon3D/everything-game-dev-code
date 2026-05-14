import { MAZE, TILE, COLS, ROWS } from '../constants.js';

export class Maze {
    constructor() {
        this.reset();
    }

    reset() {
        this.grid = MAZE.map(row => [...row]);
        this.totalDots = 0;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (this.grid[y][x] === 2) this.totalDots++;
            }
        }
        this.dotsEaten = 0;
        this.allDotsEaten = false;
    }

    isWall(x, y) {
        if (y < 0 || y >= ROWS) return true;
        if (x < 0 || x >= COLS) return false;
        const cell = this.grid[y][x];
        return cell === 1;
    }

    isWallNoTunnel(x, y) {
        if (y < 0 || y >= ROWS) return true;
        if (x < 0 || x >= COLS) return true;
        const cell = this.grid[y][x];
        return cell === 1 || cell === 5;
    }

    isGhostWalkable(x, y) {
        if (y < 0 || y >= ROWS) return false;
        if (x < 0 || x >= COLS) return false;
        const cell = this.grid[y][x];
        return cell !== 1;
    }

    isGhostHouseEntrance(x, y) {
        if (y < 0 || y >= ROWS) return false;
        if (x < 0 || x >= COLS) return false;
        return this.grid[y][x] === 4;
    }

    canGhostExit(x, y) {
        return !this.isWall(x, y);
    }

    eatDot(x, y) {
        if (y < 0 || y >= ROWS || x < 0 || x >= COLS) return null;
        const cell = this.grid[y][x];
        if (cell === 2) {
            this.grid[y][x] = 0;
            this.dotsEaten++;
            this.allDotsEaten = this.dotsEaten >= this.totalDots;
            return 'dot';
        }
        if (cell === 3) {
            this.grid[y][x] = 0;
            return 'power';
        }
        return null;
    }

    wrapX(x) {
        if (x < 0) return COLS - 1;
        if (x >= COLS) return 0;
        return x;
    }

    getRemainingDots() {
        return this.totalDots - this.dotsEaten;
    }
}
