export class Audio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.unlocked = false;
    this.muted = false;
    this.ambient = null;
  }

  unlock() {
    if (this.unlocked) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.35;
      this.master.connect(this.ctx.destination);
      this.unlocked = true;
    } catch (e) {
      this.unlocked = false;
    }
  }

  _now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  _envelope(node, attack, decay, sustain, release, peak = 1) {
    const t = this._now();
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(0, t);
    node.gain.linearRampToValueAtTime(peak, t + attack);
    node.gain.linearRampToValueAtTime(peak * sustain, t + attack + decay);
    node.gain.linearRampToValueAtTime(0, t + attack + decay + release);
    return t + attack + decay + release;
  }

  play(event) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const now = this._now();
    switch (event) {
      case 'pellet': {
        this._chirp(740 + Math.random() * 40, 0.06);
        break;
      }
      case 'pellet-alt': {
        this._chirp(620 + Math.random() * 40, 0.06);
        break;
      }
      case 'power': {
        this._tone(220, 0.4, 'sawtooth', 0.18);
        this._tone(440, 0.45, 'triangle', 0.14);
        break;
      }
      case 'frightened': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(220, now);
        o.frequency.linearRampToValueAtTime(110, now + 0.4);
        g.gain.value = 0;
        this._envelope(g, 0.01, 0.1, 0.6, 0.3, 0.15);
        o.connect(g).connect(this.master);
        o.start(now);
        o.stop(now + 0.5);
        break;
      }
      case 'ghost-eaten': {
        [330, 440, 550, 660].forEach((f, i) => {
          this._tone(f, 0.08, 'square', 0.18, i * 0.07);
        });
        break;
      }
      case 'death': {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(440, now);
        o.frequency.exponentialRampToValueAtTime(80, now + 1.0);
        g.gain.value = 0;
        this._envelope(g, 0.05, 0.2, 0.6, 0.7, 0.25);
        o.connect(g).connect(this.master);
        o.start(now);
        o.stop(now + 1.1);
        break;
      }
      case 'menu-select': {
        this._chirp(880, 0.08, 'triangle', 0.18);
        break;
      }
      case 'level-clear': {
        [523, 659, 784, 1046].forEach((f, i) => {
          this._tone(f, 0.12, 'triangle', 0.2, i * 0.1);
        });
        break;
      }
      case 'extra-life': {
        [523, 659, 784].forEach((f, i) => {
          this._tone(f, 0.15, 'square', 0.2, i * 0.08);
        });
        break;
      }
    }
  }

  _tone(freq, duration, type = 'sine', peak = 0.2, delay = 0) {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    const now = this._now() + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0;
    const t = now;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.02);
    g.gain.linearRampToValueAtTime(0, t + duration);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.05);
  }

  _chirp(freq, duration, type = 'square', peak = 0.18) {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    const now = this._now();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    o.frequency.linearRampToValueAtTime(freq * 1.3, now + duration);
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(peak, now + 0.005);
    g.gain.linearRampToValueAtTime(0, now + duration);
    o.connect(g).connect(this.master);
    o.start(now);
    o.stop(now + duration + 0.05);
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.35;
  }
}
