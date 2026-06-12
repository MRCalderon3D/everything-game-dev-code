// AssetsGen variant: generated SFX/music files (fal.ai — ElevenLabs sound
// effects, CassetteAI music; see the .provenance.json sidecar next to each
// file) are decoded into WebAudio buffers on unlock. The original procedural
// synthesis remains the fallback for every cue until (or unless) its file
// decodes, so the game is never silent. All sources route through the same
// sfx/music buses into the master gain.
import { loadMuted, saveMuted } from '../save/storage.js';

const SHOT_MIN_GAP = 0.05; // throttle: laser spam must not stack/clip

const SFX_FILES = {
  build: './assets/audio/sfx-build.mp3',
  upgrade: './assets/audio/sfx-upgrade.mp3',
  shotCannon: './assets/audio/sfx-shot-cannon.mp3',
  shotLaser: './assets/audio/sfx-shot-laser.mp3',
  frost: './assets/audio/sfx-frost.mp3',
  death: './assets/audio/sfx-death.mp3',
  leak: './assets/audio/sfx-leak.mp3',
  horn: './assets/audio/sfx-horn.mp3',
  win: './assets/audio/sfx-win.mp3',
  lose: './assets/audio/sfx-lose.mp3',
};
const MUSIC_FILE = './assets/audio/music-battle.wav';
const SFX_GAIN = {
  build: 0.9,
  upgrade: 0.7,
  shotCannon: 0.45,
  shotLaser: 0.35,
  frost: 0.6,
  death: 0.5,
  leak: 0.9,
  horn: 0.8,
  win: 0.9,
  lose: 0.9,
};

export function createAudio() {
  let ctx = null;
  let master = null;
  let sfxBus = null;
  let musicBus = null;
  let muted = loadMuted();
  let lastShotAt = 0;
  let musicTimer = 0;
  let nextNoteTime = 0;
  let noteIndex = 0;
  let noiseBuffer = null;
  const buffers = {}; // cue name -> AudioBuffer once decoded
  let musicBuffer = null;
  let musicSource = null;
  let musicWanted = false;

  function fetchBuffers() {
    const load = (url, onDecoded) => {
      fetch(url)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(res.status)))
        .then((data) => ctx.decodeAudioData(data))
        .then(onDecoded)
        .catch(() => {}); // procedural fallback keeps covering this cue
    };
    for (const [name, url] of Object.entries(SFX_FILES)) {
      load(url, (buffer) => {
        buffers[name] = buffer;
      });
    }
    load(MUSIC_FILE, (buffer) => {
      musicBuffer = buffer;
      if (musicWanted) startMusic();
    });
  }

  function playBuffer(name) {
    const buffer = buffers[name];
    if (!ctx || !buffer) return false;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const env = ctx.createGain();
    env.gain.value = SFX_GAIN[name] || 0.7;
    src.connect(env);
    env.connect(sfxBus);
    src.start();
    return true;
  }

  function unlock() {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      ctx = new Ctx();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
      sfxBus = ctx.createGain();
      sfxBus.gain.value = 0.5;
      sfxBus.connect(master);
      musicBus = ctx.createGain();
      musicBus.gain.value = 0.16;
      musicBus.connect(master);
      noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      fetchBuffers();
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  function tone({ freq, endFreq, dur, type = 'sine', gain = 0.5, bus, when = 0 }) {
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t0 + dur);
    env.gain.setValueAtTime(gain, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(env);
    env.connect(bus || sfxBus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise({ dur, gain = 0.3, when = 0, filterFreq = 1200 }) {
    if (!ctx) return;
    const t0 = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filter);
    filter.connect(env);
    env.connect(sfxBus);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  // ---------- generative music: pentatonic arpeggio over a two-note bass ----------

  const PENTA = [220, 261.63, 293.66, 329.63, 392, 440, 523.25];
  const BASS = [55, 73.42]; // A1, D2 — two alternating roots
  const STEP = 60 / 100 / 2; // eighth notes at 100 BPM

  function scheduleMusic() {
    if (!ctx) return;
    while (nextNoteTime < ctx.currentTime + 0.15) {
      const bar = Math.floor(noteIndex / 8);
      if (noteIndex % 4 === 0) {
        tone({
          freq: BASS[bar % 2],
          dur: STEP * 3.2,
          type: 'triangle',
          gain: 0.5,
          bus: musicBus,
          when: nextNoteTime - ctx.currentTime,
        });
      }
      if (noteIndex % 2 === 0 || Math.random() < 0.35) {
        const note = PENTA[Math.floor(Math.random() * PENTA.length)];
        tone({
          freq: note,
          dur: STEP * 1.8,
          type: 'sine',
          gain: 0.3,
          bus: musicBus,
          when: nextNoteTime - ctx.currentTime,
        });
      }
      nextNoteTime += STEP;
      noteIndex += 1;
    }
  }

  function stopProceduralMusic() {
    clearInterval(musicTimer);
    musicTimer = 0;
  }

  // Generated loop when decoded; procedural arpeggio until then (the decode
  // callback re-enters startMusic and swaps procedural for the file loop).
  function startMusic() {
    musicWanted = true;
    if (!ctx) return;
    if (musicBuffer) {
      if (musicSource) return;
      stopProceduralMusic();
      musicSource = ctx.createBufferSource();
      musicSource.buffer = musicBuffer;
      musicSource.loop = true;
      musicSource.connect(musicBus);
      musicSource.start();
      return;
    }
    if (musicTimer) return;
    nextNoteTime = ctx.currentTime + 0.1;
    noteIndex = 0;
    musicTimer = setInterval(scheduleMusic, 100);
  }

  function stopMusic() {
    musicWanted = false;
    stopProceduralMusic();
    if (musicSource) {
      musicSource.stop();
      musicSource.disconnect();
      musicSource = null;
    }
  }

  // ---------- public API ----------

  return {
    unlock,
    startMusic,
    stopMusic,

    isMuted() {
      return muted;
    },
    setMuted(value) {
      muted = value;
      saveMuted(muted);
      if (master) master.gain.value = muted ? 0 : 1;
    },

    sfx: {
      build() {
        if (playBuffer('build')) return;
        tone({ freq: 220, endFreq: 70, dur: 0.18, type: 'sine', gain: 0.7 }); // thunk
      },
      upgrade() {
        if (playBuffer('upgrade')) return;
        tone({ freq: 440, endFreq: 880, dur: 0.16, type: 'square', gain: 0.3 });
      },
      sell() {
        // kept procedural: a short UI blip reads better than a generated cue
        tone({ freq: 660, endFreq: 520, dur: 0.12, type: 'square', gain: 0.3 });
      },
      deny() {
        tone({ freq: 160, dur: 0.12, type: 'square', gain: 0.3 });
      },
      shot(kind) {
        if (!ctx || ctx.currentTime - lastShotAt < SHOT_MIN_GAP) return;
        lastShotAt = ctx.currentTime;
        if (playBuffer(kind === 'laser' ? 'shotLaser' : 'shotCannon')) return;
        if (kind === 'laser') {
          tone({ freq: 1400, endFreq: 900, dur: 0.05, type: 'sawtooth', gain: 0.16 });
        } else {
          tone({ freq: 320, endFreq: 140, dur: 0.1, type: 'square', gain: 0.3 });
        }
      },
      frost() {
        if (playBuffer('frost')) return;
        noise({ dur: 0.3, gain: 0.25, filterFreq: 900 }); // soft whoosh
      },
      death() {
        if (playBuffer('death')) return;
        tone({ freq: 600, endFreq: 1200, dur: 0.12, type: 'sine', gain: 0.35 }); // chirp
      },
      leak() {
        if (playBuffer('leak')) return;
        tone({ freq: 300, endFreq: 120, dur: 0.3, type: 'sawtooth', gain: 0.4 });
      },
      horn() {
        if (playBuffer('horn')) return;
        // wave horn: short sawtooth chord
        tone({ freq: 196, dur: 0.5, type: 'sawtooth', gain: 0.3 });
        tone({ freq: 294, dur: 0.5, type: 'sawtooth', gain: 0.25, when: 0.02 });
        tone({ freq: 392, dur: 0.6, type: 'sawtooth', gain: 0.2, when: 0.04 });
      },
      win() {
        if (playBuffer('win')) return;
        tone({ freq: 523, dur: 0.18, type: 'square', gain: 0.3 });
        tone({ freq: 659, dur: 0.18, type: 'square', gain: 0.3, when: 0.15 });
        tone({ freq: 784, dur: 0.3, type: 'square', gain: 0.3, when: 0.3 });
        tone({ freq: 1047, dur: 0.5, type: 'square', gain: 0.3, when: 0.45 });
      },
      lose() {
        if (playBuffer('lose')) return;
        tone({ freq: 180, endFreq: 60, dur: 1.0, type: 'sawtooth', gain: 0.5 }); // low buzz
      },
    },
  };
}
