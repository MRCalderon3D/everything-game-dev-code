import { COLORS, CANVAS } from '../constants.js';
import { MenuState } from './menu-state.js';
import { HubState } from './hub-state.js';

export class GameOverState {
  constructor(ctx, params = {}) {
    this.reason = params.reason || 'killed';
  }

  enter(ctx) {
    const save = ctx.storage.load();
    // Lose only run-state items, keep cobre that was banked at hub.
    if (ctx.player) {
      // Donate half the unspent run cobre to "bestRun" as a flavour stat.
      save.ecos.bestRun = Math.max(save.ecos.bestRun || 0, ctx.player.cobre || 0);
    }
    ctx.storage.save();
    this.lastScore = (ctx.player && ctx.player.cobre) || 0;
    ctx.player = null;
    ctx.runMap = null;
    ctx.quest = { active: null, progress: 0, goal: 0, reward: null };
    this.fade = 0;
  }

  exit() {}

  update(dt, ctx) {
    this.fade = Math.min(1, this.fade + dt);
    ctx.notifications.update(dt);
    ctx.particles.update(dt);
    if (this.fade < 0.4) return;
    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact') || ctx.input.consumeAction('restart')) {
      ctx.audio.play('menu-confirm');
      ctx.switchState(HubState, { fresh: true });
    } else if (ctx.input.consumeAction('cancel')) {
      ctx.audio.play('menu-select');
      ctx.switchState(MenuState, { lastScore: this.lastScore });
    }
  }

  render(r, ctx) {
    r.clear();
    const w = CANVAS.width, h = CANVAS.height;
    r.ctx.globalAlpha = Math.min(1, this.fade);
    r.drawText('ECO ROTO', w / 2, h * 0.30, { size: 46, color: COLORS.danger, align: 'center', weight: 'bold' });
    r.drawText('El Sistema se desvanece. Tu cuerpo cae en la Frontera.', w / 2, h * 0.30 + 50, { size: 13, color: COLORS.fg, align: 'center' });
    r.drawText('Sin embargo, el Archivo recuerda. Vuelves a Minoc.', w / 2, h * 0.30 + 70, { size: 12, color: COLORS.azure, align: 'center' });

    if (this.fade > 0.6) {
      r.drawText('ENTER · regresar a Minoc', w / 2, h * 0.65, { size: 14, color: COLORS.gold, align: 'center' });
      r.drawText('ESC · volver al menú', w / 2, h * 0.65 + 22, { size: 11, color: COLORS.fg, align: 'center' });
    }
    r.ctx.globalAlpha = 1;
  }
}
