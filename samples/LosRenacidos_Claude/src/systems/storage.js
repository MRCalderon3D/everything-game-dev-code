import { STORAGE_KEY } from '../constants.js';

const DEFAULT_SAVE = {
  ecos: {
    minocAmigo: false,
    jabaliAlfaSlain: false,
    escoltaCompleta: false,
    hierbasTotales: 0,
    bestRun: 0,
  },
  unlocks: {
    filoAfilado: false,
    esgrimaBase: 0,
    paradaBase: 0,
    saludExtra: 0,
  },
  inventory: {
    cobre: 15,
    pociones: 0,
  },
  fama: 0,
  runs: 0,
  bossKills: 0,
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

export class Storage {
  constructor() {
    this.available = true;
    try {
      localStorage.setItem('__rt_test__', '1');
      localStorage.removeItem('__rt_test__');
    } catch (e) {
      this.available = false;
    }
    this.cache = null;
  }

  load() {
    if (this.cache) return this.cache;
    if (!this.available) {
      this.cache = clone(DEFAULT_SAVE);
      return this.cache;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.cache = clone(DEFAULT_SAVE);
        return this.cache;
      }
      const parsed = JSON.parse(raw);
      this.cache = Object.assign(clone(DEFAULT_SAVE), parsed);
      this.cache.ecos = Object.assign(clone(DEFAULT_SAVE.ecos), parsed.ecos || {});
      this.cache.unlocks = Object.assign(clone(DEFAULT_SAVE.unlocks), parsed.unlocks || {});
      this.cache.inventory = Object.assign(clone(DEFAULT_SAVE.inventory), parsed.inventory || {});
      return this.cache;
    } catch (e) {
      this.cache = clone(DEFAULT_SAVE);
      return this.cache;
    }
  }

  save() {
    if (!this.available || !this.cache) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (e) { /* swallow */ }
  }

  reset() {
    this.cache = clone(DEFAULT_SAVE);
    this.save();
  }
}
