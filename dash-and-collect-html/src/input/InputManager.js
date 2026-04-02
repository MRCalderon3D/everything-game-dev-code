// InputManager.js — Keyboard + touch/swipe input abstraction

class InputManager {
    constructor(scene) {
        this._scene = scene;
        this._leftPressed = false;
        this._rightPressed = false;

        // Keyboard
        this._keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this._keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this._keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this._keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Touch swipe
        this._swipeStartX = 0;
        this._swipeThreshold = 30;

        scene.input.on('pointerdown', (pointer) => {
            this._swipeStartX = pointer.x;
        });

        scene.input.on('pointerup', (pointer) => {
            const dx = pointer.x - this._swipeStartX;
            if (dx < -this._swipeThreshold) this._leftPressed = true;
            if (dx > this._swipeThreshold) this._rightPressed = true;
        });
    }

    getInput() {
        const kbLeft = Phaser.Input.Keyboard.JustDown(this._keyA) ||
                        Phaser.Input.Keyboard.JustDown(this._keyLeft);
        const kbRight = Phaser.Input.Keyboard.JustDown(this._keyD) ||
                         Phaser.Input.Keyboard.JustDown(this._keyRight);

        const left = kbLeft || this._leftPressed;
        const right = kbRight || this._rightPressed;

        // Clear touch state after read
        this._leftPressed = false;
        this._rightPressed = false;

        // Simultaneous = neutral
        if (left && right) return { left: false, right: false };

        return { left, right };
    }
}
