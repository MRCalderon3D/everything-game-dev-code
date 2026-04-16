import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../constants.js';
import { Storage } from '../storage.js';

export class SettingsState {
    constructor(game) {
        this.game = game;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.returnTo = 'menu';
        this.playState = null;
        this.sliderRects = {};
        this.dragging = null;
        this.buttons = [];
    }

    enter(params = {}) {
        this.returnTo = params.returnTo || 'menu';
        this.playState = params.playState || null;

        const settings = Storage.getSettings();
        this.musicVolume = settings.musicVolume;
        this.sfxVolume = settings.sfxVolume;

        const cx = CANVAS_WIDTH / 2;
        this.buttons = [
            { x: cx - 100, y: CANVAS_HEIGHT - 100, w: 200, h: 40, text: 'BACK', action: 'back' },
        ];

        // Setup mouse events for sliders
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this.game.renderer.canvas.addEventListener('mousemove', this._onMouseMove);
        this.game.renderer.canvas.addEventListener('mouseup', this._onMouseUp);
        this.game.renderer.canvas.addEventListener('mousedown', this._onMouseDown);
    }

    _getCanvasCoords(e) {
        const rect = this.game.renderer.canvas.getBoundingClientRect();
        const scaleX = this.game.renderer.canvas.width / rect.width;
        const scaleY = this.game.renderer.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }

    _onMouseDown(e) {
        const { x, y } = this._getCanvasCoords(e);
        const sliderX = CANVAS_WIDTH / 2 - 120;
        const sliderW = 240;

        // Music slider area (y around 220)
        if (x >= sliderX && x <= sliderX + sliderW && y >= 205 && y <= 245) {
            this.dragging = 'music';
            this.musicVolume = Math.max(0, Math.min(1, (x - sliderX) / sliderW));
            this.game.audio.setMusicVolume(this.musicVolume);
        }
        // SFX slider area (y around 310)
        if (x >= sliderX && x <= sliderX + sliderW && y >= 295 && y <= 335) {
            this.dragging = 'sfx';
            this.sfxVolume = Math.max(0, Math.min(1, (x - sliderX) / sliderW));
            this.game.audio.setSFXVolume(this.sfxVolume);
        }
    }

    _onMouseMove(e) {
        if (!this.dragging) return;
        const { x } = this._getCanvasCoords(e);
        const sliderX = CANVAS_WIDTH / 2 - 120;
        const sliderW = 240;
        const val = Math.max(0, Math.min(1, (x - sliderX) / sliderW));

        if (this.dragging === 'music') {
            this.musicVolume = val;
            this.game.audio.setMusicVolume(val);
        } else if (this.dragging === 'sfx') {
            this.sfxVolume = val;
            this.game.audio.setSFXVolume(val);
        }
    }

    _onMouseUp() {
        if (this.dragging) {
            if (this.dragging === 'sfx') {
                this.game.audio.playSFX('menuSelect');
            }
            this.dragging = null;
            this.saveSettings();
        }
    }

    saveSettings() {
        Storage.saveSettings({
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
        });
    }

    update() {}

    render() {
        const r = this.game.renderer;
        r.clear();

        r.drawCenteredText('SETTINGS', 100, 'bold 28px monospace', COLORS.text);

        const sliderX = CANVAS_WIDTH / 2 - 120;
        const sliderW = 240;

        r.drawSlider(sliderX, 225, sliderW, this.musicVolume, 'Music Volume');
        r.drawSlider(sliderX, 315, sliderW, this.sfxVolume, 'SFX Volume');

        // Controls reference
        const ctx = r.ctx;
        ctx.fillStyle = COLORS.textDim;
        ctx.font = '13px monospace';
        ctx.textAlign = 'center';
        const controls = [
            'CONTROLS',
            '',
            'Arrow Keys / WASD — Move & Rotate',
            'Z — Rotate CCW',
            'Space — Hard Drop',
            'C — Send to Basket',
            'X — Swap from Basket',
            'Esc / P — Pause',
        ];
        controls.forEach((line, i) => {
            ctx.fillStyle = i === 0 ? COLORS.text : COLORS.textDim;
            ctx.font = i === 0 ? 'bold 14px monospace' : '12px monospace';
            ctx.fillText(line, CANVAS_WIDTH / 2, 390 + i * 20);
        });

        for (const b of this.buttons) {
            r.drawButton(b.x, b.y, b.w, b.h, b.text);
        }
    }

    handleClick(x, y) {
        for (const b of this.buttons) {
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this.game.audio.playSFX('menuSelect');
                if (b.action === 'back') {
                    if (this.returnTo === 'paused' && this.playState) {
                        this.game.fsm.change('paused', { playState: this.playState });
                    } else {
                        this.game.fsm.change('menu');
                    }
                }
                return;
            }
        }
    }

    exit() {
        this.saveSettings();
        this.game.renderer.canvas.removeEventListener('mousemove', this._onMouseMove);
        this.game.renderer.canvas.removeEventListener('mouseup', this._onMouseUp);
        this.game.renderer.canvas.removeEventListener('mousedown', this._onMouseDown);
    }
}
