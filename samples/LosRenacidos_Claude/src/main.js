import { Renderer } from './systems/renderer.js';
import { Input } from './systems/input.js';
import { Audio } from './systems/audio.js';
import { Storage } from './systems/storage.js';
import { Notifications } from './systems/notifications.js';
import { Particles } from './systems/particles.js';
import { StateMachine } from './states/state-machine.js';
import { MenuState } from './states/menu-state.js';

function boot() {
  const canvas = document.getElementById('game');
  const renderer = new Renderer(canvas);
  const input = new Input();
  const audio = new Audio();
  const storage = new Storage();
  const notifications = new Notifications();
  const particles = new Particles();

  input.install(canvas);
  input.onUnlock(() => audio.unlock());

  const save = storage.load();
  const context = {
    canvas,
    renderer,
    input,
    audio,
    storage,
    save,
    archive: save,
    notifications,
    particles,
    player: null,
    runMap: null,
    quest: { active: null, progress: 0, goal: 0, reward: null },
    elapsed: 0,
  };

  const sm = new StateMachine(context);
  context.switchState = (StateCtor, params) => sm.switchState(StateCtor, params);
  context.pushOverlay = (StateCtor, params) => sm.pushOverlay(StateCtor, params);
  context.popOverlay = () => sm.popOverlay();
  context.sm = sm;

  sm.switchState(MenuState, {});

  let last = performance.now();
  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 1 / 30) dt = 1 / 30;
    context.elapsed += dt;
    try {
      sm.update(dt);
      sm.render(renderer);
    } catch (err) {
      console.error('Frame error:', err);
      renderer.clear();
      renderer.drawText('Runtime error — F12 para consola.', 480, 280, { size: 16, color: '#ff8a3d', align: 'center' });
      renderer.drawText(String(err && err.message ? err.message : err), 480, 308, { size: 12, color: '#d6c79a', align: 'center' });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
