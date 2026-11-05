import { COLORS, CANVAS, SKILLS } from '../constants.js';
import { HubState } from './hub-state.js';

const ECO_LABELS = {
  minocAmigo: 'Amigo de Minoc — Misión Recolector de Hierbas',
  jabaliAlfaSlain: 'Jefe abatido — Jabalí Maldito Alfa',
  escoltaCompleta: 'Escolta exitosa de la Caravana',
};

export class ArchiveState {
  constructor(ctx, params = {}) {
    this.from = params.from || 'menu';
    this.returnTo = params.returnTo;
    this.restoreRun = !!params.restoreRun;
  }
  enter() {}
  exit() {}

  update(dt, ctx) {
    if (ctx.input.consumeAction('cancel') || ctx.input.consumeAction('confirm') || ctx.input.consumeAction('archive')) {
      ctx.audio.play('menu-select');
      if (this.returnTo) ctx.switchState(this.returnTo, {});
      else if (this.from === 'hub') ctx.switchState(HubState, {});
      else if (this.from === 'run' || this.from === 'combat') {
        import('./run-state.js').then(mod => ctx.switchState(mod.RunState, {}));
      } else {
        import('./menu-state.js').then(mod => ctx.switchState(mod.MenuState, {}));
      }
    }
  }

  render(r, ctx) {
    r.clear();
    const w = CANVAS.width, h = CANVAS.height;
    r.drawText('Archivo de Ecos', w / 2, 28, { size: 26, color: COLORS.gold, align: 'center', weight: 'bold' });
    r.drawText('Lo que el Sistema retiene cuando todo lo demás cae.', w / 2, 60, { size: 11, color: COLORS.fg, align: 'center' });

    const save = ctx.storage.load();
    const ecos = save.ecos || {};

    let y = 100;
    for (const [key, label] of Object.entries(ECO_LABELS)) {
      const unlocked = !!ecos[key];
      r.drawText(unlocked ? '✓' : '○', w / 2 - 200, y, { size: 16, color: unlocked ? COLORS.gold : COLORS.fg });
      r.drawText(label, w / 2 - 175, y + 2, { size: 13, color: unlocked ? COLORS.gold : COLORS.fg });
      y += 28;
    }
    r.drawText(`Moonstalks totales recogidas: ${ecos.hierbasTotales || 0}`, w / 2 - 200, y, { size: 12, color: COLORS.azure });
    y += 24;

    y += 18;
    r.drawText('Beneficios permanentes', w / 2, y, { size: 16, color: COLORS.gold, align: 'center', weight: 'bold' });
    y += 26;
    const u = save.unlocks || {};
    const lines = [
      `Filo Afilado: ${u.filoAfilado ? '✓ +2 daño base' : '—'}`,
      `Esgrima inicial: +${u.esgrimaBase || 0}`,
      `Parada inicial: +${u.paradaBase || 0}`,
      `Salud máxima: +${u.saludExtra || 0}`,
    ];
    for (const ln of lines) {
      r.drawText(ln, w / 2, y, { size: 12, color: COLORS.fg, align: 'center' });
      y += 18;
    }

    y += 12;
    r.drawText('Cobre en bolsa: ' + (save.inventory?.cobre ?? 0) + '   ·   Fama: ' + (save.fama || 0), w / 2, y, { size: 12, color: COLORS.azure, align: 'center' });

    if (ctx.player) {
      y += 30;
      r.drawText('Esta incursión', w / 2, y, { size: 14, color: COLORS.gold, align: 'center', weight: 'bold' });
      y += 22;
      let col = 0;
      const colW = 230;
      const baseX = w / 2 - colW;
      for (const s of SKILLS) {
        const lvl = ctx.player.skills[s.id];
        const x = baseX + col * colW;
        r.drawText(`${s.name}: ${lvl}`, x, y, { size: 11, color: COLORS.fg });
        col += 1;
        if (col >= 2) { col = 0; y += 16; }
      }
      y += 4;
    }

    r.drawText('ENTER · ESC · I — volver', w / 2, h - 36, { size: 12, color: COLORS.fg, align: 'center' });
  }
}
