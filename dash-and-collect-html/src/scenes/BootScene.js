// BootScene.js — Asset preloading

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading text
        const loadText = this.add.text(160, 90, 'Loading...', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Sprites — single images
        this.load.image('ground', 'assets/sprites/ground-coastal-idle.png');
        this.load.image('bg-far', 'assets/sprites/bg-coastal-far.png');
        this.load.image('bg-mid', 'assets/sprites/bg-coastal-mid.png');
        this.load.image('bg-near', 'assets/sprites/bg-coastal-near.png');
        this.load.image('hazard-block', 'assets/sprites/hazard-block-idle.png');
        this.load.image('coin', 'assets/sprites/coin-default-idle.png');
        this.load.image('collectible-dash', 'assets/sprites/collectible-dash-idle.png');
        this.load.image('collectible-shield', 'assets/sprites/collectible-shield-idle.png');
        this.load.image('collectible-surge', 'assets/sprites/collectible-surge-idle.png');

        // Sprite sheets
        this.load.spritesheet('player-run', 'assets/sprites/player-default-run-sheet.png', {
            frameWidth: 16, frameHeight: 32
        });
        this.load.spritesheet('player-idle', 'assets/sprites/player-default-idle-sheet.png', {
            frameWidth: 16, frameHeight: 32
        });
        this.load.spritesheet('player-death', 'assets/sprites/player-default-death-sheet.png', {
            frameWidth: 16, frameHeight: 32
        });
        this.load.spritesheet('coin-spin', 'assets/sprites/coin-gold-spin-sheet.png', {
            frameWidth: 16, frameHeight: 16
        });

        // Audio
        this.load.audio('sfx-dash', 'assets/audio/Dash.wav');
        this.load.audio('sfx-collect', 'assets/audio/Collect.wav');
        this.load.audio('sfx-gameover', 'assets/audio/GameOver.wav');
        this.load.audio('bgm', 'assets/audio/BGM.wav');
    }

    create() {
        // Create animations
        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'player-death',
            frames: this.anims.generateFrameNumbers('player-death', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.start('GameScene');
    }
}
