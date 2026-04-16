import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, PIECE_TYPES, Actions } from '../constants.js';
import { Piece } from '../piece.js';

export class MenuState {
    constructor(game) {
        this.game = game;
        this.buttons = [];
        this.hoveredButton = -1;
        this.ghostPieces = [];
    }

    enter() {
        const cx = CANVAS_WIDTH / 2;
        const bw = 200;
        const bh = 45;
        const startY = 220;
        const gap = 60;

        this.buttons = [
            { x: cx - bw / 2, y: startY, w: bw, h: bh, text: 'PLAY', action: 'play' },
            { x: cx - bw / 2, y: startY + gap, w: bw, h: bh, text: 'HIGH SCORES', action: 'highscores' },
            { x: cx - bw / 2, y: startY + gap * 2, w: bw, h: bh, text: 'SETTINGS', action: 'settings' },
        ];

        // Initialize ghost pieces for background animation
        this.ghostPieces = [];
        for (let i = 0; i < 8; i++) {
            this.ghostPieces.push({
                type: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
                x: Math.random() * CANVAS_WIDTH,
                y: Math.random() * CANVAS_HEIGHT,
                speed: 20 + Math.random() * 30,
                rotation: Math.floor(Math.random() * 4),
            });
        }

        this.game.audio.stopMusic();
    }

    update(dt) {
        // Animate ghost pieces falling
        for (const gp of this.ghostPieces) {
            gp.y += gp.speed * dt;
            if (gp.y > CANVAS_HEIGHT + 80) {
                gp.y = -80;
                gp.x = Math.random() * CANVAS_WIDTH;
                gp.type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
            }
        }

        // Keyboard navigation
        if (this.game.input.justPressed(Actions.CONFIRM)) {
            this.activateButton(0);
        }
    }

    render() {
        const r = this.game.renderer;
        r.clear();

        // Ghost pieces background
        const ctx = r.ctx;
        for (const gp of this.ghostPieces) {
            const shape = Piece.getShapeForPreview(gp.type, gp.rotation);
            const color = Piece.getColor(gp.type);
            ctx.globalAlpha = 0.08;
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (shape[row][col]) {
                        ctx.fillStyle = color;
                        ctx.fillRect(gp.x + col * 20, gp.y + row * 20, 18, 18);
                    }
                }
            }
            ctx.globalAlpha = 1;
        }

        // Title
        r.drawTitle();

        // Version
        r.drawCenteredText('v1.0', 185, '11px monospace', COLORS.textDim);

        // Buttons
        for (let i = 0; i < this.buttons.length; i++) {
            const b = this.buttons[i];
            r.drawButton(b.x, b.y, b.w, b.h, b.text, i === this.hoveredButton);
        }

        // Controls hint
        r.drawCenteredText('Click to select', CANVAS_HEIGHT - 30, '12px monospace', COLORS.textDim);
    }

    handleClick(x, y) {
        for (let i = 0; i < this.buttons.length; i++) {
            const b = this.buttons[i];
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
                this.activateButton(i);
                return;
            }
        }
    }

    activateButton(index) {
        this.game.audio.init();
        this.game.audio.playSFX('menuSelect');
        const action = this.buttons[index]?.action;
        if (action === 'play') {
            this.game.fsm.change('playing');
        } else if (action === 'highscores') {
            this.game.fsm.change('highscores');
        } else if (action === 'settings') {
            this.game.fsm.change('settings');
        }
    }

    exit() {}
}
