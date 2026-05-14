import { NPC_DEFS } from '../utils/Constants.js';

class NPC {
  constructor(id, x, y) {
    const def = NPC_DEFS[id] || {};
    this.id = id;
    this.name = def.name || id;
    this.x = x;
    this.y = y;
    this.size = 18;
    this.color = def.color || '#888888';
    this.role = def.role || 'generic';
    this.trains = def.trains || null;
    this.items = def.items || [];
    this.mission = def.mission || null;
    this.dialogueState = 'default';
    this.interactRange = 60;
  }

  canInteract(playerX, playerY) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.interactRange;
  }

  getDialogueState() {
    return this.dialogueState;
  }

  setDialogueState(state) {
    this.dialogueState = state;
  }
}

export default NPC;
