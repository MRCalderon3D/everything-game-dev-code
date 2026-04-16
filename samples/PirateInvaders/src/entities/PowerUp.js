import Phaser from 'phaser';
import { POWERUPS } from '../config.js';

export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    const types = POWERUPS.types;
    const type = types[Math.floor(Math.random() * types.length)];
    super(scene, x, y, 'powerup');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.powerUpType = type;
    this.body.setSize(20, 20);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y > 620) {
      this.destroy();
    }
  }
}
