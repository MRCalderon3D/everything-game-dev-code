import { Maze } from './entities/maze.js';
import { Input } from './systems/input.js';
import { Audio } from './systems/audio.js';
import { Storage } from './systems/storage.js';
import { Renderer } from './systems/renderer.js';
import { StateMachine } from './states/state-machine.js';
import { MenuState } from './states/menu-state.js';

function boot() {
  const canvas = document.getElementById('game');
  const renderer = new Renderer(canvas);
  const input = new Input();
  const audio = new Audio();
  const storage = new Storage();
  const maze = new Maze();

  input.install();
  input.bindTouchSurface(canvas);
  input.onUnlock(() => audio.unlock());

  const context = {
    canvas,
    renderer,
    input,
    audio,
    storage,
    maze,
    elapsed: 0,
    switchState: (StateCtor, params) => sm.switchState(StateCtor, params),
  };

  const sm = new StateMachine(context);
  context.switchState = (StateCtor, params) => sm.switchState(StateCtor, params);
  sm.switchState(MenuState, {});

  let last = performance.now();
  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 1 / 30) dt = 1 / 30;
    context.elapsed += dt;
    sm.update(dt);
    sm.render(renderer);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
