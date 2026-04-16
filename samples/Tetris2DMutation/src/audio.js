export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicNodes = [];
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.ctx.destination);
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.ctx.destination);
        this.initialized = true;
    }

    ensureResumed() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMusicVolume(v) {
        this.musicVolume = v;
        if (this.musicGain) this.musicGain.gain.value = v;
    }

    setSFXVolume(v) {
        this.sfxVolume = v;
        if (this.sfxGain) this.sfxGain.gain.value = v;
    }

    // --- SFX Methods ---

    _playTone(freq, duration, type = 'square', ramp = true) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.3;
        if (ramp) {
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        }
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    _playNoise(duration, filterFreq = 1000) {
        if (!this.ctx) return;
        const bufferSize = Math.floor(this.ctx.sampleRate * duration);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        source.start();
    }

    playSFX(name) {
        if (!this.ctx) return;
        this.ensureResumed();
        const t = this.ctx.currentTime;

        switch (name) {
            case 'move':
                this._playTone(200, 0.05, 'square');
                break;

            case 'rotate':
                this._playTone(300, 0.08, 'triangle');
                this._playTone(400, 0.06, 'triangle');
                break;

            case 'land': {
                this._playNoise(0.1, 400);
                this._playTone(80, 0.1, 'sine');
                break;
            }

            case 'lineClear': {
                const freqs = [523, 659, 784];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.2, t + i * 0.07);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.2);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.07);
                    osc.stop(t + i * 0.07 + 0.2);
                });
                break;
            }

            case 'multiClear': {
                const freqs = [523, 659, 784, 1047];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.25, t + i * 0.06);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.3);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.06);
                    osc.stop(t + i * 0.06 + 0.3);
                });
                break;
            }

            case 'tetris': {
                const freqs = [523, 659, 784, 1047, 1318];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.3, t + i * 0.08);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.4);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.08);
                    osc.stop(t + i * 0.08 + 0.4);
                });
                break;
            }

            case 'mutationWarning': {
                // Rising wobble alarm
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.linearRampToValueAtTime(600, t + 0.4);
                // LFO for wobble
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.value = 15;
                lfoGain.gain.value = 100;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                g.gain.setValueAtTime(0.2, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
                osc.connect(g);
                g.connect(this.sfxGain);
                osc.start(t);
                osc.stop(t + 0.45);
                lfo.start(t);
                lfo.stop(t + 0.45);
                break;
            }

            case 'mutationTransform': {
                // Glitchy morph
                for (let i = 0; i < 5; i++) {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.value = 100 + Math.random() * 800;
                    g.gain.setValueAtTime(0.15, t + i * 0.04);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.08);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.04);
                    osc.stop(t + i * 0.04 + 0.08);
                }
                this._playNoise(0.15, 2000);
                break;
            }

            case 'basketStore':
                this._playTone(400, 0.1, 'sine');
                this._playTone(300, 0.15, 'sine');
                break;

            case 'basketSwap':
                this._playTone(300, 0.1, 'sine');
                this._playTone(500, 0.1, 'sine');
                break;

            case 'basketFull':
                this._playTone(150, 0.15, 'square');
                this._playTone(100, 0.2, 'square');
                break;

            case 'gameOver': {
                const freqs = [400, 350, 300, 200, 150];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.25, t + i * 0.15);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.3);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.15);
                    osc.stop(t + i * 0.15 + 0.3);
                });
                this._playNoise(0.8, 500);
                break;
            }

            case 'menuSelect':
                this._playTone(600, 0.06, 'square');
                break;

            case 'levelUp': {
                const freqs = [523, 659, 784, 1047];
                freqs.forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0.2, t + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.3);
                    osc.connect(g);
                    g.connect(this.sfxGain);
                    osc.start(t + i * 0.1);
                    osc.stop(t + i * 0.1 + 0.3);
                });
                break;
            }

            case 'hardDrop':
                this._playNoise(0.12, 300);
                this._playTone(60, 0.15, 'sine');
                break;
        }
    }

    // --- Music ---

    playMusic(tempo = 140) {
        if (!this.ctx) return;
        this.stopMusic();
        this.ensureResumed();

        // Simple procedural chiptune loop
        const bpm = tempo;
        const beatLen = 60 / bpm;
        const barLen = beatLen * 4;
        const loopLen = barLen * 4; // 4 bars

        // Bass line notes (MIDI-ish)
        const bassPattern = [
            261, 261, 329, 329, 293, 293, 349, 349,
            261, 261, 329, 329, 392, 392, 349, 349,
        ];

        // Melody notes
        const melodyPattern = [
            523, 0, 659, 0, 784, 0, 659, 0,
            698, 0, 587, 0, 523, 0, 494, 0,
        ];

        const scheduleLoop = () => {
            if (!this.ctx) return;
            const startTime = this.ctx.currentTime + 0.05;

            // Bass
            bassPattern.forEach((freq, i) => {
                if (freq === 0) return;
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq / 2;
                const noteStart = startTime + i * beatLen;
                g.gain.setValueAtTime(0.12, noteStart);
                g.gain.exponentialRampToValueAtTime(0.001, noteStart + beatLen * 0.9);
                osc.connect(g);
                g.connect(this.musicGain);
                osc.start(noteStart);
                osc.stop(noteStart + beatLen);
                this.musicNodes.push(osc);
            });

            // Melody
            melodyPattern.forEach((freq, i) => {
                if (freq === 0) return;
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                const noteStart = startTime + i * beatLen;
                g.gain.setValueAtTime(0.08, noteStart);
                g.gain.exponentialRampToValueAtTime(0.001, noteStart + beatLen * 0.8);
                osc.connect(g);
                g.connect(this.musicGain);
                osc.start(noteStart);
                osc.stop(noteStart + beatLen);
                this.musicNodes.push(osc);
            });

            this.musicTimer = setTimeout(() => scheduleLoop(), loopLen * 1000 - 100);
        };

        scheduleLoop();
    }

    stopMusic() {
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
        for (const node of this.musicNodes) {
            try { node.stop(); } catch (e) { /* already stopped */ }
        }
        this.musicNodes = [];
    }
}
