const STORAGE_KEY = 'tetris2dmutation';

const DEFAULT_DATA = {
    highScores: [],
    settings: {
        musicVolume: 0.7,
        sfxVolume: 0.8,
    },
};

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (e) {
        // corrupted data, reset
    }
    return structuredClone(DEFAULT_DATA);
}

function save(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        // storage full or unavailable
    }
}

export const Storage = {
    getSettings() {
        return load().settings;
    },

    saveSettings(settings) {
        const data = load();
        data.settings = settings;
        save(data);
    },

    getHighScores() {
        return load().highScores;
    },

    addHighScore(entry) {
        const data = load();
        data.highScores.push(entry);
        data.highScores.sort((a, b) => b.score - a.score);
        data.highScores = data.highScores.slice(0, 10);
        save(data);
        return data.highScores;
    },

    isHighScore(score) {
        const scores = load().highScores;
        return scores.length < 10 || score > scores[scores.length - 1].score;
    },
};
