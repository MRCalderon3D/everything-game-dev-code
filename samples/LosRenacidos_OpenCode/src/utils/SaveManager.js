class SaveManager {
  static save(key, data) {
    try {
      localStorage.setItem('losrenacidos_' + key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }

  static load(key) {
    try {
      const data = localStorage.getItem('losrenacidos_' + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static delete(key) {
    localStorage.removeItem('losrenacidos_' + key);
  }
}

export default SaveManager;
