export class PauseState {
    constructor(game) { this.game = game; }

    enter() {}

    update() {
        if (this.game.input.wasPressed('Escape') || this.game.input.wasPressed('KeyP')) {
            this.game.fsm.change('playing_resume', { playState: this.playState });
        }
    }

    render() {
        this.game.renderer.drawOverlay(0.6);
        this.game.renderer.drawPauseText();
    }

    handleClick() {
        this.game.fsm.change('playing_resume', { playState: this.playState });
    }
}
