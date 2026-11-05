import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';
import Renderer from '../Renderer.js';
import ProceduralGen from '../systems/ProceduralGen.js';

class MapScene {
  constructor(game, biome = 'frontera') {
    this.game = game;
    this.mapData = ProceduralGen.generateMap(biome);
    this.cursorCol = this.mapData.currentCol;
    this.cursorRow = this.mapData.currentRow;
    this.moveCooldown = 0;
    this.selectedNode = null;
    this.enteringNode = false;
  }

  init() {
    this.mapData.nodes.forEach(n => {
      n.revealed = false;
      n.visited = false;
    });
    this.mapData.nodes[0].revealed = true;
    this.mapData.nodes[0].visited = true;

    this._revealAdjacent(0, 0);
  }

  _revealAdjacent(col, row) {
    const { cols, rows, nodes } = this.mapData;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    directions.forEach(([dc, dr]) => {
      const nc = col + dc;
      const nr = row + dr;
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
        const node = nodes.find(n => n.col === nc && n.row === nr);
        if (node) node.revealed = true;
      }
    });
  }

  update(dt) {
    if (this.enteringNode) return;

    this.moveCooldown -= dt;

    const mov = this.game.input.getMovement();
    if (this.moveCooldown <= 0) {
      if (mov.x > 0.5 && this.cursorCol < this.mapData.cols - 1) {
        this._moveTo(this.cursorCol + 1, this.cursorRow);
        this.moveCooldown = 0.15;
      } else if (mov.x < -0.5 && this.cursorCol > 0) {
        this._moveTo(this.cursorCol - 1, this.cursorRow);
        this.moveCooldown = 0.15;
      } else if (mov.y > 0.5 && this.cursorRow < this.mapData.rows - 1) {
        this._moveTo(this.cursorCol, this.cursorRow + 1);
        this.moveCooldown = 0.15;
      } else if (mov.y < -0.5 && this.cursorRow > 0) {
        this._moveTo(this.cursorCol, this.cursorRow - 1);
        this.moveCooldown = 0.15;
      }
    }

    const mouse = this.game.input.getMousePos();
    if (this.game.input.wasMouseClicked()) {
      const selected = this._getNodeAt(mouse.x, mouse.y);
      if (selected && selected.revealed && this._isAdjacent(this.cursorCol, this.cursorRow, selected.col, selected.row)) {
        this._moveTo(selected.col, selected.row);
      }
    }

    if (this.game.input.isKeyPressed('Enter') || this.game.input.isKeyPressed(' ')) {
      this._enterNode();
    }

    if (this.game.input.isKeyPressed('Escape') || this.game.input.isKeyPressed('m')) {
      this.game.sceneManager.setScene(new this.game.scenes.HubScene(this.game));
    }
  }

  _moveTo(col, row) {
    const node = this.mapData.nodes.find(n => n.col === col && n.row === row);
    if (!node || !node.revealed) return;

    this.cursorCol = col;
    this.cursorRow = row;
    this.mapData.currentCol = col;
    this.mapData.currentRow = row;

    this.mapData.nodes.forEach(n => {
      n.current = (n.col === col && n.row === row);
    });

    this._revealAdjacent(col, row);
    node.visited = true;
  }

  _enterNode() {
    const node = this.mapData.nodes.find(n => n.col === this.cursorCol && n.row === this.cursorRow);
    if (!node || !node.visited) return;

    this.enteringNode = true;
    this.game.audio.playSfx('click');

    setTimeout(() => {
      switch (node.type) {
        case 'combat':
        case 'elite':
        case 'boss':
          this.game.sceneManager.setScene(new this.game.scenes.CombatScene(this.game, node, this.mapData.biome));
          break;
        case 'event':
        case 'rest':
        case 'merchant':
          this.game.sceneManager.setScene(new this.game.scenes.EventScene(this.game, node));
          break;
        case 'hub':
          this.game.sceneManager.setScene(new this.game.scenes.HubScene(this.game));
          break;
        default:
          this.game.sceneManager.setScene(new this.game.scenes.CombatScene(this.game, node, this.mapData.biome));
      }
    }, 150);
  }

  _isAdjacent(c1, r1, c2, r2) {
    return Math.abs(c1 - c2) + Math.abs(r1 - r2) === 1;
  }

  _getNodeAt(mx, my) {
    const startX = 80;
    const startY = 80;
    const spacingX = 200;
    const spacingY = 130;

    return this.mapData.nodes.find(n => {
      const nx = startX + n.col * spacingX;
      const ny = startY + n.row * spacingY;
      return mx > nx - 25 && mx < nx + 25 && my > ny - 25 && my < ny + 25;
    });
  }

  render(ctx) {
    ctx.fillStyle = COLORS.BG_DARK;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = COLORS.TEXT_GOLD;
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MAPA DE ECOS', GAME_WIDTH / 2, 30);
    ctx.fillStyle = COLORS.TEXT_BLUE;
    ctx.font = '14px monospace';
    ctx.fillText(this.mapData.biome, GAME_WIDTH / 2, 52);

    const startX = 80;
    const startY = 100;
    const spacingX = 200;
    const spacingY = 130;

    this.mapData.nodes.forEach((n1, i) => {
      this.mapData.nodes.forEach((n2, j) => {
        if (i < j && this._isAdjacent(n1.col, n1.row, n2.col, n2.row) && n1.revealed && n2.revealed) {
          const x1 = startX + n1.col * spacingX;
          const y1 = startY + n1.row * spacingY;
          const x2 = startX + n2.col * spacingX;
          const y2 = startY + n2.row * spacingY;
          ctx.strokeStyle = n1.visited && n2.visited ? COLORS.NODE_PATH : '#222233';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
    });

    this.mapData.nodes.forEach(n => {
      const nx = startX + n.col * spacingX;
      const ny = startY + n.row * spacingY;

      if (!n.revealed) {
        ctx.fillStyle = COLORS.NODE_LOCKED;
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#222222';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('?', nx, ny + 5);
        return;
      }

      const color = this._nodeColor(n.type);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nx, ny, n.current ? 22 : 18, 0, Math.PI * 2);
      ctx.fill();

      if (n.current) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (n.visited && !n.current) {
        ctx.strokeStyle = '#555566';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      Renderer.drawTextCentered(ctx, this._nodeLabel(n.type), nx, ny + 5, '#ffffff', 10);

      if (n.current) {
        const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255,255,255,${pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(nx, ny, 26, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.fillStyle = COLORS.TEXT_DIM;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[WASD/Flechas] Mover  [Click] Seleccionar  [Enter] Entrar al nodo  [M/Esc] Volver al Hub', GAME_WIDTH / 2, GAME_HEIGHT - 20);

    const node = this.mapData.nodes.find(n => n.col === this.cursorCol && n.row === this.cursorRow);
    if (node && node.revealed) {
      ctx.fillStyle = COLORS.NOTIFICATION_BG;
      ctx.fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT - 60, 300, 24);
      Renderer.drawTextCentered(ctx, `${this._nodeLabel(node.type)} - ${this._nodeDesc(node.type)}`, GAME_WIDTH / 2, GAME_HEIGHT - 48, COLORS.TEXT_BLUE, 10);
    }
  }

  _nodeColor(type) {
    const map = {
      hub: COLORS.NODE_HUB, combat: COLORS.NODE_COMBAT, event: COLORS.NODE_EVENT,
      rest: COLORS.NODE_REST, merchant: COLORS.NODE_MERCHANT, elite: COLORS.NODE_ELITE, boss: COLORS.NODE_BOSS,
    };
    return map[type] || COLORS.NODE_COMBAT;
  }

  _nodeLabel(type) {
    const map = {
      hub: 'HUB', combat: '⚔', event: '?', rest: '♨', merchant: '$', elite: '⚑', boss: '☠',
    };
    return map[type] || '?';
  }

  _nodeDesc(type) {
    const map = {
      hub: 'Zona segura', combat: 'Combate', event: 'Evento narrativo',
      rest: 'Descanso', merchant: 'Comerciante', elite: 'Combate elite', boss: 'JEFE',
    };
    return map[type] || 'Desconocido';
  }

  destroy() {}
}

export default MapScene;
