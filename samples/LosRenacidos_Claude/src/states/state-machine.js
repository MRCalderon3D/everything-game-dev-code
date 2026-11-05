export class StateMachine {
  constructor(context) {
    this.context = context;
    this.current = null;
    this.overlay = null;
  }

  switchState(StateCtor, params = {}) {
    if (this.current && typeof this.current.exit === 'function') this.current.exit(this.context);
    this.current = new StateCtor(this.context, params);
    if (typeof this.current.enter === 'function') this.current.enter(this.context);
  }

  pushOverlay(StateCtor, params = {}) {
    if (this.overlay && typeof this.overlay.exit === 'function') this.overlay.exit(this.context);
    this.overlay = new StateCtor(this.context, params);
    if (typeof this.overlay.enter === 'function') this.overlay.enter(this.context);
  }

  popOverlay() {
    if (this.overlay && typeof this.overlay.exit === 'function') this.overlay.exit(this.context);
    this.overlay = null;
  }

  update(dt) {
    if (this.overlay && typeof this.overlay.update === 'function') {
      this.overlay.update(dt, this.context);
      return;
    }
    if (this.current && typeof this.current.update === 'function') this.current.update(dt, this.context);
  }

  render(renderer) {
    if (this.current && typeof this.current.render === 'function') this.current.render(renderer, this.context);
    if (this.overlay && typeof this.overlay.render === 'function') this.overlay.render(renderer, this.context);
  }
}
