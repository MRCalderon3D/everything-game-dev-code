import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';

class PauseScene {
  constructor(game, returnScene) {
    this.game = game;
    this.returnScene = returnScene;
    this.selectedOption = 0;
    this.options = [
      { text: 'Reanudar', action: 'resume' },
      { text: 'Configuración', action: 'settings' },
      { text: 'Salir al Menú', action: 'quit' },
    ];
  }

  init() {}

  update(dt) {
    const mov = this.game.input.getMovement();
    if (mov.y < -0.5 && this.selectedOption > 0) {
      this.selectedOption--;
      this.game.audio.playSfx('click');
    }
    if (mov.y > 0.5 && this.selectedOption < this.options.length - 1) {
      this.selectedOption++;
      this.game.audio.playSfx('click');
    }

    if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ')) {
      this._handleAction(this.options[this.selectedOption].action);
    }
    if (this.game.input.isKeyPressed('Escape')) {
      this._handleAction('resume');
    }

    const mouse = this.game.input.getMousePos();
    if (this.game.input.wasMouseClicked()) {
      this.options.forEach((opt, i) => {
        const y = GAME_HEIGHT / 2 - 10 + i * 40;
        if (mouse.x > GAME_WIDTH / 2 - 120 && mouse.x < GAME_WIDTH / 2 + 120
          && mouse.y > y - 15 && mouse.y < y + 25) {
          this._handleAction(opt.action);
        }
      });
    }
  }

  _handleAction(action) {
    this.game.audio.playSfx('click');
    switch (action) {
      case 'resume':
        this.game.sceneManager.setScene(this.returnScene);
        break;
      case 'settings':
        this.game.sceneManager.setScene(new this.game.scenes.SettingsScene(this.game, this));
        break;
      case 'quit':
        this.game.audio.stopMusic();
        this.game.sceneManager.setScene(new this.game.scenes.MainMenuScene(this.game));
        break;
    }
  }

  render(ctx) {
    if (this.returnScene && this.returnScene.render) {
      this.returnScene.render(ctx);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    Renderer.drawTextCentered(ctx, 'PAUSA', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, COLORS.TEXT_GOLD, 24);

    this.options.forEach((opt, i) => {
      const y = GAME_HEIGHT / 2 - 10 + i * 40;
      const selected = i === this.selectedOption;

      ctx.fillStyle = selected ? COLORS.BUTTON_HOVER : COLORS.BUTTON_BG;
      ctx.strokeStyle = selected ? COLORS.BUTTON_BORDER : '#333344';
      ctx.lineWidth = 1;
      const x = GAME_WIDTH / 2 - 120;
      ctx.beginPath();
      ctx.moveTo(x + 4, y - 15);
      ctx.lineTo(x + 240 - 4, y - 15);
      ctx.quadraticCurveTo(x + 240, y - 15, x + 240, y - 15 + 4);
      ctx.lineTo(x + 240, y + 15 - 4);
      ctx.quadraticCurveTo(x + 240, y + 15, x + 240 - 4, y + 15);
      ctx.lineTo(x + 4, y + 15);
      ctx.quadraticCurveTo(x, y + 15, x, y + 15 - 4);
      ctx.lineTo(x, y - 15 + 4);
      ctx.quadraticCurveTo(x, y - 15, x + 4, y - 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      Renderer.drawTextCentered(ctx, opt.text, GAME_WIDTH / 2, y + 3,
        selected ? COLORS.BUTTON_TEXT : COLORS.TEXT_WHITE, 14);
    });
  }

  destroy() {}
}

export default PauseScene;
