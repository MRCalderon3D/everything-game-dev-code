// Procedural WebAudio with an optional generated-file layer. Context is created
// on the first user gesture; all sources route through sfx/music buses into a
// master gain. Generated SFX/music files (fal.ai) decode into buffers on unlock
// and override the procedural cue; until (or unless) a file decodes, the
// synthesized fallback plays — so the game is never silent.
import { loadMuted, saveMuted } from '../save/storage.js';

const SHOT_MIN_GAP = 0.04;

const SFX_FILES = {
  shot: './assets/audio/sfx-shot.mp3',
  beam: './assets/audio/sfx-beam.mp3',
  hit: './assets/audio/sfx-hit.mp3',
  explosion: './assets/audio/sfx-explosion.mp3',
  powerup: './assets/audio/sfx-powerup.mp3',
  force: './assets/audio/sfx-force.mp3',
  warning: './assets/audio/sfx-warning.mp3',
  death: './assets/audio/sfx-death.mp3',
  win: './assets/audio/sfx-win.mp3',
  lose: './assets/audio/sfx-lose.mp3',
};
const MUSIC_FILE = './assets/audio/music-battle.wav';
const SFX_GAIN = {
  shot: 0.22, beam: 0.6, hit: 0.3, explosion: 0.6, powerup: 0.7,
  force: 0.5, warning: 0.8, death: 0.8, win: 0.8, lose: 0.8,
};

export function createAudio() {
  let ctx = null;
  let master = null;
  let sfxBus = null;
  let musicBus = null;
  let muted = loadMuted();
  let lastShotAt = 0;
  let noiseBuffer = null;
  const buffers = {};
  let musicBuffer = null;
  let musicSource = null;
  let musicWanted = false;
  let musicTimer = 0;
  let nextNoteTime = 0;
  let noteIndex = 0;

  function fetchBuffers() {
    const load = (url, onDecoded) => {
      fetch(url)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(res.status)))
        .then((data) => ctx.decodeAudioData(data))
        .then(onDecoded)
        .catch(() => {});
    };
    for (const [name, url] of Object.entries(SFX_FILES)) {
      load(url, (buf) => { buffers[name] = buf; });
    }
    load(MUSIC_FILE, (buf) => { musicBuffer = buf; if (musicWanted) startMusic(); });
  }

  function playBuffer(name) {
    const buf = buffers[name];
    if (!ctx || !buf) return false;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const env = ctx.createGain();
    env.gain.value = SFX_GAIN[name] || 0.5;
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
      sfxBus.gain.value = 0.6;
      sfxBus.connect(master);
      musicBus = ctx.createGain();
      musicBus.gain.value = 0.18;
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

  function noise({ dur, gain = 0.3, when = 0, filterFreq = 1400 }) {
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

  // ---- generative battle music: driving minor arpeggio over a pulsing bass ----
  const ARP = [196, 233.08, 293.66, 349.23, 392, 466.16];
  const BASS = [49, 49, 65.41, 58.27]; // G1 G1 C2 Bb1
  const STEP = 60 / 132 / 2; // eighth notes at 132 BPM

  function scheduleMusic() {
    if (!ctx) return;
    while (nextNoteTime < ctx.currentTime + 0.15) {
      const beat = noteIndex % 8;
      if (beat % 2 === 0) {
        tone({
          freq: BASS[Math.floor(noteIndex / 4) % BASS.length],
          dur: STEP * 1.8, type: 'sawtooth', gain: 0.32, bus: musicBus,
          when: nextNoteTime - ctx.currentTime,
        });
      }
      const note = ARP[(noteIndex * 3) % ARP.length];
      tone({
        freq: note * (beat >= 4 ? 2 : 1),
        dur: STEP * 1.4, type: 'square', gain: 0.12, bus: musicBus,
        when: nextNoteTime - ctx.currentTime,
      });
      nextNoteTime += STEP;
      noteIndex += 1;
    }
  }

  function stopProceduralMusic() {
    clearInterval(musicTimer);
    musicTimer = 0;
  }

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

  return {
    unlock,
    startMusic,
    stopMusic,
    isMuted() { return muted; },
    setMuted(value) {
      muted = value;
      saveMuted(muted);
      if (master) master.gain.value = muted ? 0 : 1;
    },
    sfx: {
      shot() {
        if (!ctx || ctx.currentTime - lastShotAt < SHOT_MIN_GAP) return;
        lastShotAt = ctx.currentTime;
        if (playBuffer('shot')) return;
        tone({ freq: 880, endFreq: 480, dur: 0.07, type: 'square', gain: 0.18 });
      },
      beam() {
        if (playBuffer('beam')) return;
        tone({ freq: 180, endFreq: 1200, dur: 0.35, type: 'sawtooth', gain: 0.3 });
        noise({ dur: 0.3, gain: 0.2, filterFreq: 2600 });
      },
      hit() {
        if (playBuffer('hit')) return;
        tone({ freq: 320, endFreq: 180, dur: 0.05, type: 'square', gain: 0.16 });
      },
      explosion() {
        if (playBuffer('explosion')) return;
        noise({ dur: 0.35, gain: 0.45, filterFreq: 900 });
        tone({ freq: 140, endFreq: 50, dur: 0.3, type: 'sawtooth', gain: 0.25 });
      },
      powerup() {
        if (playBuffer('powerup')) return;
        tone({ freq: 523, dur: 0.1, type: 'square', gain: 0.3 });
        tone({ freq: 784, dur: 0.12, type: 'square', gain: 0.3, when: 0.09 });
        tone({ freq: 1047, dur: 0.16, type: 'square', gain: 0.3, when: 0.18 });
      },
      force() {
        if (playBuffer('force')) return;
        tone({ freq: 300, endFreq: 700, dur: 0.16, type: 'triangle', gain: 0.4 });
      },
      warning() {
        if (playBuffer('warning')) return;
        for (let i = 0; i < 3; i++) {
          tone({ freq: 660, dur: 0.18, type: 'square', gain: 0.4, when: i * 0.3 });
        }
      },
      death() {
        if (playBuffer('death')) return;
        tone({ freq: 200, endFreq: 50, dur: 0.7, type: 'sawtooth', gain: 0.5 });
        noise({ dur: 0.5, gain: 0.35, filterFreq: 800 });
      },
      win() {
        if (playBuffer('win')) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => tone({ freq: f, dur: 0.22, type: 'square', gain: 0.3, when: i * 0.16 }));
      },
      lose() {
        if (playBuffer('lose')) return;
        tone({ freq: 400, endFreq: 80, dur: 1.0, type: 'sawtooth', gain: 0.45 });
      },
    },
  };
}
