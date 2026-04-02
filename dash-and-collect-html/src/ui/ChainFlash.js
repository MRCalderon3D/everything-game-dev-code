// ChainFlash.js — Full-screen color overlay on chain completion

class ChainFlash {
    constructor(scene) {
        this._scene = scene;
        this._rect = scene.add.rectangle(160, 90, 320, 180, 0xffffff, 0);
        this._rect.setDepth(300);

        EventBus.on(EVENTS.CHAIN_COMPLETED, this._flash, this);
    }

    _flash(type) {
        let color;
        switch (type) {
            case 'dash':   color = GAME_CONFIG.colors.dash;   break;
            case 'shield': color = GAME_CONFIG.colors.shield; break;
            case 'surge':  color = GAME_CONFIG.colors.surge;  break;
            default:       color = 0xffffff;
        }

        this._rect.setFillStyle(color, 0);
        this._scene.tweens.killTweensOf(this._rect);

        if (UIAnimator.reducedMotion) return;

        this._scene.tweens.add({
            targets: this._rect,
            alpha: 0.35,
            duration: 50,
            ease: 'Linear',
            onComplete: () => {
                this._scene.tweens.add({
                    targets: this._rect,
                    alpha: 0,
                    duration: 300,
                    ease: 'Linear'
                });
            }
        });
    }
}
