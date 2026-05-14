import { DIR } from '../constants.js';

export class Input {
  constructor() {
    this.currentDir = DIR.NONE;
    this.actions = new Map();
    this.unlockListeners = [];
    this._installed = false;
  }

  install() {
    if (this._installed) return;
    this._installed = true;

    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', () => {});

    const dpad = document.getElementById('dpad');
    if (dpad) {
      dpad.querySelectorAll('button[data-dir]').forEach(btn => {
        const dir = btn.dataset.dir;
        const press = (e) => {
          e.preventDefault();
          this._fireUnlock();
          this.setDir(dir);
        };
        btn.addEventListener('touchstart', press, { passive: false });
        btn.addEventListener('mousedown', press);
        btn.addEventListener('click', (e) => e.preventDefault());
      });
    }
  }

  bindTouchSurface(canvas) {
    let startX = 0, startY = 0, active = false;
    const start = (x, y) => { startX = x; startY = y; active = true; };
    const end = (x, y) => {
      if (!active) return;
      active = false;
      const dx = x - startX;
      const dy = y - startY;
      const adx = Math.abs(dx), ady = Math.abs(dy);
      if (adx < 12 && ady < 12) {
        this.setAction('confirm');
        return;
      }
      if (adx > ady) this.setDir(dx > 0 ? 'right' : 'left');
      else this.setDir(dy > 0 ? 'down' : 'up');
    };

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._fireUnlock();
      const t = e.touches[0];
      start(t.clientX, t.clientY);
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      end(t.clientX, t.clientY);
    }, { passive: false });

    canvas.addEventListener('mousedown', (e) => {
      this._fireUnlock();
      start(e.clientX, e.clientY);
    });
    canvas.addEventListener('mouseup', (e) => {
      end(e.clientX, e.clientY);
    });
  }

  onUnlock(fn) {
    this.unlockListeners.push(fn);
  }

  _fireUnlock() {
    while (this.unlockListeners.length) {
      const fn = this.unlockListeners.shift();
      try { fn(); } catch (e) { /* swallow */ }
    }
  }

  _onKeyDown(e) {
    const key = e.key;
    this._fireUnlock();
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.setDir('up');
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.setDir('down');
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.setDir('left');
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.setDir('right');
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        this.setAction('confirm');
        e.preventDefault();
        break;
      case 'Escape':
      case 'p':
      case 'P':
        this.setAction('pause');
        e.preventDefault();
        break;
      case 'r':
      case 'R':
        this.setAction('restart');
        e.preventDefault();
        break;
      case 'm':
      case 'M':
        this.setAction('menu');
        e.preventDefault();
        break;
    }
  }

  setDir(name) {
    switch (name) {
      case 'up': this.currentDir = DIR.UP; break;
      case 'down': this.currentDir = DIR.DOWN; break;
      case 'left': this.currentDir = DIR.LEFT; break;
      case 'right': this.currentDir = DIR.RIGHT; break;
      default: this.currentDir = DIR.NONE;
    }
  }

  getDirection() {
    return this.currentDir;
  }

  setAction(name) {
    this.actions.set(name, true);
  }

  consumeAction(name) {
    if (this.actions.get(name)) {
      this.actions.delete(name);
      return true;
    }
    return false;
  }
}
