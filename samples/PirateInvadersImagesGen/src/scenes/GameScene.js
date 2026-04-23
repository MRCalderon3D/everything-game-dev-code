import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Bullet from '../entities/Bullet.js';
import { EnemyFormation } from '../entities/Enemy.js';
import PowerUp from '../entities/PowerUp.js';
import WaveManager from '../systems/WaveManager.js';
import ScoreManager from '../systems/ScoreManager.js';
import AudioManager from '../systems/AudioManager.js';
import { COLORS, GAME_WIDTH, GAME_HEIGHT, BULLET, ENEMIES, POWERUPS, PLAYER } from '../config.js';
import { addSceneBackground, applyDisplaySize, createImageBar } from '../utils/GeneratedAssetConfig.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    addSceneBackground(this, 'battleBackground');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background, 0.3).setDepth(-900);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,SPACE,ESC,P');

    // Player
    this.player = new Player(this, GAME_WIDTH / 2, PLAYER.y);

    // Bullet pools
    this.playerBullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true,
    });

    // Power-up group
    this.powerUps = this.physics.add.group({ runChildUpdate: true });

    // Enemy formation
    this.formation = new EnemyFormation(this);

    // Systems
    this.scoreManager = new ScoreManager();
    this.waveManager = new WaveManager(this, this.formation);

    // Collisions
    this.physics.add.overlap(
      this.playerBullets,
      this.formation.group,
      this.onBulletHitEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.enemyBullets,
      this.player,
      this.onEnemyBulletHitPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.onPlayerCollectPowerUp,
      null,
      this
    );

    // HUD
    this.createHUD();

    this.isGameOver = false;

    // Start music and first wave
    AudioManager.playMusic();
    this.startNextWave();

    // Pause handling
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    this.enemyFireTimer = 0;
  }

  createHUD() {
    this.scoreText = this.add.text(16, 16, 'SCORE: 0', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'monospace',
    });

    this.waveText = this.add.text(GAME_WIDTH - 16, 16, 'WAVE: 1', {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'monospace',
    }).setOrigin(1, 0);

    this.livesContainer = this.add.container(16, GAME_HEIGHT - 30);
    this.updateLivesDisplay();

    this.powerUpText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, '', {
      fontSize: '14px',
      color: '#ffd700',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.powerUpBar = createImageBar(this, GAME_WIDTH / 2, GAME_HEIGHT - 35, 120, 100, 1);
    this.powerUpBar.setVisible(false);
  }

  updateLivesDisplay() {
    this.livesContainer.removeAll(true);
    for (let i = 0; i < this.player.lives; i++) {
      const icon = this.add.image(i * 25, 0, 'lifeIcon');
      applyDisplaySize(icon, 'lifeIcon');
      this.livesContainer.add(icon);
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    // Player input
    const fired = this.player.handleInput(this.cursors, this.keys, time);
    if (fired) {
      this.firePlayerBullet();
    }

    // Formation movement
    this.formation.update(time, delta);

    // Enemy firing
    this.enemyFireTimer += delta;
    if (this.enemyFireTimer > 500) {
      this.enemyFireTimer = 0;
      this.tryEnemyFire(time);
    }

    // Check if enemies reached the bottom
    if (this.formation.getLowestY() > GAME_HEIGHT - 80) {
      this.gameOver();
      return;
    }

    // Wave complete check
    if (this.waveManager.checkWaveComplete()) {
      const bonus = this.waveManager.getWaveBonus();
      this.scoreManager.addWaveBonus(bonus);
      AudioManager.playSfx('waveComplete');

      this.showWaveBanner(`WAVE ${this.waveManager.waveNumber} CLEARED! +${bonus}`, () => {
        this.startNextWave();
      });
    }

    // Update HUD
    this.scoreText.setText(`SCORE: ${this.scoreManager.score}`);
    this.waveText.setText(`WAVE: ${this.waveManager.waveNumber}`);

    // Power-up indicator
    if (this.player.activePowerUp) {
      const names = { tripleShot: 'TRIPLE SHOT', shield: 'SHIELD', rapidFire: 'RAPID FIRE' };
      this.powerUpText.setText(names[this.player.activePowerUp] || '');
      this.powerUpBar.setVisible(true);
      this.powerUpBar.setValue(this.player.getPowerUpTimeLeft());
    } else {
      this.powerUpText.setText('');
      this.powerUpBar.setVisible(false);
    }
  }

  firePlayerBullet() {
    AudioManager.playSfx('cannonFire');

    if (this.player.activePowerUp === 'tripleShot') {
      this.spawnPlayerBullet(this.player.x, this.player.y - 20, BULLET.playerSpeed, -60);
      this.spawnPlayerBullet(this.player.x, this.player.y - 20, BULLET.playerSpeed, 0);
      this.spawnPlayerBullet(this.player.x, this.player.y - 20, BULLET.playerSpeed, 60);
    } else {
      this.spawnPlayerBullet(this.player.x, this.player.y - 20, BULLET.playerSpeed, 0);
    }
  }

  spawnPlayerBullet(x, y, vy, vx) {
    let bullet = this.playerBullets.getFirstDead(false);
    if (!bullet) {
      bullet = new Bullet(this, x, y, 'playerBullet');
      this.playerBullets.add(bullet);
    }
    bullet.fire(x, y, vy, vx);
  }

  tryEnemyFire(time) {
    const alive = this.formation.group.getChildren().filter(e => e.active);
    if (alive.length === 0) return;

    const shooter = Phaser.Utils.Array.GetRandom(alive);
    if (!shooter.canFire(time)) return;

    if (shooter.spread) {
      this.spawnEnemyBullet(shooter.x, shooter.y + 20, ENEMIES.bulletSpeed, -40);
      this.spawnEnemyBullet(shooter.x, shooter.y + 20, ENEMIES.bulletSpeed, 0);
      this.spawnEnemyBullet(shooter.x, shooter.y + 20, ENEMIES.bulletSpeed, 40);
    } else {
      this.spawnEnemyBullet(shooter.x, shooter.y + 20, ENEMIES.bulletSpeed, 0);
    }
  }

  spawnEnemyBullet(x, y, vy, vx) {
    let bullet = this.enemyBullets.getFirstDead(false);
    if (!bullet) {
      bullet = new Bullet(this, x, y, 'enemyBullet');
      this.enemyBullets.add(bullet);
    }
    bullet.fire(x, y, vy, vx);
  }

  onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.deactivate();

    const destroyed = enemy.hit();
    if (destroyed) {
      this.scoreManager.add(enemy.points);
      AudioManager.playSfx('enemyDestroy');

      // Power-up drop
      if (Math.random() < POWERUPS.dropChance) {
        const pu = new PowerUp(this, enemy.x, enemy.y);
        this.powerUps.add(pu);
        pu.body.setVelocityY(POWERUPS.fallSpeed);
      }

      // Destroy effect
      const popScaleX = enemy.scaleX * 1.18;
      const popScaleY = enemy.scaleY * 1.18;
      this.tweens.add({
        targets: enemy,
        alpha: 0,
        scaleX: popScaleX,
        scaleY: popScaleY,
        duration: 150,
        onComplete: () => {
          enemy.setActive(false);
          enemy.setVisible(false);
          enemy.body.enable = false;
        },
      });
    } else {
      AudioManager.playSfx('enemyHit');
    }
  }

  onEnemyBulletHitPlayer(a, b) {
    if (this.isGameOver) return;

    // Identify which is the bullet and which is the player regardless of order
    const bullet = a === this.player ? b : a;
    const player = a === this.player ? a : b;

    if (!bullet.active || !player.active) return;

    bullet.setActive(false);
    bullet.setVisible(false);
    if (bullet.body) {
      bullet.body.enable = false;
      bullet.body.setVelocity(0);
    }

    const dead = player.hit();
    AudioManager.playSfx('playerHit');
    this.updateLivesDisplay();

    if (dead) {
      this.gameOver();
    }
  }

  onPlayerCollectPowerUp(player, powerUp) {
    if (!powerUp.active) return;
    const type = powerUp.powerUpType;
    powerUp.destroy();
    player.applyPowerUp(type);
    AudioManager.playSfx('powerupCollect');
  }

  startNextWave() {
    // Clear remaining bullets
    this.playerBullets.getChildren().forEach(b => {
      if (b.deactivate) b.deactivate();
    });
    this.enemyBullets.getChildren().forEach(b => {
      if (b.deactivate) b.deactivate();
    });
    this.powerUps.clear(true, true);

    this.waveManager.startWave();
  }

  showWaveBanner(text, callback) {
    const banner = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, text, {
      fontSize: '28px',
      color: '#ffd700',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: 1,
      duration: 300,
      yoyo: true,
      hold: 1000,
      onComplete: () => {
        banner.destroy();
        if (callback) callback();
      },
    });
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    AudioManager.stopMusic();
    AudioManager.playSfx('gameOver');
    this.scoreManager.save();

    this.scene.start('GameOverScene', {
      score: this.scoreManager.score,
      wave: this.waveManager.waveNumber,
      highScore: this.scoreManager.highScore,
      isNewHighScore: this.scoreManager.isNewHighScore(),
    });
  }
}
