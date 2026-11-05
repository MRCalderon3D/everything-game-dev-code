import { COLORS, ROOM, CANVAS } from '../constants.js';
import { NPCS } from '../data/npcs.js';
import { Npc } from '../entities/npc.js';
import { Player } from '../entities/player.js';
import { DialogState } from './dialog-state.js';
import { RunState } from './run-state.js';
import { ArchiveState } from './archive-state.js';
import { MenuState } from './menu-state.js';

export class HubState {
  constructor(_, params = {}) {
    this.params = params;
  }

  enter(ctx) {
    this.npcs = NPCS.map(d => new Npc(d));
    if (!ctx.player || this.params.fresh) {
      ctx.player = new Player(ctx.save);
    }
    ctx.player.x = 480;
    ctx.player.y = 360;
    ctx.player.facing = { x: 0, y: -1 };
    ctx.player.attackPhase = 'idle';
    ctx.player.attackTimer = 0;
    ctx.player.dashTimer = 0;
    ctx.player.invuln = 0;
    ctx.player.setBlocking(false);
    ctx.player.salud = Math.max(ctx.player.salud, Math.floor(ctx.player.saludMax * 0.6));
    ctx.player.resistencia = ctx.player.resistenciaMax;
    if (!this.params.silent) {
      ctx.notifications.push('Minoc te recibe. Habla con sus gentes antes de partir.', 'gain', 4);
    }
    this.exitNear = false;
    this.nearestNpc = null;
  }
  exit() {}

  update(dt, ctx) {
    ctx.notifications.update(dt);
    ctx.particles.update(dt);

    if (ctx.input.consumeAction('cancel')) {
      ctx.switchState(MenuState, {});
      return;
    }
    if (ctx.input.consumeAction('archive')) {
      ctx.audio.play('menu-select');
      ctx.switchState(ArchiveState, { returnTo: HubState });
      return;
    }

    const axes = ctx.input.moveAxes();
    ctx.player.update(dt, { walls: [] }, { dx: axes.dx, dy: axes.dy });
    ctx.player.x = Math.max(20, Math.min(ROOM.width - 20, ctx.player.x));
    ctx.player.y = Math.max(20, Math.min(ROOM.height - 20, ctx.player.y));

    this.nearestNpc = null;
    let bestDist = Infinity;
    for (const n of this.npcs) {
      const d = Math.hypot(n.x - ctx.player.x, n.y - ctx.player.y);
      if (d < 50 && d < bestDist) {
        bestDist = d;
        this.nearestNpc = n;
      }
    }
    this.exitNear = (ctx.player.x > ROOM.width - 60 && ctx.player.y > 240 && ctx.player.y < 380);

    if (ctx.input.consumeAction('interact') || ctx.input.consumeAction('confirm')) {
      if (this.exitNear) {
        ctx.audio.play('enter-room');
        ctx.runMap = null;
        ctx.save.runs = (ctx.save.runs || 0) + 1;
        ctx.storage.save();
        ctx.switchState(RunState, {});
        return;
      }
      if (this.nearestNpc) this._talkTo(ctx, this.nearestNpc);
    }
  }

  _talkTo(ctx, npc) {
    const data = npc.data;
    const save = ctx.save;
    const quest = ctx.quest;

    let lines = data.introLines.slice();
    let options = null;

    const close = () => {};

    if (data.role === 'quest' && data.quest) {
      if (!quest.active && !save.ecos[data.quest.reward.eco]) {
        options = [
          { label: `Aceptar "${data.quest.title}"`, action: (c) => {
            c.quest.active = data.quest.id;
            c.quest.progress = 0;
            c.quest.goal = data.quest.goal;
            c.quest.reward = data.quest.reward;
            c.audio.play('menu-confirm');
            c.notifications.push(`Misión aceptada: ${data.quest.title}.`, 'quest', 4);
          }},
          { label: 'Más tarde.', action: close },
        ];
      } else if (quest.active === data.quest.id) {
        if (quest.progress >= quest.goal) {
          lines = data.onComplete;
          options = [
            { label: 'Reclamar recompensa', action: (c) => {
              c.player.cobre += quest.reward.cobre || 0;
              c.player.stats.fama += quest.reward.fama || 0;
              save.fama = (save.fama || 0) + (quest.reward.fama || 0);
              save.inventory.cobre = c.player.cobre;
              if (quest.reward.eco) save.ecos[quest.reward.eco] = true;
              save.ecos.hierbasTotales = (save.ecos.hierbasTotales || 0) + quest.goal;
              c.storage.save();
              c.archive.ecos = save.ecos;
              c.archive.fama = save.fama;
              c.quest.active = null;
              c.quest.progress = 0;
              c.notifications.push(`Recompensa: +${quest.reward.cobre || 0} cobre, +${quest.reward.fama || 0} fama.`, 'archive', 4);
              c.audio.play('eco');
            }},
          ];
        } else {
          lines = [...data.afterAccept, `Llevas ${quest.progress}/${quest.goal} Moonstalks.`];
        }
      } else if (save.ecos[data.quest.reward.eco]) {
        lines = ['Has hecho mucho por Minoc. El alfa sigue ahí fuera. Acaba con él.'];
      }
    } else if (data.role === 'shop' && data.shop) {
      const id = data.shop.grant.upgrade;
      if (id && save.unlocks[id]) {
        lines = data.afterShop;
      } else {
        const canPay = ctx.player.cobre >= data.shop.cost;
        options = [
          { label: canPay
              ? `Comprar ${data.shop.label} (${data.shop.cost} cobre)`
              : `Sin cobre suficiente (${data.shop.cost})`,
            action: (c) => {
              if (!canPay) return;
              c.player.cobre -= data.shop.cost;
              save.inventory.cobre = c.player.cobre;
              if (data.shop.grant.upgrade) {
                save.unlocks[data.shop.grant.upgrade] = true;
                c.player.weaponDmg += 2;
                c.notifications.push(`${data.shop.label} adquirido.`, 'gain', 3);
              } else if (data.shop.grant.consume === 'pocion') {
                c.player.pociones += 1;
                save.inventory.pociones = c.player.pociones;
                c.notifications.push('Poción añadida (auto-usa al caer PV).', 'gain', 4);
              }
              c.storage.save();
              c.audio.play('pickup');
            }},
          { label: 'No, gracias.', action: close },
        ];
      }
    } else if (data.role === 'rest' && data.shop) {
      const canPay = ctx.player.cobre >= data.shop.cost;
      options = [
        { label: canPay
            ? `${data.shop.label} (${data.shop.cost} cobre)`
            : `Sin cobre suficiente (${data.shop.cost})`,
          action: (c) => {
            if (!canPay) return;
            c.player.cobre -= data.shop.cost;
            save.inventory.cobre = c.player.cobre;
            c.player.salud = c.player.saludMax;
            c.player.resistencia = c.player.resistenciaMax;
            c.player.mana = c.player.manaMax;
            c.player.gainSkillXp('meditacion', 2);
            c.audio.play('meditate');
            c.notifications.push('Recuperación total tras descanso.', 'gain', 3);
            c.storage.save();
          }},
        { label: 'Solo charlar.', action: close },
      ];
    } else if (data.role === 'archive') {
      options = [
        { label: 'Consultar el Archivo de Ecos', action: (c) => {
          c.switchState(ArchiveState, { returnTo: HubState });
        }},
        { label: 'En otro momento.', action: close },
      ];
    }

    ctx.pushOverlay(DialogState, { speaker: data.name, lines, options });
  }

  _renderScene(r, ctx) {
    r.clear();
    const c = r.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.fillStyle = '#241914';
    c.fillRect(0, 0, ROOM.width, ROOM.height);
    c.fillStyle = '#1a1208';
    for (let y = 0; y < ROOM.height; y += 40) {
      for (let x = 0; x < ROOM.width; x += 40) {
        if (((x + y) >> 5) & 1) c.fillRect(x, y, 40, 40);
      }
    }
    // Exit door
    c.fillStyle = this.exitNear ? COLORS.gold : '#3a2a18';
    c.fillRect(ROOM.width - 36, 280, 28, 60);
    c.fillStyle = COLORS.fg;
    c.font = '10px Georgia, serif';
    c.textAlign = 'center';
    c.fillText('SALIDA', ROOM.width - 22, 274);
    c.fillText('A LA FRONTERA', ROOM.width - 22, 350);
    c.restore();

    for (const n of this.npcs) {
      r.drawShadow(n.x, n.y, n.radius);
      r.drawNpcSprite(n);
      r.drawText(n.name, n.x, n.y - 26, { size: 10, color: COLORS.fg, align: 'center' });
    }

    r.drawShadow(ctx.player.x, ctx.player.y, ctx.player.radius);
    r.drawPlayerSprite(ctx.player);

    r.drawHud(ctx.player, ctx.archive);
    r.drawNotifications(ctx.notifications);
  }

  render(r, ctx) {
    this._renderScene(r, ctx);

    const hintY = CANVAS.height - 40;
    if (this.nearestNpc) {
      r.drawText(`[E] Hablar con ${this.nearestNpc.name}`, CANVAS.width / 2, hintY, { size: 13, color: COLORS.azure, align: 'center' });
    } else if (this.exitNear) {
      r.drawText('[E] Salir a la incursión', CANVAS.width / 2, hintY, { size: 13, color: COLORS.gold, align: 'center' });
    } else {
      const questText = ctx.quest.active
        ? `Misión: ${ctx.quest.active === 'hierbas' ? 'Recolector de Hierbas' : ctx.quest.active} (${ctx.quest.progress}/${ctx.quest.goal})`
        : 'Sin misión activa';
      r.drawText(`Minoc · ${questText}`, CANVAS.width / 2, hintY, { size: 11, color: COLORS.fg, align: 'center' });
    }
    r.drawControlBar(['[WASD] Mover', '[E] Interactuar', '[I] Archivo', '[Esc] Menú']);
  }
}
