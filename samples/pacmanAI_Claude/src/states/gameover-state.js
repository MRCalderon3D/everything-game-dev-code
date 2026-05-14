import { COLORS, TILE, ROWS, COLS } from '../constants.js';
import { PlayState } from './play-state.js';
import { MenuState } from './menu-state.js';

export class GameOverState {
  constructor(ctx, params = {}) {
    this.score = params.score || 0;
    this.level = params.level || 1;
    this.highScore = ctx.storage.getHighScore();
    this.isNewHigh = this.score > 0 && this.score >= this.highScore;
    if (this.isNewHigh) ctx.storage.setHighScore(this.score);
    this.timer = 0;
  }

  enter() {}
  exit() {}

  update(dt, ctx) {
    this.timer += dt;
    if (this.timer < 0.4) return;
    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('restart')) {
      ctx.audio.play('menu-select');
      ctx.switchState(PlayState, {});
    } else if (ctx.input.consumeAction('menu') || ctx.input.consumeAction('pause')) {
      ctx.audio.play('menu-select');
      ctx.switchState(MenuState, { lastScore: this.score });
    }
  }

  render(r, ctx) {
    r.clear();
    r.drawMaze(ctx.maze);
    r.drawPellets(ctx.maze, this.timer);
    r.fillOverlay(0.7);
    const cw = COLS * TILE;
    const cy = r.mazeCenter(-60);
    r.drawText('GAME OVER', cw / 2, cy, { size: 32, color: COLORS.ghostBlinky, align: 'center' });
    r.drawText(`SCORE: ${String(this.score).padStart(6, '0')}`, cw / 2, cy + 50, { size: 16, color: COLORS.text, align: 'center' });
    r.drawText(`LEVEL: ${this.level}`, cw / 2, cy + 70, { size: 12, color: COLORS.textDim, align: 'center' });
    r.drawText(`HIGH:  ${String(this.highScore).padStart(6, '0')}`, cw / 2, cy + 88, { size: 12, color: COLORS.textDim, align: 'center' });

    if (this.isNewHigh) {
      const blink = Math.floor(this.timer * 3) % 2 === 0;
      if (blink) {
        r.drawText('NEW HIGH SCORE!', cw / 2, cy + 112, { size: 14, color: COLORS.ghostPinky, align: 'center' });
      }
    }

    if (this.timer >= 0.4) {
      const blink = Math.floor(this.timer * 2) % 2 === 0;
      if (blink) {
        r.drawText('ENTER / TAP TO PLAY AGAIN', cw / 2, cy + 150, { size: 12, color: COLORS.textAlt, align: 'center' });
      }
      r.drawText('M FOR MENU', cw / 2, cy + 168, { size: 11, color: COLORS.textDim, align: 'center' });
    }
  }
}
