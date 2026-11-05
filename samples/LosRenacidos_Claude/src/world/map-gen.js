const ROOM_POOL = ['claroBosque', 'campamentoGoblins', 'emboscadaBandidos', 'senderoJabalies'];

const NODE_W = 80;
const NODE_H = 60;
const COL_X = [120, 280, 440, 600, 760];

function pickRoom(type) {
  if (type === 'boss') return 'arenaAlfa';
  if (type === 'elite') return 'senderoJabalies';
  if (type === 'event') {
    return 'emboscadaBandidos';
  }
  // combat / rest fallback
  return ROOM_POOL[Math.floor(Math.random() * ROOM_POOL.length)];
}

export function generateRunMap() {
  // Column 0: start. Columns 1-3: 2 nodes each. Column 4: boss.
  const nodes = [];
  const edges = [];

  const start = {
    id: 'start', type: 'rest', x: COL_X[0], y: 240,
    room: pickRoom('combat'), col: 0,
  };
  nodes.push(start);

  const middleCols = [1, 2, 3];
  const colNodes = [[start]];
  for (const ci of middleCols) {
    const count = 2;
    const ys = count === 2 ? [160, 320] : [120, 240, 360];
    const col = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let type;
      if (ci === 1) type = r < 0.7 ? 'combat' : 'event';
      else if (ci === 2) type = r < 0.5 ? 'combat' : (r < 0.75 ? 'event' : 'rest');
      else type = r < 0.6 ? 'elite' : (r < 0.85 ? 'combat' : 'event');
      const node = {
        id: `n_${ci}_${i}`,
        type,
        x: COL_X[ci],
        y: ys[i],
        room: pickRoom(type),
        col: ci,
      };
      col.push(node);
      nodes.push(node);
    }
    colNodes.push(col);
  }

  const boss = {
    id: 'boss', type: 'boss', x: COL_X[4], y: 240,
    room: pickRoom('boss'), col: 4,
  };
  nodes.push(boss);
  colNodes.push([boss]);

  // Edges: each node in col c connects to 1-2 nodes in col c+1
  for (let c = 0; c < colNodes.length - 1; c++) {
    const fromCol = colNodes[c];
    const toCol = colNodes[c + 1];
    for (const fromNode of fromCol) {
      // sort destinations by proximity
      const sorted = toCol.slice().sort((a, b) => Math.abs(a.y - fromNode.y) - Math.abs(b.y - fromNode.y));
      const connectN = Math.min(toCol.length, Math.random() < 0.6 ? 2 : 1);
      for (let k = 0; k < connectN; k++) {
        edges.push([fromNode.id, sorted[k].id]);
      }
    }
    // ensure every dest has at least one incoming
    for (const dest of toCol) {
      const has = edges.some(e => e[1] === dest.id);
      if (!has) {
        const src = fromCol[Math.floor(Math.random() * fromCol.length)];
        edges.push([src.id, dest.id]);
      }
    }
  }

  return {
    nodes,
    edges,
    currentId: start.id,
    clearedIds: new Set([start.id]),
    startId: start.id,
    bossId: boss.id,
  };
}

export function neighbors(map, nodeId) {
  return map.edges.filter(e => e[0] === nodeId).map(e => map.nodes.find(n => n.id === e[1]));
}
