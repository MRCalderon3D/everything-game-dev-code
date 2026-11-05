import { PLAYER, ROOM, COLORS } from '../constants.js';

export class Player {
  constructor(save) {
    this.save = save;
    this.radius = PLAYER.radius;
    this.x = ROOM.width / 2;
    this.y = ROOM.height / 2;
    this.facing = { x: 1, y: 0 };
    this.stats = {
      fuerza: 5,
      destreza: 4,
      inteligencia: 2,
      fama: save?.fama || 0,
    };
    this.skills = {
      esgrima: 1 + (save?.unlocks?.esgrimaBase || 0),
      parada:  1 + (save?.unlocks?.paradaBase || 0),
      tactica: 1,
      supervivencia: 1,
      anatomia: 1,
      curacion: 1,
      meditacion: 1,
      negociacion: 1,
    };
    this.xp = { esgrima: 0, parada: 0, tactica: 0, supervivencia: 0, anatomia: 0, curacion: 0, meditacion: 0, negociacion: 0 };
    this.saludMax = PLAYER.baseSaludMax + (save?.unlocks?.saludExtra || 0);
    this.salud = this.saludMax;
    this.manaMax = PLAYER.baseManaMax;
    this.mana = this.manaMax;
    this.resistenciaMax = PLAYER.baseResMax;
    this.resistencia = this.resistenciaMax;
    this.cobre = save?.inventory?.cobre ?? 15;
    this.pociones = save?.inventory?.pociones ?? 0;
    this.weaponDmg = PLAYER.baseAttackDmg + (save?.unlocks?.filoAfilado ? 2 : 0);

    this.attackPhase = 'idle';
    this.attackTimer = 0;
    this.attackHits = new Set();

    this.dashTimer = 0;
    this.invuln = 0;

    this.blocking = false;
    this.blockTimer = 0;
    this.parryWindow = 0;
    this.staminaCooldown = 0;

    this.corruption = 0;
  }

  isInvulnerable() { return this.invuln > 0; }
  isAlive() { return this.salud > 0; }

  setFacingFromInput(dx, dy) {
    if (dx === 0 && dy === 0) return;
    this.facing.x = dx;
    this.facing.y = dy;
  }

  setFacingTo(tx, ty) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const m = Math.hypot(dx, dy);
    if (m < 0.001) return;
    this.facing.x = dx / m;
    this.facing.y = dy / m;
  }

  startAttack(audio, notifications) {
    if (this.attackPhase !== 'idle' || this.dashTimer > 0) return false;
    if (this.resistencia < PLAYER.resAttackCost) return false;
    this.resistencia -= PLAYER.resAttackCost;
    this.staminaCooldown = 0.05;
    this.attackPhase = 'windup';
    this.attackTimer = PLAYER.attackWindup;
    this.attackHits.clear();
    audio?.play('swing');
    return true;
  }

  startDodge(audio) {
    if (this.dashTimer > 0) return false;
    if (this.resistencia < PLAYER.resDashCost) return false;
    if (this.attackPhase !== 'idle') {
      this.attackPhase = 'idle';
      this.attackTimer = 0;
    }
    this.resistencia -= PLAYER.resDashCost;
    this.staminaCooldown = 0.15;
    this.dashTimer = PLAYER.dashDuration;
    this.invuln = Math.max(this.invuln, PLAYER.dashIFrames);
    this.gainSkillXp('tactica', 1);
    audio?.play('dodge');
    return true;
  }

  setBlocking(active) {
    if (active && !this.blocking) {
      this.blocking = true;
      this.parryWindow = PLAYER.parryWindow;
    } else if (!active && this.blocking) {
      this.blocking = false;
      this.parryWindow = 0;
    }
  }

  update(dt, room, moveDir) {
    if (this.invuln > 0) this.invuln -= dt;
    if (this.staminaCooldown > 0) this.staminaCooldown -= dt;
    if (this.parryWindow > 0) this.parryWindow -= dt;

    if (this.attackPhase !== 'idle') {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        if (this.attackPhase === 'windup') {
          this.attackPhase = 'active';
          this.attackTimer = PLAYER.attackActive;
        } else if (this.attackPhase === 'active') {
          this.attackPhase = 'recover';
          this.attackTimer = PLAYER.attackRecover;
        } else {
          this.attackPhase = 'idle';
        }
      }
    }

    let speed = PLAYER.speed;
    if (this.dashTimer > 0) {
      speed = PLAYER.dashSpeed;
      this.dashTimer -= dt;
    } else if (this.attackPhase !== 'idle') {
      speed *= 0.35;
    } else if (this.blocking) {
      speed *= 0.6;
    }

    let mx = moveDir.dx * speed * dt;
    let my = moveDir.dy * speed * dt;

    if (this.dashTimer > 0 && moveDir.dx === 0 && moveDir.dy === 0) {
      mx = this.facing.x * speed * dt;
      my = this.facing.y * speed * dt;
    }

    if (moveDir.dx !== 0 || moveDir.dy !== 0) {
      if (this.attackPhase === 'idle' && this.dashTimer <= 0) {
        this.facing.x = moveDir.dx;
        this.facing.y = moveDir.dy;
        const fmag = Math.hypot(this.facing.x, this.facing.y);
        if (fmag > 0) { this.facing.x /= fmag; this.facing.y /= fmag; }
      }
    }

    this.x = this._clamp(this.x + mx, this.radius, ROOM.width - this.radius);
    this.y = this._clamp(this.y + my, this.radius, ROOM.height - this.radius);
    this._collideWalls(room);

    if (this.staminaCooldown <= 0) {
      const regen = this.blocking ? PLAYER.resRegenBlock : PLAYER.resRegen;
      this.resistencia = Math.min(this.resistenciaMax, this.resistencia + regen * dt);
    }
    if (this.blocking) {
      this.resistencia = Math.max(0, this.resistencia - PLAYER.resBlockDrain * dt);
      if (this.resistencia <= 0.01) this.setBlocking(false);
    }
  }

  _clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

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
      } else if (dist === 0) {
        this.x += this.radius;
      }
    }
  }

  isAttackActive() { return this.attackPhase === 'active'; }
  attackProgress() {
    if (this.attackPhase !== 'active') return 0;
    return 1 - this.attackTimer / PLAYER.attackActive;
  }

  rangeToTarget(target) {
    return Math.hypot(target.x - this.x, target.y - this.y);
  }

  hitInArc(target) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > PLAYER.attackRange + target.radius) return false;
    const angleToTarget = Math.atan2(dy, dx);
    const angleFacing = Math.atan2(this.facing.y, this.facing.x);
    let diff = Math.abs(angleToTarget - angleFacing);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    return diff <= PLAYER.attackArc * 0.5;
  }

  computeAttackDamage() {
    const skillBonus = (this.skills.esgrima - 1) * 0.6;
    const strBonus = this.stats.fuerza * 0.4;
    const critChance = Math.min(0.5, 0.05 + this.stats.destreza * 0.01 + (this.skills.anatomia - 1) * 0.015);
    const isCrit = Math.random() < critChance;
    let dmg = this.weaponDmg + skillBonus + strBonus;
    if (isCrit) dmg *= 2;
    return { dmg: Math.round(dmg), crit: isCrit };
  }

  takeDamage(amount, fromX, fromY, audio, notifications) {
    if (this.invuln > 0) return { absorbed: 0, parried: false };
    let parried = false;
    let absorbed = 0;
    if (this.blocking) {
      const angleToHit = Math.atan2(fromY - this.y, fromX - this.x);
      const angleFacing = Math.atan2(this.facing.y, this.facing.x);
      let diff = Math.abs(angleToHit - angleFacing);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      if (diff <= PLAYER.blockArc * 0.5) {
        if (this.parryWindow > 0) {
          parried = true;
          this.gainSkillXp('parada', 3);
          audio?.play('parry');
        } else {
          absorbed = Math.floor(amount * 0.7);
          amount -= absorbed;
          this.resistencia = Math.max(0, this.resistencia - 14);
          this.gainSkillXp('parada', 1);
          audio?.play('block');
        }
      }
    }
    if (!parried && amount > 0) {
      this.salud -= amount;
      this.invuln = 0.6;
      this.staminaCooldown = 0.4;
      audio?.play('damage');
    }
    return { absorbed, parried };
  }

  gainSkillXp(skill, amount = 1) {
    if (!(skill in this.skills)) return;
    this.xp[skill] = (this.xp[skill] || 0) + amount;
    const need = 6 + this.skills[skill] * 4;
    let leveled = false;
    while (this.xp[skill] >= need) {
      this.xp[skill] -= need;
      this.skills[skill]++;
      leveled = true;
    }
    return leveled;
  }

  consumePotion(audio, notifications) {
    if (this.pociones <= 0) return false;
    this.pociones--;
    this.salud = Math.min(this.saludMax, this.salud + 15);
    this.gainSkillXp('curacion', 2);
    audio?.play('pickup');
    notifications?.push('Poción consumida. +15 PV.', 'gain');
    return true;
  }
}
