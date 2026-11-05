import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';
import { Storage } from '../systems/storage.js';

export class MenuState {
    constructor(game) {
        this.game = game;
        this.options = ['PLAY', 'HIGH SCORES'];
        this.selected = 0;
    }

    enter() { this.selected = 0; }

    update() {
        if (this.game.input.wasPressed('ArrowUp') || this.game.input.wasPressed('KeyW')) {
            this.selected = (this.selected - 1 + this.options.length) % this.options.length;
            this.game.audio.sfxMenuSelect();
        }
        if (this.game.input.wasPressed('ArrowDown') || this.game.input.wasPressed('KeyS')) {
            this.selected = (this.selected + 1) % this.options.length;
            this.game.audio.sfxMenuSelect();
        }
        if (this.game.input.wasPressed('Enter') || this.game.input.wasPressed('Space')) {
            this.game.audio.init();
            this.game.audio.resume();
            if (this.selected === 0) {
                this.game.fsm.change('playing');
            } else {
                this.game.fsm.change('highscores');
            }
        }
    }

    render() {
        this.game.renderer.clear();
        this.game.renderer.drawMenuText('PAC-MAN', this.options, this.selected);
        const ctx = this.game.renderer.ctx;
        const t = performance.now();
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(CANVAS_WIDTH / 2 - 30, CANVAS_HEIGHT / 2 + 180, 12, 0.4 + Math.sin(t * 0.005), Math.PI * 2 - 0.4 - Math.sin(t * 0.005));
        ctx.lineTo(CANVAS_WIDTH / 2 - 30, CANVAS_HEIGHT / 2 + 180);
        ctx.fill();
        const ghostColors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
        ghostColors.forEach((color, i) => {
            ctx.fillStyle = color;
            const gx = CANVAS_WIDTH / 2 + 10 + i * 30;
            const gy = CANVAS_HEIGHT / 2 + 180 + Math.sin(t * 0.003 + i) * 6;
            ctx.beginPath();
            ctx.arc(gx, gy, 10, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(gx - 10, gy - 1, 20, 8);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(gx - 3, gy - 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(gx + 3, gy - 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            ctx.arc(gx - 3, gy - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(gx + 3, gy - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    handleClick() {
        this.game.audio.init();
        this.game.audio.resume();
        if (this.selected === 0) {
            this.game.fsm.change('playing');
        } else {
            this.game.fsm.change('highscores');
        }
    }
}

export class HighScoresState {
    constructor(game) { this.game = game; }

    update() {
        if (this.game.input.wasPressed('Enter') || this.game.input.wasPressed('Space') ||
            this.game.input.wasPressed('Escape')) {
            this.game.fsm.change('menu');
        }
    }

    render() {
        const ctx = this.game.renderer.ctx;
        this.game.renderer.clear();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 28px monospace';
        ctx.fillText('HIGH SCORES', CANVAS_WIDTH / 2, 40);

        const scores = Storage.getHighScores();
        ctx.font = '16px monospace';
        if (scores.length === 0) {
            ctx.fillStyle = '#666666';
            ctx.fillText('NO SCORES YET', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        } else {
            scores.forEach((s, i) => {
                ctx.fillStyle = i === 0 ? '#ffff00' : '#ffffff';
                const dateStr = new Date(s.date).toLocaleDateString();
                ctx.fillText(`${i + 1}. ${s.score}  (${dateStr})`, CANVAS_WIDTH / 2, 90 + i * 30);
            });
        }
        ctx.fillStyle = '#8888ff';
        ctx.font = '12px monospace';
        ctx.fillText('PRESS ENTER TO RETURN', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
    }

    handleClick() { this.game.fsm.change('menu'); }
}
