class ProgressionSystem {
  constructor() {
    this.ecoArchive = {};
    this.relics = [];
    this.relationships = {};
    this.unlockedRoutes = ['frontera'];
    this.runsCompleted = 0;
    this.bossesDefeated = [];
  }

  load(data) {
    if (!data) return;
    this.ecoArchive = data.ecoArchive || {};
    this.relics = data.relics || [];
    this.relationships = data.relationships || {};
    this.unlockedRoutes = data.unlockedRoutes || ['frontera'];
    this.runsCompleted = data.runsCompleted || 0;
    this.bossesDefeated = data.bossesDefeated || [];
  }

  save() {
    return {
      ecoArchive: { ...this.ecoArchive },
      relics: [...this.relics],
      relationships: { ...this.relationships },
      unlockedRoutes: [...this.unlockedRoutes],
      runsCompleted: this.runsCompleted,
      bossesDefeated: [...this.bossesDefeated],
    };
  }

  recordRunCompletion() {
    this.runsCompleted++;
  }

  recordBossDefeat(bossId) {
    if (!this.bossesDefeated.includes(bossId)) {
      this.bossesDefeated.push(bossId);
    }
  }

  addEcoFragment(skillId, amount = 1) {
    this.ecoArchive[skillId] = (this.ecoArchive[skillId] || 0) + amount;
  }

  unlockRoute(routeId) {
    if (!this.unlockedRoutes.includes(routeId)) {
      this.unlockedRoutes.push(routeId);
    }
  }

  addRelic(relicId) {
    if (!this.relics.includes(relicId)) {
      this.relics.push(relicId);
    }
  }

  getStatBonus(stat) {
    let bonus = 0;
    if (this.runsCompleted >= 3) bonus += 1;
    if (this.runsCompleted >= 6) bonus += 1;
    return bonus;
  }

  getSkillBonus(skillId) {
    return this.ecoArchive[skillId] || 0;
  }
}

export default ProgressionSystem;
