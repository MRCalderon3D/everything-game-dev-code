import { COLORS, ROOM, CANVAS } from '../constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    const c = this.ctx;
    c.fillStyle = COLORS.bg;
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawRoom(walls, biome = 'frontera') {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    const floorA = COLORS.floor;
    const floorB = COLORS.floorAlt;
    const tile = 30;
    for (let y = 0; y < ROOM.height; y += tile) {
      for (let x = 0; x < ROOM.width; x += tile) {
        c.fillStyle = ((x / tile + y / tile) & 1) ? floorA : floorB;
        c.fillRect(x, y, tile, tile);
      }
    }
    c.strokeStyle = COLORS.dialogBorder;
    c.lineWidth = 2;
    c.globalAlpha = 0.18;
    c.strokeRect(1, 1, ROOM.width - 2, ROOM.height - 2);
    c.globalAlpha = 1;

    c.fillStyle = COLORS.wall;
    for (const w of walls) c.fillRect(w.x, w.y, w.w, w.h);
    c.fillStyle = COLORS.wallHi;
    for (const w of walls) c.fillRect(w.x, w.y, w.w, 3);

    c.restore();
  }

  drawShadow(x, y, r) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.beginPath();
    c.ellipse(x, y + r * 0.85, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  drawDisk(x, y, r, fill, stroke = null) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.fillStyle = fill;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = 2;
      c.stroke();
    }
    c.restore();
  }

  drawSwordArc(x, y, facing, progress, range, arc, color) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.translate(x, y);
    c.rotate(Math.atan2(facing.y, facing.x));
    c.fillStyle = color;
    c.globalAlpha = 0.55 * (1 - Math.abs(progress - 0.5) * 2 + 0.4);
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, range, -arc / 2, arc / 2);
    c.closePath();
    c.fill();
    c.globalAlpha = 0.9;
    c.strokeStyle = COLORS.playerSword;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 0);
    c.arc(0, 0, range, -arc / 2, arc / 2);
    c.closePath();
    c.stroke();
    c.globalAlpha = 1;
    c.restore();
  }

  drawBlockShield(x, y, facing, color) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.translate(x, y);
    c.rotate(Math.atan2(facing.y, facing.x));
    c.fillStyle = color;
    c.globalAlpha = 0.30;
    c.beginPath();
    c.arc(0, 0, 26, -0.8, 0.8);
    c.lineTo(0, 0);
    c.closePath();
    c.fill();
    c.globalAlpha = 1;
    c.restore();
  }

  drawPlayerSprite(p) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.translate(p.x, p.y);
    if (p.invuln > 0 && Math.floor(p.invuln * 30) % 2 === 0) c.globalAlpha = 0.5;

    c.fillStyle = COLORS.playerArmor;
    c.fillRect(-p.radius * 0.9, -p.radius * 0.4, p.radius * 1.8, p.radius * 1.4);
    c.fillStyle = COLORS.player;
    c.beginPath();
    c.arc(0, -p.radius * 0.4, p.radius * 0.7, 0, Math.PI * 2);
    c.fill();
    // facing arrow
    const f = p.facing;
    c.fillStyle = COLORS.playerSword;
    c.beginPath();
    c.moveTo(f.x * (p.radius + 2), f.y * (p.radius + 2));
    c.lineTo(f.y * 4 + f.x * (p.radius - 2), -f.x * 4 + f.y * (p.radius - 2));
    c.lineTo(-f.y * 4 + f.x * (p.radius - 2), f.x * 4 + f.y * (p.radius - 2));
    c.closePath();
    c.fill();

    c.globalAlpha = 1;
    c.restore();
  }

  drawEnemySprite(e) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.translate(e.x, e.y);
    if (e.hitFlash > 0) c.globalAlpha = 0.7;
    c.fillStyle = e.color;
    c.beginPath();
    c.arc(0, 0, e.radius, 0, Math.PI * 2);
    c.fill();
    if (e.isBoss) {
      c.strokeStyle = COLORS.danger;
      c.lineWidth = 2;
      c.stroke();
    }
    // eyes
    c.fillStyle = '#0a0f17';
    const ex = 2.5, ey = -2;
    c.fillRect(-ex - 1, ey, 2, 2);
    c.fillRect(ex - 1, ey, 2, 2);
    if (e.windup > 0) {
      c.strokeStyle = COLORS.danger;
      c.lineWidth = 2;
      c.globalAlpha = 0.6;
      c.beginPath();
      c.arc(0, 0, e.radius + 4, 0, Math.PI * 2 * e.windupProgress);
      c.stroke();
      c.globalAlpha = 1;
    }
    c.globalAlpha = 1;
    c.restore();
  }

  drawNpcSprite(n) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    c.translate(n.x, n.y);
    c.fillStyle = n.color;
    c.fillRect(-7, -6, 14, 14);
    c.fillStyle = COLORS.fg;
    c.fillRect(-5, -12, 10, 8);
    c.restore();
  }

  drawHpBar(x, y, w, h, current, max, color) {
    const c = this.ctx;
    c.fillStyle = '#1a0e0e';
    c.fillRect(x, y, w, h);
    const pct = Math.max(0, current) / Math.max(1, max);
    c.fillStyle = color;
    c.fillRect(x, y, Math.floor(w * pct), h);
    c.strokeStyle = COLORS.fg;
    c.globalAlpha = 0.4;
    c.lineWidth = 1;
    c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    c.globalAlpha = 1;
  }

  drawEnemyHpBar(e) {
    const c = this.ctx;
    c.save();
    c.translate(ROOM.originX, ROOM.originY);
    const w = Math.max(20, e.radius * 2 + 6);
    const x = e.x - w / 2;
    const y = e.y - e.radius - 12;
    this.drawHpBar(x, y, w, 4, e.salud, e.saludMax, COLORS.hpFill);
    c.restore();
  }

  drawText(text, x, y, options = {}) {
    const c = this.ctx;
    const size = options.size || 14;
    const color = options.color || COLORS.fg;
    const align = options.align || 'left';
    const weight = options.weight || 'normal';
    c.fillStyle = color;
    c.font = `${weight} ${size}px Georgia, serif`;
    c.textAlign = align;
    c.textBaseline = options.baseline || 'top';
    c.fillText(text, x, y);
  }

  fillOverlay(alpha = 0.55) {
    const c = this.ctx;
    c.fillStyle = `rgba(0,0,0,${alpha})`;
    c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawHud(player, archive) {
    const c = this.ctx;
    // top-left status
    c.fillStyle = COLORS.dialog;
    c.fillRect(8, 8, 260, 78);
    c.strokeStyle = COLORS.dialogBorder;
    c.globalAlpha = 0.7;
    c.lineWidth = 1;
    c.strokeRect(8.5, 8.5, 259, 77);
    c.globalAlpha = 1;

    this.drawText('ERIK', 18, 14, { size: 12, color: COLORS.gold });
    this.drawText(`Fuerza ${player.stats.fuerza}  Destreza ${player.stats.destreza}  Inteligencia ${player.stats.inteligencia}`,
      18, 30, { size: 10, color: COLORS.fg });
    this.drawHpBar(18, 46, 240, 8, player.salud, player.saludMax, COLORS.hpFill);
    this.drawHpBar(18, 58, 240, 6, player.resistencia, player.resistenciaMax, COLORS.resFill);
    this.drawHpBar(18, 68, 240, 6, player.mana, player.manaMax, COLORS.manaFill);
    this.drawText(`PV ${Math.ceil(player.salud)}/${player.saludMax}`, 24, 46, { size: 9, color: COLORS.fg });

    // top-right gold/eco
    c.fillStyle = COLORS.dialog;
    c.fillRect(this.canvas.width - 188, 8, 180, 56);
    c.strokeStyle = COLORS.dialogBorder;
    c.globalAlpha = 0.7;
    c.strokeRect(this.canvas.width - 187.5, 8.5, 179, 55);
    c.globalAlpha = 1;
    this.drawText('SISTEMA', this.canvas.width - 178, 14, { size: 12, color: COLORS.gold });
    const cobre = (player && typeof player.cobre === 'number') ? player.cobre : ((archive.inventory && archive.inventory.cobre) || 0);
    this.drawText(`Cobre: ${cobre}`, this.canvas.width - 178, 30, { size: 11, color: COLORS.fg });
    const ecosUnlocked = Object.values(archive.ecos || {}).filter(v => v).length;
    this.drawText(`Ecos: ${ecosUnlocked}`, this.canvas.width - 178, 46, { size: 11, color: COLORS.azure });
    const fama = archive.fama || 0;
    this.drawText(`Fama: ${fama}`, this.canvas.width - 90, 30, { size: 10, color: COLORS.fg });
    const bossDone = archive.ecos && archive.ecos.jabaliAlfaSlain;
    this.drawText(`Alfa: ${bossDone ? '✓' : '—'}`, this.canvas.width - 90, 46, { size: 10, color: bossDone ? COLORS.gold : COLORS.fg });
  }

  drawNotifications(notes) {
    notes.render(this.ctx, this.canvas.width - 8, 90);
  }

  drawControlBar(lines) {
    const c = this.ctx;
    c.fillStyle = COLORS.dialog;
    c.globalAlpha = 0.6;
    c.fillRect(0, CANVAS.height - 22, this.canvas.width, 22);
    c.globalAlpha = 1;
    let x = 14;
    for (const line of lines) {
      this.drawText(line, x, CANVAS.height - 16, { size: 11, color: COLORS.fg });
      x += this.ctx.measureText(line).width + 24;
    }
  }
}
