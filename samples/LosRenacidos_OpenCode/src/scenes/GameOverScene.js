import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';

class GameOverScene {
  constructor(game) {
    this.game = game;
    this.timer = 0;
    this.buttons = [
      { text: 'VOLVER AL HUB', y: 320, action: 'hub' },
      { text: 'VOLVER AL MENU', y: 370, action: 'menu' },
    ];
  }

  init() {
    this.timer = 0;
    const stats = this.game.player.getRunStats();
    const purse = this.game.inventorySystem.coins;

    this.runSummary = {
      kills: stats.kills,
      damageDealt: stats.damageDealt,
      cobre: purse.cobre,
      skillsUsed: Object.entries(stats.skillsUsed).map(([k, v]) => `${k}: ${v.level}`),
    };

    this.game.progressionSystem.recordRunCompletion();
    const progData = this.game.progressionSystem.save();
    this.game.saveManager.save('metaProgression', progData);

    this.game.notifications.push('[ECO FALLIDO] La muerte no es el fin. El conocimiento permanece.');
    this.game.audio.playSfx('death');
  }

  update(dt) {
    this.timer += dt;

    const mouse = this.game.input.getMousePos();
    this.buttons.forEach(btn => {
      btn.hovered = mouse.x > GAME_WIDTH / 2 - 140 && mouse.x < GAME_WIDTH / 2 + 140
        && mouse.y > btn.y - 15 && mouse.y < btn.y + 25;
      if (btn.hovered && this.game.input.wasMouseClicked()) {
        this.game.audio.playSfx('click');
        this._handleAction(btn.action);
      }
    });
  }

  _handleAction(action) {
    switch (action) {
      case 'hub':
        this.game.startNewRun();
        this.game.sceneManager.setScene(new this.game.scenes.HubScene(this.game));
        break;
      case 'menu':
        this.game.sceneManager.setScene(new this.game.scenes.MainMenuScene(this.game));
        break;
    }
  }

  render(ctx) {
    ctx.fillStyle = COLORS.BG_DARK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const alpha = Math.min(1, this.timer * 0.5);

    ctx.globalAlpha = alpha;
    Renderer.drawTextCentered(ctx, 'ECO FALLIDO', GAME_WIDTH / 2, 60, COLORS.TEXT_RED, 28);

    Renderer.drawTextCentered(ctx, 'El Sistema registra tu caída.', GAME_WIDTH / 2, 95, COLORS.TEXT_DIM, 12);
    Renderer.drawTextCentered(ctx, 'Tus acciones resonarán en futuros intentos.', GAME_WIDTH / 2, 115, COLORS.TEXT_DIM, 11);

    const panelX = GAME_WIDTH / 2 - 180;
    const panelY = 140;
    ctx.fillStyle = COLORS.BG_PANEL;
    ctx.fillRect(panelX, panelY, 360, 160);
    ctx.strokeStyle = COLORS.BUTTON_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, 360, 160);

    Renderer.drawTextCentered(ctx, 'ESTADISTICAS DE LA RUN', GAME_WIDTH / 2, panelY + 22, COLORS.TEXT_GOLD, 12);
    Renderer.drawText(ctx, `Enemigos eliminados: ${this.runSummary.kills}`, panelX + 30, panelY + 48, COLORS.TEXT_WHITE, 11);
    Renderer.drawText(ctx, `Daño total infligido: ${this.runSummary.damageDealt}`, panelX + 30, panelY + 66, COLORS.TEXT_WHITE, 11);
    Renderer.drawText(ctx, `Cobres acumulados: ${this.runSummary.cobre}`, panelX + 30, panelY + 84, COLORS.TEXT_WHITE, 11);

    const skillText = this.runSummary.skillsUsed.slice(0, 5).join(' | ') || 'Ninguna';
    Renderer.drawText(ctx, `Habilidades: ${skillText}`, panelX + 30, panelY + 110, COLORS.TEXT_GREEN, 10);

    Renderer.drawTextCentered(ctx, '[ARCHIVO DE ECOS ACTUALIZADO]', GAME_WIDTH / 2, panelY + 140, COLORS.TEXT_BLUE, 10);

    this.buttons.forEach(btn => {
      const x = GAME_WIDTH / 2 - 140;
      ctx.fillStyle = btn.hovered ? COLORS.BUTTON_HOVER : COLORS.BUTTON_BG;
      ctx.strokeStyle = btn.hovered ? COLORS.BUTTON_BORDER : '#333344';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 4, btn.y - 15);
      ctx.lineTo(x + 280 - 4, btn.y - 15);
      ctx.quadraticCurveTo(x + 280, btn.y - 15, x + 280, btn.y - 15 + 4);
      ctx.lineTo(x + 280, btn.y + 15 - 4);
      ctx.quadraticCurveTo(x + 280, btn.y + 15, x + 280 - 4, btn.y + 15);
      ctx.lineTo(x + 4, btn.y + 15);
      ctx.quadraticCurveTo(x, btn.y + 15, x, btn.y + 15 - 4);
      ctx.lineTo(x, btn.y - 15 + 4);
      ctx.quadraticCurveTo(x, btn.y - 15, x + 4, btn.y - 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      Renderer.drawTextCentered(ctx, btn.text, GAME_WIDTH / 2, btn.y + 3, btn.hovered ? COLORS.BUTTON_TEXT : COLORS.TEXT_WHITE, 13);
    });

    ctx.globalAlpha = 1;
  }

  destroy() {}
}

export default GameOverScene;
