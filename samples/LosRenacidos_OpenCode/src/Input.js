class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.keysPressed = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mouseClicked = false;
    this.mouseRight = false;

    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.key]) this.keysPressed[e.key] = true;
      this.keys[e.key] = true;
      e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      e.preventDefault();
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouseX = (e.clientX - rect.left) * scaleX;
      this.mouseY = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { this.mouseDown = true; this.mouseClicked = true; }
      if (e.button === 2) this.mouseRight = true;
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.mouseRight = false;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(key) { return this.keys[key] === true; }

  isKeyPressed(key) {
    if (this.keysPressed[key]) { this.keysPressed[key] = false; return true; }
    return false;
  }

  getMovement() {
    let x = 0, y = 0;
    if (this.isKeyDown('w') || this.isKeyDown('ArrowUp')) y = -1;
    if (this.isKeyDown('s') || this.isKeyDown('ArrowDown')) y = 1;
    if (this.isKeyDown('a') || this.isKeyDown('ArrowLeft')) x = -1;
    if (this.isKeyDown('d') || this.isKeyDown('ArrowRight')) x = 1;
    if (x !== 0 && y !== 0) { x *= 0.707; y *= 0.707; }
    return { x, y };
  }

  getMousePos() { return { x: this.mouseX, y: this.mouseY }; }

  isMouseDown() { return this.mouseDown; }

  wasMouseClicked() {
    if (this.mouseClicked) { this.mouseClicked = false; return true; }
    return false;
  }

  isShiftDown() { return this.isKeyDown('Shift'); }

  isCtrlDown() { return this.isKeyDown('Control'); }

  lateUpdate() {
    this.mouseClicked = false;
    for (const k in this.keysPressed) { this.keysPressed[k] = false; }
  }
}

export default Input;
