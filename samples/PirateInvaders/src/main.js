import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import PauseScene from './scenes/PauseScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './config.js';
import { initTouchControls } from './utils/TouchInput.js';

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COLORS.background,
  parent: 'game',
  input: {
    touch: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: isTouchDevice ? Phaser.Scale.NONE : Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  scene: [BootScene, MenuScene, GameScene, PauseScene, GameOverScene],
};

const game = new Phaser.Game(config);

if (isTouchDevice) {
  function resizeGame() {
    const controlsHeight = 160;
    const availH = window.innerHeight - controlsHeight;
    const availW = window.innerWidth;
    const scale = Math.min(availW / GAME_WIDTH, availH / GAME_HEIGHT);
    const newW = Math.floor(GAME_WIDTH * scale);
    const newH = Math.floor(GAME_HEIGHT * scale);
    game.scale.resize(GAME_WIDTH, GAME_HEIGHT);
    game.canvas.style.width = newW + 'px';
    game.canvas.style.height = newH + 'px';
  }
  game.events.on('ready', resizeGame);
  window.addEventListener('resize', resizeGame);
}

initTouchControls();
