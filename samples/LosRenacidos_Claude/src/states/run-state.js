import { COLORS, CANVAS, ROOM } from '../constants.js';
import { NODE_TYPES } from '../data/rooms.js';
import { generateRunMap, neighbors } from '../world/map-gen.js';
import { CombatState } from './combat-state.js';
import { HubState } from './hub-state.js';

export class RunState {
  constructor(ctx, params = {}) {
    this.params = params;
  }

  enter(ctx) {
    if (!ctx.runMap) {
      ctx.runMap = generateRunMap();
      ctx.notifications.push('Una fisura de Talasaria se abre. La incursión comienza.', 'archive', 4);
      ctx.audio.play('enter-room');
    }
    this._refreshOptions(ctx);
  }
  exit() {}

  _refreshOptions(ctx) {
    const cur = ctx.runMap.nodes.find(n => n.id === ctx.runMap.currentId);
    this.options = neighbors(ctx.runMap, cur.id);
    this.selectedIndex = 0;
    this.moveCooldown = 0;
  }

  update(dt, ctx) {
    ctx.notifications.update(dt);
    ctx.particles.update(dt);
    this.moveCooldown = Math.max(0, this.moveCooldown - dt);

    if (ctx.input.consumeAction('cancel')) {
      ctx.runMap = null;
      ctx.switchState(HubState, {});
      return;
    }
    if (ctx.input.consumeAction('archive')) {
      import('./archive-state.js').then(mod => ctx.switchState(mod.ArchiveState, { from: 'run', restoreRun: true }));
      return;
    }

    for (let i = 0; i < this.options.length; i++) {
      if (ctx.input.consumeAction(`choose-${i + 1}`)) {
        this.selectedIndex = i;
        this._enterNode(ctx, this.options[i]);
        return;
      }
    }
    if (this.moveCooldown <= 0) {
      const move = ctx.input.moveAxes();
      if (move.dy < 0) { this.selectedIndex = Math.max(0, this.selectedIndex - 1); this.moveCooldown = 0.18; ctx.audio.play('menu-select'); }
      else if (move.dy > 0) { this.selectedIndex = Math.min(this.options.length - 1, this.selectedIndex + 1); this.moveCooldown = 0.18; ctx.audio.play('menu-select'); }
    }
    if (ctx.input.consumeAction('confirm') || ctx.input.consumeAction('interact')) {
      this._enterNode(ctx, this.options[this.selectedIndex]);
    }
  }

  _enterNode(ctx, node) {
    if (!node) return;
    ctx.audio.play('enter-room');
    ctx.runMap.clearedIds.add(ctx.runMap.currentId);
    ctx.runMap.currentId = node.id;
    ctx.switchState(CombatState, { roomKey: node.room, node });
  }

  render(r, ctx) {
    r.clear();
    const w = CANVAS.width, h = CANVAS.height;
    r.drawText('Mapa de la Incursión', w / 2, 24, { size: 22, color: COLORS.gold, align: 'center', weight: 'bold' });
    r.drawText('Cada nodo es un eco del bosque. Elige tu próxima sala.', w / 2, 54, { size: 11, color: COLORS.fg, align: 'center' });

    const c = r.ctx;
    const map = ctx.runMap;
    const offX = 60, offY = 110;

    // edges
    c.lineWidth = 2;
    for (const [a, b] of map.edges) {
      const na = map.nodes.find(n => n.id === a);
      const nb = map.nodes.find(n => n.id === b);
      const cleared = map.clearedIds.has(a);
      c.strokeStyle = cleared || map.currentId === a ? COLORS.gold : '#2c4663';
      c.beginPath();
      c.moveTo(na.x + offX, na.y + offY);
      c.lineTo(nb.x + offX, nb.y + offY);
      c.stroke();
    }

    for (const n of map.nodes) {
      const meta = NODE_TYPES[n.type] || NODE_TYPES.combat;
      const isCleared = map.clearedIds.has(n.id);
      const isCurrent = n.id === map.currentId;
      const isOption = this.options.some(o => o && o.id === n.id);
      const optionIndex = this.options.findIndex(o => o && o.id === n.id);
      const baseColor = isCleared ? '#3a4a5a'
        : n.type === 'boss' ? COLORS.danger
        : n.type === 'elite' ? COLORS.gold
        : n.type === 'rest' ? COLORS.corruption
        : n.type === 'event' ? COLORS.azure
        : COLORS.npcAccent;
      const x = n.x + offX, y = n.y + offY;
      if (isOption) {
        const isSelected = optionIndex === this.selectedIndex;
        c.fillStyle = isSelected ? 'rgba(245,198,107,0.45)' : 'rgba(245,198,107,0.15)';
        c.beginPath(); c.arc(x, y, isSelected ? 30 : 24, 0, Math.PI * 2); c.fill();
      }
      c.fillStyle = baseColor;
      c.beginPath();
      c.arc(x, y, isCurrent ? 16 : 14, 0, Math.PI * 2);
      c.fill();
      if (isCurrent) { c.strokeStyle = COLORS.gold; c.lineWidth = 3; c.stroke(); }
      r.drawText(meta.icon, x, y, { size: 14, color: '#0a0f17', align: 'center', baseline: 'middle', weight: 'bold' });
      r.drawText(meta.label, x, y + 22, { size: 10, color: COLORS.fg, align: 'center' });
    }

    // options panel
    c.fillStyle = COLORS.dialog;
    c.fillRect(w / 2 - 220, h - 156, 440, 130);
    c.strokeStyle = COLORS.dialogBorder;
    c.lineWidth = 1;
    c.globalAlpha = 0.7;
    c.strokeRect(w / 2 - 219.5, h - 155.5, 439, 129);
    c.globalAlpha = 1;
    r.drawText('Rutas disponibles', w / 2, h - 148, { size: 13, color: COLORS.gold, align: 'center', weight: 'bold' });

    if (this.options.length === 0) {
      r.drawText('Has alcanzado el final del eco.', w / 2, h - 112, { size: 12, color: COLORS.fg, align: 'center' });
    }
    for (let i = 0; i < this.options.length; i++) {
      const o = this.options[i];
      const meta = NODE_TYPES[o.type] || NODE_TYPES.combat;
      const selected = i === this.selectedIndex;
      r.drawText(`${i + 1}.  ${meta.label}`, w / 2 - 200, h - 112 + i * 22, { size: 13, color: selected ? COLORS.gold : COLORS.fg, weight: selected ? 'bold' : 'normal' });
    }
    r.drawText('ESC abandonar · I Archivo', w / 2 + 200, h - 34, { size: 10, color: COLORS.fg, align: 'right' });

    r.drawHud(ctx.player, ctx.archive || ctx.storage.load());
    r.drawNotifications(ctx.notifications);
  }
}
