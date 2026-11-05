// DOM HUD: gold / lives / wave readouts, next-wave button, boss bar.
// Values are cached so the DOM is only touched when something changes.
export function createHud({ onNextWave, onPause, onMute }) {
  const root = document.getElementById('hud');
  const goldEl = document.getElementById('hud-gold');
  const livesEl = document.getElementById('hud-lives');
  const waveEl = document.getElementById('hud-wave');
  const waveBtn = document.getElementById('btn-wave');
  const pauseBtn = document.getElementById('btn-pause');
  const muteBtn = document.getElementById('btn-mute');
  const bossWrap = document.getElementById('boss-bar-wrap');
  const bossBar = document.getElementById('boss-bar');

  const cache = { gold: -1, lives: -1, wave: -1, waveLabel: '', bossFrac: -1 };

  waveBtn.addEventListener('click', onNextWave);
  pauseBtn.addEventListener('click', onPause);
  muteBtn.addEventListener('click', onMute);

  return {
    show() {
      root.classList.remove('hidden');
    },
    hide() {
      root.classList.add('hidden');
    },

    setMuted(muted) {
      muteBtn.classList.toggle('off', muted);
      muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    },

    update(sim) {
      if (sim.gold !== cache.gold) {
        cache.gold = sim.gold;
        goldEl.textContent = `\u{1FA99} ${sim.gold}`;
      }
      if (sim.lives !== cache.lives) {
        cache.lives = sim.lives;
        livesEl.textContent = `❤ ${sim.lives}`;
      }
      const waveNum = Math.min(sim.waveIndex + 1, 10);
      if (waveNum !== cache.wave) {
        cache.wave = waveNum;
        waveEl.textContent = `Wave ${Math.max(waveNum, 0)}/10`;
      }

      let label = '';
      if (!sim.outcome && !sim.waveActive && sim.wavesCleared < 10) {
        label = `▶ Wave ${sim.wavesCleared + 1} in ${Math.ceil(sim.countdown)}s`;
      }
      if (label !== cache.waveLabel) {
        cache.waveLabel = label;
        waveBtn.textContent = label;
        waveBtn.classList.toggle('hidden', label === '');
      }

      const boss = sim.getBoss();
      const frac = boss ? boss.hp / boss.maxHp : -1;
      if (frac !== cache.bossFrac) {
        cache.bossFrac = frac;
        bossWrap.classList.toggle('hidden', !boss);
        if (boss) bossBar.style.width = `${Math.max(0, frac * 100)}%`;
      }
    },
  };
}
