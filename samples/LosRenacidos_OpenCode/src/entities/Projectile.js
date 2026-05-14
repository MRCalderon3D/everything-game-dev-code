import { COLORS } from '../utils/Constants.js';

class Projectile {
  constructor(x, y, targetX, targetY, damage, speed = 200) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.speed = speed;
    this.size = 4;
    this.color = '#cc8844';
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.alive = true;
    this.maxDist = 400;
    this.traveled = 0;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.traveled += this.speed * dt;
    if (this.traveled > this.maxDist) {
      this.alive = false;
    }
  }

  hitsPlayer(playerX, playerY, playerSize) {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (this.size + playerSize / 2);
  }
}

export default Projectile;
