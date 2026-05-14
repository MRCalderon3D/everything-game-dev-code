import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';
import ProceduralGen from '../systems/ProceduralGen.js';
import DialogueUI from '../ui/DialogueUI.js';

class EventScene {
  constructor(game, node) {
    this.game = game;
    this.node = node;
    this.events = [];
    this.currentEvent = null;
    this.eventIndex = 0;
    this.showDialogue = false;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueAction = null;
    this.selectedOption = 0;
    this.options = [];
  }

  init() {
    this.game.audio.startMusic('hub');

    if (this.node.type === 'merchant') {
      this.currentEvent = ProceduralGen.generateEvent({});
      this.currentEvent.type = 'merchant';
      this.currentEvent.npc = 'comerciante_errante';
      this.currentEvent.text = 'El Comerciante Errante despliega sus mercancias ante ti.';
    } else if (this.node.type === 'rest') {
      this.currentEvent = { type: 'rest', text: 'Encuentras un lugar seguro para descansar. Recuperas 30 de salud.' };
    } else {
      this.currentEvent = ProceduralGen.generateEvent({});
    }

    this._processEvent();
  }

  _processEvent() {
    switch (this.currentEvent.type) {
      case 'rest':
        this.game.statsSystem.heal(30);
        this.game.notifications.push('[DESCANSO] +30 Salud recuperada');
        setTimeout(() => this._returnToMap(), 1500);
        break;

      case 'merchant':
        this.options = [
          { text: 'Venda (5 Cobres) - +20 Salud', action: 'buy_venda' },
          { text: 'Poción Vital (15 Cobres) - +40 Salud', action: 'buy_pocion' },
          { text: 'Aceite de Arma (12 Cobres) - +5 Daño', action: 'buy_aceite' },
          { text: 'Irse', action: 'leave' },
        ];
        break;

      case 'training':
        this.options = [
          { text: 'Entrenar Esgrima (+20 XP)', action: 'train_esgrima' },
          { text: 'Entrenar Parada (+15 XP)', action: 'train_parada' },
          { text: 'Irse', action: 'leave' },
        ];
        break;

      case 'diary':
        this.game.statsSystem.addSkillXP('tactica', 10);
        this.game.statsSystem.addSkillXP('anatomia', 5);
        this.game.notifications.push('[EVENTO] Diario encontrado: +10 XP Táctica, +5 XP Anatomía');
        setTimeout(() => this._returnToMap(), 2000);
        break;

      case 'herbs':
        this.game.inventorySystem.addItem('hierba_moonstalk', 3);
        this.game.missionSystem.updateProgress('hierba_moonstalk', 3);
        this.game.notifications.push('[EVENTO] +3 Hierbas Moonstalk recolectadas');
        setTimeout(() => this._returnToMap(), 1500);
        break;

      case 'fissure':
        this.game.statsSystem.resources.corrupcion = Math.min(100, this.game.statsSystem.resources.corrupcion + 5);
        this.game.statsSystem.addSkillXP('supervivencia', 8);
        this.game.notifications.push('[EVENTO] Fisura de realidad... +5 Corrupción, +8 XP Supervivencia');
        setTimeout(() => this._returnToMap(), 2000);
        break;

      default:
        setTimeout(() => this._returnToMap(), 1500);
    }
  }

  _handleOption(action) {
    this.game.audio.playSfx('click');
    const inv = this.game.inventorySystem;

    switch (action) {
      case 'buy_venda':
        if (inv.spendCoins('cobre', 5)) {
          inv.addItem('venda', 1);
          this.game.notifications.push('[COMPRA] Venda adquirida (-5 Cobres)');
        } else {
          this.game.notifications.push('[COMPRA] No tienes suficientes cobres');
        }
        break;
      case 'buy_pocion':
        if (inv.spendCoins('cobre', 15)) {
          inv.addItem('pocion_vital', 1);
          this.game.notifications.push('[COMPRA] Poción Vital adquirida (-15 Cobres)');
        } else {
          this.game.notifications.push('[COMPRA] No tienes suficientes cobres');
        }
        break;
      case 'buy_aceite':
        if (inv.spendCoins('cobre', 12)) {
          inv.addItem('aceite_arma', 1);
          this.game.notifications.push('[COMPRA] Aceite de Arma adquirido (-12 Cobres)');
        } else {
          this.game.notifications.push('[COMPRA] No tienes suficientes cobres');
        }
        break;
      case 'train_esgrima':
        this.game.statsSystem.addSkillXP('esgrima', 20);
        this.game.notifications.push('[ENTRENAMIENTO] Esgrima +20 XP');
        break;
      case 'train_parada':
        this.game.statsSystem.addSkillXP('parada', 15);
        this.game.notifications.push('[ENTRENAMIENTO] Parada +15 XP');
        break;
      case 'leave':
        this._returnToMap();
        break;
    }
  }

  _returnToMap() {
    this.game.sceneManager.setScene(new this.game.scenes.MapScene(this.game,
      this.node.type === 'boss' ? 'camino_valdrenot' : 'frontera'));
  }

  update(dt) {
    if (this.options.length > 0) {
      const mov = this.game.input.getMovement();
      if (mov.y < -0.5 && this.selectedOption > 0) {
        this.selectedOption--;
        this.game.audio.playSfx('click');
      }
      if (mov.y > 0.5 && this.selectedOption < this.options.length - 1) {
        this.selectedOption++;
        this.game.audio.playSfx('click');
      }
      if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ') || this.game.input.isKeyPressed('e')) {
        const opt = this.options[this.selectedOption];
        this.options = [];
        if (opt) this._handleOption(opt.action);
      }

      const mouse = this.game.input.getMousePos();
      if (this.game.input.wasMouseClicked()) {
        this.options.forEach((opt, i) => {
          const y = GAME_HEIGHT / 2 + i * 40 - this.options.length * 15;
          if (mouse.x > GAME_WIDTH / 2 - 150 && mouse.x < GAME_WIDTH / 2 + 150
            && mouse.y > y - 10 && mouse.y < y + 25) {
            this.options = [];
            this._handleOption(opt.action);
          }
        });
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = COLORS.BG_DARK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (this.currentEvent) {
      const nodeTypeName = {
        rest: 'DESCANSO', merchant: 'COMERCIANTE', training: 'ENTRENAMIENTO',
        diary: 'HALLAZGO', herbs: 'RECOLECCION', fissure: 'FISURA',
      };

      Renderer.drawTextCentered(ctx, nodeTypeName[this.currentEvent.type] || 'EVENTO',
        GAME_WIDTH / 2, 40, COLORS.TEXT_GOLD, 20);

      ctx.fillStyle = COLORS.BG_PANEL;
      ctx.fillRect(GAME_WIDTH / 2 - 250, 80, 500, 80);
      ctx.strokeStyle = COLORS.BUTTON_BORDER;
      ctx.lineWidth = 1;
      ctx.strokeRect(GAME_WIDTH / 2 - 250, 80, 500, 80);

      Renderer.drawText(ctx, this.currentEvent.text, GAME_WIDTH / 2 - 230, 110, COLORS.TEXT_WHITE, 13, 'left');
    }

    this.options.forEach((opt, i) => {
      const y = GAME_HEIGHT / 2 + i * 40 - this.options.length * 15;
      const selected = i === this.selectedOption;

      ctx.fillStyle = selected ? COLORS.BUTTON_HOVER : COLORS.BUTTON_BG;
      ctx.strokeStyle = selected ? COLORS.BUTTON_BORDER : '#333344';
      ctx.lineWidth = 1;
      const x = GAME_WIDTH / 2 - 150;
      const btnX = x, btnY = y - 12, btnW = 300, btnH = 30;
      ctx.beginPath();
      ctx.moveTo(btnX + 4, btnY);
      ctx.lineTo(btnX + btnW - 4, btnY);
      ctx.quadraticCurveTo(btnX + btnW, btnY, btnX + btnW, btnY + 4);
      ctx.lineTo(btnX + btnW, btnY + btnH - 4);
      ctx.quadraticCurveTo(btnX + btnW, btnY + btnH, btnX + btnW - 4, btnY + btnH);
      ctx.lineTo(btnX + 4, btnY + btnH);
      ctx.quadraticCurveTo(btnX, btnY + btnH, btnX, btnY + btnH - 4);
      ctx.lineTo(btnX, btnY + 4);
      ctx.quadraticCurveTo(btnX, btnY, btnX + 4, btnY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      Renderer.drawTextCentered(ctx, `${selected ? '> ' : '  '}${opt.text}`,
        GAME_WIDTH / 2, y + 5, selected ? COLORS.BUTTON_TEXT : COLORS.TEXT_WHITE, 12);
    });

    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[W/S o Flechas] Seleccionar  [Enter/E] Confirmar  [Click] Elegir', GAME_WIDTH / 2, GAME_HEIGHT - 15);
  }

  destroy() {}
}

export default EventScene;
