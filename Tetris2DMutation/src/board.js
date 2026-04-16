import { COLS, TOTAL_ROWS, HIDDEN_ROWS } from './constants.js';

export class Board {
    constructor() {
        this.grid = [];
        this.reset();
    }

    reset() {
        this.grid = [];
        for (let r = 0; r < TOTAL_ROWS; r++) {
            this.grid.push(new Array(COLS).fill(null));
        }
    }

    getCell(x, y) {
        if (x < 0 || x >= COLS || y < 0 || y >= TOTAL_ROWS) return undefined;
        return this.grid[y][x];
    }

    isValid(piece) {
        const blocks = piece.getBlocks();
        for (const b of blocks) {
            if (b.x < 0 || b.x >= COLS || b.y >= TOTAL_ROWS) return false;
            if (b.y < 0) continue; // allow above the top
            if (this.grid[b.y][b.x] !== null) return false;
        }
        return true;
    }

    lock(piece) {
        const blocks = piece.getBlocks();
        for (const b of blocks) {
            if (b.y >= 0 && b.y < TOTAL_ROWS && b.x >= 0 && b.x < COLS) {
                this.grid[b.y][b.x] = { color: piece.color };
            }
        }
    }

    clearLines() {
        const clearedRows = [];
        for (let r = TOTAL_ROWS - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell !== null)) {
                clearedRows.push(r);
            }
        }

        if (clearedRows.length === 0) return { count: 0, rows: [] };

        // Remove cleared rows and add empty ones at top
        for (const row of clearedRows) {
            this.grid.splice(row, 1);
        }
        for (let i = 0; i < clearedRows.length; i++) {
            this.grid.unshift(new Array(COLS).fill(null));
        }

        return { count: clearedRows.length, rows: clearedRows };
    }

    isTopOut() {
        // Check if any cell in the visible top row (row HIDDEN_ROWS) is filled
        for (let c = 0; c < COLS; c++) {
            if (this.grid[HIDDEN_ROWS][c] !== null) return true;
        }
        return false;
    }

    getGhostY(piece) {
        const ghost = piece.clone();
        while (this.isValid(ghost)) {
            ghost.y++;
        }
        ghost.y--;
        return ghost.y;
    }
}
