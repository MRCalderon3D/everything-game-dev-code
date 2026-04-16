import { SCORE_LINES, SCORE_SOFT_DROP, SCORE_HARD_DROP, SCORE_MUTATION_SURVIVED, LINES_PER_LEVEL } from './constants.js';
import { Storage } from './storage.js';

export class ScoreSystem {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.lines = 0;
    }

    addLineClear(count) {
        if (count <= 0 || count > 4) return;
        this.score += SCORE_LINES[count] * this.level;
        this.lines += count;
        this.checkLevelUp();
    }

    addSoftDrop(cells) {
        this.score += cells * SCORE_SOFT_DROP;
    }

    addHardDrop(cells) {
        this.score += cells * SCORE_HARD_DROP;
    }

    addMutationSurvived() {
        this.score += SCORE_MUTATION_SURVIVED;
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.lines / LINES_PER_LEVEL) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            return true;
        }
        return false;
    }

    getFallInterval() {
        // Decreases from 1000ms (level 1) to 100ms (level 15+)
        return Math.max(100, 1000 - (this.level - 1) * 64);
    }

    saveHighScore() {
        const entry = {
            score: this.score,
            level: this.level,
            lines: this.lines,
            date: new Date().toISOString().split('T')[0],
        };
        return Storage.addHighScore(entry);
    }

    isHighScore() {
        return Storage.isHighScore(this.score);
    }
}
