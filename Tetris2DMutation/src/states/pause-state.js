import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, Actions } from '../constants.js';

export class PauseState {
    constructor(game) {
        this.game = game;
        this.playState = null;
        this.buttons = [];
    }

    enter(params) {
        this.playState = params.playState;

        const cx = CANVAS_WIDTH / 2;
        const bw = 200;
        const bh = 40;
        const startY = CANVAS_HEIGHT / 2 - 60;
        const gap = 55;

        this.buttons = [
            { x: cx - bw / 2, y: startY, w: bw, h: bh, text: 'RESUME', action: 'resume' },
            { x: cx - bw / 2, y: startY + gap, w: bw, h: bh, text: 'RESTART', action: 'restart' },
            { x: cx - bw / 2, y: startY + gap * 2, w: bw, h: bh, text: 'SETTINGS', action: 'settings' },
            { x: cx - bw / 2, y: startY + gap * 3, w: bw, h: bh, text: 'QUIT', action: 'quit' },
        ];
    }

    update() {
        if (this.game.input.justPressed(Actions.PAUSE)) {
            this.game.fsm.change('playing_resume', { playState: this.playState });
        }
    }

    render() {
        const r = this.game.renderer;

        // Draw the play state underneath
        this.playState.render();

        // Overlay
        r.drawOverlayBackground();

        r.drawCenteredText('PAUSED', CANVAS_HEIGHT / 2 - 110, 'bold 30px monospace', COLORS.text);

        for (const b of this.buttons) {
            r.drawButton(b.x, b.y, b.w, b.h, b.text);
        }
    }

    handleClick(x, y) {
        for (const b of this.buttons) {
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this.game.audio.playSFX('menuSelect');
                switch (b.action) {
                    case 'resume':
                        this.game.fsm.change('playing_resume', { playState: this.playState });
                        break;
                    case 'restart':
                        this.game.fsm.change('playing');
                        break;
                    case 'settings':
                        this.game.fsm.change('settings', { returnTo: 'paused', playState: this.playState });
                        break;
                    case 'quit':
                        this.game.fsm.change('menu');
                        break;
                }
                return;
            }
        }
    }

    exit() {}
}
