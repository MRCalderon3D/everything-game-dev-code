import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants.js';

class Player {
  constructor(statsSystem, invSystem, audioManager) {
    this.stats = statsSystem;
    this.inventory = invSystem;
    this.audio = audioManager;
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT / 2;
    this.size = 20;
    this.vx = 0;
    this.vy = 0;
    this.facingRight = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.attackCooldown = 0;
    this.dodgeCooldown = 0;
    this.invulnerableTimer = 0;
    this.attackCombo = 0;
    this.attackHit = false;
    this.poisoned = false;
    this.combatKills = 0;
    this.damageDealt = 0;
  }

  update(dt, input, enemies, projectiles) {
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);
    this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    this.stateTimer -= dt;

    if (this.state === 'stunned' && this.stateTimer > 0) return;
    if (this.state === 'attacking' && this.stateTimer > 0) {
      if (this.stateTimer < 0.15 && !this.attackHit) {
        this.attackHit = true;
        this._processAttackHit(enemies);
      }
      return;
    }

    this.state = 'idle';

    if (input.isKeyDown('Control') || input.isKeyDown('c')) {
      if (this.stats.useStamina(15 * dt)) {
        this.state = 'blocking';
      }
    }

    if (input.isShiftDown() && this.dodgeCooldown <= 0) {
      const mov = input.getMovement();
      if (mov.x !== 0 || mov.y !== 0) {
        this.state = 'dodging';
        this.stateTimer = 0.2;
        this.dodgeCooldown = 0.8;
        this.invulnerableTimer = 0.2;
        this.stats.addSkillXP('tactica', 3);
        const speed = 180;
        this.vx = mov.x * speed;
        this.vy = mov.y * speed;
        this.x += this.vx * 0.2;
        this.y += this.vy * 0.2;
        return;
      }
    }

    if ((input.wasMouseClicked() || input.isKeyDown(' ')) && this.attackCooldown <= 0) {
      this.state = 'attacking';
      this.stateTimer = 0.25;
      this.attackHit = false;
      this.attackCooldown = 0.4;
      this.stats.addSkillXP('esgrima', 5);
      if (this.audio) this.audio.playSfx('attack');
      return;
    }

    const mov = input.getMovement();
    if (mov.x !== 0 || mov.y !== 0) {
      this.state = 'walking';
      this.facingRight = mov.x >= 0;
      const speed = 130 * this.stats.getSpeedMultiplier();
      this.vx = mov.x * speed;
      this.vy = mov.y * speed;

      this.stats.addSkillXP('supervivencia', 0.5 * dt);
    } else {
      this.vx = 0;
      this.vy = 0;
    }
  }

  _processAttackHit(enemies) {
    const attackRange = 45;
    const attackArc = Math.PI / 2;
    const facingAngle = this.facingRight ? 0 : Math.PI;

    enemies.forEach(enemy => {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > attackRange) return;

      const angleTo = Math.atan2(dy, dx);
      let diff = angleTo - facingAngle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) <= attackArc / 2) {
        const baseDmg = this.inventory.getWeaponDamage();
        const str = this.stats.stats.fuerza;
        const dmgMult = 1 + (str - 10) * 0.05;
        const critRoll = Math.random();
        const critMult = critRoll < 0.05 + (this.stats.stats.destreza - 8) * 0.02 ? 1.8 : 1;
        const rawDmg = baseDmg * dmgMult * critMult;
        const defense = enemy.defense || 0;
        const finalDmg = Math.max(1, Math.round(rawDmg - defense * 0.5));
        enemy.takeDamage(finalDmg, 'corte');
        this.damageDealt += finalDmg;
        if (enemy.dead) this.combatKills++;
        if (this.audio) this.audio.playSfx('hit');
      }
    });
  }

  takeDamage(amount, type) {
    if (this.invulnerableTimer > 0) return false;
    if (this.state === 'blocking') {
      const blocked = amount * 0.7;
      this.stats.takeDamage(amount * 0.3);
      this.stats.useStamina(10);
      this.stats.addSkillXP('parada', 8);
      this.stats.addSkillXP('tactica', 2);
      if (this.audio) this.audio.playSfx('block');
      return false;
    }
    const died = this.stats.takeDamage(amount);
    if (this.audio) this.audio.playSfx('hurt');
    if (died) {
      if (this.audio) this.audio.playSfx('death');
    }
    return died;
  }

  getAttackRange() {
    return 45;
  }

  getDefense() {
    return this.inventory.getArmorDefense();
  }

  getRunStats() {
    return {
      kills: this.combatKills,
      damageDealt: this.damageDealt,
      skillsUsed: this.stats.getRunData().skills,
    };
  }
}

export default Player;
