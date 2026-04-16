import Phaser from 'phaser';
import { ENEMIES, GAME_WIDTH } from '../config.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const cfg = ENEMIES[type];
    super(scene, x, y, cfg.key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.enemyType = type;
    this.hp = cfg.hp;
    this.maxHp = cfg.hp;
    this.points = cfg.points;
    this.baseFireRate = cfg.fireRate;
    this.spread = cfg.spread || false;
    this.body.setSize(36, 28);
    this.lastFired = 0;
  }

  hit() {
    this.hp--;
    if (this.hp > 0) {
      this.setAlpha(0.5 + 0.5 * (this.hp / this.maxHp));
      return false;
    }
    return true;
  }

  canFire(time) {
    if (time > this.lastFired + this.baseFireRate) {
      this.lastFired = time + Math.random() * 1000;
      return true;
    }
    return false;
  }
}

export class EnemyFormation {
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.direction = 1;
    this.speed = 40;
    this.moveTimer = 0;
    this.moveInterval = 1000;
  }

  spawn(waveConfig, waveNumber) {
    this.group.clear(true, true);
    this.direction = 1;

    const speedMultiplier = 1 + Math.max(0, waveNumber - 5) * 0.1;
    this.speed = 40 * speedMultiplier;
    this.moveInterval = Math.max(400, 1000 - waveNumber * 50);

    const types = [];
    for (let i = 0; i < (waveConfig.galleons || 0); i++) types.push('galleon');
    for (let i = 0; i < (waveConfig.brigantines || 0); i++) types.push('brigantine');
    for (let i = 0; i < (waveConfig.sloops || 0); i++) types.push('sloop');

    const cols = 5;
    const rows = Math.ceil(types.length / cols);
    const spacingX = 70;
    const spacingY = 55;
    const startX = (GAME_WIDTH - (cols - 1) * spacingX) / 2;
    const startY = 80;

    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (idx >= types.length) break;
        const x = startX + col * spacingX;
        const y = startY + row * spacingY;
        const enemy = new Enemy(this.scene, x, y, types[idx]);
        this.group.add(enemy);
        idx++;
      }
    }
  }

  update(time, delta) {
    this.moveTimer += delta;
    if (this.moveTimer < this.moveInterval) return;
    this.moveTimer = 0;

    let hitEdge = false;
    const children = this.group.getChildren().filter(e => e.active);

    for (const enemy of children) {
      if (
        (this.direction > 0 && enemy.x > GAME_WIDTH - 50) ||
        (this.direction < 0 && enemy.x < 50)
      ) {
        hitEdge = true;
        break;
      }
    }

    if (hitEdge) {
      this.direction *= -1;
      for (const enemy of children) {
        enemy.y += ENEMIES.stepDown;
      }
    } else {
      for (const enemy of children) {
        enemy.x += this.speed * this.direction;
      }
    }
  }

  getAliveCount() {
    return this.group.getChildren().filter(e => e.active).length;
  }

  getLowestY() {
    let maxY = 0;
    for (const enemy of this.group.getChildren()) {
      if (enemy.active && enemy.y > maxY) maxY = enemy.y;
    }
    return maxY;
  }

  destroy() {
    this.group.clear(true, true);
  }
}
