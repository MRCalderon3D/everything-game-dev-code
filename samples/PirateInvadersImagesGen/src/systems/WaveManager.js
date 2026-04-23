import { WAVES } from '../config.js';

export default class WaveManager {
  constructor(scene, formation) {
    this.scene = scene;
    this.formation = formation;
    this.waveNumber = 0;
    this.waveActive = false;
  }

  startWave() {
    this.waveNumber++;
    this.waveActive = true;

    const config = this.getWaveConfig();
    this.formation.spawn(config, this.waveNumber);
  }

  getWaveConfig() {
    if (this.waveNumber <= WAVES.length) {
      return WAVES[this.waveNumber - 1];
    }
    const base = WAVES[WAVES.length - 1];
    const extra = this.waveNumber - WAVES.length;
    return {
      sloops: base.sloops + extra,
      brigantines: base.brigantines + extra,
      galleons: base.galleons + Math.floor(extra / 2),
    };
  }

  checkWaveComplete() {
    if (!this.waveActive) return false;
    if (this.formation.getAliveCount() === 0) {
      this.waveActive = false;
      return true;
    }
    return false;
  }

  getWaveBonus() {
    return 100 * this.waveNumber;
  }

  reset() {
    this.waveNumber = 0;
    this.waveActive = false;
  }
}
