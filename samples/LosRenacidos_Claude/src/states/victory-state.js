import { COLORS, CANVAS } from '../constants.js';
import { HubState } from './hub-state.js';
import { MenuState } from './menu-state.js';

export class VictoryState {
  constructor(ctx, params = {}) {
    this.cobreGained = params.cobreGained || 0;
    this.timer = 0;
  }
  enter(ctx) {
    const save = ctx.storage.load();
    save.ecos.jabaliAlfaSlain = true;
    save.fama = (save.fama || 0) + 5;
    save.unlocks.saludExtra = Math.min(15, (save.unlocks.saludExtra || 0) + 2);
    save.unlocks.paradaBase = Math.min(3, (save.unlocks.paradaBase || 0) + 1);
    save.ecos.bestRun = Math.max(save.ecos.bestRun || 0, this.cobreGained);
    ctx.storage.save();
    this.savedCobre = save.inventory.cobre;
    this.fama = save.fama;
    ctx.runMap = null;
    ctx.audio.play('eco');
  }
  exit() {}

  update(dt, ctx) {
    this.timer += dt;
    ctx.notifications.update(dt);
    ctx.particles.update(dt);
    if (this.timer < 0.5) return;
    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact')) {
      ctx.audio.play('menu-confirm');
      ctx.switchState(HubState, { fresh: false });
    } else if (ctx.input.consumeAction('cancel')) {
      ctx.audio.play('menu-select');
      ctx.switchState(MenuState, { lastScore: this.cobreGained });
    }
  }

  render(r, ctx) {
    r.clear();
    const w = CANVAS.width, h = CANVAS.height;
    r.drawText('ECO ESTABILIZADO', w / 2, h * 0.20, { size: 36, color: COLORS.gold, align: 'center', weight: 'bold' });
    r.drawText('Jabalí Maldito Alfa abatido.', w / 2, h * 0.20 + 48, { size: 14, color: COLORS.fg, align: 'center' });
    r.drawText('El Archivo registra tu hito. Vuelves a Minoc con lo que pudiste extraer.', w / 2, h * 0.20 + 70, { size: 12, color: COLORS.azure, align: 'center' });

    let y = h * 0.45;
    const lines = [
      `Cobre extraído: +${this.cobreGained}`,
      `Cobre total en bolsa: ${this.savedCobre || 0}`,
      `Fama: ${this.fama || 0}`,
      `Permanente: +2 PV máx, +1 Parada inicial`,
      `Eco: Jabalí Maldito Alfa ✓`,
    ];
    for (const ln of lines) {
      r.drawText(ln, w / 2, y, { size: 13, color: COLORS.fg, align: 'center' });
      y += 22;
    }

    if (this.timer > 0.5) {
      r.drawText('ENTER · volver a Minoc', w / 2, h * 0.85, { size: 14, color: COLORS.gold, align: 'center' });
      r.drawText('ESC · regresar al menú', w / 2, h * 0.85 + 22, { size: 11, color: COLORS.fg, align: 'center' });
    }
  }
}
