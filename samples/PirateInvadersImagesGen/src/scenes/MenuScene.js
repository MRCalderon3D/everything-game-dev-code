import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import LeaderboardClient from '../systems/LeaderboardClient.js';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { addSceneBackground, applyDisplaySize } from '../utils/GeneratedAssetConfig.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    addSceneBackground(this, 'menuBackground');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background, 0.42);

    // Title
    this.add.text(GAME_WIDTH / 2, 80, 'PIRATE\nINVADERS', {
      fontSize: '52px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 160, '\u2620', {
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Play button
    this.createButton(GAME_WIDTH / 2, 220, 'PLAY', () => {
      AudioManager.playSfx('menuSelect');
      this.scene.start('GameScene');
    });

    // Leaderboard
    this.add.text(GAME_WIDTH / 2, 280, 'TOP PIRATES', {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.leaderboardText = this.add.text(GAME_WIDTH / 2, 305, 'Loading...', {
      fontSize: '13px',
      color: '#cccccc',
      fontFamily: 'monospace',
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    this.loadLeaderboard();

    // Instructions
    this.add.text(GAME_WIDTH / 2, 520, [
      'ARROWS or A/D to move',
      'SPACE to fire',
      'ESC to pause',
    ].join('\n'), {
      fontSize: '12px',
      color: '#666666',
      fontFamily: 'monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 580, 'v1.1 \u2022 Pirate Invaders', {
      fontSize: '11px',
      color: '#444444',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }

  async loadLeaderboard() {
    const scores = await LeaderboardClient.getScores();
    if (scores.length === 0) {
      this.leaderboardText.setText('No scores yet \u2014 be the first!');
      return;
    }
    const lines = scores.slice(0, 10).map((s, i) => {
      const rank = String(i + 1).padStart(2, ' ');
      const name = s.name.padEnd(12, ' ');
      const pts = String(s.score).padStart(6, ' ');
      return `${rank}. ${name} ${pts}`;
    });
    this.leaderboardText.setText(lines.join('\n'));
  }

  createButton(x, y, label, callback) {
    const bg = this.add.image(x, y, 'button').setInteractive({ useHandCursor: true });
    applyDisplaySize(bg, 'button');
    const labelText = this.add.text(x, y, label, {
      fontSize: '22px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    const baseScaleX = bg.scaleX;
    const baseScaleY = bg.scaleY;

    bg.on('pointerover', () => {
      bg.setScale(baseScaleX * 1.03, baseScaleY * 1.03);
      bg.setTint(0xfff2c4);
      labelText.setColor('#fff2a8');
    });
    bg.on('pointerout', () => {
      bg.setScale(baseScaleX, baseScaleY);
      bg.clearTint();
      labelText.setColor('#ffd700');
    });
    bg.on('pointerdown', callback);
  }
}
