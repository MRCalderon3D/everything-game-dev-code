import './style.css';
import { Emitter } from './core/events.js';
import { createLoop } from './core/loop.js';
import { SimGame } from './sim/sim-game.js';
import { createRendering } from './render/rendering.js';
import { createInput } from './input/input.js';
import { createHud } from './ui/hud.js';
import { createScreens } from './ui/screens.js';
import { createAudio } from './audio/audio.js';
import { loadHighScore, saveHighScore } from './save/storage.js';

const canvas = document.getElementById('game-canvas');

const events = new Emitter();
const sim = new SimGame(events);
const rendering = createRendering(canvas);
const audio = createAudio();

let appPhase = 'menu'; // 'menu' | 'playing' | 'paused' | 'ended'
let touchTarget = null; // {clientX, clientY} while a move-drag is active

// ---------- UI ----------
const hud = createHud({
  onPause: () => pause(),
  onMute: () => {
    audio.setMuted(!audio.isMuted());
    hud.setMuted(audio.isMuted());
  },
});

const screens = createScreens({
  onStart: () => {
    audio.unlock();
    audio.startMusic();
    startRun();
  },
  onResume: () => resume(),
  onRestart: () => {
    logInfo('restart');
    startRun();
  },
  onMenu: () => goToMenu(),
});

function startRun() {
  sim.reset();
  appPhase = 'playing';
  screens.hide();
  hud.show();
  loop.resetClock();
}
function pause() {
  if (appPhase !== 'playing') return;
  appPhase = 'paused';
  screens.showPause();
}
function resume() {
  appPhase = 'playing';
  screens.hide();
  loop.resetClock();
}
function goToMenu() {
  sim.reset();
  audio.stopMusic();
  hud.hide();
  appPhase = 'menu';
  screens.showMenu(loadHighScore());
}
function endGame(won, score) {
  appPhase = 'ended';
  saveHighScore(score);
  audio.stopMusic();
  if (won) audio.sfx.win();
  else audio.sfx.lose();
  if (won) screens.showWin(score, loadHighScore());
  else screens.showLose(score, loadHighScore());
}

// ---------- input ----------
const input = createInput(canvas, {
  onMoveTarget: (x, y) => {
    touchTarget = { x, y };
  },
  onMoveEnd: () => {
    touchTarget = null;
  },
  onFireDown: () => {
    audio.unlock();
    if (appPhase === 'playing') sim.fireDown();
  },
  onFireUp: () => {
    if (appPhase === 'playing') sim.fireUp();
  },
  onForceSide: () => {
    if (appPhase === 'playing') sim.toggleForceSide();
  },
  onForceLaunch: () => {
    if (appPhase === 'playing') sim.launchOrRecallForce();
  },
  onPause: () => {
    if (appPhase === 'playing') pause();
    else if (appPhase === 'paused') resume();
  },
  onMute: () => {
    audio.setMuted(!audio.isMuted());
    hud.setMuted(audio.isMuted());
  },
});

// On-screen buttons (touch). FIRE is hold-to-charge.
function bindHold(id, down, up) {
  const el = document.getElementById(id);
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    down();
  });
  const end = (e) => {
    e.preventDefault();
    up();
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}
function bindTap(id, fn) {
  const el = document.getElementById(id);
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    fn();
  });
}
bindHold(
  'btn-fire',
  () => {
    audio.unlock();
    if (appPhase === 'playing') sim.fireDown();
  },
  () => {
    if (appPhase === 'playing') sim.fireUp();
  }
);
bindTap('btn-force-side', () => {
  if (appPhase === 'playing') sim.toggleForceSide();
});
bindTap('btn-force-launch', () => {
  if (appPhase === 'playing') sim.launchOrRecallForce();
});

// Resolve movement once per frame: keyboard wins; else finger-follow.
function applyMovement() {
  if (appPhase !== 'playing') {
    sim.setMove(0, 0);
    return;
  }
  const kd = input.keyboardDir();
  if (kd) {
    sim.setMove(kd.x, kd.y);
    return;
  }
  if (touchTarget) {
    const w = rendering.screenToWorld(touchTarget.x, touchTarget.y);
    if (w) {
      sim.setMove((w.x - sim.player.x) * 5, (w.y - sim.player.y) * 5);
      return;
    }
  }
  sim.setMove(0, 0);
}

// ---------- sim events -> audio + fx ----------
events.on('shot', () => audio.sfx.shot());
events.on('beam', () => audio.sfx.beam());
events.on('explosion', (e) => {
  audio.sfx.explosion();
  rendering.fxExplosion(e.x, e.y, e.scale);
});
events.on('powerup', () => audio.sfx.powerup());
events.on('forceState', () => audio.sfx.force());
events.on('playerHit', (e) => {
  audio.sfx.explosion();
  if (!e || !e.shielded) rendering.fxExplosion(sim.player.x, sim.player.y, 1.2);
});
events.on('bossWarning', () => audio.sfx.warning());
events.on('won', (score) => endGame(true, score));
events.on('lost', (score) => endGame(false, score));

// ---------- loop ----------
const loop = createLoop({
  step(dt) {
    if (appPhase === 'playing') sim.step(dt);
  },
  render(alpha) {
    applyMovement();
    if (appPhase === 'playing' || appPhase === 'paused') hud.update(sim);
    rendering.render(sim, appPhase === 'playing' ? alpha : 1, performance.now() / 1000);
  },
});

window.addEventListener('resize', () => rendering.resize());
window.addEventListener('orientationchange', () => rendering.resize());
document.addEventListener('visibilitychange', () => {
  if (document.hidden && appPhase === 'playing') pause();
});
window.addEventListener('pointerdown', () => audio.unlock(), { once: true });

// ---------- boot ----------
function logInfo(label) {
  const info = rendering.getInfo();
  console.log(
    `[nebulalance] ${label} — geometries: ${info.memory.geometries}, textures: ${info.memory.textures}, programs: ${info.programs.length}`
  );
}
window.__nl = { sim, info: () => logInfo('debug'), restart: () => startRun() };

hud.setMuted(audio.isMuted());
rendering.resize();
screens.showMenu(loadHighScore());
loop.start();
logInfo('boot');
