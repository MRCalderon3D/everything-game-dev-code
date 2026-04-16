import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../constants.js';
import { Storage } from '../storage.js';

export class HighScoresState {
    constructor(game) {
        this.game = game;
        this.scores = [];
        this.buttons = [];
    }

    enter() {
        this.scores = Storage.getHighScores();

        const cx = CANVAS_WIDTH / 2;
        this.buttons = [
            { x: cx - 100, y: CANVAS_HEIGHT - 80, w: 200, h: 40, text: 'BACK', action: 'back' },
        ];
    }

    update() {}

    render() {
        const r = this.game.renderer;
        r.clear();

        r.drawCenteredText('HIGH SCORES', 80, 'bold 28px monospace', COLORS.text);

        const ctx = r.ctx;
        const startY = 130;
        const lineH = 38;

        if (this.scores.length === 0) {
            r.drawCenteredText('No scores yet — go play!', CANVAS_HEIGHT / 2, '16px monospace', COLORS.textDim);
        } else {
            // Header
            ctx.fillStyle = COLORS.textDim;
            ctx.font = '12px monospace';
            ctx.textAlign = 'left';
            ctx.fillText('#', CANVAS_WIDTH / 2 - 180, startY);
            ctx.fillText('SCORE', CANVAS_WIDTH / 2 - 150, startY);
            ctx.fillText('LVL', CANVAS_WIDTH / 2 + 30, startY);
            ctx.fillText('LINES', CANVAS_WIDTH / 2 + 80, startY);
            ctx.fillText('DATE', CANVAS_WIDTH / 2 + 130, startY);

            this.scores.forEach((entry, i) => {
                const y = startY + (i + 1) * lineH;
                const isGold = i === 0;
                ctx.fillStyle = isGold ? '#ffd700' : COLORS.text;
                ctx.font = isGold ? 'bold 14px monospace' : '14px monospace';
                ctx.textAlign = 'left';
                ctx.fillText(String(i + 1), CANVAS_WIDTH / 2 - 180, y);
                ctx.fillText(entry.score.toLocaleString(), CANVAS_WIDTH / 2 - 150, y);
                ctx.fillText(String(entry.level), CANVAS_WIDTH / 2 + 30, y);
                ctx.fillText(String(entry.lines), CANVAS_WIDTH / 2 + 80, y);
                ctx.font = '12px monospace';
                ctx.fillStyle = COLORS.textDim;
                ctx.fillText(entry.date || '—', CANVAS_WIDTH / 2 + 130, y);
            });
        }

        for (const b of this.buttons) {
            r.drawButton(b.x, b.y, b.w, b.h, b.text);
        }
    }

    handleClick(x, y) {
        for (const b of this.buttons) {
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this.game.audio.playSFX('menuSelect');
                this.game.fsm.change('menu');
                return;
            }
        }
    }

    exit() {}
}
