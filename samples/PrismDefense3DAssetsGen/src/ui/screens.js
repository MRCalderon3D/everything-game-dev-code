// Full-screen overlays: menu (with level select), pause, victory, defeat.
// One overlay element, reconfigured per state.
import { LEVELS } from '../sim/config.js';

export function createScreens({ onAction, onStartLevel, onMenu }) {
  const overlay = document.getElementById('overlay');
  const sub = document.getElementById('overlay-sub');
  const scoreEl = document.getElementById('overlay-score');
  const highEl = document.getElementById('overlay-high');
  const title = document.querySelector('#overlay-panel h1');
  const button = document.getElementById('btn-overlay');
  const menuButton = document.getElementById('btn-menu');
  const levelButtons = document.getElementById('level-buttons');
  const introVideo = document.getElementById('intro-video');

  let mode = 'menu';
  button.addEventListener('click', () => onAction(mode));
  menuButton.addEventListener('click', () => onMenu());
  LEVELS.forEach((level, index) => {
    const el = document.getElementById(`btn-level-${index}`);
    if (!el) return;
    el.textContent = level.name;
    el.addEventListener('click', () => onStartLevel(index));
  });

  // The generated intro cinematic only plays behind the menu; pausing it
  // elsewhere keeps it from decoding frames under the gameplay overlays.
  function setIntroVideo(active) {
    overlay.classList.toggle('menu-mode', active);
    if (!introVideo) return;
    if (active) {
      const p = introVideo.play();
      if (p && p.catch) p.catch(() => {}); // poster still dresses the menu
    } else {
      introVideo.pause();
    }
  }

  function show({ newMode, titleText, subText, score, high, buttonText, withMenu }) {
    mode = newMode;
    setIntroVideo(newMode === 'menu');
    levelButtons.classList.toggle('hidden', newMode !== 'menu');
    button.classList.toggle('hidden', newMode === 'menu');
    menuButton.classList.toggle('hidden', !withMenu);
    title.textContent = titleText;
    sub.textContent = subText;
    if (score == null) {
      scoreEl.classList.add('hidden');
    } else {
      scoreEl.classList.remove('hidden');
      scoreEl.textContent = `Score: ${score}`;
    }
    highEl.textContent = high > 0 ? `Best: ${high}` : '';
    button.textContent = buttonText;
    overlay.classList.remove('hidden');
  }

  return {
    hide() {
      setIntroVideo(false);
      overlay.classList.add('hidden');
    },

    showMenu(high) {
      show({
        newMode: 'menu',
        titleText: 'PrismDefense',
        subText: 'Pick a battlefield. Stop the waves before they reach the crystal.',
        score: null,
        high,
        buttonText: '',
        withMenu: false,
      });
    },

    showPause() {
      show({
        newMode: 'pause',
        titleText: 'Paused',
        subText: 'The crystal is safe... for now.',
        score: null,
        high: 0,
        buttonText: 'Resume',
        withMenu: true,
      });
    },

    showWin(score, high) {
      show({
        newMode: 'end',
        titleText: 'Victory!',
        subText: 'All 10 waves cleared. The crystal stands.',
        score,
        high,
        buttonText: 'Play again',
        withMenu: true,
      });
    },

    showLose(score, high) {
      show({
        newMode: 'end',
        titleText: 'Defeat',
        subText: 'The crystal has fallen.',
        score,
        high,
        buttonText: 'Play again',
        withMenu: true,
      });
    },
  };
}
