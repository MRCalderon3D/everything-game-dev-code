import { TILE, COLS, ROWS, COLORS, DIR } from '../constants.js';

const MAZE_OFFSET_Y = 32;

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.fillStyle = COLORS.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawMaze(maze) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, MAZE_OFFSET_Y);
    ctx.fillStyle = COLORS.wall;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === '#') ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
      }
    }
    ctx.fillStyle = COLORS.wallShadow;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === '#') ctx.fillRect(c * TILE + 2, r * TILE + 2, TILE - 4, TILE - 4);
      }
    }
    ctx.fillStyle = COLORS.wall;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === '#') ctx.fillRect(c * TILE + 4, r * TILE + 4, TILE - 8, TILE - 8);
      }
    }
    ctx.fillStyle = COLORS.pellet;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === '-') ctx.fillRect(c * TILE, r * TILE + TILE / 2 - 1, TILE, 2);
      }
    }
    ctx.restore();
  }

  drawPellets(maze, powerPulse) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, MAZE_OFFSET_Y);
    ctx.fillStyle = COLORS.pellet;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === '.') {
          const cx = c * TILE + TILE / 2;
          const cy = r * TILE + TILE / 2;
          ctx.fillRect(cx - 1, cy - 1, 2, 2);
        }
      }
    }
    const pulse = 0.7 + Math.sin(powerPulse * 6) * 0.3;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (maze.grid[r][c] === 'o') {
          const cx = c * TILE + TILE / 2;
          const cy = r * TILE + TILE / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, 4 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  drawPlayer(player) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, MAZE_OFFSET_Y);
    const cx = player.x;
    const cy = player.y;
    const radius = TILE * 0.45;
    const mouth = player.mouthOpenAmount();
    let angle = 0;
    if (player.dir === DIR.RIGHT) angle = 0;
    else if (player.dir === DIR.LEFT) angle = Math.PI;
    else if (player.dir === DIR.UP) angle = -Math.PI / 2;
    else if (player.dir === DIR.DOWN) angle = Math.PI / 2;

    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle + mouth, angle - mouth + Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawGhost(ghost, frightenedFlashOn) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(0, MAZE_OFFSET_Y);
    const cx = ghost.x;
    const cy = ghost.y;
    const radius = TILE * 0.45;
    const bodyBottom = cy + radius;

    if (ghost.isEaten) {
      this._drawEyes(ctx, cx, cy, ghost.dir);
      ctx.restore();
      return;
    }

    let bodyColor = ghost.color;
    if (ghost.isEdible) {
      bodyColor = frightenedFlashOn ? COLORS.ghostFrightenedFlash : COLORS.ghostFrightened;
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0);
    ctx.lineTo(cx + radius, bodyBottom);
    const wave = 3;
    for (let i = 0; i < 4; i++) {
      const t = i / 3;
      const x = cx + radius - t * radius * 2;
      const y = bodyBottom - (i % 2 === 0 ? 0 : wave);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(cx - radius, bodyBottom);
    ctx.closePath();
    ctx.fill();

    if (ghost.isEdible) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 4, cy - 2, 2, 3);
      ctx.fillRect(cx + 2, cy - 2, 2, 3);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + 4);
      ctx.lineTo(cx - 3, cy + 2);
      ctx.lineTo(cx - 1, cy + 4);
      ctx.lineTo(cx + 1, cy + 2);
      ctx.lineTo(cx + 3, cy + 4);
      ctx.lineTo(cx + 5, cy + 2);
      ctx.stroke();
    } else {
      this._drawEyes(ctx, cx, cy, ghost.dir);
    }
    ctx.restore();
  }

  _drawEyes(ctx, cx, cy, dir) {
    ctx.fillStyle = COLORS.ghostEyes;
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 1, 3, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.ghostPupils;
    const dx = dir ? dir.x : 0;
    const dy = dir ? dir.y : 0;
    ctx.beginPath();
    ctx.arc(cx - 3 + dx * 1.5, cy - 1 + dy * 1.5, 1.4, 0, Math.PI * 2);
    ctx.arc(cx + 3 + dx * 1.5, cy - 1 + dy * 1.5, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawText(text, x, y, options = {}) {
    const ctx = this.ctx;
    const size = options.size || 14;
    const color = options.color || COLORS.text;
    const align = options.align || 'left';
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px "Courier New", monospace`;
    ctx.textAlign = align;
    ctx.textBaseline = options.baseline || 'top';
    ctx.fillText(text, x, y);
  }

  drawHud(score, highScore, level, lives, combo) {
    const w = this.canvas.width;
    this.drawText('SCORE', 8, 2, { size: 10, color: COLORS.textDim });
    this.drawText(String(score).padStart(6, '0'), 8, 14, { size: 14, color: COLORS.text });

    this.drawText('HIGH', w / 2, 2, { size: 10, color: COLORS.textDim, align: 'center' });
    this.drawText(String(highScore).padStart(6, '0'), w / 2, 14, { size: 14, color: COLORS.text, align: 'center' });

    this.drawText('LEVEL', w - 8, 2, { size: 10, color: COLORS.textDim, align: 'right' });
    this.drawText(String(level), w - 8, 14, { size: 14, color: COLORS.text, align: 'right' });

    const baseY = MAZE_OFFSET_Y + ROWS * TILE + 8;
    for (let i = 0; i < lives; i++) {
      const cx = 16 + i * 22;
      const cy = baseY + 8;
      this.ctx.fillStyle = COLORS.player;
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.arc(cx, cy, 7, Math.PI * 0.2, Math.PI * 1.8);
      this.ctx.closePath();
      this.ctx.fill();
    }
    if (combo > 0) {
      this.drawText(`COMBO x${combo}`, w - 8, baseY + 2, { size: 12, color: COLORS.textAlt, align: 'right' });
    }
  }

  fillOverlay(alpha = 0.65) {
    this.ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  mazeCenter(line) {
    return MAZE_OFFSET_Y + ROWS * TILE / 2 + (line || 0);
  }
}

export { MAZE_OFFSET_Y };
