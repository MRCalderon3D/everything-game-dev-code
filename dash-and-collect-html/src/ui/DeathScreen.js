// DeathScreen.js — Final score, retry/menu buttons with animated transitions

class DeathScreen {
    constructor(scene, gameManager) {
        this._scene = scene;
        this._gameManager = gameManager;

        this._container = scene.add.container(0, 0);
        this._container.setDepth(210);
        this._container.alpha = 0;
        this._container.setVisible(false);

        // Semi-transparent overlay
        this._overlay = scene.add.rectangle(160, 90, 320, 180, 0x000000, 0.5);
        this._container.add(this._overlay);

        // Result panel
        this._panel = scene.add.container(160, 90);
        this._container.add(this._panel);

        const panelBg = scene.add.rectangle(0, 0, 200, 120, 0x1a1a1a, 0.95);
        panelBg.setStrokeStyle(1, 0xe0e0e0);
        this._panel.add(panelBg);

        // Game Over title
        this._gameOverText = scene.add.text(0, -40, 'GAME OVER', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#ff4444',
            align: 'center'
        }).setOrigin(0.5);
        this._panel.add(this._gameOverText);

        // Final score
        this._scoreText = scene.add.text(0, -15, '0', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this._panel.add(this._scoreText);

        // Retry button
        this._retryBtn = scene.add.text(-45, 20, '[ RETRY ]', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#33ccff',
            backgroundColor: '#333333',
            padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this._retryBtn.on('pointerover', () => this._retryBtn.setColor('#ffffff'));
        this._retryBtn.on('pointerout', () => this._retryBtn.setColor('#33ccff'));
        this._retryBtn.on('pointerdown', () => this._onRetry());
        this._panel.add(this._retryBtn);

        // Menu button
        this._menuBtn = scene.add.text(45, 20, '[ MENU ]', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#33ccff',
            backgroundColor: '#333333',
            padding: { x: 6, y: 4 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this._menuBtn.on('pointerover', () => this._menuBtn.setColor('#ffffff'));
        this._menuBtn.on('pointerout', () => this._menuBtn.setColor('#33ccff'));
        this._menuBtn.on('pointerdown', () => this._onMenu());
        this._panel.add(this._menuBtn);

        EventBus.on(EVENTS.GAME_OVER, this._show, this);
        EventBus.on(EVENTS.GAME_START, this._hide, this);
        EventBus.on(EVENTS.GAME_RESTART, this._hide, this);
        EventBus.on(EVENTS.RETURN_TO_MENU, this._hide, this);
    }

    _show() {
        const summary = this._gameManager.scoreManager.getRunSummary();
        this._scoreText.setText(summary.score.toString());

        this._container.setVisible(true);
        this._container.alpha = 0;
        this._panel.setScale(0.8);

        this._retryBtn.setInteractive({ useHandCursor: true });
        this._menuBtn.setInteractive({ useHandCursor: true });

        UIAnimator.fadeIn(this._scene, this._container, 200);
        UIAnimator.scaleFrom(this._scene, this._panel, 0.8, 250, 'Back.easeOut');
    }

    _hide() {
        this._container.setVisible(false);
        this._container.alpha = 0;
    }

    _onRetry() {
        this._retryBtn.disableInteractive();
        this._menuBtn.disableInteractive();
        UIAnimator.fadeOut(this._scene, this._container, 150);
        this._scene.time.delayedCall(170, () => {
            this._hide();
            this._gameManager.restartRun();
        });
    }

    _onMenu() {
        this._retryBtn.disableInteractive();
        this._menuBtn.disableInteractive();
        UIAnimator.fadeOut(this._scene, this._container, 150);
        this._scene.time.delayedCall(170, () => {
            this._hide();
            this._gameManager.returnToMenu();
        });
    }

    destroy() {
        EventBus.off(EVENTS.GAME_OVER, this._show, this);
        EventBus.off(EVENTS.GAME_START, this._hide, this);
        EventBus.off(EVENTS.GAME_RESTART, this._hide, this);
        EventBus.off(EVENTS.RETURN_TO_MENU, this._hide, this);
    }
}
