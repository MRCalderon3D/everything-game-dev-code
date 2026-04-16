import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import LeaderboardClient from '../systems/LeaderboardClient.js';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalWave = data.wave || 1;
    this.highScore = data.highScore || 0;
    this.isNewHighScore = data.isNewHighScore || false;
    this.submitted = false;
    this.playerName = '';
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);

    this.add.text(GAME_WIDTH / 2, 60, 'YE BE SUNK!', {
      fontSize: '42px',
      color: '#e74c3c',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 110, `SCORE: ${this.finalScore}   WAVE: ${this.finalWave}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Name input prompt
    this.add.text(GAME_WIDTH / 2, 170, 'ENTER YER NAME, PIRATE:', {
      fontSize: '16px',
      color: '#ffd700',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.nameDisplay = this.add.text(GAME_WIDTH / 2, 210, '_', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.statusText = this.add.text(GAME_WIDTH / 2, 250, '', {
      fontSize: '14px',
      color: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Keyboard input for name
    this.input.keyboard.on('keydown', (event) => {
      if (this.submitted) return;

      if (event.key === 'Enter' && this.playerName.length > 0) {
        this.submitScore();
        return;
      }
      if (event.key === 'Backspace') {
        this.playerName = this.playerName.slice(0, -1);
        this.updateNameDisplay();
        return;
      }
      if (event.key.length === 1 && this.playerName.length < 12) {
        const char = event.key;
        if (/^[a-zA-Z0-9 _\-]$/.test(char)) {
          this.playerName += char.toUpperCase();
          this.updateNameDisplay();
        }
      }
    });

    // Submit button (for touch / mouse)
    this.submitBtn = this.createButton(GAME_WIDTH / 2, 300, 'SUBMIT SCORE', () => {
      if (!this.submitted && this.playerName.length > 0) {
        this.submitScore();
      }
    });

    // Buttons below (initially hidden until submit or skip)
    this.playAgainBtn = this.createButton(GAME_WIDTH / 2, 390, 'PLAY AGAIN', () => {
      AudioManager.playSfx('menuSelect');
      this.scene.start('GameScene');
    });
    this.playAgainBtn.bg.setVisible(false);
    this.playAgainBtn.label.setVisible(false);

    this.menuBtn = this.createButton(GAME_WIDTH / 2, 450, 'MAIN MENU', () => {
      AudioManager.playSfx('menuSelect');
      this.scene.start('MenuScene');
    });
    this.menuBtn.bg.setVisible(false);
    this.menuBtn.label.setVisible(false);

    // Leaderboard display area
    this.leaderboardTitle = this.add.text(GAME_WIDTH / 2, 370, '', {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setVisible(false);

    this.leaderboardText = this.add.text(GAME_WIDTH / 2, 395, '', {
      fontSize: '13px',
      color: '#cccccc',
      fontFamily: 'monospace',
      lineSpacing: 4,
    }).setOrigin(0.5, 0).setVisible(false);

    // Mobile: show a tap-to-type approach
    if ('ontouchstart' in window) {
      this.statusText.setText('Tap here to type your name');
      const hitArea = this.add.rectangle(GAME_WIDTH / 2, 210, 300, 50, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      hitArea.on('pointerdown', () => {
        if (this.submitted) return;
        const input = prompt('Enter your pirate name (max 12 chars):');
        if (input && input.trim().length > 0) {
          this.playerName = input.trim().slice(0, 12).toUpperCase();
          this.updateNameDisplay();
        }
      });
    }
  }

  updateNameDisplay() {
    this.nameDisplay.setText(this.playerName.length > 0 ? this.playerName : '_');
  }

  async submitScore() {
    this.submitted = true;
    this.statusText.setText('Submitting...');
    this.submitBtn.bg.setVisible(false);
    this.submitBtn.label.setVisible(false);

    const result = await LeaderboardClient.submitScore(
      this.playerName,
      this.finalScore,
      this.finalWave
    );

    if (result) {
      this.statusText.setText(`Rank #${result.rank}!`);
      this.statusText.setColor('#ffd700');
    } else {
      this.statusText.setText('Score saved locally');
    }

    // Show leaderboard
    const scores = await LeaderboardClient.getScores();
    if (scores.length > 0) {
      this.leaderboardTitle.setText('LEADERBOARD').setVisible(true);
      const lines = scores.slice(0, 10).map((s, i) => {
        const rank = String(i + 1).padStart(2, ' ');
        const name = s.name.padEnd(12, ' ');
        const pts = String(s.score).padStart(6, ' ');
        const marker = (s.name === this.playerName && s.score === this.finalScore) ? ' <<' : '';
        return `${rank}. ${name} ${pts}${marker}`;
      });
      this.leaderboardText.setText(lines.join('\n')).setVisible(true);
    }

    // Show navigation buttons below leaderboard
    const bottomY = this.leaderboardText.visible
      ? this.leaderboardText.y + this.leaderboardText.height + 30
      : 400;

    this.playAgainBtn.bg.setY(Math.min(bottomY, 520));
    this.playAgainBtn.label.setY(Math.min(bottomY, 520));
    this.playAgainBtn.bg.setVisible(true);
    this.playAgainBtn.label.setVisible(true);

    this.menuBtn.bg.setY(Math.min(bottomY + 55, 575));
    this.menuBtn.label.setY(Math.min(bottomY + 55, 575));
    this.menuBtn.bg.setVisible(true);
    this.menuBtn.label.setVisible(true);
  }

  createButton(x, y, label, callback) {
    const bg = this.add.image(x, y, 'button').setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setTexture('buttonHover'));
    bg.on('pointerout', () => bg.setTexture('button'));
    bg.on('pointerdown', callback);

    return { bg, label: text };
  }
}
