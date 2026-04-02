// ChainCounter.js — 3 dots showing chain progress, colored by type

class ChainCounter {
    constructor(scene) {
        this._scene = scene;
        this._dots = [];
        this._container = scene.add.container(0, 0);
        this._container.setDepth(100);
        this._container.alpha = 0;

        // 3 dots positioned near player
        for (let i = 0; i < 3; i++) {
            const dot = scene.add.circle(148 + i * 12, 140, 3, 0x4d4d4d, 0);
            this._container.add(dot);
            this._dots.push(dot);
        }

        EventBus.on(EVENTS.SCORE_CHANGED, this._onScoreChanged, this);
        EventBus.on(EVENTS.GAME_START, () => { this._container.alpha = 1; });
        EventBus.on(EVENTS.GAME_RESTART, () => { this._container.alpha = 1; });
        EventBus.on(EVENTS.GAME_OVER, () => { this._container.alpha = 0; });
        EventBus.on(EVENTS.RETURN_TO_MENU, () => { this._container.alpha = 0; });
    }

    _onScoreChanged(snapshot) {
        const color = this._getColor(snapshot.chainType);

        for (let i = 0; i < 3; i++) {
            if (i < snapshot.chainCount) {
                this._dots[i].setFillStyle(color, 1);
            } else {
                this._dots[i].setFillStyle(GAME_CONFIG.colors.grey, 0.3);
            }
        }
    }

    _getColor(type) {
        switch (type) {
            case 'dash':   return GAME_CONFIG.colors.dash;
            case 'shield': return GAME_CONFIG.colors.shield;
            case 'surge':  return GAME_CONFIG.colors.surge;
            default:       return GAME_CONFIG.colors.grey;
        }
    }
}
