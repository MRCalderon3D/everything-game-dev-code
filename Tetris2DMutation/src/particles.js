export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200 - 50,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 0.5 + Math.random() * 0.5,
                size: 2 + Math.random() * 4,
                color,
            });
        }
    }

    emitLine(x, y, width, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + Math.random() * width,
                y: y + Math.random() * 4,
                vx: (Math.random() - 0.5) * 300,
                vy: -50 - Math.random() * 100,
                life: 0.4 + Math.random() * 0.4,
                maxLife: 0.4 + Math.random() * 0.4,
                size: 2 + Math.random() * 3,
                color,
            });
        }
    }

    emitMutation(x, y, color) {
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * (80 + Math.random() * 80),
                vy: Math.sin(angle) * (80 + Math.random() * 80),
                life: 0.3 + Math.random() * 0.4,
                maxLife: 0.3 + Math.random() * 0.4,
                size: 2 + Math.random() * 3,
                color,
            });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 200 * dt; // gravity
            p.life -= dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const p of this.particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles = [];
    }
}
