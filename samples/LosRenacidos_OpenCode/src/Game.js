import AudioManager from './audio/AudioManager.js';
import SceneManager from './SceneManager.js';
import Input from './Input.js';
import SaveManager from './utils/SaveManager.js';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/Constants.js';

import StatsSystem from './systems/StatsSystem.js';
import InventorySystem from './systems/InventorySystem.js';
import ProgressionSystem from './systems/ProgressionSystem.js';
import MissionSystem from './systems/MissionSystem.js';

import Player from './entities/Player.js';

import MainMenuScene from './scenes/MainMenuScene.js';
import HubScene from './scenes/HubScene.js';
import MapScene from './scenes/MapScene.js';
import CombatScene from './scenes/CombatScene.js';
import EventScene from './scenes/EventScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import PauseScene from './scenes/PauseScene.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.input = new Input(this.canvas);
    this.audio = new AudioManager();
    this.saveManager = SaveManager;
    this.sceneManager = new SceneManager();
    this.notifications = [];
    this.notificationTimers = [];

    this.progressionSystem = new ProgressionSystem();
    this._loadMetaProgression();

    this.scenes = {
      MainMenuScene, HubScene, MapScene, CombatScene, EventScene,
      GameOverScene, SettingsScene, PauseScene,
    };

    this.lastTime = performance.now();
    this.running = false;
    this.paused = false;
  }

  resize() {
    const container = document.getElementById('game-container');
    const maxW = container.clientWidth;
    const maxH = container.clientHeight;
    const ratio = GAME_WIDTH / GAME_HEIGHT;

    let w, h;
    if (maxW / maxH > ratio) {
      h = maxH;
      w = h * ratio;
    } else {
      w = maxW;
      h = w / ratio;
    }

    this.canvas.style.width = Math.floor(w) + 'px';
    this.canvas.style.height = Math.floor(h) + 'px';
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
  }

  _loadMetaProgression() {
    const data = this.saveManager.load('metaProgression');
    if (data) {
      this.progressionSystem.load(data);
    }
    const settings = this.saveManager.load('settings');
    if (settings) {
      if (this.audio) {
        this.audio.musicVolume = settings.musicVolume || 0.4;
        this.audio.sfxVolume = settings.sfxVolume || 0.7;
      }
    }
  }

  startNewRun() {
    this.audio.ensureInit();

    this.progressionSystem = new ProgressionSystem();
    this._loadMetaProgression();

    this.statsSystem = new StatsSystem(this.progressionSystem);
    this.inventorySystem = new InventorySystem();
    this.missionSystem = new MissionSystem();
    this.notifications = [];
    this.notificationTimers = [];

    this.player = new Player(this.statsSystem, this.inventorySystem, this.audio);
    this.paused = false;

    this.sceneManager.setScene(new HubScene(this));
  }

  continueRun() {
    this.progressionSystem = new ProgressionSystem();
    this._loadMetaProgression();

    this.statsSystem = new StatsSystem(this.progressionSystem);
    this.inventorySystem = new InventorySystem();
    this.missionSystem = new MissionSystem();
    this.notifications = [];
    this.notificationTimers = [];
    this.player = new Player(this.statsSystem, this.inventorySystem, this.audio);
    this.paused = false;

    this.sceneManager.setScene(new HubScene(this));
  }

  start() {
    this.running = true;
    this.sceneManager.setScene(new MainMenuScene(this));
    this._loop(performance.now());
  }

  _loop(time) {
    if (!this.running) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (this.input.isKeyPressed('Escape') && this.sceneManager.currentScene) {
      const current = this.sceneManager.currentScene;
      if (!(current instanceof PauseScene) && !(current instanceof MainMenuScene)) {
        this.sceneManager.setScene(new PauseScene(this, current));
      }
    }

    this.sceneManager.update(dt);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.sceneManager.render(ctx);

    this._manageNotifications(dt);
    this.input.lateUpdate();

    requestAnimationFrame((t) => this._loop(t));
  }

  _manageNotifications(dt) {
    this.notificationTimers = this.notificationTimers.filter(t => {
      t.time -= dt;
      if (t.time <= 0) {
        this.notifications = this.notifications.filter(n => n !== t.text);
        return false;
      }
      return true;
    });

    this.notifications.slice(0, -5).forEach(n => {
      const timer = this.notificationTimers.find(t => t.text === n);
      if (timer) timer.time = Math.min(timer.time, 0.5);
    });

    this.notifications.slice(-5).forEach(n => {
      if (!this.notificationTimers.find(t => t.text === n)) {
        this.notificationTimers.push({ text: n, time: 3.0 });
      }
    });
  }
}

export default Game;
