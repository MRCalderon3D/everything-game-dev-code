import Phaser from 'phaser';
import { generateTextures } from '../utils/AssetGenerator.js';
import AudioManager from '../systems/AudioManager.js';
import { COLORS } from '../config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const text = this.add.text(400, 300, 'Loading...', {
      fontSize: '24px',
      color: '#ffd700',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    generateTextures(this);
    AudioManager.init();

    this.time.delayedCall(200, () => {
      this.scene.start('MenuScene');
    });
  }
}
