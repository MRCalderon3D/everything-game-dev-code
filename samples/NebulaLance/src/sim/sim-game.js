// Headless game simulation: fixed-timestep, pooled entities, no DOM/Three.js.
// Deterministic (seeded RNG) so the headless smoke test is reproducible.
import {
  FIELD,
  PLAYER_BOUNDS,
  SPAWN_X,
  DESPAWN_X,
  MAX_PLAYER_BULLETS,
  MAX_ENEMY_BULLETS,
  MAX_ENEMIES,
  MAX_POWERUPS,
  MAX_MINIONS,
  PLAYER,
  WAVE,
  FORCE,
  POWERUP_KINDS,
  POWERUP,
  MAX_POWER_LEVEL,
  MAX_SPEED_LEVEL,
  COMBO_WINDOW,
  COMBO_PER_TIER,
  MAX_MULTIPLIER,
  ENEMY_TYPES,
  ENEMY_BULLET_RADIUS,
  BOSS,
  HAZARD,
  STAGE,
  clamp,
} from './config.js';

// Reused event payloads so the steady-state step allocates nothing. Listeners
// must consume synchronously and never retain these objects.
const shotEvent = { kind: '' };
const beamEvent = { tier: 0 };
const dieEvent = { x: 0, y: 0, type: '', score: 0 };
const boomEvent = { x: 0, y: 0, scale: 1 };
const puEvent = { kind: '' };
const forceEvent = { mode: '' };
const phaseEvent = { phase: 0 };

function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
function overlap(ax, ay, ar, bx, by, br) {
  const r = ar + br;
  return dist2(ax, ay, bx, by) <= r * r;
}

export class SimGame {
  constructor(events) {
    this.events = events;

    this.player = {
      x: 0, y: 0, prevX: 0, prevY: 0, alive: false, invuln: 0, shield: false,
      powerLevel: 1, speedLevel: 1,
      firing: false, chargeStart: 0, fireCd: 0,
    };

    this.playerBullets = Array.from({ length: MAX_PLAYER_BULLETS }, () => ({
      active: false, x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0,
      radius: 0, damage: 0, pierce: false, homing: false, kind: 'normal',
    }));
    this.enemyBullets = Array.from({ length: MAX_ENEMY_BULLETS }, () => ({
      active: false, x: 0, y: 0, prevX: 0, prevY: 0, vx: 0, vy: 0,
    }));
    this.enemies = Array.from({ length: MAX_ENEMIES }, () => ({
      active: false, type: 'gunner', hp: 0, x: 0, y: 0, prevX: 0, prevY: 0,
      t: 0, spawnY: 0, fireCd: 0, speed: 0, radius: 0, score: 0,
      dropsPowerup: false, holdX: 0, hitFlash: 0,
    }));
    this.minions = Array.from({ length: MAX_MINIONS }, () => ({
      active: false, hp: 0, x: 0, y: 0, prevX: 0, prevY: 0, t: 0, hitFlash: 0,
    }));
    this.powerups = Array.from({ length: MAX_POWERUPS }, () => ({
      active: false, kind: 'force', x: 0, y: 0, prevX: 0, prevY: 0, t: 0,
    }));

    this.force = {
      granted: false, mode: 'front', x: 0, y: 0, prevX: 0, prevY: 0,
      side: 'front', weapon: 'spread', fireCd: 0,
    };

    this.boss = {
      active: false, x: 0, y: 0, prevX: 0, prevY: 0, phase: 0, coreHp: 0,
      t: 0, mode: 'idle', invuln: 0, coreFlash: 0,
      fanCd: 0, beamCd: 0, minionCd: 0,
      beamState: 'idle', beamTimer: 0, beamY: 0,
    };

    this.hazard = { active: false, gap: HAZARD.maxGap };

    this.reset();
  }

  reset() {
    this.seed = 1234567;
    this.simTime = 0;
    this.outcome = null;
    this.score = 0;
    this.lives = PLAYER.startLives;
    this.combo = 0;
    this.comboTimer = 0;
    this.aliveCount = 0;

    const p = this.player;
    p.x = PLAYER_BOUNDS.xMin + 2;
    p.y = 0;
    p.alive = true;
    p.invuln = 1.0;
    p.shield = false;
    p.powerLevel = 1;
    p.speedLevel = 1;
    p.firing = false;
    p.chargeStart = 0;
    p.fireCd = 0;
    this.moveX = 0;
    this.moveY = 0;

    for (const b of this.playerBullets) b.active = false;
    for (const b of this.enemyBullets) b.active = false;
    for (const e of this.enemies) e.active = false;
    for (const m of this.minions) m.active = false;
    for (const u of this.powerups) u.active = false;

    this.force.granted = false;
    this.force.mode = 'front';
    this.force.side = 'front';
    this.force.weapon = 'spread';

    const boss = this.boss;
    boss.active = false;
    boss.mode = 'idle';
    boss.phase = 0;
    boss.beamState = 'idle';

    this.hazard.active = false;
    this.hazard.gap = HAZARD.maxGap;

    // Flatten the authored timeline into a sorted spawn schedule.
    this.schedule = [];
    for (const s of STAGE.spawns) {
      const count = s.count || 1;
      const gap = s.gap || 0;
      for (let i = 0; i < count; i++) {
        this.schedule.push({ t: s.t + i * gap, type: s.type, y: s.y });
      }
    }
    this.schedule.sort((a, b) => a.t - b.t);
    this.scheduleCursor = 0;
    this.bossTriggered = false;
    this.bossWarned = false;
  }

  rng() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  // ---------- input intents ----------
  setMove(dx, dy) {
    this.moveX = clamp(dx, -1, 1);
    this.moveY = clamp(dy, -1, 1);
  }
  fireDown() {
    const p = this.player;
    if (!p.alive || p.firing) return;
    p.firing = true;
    p.chargeStart = this.simTime;
    this.firePrimary(); // responsive press-shot on the rising edge
  }
  fireUp() {
    const p = this.player;
    if (!p.alive || !p.firing) return;
    p.firing = false;
    const charge = clamp((this.simTime - p.chargeStart) / WAVE.chargeTime, 0, 1);
    if (charge >= WAVE.minBeamCharge) this.fireWaveCannon(charge);
  }
  toggleForceSide() {
    const f = this.force;
    if (!f.granted) return;
    if (f.mode === 'front') { f.mode = 'rear'; f.side = 'rear'; }
    else if (f.mode === 'rear') { f.mode = 'front'; f.side = 'front'; }
    forceEvent.mode = f.mode;
    this.events.emit('forceState', forceEvent);
  }
  launchOrRecallForce() {
    const f = this.force;
    if (!f.granted) return;
    if (f.mode === 'front' || f.mode === 'rear') f.mode = 'detached';
    else f.mode = 'returning';
    forceEvent.mode = f.mode;
    this.events.emit('forceState', forceEvent);
  }

  chargeLevel() {
    const p = this.player;
    if (!p.firing) return 0;
    return clamp((this.simTime - p.chargeStart) / WAVE.chargeTime, 0, 1);
  }

  // ---------- spawning helpers ----------
  spawnPlayerBullet(x, y, vx, vy, opts) {
    for (const b of this.playerBullets) {
      if (b.active) continue;
      b.active = true;
      b.x = b.prevX = x; b.y = b.prevY = y;
      b.vx = vx; b.vy = vy;
      b.radius = opts.radius; b.damage = opts.damage;
      b.pierce = !!opts.pierce; b.homing = !!opts.homing; b.kind = opts.kind;
      return b;
    }
    return null;
  }
  spawnEnemyBullet(x, y, vx, vy) {
    for (const b of this.enemyBullets) {
      if (b.active) continue;
      b.active = true;
      b.x = b.prevX = x; b.y = b.prevY = y;
      b.vx = vx; b.vy = vy;
      return b;
    }
    return null;
  }
  spawnEnemy(type, y) {
    const def = ENEMY_TYPES[type];
    for (const e of this.enemies) {
      if (e.active) continue;
      e.active = true;
      e.type = type;
      e.hp = def.hp;
      e.x = e.prevX = SPAWN_X;
      e.y = e.prevY = y;
      e.spawnY = y;
      e.t = 0;
      e.fireCd = def.fireGap > 0 ? def.fireGap * (0.5 + this.rng()) : 0;
      e.speed = def.speed;
      e.radius = def.radius;
      e.score = def.score;
      e.dropsPowerup = !!def.dropsPowerup;
      e.hitFlash = 0;
      // Turrets hold near a wall at a forward x.
      e.holdX = type === 'turret' ? 2.6 + this.rng() * 2.6 : DESPAWN_X;
      this.aliveCount++;
      return e;
    }
    return null;
  }
  spawnMinion(x, y) {
    for (const m of this.minions) {
      if (m.active) continue;
      m.active = true;
      m.hp = ENEMY_TYPES.minion.hp;
      m.x = m.prevX = x; m.y = m.prevY = y;
      m.t = 0; m.hitFlash = 0;
      this.aliveCount++;
      return m;
    }
    return null;
  }
  spawnPowerup(x, y, kind) {
    for (const u of this.powerups) {
      if (u.active) continue;
      u.active = true;
      u.kind = kind;
      u.x = u.prevX = x; u.y = u.prevY = y;
      u.t = 0;
      return u;
    }
    return null;
  }

  firePrimary() {
    const p = this.player;
    if (p.fireCd > 0) return;
    p.fireCd = PLAYER.fireGap;
    const streams = p.powerLevel;
    const x = p.x + PLAYER.radius;
    for (let i = 0; i < streams; i++) {
      const oy = (i - (streams - 1) / 2) * PLAYER.streamSpacing;
      this.spawnPlayerBullet(x, p.y + oy, PLAYER.bulletSpeed, 0, {
        radius: PLAYER.bulletRadius, damage: PLAYER.bulletDamage, kind: 'normal',
      });
    }
    shotEvent.kind = 'normal';
    this.events.emit('shot', shotEvent);
  }
  fireWaveCannon(charge) {
    const p = this.player;
    let tier = WAVE.tiers[0];
    let tierIndex = 1;
    for (let i = 0; i < WAVE.tiers.length; i++) {
      if (charge >= WAVE.tiers[i].at) { tier = WAVE.tiers[i]; tierIndex = i + 1; }
    }
    this.spawnPlayerBullet(p.x + PLAYER.radius, p.y, WAVE.beamSpeed, 0, {
      radius: tier.halfH, damage: tier.damage, pierce: true, kind: 'beam',
    });
    beamEvent.tier = tierIndex;
    this.events.emit('beam', beamEvent);
  }

  // ---------- main step ----------
  step(dt) {
    if (this.outcome) return;
    this.simTime += dt;

    this.updateStage(dt);
    this.updatePlayer(dt);
    this.updateForce(dt);
    this.updateEnemies(dt);
    this.updateMinions(dt);
    this.updateBoss(dt);
    this.updatePlayerBullets(dt);
    this.updateEnemyBullets(dt);
    this.updatePowerups(dt);
    this.updateHazard(dt);
    this.resolveCollisions(dt);

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 0;
    }
  }

  updateStage(dt) {
    // Release scheduled spawns whose time has come.
    while (
      this.scheduleCursor < this.schedule.length &&
      this.schedule[this.scheduleCursor].t <= this.simTime
    ) {
      const s = this.schedule[this.scheduleCursor++];
      this.spawnEnemy(s.type, s.y);
    }
    // Boss trigger.
    if (!this.bossWarned && this.simTime >= STAGE.bossTime - 2) {
      this.bossWarned = true;
      this.events.emit('bossWarning', null);
    }
    if (!this.bossTriggered && this.simTime >= STAGE.bossTime) {
      this.bossTriggered = true;
      this.startBoss();
    }
  }

  updatePlayer(dt) {
    const p = this.player;
    p.prevX = p.x; p.prevY = p.y;
    if (p.fireCd > 0) p.fireCd -= dt;
    if (p.invuln > 0) p.invuln -= dt;
    if (!p.alive) return;
    const speed = PLAYER.baseSpeed + (p.speedLevel - 1) * PLAYER.speedPerLevel;
    p.x = clamp(p.x + this.moveX * speed * dt, PLAYER_BOUNDS.xMin, PLAYER_BOUNDS.xMax);
    p.y = clamp(p.y + this.moveY * speed * dt, PLAYER_BOUNDS.yMin, PLAYER_BOUNDS.yMax);
  }

  updateForce(dt) {
    const f = this.force;
    if (!f.granted) return;
    f.prevX = f.x; f.prevY = f.y;
    const p = this.player;
    if (f.mode === 'front' || f.mode === 'rear') {
      const offset = f.mode === 'front' ? FORCE.frontOffset : FORCE.rearOffset;
      const tx = p.x + offset;
      const ty = p.y;
      f.x += (tx - f.x) * FORCE.followLerp;
      f.y += (ty - f.y) * FORCE.followLerp;
      f.fireCd -= dt;
      if (f.fireCd <= 0) { f.fireCd = FORCE.fireGap; this.fireForceWeapon(); }
    } else if (f.mode === 'detached') {
      f.x += FORCE.launchSpeed * dt;
      if (f.x > FIELD.xMax + 1) f.mode = 'returning';
    } else if (f.mode === 'returning') {
      const tx = p.x + (f.side === 'front' ? FORCE.frontOffset : FORCE.rearOffset);
      const dx = tx - f.x;
      const dy = p.y - f.y;
      const d = Math.hypot(dx, dy) || 1;
      f.x += (dx / d) * FORCE.recallSpeed * dt;
      f.y += (dy / d) * FORCE.recallSpeed * dt;
      if (d < 0.4) { f.mode = f.side; }
    }
  }

  fireForceWeapon() {
    const f = this.force;
    const x = f.x + FORCE.radius;
    if (f.weapon === 'spread') {
      for (const a of [-0.22, 0, 0.22]) {
        this.spawnPlayerBullet(x, f.y, Math.cos(a) * 13, Math.sin(a) * 13, {
          radius: 0.13, damage: 1, kind: 'spread',
        });
      }
    } else if (f.weapon === 'laser') {
      this.spawnPlayerBullet(x, f.y, 20, 0, { radius: 0.12, damage: 2, pierce: true, kind: 'laser' });
    } else {
      this.spawnPlayerBullet(x, f.y, 12, 0, { radius: 0.15, damage: 2, homing: true, kind: 'homing' });
    }
    shotEvent.kind = 'force';
    this.events.emit('shot', shotEvent);
  }

  updateEnemies(dt) {
    for (const e of this.enemies) {
      if (!e.active) continue;
      e.prevX = e.x; e.prevY = e.y;
      e.t += dt;
      if (e.hitFlash > 0) e.hitFlash -= dt;
      const def = ENEMY_TYPES[e.type];
      if (e.type === 'gunner') {
        e.x -= e.speed * dt;
        e.y = e.spawnY + Math.sin(e.t * 2.2) * 0.8;
      } else if (e.type === 'weaver') {
        e.x -= e.speed * dt;
        e.y = clamp(e.spawnY + Math.sin(e.t * 3.0) * 2.6, FIELD.yMin, FIELD.yMax);
      } else if (e.type === 'carrier') {
        e.x -= e.speed * dt;
        e.y = e.spawnY + Math.sin(e.t * 1.2) * 0.5;
      } else if (e.type === 'turret') {
        if (e.x > e.holdX) e.x -= e.speed * dt;
        e.y = e.spawnY;
      }
      // Fire (aimed at player) for types that shoot.
      if (def.fireGap > 0 && this.player.alive) {
        e.fireCd -= dt;
        if (e.fireCd <= 0) {
          e.fireCd = def.fireGap;
          const dx = this.player.x - e.x;
          const dy = this.player.y - e.y;
          const d = Math.hypot(dx, dy) || 1;
          this.spawnEnemyBullet(e.x, e.y, (dx / d) * def.bulletSpeed, (dy / d) * def.bulletSpeed);
        }
      }
      if (e.x < DESPAWN_X) { e.active = false; this.aliveCount--; }
    }
  }

  updateMinions(dt) {
    for (const m of this.minions) {
      if (!m.active) continue;
      m.prevX = m.x; m.prevY = m.y;
      m.t += dt;
      if (m.hitFlash > 0) m.hitFlash -= dt;
      m.x -= ENEMY_TYPES.minion.speed * dt;
      // gentle homing toward the player's y
      const dy = this.player.y - m.y;
      m.y += clamp(dy, -1, 1) * 2.0 * dt;
      if (m.x < DESPAWN_X) { m.active = false; this.aliveCount--; }
    }
  }

  startBoss() {
    const boss = this.boss;
    boss.active = true;
    boss.mode = 'enter';
    boss.x = boss.prevX = BOSS.enterFrom;
    boss.y = boss.prevY = 0;
    boss.phase = 0;
    boss.coreHp = BOSS.phases[0].coreHp;
    boss.t = 0;
    boss.invuln = 0;
    boss.coreFlash = 0;
    boss.fanCd = 1.5;
    boss.beamCd = 3.0;
    boss.minionCd = 3.0;
    boss.beamState = 'idle';
    phaseEvent.phase = 1;
    this.events.emit('bossPhase', phaseEvent);
  }

  updateBoss(dt) {
    const boss = this.boss;
    if (!boss.active) return;
    boss.prevX = boss.x; boss.prevY = boss.y;
    boss.t += dt;
    if (boss.coreFlash > 0) boss.coreFlash -= dt;
    if (boss.invuln > 0) boss.invuln -= dt;

    if (boss.mode === 'enter') {
      boss.x -= BOSS.enterSpeed * dt;
      if (boss.x <= BOSS.anchorX) { boss.x = BOSS.anchorX; boss.mode = 'fight'; }
      return;
    }
    if (boss.mode !== 'fight') return;

    const ph = BOSS.phases[boss.phase];
    boss.y = Math.sin(boss.t * ph.bobSpeed) * BOSS.bobAmplitude;

    // Bullet fans.
    boss.fanCd -= dt;
    if (boss.fanCd <= 0) {
      boss.fanCd = ph.fanGap;
      this.bossFan(ph.fanCount, ph.fanSpeed);
    }
    // Sweeping beam.
    if (ph.beam) {
      if (boss.beamState === 'idle') {
        boss.beamCd -= dt;
        if (boss.beamCd <= 0) {
          boss.beamState = 'warn';
          boss.beamTimer = BOSS.beamWarn;
          boss.beamY = boss.y;
          boss.beamCd = ph.beamGap;
        }
      } else if (boss.beamState === 'warn') {
        boss.beamTimer -= dt;
        boss.beamY = boss.y; // track until it locks
        if (boss.beamTimer <= 0) { boss.beamState = 'fire'; boss.beamTimer = BOSS.beamActive; }
      } else if (boss.beamState === 'fire') {
        boss.beamTimer -= dt;
        if (boss.beamTimer <= 0) boss.beamState = 'idle';
      }
      // Minions.
      if (ph.minionGap > 0) {
        boss.minionCd -= dt;
        if (boss.minionCd <= 0) {
          boss.minionCd = ph.minionGap;
          this.spawnMinion(boss.x - 1, boss.y + 1.2);
          this.spawnMinion(boss.x - 1, boss.y - 1.2);
        }
      }
    }
  }

  bossFan(count, speed) {
    const boss = this.boss;
    const cx = boss.x + BOSS.coreOffsetX;
    const cy = boss.y;
    const spread = Math.PI * 0.7;
    for (let i = 0; i < count; i++) {
      const a = Math.PI - spread / 2 + (spread * i) / (count - 1); // aimed leftward
      this.spawnEnemyBullet(cx, cy, Math.cos(a) * speed, Math.sin(a) * speed);
    }
  }

  bossCore() {
    const boss = this.boss;
    return { x: boss.x + BOSS.coreOffsetX, y: boss.y };
  }

  updatePlayerBullets(dt) {
    for (const b of this.playerBullets) {
      if (!b.active) continue;
      b.prevX = b.x; b.prevY = b.y;
      if (b.homing) {
        const target = this.nearestEnemy(b.x, b.y);
        if (target) {
          const dx = target.x - b.x;
          const dy = target.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const sp = 13;
          b.vx += ((dx / d) * sp - b.vx) * 0.15;
          b.vy += ((dy / d) * sp - b.vy) * 0.15;
        }
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x > FIELD.xMax + 1.5 || b.x < FIELD.xMin - 1.5 || b.y > FIELD.yMax + 2 || b.y < FIELD.yMin - 2) {
        b.active = false;
      }
    }
  }
  updateEnemyBullets(dt) {
    for (const b of this.enemyBullets) {
      if (!b.active) continue;
      b.prevX = b.x; b.prevY = b.y;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < FIELD.xMin - 1.5 || b.x > FIELD.xMax + 1.5 || b.y > FIELD.yMax + 2 || b.y < FIELD.yMin - 2) {
        b.active = false;
      }
    }
  }
  updatePowerups(dt) {
    for (const u of this.powerups) {
      if (!u.active) continue;
      u.prevX = u.x; u.prevY = u.y;
      u.t += dt;
      u.x -= POWERUP.driftSpeed * dt;
      u.y += Math.sin(u.t * 1.5) * 0.6 * dt;
      if (u.x < DESPAWN_X) u.active = false;
    }
  }

  updateHazard(dt) {
    if (this.simTime < HAZARD.start || this.simTime > HAZARD.end) {
      this.hazard.active = false;
      this.hazard.gap = HAZARD.maxGap;
      return;
    }
    this.hazard.active = true;
    // Narrow to minGap at the window midpoint, reopen by the end.
    const span = HAZARD.end - HAZARD.start;
    const u = (this.simTime - HAZARD.start) / span; // 0..1
    const tightness = Math.sin(u * Math.PI); // 0 -> 1 -> 0
    this.hazard.gap = HAZARD.maxGap - (HAZARD.maxGap - HAZARD.minGap) * tightness;
  }

  nearestEnemy(x, y) {
    let best = null;
    let bestD = Infinity;
    for (const e of this.enemies) {
      if (!e.active) continue;
      const d = dist2(x, y, e.x, e.y);
      if (d < bestD) { bestD = d; best = e; }
    }
    for (const m of this.minions) {
      if (!m.active) continue;
      const d = dist2(x, y, m.x, m.y);
      if (d < bestD) { bestD = d; best = m; }
    }
    if (this.boss.active && this.boss.mode === 'fight') {
      const c = this.bossCore();
      const d = dist2(x, y, c.x, c.y);
      if (d < bestD) { bestD = d; best = { x: c.x, y: c.y }; }
    }
    return best;
  }

  // ---------- collisions & resolution ----------
  resolveCollisions(dt) {
    const p = this.player;

    // Player bullets vs enemies / minions / boss core.
    for (const b of this.playerBullets) {
      if (!b.active) continue;
      let consumed = false;
      for (const e of this.enemies) {
        if (!e.active) continue;
        if (overlap(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
          this.damageEnemy(e, b.damage);
          if (!b.pierce) { consumed = true; break; }
        }
      }
      if (consumed) { b.active = false; continue; }
      for (const m of this.minions) {
        if (!m.active) continue;
        if (overlap(b.x, b.y, b.radius, m.x, m.y, ENEMY_TYPES.minion.radius)) {
          this.damageMinion(m, b.damage);
          if (!b.pierce) { consumed = true; break; }
        }
      }
      if (consumed) { b.active = false; continue; }
      if (this.boss.active && this.boss.mode === 'fight' && this.boss.invuln <= 0) {
        const c = this.bossCore();
        if (overlap(b.x, b.y, b.radius, c.x, c.y, BOSS.coreRadius)) {
          this.damageBoss(b.damage);
          if (!b.pierce) b.active = false;
        }
      }
    }

    if (!p.alive) return;

    // Enemy bullets vs Force (blocked) then vs player.
    for (const b of this.enemyBullets) {
      if (!b.active) continue;
      if (this.forceBlocks(b.x, b.y, ENEMY_BULLET_RADIUS)) { b.active = false; continue; }
      if (this.canHitPlayer() && overlap(b.x, b.y, ENEMY_BULLET_RADIUS, p.x, p.y, PLAYER.radius)) {
        b.active = false;
        this.hitPlayer();
      }
    }

    // Enemies / minions body contact (Force destroys enemies it touches).
    for (const e of this.enemies) {
      if (!e.active) continue;
      if (this.forceTouches(e.x, e.y, e.radius)) { this.damageEnemy(e, FORCE.contactDamage); }
      if (this.canHitPlayer() && overlap(e.x, e.y, e.radius, p.x, p.y, PLAYER.radius)) this.hitPlayer();
    }
    for (const m of this.minions) {
      if (!m.active) continue;
      if (this.forceTouches(m.x, m.y, ENEMY_TYPES.minion.radius)) this.damageMinion(m, FORCE.contactDamage);
      if (this.canHitPlayer() && overlap(m.x, m.y, ENEMY_TYPES.minion.radius, p.x, p.y, PLAYER.radius)) this.hitPlayer();
    }

    // Boss body + beam.
    if (this.boss.active && this.boss.mode === 'fight') {
      if (this.canHitPlayer() && overlap(this.boss.x, this.boss.y, BOSS.bodyRadius, p.x, p.y, PLAYER.radius)) {
        this.hitPlayer();
      }
      if (this.boss.beamState === 'fire' && this.canHitPlayer()) {
        if (p.x < this.boss.x && Math.abs(p.y - this.boss.beamY) < BOSS.beamHalfH + PLAYER.radius) {
          this.hitPlayer();
        }
      }
    }

    // Power-ups.
    for (const u of this.powerups) {
      if (!u.active) continue;
      if (overlap(u.x, u.y, POWERUP.radius, p.x, p.y, PLAYER.radius)) {
        u.active = false;
        this.applyPowerup(u.kind);
      }
    }

    // Hazard corridor: clamp the player inside (never an instant kill).
    if (this.hazard.active) {
      const limit = this.hazard.gap - PLAYER.radius;
      p.y = clamp(p.y, -limit, limit);
    }
  }

  canHitPlayer() {
    return this.player.alive && this.player.invuln <= 0;
  }

  forceBlocks(x, y, r) {
    const f = this.force;
    if (!f.granted) return false;
    if (f.mode === 'detached' || f.mode === 'returning' || f.mode === 'front' || f.mode === 'rear') {
      return overlap(x, y, r, f.x, f.y, FORCE.radius);
    }
    return false;
  }
  forceTouches(x, y, r) {
    return this.forceBlocks(x, y, r);
  }

  hitPlayer() {
    const p = this.player;
    if (p.invuln > 0) return;
    if (p.shield) {
      p.shield = false;
      p.invuln = 0.8;
      this.events.emit('playerHit', { shielded: true });
      return;
    }
    this.lives--;
    this.combo = 0;
    this.comboTimer = 0;
    p.invuln = PLAYER.respawnInvuln;
    // Force snaps back to the front on a hit.
    if (this.force.granted) { this.force.mode = 'front'; this.force.side = 'front'; }
    this.events.emit('playerHit', { shielded: false });
    if (this.lives <= 0) {
      p.alive = false;
      this.outcome = 'lost';
      this.events.emit('lost', this.getScore());
    }
  }

  addScore(base) {
    this.combo++;
    this.comboTimer = COMBO_WINDOW;
    const mult = Math.min(MAX_MULTIPLIER, 1 + Math.floor(this.combo / COMBO_PER_TIER));
    this.score += base * mult;
  }

  damageEnemy(e, dmg) {
    e.hp -= dmg;
    e.hitFlash = 0.08;
    if (e.hp <= 0) {
      e.active = false;
      this.aliveCount--;
      this.addScore(e.score);
      dieEvent.x = e.x; dieEvent.y = e.y; dieEvent.type = e.type; dieEvent.score = e.score;
      this.events.emit('enemyDied', dieEvent);
      boomEvent.x = e.x; boomEvent.y = e.y; boomEvent.scale = e.radius * 2.2;
      this.events.emit('explosion', boomEvent);
      if (e.dropsPowerup) {
        const kind = this.pickPowerupKind();
        this.spawnPowerup(e.x, e.y, kind);
      }
    }
  }
  damageMinion(m, dmg) {
    m.hp -= dmg;
    m.hitFlash = 0.08;
    if (m.hp <= 0) {
      m.active = false;
      this.aliveCount--;
      this.addScore(ENEMY_TYPES.minion.score);
      boomEvent.x = m.x; boomEvent.y = m.y; boomEvent.scale = 0.7;
      this.events.emit('explosion', boomEvent);
    }
  }
  damageBoss(dmg) {
    const boss = this.boss;
    boss.coreHp -= dmg;
    boss.coreFlash = 0.08;
    if (boss.coreHp <= 0) {
      const c = this.bossCore();
      boomEvent.x = c.x; boomEvent.y = c.y; boomEvent.scale = 2.0;
      this.events.emit('explosion', boomEvent);
      if (boss.phase < BOSS.phases.length - 1) {
        boss.phase++;
        boss.coreHp = BOSS.phases[boss.phase].coreHp;
        boss.invuln = 1.2;
        boss.beamState = 'idle';
        this.addScore(1500);
        phaseEvent.phase = boss.phase + 1;
        this.events.emit('bossPhase', phaseEvent);
      } else {
        boss.active = false;
        boss.mode = 'dead';
        this.addScore(8000);
        this.outcome = 'won';
        this.events.emit('won', this.getScore());
      }
    }
  }

  pickPowerupKind() {
    // First drop always grants the Force; afterward, weighted variety.
    if (!this.force.granted) return 'force';
    const r = this.rng();
    if (r < 0.4) return 'force';
    if (r < 0.65) return 'power';
    if (r < 0.85) return 'speed';
    return 'shield';
  }

  applyPowerup(kind) {
    const f = this.force;
    if (kind === 'force') {
      if (!f.granted) {
        f.granted = true;
        f.mode = 'front';
        f.side = 'front';
        f.weapon = 'spread';
        f.x = this.player.x + FORCE.frontOffset;
        f.y = this.player.y;
      } else {
        const i = FORCE.weapons.indexOf(f.weapon);
        f.weapon = FORCE.weapons[(i + 1) % FORCE.weapons.length];
      }
      forceEvent.mode = f.mode;
      this.events.emit('forceState', forceEvent);
    } else if (kind === 'power') {
      this.player.powerLevel = Math.min(MAX_POWER_LEVEL, this.player.powerLevel + 1);
    } else if (kind === 'speed') {
      this.player.speedLevel = Math.min(MAX_SPEED_LEVEL, this.player.speedLevel + 1);
    } else if (kind === 'shield') {
      this.player.shield = true;
    }
    puEvent.kind = kind;
    this.events.emit('powerup', puEvent);
  }

  getScore() {
    return Math.round(this.score);
  }
}
