export class GameStateMachine {
    constructor() {
        this.states = {};
        this.currentState = null;
        this.currentName = null;
    }

    add(name, state) {
        this.states[name] = state;
    }

    change(name, params = {}) {
        if (this.currentState && this.currentState.exit) {
            this.currentState.exit();
        }
        this.currentName = name;
        this.currentState = this.states[name];
        if (this.currentState.enter) {
            this.currentState.enter(params);
        }
    }

    update(dt) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(dt);
        }
    }

    render(ctx) {
        if (this.currentState && this.currentState.render) {
            this.currentState.render(ctx);
        }
    }

    handleClick(x, y) {
        if (this.currentState && this.currentState.handleClick) {
            this.currentState.handleClick(x, y);
        }
    }
}
