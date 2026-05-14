import { BIOMES } from '../utils/Constants.js';

class ProceduralGen {
  static generateMap(currentBiome = 'frontera') {
    const biome = BIOMES[currentBiome];
    const cols = 4;
    const rows = 3;

    const nodes = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        nodes.push({
          id: `${col}-${row}`,
          col, row,
          type: ProceduralGen._nodeType(col, row, cols, rows),
          visited: false,
          completed: false,
          revealed: col === 0 && row === 0,
          current: col === 0 && row === 0,
        });
      }
    }

    nodes[0].type = 'hub';
    nodes[0].visited = true;
    const bossIdx = nodes.length - 1;
    nodes[bossIdx].type = 'boss';
    nodes[bossIdx].revealed = false;

    return { nodes, cols, rows, biome: biome.name, currentCol: 0, currentRow: 0 };
  }

  static _nodeType(col, row, cols, rows) {
    if (col === 0 && row === 0) return 'hub';
    if (col === cols - 1 && row === rows - 1) return 'boss';
    const r = Math.random();
    if (r < 0.35) return 'combat';
    if (r < 0.50) return 'event';
    if (r < 0.60) return 'rest';
    if (r < 0.72) return 'merchant';
    if (r < 0.85) return 'combat';
    return 'elite';
  }

  static generateCombatRoom(biome, isElite = false, isBoss = false) {
    const width = 800;
    const height = 460;
    const obstacles = [];
    const enemies = [];

    const obstacleCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < obstacleCount; i++) {
      obstacles.push({
        x: 100 + Math.random() * (width - 200),
        y: 60 + Math.random() * (height - 120),
        w: 20 + Math.random() * 40,
        h: 20 + Math.random() * 40,
      });
    }

    if (isBoss) {
      enemies.push({ type: biome.boss, x: width / 2, y: 100 });
    } else if (isElite) {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const pool = biome.enemyPool;
        enemies.push({ type: pool[Math.floor(Math.random() * pool.length)], x: 150 + i * 200 + Math.random() * 100, y: 80 + Math.random() * 150 });
      }
    } else {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const pool = biome.enemyPool;
        enemies.push({ type: pool[Math.floor(Math.random() * pool.length)], x: 200 + Math.random() * 400, y: 80 + Math.random() * 200 });
      }
    }

    return { width, height, obstacles, enemies };
  }

  static generateEvent(biome) {
    const events = [
      { type: 'merchant', npc: 'comerciante_errante', text: 'Un comerciante errante se acerca a ofrecerte sus mercancías.' },
      { type: 'training', npc: 'brand', text: 'Brand te ofrece entrenar tu esgrima. Cada golpe cuenta.' },
      { type: 'diary', text: 'Encuentras un cadáver con un diario. Habla de la corrupción que se extiende por el bosque. Obtienes +10 XP de Táctica.' },
      { type: 'herbs', text: 'Un claro lleno de hierbas medicinales. +3 Moonstalk.', reward: { item: 'hierba_moonstalk', qty: 3 } },
      { type: 'fissure', text: 'Una fisura de realidad tiembla ante ti. Por un momento ves... ¿el mundo moderno? +5 Corrupción.' },
    ];
    return events[Math.floor(Math.random() * events.length)];
  }
}

export default ProceduralGen;
