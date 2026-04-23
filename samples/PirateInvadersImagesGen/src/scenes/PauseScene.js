import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { applyDisplaySize, createImageBar } from '../utils/GeneratedAssetConfig.js';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 0.7
    );

    this.add.text(GAME_WIDTH / 2, 180, 'PAUSED', {
      fontSize: '48px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Resume button
    this.createButton(GAME_WIDTH / 2, 300, 'RESUME', () => {
      AudioManager.playSfx('menuSelect');
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    // Main menu button
    this.createButton(GAME_WIDTH / 2, 370, 'MAIN MENU', () => {
      AudioManager.playSfx('menuSelect');
      AudioManager.stopMusic();
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });

    // Volume controls
    this.add.text(GAME_WIDTH / 2, 440, 'SFX', {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.sfxBar = this.createVolumeBar(GAME_WIDTH / 2, 465, AudioManager.getSfxVolume(), (v) => {
      AudioManager.setSfxVolume(v);
    });

    this.add.text(GAME_WIDTH / 2, 490, 'MUSIC', {
      fontSize: '14px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.musicBar = this.createVolumeBar(GAME_WIDTH / 2, 515, AudioManager.getMusicVolume(), (v) => {
      AudioManager.setMusicVolume(v);
    });

    // ESC to resume
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }

  createButton(x, y, label, callback) {
    const bg = this.add.image(x, y, 'button').setInteractive({ useHandCursor: true });
    applyDisplaySize(bg, 'button');
    this.add.text(x, y, label, {
      fontSize: '20px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setTexture('buttonHover'));
    bg.on('pointerout', () => bg.setTexture('button'));
    bg.on('pointerdown', callback);
  }

  createVolumeBar(x, y, initialValue, onChange) {
    const barWidth = 160;
    const barX = x - barWidth / 2;
    const bar = createImageBar(this, x, y, barWidth + 24, barWidth, initialValue);

    const hitArea = this.add.rectangle(x, y, barWidth + 20, 30, 0x000000, 0)
      .setInteractive({ useHandCursor: true });

    hitArea.on('pointerdown', (pointer) => {
      const localX = pointer.x - barX;
      const value = Phaser.Math.Clamp(localX / barWidth, 0, 1);
      bar.setValue(value);
      onChange(value);
    });

    hitArea.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        const localX = pointer.x - barX;
        const value = Phaser.Math.Clamp(localX / barWidth, 0, 1);
        bar.setValue(value);
        onChange(value);
      }
    });

    return bar;
  }
}
