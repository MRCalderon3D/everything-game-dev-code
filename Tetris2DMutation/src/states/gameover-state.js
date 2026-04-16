import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../constants.js';

export class GameOverState {
    constructor(game) {
        this.game = game;
        this.score = 0;
        this.level = 0;
        this.lines = 0;
        this.isHighScore = false;
        this.buttons = [];
        this.flashTimer = 0;
    }

    enter(params) {
        this.score = params.score || 0;
        this.level = params.level || 1;
        this.lines = params.lines || 0;
        this.isHighScore = params.isHighScore || false;
        this.flashTimer = 0;

        const cx = CANVAS_WIDTH / 2;
        const bw = 200;
        const bh = 45;
        const startY = CANVAS_HEIGHT / 2 + 60;
        const gap = 60;

        this.buttons = [
            { x: cx - bw / 2, y: startY, w: bw, h: bh, text: 'PLAY AGAIN', action: 'play' },
            { x: cx - bw / 2, y: startY + gap, w: bw, h: bh, text: 'MAIN MENU', action: 'menu' },
        ];
    }

    update(dt) {
        this.flashTimer += dt;
    }

    render() {
        const r = this.game.renderer;
        r.clear();

        r.drawCenteredText('GAME OVER', CANVAS_HEIGHT / 2 - 150, 'bold 36px monospace', COLORS.text);

        if (this.isHighScore) {
            const flash = Math.sin(this.flashTimer * 6) > 0;
            r.drawCenteredText(
                'NEW HIGH SCORE!',
                CANVAS_HEIGHT / 2 - 105,
                'bold 20px monospace',
                flash ? COLORS.mutationGlow : '#ffff00'
            );
        }

        r.drawCenteredText('Score: ' + this.score.toLocaleString(), CANVAS_HEIGHT / 2 - 50, '20px monospace', COLORS.text);
        r.drawCenteredText('Level: ' + this.level, CANVAS_HEIGHT / 2 - 20, '18px monospace', COLORS.textDim);
        r.drawCenteredText('Lines: ' + this.lines, CANVAS_HEIGHT / 2 + 10, '18px monospace', COLORS.textDim);

        for (const b of this.buttons) {
            r.drawButton(b.x, b.y, b.w, b.h, b.text);
        }
    }

    handleClick(x, y) {
        for (const b of this.buttons) {
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this.game.audio.playSFX('menuSelect');
                if (b.action === 'play') {
                    this.game.fsm.change('playing');
                } else if (b.action === 'menu') {
                    this.game.fsm.change('menu');
                }
                return;
            }
        }
    }

    exit() {}
}
