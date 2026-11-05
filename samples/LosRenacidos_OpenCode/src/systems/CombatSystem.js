class CombatSystem {
  static attack(attacker, defender, attackerStats, defenderStats) {
    const baseDamage = attacker.damage || 10;
    const strMult = attackerStats ? Math.max(0.5, 1 + (attackerStats.stats.fuerza - 10) * 0.05) : 1;
    const rawDamage = baseDamage * strMult;

    const defense = defenderStats ? (defender.defense || 0) : 0;
    const finalDamage = Math.max(1, rawDamage - defense * 0.5);

    return {
      raw: rawDamage,
      final: Math.round(finalDamage),
      type: attacker.tipoDaño || 'corte',
    };
  }

  static parry(attacker, defender, attackerStats, defenderStats) {
    const parryLevel = defenderStats ? defenderStats.getSkillLevel('parada') : 0;
    const parryChance = 0.3 + parryLevel * 0.05;
    const success = Math.random() < Math.min(parryChance, 0.85);

    if (success) {
      return {
        parried: true,
        reflected: Math.round(CombatSystem.attack(attacker, defender, attackerStats, defenderStats).final * 0.3),
        stunDuration: 0.8 + parryLevel * 0.1,
      };
    }

    return { parried: false };
  }

  static dodge(attacker, defenderStats) {
    const dex = defenderStats ? defenderStats.stats.destreza : 8;
    const dodgeChance = 0.1 + (dex - 8) * 0.03;
    return Math.random() < Math.min(dodgeChance, 0.6);
  }

  static isCritical(attackerStats) {
    const dex = attackerStats ? attackerStats.stats.destreza : 8;
    const critChance = 0.05 + (dex - 8) * 0.02;
    const isCrit = Math.random() < critChance;
    return { isCrit, multiplier: isCrit ? 1.8 : 1 };
  }
}

export default CombatSystem;
