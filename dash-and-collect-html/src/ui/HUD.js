// HUD.js — Score, coins, personal best labels with feedback animations

class HUD {
    constructor(scene) {
        this._scene = scene;
        this._container = scene.add.container(0, 0);
        this._container.setDepth(100);
        this._container.alpha = 0;

        this._lastScore = 0;
        this._lastCoins = 0;

        // Score label — top center
        this._scoreText = scene.add.text(160, 6, '0', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0);
        this._container.add(this._scoreText);

        // Coin icon + label — top right
        this._coinIcon = scene.add.text(280, 6, '*', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#ffee58'
        }).setOrigin(0.5, 0);
        this._container.add(this._coinIcon);

        this._coinText = scene.add.text(292, 6, '0', {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#ffffff'
        }).setOrigin(0, 0);
        this._container.add(this._coinText);

        // Personal best — top left
        this._bestText = scene.add.text(8, 6, 'BEST: 0', {
            fontFamily: 'monospace',
            fontSize: '8px',
            color: '#888888'
        }).setOrigin(0, 0);
        this._container.add(this._bestText);

        EventBus.on(EVENTS.SCORE_CHANGED, this._onScoreChanged, this);
        EventBus.on(EVENTS.GAME_START, this._show, this);
        EventBus.on(EVENTS.GAME_RESTART, this._show, this);
        EventBus.on(EVENTS.GAME_OVER, this._hide, this);
        EventBus.on(EVENTS.RETURN_TO_MENU, this._hide, this);
    }

    _show() {
        this._container.alpha = 1;
    }

    _hide() {
        this._container.alpha = 0;
    }

    _onScoreChanged(snapshot) {
        this._scoreText.setText(snapshot.score.toString());
        this._coinText.setText(snapshot.coinsEarnedThisRun.toString());
        this._bestText.setText('BEST: ' + snapshot.personalBest);

        // Score punch
        if (snapshot.score !== this._lastScore) {
            UIAnimator.punchScale(this._scene, this._scoreText, 1.15, 100);
        }

        // Coin punch + flash
        if (snapshot.coinsEarnedThisRun !== this._lastCoins) {
            UIAnimator.punchScale(this._scene, this._coinIcon, 1.25, 150);
            // Yellow flash on coin text
            this._coinText.setColor('#ffee58');
            this._scene.time.delayedCall(150, () => {
                this._coinText.setColor('#ffffff');
            });
        }

        this._lastScore = snapshot.score;
        this._lastCoins = snapshot.coinsEarnedThisRun;
    }

    destroy() {
        EventBus.off(EVENTS.SCORE_CHANGED, this._onScoreChanged, this);
        EventBus.off(EVENTS.GAME_START, this._show, this);
        EventBus.off(EVENTS.GAME_RESTART, this._show, this);
        EventBus.off(EVENTS.GAME_OVER, this._hide, this);
        EventBus.off(EVENTS.RETURN_TO_MENU, this._hide, this);
    }
}
