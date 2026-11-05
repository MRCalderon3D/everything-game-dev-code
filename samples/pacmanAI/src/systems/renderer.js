import { TILE, COLS, ROWS, HUD_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, GHOST_NAMES, GHOST_COLORS } from '../constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        this.ctx = canvas.getContext('2d');
        this.dotAnimTimer = 0;
    }

    clear() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawMaze(maze) {
        const ctx = this.ctx;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (maze.grid[y][x] === 1) {
                    this.drawWall(x, y);
                } else if (maze.grid[y][x] === 2) {
                    this.drawDot(x, y);
                } else if (maze.grid[y][x] === 3) {
                    this.drawPowerPellet(x, y, performance.now());
                }
            }
        }
    }

    drawWall(x, y) {
        const ctx = this.ctx;
        const px = x * TILE;
        const py = y * TILE + HUD_HEIGHT;
        ctx.fillStyle = '#1111aa';
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = '#000088';
        ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
    }

    drawDot(x, y) {
        const ctx = this.ctx;
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2 + HUD_HEIGHT;
        ctx.fillStyle = '#f0f0c0';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPowerPellet(x, y, time) {
        const ctx = this.ctx;
        const cx = x * TILE + TILE / 2;
        const cy = y * TILE + TILE / 2 + HUD_HEIGHT;
        const pulse = Math.sin(time * 0.005) * 1.5 + 6;
        ctx.fillStyle = '#f0f0c0';
        ctx.beginPath();
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPlayer(player, time) {
        if (player.dead) {
            const t = player.deathTimer;
            if (t <= 0) return;
            const progress = 1 - t / 1.5;
            const scale = 1 - progress * 0.5;
            this._drawPacMan(player.getCenterX(), player.getCenterY() + HUD_HEIGHT, player.dirX || 0, player.dirY || -1, player.mouthAngle, scale, time);
            return;
        }
        this._drawPacMan(player.getCenterX(), player.getCenterY() + HUD_HEIGHT, player.dirX, player.dirY, player.mouthAngle, 1, time);
    }

    _drawPacMan(cx, cy, dx, dy, mouthAngle, scale, time) {
        const ctx = this.ctx;
        let angle = 0;
        if (dx === 1) angle = 0;
        else if (dx === -1) angle = Math.PI;
        else if (dy === -1) angle = -Math.PI / 2;
        else if (dy === 1) angle = Math.PI / 2;

        const r = TILE / 2 * scale;
        const ma = mouthAngle * scale;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, r, ma, Math.PI * 2 - ma);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();
    }

    drawGhost(ghost, time, isFrightened) {
        const ctx = this.ctx;
        const cx = ghost.getCenterX();
        const cy = ghost.getCenterY() + HUD_HEIGHT;
        const r = TILE / 2;
        const bounce = Math.sin(time * 0.01 + ghost.exitOrder) * 1;

        ctx.save();
        ctx.translate(cx, cy + bounce);

        if (ghost.mode === 'eaten') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -2, r - 1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-3, -6, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(3, -6, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        let color = ghost.color;
        if (ghost.scared || isFrightened) {
            if (ghost.frightenedTimer && ghost.frightenedTimer < 3000 && Math.floor(time / 200) % 2 === 0) {
                color = '#ffffff';
            } else {
                color = '#2121ff';
            }
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, -2, r, Math.PI, Math.PI * 2);
        ctx.lineTo(r, r - 2);
        const waveCount = 3;
        const waveWidth = (2 * r) / waveCount;
        const waveAmp = Math.abs(Math.sin(time * 0.008)) * 4 + 3;
        for (let i = 0; i < waveCount; i++) {
            const wx = r - i * waveWidth;
            ctx.lineTo(wx, r - 2 - waveAmp);
        }
        ctx.lineTo(-r, r - 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-4, -5, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, -5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (!(ghost.scared || isFrightened)) {
            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            const eyeDx = (ghost.dirX || 0) * 1.5;
            const eyeDy = (ghost.dirY || -1) * 1.5;
            ctx.arc(-4 + eyeDx, -5 + eyeDy, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4 + eyeDx, -5 + eyeDy, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(-4, -7, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4, -7, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f00000';
            ctx.fillRect(-7, 0, 13, 2);
            ctx.fillRect(-7, 4, 13, 2);
        }

        ctx.restore();
    }

    drawHUD(score, lives, level) {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${score}`, 10, 22);

        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${level}`, CANVAS_WIDTH / 2, 22);

        ctx.textAlign = 'right';
        ctx.fillText('LIVES:', CANVAS_WIDTH - 80, 22);
        for (let i = 0; i < lives; i++) {
            const cx = CANVAS_WIDTH - 20 - i * 25;
            const cy = HUD_HEIGHT / 2 + 2;
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(cx, cy, 8, 0.4, Math.PI * 2 - 0.4);
            ctx.lineTo(cx, cy);
            ctx.fill();
        }

        ctx.fillStyle = '#333388';
        ctx.fillRect(0, HUD_HEIGHT - 2, CANVAS_WIDTH, 2);
    }

    drawReadyText(text) {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }

    drawOverlay(bgAlpha = 0.7) {
        const ctx = this.ctx;
        ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
        ctx.fillRect(0, HUD_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - HUD_HEIGHT);
    }

    drawMenuText(title, options, selectedIndex) {
        const ctx = this.ctx;
        ctx.textAlign = 'center';

        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 36px monospace';
        ctx.fillText(title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

        ctx.font = 'bold 18px monospace';
        options.forEach((opt, i) => {
            ctx.fillStyle = i === selectedIndex ? '#ffff00' : '#8888ff';
            const indicator = i === selectedIndex ? '> ' : '  ';
            ctx.fillText(indicator + opt, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + i * 35);
        });

        ctx.fillStyle = '#666666';
        ctx.font = '12px monospace';
        ctx.fillText('ARROWS to select  ENTER to confirm', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 120);
    }

    drawGameOverText(score, level, isHighScore) {
        const ctx = this.ctx;
        ctx.textAlign = 'center';

        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = '18px monospace';
        ctx.fillText(`FINAL SCORE: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
        ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        if (isHighScore) {
            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 55);
        }

        ctx.fillStyle = '#8888ff';
        ctx.font = '16px monospace';
        ctx.fillText('PRESS ENTER OR TAP TO CONTINUE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);
    }

    drawPauseText() {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
        ctx.fillStyle = '#8888ff';
        ctx.font = '14px monospace';
        ctx.fillText('PRESS ESC OR TAP TO RESUME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    drawLevelComplete(level) {
        const ctx = this.ctx;
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL ${level} COMPLETE!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('GET READY...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    drawGhostFlash(ghost, time) {
        if (!ghost.scared || !ghost.frightenedTimer) return;
        if (ghost.frightenedTimer < 3000 && Math.floor(time / 200) % 2 === 0) {
            return;
        }
    }
}
