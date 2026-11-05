// Fixed-timestep loop: simulation steps at FIXED_DT, rendering interpolates
// with the leftover accumulator fraction (alpha).
export const FIXED_DT = 1 / 60;

const MAX_ACCUMULATED = 0.25;

export function createLoop({ step, render }) {
  let last = 0;
  let accumulator = 0;
  let running = false;
  let rafId = 0;

  function frame(now) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const elapsed = Math.min((now - last) / 1000, MAX_ACCUMULATED);
    last = now;
    accumulator = Math.min(accumulator + elapsed, MAX_ACCUMULATED);
    while (accumulator >= FIXED_DT) {
      step(FIXED_DT);
      accumulator -= FIXED_DT;
    }
    render(accumulator / FIXED_DT);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      accumulator = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    // After a tab switch or pause, restart timing so the sim does not jump.
    resetClock() {
      last = performance.now();
      accumulator = 0;
    },
  };
}
