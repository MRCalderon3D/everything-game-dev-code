import Phaser from 'phaser';
import { BULLET } from '../config.js';
import { applyArcadeBodySize, applyDisplaySize } from '../utils/GeneratedAssetConfig.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    applyDisplaySize(this, texture);
    applyArcadeBodySize(this, BULLET.width, BULLET.height);
  }

  fire(x, y, velocityY, velocityX = 0) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.body.setVelocity(velocityX, velocityY);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y < -20 || this.y > 620) {
      this.deactivate();
    }
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      this.body.enable = false;
      this.body.setVelocity(0);
    }
  }
}
