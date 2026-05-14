import { GAME_WIDTH, GAME_HEIGHT, COLORS, TILE_SIZE } from './utils/Constants.js';

const Renderer = {
  drawRect(ctx, x, y, w, h, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
  },

  drawCircle(ctx, x, y, r, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
  },

  drawText(ctx, text, x, y, color, size = 14, align = 'left', font = 'monospace') {
    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  },

  drawTextCentered(ctx, text, x, y, color, size = 14) {
    this.drawText(ctx, text, x, y, color, size, 'center');
  },

  drawBar(ctx, x, y, w, h, fillColor, bgColor, ratio) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);
    if (ratio > 0) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w * Math.min(ratio, 1), h);
    }
    ctx.strokeStyle = '#333344';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  },

  drawPlayer(ctx, x, y, size, color, facingRight) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    ctx.fillStyle = '#222222';
    ctx.fillRect(-size / 2, -size / 2 - 3, size, 3);

    if (facingRight) {
      const swordX = size / 2;
      const swordY = -size / 4;
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(swordX, swordY, size * 0.6, 3);
      ctx.fillStyle = '#886622';
      ctx.fillRect(swordX - 2, swordY - 2, 4, 7);
    }

    ctx.restore();
  },

  drawEnemy(ctx, x, y, size, color, enemyType) {
    ctx.save();
    ctx.translate(x, y);

    if (enemyType === 'jabali_maldito' || enemyType === 'jabali_alfa') {
      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size * 0.8);
      ctx.fillStyle = '#331100';
      ctx.fillRect(size * 0.2, -size / 2 - 4, 6, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size * 0.2 + 2, -size / 2 - 3, 2, 2);
    } else if (enemyType === 'conejo_maldito') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 2, size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffcccc';
      ctx.beginPath();
      ctx.ellipse(-size * 0.2, -size * 0.15, 3, 6, -0.3, 0, Math.PI * 2);
      ctx.ellipse(size * 0.2, -size * 0.15, 3, 6, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemyType === 'goblin' || enemyType === 'goblin_arquero') {
      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.fillStyle = '#335522';
      ctx.fillRect(-size / 2, -size / 2, size, 4);
      if (enemyType === 'goblin_arquero') {
        ctx.fillStyle = '#886622';
        ctx.fillRect(size / 2 - 2, -size / 3, size * 0.7, 2);
      }
    } else if (enemyType === 'bandido' || enemyType === 'capita_bandido') {
      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.fillStyle = '#772222';
      ctx.fillRect(-size / 2, -size / 2, size, 4);
      if (enemyType === 'capita_bandido') {
        ctx.fillStyle = '#ccaa44';
        ctx.fillRect(size / 4, -size / 2 - 3, size * 0.4, 3);
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(-size / 2, -size / 2, size, size);
    }

    ctx.restore();
  },

  drawNPC(ctx, x, y, size, color, name) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-size / 2, -size / 2 - 3, size, 3);

    Renderer.drawTextCentered(ctx, name.substring(0, 2), 0, size + 12, COLORS.TEXT_GOLD, 10);
    Renderer.drawCircle(ctx, 0, -size / 2 - 3, 3, '#44cc44');

    ctx.restore();
  },

  drawProjectile(ctx, x, y, r, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};

export default Renderer;
