import Phaser from 'phaser';
import { PLAYER, COLORS } from '../config.js';
import { getTouchState } from '../utils/TouchInput.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(PLAYER.width - 4, PLAYER.height - 4);

    this.speed = PLAYER.speed;
    this.fireRate = PLAYER.fireRate;
    this.lastFired = 0;
    this.lives = PLAYER.startLives;

    this.activePowerUp = null;
    this.powerUpTimer = null;
    this.shieldActive = false;
    this.invincible = false;
  }

  handleInput(cursors, keys, time) {
    const touch = getTouchState();

    if (cursors.left.isDown || keys.A.isDown || touch.left) {
      this.body.setVelocityX(-this.speed);
    } else if (cursors.right.isDown || keys.D.isDown || touch.right) {
      this.body.setVelocityX(this.speed);
    } else {
      this.body.setVelocityX(0);
    }

    const wantsFire = keys.SPACE.isDown || touch.fire;
    if (wantsFire && time > this.lastFired + this.getCurrentFireRate()) {
      this.lastFired = time;
      return true;
    }
    return false;
  }

  getCurrentFireRate() {
    if (this.activePowerUp === 'rapidFire') {
      return this.fireRate / 2;
    }
    return this.fireRate;
  }

  hit() {
    if (this.invincible) return false;

    if (this.shieldActive) {
      this.shieldActive = false;
      this.clearTint();
      return false;
    }

    this.lives--;
    this.invincible = true;

    // Blink effect during invincibility
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 0.3, to: 1 },
      duration: 100,
      repeat: 7,
      onComplete: () => {
        this.invincible = false;
        this.setAlpha(1);
      },
    });

    return this.lives <= 0;
  }

  applyPowerUp(type) {
    if (this.powerUpTimer) {
      this.powerUpTimer.remove();
    }

    this.activePowerUp = type;

    if (type === 'shield') {
      this.shieldActive = true;
      this.setTint(COLORS.shield);
    }

    this.powerUpTimer = this.scene.time.delayedCall(
      8000,
      () => {
        this.activePowerUp = null;
        this.shieldActive = false;
        this.clearTint();
        this.powerUpTimer = null;
      }
    );
  }

  getPowerUpTimeLeft() {
    if (!this.powerUpTimer) return 0;
    return Math.max(0, 1 - this.powerUpTimer.getProgress());
  }

  reset() {
    this.lives = PLAYER.startLives;
    this.activePowerUp = null;
    this.shieldActive = false;
    this.invincible = false;
    if (this.powerUpTimer) {
      this.powerUpTimer.remove();
      this.powerUpTimer = null;
    }
    this.clearTint();
    this.setPosition(400, PLAYER.y);
    this.body.setVelocity(0);
  }
}
