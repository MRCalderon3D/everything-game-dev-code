// Minimal event emitter decoupling the simulation from UI, audio, and render fx.
export class Emitter {
  constructor() {
    this.listeners = new Map();
  }

  on(name, fn) {
    let list = this.listeners.get(name);
    if (!list) {
      list = [];
      this.listeners.set(name, list);
    }
    list.push(fn);
    return () => {
      const i = list.indexOf(fn);
      if (i >= 0) list.splice(i, 1);
    };
  }

  emit(name, payload) {
    const list = this.listeners.get(name);
    if (!list) return;
    for (let i = 0; i < list.length; i++) list[i](payload);
  }
}
