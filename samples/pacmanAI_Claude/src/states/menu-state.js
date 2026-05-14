import { COLORS, TILE, ROWS, COLS } from '../constants.js';
import { PlayState } from './play-state.js';

export class MenuState {
  constructor(ctx, params = {}) {
    this.bannerTimer = 0;
    this.highScore = ctx.storage.getHighScore();
    this.lastScore = params.lastScore || 0;
  }

  enter() {}
  exit() {}

  update(dt, ctx) {
    this.bannerTimer += dt;
    if (ctx.input.consumeAction('confirm')) {
      ctx.audio.play('menu-select');
      ctx.switchState(PlayState, {});
    }
    ctx.input.consumeAction('pause');
  }

  render(r, ctx) {
    r.clear();
    r.drawMaze(ctx.maze);
    r.drawPellets(ctx.maze, this.bannerTimer);
    r.fillOverlay(0.55);

    const cw = COLS * TILE;
    const cy = r.mazeCenter(-40);
    r.drawText('PAC-MAN', cw / 2, cy, { size: 36, color: COLORS.player, align: 'center' });
    r.drawText('CLAUDE EDITION', cw / 2, cy + 40, { size: 14, color: COLORS.textDim, align: 'center' });

    const blink = Math.floor(this.bannerTimer * 2) % 2 === 0;
    if (blink) {
      r.drawText('PRESS ENTER OR TAP TO START', cw / 2, cy + 90, { size: 12, color: COLORS.textAlt, align: 'center' });
    }

    r.drawText('CONTROLS', cw / 2, cy + 130, { size: 11, color: COLORS.textDim, align: 'center' });
    r.drawText('ARROWS / WASD  ESC PAUSE', cw / 2, cy + 146, { size: 10, color: COLORS.textDim, align: 'center' });
    r.drawText(`HIGH SCORE: ${String(this.highScore).padStart(6, '0')}`, cw / 2, cy + 176, { size: 12, color: COLORS.text, align: 'center' });
    if (this.lastScore > 0) {
      r.drawText(`LAST RUN: ${String(this.lastScore).padStart(6, '0')}`, cw / 2, cy + 194, { size: 10, color: COLORS.textDim, align: 'center' });
    }
  }
}
