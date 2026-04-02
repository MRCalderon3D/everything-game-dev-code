// GameScene.js — Main scene, wires all systems, runs update loop

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // 1. Core systems
        this.scoreManager = new ScoreManager();
        this.gameManager = new GameManager(this.scoreManager);

        // 2. Visual layers
        this.parallaxBg = new ParallaxBackground(this);
        this.groundScroller = new GroundScroller(this);

        // 3. Player
        this.playerController = new PlayerController(this, this.gameManager);
        this.playerController.sprite.play('player-run');

        // 4. Spawn system
        this.spawnManager = new SpawnManager(this, this.gameManager);

        // 5. Collision
        this.collisionHandler = new CollisionHandler(
            this, this.gameManager, this.playerController, this.spawnManager
        );

        // 6. Modifier system
        this.modifierSystem = new ModifierSystem(
            this.gameManager, this.scoreManager,
            this.spawnManager, this.collisionHandler
        );

        // 7. Wire collectible pickups to score
        EventBus.on(EVENTS.COLLECTIBLE_PICKED_UP, (type) => {
            this.scoreManager.registerPickup(type);
        });

        // 8. Audio
        this.audioManager = new AudioManager(this);

        // 9. Input
        this.inputManager = new InputManager(this);

        // 10. UI
        this.hud = new HUD(this);
        this.chainCounter = new ChainCounter(this);
        this.chainFlash = new ChainFlash(this);
        this.modifierLabel = new ModifierLabel(this);
        this.deathScreen = new DeathScreen(this, this.gameManager);
        this.mainMenu = new MainMenu(this, this.gameManager);

        // 11. Wire game state events to player
        EventBus.on(EVENTS.GAME_START, () => {
            this.playerController.resetToCenter();
            this.playerController.playRunAnimation();
            this.groundScroller.reset();
            this.parallaxBg.reset();
        });

        EventBus.on(EVENTS.GAME_RESTART, () => {
            this.playerController.resetToCenter();
            this.playerController.playRunAnimation();
            this.groundScroller.reset();
            this.parallaxBg.reset();
        });

        EventBus.on(EVENTS.GAME_OVER, () => {
            this.playerController.playDeathAnimation();
        });
    }

    update(time, delta) {
        // dt in seconds
        const dt = delta / 1000;

        if (this.gameManager.currentState === 'running') {
            // 1. Input
            const input = this.inputManager.getInput();
            this.playerController.processDash(input.left, input.right);

            // 2. Game manager (speed, distance scoring)
            this.gameManager.update(dt);

            // 3. Player (dash lerp, recovery)
            this.playerController.update(dt);

            // 4. Spawn (scroll, recycle, spawn)
            this.spawnManager.update(dt);

            // 5. Collision
            this.collisionHandler.update();

            // 6. Modifiers
            this.modifierSystem.update(dt);

            // 7. Visuals
            this.groundScroller.update(dt, this.gameManager.worldSpeed);
            this.parallaxBg.update(dt, this.gameManager.worldSpeed);
        }
    }
}
