export class StateMachine {
  constructor(context) {
    this.context = context;
    this.current = null;
  }

  switchState(StateCtor, params = {}) {
    if (this.current && typeof this.current.exit === 'function') {
      this.current.exit(this.context);
    }
    this.current = new StateCtor(this.context, params);
    if (typeof this.current.enter === 'function') {
      this.current.enter(this.context);
    }
  }

  update(dt) {
    if (this.current && typeof this.current.update === 'function') {
      this.current.update(dt, this.context);
    }
  }

  render(ctx) {
    if (this.current && typeof this.current.render === 'function') {
      this.current.render(ctx, this.context);
    }
  }
}
