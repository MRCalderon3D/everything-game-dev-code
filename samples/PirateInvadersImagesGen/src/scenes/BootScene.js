import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { COLORS } from '../config.js';
import { IMAGE_ASSETS } from '../utils/GeneratedAssetConfig.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const text = this.add.text(400, 300, 'Loading... 0%', {
      fontSize: '24px',
      color: '#ffd700',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      text.setText(`Loading... ${Math.round(value * 100)}%`);
    });

    for (const asset of IMAGE_ASSETS) {
      this.load.image(asset.key, asset.path);
    }
  }

  create() {
    AudioManager.init();

    this.time.delayedCall(200, () => {
      this.scene.start('MenuScene');
    });
  }
}
