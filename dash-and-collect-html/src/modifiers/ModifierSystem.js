// ModifierSystem.js — Chain completion → modifier effects, timers

class ModifierSystem {
    constructor(gameManager, scoreManager, spawnManager, collisionHandler) {
        this._gameManager = gameManager;
        this._scoreManager = scoreManager;
        this._spawnManager = spawnManager;
        this._collisionHandler = collisionHandler;

        this._activeModifier = null;
        this._timer = 0;

        EventBus.on(EVENTS.CHAIN_COMPLETED, this._onChainCompleted, this);
        EventBus.on(EVENTS.GAME_OVER, this._resetAll, this);
        EventBus.on(EVENTS.GAME_RESTART, this._resetAll, this);
    }

    update(dt) {
        if (!this._activeModifier) return;

        this._timer -= dt * 1000;
        if (this._timer <= 0) {
            this._expire();
        }
    }

    _onChainCompleted(type) {
        // Cancel current modifier before applying new
        if (this._activeModifier) {
            this._expire();
        }

        switch (type) {
            case 'dash':
                this._activeModifier = 'dash';
                this._timer = GAME_CONFIG.modifiers.dashBiasDuration;
                this._spawnManager.setModifierBias('dash');
                break;

            case 'shield':
                this._activeModifier = 'shield';
                this._timer = GAME_CONFIG.modifiers.shieldDuration;
                this._collisionHandler.activateShield();
                break;

            case 'surge':
                this._activeModifier = 'surge';
                this._timer = GAME_CONFIG.modifiers.surgeDuration;
                this._scoreManager.setMultiplier(GAME_CONFIG.modifiers.surgeMultiplier);
                this._gameManager.applySurgeSpeedBonus(GAME_CONFIG.modifiers.surgeSpeedBonus);
                break;
        }
    }

    _expire() {
        switch (this._activeModifier) {
            case 'dash':
                this._spawnManager.setModifierBias(null);
                break;
            case 'shield':
                this._collisionHandler.deactivateShield();
                break;
            case 'surge':
                this._scoreManager.setMultiplier(1);
                this._gameManager.removeSurgeSpeedBonus(GAME_CONFIG.modifiers.surgeSpeedBonus);
                break;
        }
        this._activeModifier = null;
        this._timer = 0;
    }

    _resetAll() {
        if (this._activeModifier) this._expire();
    }

    destroy() {
        EventBus.off(EVENTS.CHAIN_COMPLETED, this._onChainCompleted, this);
        EventBus.off(EVENTS.GAME_OVER, this._resetAll, this);
        EventBus.off(EVENTS.GAME_RESTART, this._resetAll, this);
    }
}
