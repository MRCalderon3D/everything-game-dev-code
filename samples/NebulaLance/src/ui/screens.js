// Full-screen overlays: main menu (with looping video background), pause,
// victory, and defeat. One overlay element reconfigured per state.
export function createScreens({ onStart, onResume, onRestart, onMenu }) {
  const overlay = document.getElementById('overlay');
  const title = document.getElementById('overlay-title');
  const sub = document.getElementById('overlay-sub');
  const scoreEl = document.getElementById('overlay-score');
  const highEl = document.getElementById('overlay-high');
  const primary = document.getElementById('btn-primary');
  const menuBtn = document.getElementById('btn-tomenu');
  const introVideo = document.getElementById('intro-video');

  let mode = 'menu';
  primary.addEventListener('click', () => {
    if (mode === 'menu') onStart();
    else if (mode === 'pause') onResume();
    else onRestart();
  });
  menuBtn.addEventListener('click', () => onMenu());

  function setIntro(active) {
    overlay.classList.toggle('menu-mode', active);
    if (!introVideo) return;
    if (active) {
      const p = introVideo.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      introVideo.pause();
    }
  }

  function show({ newMode, titleText, subText, score, high, primaryText, withMenu }) {
    mode = newMode;
    setIntro(newMode === 'menu');
    title.textContent = titleText;
    sub.textContent = subText;
    if (score == null) {
      scoreEl.classList.add('hidden');
    } else {
      scoreEl.classList.remove('hidden');
      scoreEl.textContent = `Score ${String(score).padStart(6, '0')}`;
    }
    highEl.textContent = high > 0 ? `Best ${String(high).padStart(6, '0')}` : '';
    primary.textContent = primaryText;
    menuBtn.classList.toggle('hidden', !withMenu);
    overlay.classList.remove('hidden');
  }

  return {
    hide() {
      setIntro(false);
      overlay.classList.add('hidden');
    },
    showMenu(high) {
      show({
        newMode: 'menu',
        titleText: 'NEBULA LANCE',
        subText: 'Pierce the Bydo swarm. Charge the Wave Cannon. Master the Force.',
        score: null, high, primaryText: 'Launch', withMenu: false,
      });
    },
    showPause() {
      show({
        newMode: 'pause',
        titleText: 'Paused',
        subText: 'Hold steady, pilot.',
        score: null, high: 0, primaryText: 'Resume', withMenu: true,
      });
    },
    showWin(score, high) {
      show({
        newMode: 'end',
        titleText: 'STATION CLEARED',
        subText: 'The Maw is destroyed. The lance holds.',
        score, high, primaryText: 'Play again', withMenu: true,
      });
    },
    showLose(score, high) {
      show({
        newMode: 'end',
        titleText: 'SHIP LOST',
        subText: 'The swarm overwhelms the lance.',
        score, high, primaryText: 'Retry', withMenu: true,
      });
    },
  };
}
