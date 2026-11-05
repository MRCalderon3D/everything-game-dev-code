import { ROOM } from '../constants.js';
import { ROOM_TEMPLATES } from '../data/rooms.js';

export class Room {
  constructor(templateKey) {
    this.key = templateKey;
    const tpl = ROOM_TEMPLATES[templateKey];
    if (!tpl) throw new Error(`Unknown room: ${templateKey}`);
    this.template = tpl;
    this.walls = tpl.walls.map(w => ({ ...w }));
    this.spawns = tpl.spawns.map(s => ({ ...s }));
    this.cleared = false;
    this.herbDrops = tpl.herbDrops || 0;
    this.isBossRoom = !!tpl.isBossRoom;
    this.isQuest = tpl.isQuest || null;
    this.fameReward = tpl.fameReward || 0;
    this.name = tpl.name;
    this.flavor = tpl.flavor;
  }

  // Collide a circle (cx, cy, r) against room walls AND room edges. Returns adjusted (x,y).
  resolveCollision(cx, cy, r) {
    let x = cx, y = cy;
    // edges
    if (x - r < 0) x = r;
    if (y - r < 0) y = r;
    if (x + r > ROOM.width) x = ROOM.width - r;
    if (y + r > ROOM.height) y = ROOM.height - r;
    // walls
    for (const w of this.walls) {
      const nearestX = Math.max(w.x, Math.min(x, w.x + w.w));
      const nearestY = Math.max(w.y, Math.min(y, w.y + w.h));
      const dx = x - nearestX;
      const dy = y - nearestY;
      const distSq = dx * dx + dy * dy;
      if (distSq < r * r && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const overlap = r - dist;
        x += (dx / dist) * overlap;
        y += (dy / dist) * overlap;
      } else if (distSq === 0) {
        // inside wall — push out vertically
        y = w.y - r;
      }
    }
    return { x, y };
  }

  pickFreeSpawn() {
    // pick a random position not inside any wall
    for (let i = 0; i < 30; i++) {
      const x = 40 + Math.random() * (ROOM.width - 80);
      const y = 40 + Math.random() * (ROOM.height - 80);
      let blocked = false;
      for (const w of this.walls) {
        if (x > w.x - 16 && x < w.x + w.w + 16 && y > w.y - 16 && y < w.y + w.h + 16) {
          blocked = true; break;
        }
      }
      if (!blocked) return { x, y };
    }
    return { x: ROOM.width / 2, y: ROOM.height / 2 };
  }
}
