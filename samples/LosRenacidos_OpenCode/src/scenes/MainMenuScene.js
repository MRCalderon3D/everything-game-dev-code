import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';

class MainMenuScene {
  constructor(game) {
    this.game = game;
    this.buttons = [
      { text: 'NUEVA PARTIDA', y: 200, action: 'new_game' },
      { text: 'CONTINUAR', y: 260, action: 'continue' },
      { text: 'ARCHIVO DE ECOS', y: 320, action: 'archive' },
      { text: 'CONFIGURACION', y: 380, action: 'settings' },
    ];
    this.hasSave = false;
  }

  init() {
    if (this.game.audio) this.game.audio.stopMusic();
    const saveData = this.game.saveManager.load('metaProgression');
    this.hasSave = saveData && saveData.runsCompleted > 0;
  }

  update(dt) {
    const mouse = this.game.input.getMousePos();
    const mx = mouse.x;
    const my = mouse.y;

    this.buttons.forEach(btn => {
      btn.hovered = mx > GAME_WIDTH / 2 - 120 && mx < GAME_WIDTH / 2 + 120
        && my > btn.y - 15 && my < btn.y + 25;
      if (btn.hovered && this.game.input.wasMouseClicked()) {
        this.game.audio.playSfx('click');
        this._handleAction(btn.action);
      }
    });
  }

  _handleAction(action) {
    switch (action) {
      case 'new_game': this.game.startNewRun(); break;
      case 'continue': this.game.continueRun(); break;
      case 'archive': break;
      case 'settings': this.game.sceneManager.setScene(new this.game.scenes.SettingsScene(this.game)); break;
    }
  }

  render(ctx) {
    ctx.fillStyle = COLORS.BG_DARK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const t = Date.now() / 1000;
    for (let i = 0; i < 30; i++) {
      const sx = (Math.sin(t * 0.3 + i * 1.7) * 0.5 + 0.5) * GAME_WIDTH;
      const sy = (Math.cos(t * 0.2 + i * 1.3) * 0.5 + 0.5) * GAME_HEIGHT;
      ctx.fillStyle = `rgba(68,136,204,${0.1 + Math.sin(t + i) * 0.05})`;
      ctx.fillRect(sx, sy, 2, 2);
    }

    ctx.fillStyle = COLORS.TEXT_GOLD;
    ctx.font = '36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LOS RENACIDOS', GAME_WIDTH / 2, 100);

    ctx.font = '16px monospace';
    ctx.fillStyle = COLORS.TEXT_BLUE;
    ctx.fillText('Ecos de Talasaria', GAME_WIDTH / 2, 130);

    ctx.font = '12px monospace';
    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.fillText('Roguelike Narrativo de Accion - MVP v0.1', GAME_WIDTH / 2, 155);

    this.buttons.forEach(btn => {
      if (btn.text === 'CONTINUAR' && !this.hasSave) return;
      const x = GAME_WIDTH / 2 - 120;
      const color = btn.hovered ? COLORS.BUTTON_HOVER : COLORS.BUTTON_BG;
      const borderColor = btn.hovered ? COLORS.BUTTON_BORDER : '#333344';

      ctx.fillStyle = color;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      this._roundRect(ctx, x, btn.y - 18, 240, 36, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = btn.hovered ? COLORS.BUTTON_TEXT : COLORS.TEXT_WHITE;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(btn.text, GAME_WIDTH / 2, btn.y + 4);
    });

    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[WASD] Moverse  [Click/Space] Atacar  [Shift] Esquivar  [Ctrl] Bloquear  [E] Interactuar  [Esc] Pausa', GAME_WIDTH / 2, GAME_HEIGHT - 20);
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  destroy() {}
}

export default MainMenuScene;
