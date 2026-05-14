export class InputSystem {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this.swipeStart = null;
        this.swipeDir = null;
        this.swipeConsumed = false;

        this._onKeyDown = (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
            this._preventDefaultForGameKeys(e);
        };
        this._onKeyUp = (e) => {
            this.keys[e.code] = false;
        };
    }

    _preventDefaultForGameKeys(e) {
        const gameKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'KeyW', 'KeyA', 'KeyS', 'KeyD',
            'Escape', 'KeyP', 'Space', 'Enter',
        ];
        if (gameKeys.includes(e.code)) {
            e.preventDefault();
        }
    }

    attach(element) {
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);

        element.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            this.swipeStart = { x: t.clientX, y: t.clientY };
            this.swipeConsumed = false;
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if (!this.swipeStart) return;
            const t = e.touches[0];
            const dx = t.clientX - this.swipeStart.x;
            const dy = t.clientY - this.swipeStart.y;
            const minSwipe = 30;
            if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.swipeDir = dx > 0 ? 'right' : 'left';
                } else {
                    this.swipeDir = dy > 0 ? 'down' : 'up';
                }
                this.swipeConsumed = true;
            }
        }, { passive: true });

        element.addEventListener('touchend', () => {
            this.swipeStart = null;
        });
    }

    getDirection() {
        let dx = 0, dy = 0;
        if (this.isDown('ArrowUp') || this.isDown('KeyW')) dy = -1;
        if (this.isDown('ArrowDown') || this.isDown('KeyS')) dy = 1;
        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) dx = -1;
        if (this.isDown('ArrowRight') || this.isDown('KeyD')) dx = 1;
        return { dx, dy };
    }

    consumeSwipe() {
        const dir = this.swipeDir;
        this.swipeDir = null;
        return dir;
    }

    isDown(code) { return !!this.keys[code]; }
    wasPressed(code) { return !!this.justPressed[code]; }

    endFrame() {
        this.justPressed = {};
        if (this.swipeConsumed) {
            this.swipeStart = null;
        }
    }

    consumeClick(x, y) {
        return true;
    }
}
