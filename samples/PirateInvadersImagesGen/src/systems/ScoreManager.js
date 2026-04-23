import SaveManager from './SaveManager.js';

export default class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = SaveManager.load().highScore || 0;
  }

  add(points) {
    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  addWaveBonus(bonus) {
    this.add(bonus);
  }

  isNewHighScore() {
    return this.score >= this.highScore && this.score > 0;
  }

  save() {
    const data = SaveManager.load();
    if (this.score > data.highScore) {
      data.highScore = this.score;
      SaveManager.save(data);
    }
  }

  reset() {
    this.score = 0;
    this.highScore = SaveManager.load().highScore || 0;
  }
}
