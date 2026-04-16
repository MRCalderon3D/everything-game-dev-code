const BASE_URL = window.location.origin + '/pirate-invaders/api';

const LeaderboardClient = {
  async getScores() {
    try {
      const res = await fetch(`${BASE_URL}/scores`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async submitScore(name, score, wave) {
    try {
      const res = await fetch(`${BASE_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score, wave }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

export default LeaderboardClient;
