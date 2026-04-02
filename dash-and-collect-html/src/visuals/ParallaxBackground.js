// ParallaxBackground.js — 3-layer parallax scrolling

class ParallaxBackground {
    constructor(scene) {
        this._layers = [];

        // Far layer — full screen
        this._layers.push({
            sprite: scene.add.tileSprite(160, 90, 320, 180, 'bg-far'),
            factor: GAME_CONFIG.parallax.far
        });
        this._layers[0].sprite.setDepth(0);

        // Mid layer — positioned at bottom half
        this._layers.push({
            sprite: scene.add.tileSprite(160, 137, 320, 86, 'bg-mid'),
            factor: GAME_CONFIG.parallax.mid
        });
        this._layers[1].sprite.setDepth(1);

        // Near layer — positioned at very bottom
        this._layers.push({
            sprite: scene.add.tileSprite(160, 165, 320, 31, 'bg-near'),
            factor: GAME_CONFIG.parallax.near
        });
        this._layers[2].sprite.setDepth(2);
    }

    update(dt, worldSpeed) {
        for (const layer of this._layers) {
            layer.sprite.tilePositionY -= worldSpeed * layer.factor * dt;
        }
    }

    reset() {
        for (const layer of this._layers) {
            layer.sprite.tilePositionY = 0;
        }
    }
}
