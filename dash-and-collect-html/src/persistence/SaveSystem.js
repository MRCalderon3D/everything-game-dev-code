// SaveSystem.js — localStorage wrapper (replaces Unity PlayerPrefs)

const SaveSystem = {
    _prefix: 'DashAndCollect.',

    saveHighScore(score) {
        localStorage.setItem(this._prefix + 'HighScore', score.toString());
    },

    loadHighScore() {
        return parseInt(localStorage.getItem(this._prefix + 'HighScore')) || 0;
    },

    isOnboardingComplete() {
        return localStorage.getItem(this._prefix + 'OnboardingComplete') === '1';
    },

    completeOnboarding() {
        localStorage.setItem(this._prefix + 'OnboardingComplete', '1');
    },

    clearAll() {
        localStorage.removeItem(this._prefix + 'HighScore');
        localStorage.removeItem(this._prefix + 'OnboardingComplete');
    }
};
