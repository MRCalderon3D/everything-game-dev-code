import {
    COLS, ROWS, HIDDEN_ROWS, CELL_SIZE, BOARD_X, BOARD_Y,
    CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, BASKET_MAX,
} from './constants.js';
import { Piece } from './piece.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.resizeToFit();
        window.addEventListener('resize', () => this.resizeToFit());
    }

    resizeToFit() {
        const ratio = CANVAS_WIDTH / CANVAS_HEIGHT;
        let w = window.innerWidth;
        let h = window.innerHeight;
        if (w / h > ratio) {
            w = h * ratio;
        } else {
            h = w / ratio;
        }
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
    }

    clear() {
        this.ctx.fillStyle = COLORS.background;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawBoard(board) {
        const ctx = this.ctx;

        // Board background
        ctx.fillStyle = '#080818';
        ctx.fillRect(BOARD_X, BOARD_Y, COLS * CELL_SIZE, ROWS * CELL_SIZE);

        // Grid lines
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 0.5;
        for (let r = 0; r <= ROWS; r++) {
            ctx.beginPath();
            ctx.moveTo(BOARD_X, BOARD_Y + r * CELL_SIZE);
            ctx.lineTo(BOARD_X + COLS * CELL_SIZE, BOARD_Y + r * CELL_SIZE);
            ctx.stroke();
        }
        for (let c = 0; c <= COLS; c++) {
            ctx.beginPath();
            ctx.moveTo(BOARD_X + c * CELL_SIZE, BOARD_Y);
            ctx.lineTo(BOARD_X + c * CELL_SIZE, BOARD_Y + ROWS * CELL_SIZE);
            ctx.stroke();
        }

        // Filled cells
        for (let r = HIDDEN_ROWS; r < HIDDEN_ROWS + ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = board.getCell(c, r);
                if (cell) {
                    this.drawCell(c, r - HIDDEN_ROWS, cell.color);
                }
            }
        }

        // Board border
        ctx.strokeStyle = COLORS.gridBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(BOARD_X, BOARD_Y, COLS * CELL_SIZE, ROWS * CELL_SIZE);
    }

    drawCell(col, row, color, alpha = 1) {
        const ctx = this.ctx;
        const x = BOARD_X + col * CELL_SIZE;
        const y = BOARD_Y + row * CELL_SIZE;
        ctx.globalAlpha = alpha;

        // Fill
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

        // Highlight (top-left bevel)
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, 3);
        ctx.fillRect(x + 1, y + 1, 3, CELL_SIZE - 2);

        // Shadow (bottom-right bevel)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 1, y + CELL_SIZE - 4, CELL_SIZE - 2, 3);
        ctx.fillRect(x + CELL_SIZE - 4, y + 1, 3, CELL_SIZE - 2);

        ctx.globalAlpha = 1;
    }

    drawPiece(piece, offsetX = 0, offsetY = 0) {
        if (!piece) return;
        const blocks = piece.getBlocks();
        for (const b of blocks) {
            const visibleRow = b.y - HIDDEN_ROWS;
            if (visibleRow < 0) continue;

            let color = piece.color;
            // Mutation warning flash
            if (piece.mutationWarning) {
                const flash = Math.sin(Date.now() * 0.02) > 0;
                color = flash ? COLORS.mutationGlow : piece.color;
            }

            this.drawCell(b.x + offsetX, visibleRow + offsetY, color);
        }
    }

    drawGhost(piece, ghostY) {
        if (!piece) return;
        const shape = piece.getShape();
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    const visibleRow = ghostY + r - HIDDEN_ROWS;
                    if (visibleRow < 0) continue;
                    this.drawCell(piece.x + c, visibleRow, piece.color, 0.25);
                }
            }
        }
    }

    drawNextQueue(nextTypes) {
        const ctx = this.ctx;
        const panelX = BOARD_X + COLS * CELL_SIZE + 20;
        const panelY = BOARD_Y;

        // Panel
        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(panelX, panelY, 160, 220);
        ctx.strokeStyle = COLORS.panelBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, 160, 220);

        // Title
        ctx.fillStyle = COLORS.text;
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NEXT', panelX + 80, panelY + 20);

        // Pieces
        nextTypes.forEach((type, i) => {
            this.drawMiniPiece(type, panelX + 40, panelY + 35 + i * 65);
        });
    }

    drawBasket(basket) {
        const ctx = this.ctx;
        const panelX = 15;
        const panelY = BOARD_Y;

        // Panel
        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(panelX, panelY, 170, 280);
        ctx.strokeStyle = COLORS.panelBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, 170, 280);

        // Title
        ctx.fillStyle = COLORS.text;
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BASKET [C/X]', panelX + 85, panelY + 20);

        const contents = basket.getContents();
        for (let i = 0; i < BASKET_MAX; i++) {
            const slotY = panelY + 35 + i * 80;
            // Slot background
            ctx.fillStyle = i < contents.length ? '#1a1a2e' : '#0e0e1a';
            ctx.fillRect(panelX + 10, slotY, 150, 70);
            ctx.strokeStyle = COLORS.gridBorder;
            ctx.strokeRect(panelX + 10, slotY, 150, 70);

            // Slot number
            ctx.fillStyle = COLORS.textDim;
            ctx.font = '12px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`[${i + 1}]`, panelX + 15, slotY + 15);

            if (i < contents.length) {
                this.drawMiniPiece(contents[i], panelX + 50, slotY + 15);
            } else {
                ctx.fillStyle = COLORS.textDim;
                ctx.font = '11px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('empty', panelX + 85, slotY + 42);
            }
        }
    }

    drawMiniPiece(type, x, y) {
        const ctx = this.ctx;
        const shape = Piece.getShapeForPreview(type, 0);
        const color = Piece.getColor(type);
        const miniSize = 18;

        // Find bounding box of the shape
        let minC = 4, maxC = 0, minR = 4, maxR = 0;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    minC = Math.min(minC, c);
                    maxC = Math.max(maxC, c);
                    minR = Math.min(minR, r);
                    maxR = Math.max(maxR, r);
                }
            }
        }
        const w = maxC - minC + 1;
        const h = maxR - minR + 1;
        const offsetX = x + (4 * miniSize - w * miniSize) / 2;
        const offsetY = y + (2 * miniSize - h * miniSize) / 2;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    const cx = offsetX + (c - minC) * miniSize;
                    const cy = offsetY + (r - minR) * miniSize;
                    ctx.fillStyle = color;
                    ctx.fillRect(cx + 1, cy + 1, miniSize - 2, miniSize - 2);
                    ctx.fillStyle = 'rgba(255,255,255,0.15)';
                    ctx.fillRect(cx + 1, cy + 1, miniSize - 2, 2);
                    ctx.fillRect(cx + 1, cy + 1, 2, miniSize - 2);
                }
            }
        }
    }

    drawHUD(score, level, lines) {
        const ctx = this.ctx;
        const panelX = BOARD_X + COLS * CELL_SIZE + 20;
        const panelY = BOARD_Y + 240;

        // Panel
        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(panelX, panelY, 160, 150);
        ctx.strokeStyle = COLORS.panelBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(panelX, panelY, 160, 150);

        ctx.fillStyle = COLORS.text;
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';

        ctx.fillText('SCORE', panelX + 15, panelY + 25);
        ctx.font = 'bold 20px monospace';
        ctx.fillText(score.toLocaleString(), panelX + 15, panelY + 50);

        ctx.font = '14px monospace';
        ctx.fillText('LEVEL', panelX + 15, panelY + 80);
        ctx.font = 'bold 20px monospace';
        ctx.fillText(String(level), panelX + 15, panelY + 105);

        ctx.font = '14px monospace';
        ctx.fillText('LINES', panelX + 15, panelY + 130);
        ctx.font = 'bold 20px monospace';
        ctx.fillText(String(lines), panelX + 15, panelY + 150);
    }

    drawBasketSwapOverlay(basket) {
        const ctx = this.ctx;
        // Dim background
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const contents = basket.getContents();
        const overlayW = 300;
        const overlayH = 80 + contents.length * 80;
        const ox = (CANVAS_WIDTH - overlayW) / 2;
        const oy = (CANVAS_HEIGHT - overlayH) / 2;

        ctx.fillStyle = COLORS.panel;
        ctx.fillRect(ox, oy, overlayW, overlayH);
        ctx.strokeStyle = COLORS.mutationGlow;
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, overlayW, overlayH);

        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SELECT PIECE (1-' + contents.length + ')', ox + overlayW / 2, oy + 30);

        contents.forEach((type, i) => {
            const slotY = oy + 50 + i * 75;
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(ox + 20, slotY, overlayW - 40, 65);
            ctx.strokeStyle = COLORS.gridBorder;
            ctx.strokeRect(ox + 20, slotY, overlayW - 40, 65);

            ctx.fillStyle = COLORS.text;
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`[${i + 1}]`, ox + 30, slotY + 20);

            this.drawMiniPiece(type, ox + 80, slotY + 12);
        });
    }

    drawTitle() {
        const ctx = this.ctx;
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('TETRIS', CANVAS_WIDTH / 2, 120);

        ctx.fillStyle = COLORS.mutationGlow;
        ctx.font = 'bold 28px monospace';
        ctx.fillText('MUTATION', CANVAS_WIDTH / 2, 160);
    }

    drawButton(x, y, w, h, text, highlighted = false) {
        const ctx = this.ctx;
        ctx.fillStyle = highlighted ? '#2a2a5a' : COLORS.panel;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = highlighted ? COLORS.mutationGlow : COLORS.panelBorder;
        ctx.lineWidth = highlighted ? 2 : 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = highlighted ? COLORS.highlight : COLORS.text;
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + w / 2, y + h / 2);
        ctx.textBaseline = 'alphabetic';
    }

    drawOverlayBackground() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawCenteredText(text, y, font = '16px monospace', color = COLORS.text) {
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, CANVAS_WIDTH / 2, y);
    }

    drawSlider(x, y, w, value, label) {
        const ctx = this.ctx;
        const h = 8;
        const knobR = 10;

        ctx.fillStyle = COLORS.text;
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, x, y - 15);
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(value * 100) + '%', x + w, y - 15);

        // Track
        ctx.fillStyle = '#1a1a3a';
        ctx.fillRect(x, y, w, h);

        // Filled portion
        ctx.fillStyle = COLORS.mutationGlow;
        ctx.fillRect(x, y, w * value, h);

        // Knob
        const knobX = x + w * value;
        ctx.beginPath();
        ctx.arc(knobX, y + h / 2, knobR, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.text;
        ctx.fill();

        return { x, y: y - knobR, w, h: h + knobR * 2 };
    }
}
