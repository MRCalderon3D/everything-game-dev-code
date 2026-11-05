// Full-screen overlays: menu, pause, victory, defeat. One overlay element,
// reconfigured per state.
export function createScreens({ onAction }) {
  const overlay = document.getElementById('overlay');
  const sub = document.getElementById('overlay-sub');
  const scoreEl = document.getElementById('overlay-score');
  const highEl = document.getElementById('overlay-high');
  const title = document.querySelector('#overlay-panel h1');
  const button = document.getElementById('btn-overlay');

  let mode = 'menu';
  button.addEventListener('click', () => onAction(mode));

  function show({ newMode, titleText, subText, score, high, buttonText }) {
    mode = newMode;
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
      overlay.classList.add('hidden');
    },

    showMenu(high) {
      show({
        newMode: 'menu',
        titleText: 'PrismDefense',
        subText: 'Stop the waves before they reach the crystal.',
        score: null,
        high,
        buttonText: 'Tap to play',
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
      });
    },
  };
}
