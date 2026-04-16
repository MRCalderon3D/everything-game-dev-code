import {
    Actions, HIDDEN_ROWS, LOCK_DELAY, CANVAS_WIDTH, CANVAS_HEIGHT,
    BASKET_SWAP_WINDOW, BOARD_X, BOARD_Y, COLS, ROWS, CELL_SIZE, COLORS,
} from '../constants.js';
import { Piece, PieceBag } from '../piece.js';
import { Board } from '../board.js';
import { Basket } from '../basket.js';
import { MutationSystem } from '../mutation.js';
import { ScoreSystem } from '../score.js';
import { ParticleSystem } from '../particles.js';

export class PlayState {
    constructor(game) {
        this.game = game;
        this.board = new Board();
        this.bag = new PieceBag();
        this.basket = new Basket();
        this.mutation = new MutationSystem();
        this.scoring = new ScoreSystem();
        this.particles = new ParticleSystem();

        this.currentPiece = null;
        this.nextQueue = [];
        this.fallTimer = 0;
        this.lockTimer = 0;
        this.isLocking = false;
        this.spawnTimer = 0;
        this.canSwapFromBasket = false;
        this.basketSelectMode = false;
        this.gameOverTriggered = false;
        this.prevLevel = 1;
    }

    enter() {
        this.board.reset();
        this.bag = new PieceBag();
        this.basket.reset();
        this.mutation.reset();
        this.scoring.reset();
        this.particles.clear();
        this.fallTimer = 0;
        this.lockTimer = 0;
        this.isLocking = false;
        this.gameOverTriggered = false;
        this.basketSelectMode = false;
        this.prevLevel = 1;

        // Fill next queue
        this.nextQueue = [];
        for (let i = 0; i < 3; i++) {
            this.nextQueue.push(this.bag.next());
        }

        this.spawnPiece();

        this.game.audio.init();
        this.game.audio.playMusic(140);
    }

    spawnPiece() {
        const type = this.nextQueue.shift();
        this.nextQueue.push(this.bag.next());

        this.currentPiece = new Piece(type);
        this.fallTimer = 0;
        this.lockTimer = 0;
        this.isLocking = false;
        this.spawnTimer = 0;
        this.canSwapFromBasket = !this.basket.isEmpty();

        // Setup mutation for this piece
        this.mutation.preparePiece(this.currentPiece, this.scoring.level);

        // Check if spawn position is valid
        if (!this.board.isValid(this.currentPiece)) {
            this.triggerGameOver();
        }
    }

    update(dt) {
        if (this.gameOverTriggered) return;

        const input = this.game.input;
        this.particles.update(dt);

        // Pause
        if (input.justPressed(Actions.PAUSE)) {
            this.game.fsm.change('paused', { playState: this });
            return;
        }

        // Basket select mode
        if (this.basketSelectMode) {
            this.updateBasketSelect(input);
            return;
        }

        // Track spawn window for basket swap
        this.spawnTimer += dt;
        if (this.spawnTimer > BASKET_SWAP_WINDOW / 1000) {
            this.canSwapFromBasket = false;
        }

        // Basket swap (X) — only in spawn window
        if (input.justPressed(Actions.BASKET_SWAP) && this.canSwapFromBasket && !this.basket.isEmpty()) {
            this.basketSelectMode = true;
            return;
        }

        // Basket store (C)
        if (input.justPressed(Actions.BASKET_STORE)) {
            if (this.basket.store(this.currentPiece.type)) {
                this.game.audio.playSFX('basketStore');
                this.spawnPiece();
                return;
            } else {
                this.game.audio.playSFX('basketFull');
            }
        }

        // Movement
        if (input.justPressed(Actions.MOVE_LEFT)) {
            this.tryMove(-1, 0);
        }
        if (input.justPressed(Actions.MOVE_RIGHT)) {
            this.tryMove(1, 0);
        }

        // Rotation
        if (input.justPressed(Actions.ROTATE_CW)) {
            this.tryRotate(1);
        }
        if (input.justPressed(Actions.ROTATE_CCW)) {
            this.tryRotate(-1);
        }

        // Hard drop
        if (input.justPressed(Actions.HARD_DROP)) {
            this.hardDrop();
            return;
        }

        // Soft drop
        if (input.isPressed(Actions.SOFT_DROP)) {
            this.fallTimer += dt * 15; // Accelerate significantly
        }

        // Gravity fall
        this.fallTimer += dt;
        const fallInterval = this.scoring.getFallInterval() / 1000;
        while (this.fallTimer >= fallInterval) {
            this.fallTimer -= fallInterval;
            if (!this.tryMove(0, 1)) {
                // Piece can't move down — start lock
                if (!this.isLocking) {
                    this.isLocking = true;
                    this.lockTimer = 0;
                }
            } else {
                this.isLocking = false;
                this.lockTimer = 0;
                if (input.isPressed(Actions.SOFT_DROP)) {
                    this.scoring.addSoftDrop(1);
                }
            }
        }

        // Lock delay
        if (this.isLocking) {
            this.lockTimer += dt;
            if (this.lockTimer >= LOCK_DELAY / 1000) {
                this.lockPiece();
            }
        }

        // Mutation
        const mutatedPiece = this.mutation.update(dt * 1000, this.currentPiece, this.board);
        if (mutatedPiece) {
            // Emit particles at piece position
            const blocks = this.currentPiece.getBlocks();
            for (const b of blocks) {
                this.particles.emitMutation(
                    BOARD_X + (b.x + 0.5) * CELL_SIZE,
                    BOARD_Y + (b.y - HIDDEN_ROWS + 0.5) * CELL_SIZE,
                    COLORS.mutationGlow
                );
            }
            this.currentPiece = mutatedPiece;
            this.game.audio.playSFX('mutationTransform');
        } else if (this.currentPiece.mutationWarning && !this._lastWarning) {
            this.game.audio.playSFX('mutationWarning');
        }
        this._lastWarning = this.currentPiece.mutationWarning;

        // Level up check
        if (this.scoring.level > this.prevLevel) {
            this.prevLevel = this.scoring.level;
            this.game.audio.playSFX('levelUp');
            // Increase music tempo
            this.game.audio.playMusic(140 + (this.scoring.level - 1) * 5);
        }
    }

    tryMove(dx, dy) {
        const test = this.currentPiece.clone();
        test.x += dx;
        test.y += dy;
        if (this.board.isValid(test)) {
            this.currentPiece.x = test.x;
            this.currentPiece.y = test.y;
            if (dx !== 0) {
                this.game.audio.playSFX('move');
                // Reset lock if piece was moved horizontally while locking
                if (this.isLocking) {
                    this.lockTimer = 0;
                }
            }
            return true;
        }
        return false;
    }

    tryRotate(dir) {
        const test = this.currentPiece.clone();
        test.rotation = (test.rotation + dir + 4) % 4;
        if (this.board.isValid(test)) {
            this.currentPiece.rotation = test.rotation;
            this.game.audio.playSFX('rotate');
            if (this.isLocking) {
                this.lockTimer = 0;
            }
            return;
        }
        // Simple wall kick: try shifting left/right by 1
        for (const kick of [-1, 1, -2, 2]) {
            test.x = this.currentPiece.x + kick;
            if (this.board.isValid(test)) {
                this.currentPiece.x = test.x;
                this.currentPiece.rotation = test.rotation;
                this.game.audio.playSFX('rotate');
                if (this.isLocking) {
                    this.lockTimer = 0;
                }
                return;
            }
        }
    }

    hardDrop() {
        const ghostY = this.board.getGhostY(this.currentPiece);
        const distance = ghostY - this.currentPiece.y;
        this.currentPiece.y = ghostY;
        this.scoring.addHardDrop(distance);
        this.game.audio.playSFX('hardDrop');
        this.lockPiece();
    }

    lockPiece() {
        this.board.lock(this.currentPiece);
        this.game.audio.playSFX('land');

        // Check if piece mutated and survived
        if (this.currentPiece.mutated) {
            this.scoring.addMutationSurvived();
        }

        // Clear lines
        const { count, rows } = this.board.clearLines();
        if (count > 0) {
            this.scoring.addLineClear(count);

            // Particles for cleared lines
            for (const row of rows) {
                this.particles.emitLine(
                    BOARD_X,
                    BOARD_Y + (row - HIDDEN_ROWS) * CELL_SIZE,
                    COLS * CELL_SIZE,
                    '#ffffff',
                    count * 10
                );
            }

            // SFX
            if (count === 4) {
                this.game.audio.playSFX('tetris');
            } else if (count >= 2) {
                this.game.audio.playSFX('multiClear');
            } else {
                this.game.audio.playSFX('lineClear');
            }
        }

        // Check game over
        if (this.board.isTopOut()) {
            this.triggerGameOver();
            return;
        }

        this.spawnPiece();
    }

    triggerGameOver() {
        this.gameOverTriggered = true;
        this.game.audio.stopMusic();
        this.game.audio.playSFX('gameOver');

        // Save score
        const isHigh = this.scoring.isHighScore();
        if (isHigh) {
            this.scoring.saveHighScore();
        }

        setTimeout(() => {
            this.game.fsm.change('gameover', {
                score: this.scoring.score,
                level: this.scoring.level,
                lines: this.scoring.lines,
                isHighScore: isHigh,
            });
        }, 1500);
    }

    updateBasketSelect(input) {
        const contents = this.basket.getContents();
        for (let i = 0; i < contents.length; i++) {
            const action = [Actions.SELECT_1, Actions.SELECT_2, Actions.SELECT_3][i];
            if (input.justPressed(action)) {
                const type = this.basket.retrieve(i);
                if (type) {
                    this.currentPiece = new Piece(type);
                    this.fallTimer = 0;
                    this.lockTimer = 0;
                    this.isLocking = false;
                    this.mutation.preparePiece(this.currentPiece, this.scoring.level);
                    this.game.audio.playSFX('basketSwap');
                }
                this.basketSelectMode = false;
                this.canSwapFromBasket = false;
                return;
            }
        }

        // Cancel with Escape or X
        if (input.justPressed(Actions.PAUSE) || input.justPressed(Actions.BASKET_SWAP)) {
            this.basketSelectMode = false;
        }
    }

    render() {
        const r = this.game.renderer;
        r.clear();

        // Board
        r.drawBoard(this.board);

        if (this.currentPiece && !this.gameOverTriggered) {
            // Ghost piece
            const ghostY = this.board.getGhostY(this.currentPiece);
            r.drawGhost(this.currentPiece, ghostY);

            // Active piece
            r.drawPiece(this.currentPiece);
        }

        // HUD
        r.drawNextQueue(this.nextQueue);
        r.drawBasket(this.basket);
        r.drawHUD(this.scoring.score, this.scoring.level, this.scoring.lines);

        // Particles
        this.particles.render(r.ctx);

        // Basket select overlay
        if (this.basketSelectMode) {
            r.drawBasketSwapOverlay(this.basket);
        }
    }

    handleClick(x, y) {
        if (!this.basketSelectMode) return;

        // Check if click is on one of the basket overlay slots
        const contents = this.basket.getContents();
        const overlayW = 300;
        const overlayH = 80 + contents.length * 80;
        const ox = (CANVAS_WIDTH - overlayW) / 2;
        const oy = (CANVAS_HEIGHT - overlayH) / 2;

        for (let i = 0; i < contents.length; i++) {
            const slotY = oy + 50 + i * 75;
            if (x >= ox + 20 && x <= ox + overlayW - 20 && y >= slotY && y <= slotY + 65) {
                const type = this.basket.retrieve(i);
                if (type) {
                    this.currentPiece = new Piece(type);
                    this.fallTimer = 0;
                    this.lockTimer = 0;
                    this.isLocking = false;
                    this.mutation.preparePiece(this.currentPiece, this.scoring.level);
                    this.game.audio.playSFX('basketSwap');
                }
                this.basketSelectMode = false;
                this.canSwapFromBasket = false;
                return;
            }
        }
    }

    exit() {
        this.game.audio.stopMusic();
    }
}
