// GameManager.js — State machine, speed escalation, distance scoring

class GameManager {
    constructor(scoreManager) {
        this.scoreManager = scoreManager;
        this.currentState = 'idle';
        this.worldSpeed = 0;
        this._distanceAccumulator = 0;
        this._distanceScoreRemainder = 0;
        this._pendingFirstRun = true;
        this._totalDistance = 0;

        EventBus.on(EVENTS.PLAYER_DIED, this.endRun, this);
    }

    get totalDistance() { return this._totalDistance; }

    update(dt) {
        if (this.currentState !== 'running') return;

        const delta = this.worldSpeed * dt;
        this._totalDistance += delta;

        // Speed escalation
        this._distanceAccumulator += delta;
        if (this._distanceAccumulator >= GAME_CONFIG.spawn.escalationDistance) {
            this._distanceAccumulator -= GAME_CONFIG.spawn.escalationDistance;
            this.worldSpeed = Math.min(
                this.worldSpeed + GAME_CONFIG.spawn.speedIncrement,
                GAME_CONFIG.spawn.maxSpeed
            );
        }

        // Distance score
        this._distanceScoreRemainder += delta;
        this.scoreManager.addDistanceScore(this._distanceScoreRemainder);
        // Keep fractional remainder
        this._distanceScoreRemainder = this._distanceScoreRemainder % 16;
    }

    startRun() {
        if (this.currentState !== 'idle') return;
        this._resetAllSystems();
        this._transitionTo('running');
    }

    endRun() {
        if (this.currentState !== 'running') return;
        this._transitionTo('dead');
    }

    restartRun() {
        if (this.currentState !== 'dead') return;
        this._resetAllSystems();
        this._transitionTo('running');
    }

    returnToMenu() {
        if (this.currentState !== 'dead') return;
        this._resetAllSystems();
        this._pendingFirstRun = true;
        this._transitionTo('idle');
    }

    applySurgeSpeedBonus(bonus) {
        this.worldSpeed = Math.min(this.worldSpeed + bonus, GAME_CONFIG.spawn.maxSpeed);
    }

    removeSurgeSpeedBonus(bonus) {
        this.worldSpeed = Math.max(this.worldSpeed - bonus, GAME_CONFIG.spawn.initialSpeed);
    }

    _transitionTo(state) {
        this.currentState = state;
        EventBus.emit(EVENTS.STATE_CHANGED, state);

        switch (state) {
            case 'running':
                if (this._pendingFirstRun) {
                    this._pendingFirstRun = false;
                    EventBus.emit(EVENTS.GAME_START);
                } else {
                    EventBus.emit(EVENTS.GAME_RESTART);
                }
                break;
            case 'dead':
                EventBus.emit(EVENTS.GAME_OVER);
                break;
            case 'idle':
                EventBus.emit(EVENTS.RETURN_TO_MENU);
                break;
        }
    }

    _resetAllSystems() {
        this.scoreManager.resetForNewRun();
        this.worldSpeed = GAME_CONFIG.spawn.initialSpeed;
        this._distanceAccumulator = 0;
        this._distanceScoreRemainder = 0;
        this._totalDistance = 0;
    }

    destroy() {
        EventBus.off(EVENTS.PLAYER_DIED, this.endRun, this);
    }
}
