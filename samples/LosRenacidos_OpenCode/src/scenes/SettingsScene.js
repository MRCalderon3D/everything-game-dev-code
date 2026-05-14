import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';

class SettingsScene {
  constructor(game, returnScene = null) {
    this.game = game;
    this.returnScene = returnScene;
    this.selectedOption = 0;
    this.options = [
      { text: 'Volumen Música', type: 'slider', key: 'music', value: 0.4 },
      { text: 'Volumen SFX', type: 'slider', key: 'sfx', value: 0.7 },
      { text: 'Volver', type: 'button', action: 'back' },
    ];
    this.sliderAdjusting = false;
  }

  init() {
    if (this.game.audio) {
      this.options[0].value = this.game.audio.musicVolume || 0.4;
      this.options[1].value = this.game.audio.sfxVolume || 0.7;
    }
  }

  update(dt) {
    const mov = this.game.input.getMovement();
    if (this.sliderAdjusting) {
      const opt = this.options[this.selectedOption];
      if (mov.x > 0.5) { opt.value = Math.min(1, opt.value + 0.05); }
      if (mov.x < -0.5) { opt.value = Math.max(0, opt.value - 0.05); }
      if (opt.key === 'music') this.game.audio.setMusicVolume(opt.value);
      if (opt.key === 'sfx') this.game.audio.setSfxVolume(opt.value);
      if (!this.game.input.isKeyDown('a') && !this.game.input.isKeyDown('d')
        && !this.game.input.isKeyDown('ArrowLeft') && !this.game.input.isKeyDown('ArrowRight')) {
        this.sliderAdjusting = false;
      }
    } else {
      if (mov.y < -0.5 && this.selectedOption > 0) { this.selectedOption--; this.game.audio.playSfx('click'); }
      if (mov.y > 0.5 && this.selectedOption < this.options.length - 1) { this.selectedOption++; this.game.audio.playSfx('click'); }
    }

    if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ')) {
      const opt = this.options[this.selectedOption];
      if (opt.type === 'slider') {
        this.sliderAdjusting = true;
      } else if (opt.action === 'back') {
        this._goBack();
      }
    }

    if (this.game.input.isKeyPressed('Escape')) {
      this._goBack();
    }

    const mouse = this.game.input.getMousePos();
    if (this.game.input.wasMouseClicked()) {
      this.options.forEach((opt, i) => {
        const y = GAME_HEIGHT / 2 - 40 + i * 50;
        if (opt.type === 'slider') {
          const sliderX = GAME_WIDTH / 2 + 50;
          if (mouse.y > y - 8 && mouse.y < y + 8 && mouse.x > sliderX - 80 && mouse.x < sliderX + 80) {
            opt.value = (mouse.x - (sliderX - 80)) / 160;
            opt.value = Math.max(0, Math.min(1, opt.value));
            if (opt.key === 'music') this.game.audio.setMusicVolume(opt.value);
            if (opt.key === 'sfx') this.game.audio.setSfxVolume(opt.value);
          }
        } else if (opt.type === 'button') {
          if (mouse.x > GAME_WIDTH / 2 - 80 && mouse.x < GAME_WIDTH / 2 + 80
            && mouse.y > y - 12 && mouse.y < y + 20) {
            this._goBack();
          }
        }
      });
    }
  }

  _goBack() {
    this.game.audio.playSfx('click');
    const saveData = {
      musicVolume: this.options[0].value,
      sfxVolume: this.options[1].value,
    };
    this.game.saveManager.save('settings', saveData);

    if (this.returnScene) {
      this.game.sceneManager.setScene(this.returnScene);
    } else {
      this.game.sceneManager.setScene(new this.game.scenes.MainMenuScene(this.game));
    }
  }

  render(ctx) {
    ctx.fillStyle = COLORS.BG_DARK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    Renderer.drawTextCentered(ctx, 'CONFIGURACION', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, COLORS.TEXT_GOLD, 22);

    this.options.forEach((opt, i) => {
      const y = GAME_HEIGHT / 2 - 40 + i * 50;
      const selected = i === this.selectedOption;

      if (opt.type === 'slider') {
        Renderer.drawText(ctx, opt.text, GAME_WIDTH / 2 - 180, y, selected ? COLORS.TEXT_GOLD : COLORS.TEXT_WHITE, 13);

        const sliderX = GAME_WIDTH / 2 + 50;
        ctx.fillStyle = '#222233';
        ctx.fillRect(sliderX - 80, y - 5, 160, 10);
        ctx.fillStyle = COLORS.BUTTON_BORDER;
        ctx.fillRect(sliderX - 80, y - 5, 160 * opt.value, 10);
        ctx.strokeStyle = selected ? COLORS.TEXT_GOLD : '#444466';
        ctx.lineWidth = 1;
        ctx.strokeRect(sliderX - 80, y - 5, 160, 10);

        ctx.fillStyle = selected ? COLORS.TEXT_GOLD : '#ffffff';
        ctx.beginPath();
        ctx.arc(sliderX - 80 + 160 * opt.value, y, 7, 0, Math.PI * 2);
        ctx.fill();

        Renderer.drawText(ctx, `${Math.round(opt.value * 100)}%`, sliderX + 90, y, COLORS.TEXT_DIM, 11);
      } else {
        const x = GAME_WIDTH / 2 - 80;
        ctx.fillStyle = selected ? COLORS.BUTTON_HOVER : COLORS.BUTTON_BG;
        ctx.strokeStyle = selected ? COLORS.BUTTON_BORDER : '#333344';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 4, y - 12);
        ctx.lineTo(x + 160 - 4, y - 12);
        ctx.quadraticCurveTo(x + 160, y - 12, x + 160, y - 12 + 4);
        ctx.lineTo(x + 160, y + 12 - 4);
        ctx.quadraticCurveTo(x + 160, y + 12, x + 160 - 4, y + 12);
        ctx.lineTo(x + 4, y + 12);
        ctx.quadraticCurveTo(x, y + 12, x, y + 12 - 4);
        ctx.lineTo(x, y - 12 + 4);
        ctx.quadraticCurveTo(x, y - 12, x + 4, y - 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        Renderer.drawTextCentered(ctx, opt.text, GAME_WIDTH / 2, y + 2,
          selected ? COLORS.BUTTON_TEXT : COLORS.TEXT_WHITE, 14);
      }
    });

    Renderer.drawTextCentered(ctx, '[ESC] Volver  [W/S] Navegar  [Enter] Seleccionar  [A/D] Ajustar slider',
      GAME_WIDTH / 2, GAME_HEIGHT - 20, COLORS.TEXT_DIM, 10);
  }

  destroy() {}
}

export default SettingsScene;
