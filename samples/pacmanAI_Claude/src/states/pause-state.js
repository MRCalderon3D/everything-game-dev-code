import { COLORS, TILE, ROWS, COLS } from '../constants.js';
import { PlayState } from './play-state.js';
import { MenuState } from './menu-state.js';

export class PauseState {
  constructor(ctx, params = {}) {
    this.snapshot = params.snapshot;
    this.blink = 0;
  }

  enter() {}
  exit() {}

  update(dt, ctx) {
    this.blink += dt;
    if (ctx.input.consumeAction('pause') || ctx.input.consumeAction('confirm')) {
      ctx.audio.play('menu-select');
      ctx.switchState(PlayState, { resume: this.snapshot });
    }
    if (ctx.input.consumeAction('menu')) {
      ctx.audio.play('menu-select');
      ctx.switchState(MenuState, { lastScore: this.snapshot.score });
    }
  }

  render(r, ctx) {
    r.clear();
    r.drawMaze(ctx.maze);
    r.drawPellets(ctx.maze, 0);
    if (this.snapshot) {
      const s = this.snapshot;
      for (const g of s.ghosts) r.drawGhost(g, false);
      r.drawPlayer(s.player);
      r.drawHud(s.score, s.highScore, s.level, s.lives, s.combo);
    }
    r.fillOverlay(0.6);
    const cw = COLS * TILE;
    const cy = r.mazeCenter(-20);
    r.drawText('PAUSED', cw / 2, cy, { size: 30, color: COLORS.player, align: 'center' });
    const blinkOn = Math.floor(this.blink * 2) % 2 === 0;
    if (blinkOn) {
      r.drawText('PRESS P / ESC TO RESUME', cw / 2, cy + 40, { size: 12, color: COLORS.textAlt, align: 'center' });
    }
    r.drawText('PRESS M FOR MENU', cw / 2, cy + 62, { size: 11, color: COLORS.textDim, align: 'center' });
  }
}
