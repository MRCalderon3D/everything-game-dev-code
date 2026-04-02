// CollisionHandler.js — Overlap detection, buffer pattern, shield

class CollisionHandler {
    constructor(scene, gameManager, playerController, spawnManager) {
        this._scene = scene;
        this._gameManager = gameManager;
        this._player = playerController;
        this._spawnManager = spawnManager;
        this._shieldActive = false;
        this._buffer = [];
    }

    activateShield() {
        this._shieldActive = true;
    }

    deactivateShield() {
        this._shieldActive = false;
    }

    update() {
        if (this._gameManager.currentState !== 'running') return;

        // Collect overlaps into buffer
        this._buffer.length = 0;
        this._scene.physics.overlap(
            this._player.sprite,
            this._spawnManager.collidables,
            (player, collidable) => {
                if (collidable.active) {
                    this._buffer.push(collidable);
                }
            }
        );

        if (this._buffer.length === 0) return;

        // Process collectibles first
        let firstHazard = null;
        for (const obj of this._buffer) {
            const type = obj.getData('type');
            if (type === 'hazard') {
                if (!firstHazard) firstHazard = obj;
            } else {
                // Collectible pickup
                EventBus.emit(EVENTS.COLLECTIBLE_PICKED_UP, type);
                obj.setActive(false).setVisible(false);
                obj.body.enable = false;
            }
        }

        // Process first hazard
        if (firstHazard) {
            if (this._shieldActive) {
                this._shieldActive = false;
                firstHazard.setActive(false).setVisible(false);
                firstHazard.body.enable = false;
            } else {
                EventBus.emit(EVENTS.PLAYER_DIED);
            }
        }
    }
}
