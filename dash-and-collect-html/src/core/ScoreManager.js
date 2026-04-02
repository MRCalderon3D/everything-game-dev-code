// ScoreManager.js — Scoring, chain logic, multiplier, personal best

class ScoreManager {
    constructor() {
        this._score = 0;
        this._chainCount = 0;
        this._chainType = null;
        this._coinsEarnedThisRun = 0;
        this._personalBest = SaveSystem.loadHighScore();
        this._multiplier = 1;
        this._highScoreBeatenThisRun = false;
    }

    get personalBest() { return this._personalBest; }

    resetForNewRun() {
        this._score = 0;
        this._chainCount = 0;
        this._chainType = null;
        this._coinsEarnedThisRun = 0;
        this._multiplier = 1;
        this._highScoreBeatenThisRun = false;
        this._emitChanged();
    }

    registerPickup(type) {
        // Score the pickup
        this._score += Math.round(GAME_CONFIG.score.basePickupScore * this._multiplier);

        // Chain logic — coins never chain
        if (type !== 'coin') {
            if (type === this._chainType) {
                this._chainCount++;
            } else {
                this._chainType = type;
                this._chainCount = 1;
            }

            // Chain completion at 3
            if (this._chainCount >= 3) {
                this._score += Math.round(GAME_CONFIG.score.chainBonusScore * this._multiplier);
                this._coinsEarnedThisRun += GAME_CONFIG.score.coinsPerChain;
                EventBus.emit(EVENTS.CHAIN_COMPLETED, type);
                this._chainCount = 0;
                this._chainType = null;
            }
        }

        this._checkHighScore();
        this._emitChanged();
    }

    addDistanceScore(pixels) {
        // +1 per 16px (1 Unity unit = 16px)
        const metres = Math.floor(pixels / 16);
        if (metres > 0) {
            this._score += metres;
            this._checkHighScore();
            this._emitChanged();
        }
        return metres;
    }

    setMultiplier(m) {
        this._multiplier = m;
    }

    getRunSummary() {
        return {
            score: this._score,
            chainCount: this._chainCount,
            chainType: this._chainType,
            coinsEarnedThisRun: this._coinsEarnedThisRun,
            personalBest: this._personalBest,
            isNewPersonalBest: this._highScoreBeatenThisRun
        };
    }

    _checkHighScore() {
        if (this._score > this._personalBest) {
            this._personalBest = this._score;
            SaveSystem.saveHighScore(this._personalBest);
            if (!this._highScoreBeatenThisRun) {
                this._highScoreBeatenThisRun = true;
                EventBus.emit(EVENTS.HIGH_SCORE_BEATEN, this._personalBest);
            }
        }
    }

    _emitChanged() {
        EventBus.emit(EVENTS.SCORE_CHANGED, this.getRunSummary());
    }
}
