import { GAME_WIDTH, GAME_HEIGHT, COLORS, SKILLS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';

const HUD = {
  render(ctx, game, player, stats, enemyCount, killCount) {
    this._renderHealthBar(ctx, stats);
    this._renderStaminaBar(ctx, stats);
    this._renderResources(ctx, stats, game);
    this._renderWeaponInfo(ctx, game.inventorySystem);
    this._renderSkills(ctx, stats);
    this._renderNotifications(ctx, game);
    this._renderEnemyCounter(ctx, enemyCount, killCount);
  },

  _renderHealthBar(ctx, stats) {
    const barX = 15;
    const barY = 15;
    const barW = 200;
    const barH = 16;
    const ratio = stats.resources.salud / stats.resources.saludMax;

    Renderer.drawBar(ctx, barX, barY, barW, barH, COLORS.HEALTH_BAR, COLORS.HEALTH_BG, ratio);
    Renderer.drawText(ctx, `Salud ${Math.round(stats.resources.salud)}/${stats.resources.saludMax}`,
      barX + 5, barY + barH / 2, '#ffffff', 10);
  },

  _renderStaminaBar(ctx, stats) {
    const barX = 15;
    const barY = 35;
    const barW = 150;
    const barH = 10;
    const ratio = stats.resources.resistencia / stats.resources.resistenciaMax;

    Renderer.drawBar(ctx, barX, barY, barW, barH, COLORS.STAMINA_BAR, COLORS.STAMINA_BG, ratio);
    Renderer.drawText(ctx, `Resistencia ${Math.round(stats.resources.resistencia)}`,
      barX + 5, barY + barH / 2, '#ddccaa', 9);
  },

  _renderResources(ctx, stats, game) {
    const x = 15;
    let y = 55;

    Renderer.drawText(ctx, `FUE:${stats.stats.fuerza}  DES:${stats.stats.destreza}  INT:${stats.stats.inteligencia}`,
      x, y, COLORS.TEXT_DIM, 9);
    y += 14;
    Renderer.drawText(ctx, `Fama:${stats.stats.fama}  Monedas: ${game.inventorySystem.coins.cobre}C`,
      x, y, COLORS.TEXT_DIM, 9);

    if (stats.resources.corrupcion > 0) {
      y += 14;
      Renderer.drawText(ctx, `Corrupcion: ${Math.round(stats.resources.corrupcion)}%`,
        x, y, COLORS.CORRUPTION, 9);
    }
  },

  _renderWeaponInfo(ctx, inventory) {
    const x = GAME_WIDTH - 160;
    const y = 15;

    const weapon = inventory.equipment.weapon;
    if (weapon) {
      Renderer.drawText(ctx, weapon.name, x, y, COLORS.TEXT_GOLD, 11, 'right');
      Renderer.drawText(ctx, `Daño: ${weapon.daño} (${weapon.tipoDaño})`, x, y + 15, COLORS.TEXT_WHITE, 9, 'right');
    }

    const shield = inventory.equipment.shield;
    if (shield) {
      Renderer.drawText(ctx, `${shield.name} Def:${shield.defensa}`, x, y + 28, COLORS.TEXT_BLUE, 9, 'right');
    }
  },

  _renderSkills(ctx, stats) {
    const x = GAME_WIDTH - 160;
    const y = 70;

    Renderer.drawText(ctx, 'HABILIDADES', x, y, COLORS.TEXT_GOLD, 9, 'right');

    const combatSkills = SKILLS.slice(0, 6);
    combatSkills.forEach((sk, i) => {
      const lvl = stats.getSkillLevel(sk.id);
      if (lvl > 0) {
        Renderer.drawText(ctx, `${sk.name}: ${lvl}`, x, y + 14 + i * 13, COLORS.TEXT_GREEN, 9, 'right');
      }
    });
  },

  _renderNotifications(ctx, game) {
    const { notifications } = game;
    if (!notifications || notifications.length === 0) return;

    const shown = notifications.slice(-3);
    shown.forEach((n, i) => {
      const y = GAME_HEIGHT - 50 - i * 22;
      const alpha = Math.min(1, (notifications.length - (notifications.indexOf(n))) * 0.5);

      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = COLORS.NOTIFICATION_BG;
      const textWidth = n.length * 6 + 20;
      ctx.fillRect(GAME_WIDTH / 2 - textWidth / 2, y - 8, textWidth, 20);

      ctx.fillStyle = COLORS.TEXT_BLUE;
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(n, GAME_WIDTH / 2, y + 3);
      ctx.globalAlpha = 1;
    });
  },

  _renderEnemyCounter(ctx, enemyCount, killCount) {
    if (enemyCount > 0) {
      Renderer.drawText(ctx, `Enemigos: ${enemyCount}  |  Bajas: ${killCount}`,
        15, GAME_HEIGHT - 20, COLORS.TEXT_DIM, 9);
    }
  },
};

export default HUD;
