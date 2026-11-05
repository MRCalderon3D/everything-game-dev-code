import { MAZE, COLS, ROWS, TUNNEL_ROW } from '../constants.js';

export class Maze {
  constructor() {
    this.grid = MAZE.map(row => row.split(''));
    this.totalPellets = 0;
    this.pelletsLeft = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c] === '.' || this.grid[r][c] === 'o') this.totalPellets++;
      }
    }
    this.pelletsLeft = this.totalPellets;
  }

  reset() {
    this.grid = MAZE.map(row => row.split(''));
    this.pelletsLeft = this.totalPellets;
  }

  tileAt(col, row) {
    if (row < 0 || row >= ROWS) return '#';
    if (col < 0 || col >= COLS) {
      if (row === TUNNEL_ROW) return ' ';
      return '#';
    }
    return this.grid[row][col];
  }

  isWall(col, row) {
    const t = this.tileAt(col, row);
    return t === '#';
  }

  isGhostDoor(col, row) {
    return this.tileAt(col, row) === '-';
  }

  isWalkable(col, row, { allowDoor = false } = {}) {
    const t = this.tileAt(col, row);
    if (t === '#') return false;
    if (t === '-') return allowDoor;
    return true;
  }

  hasPellet(col, row) {
    return this.tileAt(col, row) === '.';
  }

  hasPowerPellet(col, row) {
    return this.tileAt(col, row) === 'o';
  }

  consumePellet(col, row) {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    const t = this.grid[row][col];
    if (t === '.' || t === 'o') {
      this.grid[row][col] = ' ';
      this.pelletsLeft--;
      return t;
    }
    return null;
  }

  isCleared() {
    return this.pelletsLeft <= 0;
  }

  wrapCol(col) {
    if (col < 0) return COLS - 1;
    if (col >= COLS) return 0;
    return col;
  }
}
