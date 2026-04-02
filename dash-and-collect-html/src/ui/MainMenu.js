// MainMenu.js — Play button, high score display

class MainMenu {
    constructor(scene, gameManager) {
        this._scene = scene;
        this._gameManager = gameManager;

        this._container = scene.add.container(0, 0);
        this._container.setDepth(200);

        // Semi-transparent overlay
        this._bg = scene.add.rectangle(160, 90, 320, 180, 0x1a1a1a, 0.85);
        this._container.add(this._bg);

        // Title
        this._title = scene.add.text(160, 50, 'DASH & COLLECT', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this._container.add(this._title);

        // High score
        this._highScoreText = scene.add.text(160, 75, '', {
            fontFamily: 'monospace',
            fontSize: '8px',
            color: '#aaaaaa',
            align: 'center'
        }).setOrigin(0.5);
        this._container.add(this._highScoreText);

        // Play button
        this._playBtn = scene.add.text(160, 110, '[ PLAY ]', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#33ccff',
            align: 'center',
            backgroundColor: '#333333',
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this._playBtn.on('pointerover', () => this._playBtn.setColor('#ffffff'));
        this._playBtn.on('pointerout', () => this._playBtn.setColor('#33ccff'));
        this._playBtn.on('pointerdown', () => this._onPlay());
        this._container.add(this._playBtn);

        // Show initially
        this._updateHighScore();

        EventBus.on(EVENTS.RETURN_TO_MENU, this._show, this);
        EventBus.on(EVENTS.GAME_START, this._onGameStart, this);
    }

    _onPlay() {
        this._playBtn.disableInteractive();
        UIAnimator.fadeOut(this._scene, this._container, 200);
        this._scene.time.delayedCall(220, () => {
            this._container.setVisible(false);
            this._gameManager.startRun();
        });
    }

    _onGameStart() {
        // Defensive: hide if still visible
        if (this._container.visible && this._container.alpha > 0) {
            this._container.setVisible(false);
            this._container.alpha = 0;
        }
    }

    _show() {
        this._updateHighScore();
        this._container.setVisible(true);
        this._playBtn.setInteractive({ useHandCursor: true });
        UIAnimator.fadeIn(this._scene, this._container, 200);
    }

    _updateHighScore() {
        const best = this._gameManager.scoreManager.personalBest;
        this._highScoreText.setText('HIGH SCORE: ' + best);
    }

    destroy() {
        EventBus.off(EVENTS.RETURN_TO_MENU, this._show, this);
        EventBus.off(EVENTS.GAME_START, this._onGameStart, this);
    }
}
