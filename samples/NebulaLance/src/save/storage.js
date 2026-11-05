// localStorage wrapper, safe in private mode (storage may throw).
const HIGH_SCORE_KEY = 'nebulalance.highscore';
const MUTED_KEY = 'nebulalance.muted';

export function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    if (score > loadHighScore()) localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    /* storage unavailable */
  }
}

export function loadMuted() {
  try {
    return localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMuted(muted) {
  try {
    localStorage.setItem(MUTED_KEY, muted ? '1' : '0');
  } catch {
    /* storage unavailable */
  }
}
