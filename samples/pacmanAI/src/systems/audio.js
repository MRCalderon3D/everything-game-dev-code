export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.ctx.destination);
            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not available');
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, duration, type = 'square', volume = 0.15, dest = null) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(dest || this.sfxGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    }

    playNoise(duration, volume = 0.1) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(this.sfxGain);
        source.start(this.ctx.currentTime);
    }

    sfxDot() {
        this.playTone(600, 0.05, 'square', 0.08);
    }

    sfxDotAlt() {
        this.playTone(800, 0.05, 'square', 0.08);
    }

    sfxPowerPellet() {
        this.playTone(100, 0.5, 'sine', 0.2);
        setTimeout(() => {
            if (this.ctx) {
                this.playTone(150, 0.3, 'sine', 0.15);
                this.playTone(200, 0.3, 'sawtooth', 0.1);
            }
        }, 100);
    }

    sfxEatGhost() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [200, 400, 800, 1600].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.1);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.12);
        });
    }

    sfxDeath() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 1.2);
    }

    sfxLevelComplete() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.2);
        });
    }

    sfxExtraLife() {
        this.playTone(880, 0.15, 'sine', 0.12);
        setTimeout(() => this.playTone(1320, 0.15, 'sine', 0.12), 150);
    }

    sfxMenuSelect() {
        this.playTone(440, 0.08, 'square', 0.06);
    }

    sfxGhostWarning() {
        this.playTone(1200, 0.06, 'square', 0.04);
    }

    startMusic(type) {
        this.stopMusic();
        if (!this.ctx) return;
        if (type === 'gameplay') {
            this.playGameplayMusic();
        }
    }

    playGameplayMusic() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 180;
        gain.gain.value = 0.04;
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 3;
        lfoGain.gain.value = 20;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        this.currentMusic = { osc, lfo, gain, lfoGain };
    }

    startFrightenedMusic() {
        this.stopMusic();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = 300;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'square';
        lfo.frequency.value = 8;
        lfoGain.gain.value = 40;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        this.currentMusic = { osc, lfo, gain, lfoGain };
    }

    stopMusic() {
        if (this.currentMusic) {
            try {
                this.currentMusic.osc.stop();
                this.currentMusic.lfo.stop();
            } catch (e) { /* already stopped */ }
            this.currentMusic = null;
        }
    }

    setMusicVolume(v) {
        this.musicVolume = v;
        if (this.musicGain) {
            this.musicGain.gain.value = v;
        }
    }

    setSfxVolume(v) {
        this.sfxVolume = v;
        if (this.sfxGain) {
            this.sfxGain.gain.value = v;
        }
    }

    setFrightenedMusicSpeed(fast) {
        if (this.currentMusic && this.currentMusic.lfo) {
            this.currentMusic.lfo.frequency.value = fast ? 14 : 8;
        }
    }
}
