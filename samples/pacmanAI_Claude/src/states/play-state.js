import {
  TILE, COLS, ROWS, COLORS,
  PLAYER_SPAWN, GHOST_SPAWNS, FRIGHTENED_DURATION, FRIGHTENED_FLASH_AT,
  SCATTER_DURATION, CHASE_DURATION,
  PELLET_SCORE, POWER_PELLET_SCORE, GHOST_SCORES,
  EXTRA_LIFE_AT, STARTING_LIVES, GHOST_HOUSE_EXIT,
} from '../constants.js';
import { Player } from '../entities/player.js';
import { Ghost, GHOST_MODE } from '../entities/ghost.js';
import { GameOverState } from './gameover-state.js';
import { PauseState } from './pause-state.js';

export class PlayState {
  constructor(ctx, params = {}) {
    this.resume = params.resume || null;
  }

  enter(ctx) {
    if (this.resume) {
      this.player = this.resume.player;
      this.ghosts = this.resume.ghosts;
      this.score = this.resume.score;
      this.lives = this.resume.lives;
      this.level = this.resume.level;
      this.combo = this.resume.combo;
      this.frightenedTimer = this.resume.frightenedTimer;
      this.globalMode = this.resume.globalMode;
      this.modeTimer = this.resume.modeTimer;
      this.modeIndex = this.resume.modeIndex;
      this.pelletAlt = this.resume.pelletAlt;
      this.extraLifeAwarded = this.resume.extraLifeAwarded;
      this.startTimer = 0;
      this.state = 'playing';
      this.deathTimer = 0;
      this.levelClearTimer = 0;
      return;
    }
    ctx.maze.reset();
    this.player = new Player(PLAYER_SPAWN);
    this.ghosts = [
      new Ghost('blinky', GHOST_SPAWNS.blinky, COLORS.ghostBlinky, 0),
      new Ghost('pinky',  GHOST_SPAWNS.pinky,  COLORS.ghostPinky,  2),
      new Ghost('inky',   GHOST_SPAWNS.inky,   COLORS.ghostInky,   5),
      new Ghost('clyde',  GHOST_SPAWNS.clyde,  COLORS.ghostClyde,  8),
    ];
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.level = 1;
    this.combo = 0;
    this.frightenedTimer = 0;
    this.globalMode = GHOST_MODE.SCATTER;
    this.modeTimer = SCATTER_DURATION;
    this.modeIndex = 0;
    this.pelletAlt = false;
    this.extraLifeAwarded = false;
    this.startTimer = 1.2;
    this.deathTimer = 0;
    this.levelClearTimer = 0;
    this.state = 'playing';
  }

  exit() {}

  resetEntities(ctx, fullReset = false) {
    this.player.reset();
    for (const g of this.ghosts) g.reset();
    this.combo = 0;
    this.frightenedTimer = 0;
    this.globalMode = GHOST_MODE.SCATTER;
    this.modeTimer = SCATTER_DURATION;
    this.modeIndex = 0;
    this.startTimer = 1.0;
    this.state = 'playing';
    if (fullReset) ctx.maze.reset();
  }

  update(dt, ctx) {
    if (ctx.input.consumeAction('pause')) {
      ctx.switchState(PauseState, { snapshot: this.snapshot(ctx) });
      return;
    }

    if (this.startTimer > 0) {
      this.startTimer -= dt;
      return;
    }

    if (this.state === 'dying') {
      this.deathTimer += dt;
      this.player.update(dt, ctx.maze);
      if (this.deathTimer > 1.8) {
        this.lives--;
        if (this.lives < 0) {
          ctx.switchState(GameOverState, { score: this.score, level: this.level });
          return;
        }
        this.deathTimer = 0;
        this.resetEntities(ctx, false);
      }
      return;
    }

    if (this.state === 'level-clear') {
      this.levelClearTimer += dt;
      if (this.levelClearTimer > 1.5) {
        this.level++;
        this.levelClearTimer = 0;
        this.resetEntities(ctx, true);
      }
      return;
    }

    this.player.setNextDir(ctx.input.getDirection());
    this.player.update(dt, ctx.maze);

    if (this.player.alive) {
      const pc = Math.floor(this.player.x / TILE);
      const pr = Math.floor(this.player.y / TILE);
      const eaten = ctx.maze.consumePellet(pc, pr);
      if (eaten === '.') {
        this.addScore(this.score + PELLET_SCORE, ctx);
        ctx.audio.play(this.pelletAlt ? 'pellet-alt' : 'pellet');
        this.pelletAlt = !this.pelletAlt;
      } else if (eaten === 'o') {
        this.addScore(this.score + POWER_PELLET_SCORE, ctx);
        this.frightenedTimer = FRIGHTENED_DURATION;
        for (const g of this.ghosts) g.frighten(FRIGHTENED_DURATION);
        this.combo = 0;
        ctx.audio.play('power');
      }
    }

    if (this.frightenedTimer > 0) {
      this.frightenedTimer -= dt;
      if (this.frightenedTimer <= 0) this.combo = 0;
    } else {
      this.modeTimer -= dt;
      if (this.modeTimer <= 0) {
        if (this.globalMode === GHOST_MODE.SCATTER) {
          this.globalMode = GHOST_MODE.CHASE;
          this.modeTimer = CHASE_DURATION;
        } else {
          this.globalMode = GHOST_MODE.SCATTER;
          this.modeTimer = SCATTER_DURATION;
        }
        this.modeIndex++;
        for (const g of this.ghosts) g.applyMode(this.globalMode);
      }
    }

    const blinky = this.ghosts[0];
    for (const g of this.ghosts) {
      g.update(dt, ctx.maze, this.player, blinky, this.globalMode);
    }

    if (this.player.alive) {
      for (const g of this.ghosts) {
        if (!g.isActive && g.mode !== GHOST_MODE.FRIGHTENED) continue;
        const dx = g.x - this.player.x;
        const dy = g.y - this.player.y;
        if (dx * dx + dy * dy < (TILE * 0.6) ** 2) {
          if (g.isEdible) {
            const points = GHOST_SCORES[Math.min(this.combo, GHOST_SCORES.length - 1)];
            this.addScore(this.score + points, ctx);
            this.combo++;
            ctx.audio.play('ghost-eaten');
            g.getEaten(this.globalMode);
          } else if (!g.isEaten) {
            this.player.die();
            ctx.audio.play('death');
            this.state = 'dying';
            this.deathTimer = 0;
            this.combo = 0;
            break;
          }
        }
      }
    }

    if (ctx.maze.isCleared() && this.state === 'playing') {
      this.state = 'level-clear';
      this.levelClearTimer = 0;
      ctx.audio.play('level-clear');
    }
  }

  addScore(newScore, ctx) {
    const before = this.score;
    this.score = newScore;
    if (!this.extraLifeAwarded && before < EXTRA_LIFE_AT && newScore >= EXTRA_LIFE_AT) {
      this.lives++;
      this.extraLifeAwarded = true;
      ctx.audio.play('extra-life');
    }
    const high = ctx.storage.getHighScore();
    if (newScore > high) ctx.storage.setHighScore(newScore);
  }

  render(r, ctx) {
    r.clear();
    r.drawMaze(ctx.maze);
    r.drawPellets(ctx.maze, ctx.elapsed);

    if (this.state !== 'dying' || this.deathTimer < 1.6) {
      r.drawPlayer(this.player);
    }

    const flashing = this.frightenedTimer > 0 && this.frightenedTimer < (FRIGHTENED_DURATION - FRIGHTENED_FLASH_AT);
    const flashOn = flashing && Math.floor(this.frightenedTimer * 6) % 2 === 0;
    for (const g of this.ghosts) {
      if (this.state === 'dying' && this.deathTimer > 0.4) continue;
      r.drawGhost(g, flashOn);
    }

    r.drawHud(this.score, ctx.storage.getHighScore(), this.level, this.lives, this.combo);

    if (this.startTimer > 0) {
      r.fillOverlay(0.35);
      const cw = COLS * TILE;
      const cy = r.mazeCenter(-10);
      r.drawText('READY!', cw / 2, cy, { size: 22, color: COLORS.player, align: 'center' });
    }

    if (this.state === 'level-clear') {
      r.fillOverlay(0.35);
      const cw = COLS * TILE;
      const cy = r.mazeCenter(-10);
      r.drawText('LEVEL CLEAR!', cw / 2, cy, { size: 22, color: COLORS.player, align: 'center' });
    }
  }

  snapshot(ctx) {
    return {
      player: this.player,
      ghosts: this.ghosts,
      score: this.score,
      lives: this.lives,
      level: this.level,
      combo: this.combo,
      frightenedTimer: this.frightenedTimer,
      globalMode: this.globalMode,
      modeTimer: this.modeTimer,
      modeIndex: this.modeIndex,
      pelletAlt: this.pelletAlt,
      extraLifeAwarded: this.extraLifeAwarded,
      highScore: ctx.storage.getHighScore(),
    };
  }
}
