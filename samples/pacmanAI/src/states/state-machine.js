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
        this.currentState = this.states[name];
        this.currentName = name;
        if (this.currentState && this.currentState.enter) {
            this.currentState.enter(params);
        }
    }

    update(dt) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(dt);
        }
    }

    render() {
        if (this.currentState && this.currentState.render) {
            this.currentState.render();
        }
    }

    handleClick(x, y) {
        if (this.currentState && this.currentState.handleClick) {
            this.currentState.handleClick(x, y);
        }
    }
}
