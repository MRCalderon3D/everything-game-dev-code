export class Particles {
  constructor() { this.items = []; }

  spawn({ x, y, count, color, speed = 80, life = 0.4, size = 2, spreadAngle = Math.PI * 2, baseAngle = 0 }) {
    for (let i = 0; i < count; i++) {
      const a = baseAngle + (Math.random() - 0.5) * spreadAngle;
      const s = speed * (0.5 + Math.random() * 0.8);
      this.items.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: life * (0.6 + Math.random() * 0.6),
        max: life,
        color,
        size: size + Math.random() * 1.2,
      });
    }
    if (this.items.length > 200) this.items.splice(0, this.items.length - 200);
  }

  update(dt) {
    for (const p of this.items) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 1.6;
      p.vy *= 1 - dt * 1.6;
      p.life -= dt;
    }
    this.items = this.items.filter(p => p.life > 0);
  }

  render(ctx) {
    for (const p of this.items) {
      const a = Math.min(1, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}
