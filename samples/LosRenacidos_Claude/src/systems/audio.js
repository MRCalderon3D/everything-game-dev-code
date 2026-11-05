export class Audio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.unlocked = false;
    this.muted = false;
  }

  unlock() {
    if (this.unlocked) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.30;
      this.master.connect(this.ctx.destination);
      this.unlocked = true;
    } catch (_) {
      this.unlocked = false;
    }
  }

  _now() { return this.ctx ? this.ctx.currentTime : 0; }

  play(event) {
    if (!this.unlocked || this.muted) return;
    const ctx = this.ctx;
    const now = this._now();
    switch (event) {
      case 'swing': this._sweep(720, 280, 0.10, 'triangle', 0.16); break;
      case 'heavy-swing': this._sweep(420, 180, 0.22, 'sawtooth', 0.18); break;
      case 'hit': this._noiseBurst(0.08, 0.22, 1800); this._tone(180, 0.06, 'square', 0.14); break;
      case 'crit': this._sweep(900, 1400, 0.18, 'triangle', 0.22); this._noiseBurst(0.05, 0.18, 2400); break;
      case 'damage': this._tone(120, 0.20, 'sawtooth', 0.20); this._noiseBurst(0.20, 0.15, 600); break;
      case 'dodge': this._sweep(560, 360, 0.14, 'sine', 0.10); break;
      case 'block': this._tone(620, 0.10, 'square', 0.18); break;
      case 'parry': this._tone(880, 0.05, 'triangle', 0.22); this._tone(1320, 0.10, 'triangle', 0.18, 0.04); break;
      case 'skill-up': this._tone(523, 0.12, 'triangle', 0.18); this._tone(659, 0.12, 'triangle', 0.18, 0.10); this._tone(784, 0.16, 'triangle', 0.20, 0.20); break;
      case 'enemy-die': this._sweep(360, 90, 0.30, 'sawtooth', 0.20); break;
      case 'boss-die': [220, 165, 130, 98].forEach((f, i) => this._tone(f, 0.30, 'sawtooth', 0.22, i * 0.20)); break;
      case 'boss-roar': this._sweep(220, 60, 0.80, 'sawtooth', 0.28); break;
      case 'menu-select': this._tone(880, 0.08, 'triangle', 0.18); break;
      case 'menu-confirm': this._tone(523, 0.08, 'triangle', 0.18); this._tone(784, 0.10, 'triangle', 0.18, 0.06); break;
      case 'death': this._sweep(440, 70, 1.0, 'sawtooth', 0.26); break;
      case 'pickup': this._tone(880, 0.06, 'triangle', 0.16); this._tone(1175, 0.08, 'triangle', 0.18, 0.04); break;
      case 'eco': [330, 415, 523, 659].forEach((f, i) => this._tone(f, 0.20, 'triangle', 0.20, i * 0.10)); break;
      case 'enter-room': this._sweep(180, 80, 0.30, 'sine', 0.12); break;
      case 'meditate': this._tone(220, 0.6, 'sine', 0.10); break;
    }
  }

  _tone(freq, duration, type = 'sine', peak = 0.2, delay = 0) {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    const t = this._now() + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.01);
    g.gain.linearRampToValueAtTime(0, t + duration);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.05);
  }

  _sweep(fromFreq, toFreq, duration, type = 'sine', peak = 0.2) {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    const t = this._now();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(fromFreq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, toFreq), t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.01);
    g.gain.linearRampToValueAtTime(0, t + duration);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.05);
  }

  _noiseBurst(duration, peak = 0.2, filterFreq = 1200) {
    if (!this.unlocked) return;
    const ctx = this.ctx;
    const t = this._now();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filterFreq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.linearRampToValueAtTime(0, t + duration);
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + duration + 0.02);
  }
}
