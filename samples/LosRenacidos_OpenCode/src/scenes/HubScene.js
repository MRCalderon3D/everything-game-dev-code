import { GAME_WIDTH, GAME_HEIGHT, COLORS, NPC_DEFS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';
import NPC from '../entities/NPC.js';
import DialogueSystem from '../systems/DialogueSystem.js';
import { DialogueUI } from '../ui/DialogueUI.js';

class HubScene {
  constructor(game) {
    this.game = game;
    this.npcs = [];
    this.showDialogue = false;
    this.dialogueLines = [];
    this.dialogueIndex = 0;
    this.dialogueAction = null;
    this.activeNPC = null;
    this.dialogueNpcId = null;
    this.playerX = 100;
    this.playerY = GAME_HEIGHT / 2 + 80;
    this.playerSize = 20;
    this.notificationTimer = 0;
    this.notificationText = '';
    this.missionAccepted = false;
    this.missionCompleted = false;
    this.visitedNodes = { npc: {} };
  }

  init() {
    this.game.audio.startMusic('hub');

    this.npcs = [
      new NPC('thorpe', 350, 160),
      new NPC('brand', 550, 200),
      new NPC('garrick', 180, 350),
      new NPC('aldous', 400, 380),
      new NPC('elara', 650, 320),
      new NPC('comerciante_errante', 750, 150),
    ];

    this.npcs.forEach(npc => {
      if (!this.visitedNodes.npc) this.visitedNodes.npc = {};
      if (this.visitedNodes.npc[npc.id]) {
        npc.dialogueState = this.visitedNodes.npc[npc.id];
      }
    });

    this.showDialogue = false;
    this.notificationTimer = 0;
    this.notificationText = '';
  }

  update(dt) {
    if (this.showDialogue) {
      if (this.game.input.wasMouseClicked() || this.game.input.isKeyPressed('e')
        || this.game.input.isKeyPressed(' ')) {
        this._advanceDialogue();
      }
      return;
    }

    if (this.notificationTimer > 0) {
      this.notificationTimer -= dt;
    }

    const mov = this.game.input.getMovement();
    const speed = 130;
    this.playerX += mov.x * speed * dt;
    this.playerY += mov.y * speed * dt;
    this.playerX = Math.max(30, Math.min(GAME_WIDTH - 30, this.playerX));
    this.playerY = Math.max(40, Math.min(GAME_HEIGHT - 30, this.playerY));

    const nearNpc = this.npcs.find(n => n.canInteract(this.playerX, this.playerY));
    if (nearNpc && this.game.input.isKeyPressed('e')) {
      this._interactWithNPC(nearNpc);
    }
  }

  _interactWithNPC(npc) {
    this.activeNPC = npc;
    this.dialogueNpcId = npc.id;
    this.dialogueLines = DialogueSystem.getDialogue(npc.id, npc.dialogueState);
    this.dialogueIndex = 0;
    this.dialogueAction = null;
    this.showDialogue = true;
    this.game.audio.playSfx('click');
  }

  _advanceDialogue() {
    const current = this.dialogueLines[this.dialogueIndex];
    if (current && current.action) {
      this._handleDialogueAction(current.action);
      return;
    }

    this.dialogueIndex++;
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.showDialogue = false;
      this.dialogueAction = null;
    }
  }

  _handleDialogueAction(action) {
    this.game.audio.playSfx('click');

    if (action === 'shop' && this.activeNPC) {
      this.showDialogue = false;
      this._showShop(this.activeNPC);
      return;
    }

    if (action === 'quest_recoleccion_hierbas' && !this.missionAccepted) {
      this.missionAccepted = true;
      this.game.missionSystem.addMission('recoleccion_hierbas');
      this.activeNPC.setDialogueState('quest_accepted');
      this.visitedNodes.npc[this.dialogueNpcId] = 'quest_accepted';
      this.game.notifications.push('[MISION] Recolector de Hierbas: Recoge 5 Moonstalk del bosque');
      this.game.audio.playSfx('mission');
    }

    if (action === 'complete_quest') {
      const reward = this.game.missionSystem.completeMission('recoleccion_hierbas', this.game.inventorySystem, this.game.statsSystem);
      if (reward) {
        this.missionCompleted = true;
        this.game.notifications.push('[MISION COMPLETADA] Recolector de Hierbas: +20 Cobres');
        this.game.audio.playSfx('mission');
      }
    }

    if (action === 'quest_escolta' && !this._hasMission('escolta')) {
      this.game.missionSystem.addMission('escolta');
      this.game.notifications.push('[MISION] Escolta de Caravana: Protege la caravana de bandidos');
      this.game.audio.playSfx('mission');
    }

    if (action === 'train_esgrima') {
      this.game.statsSystem.addSkillXP('esgrima', 20);
      const lvl = this.game.statsSystem.getSkillLevel('esgrima');
      this.game.notifications.push(`[ENTRENAMIENTO] Esgrima +20 XP (Nivel ${lvl})`);
      this.game.audio.playSfx('notification');
      this.activeNPC.setDialogueState('trained');
      this.visitedNodes.npc[this.dialogueNpcId] = 'trained';
    }

    if (action === 'blacksmith') {
      this.showDialogue = false;
      this._showBlacksmith(this.activeNPC);
      return;
    }

    this.dialogueIndex++;
    if (this.dialogueIndex >= this.dialogueLines.length) {
      this.showDialogue = false;
    }
  }

  _showShop(npc) {
    this.game.notifications.push('[COMERCIANTE] Abriendo tienda...');
  }

  _showBlacksmith(npc) {
    this.game.notifications.push('[HERRERO] Equipo reparado.');
    if (this.game.inventorySystem.equipment.weapon) {
      this.game.inventorySystem.equipment.weapon.durabilidad = this.game.inventorySystem.equipment.weapon.durabilidadMax;
    }
    if (this.game.inventorySystem.equipment.shield) {
      this.game.inventorySystem.equipment.shield.durabilidad = this.game.inventorySystem.equipment.shield.durabilidadMax;
    }
  }

  _hasMission(id) {
    return this.game.missionSystem.getActiveMissions().some(m => m.id === id);
  }

  render(ctx) {
    ctx.fillStyle = '#1a2a1a';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this._drawBuildings(ctx);

    this._drawGround(ctx);

    this.npcs.forEach(npc => {
      const near = npc.canInteract(this.playerX, this.playerY);
      Renderer.drawNPC(ctx, npc.x, npc.y, npc.size, npc.color, npc.name);
      if (near) {
        Renderer.drawTextCentered(ctx, '[E] Hablar', npc.x, npc.y - 22, COLORS.TEXT_GOLD, 10);
      }
    });

    Renderer.drawCircle(ctx, this.playerX, this.playerY, this.playerSize / 2, COLORS.PLAYER);

    ctx.fillStyle = COLORS.TEXT_GOLD;
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('M I N O C', GAME_WIDTH / 2, 25);

    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.font = '10px monospace';
    ctx.fillText('Presiona [M] para abrir el mapa de nodos y salir de expedicion', GAME_WIDTH / 2, GAME_HEIGHT - 15);

    if (this.game.input.isKeyDown('m')) {
      this.game.sceneManager.setScene(new this.game.scenes.MapScene(this.game));
    }

    if (this.notificationTimer > 0) {
      ctx.fillStyle = COLORS.NOTIFICATION_BG;
      ctx.fillRect(GAME_WIDTH / 2 - 200, GAME_HEIGHT - 60, 400, 30);
      ctx.fillStyle = COLORS.TEXT_BLUE;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.notificationText, GAME_WIDTH / 2, GAME_HEIGHT - 45);
    }

    if (this.showDialogue) {
      DialogueUI.render(ctx, this.dialogueLines, this.dialogueIndex, GAME_WIDTH, GAME_HEIGHT);
    }
  }

  _drawBuildings(ctx) {
    const buildings = [
      { x: 340, y: 160, w: 60, h: 40, name: 'Ayuntamiento' },
      { x: 540, y: 200, w: 50, h: 40, name: 'Plaza' },
      { x: 160, y: 340, w: 60, h: 45, name: 'Forja' },
      { x: 380, y: 370, w: 55, h: 40, name: 'Posada' },
      { x: 640, y: 310, w: 45, h: 40, name: 'Herboristeria' },
      { x: 730, y: 140, w: 50, h: 40, name: 'Puesto Viajero' },
    ];

    buildings.forEach(b => {
      ctx.fillStyle = '#2a2a1a';
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = '#4a4a3a';
      ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#884422';
      ctx.fillRect(b.x + 5, b.y + 5, b.w - 10, b.h - 5);

      Renderer.drawTextCentered(ctx, b.name, b.x + b.w / 2, b.y + b.h + 14, COLORS.TEXT_DIM, 8);
    });
  }

  _drawGround(ctx) {
    ctx.fillStyle = '#3a3020';
    ctx.beginPath();
    ctx.arc(700, 420, 80, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = '#2a4a2a';
    for (let i = 0; i < 15; i++) {
      const tx = 30 + i * 67;
      const ty = 40;
      ctx.fillRect(tx, ty, 5, 8);
      ctx.fillRect(tx + 2, ty - 4, 3, 12);
      ctx.fillStyle = '#1a3a1a';
      ctx.fillRect(tx + 1, ty, 3, 6);
      ctx.fillStyle = '#2a4a2a';
    }
  }

  destroy() {
    this.game.audio.stopMusic();
  }
}

export default HubScene;
