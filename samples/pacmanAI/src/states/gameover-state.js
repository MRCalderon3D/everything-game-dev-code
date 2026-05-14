import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';
import { Storage } from '../systems/storage.js';

export class GameOverState {
    constructor(game) {
        this.game = game;
        this.isHighScore = false;
        this.score = 0;
        this.level = 0;
        this.timer = 0;
    }

    enter({ score, level }) {
        this.score = score;
        this.level = level;
        this.isHighScore = Storage.isHighScore(score);
        if (this.isHighScore) {
            Storage.addHighScore(score);
        }
        this.timer = 0;
        this.game.audio.stopMusic();
    }

    update(dt) {
        this.timer += dt;
        if (this.timer > 0.5 && (this.game.input.wasPressed('Enter') || this.game.input.wasPressed('Space'))) {
            this.game.fsm.change('menu');
        }
    }

    render() {
        this.game.renderer.clear();
        this.game.renderer.drawGameOverText(this.score, this.level, this.isHighScore);
    }

    handleClick() {
        if (this.timer > 0.5) {
            this.game.fsm.change('menu');
        }
    }
}
