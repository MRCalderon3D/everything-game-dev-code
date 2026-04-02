// PlayerController.js — 3-lane snap dash, recovery, input queue

class PlayerController {
    constructor(scene, gameManager) {
        this._scene = scene;
        this._gameManager = gameManager;
        this.currentLane = 1;

        // Create player sprite at center lane, near bottom
        this.sprite = scene.physics.add.sprite(
            GAME_CONFIG.lanes.positions[1],
            GAME_CONFIG.player.spawnY,
            GAME_CONFIG.player.spriteKey
        );
        this.sprite.setDepth(10);
        this.sprite.body.setSize(12, 24);  // hitbox smaller than visual

        // Dash state
        this._dashTimer = 0;
        this._dashDuration = GAME_CONFIG.player.dashDuration;
        this._dashStartX = 0;
        this._dashTargetX = 0;

        // Recovery state
        this._recoveryTimer = 0;
        this._recoveryDuration = GAME_CONFIG.player.recoveryDuration;
        this._isInRecovery = false;

        // Input queue
        this._queuedDirection = 0; // -1 left, +1 right, 0 none
    }

    get isInRecovery() { return this._isInRecovery; }

    update(dt) {
        if (this._gameManager.currentState !== 'running') return;

        const dtMs = dt * 1000;

        // Dash lerp
        if (this._dashTimer > 0) {
            this._dashTimer -= dtMs;
            const t = 1 - Math.max(0, this._dashTimer / this._dashDuration);
            this.sprite.x = this._dashStartX + (this._dashTargetX - this._dashStartX) * t;

            if (this._dashTimer <= 0) {
                this.sprite.x = this._dashTargetX;
                this._dashTimer = 0;
                // Enter recovery
                this._isInRecovery = true;
                this._recoveryTimer = this._recoveryDuration;
            }
        }

        // Recovery countdown
        if (this._isInRecovery) {
            this._recoveryTimer -= dtMs;
            if (this._recoveryTimer <= 0) {
                this._isInRecovery = false;
                this._recoveryTimer = 0;
                // Execute queued dash
                if (this._queuedDirection !== 0) {
                    this._executeDash(this._queuedDirection);
                    this._queuedDirection = 0;
                }
            }
        }
    }

    processDash(left, right) {
        if (this._gameManager.currentState !== 'running') return;

        const direction = left ? -1 : right ? 1 : 0;
        if (direction === 0) return;

        if (this._isInRecovery || this._dashTimer > 0) {
            // Queue the input — overwrites previous queue
            this._queuedDirection = direction;
            return;
        }

        this._executeDash(direction);
    }

    _executeDash(direction) {
        const targetLane = this.currentLane + direction;
        if (targetLane < 0 || targetLane >= GAME_CONFIG.lanes.count) return;

        this.currentLane = targetLane;
        this._dashStartX = this.sprite.x;
        this._dashTargetX = GAME_CONFIG.lanes.positions[targetLane];
        this._dashTimer = this._dashDuration;

        EventBus.emit(EVENTS.LANE_CHANGED, targetLane);
    }

    resetToCenter() {
        this.currentLane = 1;
        this.sprite.x = GAME_CONFIG.lanes.positions[1];
        this.sprite.y = GAME_CONFIG.player.spawnY;
        this._dashTimer = 0;
        this._recoveryTimer = 0;
        this._isInRecovery = false;
        this._queuedDirection = 0;
    }

    playRunAnimation() {
        if (this.sprite.anims && this._scene.anims.exists('player-run')) {
            this.sprite.play('player-run', true);
        }
    }

    playDeathAnimation() {
        if (this.sprite.anims && this._scene.anims.exists('player-death')) {
            this.sprite.play('player-death');
        }
    }
}
