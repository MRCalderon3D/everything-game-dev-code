// AudioManager.js — SFX + BGM, event-driven playback

class AudioManager {
    constructor(scene) {
        this._scene = scene;
        this._musicVolume = 0.7;
        this._sfxVolume = 1.0;
        this._bgm = null;

        EventBus.on(EVENTS.LANE_CHANGED, this._onDash, this);
        EventBus.on(EVENTS.COLLECTIBLE_PICKED_UP, this._onCollect, this);
        EventBus.on(EVENTS.GAME_OVER, this._onGameOver, this);
        EventBus.on(EVENTS.GAME_START, this._onGameStart, this);
        EventBus.on(EVENTS.GAME_RESTART, this._onGameRestart, this);
        EventBus.on(EVENTS.RETURN_TO_MENU, this._onReturnToMenu, this);
    }

    _onDash() {
        this._scene.sound.play('sfx-dash', { volume: this._sfxVolume });
    }

    _onCollect(type) {
        if (type === 'coin') {
            this._scene.sound.play('sfx-collect', { volume: this._sfxVolume });
        }
    }

    _onGameOver() {
        this._scene.sound.play('sfx-gameover', { volume: this._sfxVolume });
        if (this._bgm) this._bgm.setVolume(this._musicVolume * 0.4);
    }

    _onGameStart() {
        this._startMusic();
    }

    _onGameRestart() {
        this._startMusic();
    }

    _onReturnToMenu() {
        if (this._bgm) {
            this._bgm.stop();
            this._bgm = null;
        }
    }

    _startMusic() {
        if (this._bgm) this._bgm.stop();
        this._bgm = this._scene.sound.add('bgm', {
            loop: true,
            volume: this._musicVolume
        });
        this._bgm.play();
    }

    destroy() {
        EventBus.off(EVENTS.LANE_CHANGED, this._onDash, this);
        EventBus.off(EVENTS.COLLECTIBLE_PICKED_UP, this._onCollect, this);
        EventBus.off(EVENTS.GAME_OVER, this._onGameOver, this);
        EventBus.off(EVENTS.GAME_START, this._onGameStart, this);
        EventBus.off(EVENTS.GAME_RESTART, this._onGameRestart, this);
        EventBus.off(EVENTS.RETURN_TO_MENU, this._onReturnToMenu, this);
    }
}
