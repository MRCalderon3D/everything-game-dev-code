import { ROOM } from '../constants.js';

export class Enemy {
  constructor(template, x, y) {
    this.template = template;
    this.name = template.name;
    this.color = template.color;
    this.radius = template.radius;
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.saludMax = template.saludMax;
    this.salud = template.saludMax;
    this.damage = template.damage;
    this.baseSpeed = template.speed;
    this.detectRange = template.detectRange;
    this.attackRange = template.attackRange;
    this.attackWindup = template.attackWindup;
    this.attackRecover = template.attackRecover;
    this.chargeSpeed = template.chargeSpeed || template.speed * 1.6;
    this.chargesAtRange = !!template.chargesAtRange;
    this.isBoss = !!template.isBoss;
    this.enrageAt = template.enrageAt || 0;
    this.summonsAt = template.summonsAt || 0;
    this.xpReward = template.xpReward;
    this.famaReward = template.famaReward;
    this.state = 'idle';
    this.windup = 0;
    this.windupProgress = 0;
    this.recover = 0;
    this.hitFlash = 0;
    this.bobT = Math.random() * 6;
    this.chargeDir = { x: 0, y: 0 };
    this.enraged = false;
    this.summonsTriggered = false;
    this.dead = false;
  }

  takeDamage(amount, audio) {
    if (this.dead) return false;
    this.salud -= amount;
    this.hitFlash = 0.18;
    audio?.play('hit');
    if (this.salud <= 0) {
      this.dead = true;
      audio?.play(this.isBoss ? 'boss-die' : 'enemy-die');
      return true;
    }
    return false;
  }

  update(dt, room, player, spawnEnemy) {
    if (this.dead) return;
    if (this.hitFlash > 0) this.hitFlash -= dt;
    this.bobT += dt * (this.template.bobSpeed || 4);

    if (this.isBoss && !this.enraged && this.salud / this.saludMax <= this.enrageAt) {
      this.enraged = true;
      this.baseSpeed *= 1.4;
      this.chargeSpeed *= 1.25;
    }
    if (this.isBoss && !this.summonsTriggered && this.salud / this.saludMax <= this.summonsAt) {
      this.summonsTriggered = true;
      if (spawnEnemy) {
        const offsets = [[-80, -60], [80, -60], [-80, 60], [80, 60]];
        for (const [ox, oy] of offsets) {
          const x = Math.min(ROOM.width - 30, Math.max(30, this.x + ox));
          const y = Math.min(ROOM.height - 30, Math.max(30, this.y + oy));
          spawnEnemy('conejo', x, y);
        }
      }
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (this.state === 'idle') {
      if (dist < this.detectRange) this.state = 'seek';
    } else if (this.state === 'seek') {
      if (dist <= this.attackRange + player.radius) {
        this._beginWindup();
      } else if (this.chargesAtRange && dist > this.attackRange + 40 && dist < this.detectRange * 0.9) {
        this._beginCharge(dx, dy, dist);
      } else {
        const mx = (dx / Math.max(0.001, dist)) * this.baseSpeed * dt;
        const my = (dy / Math.max(0.001, dist)) * this.baseSpeed * dt;
        this.x += mx;
        this.y += my;
      }
    } else if (this.state === 'windup') {
      this.windup -= dt;
      this.windupProgress = 1 - this.windup / this.attackWindup;
      if (this.windup <= 0) {
        if (dist <= this.attackRange + player.radius + 4) {
          player.takeDamage(this.damage, this.x, this.y, this._audio, this._notifications);
        }
        this.state = 'recover';
        this.recover = this.attackRecover;
        this.windup = 0;
      }
    } else if (this.state === 'recover') {
      this.recover -= dt;
      if (this.recover <= 0) this.state = 'seek';
    } else if (this.state === 'charge') {
      const cs = this.chargeSpeed;
      this.x += this.chargeDir.x * cs * dt;
      this.y += this.chargeDir.y * cs * dt;
      this.chargeT -= dt;
      const hitDist = Math.hypot(player.x - this.x, player.y - this.y);
      if (hitDist <= this.radius + player.radius + 2) {
        player.takeDamage(this.damage, this.x, this.y, this._audio, this._notifications);
        this.state = 'recover';
        this.recover = this.attackRecover * 0.8;
      } else if (this.chargeT <= 0) {
        this.state = 'recover';
        this.recover = this.attackRecover;
      }
    }

    this.x = Math.max(this.radius, Math.min(ROOM.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(ROOM.height - this.radius, this.y));
    this._collideWalls(room);
  }

  _beginWindup() {
    this.state = 'windup';
    this.windup = this.attackWindup;
    this.windupProgress = 0;
  }

  _beginCharge(dx, dy, dist) {
    this.state = 'charge';
    this.chargeDir.x = dx / Math.max(0.001, dist);
    this.chargeDir.y = dy / Math.max(0.001, dist);
    this.chargeT = Math.min(0.8, dist / this.chargeSpeed + 0.15);
  }

  _collideWalls(room) {
    if (!room || !room.walls) return;
    for (const w of room.walls) {
      const nx = Math.max(w.x, Math.min(this.x, w.x + w.w));
      const ny = Math.max(w.y, Math.min(this.y, w.y + w.h));
      const dx = this.x - nx;
      const dy = this.y - ny;
      const dist = Math.hypot(dx, dy);
      if (dist < this.radius && dist > 0) {
        const push = (this.radius - dist) / dist;
        this.x += dx * push;
        this.y += dy * push;
      }
    }
  }
}
