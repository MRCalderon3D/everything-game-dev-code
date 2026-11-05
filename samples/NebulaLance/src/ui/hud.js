// HUD: lives, score, combo multiplier, Wave Cannon charge meter, Force state,
// and the boss health bar. Reads sim state each frame; never mutates it.
import { BOSS, COMBO_PER_TIER, MAX_MULTIPLIER } from '../sim/config.js';

export function createHud({ onPause, onMute }) {
  const root = document.getElementById('hud');
  const livesEl = document.getElementById('hud-lives');
  const scoreEl = document.getElementById('hud-score');
  const comboEl = document.getElementById('hud-combo');
  const chargeFill = document.getElementById('charge-fill');
  const forceEl = document.getElementById('hud-force');
  const bossWrap = document.getElementById('boss-bar-wrap');
  const bossFill = document.getElementById('boss-bar');
  const muteBtn = document.getElementById('btn-mute');

  document.getElementById('btn-pause').addEventListener('click', onPause);
  muteBtn.addEventListener('click', onMute);

  let lastScore = -1;
  let lastLives = -1;
  let lastCombo = -1;
  let lastForce = '';

  return {
    show() { root.classList.remove('hidden'); },
    hide() { root.classList.add('hidden'); },
    setMuted(m) { muteBtn.classList.toggle('off', m); },

    update(sim) {
      const score = sim.getScore();
      if (score !== lastScore) {
        scoreEl.textContent = String(score).padStart(6, '0');
        lastScore = score;
      }
      if (sim.lives !== lastLives) {
        livesEl.textContent = '◈'.repeat(Math.max(0, sim.lives)) || '—';
        lastLives = sim.lives;
      }
      const mult = Math.min(MAX_MULTIPLIER, 1 + Math.floor(sim.combo / COMBO_PER_TIER));
      if (mult !== lastCombo) {
        comboEl.textContent = mult > 1 ? `x${mult}` : '';
        lastCombo = mult;
      }
      // Charge meter: fills while the Wave Cannon is held.
      chargeFill.style.width = `${Math.round(sim.chargeLevel() * 100)}%`;

      const f = sim.force;
      const label = !f.granted ? '' : `FORCE · ${f.weapon.toUpperCase()}`;
      if (label !== lastForce) {
        forceEl.textContent = label;
        lastForce = label;
      }

      // Boss bar.
      if (sim.boss.active && sim.boss.mode === 'fight') {
        bossWrap.classList.remove('hidden');
        const max = BOSS.phases[sim.boss.phase].coreHp;
        const ratio = Math.max(0, sim.boss.coreHp / max);
        bossFill.style.width = `${Math.round(ratio * 100)}%`;
      } else {
        bossWrap.classList.add('hidden');
      }
    },
  };
}
