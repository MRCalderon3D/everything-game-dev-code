class CorruptionSystem {
  constructor() {
    this.level = 0;
    this.perks = [];
  }

  reset() {
    this.level = 0;
    this.perks = [];
  }

  addCorruption(amount) {
    this.level = Math.min(100, this.level + amount);
    return this.getTierEffects();
  }

  getTierEffects() {
    if (this.level >= 75) return { eliteRate: 0.5, lootBonus: 1.5, eliteMultiplier: 3 };
    if (this.level >= 50) return { eliteRate: 0.3, lootBonus: 1.3, eliteMultiplier: 2 };
    if (this.level >= 25) return { eliteRate: 0.15, lootBonus: 1.15, eliteMultiplier: 1.5 };
    return { eliteRate: 0, lootBonus: 1, eliteMultiplier: 1 };
  }

  getLevel() { return this.level; }
}

export default CorruptionSystem;
