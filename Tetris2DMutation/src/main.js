import { Renderer } from './renderer.js';
import { InputSystem } from './input.js';
import { AudioSystem } from './audio.js';
import { Storage } from './storage.js';
import { GameStateMachine } from './states/state-machine.js';
import { MenuState } from './states/menu-state.js';
import { PlayState } from './states/play-state.js';
import { PauseState } from './states/pause-state.js';
import { GameOverState } from './states/gameover-state.js';
import { SettingsState } from './states/settings-state.js';
import { HighScoresState } from './states/highscores-state.js';

class Game {
    constructor() {
        const canvas = document.getElementById('game');
        this.renderer = new Renderer(canvas);
        this.input = new InputSystem();
        this.input.attachCanvas(canvas);
        this.audio = new AudioSystem();

        // Load saved audio settings
        const settings = Storage.getSettings();
        this.audio.musicVolume = settings.musicVolume;
        this.audio.sfxVolume = settings.sfxVolume;

        // State machine
        this.fsm = new GameStateMachine();

        // Create states
        const playState = new PlayState(this);
        this.fsm.add('menu', new MenuState(this));
        this.fsm.add('playing', playState);
        this.fsm.add('paused', new PauseState(this));
        this.fsm.add('gameover', new GameOverState(this));
        this.fsm.add('settings', new SettingsState(this));
        this.fsm.add('highscores', new HighScoresState(this));

        // Special "resume" state that just re-enters the existing play state
        const self = this;
        this.fsm.add('playing_resume', {
            enter(params) {
                // Restore the play state directly without resetting
                const ps = params.playState;
                self.fsm.currentState = ps;
                self.fsm.currentName = 'playing';
                self.audio.playMusic(140 + (ps.scoring.level - 1) * 5);
            },
        });

        // Handle canvas clicks
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            this.fsm.handleClick(x, y);
        });

        // Start
        this.fsm.change('menu');
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    loop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.1); // cap at 100ms
        this.lastTime = time;

        this.input.update(dt * 1000); // input expects ms
        this.fsm.update(dt);
        this.fsm.render();
        this.input.endFrame();

        requestAnimationFrame(this.loop);
    }
}

const game = new Game();
