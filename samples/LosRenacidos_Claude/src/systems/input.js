export class Input {
  constructor() {
    this.keys = new Set();
    this.actions = new Map();
    this.unlockListeners = [];
    this._installed = false;
  }

  install(canvas) {
    if (this._installed) return;
    this._installed = true;
    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));
    canvas.addEventListener('mousedown', () => this._fireUnlock());
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._fireUnlock();
      this.setAction('confirm');
    }, { passive: false });
  }

  onUnlock(fn) { this.unlockListeners.push(fn); }
  _fireUnlock() {
    while (this.unlockListeners.length) {
      const fn = this.unlockListeners.shift();
      try { fn(); } catch (_) {}
    }
  }

  _onKeyDown(e) {
    if (e.repeat) return;
    this._fireUnlock();
    const k = e.key.toLowerCase();
    this.keys.add(k);
    if (k === 'arrowup' || k === 'arrowdown' || k === 'arrowleft' || k === 'arrowright') e.preventDefault();
    if (k === ' ') e.preventDefault();
    if (k === 'enter' || k === ' ') this.setAction('confirm');
    if (k === 'escape') this.setAction('cancel');
    if (k === 'e') this.setAction('interact');
    if (k === 'j' || k === ' ') this.setAction('attack');
    if (k === 'k') this.setAction('heavy');
    if (k === 'shift') this.setAction('dodge');
    if (k === 'm') this.setAction('meditate');
    if (k === 'p') this.setAction('pause');
    if (k === 'i') this.setAction('archive');
    if (k === 'r') this.setAction('restart');
    if (k === '1') this.setAction('choose-1');
    if (k === '2') this.setAction('choose-2');
    if (k === '3') this.setAction('choose-3');
    if (k === '4') this.setAction('choose-4');
  }

  _onKeyUp(e) {
    this.keys.delete(e.key.toLowerCase());
  }

  setAction(name) { this.actions.set(name, true); }
  consumeAction(name) {
    if (this.actions.get(name)) {
      this.actions.delete(name);
      return true;
    }
    return false;
  }

  isHeld(name) {
    switch (name) {
      case 'block': return this.keys.has('l');
      case 'attack': return this.keys.has('j') || this.keys.has(' ');
      case 'heavy': return this.keys.has('k');
      case 'dodge': return this.keys.has('shift');
      case 'meditate': return this.keys.has('m');
      case 'interact': return this.keys.has('e');
      default: return false;
    }
  }

  moveAxes() {
    let dx = 0, dy = 0;
    if (this.keys.has('arrowleft') || this.keys.has('a')) dx -= 1;
    if (this.keys.has('arrowright') || this.keys.has('d')) dx += 1;
    if (this.keys.has('arrowup') || this.keys.has('w')) dy -= 1;
    if (this.keys.has('arrowdown') || this.keys.has('s')) dy += 1;
    if (dx !== 0 && dy !== 0) {
      const k = 1 / Math.sqrt(2);
      dx *= k; dy *= k;
    }
    return { dx, dy };
  }
}
