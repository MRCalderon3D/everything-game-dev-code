import { COLORS, CANVAS } from '../constants.js';
import { HubState } from './hub-state.js';
import { ArchiveState } from './archive-state.js';

export class MenuState {
  constructor(ctx, params = {}) {
    this.blink = 0;
    this.lastScore = params.lastScore || 0;
  }
  enter() {}
  exit() {}

  update(dt, ctx) {
    this.blink += dt;
    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact')) {
      ctx.audio.play('menu-confirm');
      ctx.switchState(HubState, { fresh: true });
    }
    if (ctx.input.consumeAction('archive')) {
      ctx.audio.play('menu-select');
      ctx.switchState(ArchiveState, { returnTo: MenuState });
    }
  }

  render(r, ctx) {
    r.clear();
    const w = CANVAS.width, h = CANVAS.height;

    // Decorative background grid
    r.ctx.strokeStyle = COLORS.dialogBorder;
    r.ctx.globalAlpha = 0.05;
    for (let x = 0; x < w; x += 24) {
      r.ctx.beginPath(); r.ctx.moveTo(x, 0); r.ctx.lineTo(x, h); r.ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      r.ctx.beginPath(); r.ctx.moveTo(0, y); r.ctx.lineTo(w, y); r.ctx.stroke();
    }
    r.ctx.globalAlpha = 1;

    r.drawText('LOS RENACIDOS', w / 2, h * 0.22, { size: 44, color: COLORS.gold, align: 'center', weight: 'bold' });
    r.drawText('Ecos de Talasaria', w / 2, h * 0.22 + 50, { size: 18, color: COLORS.fg, align: 'center' });
    r.drawText('Vertical slice — generado por /full-game', w / 2, h * 0.22 + 76, { size: 12, color: COLORS.azure, align: 'center' });

    if (Math.floor(this.blink * 1.6) % 2 === 0) {
      r.drawText('PULSA ENTER PARA EMPEZAR', w / 2, h * 0.55, { size: 16, color: COLORS.gold, align: 'center', weight: 'bold' });
    }
    r.drawText('I  ·  Archivo de Ecos', w / 2, h * 0.55 + 30, { size: 12, color: COLORS.fg, align: 'center' });

    const save = ctx.storage.load();
    const ecos = Object.values(save.ecos || {}).filter(v => v).length;
    r.drawText(`Ecos descubiertos: ${ecos}`, w / 2, h * 0.78, { size: 12, color: COLORS.azure, align: 'center' });
    r.drawText(`Cobre acumulado: ${save.inventory?.cobre ?? 0}   ·   Fama: ${save.fama || 0}`, w / 2, h * 0.78 + 18, { size: 11, color: COLORS.fg, align: 'center' });
    r.drawText('Erik · ruta guerrera · MVP roguelike', w / 2, h * 0.78 + 36, { size: 10, color: COLORS.fg, align: 'center' });
    if (this.lastScore > 0) {
      r.drawText(`Última incursión: ${this.lastScore} de cobre extraído`, w / 2, h * 0.78 + 54, { size: 10, color: COLORS.fg, align: 'center' });
    }
  }
}
