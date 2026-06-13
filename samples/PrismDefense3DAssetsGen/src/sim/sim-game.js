import {
  BOARD_SIZE,
  START_GOLD,
  START_LIVES,
  SELL_REFUND,
  WAVE_BONUS_BASE,
  WAVE_BONUS_PER_WAVE,
  FIRST_WAVE_COUNTDOWN,
  BETWEEN_WAVE_COUNTDOWN,
  MAX_ENEMIES,
  MAX_PROJECTILES,
  TOWER_TYPES,
  ENEMY_TYPES,
  WAVES,
  SCORE_PER_WAVE,
  tileToWorldX,
  tileToWorldZ,
} from './config.js';
import { buildPath } from './path.js';
import { LEVELS } from './config.js';

// Scratch payloads reused for high-frequency events so the steady-state sim
// step allocates nothing. Listeners must consume synchronously, never retain.
const shotEvent = { kind: '', x: 0, z: 0 };
const pulseEvent = { x: 0, z: 0, range: 0 };
const deathEvent = { type: '', x: 0, z: 0, gold: 0 };
const leakEvent = { type: '', lives: 0 };

// Headless game simulation: fixed-timestep, pooled entities, no DOM/Three.js.
export class SimGame {
  constructor(events) {
    this.events = events;
    this.levelIndex = 0;
    this.path = buildPath(LEVELS[0].waypoints);

    this.enemies = [];
    for (let i = 0; i < MAX_ENEMIES; i++) {
      this.enemies.push({
        active: false,
        type: 'runner',
        hp: 0,
        maxHp: 0,
        speed: 0,
        goldValue: 0,
        leak: 0,
        radius: 0,
        pathDist: 0,
        x: 0,
        z: 0,
        prevX: 0,
        prevZ: 0,
        slowTimer: 0,
        slowFactor: 1,
        hitFlash: 0,
      });
    }

    this.projectiles = [];
    for (let i = 0; i < MAX_PROJECTILES; i++) {
      this.projectiles.push({
        active: false,
        kind: 'cannon',
        targetIndex: -1,
        damage: 0,
        speed: 0,
        x: 0,
        z: 0,
        prevX: 0,
        prevZ: 0,
      });
    }

    this.towers = [];
    this.towerByTile = new Map();
    this.reset();
  }

  // Resets the run; passing a level index also switches the active path.
  reset(levelIndex = this.levelIndex) {
    if (levelIndex !== this.levelIndex) {
      this.levelIndex = levelIndex;
      this.path = buildPath(LEVELS[levelIndex].waypoints);
    }
    this.gold = START_GOLD;
    this.lives = START_LIVES;
    this.waveIndex = -1;
    this.wavesCleared = 0;
    this.waveActive = false;
    this.waveTime = 0;
    this.countdown = FIRST_WAVE_COUNTDOWN;
    this.outcome = null;
    this.aliveCount = 0;
    this.bossIndex = -1;
    this.spawnQueue = [];
    this.spawnCursor = 0;
    for (const e of this.enemies) e.active = false;
    for (const p of this.projectiles) p.active = false;
    this.towers.length = 0;
    this.towerByTile.clear();
  }

  // ---------- building ----------

  isPathTile(col, row) {
    return this.path.tiles.has(`${col},${row}`);
  }

  canBuildAt(col, row) {
    if (col < 0 || row < 0 || col >= BOARD_SIZE || row >= BOARD_SIZE) return false;
    if (this.isPathTile(col, row)) return false;
    return !this.towerByTile.has(`${col},${row}`);
  }

  towerAt(col, row) {
    return this.towerByTile.get(`${col},${row}`) || null;
  }

  buildTower(col, row, type) {
    const def = TOWER_TYPES[type];
    if (!def || this.outcome) return false;
    if (!this.canBuildAt(col, row)) return false;
    if (this.gold < def.cost) return false;
    this.gold -= def.cost;
    const tower = {
      key: `${col},${row}`,
      type,
      col,
      row,
      level: 0,
      x: tileToWorldX(col),
      z: tileToWorldZ(row),
      cooldown: 0,
      invested: def.cost,
    };
    this.towers.push(tower);
    this.towerByTile.set(tower.key, tower);
    this.events.emit('towerBuilt', tower);
    return true;
  }

  upgradeTower(tower) {
    const def = TOWER_TYPES[tower.type];
    if (this.outcome || tower.level >= def.levels.length - 1) return false;
    if (this.gold < def.upgradeCost) return false;
    this.gold -= def.upgradeCost;
    tower.level += 1;
    tower.invested += def.upgradeCost;
    this.events.emit('towerUpgraded', tower);
    return true;
  }

  sellTower(tower) {
    const i = this.towers.indexOf(tower);
    if (i < 0) return false;
    this.towers.splice(i, 1);
    this.towerByTile.delete(tower.key);
    this.gold += Math.floor(tower.invested * SELL_REFUND);
    this.events.emit('towerSold', tower);
    return true;
  }

  sellRefund(tower) {
    return Math.floor(tower.invested * SELL_REFUND);
  }

  // ---------- waves ----------

  forceNextWave() {
    if (!this.waveActive && !this.outcome && this.wavesCleared < WAVES.length) {
      this.countdown = 0;
    }
  }

  startNextWave() {
    this.waveIndex += 1;
    const wave = WAVES[this.waveIndex];
    this.spawnQueue.length = 0;
    this.spawnCursor = 0;
    for (const entry of wave.entries) {
      for (let k = 0; k < entry.count; k++) {
        this.spawnQueue.push({ type: entry.type, t: entry.delay + k * entry.interval });
      }
    }
    this.spawnQueue.sort((a, b) => a.t - b.t);
    this.waveTime = 0;
    this.waveActive = true;
    this.events.emit('waveStart', this.waveIndex + 1);
  }

  spawnEnemy(type) {
    const def = ENEMY_TYPES[type];
    const hpMul = WAVES[this.waveIndex].hpMul;
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.active) continue;
      e.active = true;
      e.type = type;
      e.maxHp = Math.round(def.hp * hpMul);
      e.hp = e.maxHp;
      e.speed = def.speed;
      e.goldValue = def.gold;
      e.leak = def.leak;
      e.radius = def.radius;
      e.pathDist = 0;
      e.slowTimer = 0;
      e.slowFactor = 1;
      e.hitFlash = 0;
      this.path.posAt(0, e);
      e.prevX = e.x;
      e.prevZ = e.z;
      this.aliveCount += 1;
      if (type === 'boss') {
        this.bossIndex = i;
        this.events.emit('bossSpawn', e);
      }
      return true;
    }
    return false; // pool momentarily full; retried next step
  }

  getBoss() {
    if (this.bossIndex < 0) return null;
    const boss = this.enemies[this.bossIndex];
    return boss.active ? boss : null;
  }

  // ---------- combat helpers ----------

  damageEnemy(e, amount) {
    if (!e.active) return;
    e.hp -= amount;
    e.hitFlash = 0.12;
    if (e.hp <= 0) {
      e.active = false;
      this.aliveCount -= 1;
      this.gold += e.goldValue;
      deathEvent.type = e.type;
      deathEvent.x = e.x;
      deathEvent.z = e.z;
      deathEvent.gold = e.goldValue;
      this.events.emit('enemyDied', deathEvent);
    }
  }

  findCannonTarget(tower, range) {
    let best = null;
    let bestDist = -1;
    const r2 = range * range;
    for (const e of this.enemies) {
      if (!e.active) continue;
      const dx = e.x - tower.x;
      const dz = e.z - tower.z;
      if (dx * dx + dz * dz > r2) continue;
      if (e.pathDist > bestDist) {
        bestDist = e.pathDist;
        best = e;
      }
    }
    return best;
  }

  findLaserTarget(tower, range) {
    let best = null;
    let bestHp = -1;
    const r2 = range * range;
    for (const e of this.enemies) {
      if (!e.active) continue;
      const dx = e.x - tower.x;
      const dz = e.z - tower.z;
      if (dx * dx + dz * dz > r2) continue;
      if (e.hp > bestHp) {
        bestHp = e.hp;
        best = e;
      }
    }
    return best;
  }

  fireProjectile(tower, target, kind, damage, speed) {
    for (const p of this.projectiles) {
      if (p.active) continue;
      p.active = true;
      p.kind = kind;
      p.targetIndex = this.enemies.indexOf(target);
      p.damage = damage;
      p.speed = speed;
      p.x = tower.x;
      p.z = tower.z;
      p.prevX = tower.x;
      p.prevZ = tower.z;
      break;
    }
    shotEvent.kind = kind;
    shotEvent.x = tower.x;
    shotEvent.z = tower.z;
    this.events.emit('shot', shotEvent);
  }

  // ---------- main step ----------

  step(dt) {
    if (this.outcome) return;

    // Wave countdown / auto-start.
    if (!this.waveActive && this.wavesCleared < WAVES.length) {
      this.countdown -= dt;
      if (this.countdown <= 0) this.startNextWave();
    }

    // Spawning.
    if (this.waveActive) {
      this.waveTime += dt;
      while (
        this.spawnCursor < this.spawnQueue.length &&
        this.spawnQueue[this.spawnCursor].t <= this.waveTime
      ) {
        if (!this.spawnEnemy(this.spawnQueue[this.spawnCursor].type)) break;
        this.spawnCursor += 1;
      }
    }

    // Enemies.
    for (const e of this.enemies) {
      if (!e.active) continue;
      e.prevX = e.x;
      e.prevZ = e.z;
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.slowTimer > 0) {
        e.slowTimer -= dt;
        if (e.slowTimer <= 0) e.slowFactor = 1;
      }
      e.pathDist += e.speed * e.slowFactor * dt;
      if (e.pathDist >= this.path.totalLength) {
        e.active = false;
        this.aliveCount -= 1;
        this.lives = Math.max(0, this.lives - e.leak);
        leakEvent.type = e.type;
        leakEvent.lives = this.lives;
        this.events.emit('leak', leakEvent);
        if (this.lives <= 0) {
          this.outcome = 'lost';
          this.events.emit('lost', this.getScore());
          return;
        }
        continue;
      }
      this.path.posAt(e.pathDist, e);
    }

    // Towers.
    for (const tower of this.towers) {
      const def = TOWER_TYPES[tower.type];
      const stats = def.levels[tower.level];
      tower.cooldown -= dt;
      if (tower.cooldown > 0) continue;
      tower.cooldown = 0;
      if (tower.type === 'frost') {
        // Radial pulse: slow + light damage to everything in range.
        const r2 = stats.range * stats.range;
        let hitAny = false;
        for (const e of this.enemies) {
          if (!e.active) continue;
          const dx = e.x - tower.x;
          const dz = e.z - tower.z;
          if (dx * dx + dz * dz > r2) continue;
          hitAny = true;
          e.slowFactor = 1 - stats.slow;
          e.slowTimer = stats.slowTime;
          this.damageEnemy(e, stats.damage);
        }
        if (hitAny) {
          tower.cooldown = 1 / stats.rate;
          pulseEvent.x = tower.x;
          pulseEvent.z = tower.z;
          pulseEvent.range = stats.range;
          this.events.emit('frostPulse', pulseEvent);
        }
      } else {
        const target =
          tower.type === 'cannon'
            ? this.findCannonTarget(tower, stats.range)
            : this.findLaserTarget(tower, stats.range);
        if (target) {
          this.fireProjectile(tower, target, tower.type, stats.damage, def.projectileSpeed);
          tower.cooldown = 1 / stats.rate;
        }
      }
    }

    // Projectiles (homing; always land unless the target dies first).
    for (const p of this.projectiles) {
      if (!p.active) continue;
      p.prevX = p.x;
      p.prevZ = p.z;
      const target = this.enemies[p.targetIndex];
      if (!target || !target.active) {
        p.active = false;
        continue;
      }
      const dx = target.x - p.x;
      const dz = target.z - p.z;
      const dist = Math.hypot(dx, dz);
      const travel = p.speed * dt;
      if (dist <= Math.max(travel, 0.18)) {
        p.active = false;
        this.damageEnemy(target, p.damage);
      } else {
        p.x += (dx / dist) * travel;
        p.z += (dz / dist) * travel;
      }
    }

    // Wave clear.
    if (
      this.waveActive &&
      this.spawnCursor >= this.spawnQueue.length &&
      this.aliveCount === 0
    ) {
      this.waveActive = false;
      this.wavesCleared = this.waveIndex + 1;
      this.bossIndex = -1;
      const bonus = WAVE_BONUS_BASE + WAVE_BONUS_PER_WAVE * this.wavesCleared;
      this.gold += bonus;
      this.events.emit('waveClear', this.wavesCleared);
      if (this.wavesCleared >= WAVES.length) {
        this.outcome = 'won';
        this.events.emit('won', this.getScore());
      } else {
        this.countdown = BETWEEN_WAVE_COUNTDOWN;
      }
    }
  }

  getScore() {
    return this.wavesCleared * SCORE_PER_WAVE + this.gold;
  }
}
