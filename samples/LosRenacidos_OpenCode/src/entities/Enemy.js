import { ENEMY_TYPES } from '../utils/Constants.js';

class Enemy {
  constructor(type, x, y, isElite = false) {
    const template = ENEMY_TYPES[type] || ENEMY_TYPES.jabali_maldito;
    this.type = type;
    this.name = template.name;
    this.x = x;
    this.y = y;
    this.size = template.size || 16;
    this.color = template.color || '#ff4444';
    this.salud = template.salud || 30;
    this.saludMax = this.salud;
    this.damage = template.damage || 8;
    this.speed = template.speed || 2;
    this.tipoDaño = template.tipoDaño || 'corte';
    this.xp = template.xp || 10;
    this.ranged = template.ranged || false;
    this.boss = template.boss || false;
    this.defense = 0;
    this.dead = false;
    this.vx = 0;
    this.vy = 0;
    this.attackCooldown = 0;
    this.stunTimer = 0;
    this.aggroRange = 250;
    this.attackRange = this.ranged ? 200 : 35;
    this.facingRight = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.shootCooldown = 0;

    if (isElite || this.boss) {
      this.salud = Math.round(this.salud * 2.5);
      this.saludMax = this.salud;
      this.damage = Math.round(this.damage * 1.5);
      this.size = Math.round(this.size * 1.3);
      this.xp = Math.round(this.xp * 2);
    }
  }

  update(dt, player) {
    if (this.dead) return;

    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.shootCooldown = Math.max(0, this.shootCooldown - dt);
    this.stunTimer = Math.max(0, this.stunTimer - dt);
    this.stateTimer -= dt;

    if (this.stunTimer > 0) {
      this.state = 'stunned';
      this.vx = 0;
      this.vy = 0;
      return;
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.aggroRange) {
      this.state = 'idle';
      this.vx = 0;
      this.vy = 0;
      return;
    }

    this.facingRight = dx > 0;
    this.state = 'chasing';

    if (dist < this.attackRange && this.attackCooldown <= 0) {
      this.state = 'attacking';
      this.stateTimer = 0.3;
      this.attackCooldown = this.boss ? 0.6 : 1.0;
      return true;
    }

    if (this.ranged && this.shootCooldown <= 0 && dist > 50) {
      this.shootCooldown = 2.0;
      return { type: 'shoot', x: this.x, y: this.y, targetX: player.x, targetY: player.y, damage: this.damage };
    }

    if (this.state === 'attacking' && this.stateTimer > 0) {
      this.vx = 0;
      this.vy = 0;
    } else {
      const spd = this.speed * 60;
      const nx = dx / dist;
      const ny = dy / dist;
      this.vx = nx * spd;
      this.vy = ny * spd;
    }

    return false;
  }

  takeDamage(amount, type) {
    this.salud -= amount;
    this.state = 'hurt';
    this.stateTimer = 0.15;
    if (this.salud <= 0) {
      this.salud = 0;
      this.dead = true;
      return true;
    }
    return false;
  }

  getAttackDamage() {
    return this.damage;
  }

  stun(duration) {
    this.stunTimer = duration;
    this.state = 'stunned';
  }
}

export default Enemy;
