class SceneManager {
  constructor() {
    this.currentScene = null;
    this.nextScene = null;
  }

  setScene(scene) {
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }
    this.currentScene = scene;
    if (this.currentScene && this.currentScene.init) {
      this.currentScene.init();
    }
  }

  update(dt) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }
  }

  render(ctx) {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(ctx);
    }
  }
}

export default SceneManager;
