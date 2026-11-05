import { TILE, COLS, ROWS, HUD_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT,
    PLAYER_SPEED, GHOST_SPEED, GHOST_FRIGHTENED_SPEED, GHOST_TUNNEL_SPEED,
    FRIGHTENED_DURATION, FRIGHTENED_FLASH_START,
    SCATTER_DURATION, CHASE_DURATION, SCATTER_DURATION_LATE,
    DOT_POINTS, POWER_PELLET_POINTS, GHOST_EAT_BASE, EXTRA_LIFE_SCORE,
    STARTING_LIVES, LEVEL_SPEEDUP, SPEED_CAP,
    GHOST_COLORS, GHOST_NAMES } from '../constants.js';
import { Maze } from '../entities/maze.js';
import { Player } from '../entities/player.js';
import { Ghost } from '../entities/ghost.js';

const MODE_SCATTER = 'scatter';
const MODE_CHASE = 'chase';
const MODE_FRIGHTENED = 'frightened';

export class PlayState {
    constructor(game) {
        this.game = game;
        this.maze = new Maze();
        this.player = new Player(this.maze);
        this.ghosts = GHOST_NAMES.map((name, i) => new Ghost(name, GHOST_COLORS[name], this.maze, i));
        this.score = 0;
        this.lives = STARTING_LIVES;
        this.level = 1;
        this.ghostMode = MODE_SCATTER;
        this.modeTimer = 0;
        this.modeIndex = 0;
        this.frightenedTimer = 0;
        this.ghostEatCombo = 0;
        this.readyTimer = 0;
        this.playing = false;
        this.levelComplete = false;
        this.levelCompleteTimer = 0;
        this.deathPauseTimer = 0;
        this.dotSoundAlt = false;
        this.livesAwarded = {};
        this.extraLifeThreshold = EXTRA_LIFE_SCORE;
    }

    enter() {
        this.maze.reset();
        this.player.reset();
        this.ghosts.forEach(g => g.reset());
        this.score = 0;
        this.lives = STARTING_LIVES;
        this.level = 1;
        this.ghostMode = MODE_SCATTER;
        this.modeTimer = 0;
        this.modeIndex = 0;
        this.frightenedTimer = 0;
        this.ghostEatCombo = 0;
        this.readyTimer = 1.0;
        this.playing = false;
        this.levelComplete = false;
        this.levelCompleteTimer = 0;
        this.deathPauseTimer = 0;
        this.dotSoundAlt = false;
        this.livesAwarded = {};
        this.extraLifeThreshold = EXTRA_LIFE_SCORE;
        this.updateSpeeds();
        this.game.audio.init();
        this.game.audio.resume();
        this.game.audio.startMusic('gameplay');
    }

    updateSpeeds() {
        const speedBonus = Math.min((this.level - 1) * LEVEL_SPEEDUP, SPEED_CAP);
        this.player.speed = PLAYER_SPEED + speedBonus * 0.5;
        this.currentGhostSpeed = GHOST_SPEED + speedBonus;
        this.currentFrightenedSpeed = GHOST_FRIGHTENED_SPEED + speedBonus * 0.3;
        this.currentFrightenedDuration = Math.max(3000, FRIGHTENED_DURATION - (this.level - 1) * 500);
    }

    update(dt) {
        if (this.levelComplete) {
            this.levelCompleteTimer -= dt;
            if (this.levelCompleteTimer <= 0) {
                this.advanceLevel();
            }
            return;
        }

        if (this.deathPauseTimer > 0) {
            this.deathPauseTimer -= dt;
            if (this.deathPauseTimer <= 0) {
                this.resetAfterDeath();
            }
            return;
        }

        if (this.readyTimer > 0) {
            this.readyTimer -= dt;
            if (this.readyTimer <= 0) {
                this.playing = true;
            }
            return;
        }

        if (!this.playing) return;

        if (this.game.input.wasPressed('Escape') || this.game.input.wasPressed('KeyP')) {
            this.game.fsm.change('paused');
            return;
        }

        const kbDir = this.game.input.getDirection();
        if (kbDir.dx !== 0 || kbDir.dy !== 0) {
            this.player.setDirection(kbDir.dx, kbDir.dy);
        }
        const swipe = this.game.input.consumeSwipe();
        if (swipe) {
            switch (swipe) {
                case 'up': this.player.setDirection(0, -1); break;
                case 'down': this.player.setDirection(0, 1); break;
                case 'left': this.player.setDirection(-1, 0); break;
                case 'right': this.player.setDirection(1, 0); break;
            }
        }

        this.player.update(dt);

        const dotResult = this.maze.eatDot(this.player.getTileX(), this.player.getTileY());
        if (dotResult === 'dot') {
            this.score += DOT_POINTS;
            if (this.dotSoundAlt) {
                this.game.audio.sfxDot();
            } else {
                this.game.audio.sfxDotAlt();
            }
            this.dotSoundAlt = !this.dotSoundAlt;
        } else if (dotResult === 'power') {
            this.score += POWER_PELLET_POINTS;
            this.game.audio.sfxPowerPellet();
            this.activateFrightened();
        }

        if (this.maze.allDotsEaten) {
            this.score += this.level * 500;
            this.game.audio.sfxLevelComplete();
            this.levelComplete = true;
            this.levelCompleteTimer = 2.5;
            this.playing = false;
            return;
        }

        this.checkExtraLife();

        if (this.frightenedTimer > 0) {
            this.frightenedTimer -= dt * 1000;
            if (this.frightenedTimer <= 0) {
                this.frightenedTimer = 0;
                this.ghostMode = MODE_SCATTER;
                this.modeTimer = 0;
                this.game.audio.startMusic('gameplay');
            }
        } else {
            this.modeTimer += dt * 1000;
            this.updateModeTimer();
        }

        const globalMode = this.frightenedTimer > 0 ? MODE_FRIGHTENED : this.ghostMode;
        this.ghosts.forEach(g => {
            g.update(dt, this.player, this.ghosts[0], globalMode, this.frightenedTimer);
        });

        this.ghosts.forEach(g => {
            if (g.scared && this.frightenedTimer > 0 && this.frightenedTimer < FRIGHTENED_FLASH_START) {
                this.game.audio.setFrightenedMusicSpeed(true);
            }
            if (g.scared && this.frightenedTimer > 0 && this.frightenedTimer < 3000 && Math.floor(performance.now() / 300) % 2 === 0) {
                if (!this._lastWarningBeep || performance.now() - this._lastWarningBeep > 300) {
                    this.game.audio.sfxGhostWarning();
                    this._lastWarningBeep = performance.now();
                }
            }
        });

        this.checkCollisions();
    }

    updateModeTimer() {
        const patterns = [
            { scatter: SCATTER_DURATION, chase: CHASE_DURATION },
            { scatter: SCATTER_DURATION, chase: CHASE_DURATION },
            { scatter: SCATTER_DURATION_LATE, chase: CHASE_DURATION },
            { scatter: SCATTER_DURATION_LATE, chase: Number.MAX_SAFE_INTEGER },
        ];
        const pattern = patterns[Math.min(this.modeIndex, patterns.length - 1)];
        const modeDuration = this.ghostMode === MODE_SCATTER ? pattern.scatter : pattern.chase;

        if (this.modeTimer >= modeDuration) {
            this.modeTimer = 0;
            if (this.ghostMode === MODE_SCATTER) {
                this.ghostMode = MODE_CHASE;
            } else {
                this.ghostMode = MODE_SCATTER;
                this.modeIndex++;
            }
        }
    }

    activateFrightened() {
        this.frightenedTimer = this.currentFrightenedDuration;
        this.ghostEatCombo = 0;
        this.game.audio.startFrightenedMusic();
        this.ghosts.forEach(g => g.enterFrightened());
    }

    checkCollisions() {
        const px = this.player.getTileX();
        const py = this.player.getTileY();
        this.ghosts.forEach(g => {
            const gx = g.getTileX();
            const gy = g.getTileY();
            if (gx === px && gy === py) {
                if (g.scared || g.mode === 'frightened') {
                    this.ghostEatCombo++;
                    this.score += GHOST_EAT_BASE * Math.pow(2, this.ghostEatCombo - 1);
                    this.game.audio.sfxEatGhost();
                    g.resetAfterDeath();
                } else if (!g.eaten && !this.player.dead) {
                    this.playerDeath();
                }
            }
        });
    }

    playerDeath() {
        this.player.startDeath();
        this.lives--;
        this.game.audio.sfxDeath();
        this.game.audio.stopMusic();
        this.deathPauseTimer = 2.0;
        this.playing = false;
        this.frightenedTimer = 0;
    }

    resetAfterDeath() {
        if (this.lives <= 0) {
            this.game.fsm.change('gameover', { score: this.score, level: this.level });
            return;
        }
        this.player.reset();
        this.ghosts.forEach(g => g.reset());
        this.ghostMode = MODE_SCATTER;
        this.modeTimer = 0;
        this.modeIndex = 0;
        this.frightenedTimer = 0;
        this.ghostEatCombo = 0;
        this.player.mouthAngle = 0.8;
        this.readyTimer = 1.0;
        this.playing = false;
        this.game.audio.startMusic('gameplay');
    }

    advanceLevel() {
        this.level++;
        this.maze.reset();
        this.player.reset();
        this.ghosts.forEach(g => g.reset());
        this.ghostMode = MODE_SCATTER;
        this.modeTimer = 0;
        this.modeIndex = 0;
        this.frightenedTimer = 0;
        this.ghostEatCombo = 0;
        this.player.mouthAngle = 0.8;
        this.readyTimer = 1.0;
        this.playing = false;
        this.levelComplete = false;
        this.updateSpeeds();
        this.game.audio.startMusic('gameplay');
    }

    checkExtraLife() {
        if (this.score >= this.extraLifeThreshold && !this.livesAwarded[this.extraLifeThreshold]) {
            this.livesAwarded[this.extraLifeThreshold] = true;
            this.lives++;
            this.extraLifeThreshold += EXTRA_LIFE_SCORE;
            this.game.audio.sfxExtraLife();
        }
    }

    render() {
        this.game.renderer.clear();
        this.game.renderer.drawMaze(this.maze);

        const globalMode = this.frightenedTimer > 0 ? MODE_FRIGHTENED : this.ghostMode;
        this.ghosts.forEach(g => this.game.renderer.drawGhost(g, performance.now(), globalMode === MODE_FRIGHTENED));
        this.game.renderer.drawPlayer(this.player, performance.now());

        if (!this.player.dead) {
            this.game.renderer.drawHUD(this.score, this.lives, this.level);
        } else {
            this.game.renderer.drawHUD(this.score, this.lives, this.level);
        }

        if (this.readyTimer > 0 && !this.player.dead) {
            this.game.renderer.drawOverlay(0.4);
            this.game.renderer.drawReadyText('READY!');
        }

        if (this.levelComplete) {
            this.game.renderer.drawOverlay(0.5);
            this.game.renderer.drawLevelComplete(this.level);
        }
    }

    handleClick(x, y) {
        if (this.levelComplete || this.player.dead) return;
        const gameY = y - HUD_HEIGHT;
        if (gameY < 0) return;
        const tileX = Math.floor(x / TILE);
        const tileY = Math.floor(gameY / TILE);
        const ptx = this.player.getTileX();
        const pty = this.player.getTileY();
        const dx = tileX - ptx;
        const dy = tileY - pty;
        if (Math.abs(dx) > Math.abs(dy)) {
            this.player.setDirection(dx > 0 ? 1 : -1, 0);
        } else {
            this.player.setDirection(0, dy > 0 ? 1 : -1);
        }
    }
}
