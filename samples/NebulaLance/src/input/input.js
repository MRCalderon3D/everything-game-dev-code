// Input: keyboard (desktop) + touch (mobile). Movement is reported as either a
// discrete keyboard direction or a touch target point (finger-follow); the FIRE
// and FORCE buttons are DOM elements wired in main.js. One pointer path; no hover.
export function createInput(canvas, handlers) {
  const keys = new Set();
  let touchActive = false;
  let touchId = -1;

  // ---- keyboard ----
  const MOVE_KEYS = new Set([
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
  ]);

  function keyDir() {
    let x = 0;
    let y = 0;
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) x -= 1;
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) x += 1;
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) y += 1;
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) y -= 1;
    return { x, y };
  }

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key;
    if (MOVE_KEYS.has(k)) {
      keys.add(k);
      e.preventDefault();
    } else if (k === ' ' || k === 'j' || k === 'J') {
      handlers.onFireDown();
      e.preventDefault();
    } else if (k === 'k' || k === 'K') {
      handlers.onForceSide();
    } else if (k === 'l' || k === 'L') {
      handlers.onForceLaunch();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      handlers.onPause();
    } else if (k === 'm' || k === 'M') {
      handlers.onMute();
    }
  });
  window.addEventListener('keyup', (e) => {
    const k = e.key;
    if (MOVE_KEYS.has(k)) keys.delete(k);
    else if (k === ' ' || k === 'j' || k === 'J') handlers.onFireUp();
  });

  // ---- touch / pointer movement on the canvas (finger-follow) ----
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    touchActive = true;
    touchId = e.pointerId;
    canvas.setPointerCapture(e.pointerId);
    handlers.onMoveTarget(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!touchActive || e.pointerId !== touchId) return;
    handlers.onMoveTarget(e.clientX, e.clientY);
  });
  function endPointer(e) {
    if (e.pointerId !== touchId) return;
    touchActive = false;
    touchId = -1;
    handlers.onMoveEnd();
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);

  return {
    // Called by main each frame: returns the active keyboard direction (or null
    // when idle so main can fall back to the touch target).
    keyboardDir() {
      const d = keyDir();
      return d.x === 0 && d.y === 0 ? null : d;
    },
    isTouchActive() {
      return touchActive;
    },
  };
}
