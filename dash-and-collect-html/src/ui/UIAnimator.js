// UIAnimator.js — Tween wrappers for fade, punch, scale

const UIAnimator = {
    reducedMotion: false,

    fadeIn(scene, target, duration, ease) {
        if (this.reducedMotion || duration <= 0) {
            target.alpha = 1;
            return null;
        }
        target.alpha = 0;
        return scene.tweens.add({
            targets: target,
            alpha: 1,
            duration: duration,
            ease: ease || 'Quad.easeOut'
        });
    },

    fadeOut(scene, target, duration, ease) {
        if (this.reducedMotion || duration <= 0) {
            target.alpha = 0;
            return null;
        }
        return scene.tweens.add({
            targets: target,
            alpha: 0,
            duration: duration,
            ease: ease || 'Quad.easeOut'
        });
    },

    punchScale(scene, target, intensity, duration) {
        if (this.reducedMotion || duration <= 0) return null;
        return scene.tweens.add({
            targets: target,
            scaleX: intensity,
            scaleY: intensity,
            duration: duration * 0.4,
            ease: 'Quad.easeOut',
            yoyo: true,
            hold: 0,
            onComplete: () => {
                target.setScale(1);
            }
        });
    },

    scaleFrom(scene, target, fromScale, duration, ease) {
        if (this.reducedMotion || duration <= 0) {
            target.setScale(1);
            return null;
        }
        target.setScale(fromScale);
        return scene.tweens.add({
            targets: target,
            scaleX: 1,
            scaleY: 1,
            duration: duration,
            ease: ease || 'Back.easeOut'
        });
    }
};
