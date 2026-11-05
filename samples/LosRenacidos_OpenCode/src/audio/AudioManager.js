class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicVolume = 0.4;
    this.sfxVolume = 0.7;
    this.initialized = false;
    this.currentMusicNote = 0;
    this.musicInterval = null;
    this.musicTimeout = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  ensureInit() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSfx(name) {
    this.ensureInit();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);

    const now = this.ctx.currentTime;

    switch (name) {
      case 'attack':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'hit':
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.05);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'block':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(500, now + 0.06);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'parry':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.04);
        osc.frequency.linearRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'hurt':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case 'death':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;

      case 'notification':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'item':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'mission':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.1);
        osc.frequency.setValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
  }

  startMusic(scene) {
    this.ensureInit();
    if (!this.ctx) return;
    this.stopMusic();

    const notes = this._getMusicNotes(scene);
    let noteIndex = 0;
    const bpm = 90;
    const interval = (60 / bpm) * 1000;

    const playNext = () => {
      if (!this.initialized || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.musicGain);

      const note = notes[noteIndex % notes.length];
      osc.type = note.type || 'triangle';
      osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15 * (note.vel || 1), this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + (note.dur || 0.4));

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + (note.dur || 0.4) + 0.05);

      noteIndex++;
      this.musicTimeout = setTimeout(playNext, interval);
    };

    playNext();
    this.musicInterval = setInterval(() => {}, interval);
  }

  _getMusicNotes(scene) {
    switch (scene) {
      case 'hub':
        return [
          { freq: 262, dur: 0.5, vel: 0.8 }, { freq: 330, dur: 0.3, vel: 0.7 },
          { freq: 392, dur: 0.6, vel: 0.8 }, { freq: 330, dur: 0.3, vel: 0.7 },
          { freq: 294, dur: 0.4, vel: 0.7 }, { freq: 349, dur: 0.4, vel: 0.8 },
          { freq: 262, dur: 0.6, vel: 0.9 },
        ];
      case 'combat':
        return [
          { freq: 196, dur: 0.3, vel: 1, type: 'sawtooth' }, { freq: 196, dur: 0.15, vel: 0.8, type: 'sawtooth' },
          { freq: 247, dur: 0.3, vel: 1, type: 'sawtooth' }, { freq: 196, dur: 0.15, vel: 0.8, type: 'sawtooth' },
          { freq: 262, dur: 0.3, vel: 1, type: 'sawtooth' }, { freq: 247, dur: 0.15, vel: 0.8, type: 'sawtooth' },
          { freq: 196, dur: 0.4, vel: 0.9, type: 'square' },
        ];
      case 'frontier':
        return [
          { freq: 196, dur: 0.8, vel: 0.7 }, { freq: 165, dur: 0.4, vel: 0.6 },
          { freq: 220, dur: 0.6, vel: 0.7 }, { freq: 196, dur: 0.8, vel: 0.8 },
          { freq: 175, dur: 0.5, vel: 0.6 }, { freq: 220, dur: 0.5, vel: 0.7 },
        ];
      case 'boss':
        return [
          { freq: 147, dur: 0.3, vel: 1.2, type: 'square' }, { freq: 147, dur: 0.2, vel: 1, type: 'square' },
          { freq: 175, dur: 0.4, vel: 1.2, type: 'square' }, { freq: 147, dur: 0.2, vel: 1, type: 'square' },
          { freq: 196, dur: 0.3, vel: 1.1, type: 'sawtooth' }, { freq: 175, dur: 0.2, vel: 1, type: 'sawtooth' },
          { freq: 147, dur: 0.5, vel: 1.3, type: 'square' },
        ];
      default:
        return [
          { freq: 220, dur: 0.5, vel: 0.6 }, { freq: 277, dur: 0.3, vel: 0.6 },
          { freq: 330, dur: 0.5, vel: 0.6 }, { freq: 277, dur: 0.3, vel: 0.6 },
          { freq: 262, dur: 0.4, vel: 0.6 }, { freq: 220, dur: 0.5, vel: 0.7 },
        ];
    }
  }

  stopMusic() {
    if (this.musicTimeout) clearTimeout(this.musicTimeout);
    if (this.musicInterval) clearInterval(this.musicInterval);
    this.musicTimeout = null;
    this.musicInterval = null;
  }

  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.musicGain) this.musicGain.gain.value = v;
  }

  setSfxVolume(v) {
    this.sfxVolume = v;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }
}

export default AudioManager;
