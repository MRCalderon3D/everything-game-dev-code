import { GAME_WIDTH, GAME_HEIGHT, COLORS, ENEMY_TYPES, BIOMES } from '../utils/Constants.js';
import Renderer from '../Renderer.js';
import Enemy from '../entities/Enemy.js';
import Projectile from '../entities/Projectile.js';
import HUD from '../ui/HUD.js';
class CombatScene {
  constructor(game, node, biomeName = 'frontera') {
    this.game = game;
    this.node = node;
    this.isBoss = node.type === 'boss';
    this.isElite = node.type === 'elite';
    this.biome = BIOMES[biomeName];
    this.player = game.player;
    this.stats = game.statsSystem;
    this.inventory = game.inventorySystem;
    this.audio = game.audio;
    this.enemies = [];
    this.projectiles = [];
    this.obstacles = [];
    this.roomW = 800;
    this.roomH = 460;
    this.cameraX = 0;
    this.cameraY = 0;
    this.waveCleared = false;
    this.victoryTimer = 0;
    this.damageNumbers = [];
    this.combatLog = [];
    this.killCount = 0;
    this.xpGained = 0;
    this.cobreGained = 0;
  }

  init() {
    const room = this._generateRoom();
    this.obstacles = room.obstacles;

    room.enemies.forEach(e => {
      this.enemies.push(new Enemy(e.type, e.x, e.y, this.isElite || this.isBoss));
    });

    if (this.isBoss) {
      this.audio.startMusic('boss');
      this.game.notifications.push('[PELIGROSIDAD: ALTA] Jefe detectado');
    } else if (this.isElite) {
      this.audio.startMusic('combat');
      this.game.notifications.push('[PELIGROSIDAD: MEDIA] Enemigos elite');
    } else {
      this.audio.startMusic('frontier');
      this.game.notifications.push('[ENEMIGO DETECTADO]');
    }
  }

  _generateRoom() {
    const enemies = [];
    const obstacles = [];
    const w = this.roomW;
    const h = this.roomH;

    const obstacleCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < obstacleCount; i++) {
      obstacles.push({
        x: 80 + Math.random() * (w - 160),
        y: 60 + Math.random() * (h - 120),
        w: 15 + Math.random() * 35,
        h: 15 + Math.random() * 35,
      });
    }

    if (this.isBoss) {
      const bossType = this.biome && this.biome.boss ? this.biome.boss : 'jabali_alfa';
      enemies.push({ type: bossType, x: w / 2, y: 100 });
    } else if (this.isElite) {
      const pool = this.biome ? this.biome.enemyPool : ['jabali_maldito', 'conejo_maldito'];
      enemies.push({ type: pool[Math.floor(Math.random() * pool.length)], x: 150 + Math.random() * 200, y: 100 + Math.random() * 100 });
      if (Math.random() < 0.5) {
        enemies.push({ type: pool[Math.floor(Math.random() * pool.length)], x: 450 + Math.random() * 200, y: 100 + Math.random() * 100 });
      }
    } else {
      const pool = this.biome ? this.biome.enemyPool : ['jabali_maldito', 'conejo_maldito'];
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        enemies.push({ type: pool[Math.floor(Math.random() * pool.length)], x: 200 + Math.random() * 400, y: 80 + Math.random() * 200 });
      }
    }

    return { enemies, obstacles };
  }

  update(dt) {
    if (this.player.stats.isDead()) {
      this.audio.startMusic('hub');
      this.game.sceneManager.setScene(new this.game.scenes.GameOverScene(this.game));
      return;
    }

    if (this.enemies.length === 0 && !this.waveCleared) {
      this.waveCleared = true;
      this.victoryTimer = 0.5;
      this.game.notifications.push('[COMBATE TERMINADO] Todos los enemigos eliminados');
      this.audio.startMusic('hub');

      if (this.isBoss) {
        this.game.progressionSystem.recordBossDefeat(this.biome.boss || 'default');
        this.game.progressionSystem.addEcoFragment('esgrima', 1);
        this.game.notifications.push('[MAESTRIA DE ECO] Memoria Muscular I: +1 Esgrima inicial');
      }
      return;
    }

    if (this.waveCleared) {
      this.victoryTimer -= dt;
      if (this.victoryTimer <= 0) {
        this._returnToMap();
      }
      return;
    }

    this.player.update(dt, this.game.input, this.enemies, this.projectiles);

    this.enemies.forEach(enemy => {
      if (enemy.dead) return;
      const result = enemy.update(dt, this.player);

      if (result === true) {
        const atkDmg = enemy.getAttackDamage();
        this._dealDamageToPlayer(atkDmg, enemy.tipoDaño);
      } else if (result && result.type === 'shoot') {
        this.projectiles.push(new Projectile(result.x, result.y, result.targetX, result.targetY, result.damage, 180));
      }

      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      this._clampToRoom(enemy);
    });

    this.enemies = this.enemies.filter(e => {
      if (e.dead) {
        this.xpGained += e.xp;
        this.killCount++;
        this.cobreGained += Math.floor(e.xp * 0.5);
        this.game.missionSystem.updateProgress(e.type, 1);
        this.stats.addSkillXP('esgrima', 2);
        this.stats.addSkillXP('tactica', 1);
        if (this.isBoss) {
          this.game.notifications.push(`[JEFE DERROTADO] ${e.name} ha caido. +${e.xp} XP`);
          this.audio.playSfx('death');
        }
        return false;
      }
      return true;
    });

    this.projectiles.forEach(p => p.update(dt));
    this.projectiles = this.projectiles.filter(p => {
      if (p.hitsPlayer(this.player.x, this.player.y, this.player.size)) {
        this._dealDamageToPlayer(p.damage, 'perforacion');
        return false;
      }
      return p.alive && p.x > -20 && p.x < this.roomW + 20 && p.y > -20 && p.y < this.roomH + 20;
    });

    this._handleCollisions();

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;
    this._clampToRoom(this.player);

    this._updateCamera();
    this.stats.regenStamina(25 * dt);

    this.damageNumbers = this.damageNumbers.filter(d => {
      d.life -= dt;
      return d.life > 0;
    });
  }

  _dealDamageToPlayer(amount, type) {
    this.player.takeDamage(amount, type);
    this.damageNumbers.push({
      x: this.player.x + (Math.random() - 0.5) * 30,
      y: this.player.y - 20,
      text: `-${Math.round(amount)}`,
      color: COLORS.TEXT_RED,
      life: 1.0,
    });
  }

  _handleCollisions() {
    const margin = 10;
    this.obstacles.forEach(obs => {
      this.enemies.forEach(enemy => {
        if (enemy.dead) return;
        if (this._rectCircleCollision(obs.x, obs.y, obs.w, obs.h, enemy.x, enemy.y, enemy.size / 2)) {
          this._pushOut(enemy, obs.x, obs.y, obs.w, obs.h);
        }
      });

      if (this._rectCircleCollision(obs.x, obs.y, obs.w, obs.h, this.player.x, this.player.y, this.player.size / 2)) {
        this._pushOut(this.player, obs.x, obs.y, obs.w, obs.h);
      }
    });
  }

  _rectCircleCollision(rx, ry, rw, rh, cx, cy, cr) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return (dx * dx + dy * dy) < (cr * cr);
  }

  _pushOut(entity, rx, ry, rw, rh) {
    const cx = entity.x;
    const cy = entity.y;
    const overlapX = Math.min(Math.abs(cx - rx), Math.abs(cx - (rx + rw)), (rx + rw / 2 - cx));
    const overlapY = Math.min(Math.abs(cy - ry), Math.abs(cy - (ry + rh)));

    if (Math.abs(overlapX) < Math.abs(overlapY)) {
      entity.x = cx < rx + rw / 2 ? rx - entity.size / 2 - 1 : rx + rw + entity.size / 2 + 1;
    } else {
      entity.y = cy < ry + rh / 2 ? ry - entity.size / 2 - 1 : ry + rh + entity.size / 2 + 1;
    }
  }

  _clampToRoom(entity) {
    entity.x = Math.max(entity.size / 2, Math.min(this.roomW - entity.size / 2, entity.x));
    entity.y = Math.max(entity.size / 2, Math.min(this.roomH - entity.size / 2, entity.y));
  }

  _updateCamera() {
    const targetX = this.player.x - GAME_WIDTH / 2;
    const targetY = this.player.y - GAME_HEIGHT / 2;
    this.cameraX += (targetX - this.cameraX) * 0.1;
    this.cameraY += (targetY - this.cameraY) * 0.1;
    this.cameraX = Math.max(0, Math.min(this.roomW - GAME_WIDTH, this.cameraX));
    this.cameraY = Math.max(0, Math.min(this.roomH - GAME_HEIGHT, this.cameraY));
  }

  _returnToMap() {
    this.game.sceneManager.setScene(new this.game.scenes.MapScene(this.game, this.node.type === 'boss' ? 'camino_valdrenot' : 'frontera'));
  }

  render(ctx) {
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    ctx.fillStyle = COLORS.TERRAIN_GRASS;
    ctx.fillRect(0, 0, this.roomW, this.roomH);

    for (let x = 0; x < this.roomW; x += 40) {
      for (let y = 0; y < this.roomH; y += 40) {
        ctx.fillStyle = (Math.floor(x / 40) + Math.floor(y / 40)) % 2 === 0 ? '#2a4a2a' : '#2e4e2e';
        ctx.fillRect(x, y, 40, 40);
      }
    }

    ctx.strokeStyle = '#446644';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.roomW, this.roomH);

    this.obstacles.forEach(o => {
      ctx.fillStyle = COLORS.ROCK;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#444455';
      ctx.fillRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
    });

    this.projectiles.forEach(p => {
      Renderer.drawProjectile(ctx, p.x, p.y, p.size, '#cc8844');
    });

    this.enemies.forEach(enemy => {
      if (enemy.dead) return;

      const healthRatio = enemy.salud / enemy.saludMax;
      Renderer.drawBar(ctx, enemy.x - enemy.size / 2, enemy.y - enemy.size / 2 - 10, enemy.size, 4,
        COLORS.HEALTH_BAR, COLORS.HEALTH_BG, healthRatio);

      Renderer.drawEnemy(ctx, enemy.x, enemy.y, enemy.size, enemy.color, enemy.type);

      if (enemy.state === 'stunned') {
        Renderer.drawTextCentered(ctx, '✦', enemy.x, enemy.y - enemy.size / 2 - 15, COLORS.TEXT_GOLD, 12);
      }

      if (enemy.boss) {
        const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255,68,68,${pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    const playerDrawX = this.player.x;
    const playerDrawY = this.player.y;

    if (this.player.invulnerableTimer > 0) {
      const flicker = Math.sin(Date.now() / 50) > 0;
      if (!flicker) {
        Renderer.drawPlayer(ctx, playerDrawX, playerDrawY, this.player.size, COLORS.PLAYER, this.player.facingRight);
      }
    } else if (this.player.state === 'blocking') {
      Renderer.drawPlayer(ctx, playerDrawX, playerDrawY, this.player.size, COLORS.PLAYER_SHIELD, this.player.facingRight);
      ctx.strokeStyle = '#aaccff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(playerDrawX, playerDrawY, this.player.size * 0.8, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
    } else {
      Renderer.drawPlayer(ctx, playerDrawX, playerDrawY, this.player.size, COLORS.PLAYER, this.player.facingRight);
    }

    if (this.player.state === 'attacking') {
      const swordLength = 25;
      const angle = this.player.facingRight ? 0 : Math.PI;
      const sx = playerDrawX + Math.cos(angle) * 10;
      const sy = playerDrawY - 5;
      const ex = sx + Math.cos(angle) * swordLength;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, sy);
      ctx.stroke();
    }

    ctx.restore();

    HUD.render(ctx, this.game, this.player, this.stats, this.enemies.length, this.killCount);

    this.damageNumbers.forEach(d => {
      ctx.globalAlpha = Math.min(1, d.life);
      Renderer.drawTextCentered(ctx, d.text, d.x - this.cameraX, d.y - this.cameraY, d.color, 14);
      ctx.globalAlpha = 1;
    });

    if (this.waveCleared && this.victoryTimer > 0) {
      ctx.fillStyle = COLORS.NOTIFICATION_BG;
      ctx.fillRect(GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 40, 360, 80);
      ctx.strokeStyle = COLORS.TEXT_GOLD;
      ctx.lineWidth = 1;
      ctx.strokeRect(GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 40, 360, 80);

      Renderer.drawTextCentered(ctx, 'VICTORIA', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15, COLORS.TEXT_GOLD, 22);
      Renderer.drawTextCentered(ctx, `+${this.xpGained} XP  +${this.cobreGained} Cobres  ${this.killCount} bajas`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, COLORS.TEXT_WHITE, 12);
    }
  }

  destroy() {
    this.audio.stopMusic();
  }
}

export default CombatScene;
