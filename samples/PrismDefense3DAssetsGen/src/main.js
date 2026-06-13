import './style.css';
import { Emitter } from './core/events.js';
import { createLoop } from './core/loop.js';
import { SimGame } from './sim/sim-game.js';
import { TOWER_TYPES, tileToWorldX, tileToWorldZ } from './sim/config.js';
import { createRendering } from './render/rendering.js';
import { createInput } from './input/input.js';
import { createHud } from './ui/hud.js';
import { createBuildMenu } from './ui/build-menu.js';
import { createScreens } from './ui/screens.js';
import { createAudio } from './audio/audio.js';
import { loadHighScore, saveHighScore } from './save/storage.js';

const canvas = document.getElementById('game-canvas');

const events = new Emitter();
const sim = new SimGame(events);
const rendering = createRendering(canvas);
const audio = createAudio();

// 'menu' | 'playing' | 'paused' | 'ended'
let appPhase = 'menu';
let sheetState = null; // {kind:'build', tile} | {kind:'tower', tower}
let sheetGold = -1;

// ---------- UI ----------

const hud = createHud({
  onNextWave: () => sim.forceNextWave(),
  onPause: () => {
    if (appPhase !== 'playing') return;
    appPhase = 'paused';
    screens.showPause();
  },
  onMute: () => {
    audio.setMuted(!audio.isMuted());
    hud.setMuted(audio.isMuted());
  },
});

const menu = createBuildMenu({
  onBuild(tile, type) {
    if (sim.buildTower(tile.col, tile.row, type)) {
      closeSheet();
    } else {
      audio.sfx.deny();
    }
  },
  onUpgrade(tower) {
    if (sim.upgradeTower(tower)) {
      selectTower(tower); // refresh range ring + sheet (now MAX)
    } else {
      audio.sfx.deny();
    }
  },
  onSell(tower) {
    sim.sellTower(tower);
    closeSheet();
  },
  onClose: () => closeSheet(),
});

let currentLevel = 0;

const screens = createScreens({
  onAction(mode) {
    if (mode === 'pause') {
      appPhase = 'playing';
      screens.hide();
      loop.resetClock();
    } else if (mode === 'end') {
      logRendererInfo('restart');
      startRun(currentLevel);
    }
  },
  onStartLevel(levelIndex) {
    // First user gesture: unlocks WebAudio and starts the chosen level.
    audio.unlock();
    audio.startMusic();
    startRun(levelIndex);
  },
  onMenu() {
    goToMenu();
  },
});

function startRun(levelIndex) {
  if (levelIndex !== currentLevel) {
    currentLevel = levelIndex;
  }
  rendering.setLevel(levelIndex);
  sim.reset(levelIndex);
  closeSheet();
  appPhase = 'playing';
  screens.hide();
  hud.show();
  loop.resetClock();
}

function goToMenu() {
  sim.reset(currentLevel); // clears towers/enemies behind the menu
  closeSheet();
  audio.stopMusic();
  hud.hide();
  appPhase = 'menu';
  screens.showMenu(loadHighScore());
}

function closeSheet() {
  sheetState = null;
  menu.hide();
  rendering.setSelection(null);
}

function selectTower(tower) {
  const stats = TOWER_TYPES[tower.type].levels[tower.level];
  rendering.setSelection({ x: tower.x, z: tower.z, range: stats.range });
  menu.showTower(tower, sim.gold, sim.sellRefund(tower));
  sheetState = { kind: 'tower', tower };
  sheetGold = sim.gold;
}

function selectBuildTile(tile) {
  rendering.setSelection({ x: tile.x, z: tile.z, range: 0 });
  menu.showBuild(tile, sim.gold);
  sheetState = { kind: 'build', tile };
  sheetGold = sim.gold;
}

// Re-render the open sheet when gold changes so affordability stays truthful.
function refreshSheet() {
  if (!sheetState || sim.gold === sheetGold) return;
  if (sheetState.kind === 'build') selectBuildTile(sheetState.tile);
  else selectTower(sheetState.tower);
}

// ---------- input ----------

function handleTap(clientX, clientY) {
  if (appPhase !== 'playing') return;
  const tile = rendering.pickTile(clientX, clientY);
  if (!tile) {
    closeSheet();
    return;
  }
  const tower = sim.towerAt(tile.col, tile.row);
  if (tower) {
    selectTower(tower);
  } else if (sim.canBuildAt(tile.col, tile.row)) {
    selectBuildTile({
      col: tile.col,
      row: tile.row,
      x: tileToWorldX(tile.col),
      z: tileToWorldZ(tile.row),
    });
  } else {
    closeSheet();
  }
}

createInput(canvas, {
  onTap: handleTap,
  onOrbit: (dx, dy) => rendering.rig.orbit(dx, dy),
  onZoom: (factor) => rendering.rig.zoom(factor),
});

// Fallback unlock if the first gesture somehow bypasses the menu button.
window.addEventListener('pointerdown', () => audio.unlock(), { once: true });

// ---------- sim events → audio + fx ----------

events.on('waveStart', () => audio.sfx.horn());
events.on('bossSpawn', () => audio.sfx.horn());
events.on('towerBuilt', (t) => {
  audio.sfx.build();
  rendering.fxBuild(t.x, t.z);
});
events.on('towerUpgraded', (t) => {
  audio.sfx.upgrade();
  rendering.fxBuild(t.x, t.z);
});
events.on('towerSold', () => audio.sfx.sell());
events.on('shot', (s) => audio.sfx.shot(s.kind));
events.on('frostPulse', (p) => {
  audio.sfx.frost();
  rendering.fxFrost(p.x, p.z, p.range);
});
events.on('enemyDied', (d) => {
  audio.sfx.death();
  rendering.fxDeath(d.x, d.z);
});
events.on('leak', () => audio.sfx.leak());
events.on('won', (score) => endGame(true, score));
events.on('lost', (score) => endGame(false, score));

function endGame(won, score) {
  appPhase = 'ended';
  saveHighScore(score);
  closeSheet();
  if (won) {
    audio.sfx.win();
    screens.showWin(score, loadHighScore());
  } else {
    audio.sfx.lose();
    screens.showLose(score, loadHighScore());
  }
}

// ---------- loop ----------

const loop = createLoop({
  step(dt) {
    if (appPhase === 'playing') sim.step(dt);
  },
  render(alpha) {
    hud.update(sim);
    refreshSheet();
    rendering.render(sim, appPhase === 'playing' ? alpha : 1, performance.now() / 1000);
  },
});

window.addEventListener('resize', () => rendering.resize());
window.addEventListener('orientationchange', () => rendering.resize());
document.addEventListener('visibilitychange', () => {
  if (document.hidden && appPhase === 'playing') {
    appPhase = 'paused';
    screens.showPause();
  }
});

// ---------- boot ----------

function logRendererInfo(label) {
  const info = rendering.getInfo();
  // GPU memory must stay flat across restarts (see TDD disposal ownership).
  console.log(
    `[prismdefense] ${label} — geometries: ${info.memory.geometries}, textures: ${info.memory.textures}, programs: ${info.programs.length}`
  );
}

window.__pd = {
  sim,
  info: () => logRendererInfo('debug'),
  restart: () => startRun(),
};

hud.setMuted(audio.isMuted());
rendering.resize();
screens.showMenu(loadHighScore());
loop.start();
logRendererInfo('boot');
