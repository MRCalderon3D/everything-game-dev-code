import { Renderer } from './systems/renderer.js';
import { InputSystem } from './systems/input.js';
import { AudioSystem } from './systems/audio.js';
import { GameStateMachine } from './states/state-machine.js';
import { MenuState, HighScoresState } from './states/menu-state.js';
import { PlayState } from './states/play-state.js';
import { PauseState } from './states/pause-state.js';
import { GameOverState } from './states/gameover-state.js';

class Game {
    constructor() {
        const canvas = document.getElementById('game');
        this.renderer = new Renderer(canvas);
        this.input = new InputSystem();
        this.input.attach(canvas);
        this.audio = new AudioSystem();

        this.fsm = new GameStateMachine();

        const playState = new PlayState(this);
        this.fsm.add('menu', new MenuState(this));
        this.fsm.add('playing', playState);
        this.fsm.add('paused', new PauseState(this));
        this.fsm.add('gameover', new GameOverState(this));
        this.fsm.add('highscores', new HighScoresState(this));

        const self = this;
        this.fsm.add('playing_resume', {
            enter(params) {
                const ps = params.playState;
                self.fsm.currentState = ps;
                self.fsm.currentName = 'playing';
                self.audio.resume();
            },
        });

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            this.audio.init();
            this.audio.resume();
            this.fsm.handleClick(x, y);
        });

        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            this.audio.init();
            this.audio.resume();
            this.fsm.handleClick(x, y);
        }, { passive: true });

        this.fsm.change('menu');
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    loop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        this.fsm.update(dt);
        this.fsm.render();
        this.input.endFrame();

        requestAnimationFrame(this.loop);
    }
}

const game = new Game();
