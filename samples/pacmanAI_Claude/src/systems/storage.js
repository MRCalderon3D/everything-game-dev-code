import { STORAGE_KEY } from '../constants.js';

export class Storage {
  constructor() {
    this.memory = 0;
    this.available = false;
    try {
      const test = '__pacman_test__';
      localStorage.setItem(test, '1');
      localStorage.removeItem(test);
      this.available = true;
    } catch (e) {
      this.available = false;
    }
  }

  getHighScore() {
    if (!this.available) return this.memory;
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  }

  setHighScore(score) {
    if (!this.available) {
      this.memory = Math.max(this.memory, score);
      return;
    }
    const current = this.getHighScore();
    if (score > current) {
      try {
        localStorage.setItem(STORAGE_KEY, String(score));
      } catch (e) {
        this.memory = Math.max(this.memory, score);
      }
    }
  }
}
