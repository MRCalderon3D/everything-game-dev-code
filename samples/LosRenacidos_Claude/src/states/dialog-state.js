import { COLORS, CANVAS } from '../constants.js';

export class DialogState {
  constructor(ctx, params = {}) {
    this.lines = (params.lines && params.lines.length) ? params.lines : ['…'];
    this.npc = params.npc || null;
    this.speaker = (this.npc && this.npc.name) || params.speaker || '';
    this.options = params.options || null;
    this.onSelect = params.onSelect || null;
    this.parent = params.parent || null;
    this.index = 0;
    this.charsShown = 0;
    this.charsPerSec = 70;
    this.selected = 0;
  }
  enter() {}
  exit() {}

  update(dt, ctx) {
    const current = this.lines[this.index] || '';
    if (this.charsShown < current.length) {
      this.charsShown = Math.min(current.length, this.charsShown + this.charsPerSec * dt);
    }
    ctx.notifications.update(dt);
    ctx.particles.update(dt);

    if (ctx.input.consumeAction('cancel')) {
      this._close(ctx);
      return;
    }

    const atLastLine = this.index >= this.lines.length - 1;
    const lineDone = this.charsShown >= current.length;

    if (this.options && atLastLine && lineDone) {
      const move = ctx.input.moveAxes();
      if (move.dy < 0) { this.selected = Math.max(0, this.selected - 1); ctx.audio.play('menu-select'); }
      if (move.dy > 0) { this.selected = Math.min(this.options.length - 1, this.selected + 1); ctx.audio.play('menu-select'); }
      for (let i = 0; i < this.options.length; i++) {
        if (ctx.input.consumeAction(`choose-${i + 1}`)) {
          this.selected = i;
          this._selectOption(ctx);
          return;
        }
      }
      if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact')) {
        this._selectOption(ctx);
        return;
      }
      return;
    }

    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact')) {
      if (!lineDone) {
        this.charsShown = current.length;
      } else if (!atLastLine) {
        this.index += 1;
        this.charsShown = 0;
        ctx.audio.play('menu-select');
      } else if (!this.options) {
        this._close(ctx);
      }
    }
  }

  _selectOption(ctx) {
    const opt = this.options[this.selected];
    if (!opt || opt.disabled) {
      ctx.audio.play('menu-select');
      return;
    }
    ctx.audio.play('menu-confirm');
    const fn = this.onSelect;
    this._close(ctx);
    if (typeof fn === 'function') fn(opt, ctx);
  }

  _close(ctx) {
    if (this.parent && this.parent.ctor) {
      ctx.switchState(this.parent.ctor, this.parent.params || {});
    }
  }

  render(r, ctx) {
    if (this.parent && typeof this.parent.preRender === 'function') {
      this.parent.preRender(r, ctx);
    } else {
      r.clear();
    }

    const w = CANVAS.width, h = CANVAS.height;
    const boxH = this.options ? 210 : 140;
    const boxY = h - boxH - 28;
    r.ctx.fillStyle = 'rgba(0,0,0,0.55)';
    r.ctx.fillRect(0, 0, w, h);
    r.ctx.fillStyle = COLORS.dialog;
    r.ctx.fillRect(20, boxY, w - 40, boxH);
    r.ctx.strokeStyle = COLORS.dialogBorder;
    r.ctx.lineWidth = 2;
    r.ctx.strokeRect(20.5, boxY + 0.5, w - 41, boxH - 1);

    if (this.speaker) r.drawText(this.speaker, 36, boxY + 12, { size: 14, color: COLORS.gold, weight: 'bold' });
    const line = this.lines[this.index] || '';
    const visible = line.slice(0, Math.floor(this.charsShown));
    this._wrapText(r, visible, 36, boxY + 36, w - 72, 18, COLORS.fg);

    const atLast = this.index >= this.lines.length - 1;
    const lineDone = this.charsShown >= line.length;
    if (this.options && atLast && lineDone) {
      let oy = boxY + 110;
      for (let i = 0; i < this.options.length; i++) {
        const opt = this.options[i];
        const isSel = i === this.selected;
        let color = isSel ? COLORS.gold : COLORS.fg;
        if (opt.disabled) color = '#6a6358';
        r.drawText(`${i + 1}.  ${opt.label}`, 50, oy, { size: 13, color, weight: isSel ? 'bold' : 'normal' });
        oy += 22;
      }
      r.drawText('1-4 elegir · ENTER confirmar · ESC salir', w - 36, boxY + boxH - 22, { size: 11, color: COLORS.fg, align: 'right' });
    } else {
      const hint = atLast ? (this.options ? 'ENTER ver opciones' : 'ENTER cerrar') : 'ENTER continuar';
      r.drawText(hint, w - 36, boxY + boxH - 22, { size: 11, color: COLORS.fg, align: 'right' });
    }
  }

  _wrapText(r, text, x, y, maxW, lineH, color) {
    const c = r.ctx;
    c.font = '14px Georgia, serif';
    const words = text.split(' ');
    let line = '';
    let yy = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (c.measureText(test).width > maxW && line) {
        r.drawText(line, x, yy, { size: 14, color });
        line = word;
        yy += lineH;
      } else {
        line = test;
      }
    }
    if (line) r.drawText(line, x, yy, { size: 14, color });
  }
}
