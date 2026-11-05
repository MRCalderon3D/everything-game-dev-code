import { SKILLS, STATS_DEFAULTS } from '../utils/Constants.js';

class StatsSystem {
  constructor(progressionSystem) {
    this.progression = progressionSystem;
    this.reset();
  }

  reset() {
    const d = STATS_DEFAULTS.player;
    this.stats = {
      fuerza: d.fuerza + (this.progression ? this.progression.getStatBonus('fuerza') : 0),
      destreza: d.destreza + (this.progression ? this.progression.getStatBonus('destreza') : 0),
      inteligencia: d.inteligencia + (this.progression ? this.progression.getStatBonus('inteligencia') : 0),
      fama: d.fama,
    };
    this.resources = {
      salud: d.saludMax,
      saludMax: d.saludMax,
      mana: d.manaMax,
      manaMax: d.manaMax,
      resistencia: d.resistenciaMax,
      resistenciaMax: d.resistenciaMax,
      corrupcion: 0,
    };
    this.skills = {};
    SKILLS.forEach(s => {
      const bonus = this.progression ? this.progression.getSkillBonus(s.id) : 0;
      this.skills[s.id] = { level: bonus, xp: 0, xpThreshold: s.xpThreshold };
    });
  }

  addSkillXP(skillId, amount) {
    if (!this.skills[skillId]) return;
    const s = this.skills[skillId];
    const def = SKILLS.find(sk => sk.id === skillId);
    if (!def) return;
    s.xp += amount;
    if (s.xp >= s.xpThreshold) {
      s.level++;
      s.xp -= s.xpThreshold;
      s.xpThreshold = Math.floor(def.xpThreshold * (1 + s.level * 0.3));
      return { skill: skillId, newLevel: s.level };
    }
    return null;
  }

  getSkillLevel(skillId) {
    return (this.skills[skillId] || {}).level || 0;
  }

  takeDamage(amount) {
    this.resources.salud = Math.max(0, this.resources.salud - amount);
    return this.resources.salud <= 0;
  }

  heal(amount) {
    this.resources.salud = Math.min(this.resources.saludMax, this.resources.salud + amount);
  }

  useStamina(amount) {
    if (this.resources.resistencia < amount) return false;
    this.resources.resistencia -= amount;
    return true;
  }

  regenStamina(amount) {
    this.resources.resistencia = Math.min(this.resources.resistenciaMax, this.resources.resistencia + amount);
  }

  modifyFame(delta) {
    this.stats.fama += delta;
  }

  addCorruption(amount) {
    this.resources.corrupcion = Math.min(100, this.resources.corrupcion + amount);
  }

  getDamageMultiplier() {
    return 1 + (this.stats.fuerza - 10) * 0.05;
  }

  getSpeedMultiplier() {
    return 1 + (this.stats.destreza - 8) * 0.03;
  }

  isDead() { return this.resources.salud <= 0; }

  getRunData() {
    return {
      stats: { ...this.stats },
      skills: Object.fromEntries(
        Object.entries(this.skills).map(([k, v]) => [k, { level: v.level, xp: v.xp }])
      ),
      resources: { ...this.resources },
    };
  }
}

export default StatsSystem;
