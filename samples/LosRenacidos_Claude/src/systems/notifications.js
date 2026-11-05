import { SYSTEM_PREFIX, COLORS } from '../constants.js';

export class Notifications {
  constructor() {
    this.queue = [];
  }

  push(text, kind = 'gain', duration = 3.0) {
    const prefix = SYSTEM_PREFIX[kind] || SYSTEM_PREFIX.gain;
    const color = this._color(kind);
    this.queue.push({ text: `${prefix} ${text}`, color, age: 0, life: duration });
    if (this.queue.length > 6) this.queue.shift();
  }

  _color(kind) {
    switch (kind) {
      case 'alert': return COLORS.danger;
      case 'quest': return COLORS.azure;
      case 'archive': return COLORS.corruption;
      case 'warn': return COLORS.corruption;
      default: return COLORS.gold;
    }
  }

  update(dt) {
    for (const item of this.queue) item.age += dt;
    this.queue = this.queue.filter(i => i.age < i.life);
  }

  reset() {
    this.queue.length = 0;
  }

  render(ctx, originX, originY) {
    ctx.save();
    ctx.font = '12px "Georgia", serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    let y = originY;
    for (const item of this.queue) {
      const remaining = item.life - item.age;
      const alpha = Math.max(0, Math.min(1, remaining / 0.5));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, originX, y);
      y += 16;
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
