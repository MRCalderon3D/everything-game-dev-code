import { KEY_MAP, Actions, DAS_INITIAL_DELAY, DAS_REPEAT_DELAY } from './constants.js';

export class InputSystem {
    constructor() {
        this.pressed = new Set();
        this.justPressedSet = new Set();
        this.mouseClick = null; // {x, y} or null

        // DAS state for left/right movement
        this.dasAction = null;
        this.dasTimer = 0;
        this.dasPhase = 'idle'; // 'idle' | 'initial' | 'repeat'

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onClick = this._onClick.bind(this);

        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup', this._onKeyUp);
    }

    attachCanvas(canvas) {
        canvas.addEventListener('click', this._onClick);
        this.canvas = canvas;
    }

    _onKeyDown(e) {
        const action = KEY_MAP[e.key];
        if (!action) return;
        e.preventDefault();

        if (!this.pressed.has(action)) {
            this.pressed.add(action);
            this.justPressedSet.add(action);

            // Start DAS for movement keys
            if (action === Actions.MOVE_LEFT || action === Actions.MOVE_RIGHT) {
                this.dasAction = action;
                this.dasTimer = 0;
                this.dasPhase = 'initial';
            }
        }
    }

    _onKeyUp(e) {
        const action = KEY_MAP[e.key];
        if (!action) return;
        e.preventDefault();

        this.pressed.delete(action);

        if (action === this.dasAction) {
            this.dasAction = null;
            this.dasPhase = 'idle';
            this.dasTimer = 0;
        }
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.mouseClick = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }

    update(dt) {
        // DAS logic
        if (this.dasAction && this.pressed.has(this.dasAction)) {
            this.dasTimer += dt;
            if (this.dasPhase === 'initial' && this.dasTimer >= DAS_INITIAL_DELAY) {
                this.dasTimer -= DAS_INITIAL_DELAY;
                this.dasPhase = 'repeat';
                this.justPressedSet.add(this.dasAction);
            } else if (this.dasPhase === 'repeat' && this.dasTimer >= DAS_REPEAT_DELAY) {
                this.dasTimer -= DAS_REPEAT_DELAY;
                this.justPressedSet.add(this.dasAction);
            }
        }
    }

    isPressed(action) {
        return this.pressed.has(action);
    }

    justPressed(action) {
        return this.justPressedSet.has(action);
    }

    consumeClick() {
        const click = this.mouseClick;
        this.mouseClick = null;
        return click;
    }

    endFrame() {
        this.justPressedSet.clear();
        this.mouseClick = null;
    }
}
