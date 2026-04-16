import SaveManager from './SaveManager.js';

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function generateBuffer(duration, sampleRate, generator) {
  const ctx = getAudioContext();
  const length = Math.floor(duration * sampleRate);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = generator(i, length, sampleRate);
  }
  return buffer;
}

function createCannonFire() {
  return generateBuffer(0.15, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.15);
    const freq = 150 - t * 500;
    return env * env * Math.sin(2 * Math.PI * freq * t) * 0.6 +
           env * (Math.random() * 2 - 1) * 0.3;
  });
}

function createEnemyHit() {
  return generateBuffer(0.1, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.1);
    return env * (Math.random() * 2 - 1) * 0.4 +
           env * Math.sin(2 * Math.PI * 300 * t) * 0.3;
  });
}

function createEnemyDestroy() {
  return generateBuffer(0.3, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.3);
    const freq = 200 - t * 400;
    return env * (Math.random() * 2 - 1) * 0.5 +
           env * Math.sin(2 * Math.PI * freq * t) * 0.2;
  });
}

function createPlayerHit() {
  return generateBuffer(0.25, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.25);
    return env * Math.sin(2 * Math.PI * 80 * t) * 0.7;
  });
}

function createPowerUpCollect() {
  return generateBuffer(0.3, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.3);
    const freq = 400 + t * 1200;
    return env * Math.sin(2 * Math.PI * freq * t) * 0.4;
  });
}

function createWaveComplete() {
  return generateBuffer(0.5, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.5);
    const f1 = 440, f2 = 554, f3 = 659;
    const phase = t < 0.15 ? f1 : t < 0.3 ? f2 : f3;
    return env * Math.sin(2 * Math.PI * phase * t) * 0.35;
  });
}

function createGameOver() {
  return generateBuffer(0.6, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.6);
    const freq = 300 - t * 250;
    return env * Math.sin(2 * Math.PI * freq * t) * 0.5;
  });
}

function createMenuSelect() {
  return generateBuffer(0.05, 44100, (i, len, sr) => {
    const t = i / sr;
    const env = Math.max(0, 1 - t / 0.05);
    return env * Math.sin(2 * Math.PI * 1000 * t) * 0.3;
  });
}

function createMusicLoop() {
  const bpm = 140;
  const beatDuration = 60 / bpm;
  const melody = [330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 440, 523, 440, 392, 330, 294];
  const totalDuration = melody.length * beatDuration;

  return generateBuffer(totalDuration, 44100, (i, len, sr) => {
    const t = i / sr;
    const beatIndex = Math.floor(t / beatDuration) % melody.length;
    const freq = melody[beatIndex];
    const beatT = (t % beatDuration) / beatDuration;
    const env = beatT < 0.1 ? beatT / 0.1 : Math.max(0, 1 - (beatT - 0.1) / 0.9);

    const wave = Math.sin(2 * Math.PI * freq * t) * 0.15 +
                 Math.sin(2 * Math.PI * freq * 2 * t) * 0.05;
    const bass = Math.sin(2 * Math.PI * (freq / 4) * t) * 0.1;
    return env * (wave + bass);
  });
}

const AudioManager = {
  buffers: {},
  currentMusic: null,
  sfxGain: null,
  musicGain: null,
  initialized: false,

  init() {
    if (this.initialized) return;
    const ctx = getAudioContext();

    this.sfxGain = ctx.createGain();
    this.sfxGain.connect(ctx.destination);

    this.musicGain = ctx.createGain();
    this.musicGain.connect(ctx.destination);

    const settings = SaveManager.getSettings();
    this.sfxGain.gain.value = settings.sfxVolume;
    this.musicGain.gain.value = settings.musicVolume;

    this.buffers = {
      cannonFire: createCannonFire(),
      enemyHit: createEnemyHit(),
      enemyDestroy: createEnemyDestroy(),
      playerHit: createPlayerHit(),
      powerupCollect: createPowerUpCollect(),
      waveComplete: createWaveComplete(),
      gameOver: createGameOver(),
      menuSelect: createMenuSelect(),
      music: createMusicLoop(),
    };

    this.initialized = true;
  },

  playSfx(name) {
    if (!this.buffers[name]) return;
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = this.buffers[name];
    source.connect(this.sfxGain);
    source.start();
  },

  playMusic() {
    this.stopMusic();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = this.buffers.music;
    source.loop = true;
    source.connect(this.musicGain);
    source.start();
    this.currentMusic = source;
  },

  stopMusic() {
    if (this.currentMusic) {
      try { this.currentMusic.stop(); } catch { /* already stopped */ }
      this.currentMusic = null;
    }
  },

  setSfxVolume(v) {
    if (this.sfxGain) this.sfxGain.gain.value = v;
    SaveManager.saveSettings({ sfxVolume: v });
  },

  setMusicVolume(v) {
    if (this.musicGain) this.musicGain.gain.value = v;
    SaveManager.saveSettings({ musicVolume: v });
  },

  getSfxVolume() {
    return this.sfxGain ? this.sfxGain.gain.value : 1.0;
  },

  getMusicVolume() {
    return this.musicGain ? this.musicGain.gain.value : 0.5;
  },
};

export default AudioManager;
