const STORAGE_KEY = 'pirate-invaders-save';

const DEFAULT_DATA = {
  highScore: 0,
  settings: {
    sfxVolume: 1.0,
    musicVolume: 0.5,
  },
};

const SaveManager = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA };
      return JSON.parse(raw);
    } catch {
      return { ...DEFAULT_DATA };
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable — silently ignore
    }
  },

  getSettings() {
    return this.load().settings || DEFAULT_DATA.settings;
  },

  saveSettings(settings) {
    const data = this.load();
    data.settings = { ...data.settings, ...settings };
    this.save(data);
  },
};

export default SaveManager;
