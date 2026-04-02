// ModifierLabel.js — SPARSE/SHIELD/SURGE text on modifier activation

class ModifierLabel {
    constructor(scene) {
        this._scene = scene;
        this._label = scene.add.text(160, 130, '', {
            fontFamily: 'monospace',
            fontSize: '8px',
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        EventBus.on(EVENTS.BIAS_CHANGED, this._onBiasChanged, this);
    }

    _onBiasChanged(type) {
        this._scene.tweens.killTweensOf(this._label);

        if (!type) {
            this._label.alpha = 0;
            return;
        }

        let text, color;
        switch (type) {
            case 'dash':
                text = 'SPARSE';
                color = '#33ccff';
                break;
            case 'shield':
                text = 'SHIELD';
                color = '#3366ff';
                break;
            case 'surge':
                text = 'SURGE';
                color = '#ff9919';
                break;
            default:
                this._label.alpha = 0;
                return;
        }

        this._label.setText(text);
        this._label.setColor(color);
        this._label.alpha = 1;

        // Hold 1s, then fade out 0.4s
        this._scene.time.delayedCall(1000, () => {
            UIAnimator.fadeOut(this._scene, this._label, 400);
        });
    }
}
