import { MISSION_TEMPLATES } from '../utils/Constants.js';

class MissionSystem {
  constructor() {
    this.activeMissions = [];
    this.completedMissionIds = [];
  }

  reset() {
    this.activeMissions = [];
  }

  addMission(missionId) {
    const template = MISSION_TEMPLATES[missionId];
    if (!template) return null;
    if (this.completedMissionIds.includes(missionId) && template.repeatable !== true) return null;

    const mission = {
      id: missionId,
      ...JSON.parse(JSON.stringify(template)),
      progress: 0,
      target: template.target || '',
      count: template.count || 0,
    };
    this.activeMissions.push(mission);
    return mission;
  }

  updateProgress(target, amount = 1) {
    const updated = [];
    this.activeMissions.forEach(m => {
      if (m.type === 'gather' && m.target === target) {
        m.progress += amount;
        if (m.progress >= m.count) {
          updated.push({ mission: m, completed: true });
        }
      } else if (m.type === 'kill' && m.target === target) {
        m.progress += amount;
        if (m.progress >= m.count) {
          updated.push({ mission: m, completed: true });
        }
      }
    });
    return updated;
  }

  completeMission(missionId, invSystem, statsSystem) {
    const mission = this.activeMissions.find(m => m.id === missionId);
    if (!mission) return null;

    this.completedMissionIds.push(missionId);
    this.activeMissions = this.activeMissions.filter(m => m.id !== missionId);

    if (mission.reward) {
      if (mission.reward.cobre && invSystem) invSystem.addCoins('cobre', mission.reward.cobre);
      if (mission.reward.plata && invSystem) invSystem.addCoins('plata', mission.reward.plata);
      if (mission.reward.oro && invSystem) invSystem.addCoins('oro', mission.reward.oro);
      if (mission.reward.fama && statsSystem) statsSystem.modifyFame(mission.reward.fama);
    }

    return mission;
  }

  getActiveMissions() {
    return this.activeMissions;
  }
}

export default MissionSystem;
