// GroundScroller.js — TileSprite ground scroll

class GroundScroller {
    constructor(scene) {
        this._scene = scene;
        this.tileSprite = scene.add.tileSprite(
            160, 90,    // center of canvas
            320, 180,   // full canvas size
            'ground'
        );
        this.tileSprite.setDepth(3);
    }

    update(dt, worldSpeed) {
        this.tileSprite.tilePositionY -= worldSpeed * dt;
    }

    reset() {
        this.tileSprite.tilePositionY = 0;
    }
}
