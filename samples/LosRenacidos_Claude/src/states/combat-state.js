import { COLORS, CANVAS, ROOM, PLAYER, SKILL_XP_CURVE } from '../constants.js';
import { ENEMIES } from '../data/enemies.js';
import { Enemy } from '../entities/enemy.js';
import { Room } from '../world/room.js';
import { RunState } from './run-state.js';
import { VictoryState } from './victory-state.js';
import { GameOverState } from './gameover-state.js';

export class CombatState {
  constructor(ctx, params = {}) {
    this.roomKey = params.roomKey;
    this.node = params.node;
  }

  enter(ctx) {
    this.room = new Room(this.roomKey);
    this.enemies = this.room.spawns.map(s => this._spawn(ctx, s.type, s.x, s.y));
    this.particlesBound = ctx.particles;
    ctx.player.x = 60;
    ctx.player.y = ROOM.height / 2;
    ctx.player.facing = { x: 1, y: 0 };
    ctx.player.attackPhase = 'idle';
    ctx.player.attackTimer = 0;
    ctx.player.dashTimer = 0;
    ctx.player.blocking = false;
    this.banner = 1.6;
    this.canExit = false;
    this.exitDelay = 0;
    this.timeInRoom = 0;
    this.herbsThisRoom = this.room.herbDrops || 0;
    this.bossAura = 0;
    this.cobreGained = 0;
    if (this.room.isBossRoom) {
      ctx.audio.play('boss-roar');
      ctx.notifications.push(`${this.enemies[0]?.name || 'Algo'} aparece.`, 'alert', 3);
    } else {
      ctx.audio.play('enter-room');
      ctx.notifications.push(this.room.name + ' — ' + (this.room.flavor || ''), 'gain', 3);
    }
  }

  exit() {}

  _spawn(ctx, type, x, y) {
    const tpl = ENEMIES[type];
    if (!tpl) return null;
    const e = new Enemy(tpl, x, y);
    // wire audio + notifications for damage feedback
    e._audio = ctx.audio;
    e._notifications = ctx.notifications;
    return e;
  }

  _spawnEnemy(ctx, type, x, y) {
    const e = this._spawn(ctx, type, x, y);
    if (e) this.enemies.push(e);
  }

  update(dt, ctx) {
    this.banner = Math.max(0, this.banner - dt);
    this.bossAura = (this.bossAura + dt) % (Math.PI * 2);
    this.timeInRoom += dt;
    ctx.notifications.update(dt);
    ctx.particles.update(dt);

    // Player input → attack/dodge/block/meditate
    const player = ctx.player;
    if (ctx.input.consumeAction('attack')) {
      if (player.startAttack(ctx.audio, ctx.notifications)) ctx.audio.play('swing');
    }
    if (ctx.input.consumeAction('dodge')) {
      player.startDodge(ctx.audio);
    }
    if (ctx.input.consumeAction('meditate')) {
      this._meditate(ctx);
    }
    if (ctx.input.consumeAction('archive')) {
      import('./archive-state.js').then(mod => ctx.switchState(mod.ArchiveState, { from: 'combat', restoreRun: true }));
      return;
    }
    if (ctx.input.consumeAction('cancel')) {
      // abandon back to map (only if cleared)
      if (this.canExit) ctx.switchState(RunState, {});
      return;
    }
    player.setBlocking(ctx.input.isHeld('block'));

    const move = ctx.input.moveAxes();
    player.update(dt, this.room, move);

    // Hit detection: active attack vs enemies
    if (player.isAttackActive()) {
      for (const e of this.enemies) {
        if (e.dead) continue;
        if (player.attackHits.has(e)) continue;
        if (!player.hitInArc(e)) continue;
        player.attackHits.add(e);
        const { dmg, crit } = player.computeAttackDamage();
        const killed = e.takeDamage(dmg, ctx.audio);
        if (crit) {
          player.gainSkillXp('anatomia', 2);
          ctx.particles.spawn({ x: ROOM.originX + e.x, y: ROOM.originY + e.y, count: 8, color: COLORS.gold, speed: 130, life: 0.6 });
          ctx.audio.play('crit');
          ctx.notifications.push(`Crítico — ${e.name} ${dmg}.`, 'gain', 2);
        } else {
          ctx.particles.spawn({ x: ROOM.originX + e.x, y: ROOM.originY + e.y, count: 4, color: COLORS.danger, speed: 80, life: 0.35 });
          ctx.audio.play('hit');
        }
        player.gainSkillXp('esgrima', 1);
        if (killed) this._onEnemyDead(ctx, e);
      }
    }

    // Update enemies
    for (const e of this.enemies) {
      if (e.dead) continue;
      e.update(dt, this.room, player, (type, x, y) => this._spawnEnemy(ctx, type, x, y));
    }

    // Cleared?
    const allDead = this.enemies.every(e => e.dead);
    if (allDead && !this.canExit) {
      this.canExit = true;
      this.exitDelay = 0.6;
      player.gainSkillXp('supervivencia', 2);
      if (this.room.isBossRoom) {
        const save = ctx.storage.load();
        save.ecos.jabaliAlfaSlain = true;
        if (this.timeInRoom < 60) {
          save.unlocks.saludExtra = Math.min(15, (save.unlocks.saludExtra || 0) + 5);
        }
        save.fama = (save.fama || 0) + 10;
        save.inventory.cobre = (save.inventory.cobre || 0) + this.cobreGained;
        ctx.storage.save();
        ctx.audio.play('eco');
        ctx.runMap = null;
        ctx.switchState(VictoryState, { node: this.node, cobreGained: this.cobreGained });
        return;
      } else {
        const save = ctx.storage.load();
        save.inventory.cobre = (save.inventory.cobre || 0) + this.cobreGained;
        ctx.storage.save();
        if (this.herbsThisRoom > 0 && ctx.quest && ctx.quest.active === 'hierbas') {
          ctx.quest.progress = Math.min(ctx.quest.goal, ctx.quest.progress + this.herbsThisRoom);
          ctx.notifications.push(`Moonstalks recolectadas (${ctx.quest.progress}/${ctx.quest.goal}).`, 'quest', 4);
        }
        ctx.notifications.push('Sala despejada. Pulsa E o avanza al norte.', 'gain', 4);
      }
    }
    if (this.canExit) {
      this.exitDelay = Math.max(0, this.exitDelay - dt);
      if (this.exitDelay <= 0) {
        if (ctx.player.y < 30 || ctx.input.consumeAction('interact')) {
          ctx.switchState(RunState, {});
          return;
        }
        // Clear leftover confirm event so it doesn't trigger an unwanted action elsewhere
        ctx.input.consumeAction('confirm');
      }
    }

    // Player death
    if (player.salud <= 0) {
      ctx.audio.play('death');
      ctx.runMap = null;
      ctx.switchState(GameOverState, { reason: 'killed' });
      return;
    }
  }

  _meditate(ctx) {
    if (ctx.player.attackPhase !== 'idle' || ctx.player.dashTimer > 0) return;
    if (!this.enemies.every(e => e.dead)) {
      ctx.notifications.push('No puedes meditar con enemigos cerca.', 'warn');
      return;
    }
    ctx.player.salud = Math.min(ctx.player.saludMax, ctx.player.salud + 6);
    ctx.player.resistencia = Math.min(ctx.player.resistenciaMax, ctx.player.resistencia + 25);
    ctx.player.mana = Math.min(ctx.player.manaMax, ctx.player.mana + 4);
    ctx.player.gainSkillXp('meditacion', 3);
    ctx.audio.play('meditate');
    ctx.notifications.push('Meditación: +6 PV, +25 Resistencia.', 'gain');
  }

  _onEnemyDead(ctx, e) {
    ctx.particles.spawn({ x: ROOM.originX + e.x, y: ROOM.originY + e.y, count: 14, color: COLORS.danger, speed: 130, life: 0.7 });
    if (e.template.xpReward) {
      // Distribute to esgrima as practice and supervivencia
      ctx.player.gainSkillXp('esgrima', Math.ceil(e.template.xpReward / 2));
      ctx.player.gainSkillXp('supervivencia', 1);
    }
    const cobreDrop = e.template.isBoss ? 30 : (e.template.xpReward >= 5 ? 4 : 2);
    this.cobreGained += cobreDrop;
    ctx.player.cobre += cobreDrop;
    if (e.template.isBoss) {
      ctx.audio.play('boss-die');
      ctx.notifications.push(`${e.name} cae. ECO REGISTRADO.`, 'archive', 5);
    } else {
      ctx.notifications.push(`${e.name} cae. +${cobreDrop} cobre.`, 'gain', 2);
    }
    // Apply quest progress if the room had herb drops
    if (this.herbsThisRoom > 0 && ctx.quest && ctx.quest.active === 'hierbas' && ctx.quest.progress < ctx.quest.goal) {
      ctx.quest.progress = Math.min(ctx.quest.goal, ctx.quest.progress + 1);
      this.herbsThisRoom -= 1;
      ctx.notifications.push(`Moonstalk recolectada (${ctx.quest.progress}/${ctx.quest.goal}).`, 'quest');
    }
  }

  render(r, ctx) {
    r.clear();
    r.drawRoom(this.room.walls, 'frontera');

    // Exit cue (north) once cleared
    if (this.canExit) {
      const c = r.ctx;
      c.save();
      c.translate(ROOM.originX, ROOM.originY);
      c.fillStyle = COLORS.gold;
      c.globalAlpha = 0.20 + 0.10 * Math.sin(this.bossAura * 4);
      c.fillRect(ROOM.width / 2 - 30, 0, 60, 30);
      c.globalAlpha = 1;
      r.drawText('⇧ Avanzar', ROOM.width / 2, 14, { size: 11, color: COLORS.gold, align: 'center' });
      c.restore();
    }

    // boss aura
    const boss = this.enemies.find(e => e.isBoss && !e.dead);
    if (boss) {
      const c = r.ctx;
      c.save();
      c.translate(ROOM.originX, ROOM.originY);
      c.fillStyle = COLORS.corruption;
      c.globalAlpha = 0.12 + 0.06 * Math.sin(this.bossAura * 2);
      c.beginPath();
      c.arc(boss.x, boss.y, boss.radius + 18, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
      c.restore();
    }

    // shadows + enemies
    for (const e of this.enemies) {
      if (e.dead) continue;
      r.drawShadow(e.x, e.y, e.radius);
    }
    for (const e of this.enemies) {
      if (e.dead) continue;
      r.drawEnemySprite(e);
      r.drawEnemyHpBar(e);
    }

    // player shadow + sprite
    r.drawShadow(ctx.player.x, ctx.player.y, ctx.player.radius);

    // attack arc (if active)
    if (ctx.player.attackPhase === 'active') {
      r.drawSwordArc(ctx.player.x, ctx.player.y, ctx.player.facing, ctx.player.attackProgress(), PLAYER.attackRange, PLAYER.attackArc, COLORS.gold);
    }
    if (ctx.player.blocking) {
      r.drawBlockShield(ctx.player.x, ctx.player.y, ctx.player.facing, ctx.player.parryWindow > 0 ? COLORS.parry : COLORS.blockShield);
    }
    r.drawPlayerSprite(ctx.player);

    // Particles on screen-space (already offset by states when spawned with ROOM origin)
    ctx.particles.render(r.ctx);

    // HUD
    r.drawHud(ctx.player, ctx.archive || ctx.storage.load());
    r.drawNotifications(ctx.notifications);

    if (this.banner > 0) {
      r.ctx.globalAlpha = Math.min(1, this.banner);
      r.drawText(this.room.name, CANVAS.width / 2, 44, { size: 22, color: COLORS.gold, align: 'center', weight: 'bold' });
      r.drawText(this.room.flavor || '', CANVAS.width / 2, 72, { size: 11, color: COLORS.fg, align: 'center' });
      r.ctx.globalAlpha = 1;
    }

    // quest tracker
    if (ctx.quest && ctx.quest.active) {
      r.drawText(`Misión: ${ctx.quest.progress}/${ctx.quest.goal} Moonstalks`, 280, 14, { size: 11, color: COLORS.azure });
    }

    r.drawControlBar(['WASD mover', 'J atacar', 'L bloquear', 'Shift esquiva', 'M meditar', this.canExit ? 'E avanzar' : 'I Archivo']);
  }
}
