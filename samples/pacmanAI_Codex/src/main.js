(function () {
  "use strict";

  const TILE = 24;
  const HUD = 72;
  const COLS = 23;
  const ROWS = 21;
  const WIDTH = COLS * TILE;
  const HEIGHT = ROWS * TILE + HUD;

  const RAW_MAZE = [
    "#######################",
    "#..........#..........#",
    "#.###.####.#.####.###.#",
    "#o#.....#.....#.....#o#",
    "#.#.###.#.###.#.###.#.#",
    "#.....................#",
    "###.#.#####.#####.#.###",
    "#...#...#.....#...#...#",
    "#.#####.#.###.#.#####.#",
    "#.......#.#G#.#.......#",
    "#####.###.#D#.###.#####",
    "#.......#.#G#.#.......#",
    "#.#####.#.###.#.#####.#",
    "#...#...#.....#...#...#",
    "###.#.#####.#####.#.###",
    "#.....................#",
    "#.#.###.#.###.#.###.#.#",
    "#o#.....#.....#.....#o#",
    "#.###.####.#.####.###.#",
    "#..........#..........#",
    "#######################"
  ];

  const DIRS = {
    left: { x: -1, y: 0, angle: Math.PI },
    right: { x: 1, y: 0, angle: 0 },
    up: { x: 0, y: -1, angle: -Math.PI / 2 },
    down: { x: 0, y: 1, angle: Math.PI / 2 },
    none: { x: 0, y: 0, angle: 0 }
  };

  const GHOSTS = [
    { name: "Blinky", color: "#f34949", start: { x: 11, y: 9 }, scatter: { x: 21, y: 1 } },
    { name: "Pinky", color: "#ff8edb", start: { x: 11, y: 11 }, scatter: { x: 1, y: 1 } },
    { name: "Inky", color: "#57d8ff", start: { x: 9, y: 10 }, scatter: { x: 21, y: 19 } },
    { name: "Clyde", color: "#ffad42", start: { x: 13, y: 10 }, scatter: { x: 1, y: 19 } }
  ];

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  class AudioSystem {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.volume = Number(localStorage.getItem("nmc_volume") || "0.55");
      this.muted = localStorage.getItem("nmc_muted") === "true";
      this.tickFlip = false;
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }

    resume() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    setVolume(delta) {
      this.volume = Math.max(0, Math.min(1, this.volume + delta));
      localStorage.setItem("nmc_volume", String(this.volume));
      if (!this.muted && this.master) this.master.gain.value = this.volume;
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem("nmc_muted", String(this.muted));
      if (this.master) this.master.gain.value = this.muted ? 0 : this.volume;
    }

    tone(freq, duration, type, gain, slide) {
      this.resume();
      if (!this.ctx || !this.master) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type || "square";
      osc.frequency.setValueAtTime(freq, now);
      if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slide), now + duration);
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(gain || 0.08, now + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(amp);
      amp.connect(this.master);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    pellet() {
      this.tickFlip = !this.tickFlip;
      this.tone(this.tickFlip ? 620 : 760, 0.045, "square", 0.035);
    }

    power() {
      this.tone(170, 0.32, "sawtooth", 0.08, 520);
      setTimeout(() => this.tone(840, 0.12, "triangle", 0.05), 120);
    }

    ghost() {
      [420, 620, 860, 1180].forEach((freq, i) => setTimeout(() => this.tone(freq, 0.08, "triangle", 0.055), i * 55));
    }

    death() {
      this.tone(520, 0.72, "sawtooth", 0.09, 70);
    }

    level() {
      [330, 440, 550, 660, 880].forEach((freq, i) => setTimeout(() => this.tone(freq, 0.09, "square", 0.05), i * 70));
    }
  }

  class Maze {
    constructor() {
      this.reset();
    }

    reset() {
      this.grid = RAW_MAZE.map((row) => row.split(""));
      this.pellets = 0;
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLS; x += 1) {
          if (this.grid[y][x] === "." || this.grid[y][x] === "o") this.pellets += 1;
          if (this.grid[y][x] === "G") this.grid[y][x] = " ";
        }
      }
    }

    tile(x, y) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return "#";
      return this.grid[y][x];
    }

    isOpen(x, y, actor) {
      if (x < 0 || x >= COLS) return y === 10;
      const cell = this.tile(x, y);
      if (cell === "#") return false;
      if (cell === "D" && actor === "player") return false;
      return true;
    }

    eat(x, y) {
      const cell = this.tile(x, y);
      if (cell !== "." && cell !== "o") return null;
      this.grid[y][x] = " ";
      this.pellets -= 1;
      return cell;
    }
  }

  class Actor {
    constructor(x, y, speed) {
      this.x = x;
      this.y = y;
      this.dir = DIRS.left;
      this.nextDir = DIRS.left;
      this.speed = speed;
    }

    centered() {
      return Math.abs(this.x - Math.round(this.x)) < 0.18 && Math.abs(this.y - Math.round(this.y)) < 0.18;
    }

    snap() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
    }

    canMove(maze, dir, actor) {
      const nx = Math.round(this.x) + dir.x;
      const ny = Math.round(this.y) + dir.y;
      return maze.isOpen(nx, ny, actor);
    }

    move(dt) {
      this.x += this.dir.x * this.speed * dt;
      this.y += this.dir.y * this.speed * dt;
      if (this.x < -0.6) this.x = COLS - 0.4;
      if (this.x > COLS - 0.4) this.x = -0.6;
    }
  }

  class Player extends Actor {
    constructor() {
      super(11, 15, 6.35);
      this.mouth = 0;
    }

    reset() {
      this.x = 11;
      this.y = 15;
      this.dir = DIRS.left;
      this.nextDir = DIRS.left;
      this.mouth = 0;
    }

    update(dt, maze, level) {
      this.speed = 6.35 + Math.min(1.3, level * 0.12);
      if (this.centered()) {
        this.snap();
        if (this.canMove(maze, this.nextDir, "player")) this.dir = this.nextDir;
        if (!this.canMove(maze, this.dir, "player")) this.dir = DIRS.none;
      }
      this.move(dt);
      this.mouth += dt * 12;
    }
  }

  class Ghost extends Actor {
    constructor(config, index) {
      super(config.start.x, config.start.y, 5);
      this.config = config;
      this.index = index;
      this.color = config.color;
      this.spawnDelay = 0.8 + index * 1.4;
      this.mode = "scatter";
      this.deadTimer = 0;
      this.dir = DIRS.up;
    }

    reset(level) {
      this.x = this.config.start.x;
      this.y = this.config.start.y;
      this.dir = this.index % 2 ? DIRS.down : DIRS.up;
      this.spawnDelay = Math.max(0.2, 0.8 + this.index * 1.25 - level * 0.12);
      this.deadTimer = 0;
    }

    target(game) {
      const player = game.player;
      if (game.frightenedTimer > 0) return { x: Math.random() * COLS, y: Math.random() * ROWS };
      if (game.mode === "scatter") return this.config.scatter;
      if (this.config.name === "Blinky") return { x: player.x, y: player.y };
      if (this.config.name === "Pinky") return { x: player.x + player.dir.x * 4, y: player.y + player.dir.y * 4 };
      if (this.config.name === "Inky") return { x: player.x + (player.x - game.ghosts[0].x), y: player.y + (player.y - game.ghosts[0].y) };
      const dist = Math.hypot(player.x - this.x, player.y - this.y);
      return dist < 6 ? this.config.scatter : { x: player.x, y: player.y };
    }

    chooseDirection(game) {
      const options = Object.values(DIRS).filter((dir) => {
        if (dir === DIRS.none) return false;
        if (this.dir.x + dir.x === 0 && this.dir.y + dir.y === 0) return false;
        return this.canMove(game.maze, dir, "ghost");
      });
      const usable = options.length ? options : Object.values(DIRS).filter((dir) => dir !== DIRS.none && this.canMove(game.maze, dir, "ghost"));
      if (!usable.length) return DIRS.none;
      if (game.frightenedTimer > 0) return usable[Math.floor(Math.random() * usable.length)];
      const target = this.deadTimer > 0 ? this.config.start : this.target(game);
      return usable.sort((a, b) => {
        const ax = Math.round(this.x) + a.x;
        const ay = Math.round(this.y) + a.y;
        const bx = Math.round(this.x) + b.x;
        const by = Math.round(this.y) + b.y;
        return Math.hypot(ax - target.x, ay - target.y) - Math.hypot(bx - target.x, by - target.y);
      })[0];
    }

    update(dt, game) {
      if (this.spawnDelay > 0) {
        this.spawnDelay -= dt;
        return;
      }
      if (this.deadTimer > 0) this.deadTimer -= dt;
      this.mode = game.frightenedTimer > 0 ? "frightened" : game.mode;
      this.speed = this.deadTimer > 0 ? 8.2 : game.frightenedTimer > 0 ? 3.7 : 5.25 + Math.min(1.4, game.level * 0.16);
      if (this.centered()) {
        this.snap();
        if (this.deadTimer <= 0 && Math.hypot(this.x - this.config.start.x, this.y - this.config.start.y) < 0.5) {
          this.deadTimer = 0;
        }
        this.dir = this.chooseDirection(game);
      }
      this.move(dt);
    }
  }

  class Game {
    constructor() {
      this.audio = new AudioSystem();
      this.maze = new Maze();
      this.player = new Player();
      this.ghosts = GHOSTS.map((config, index) => new Ghost(config, index));
      this.state = "menu";
      this.score = 0;
      this.level = 1;
      this.lives = 3;
      this.highScore = Number(localStorage.getItem("nmc_high_score") || "0");
      this.mode = "scatter";
      this.modeTimer = 7;
      this.frightenedTimer = 0;
      this.combo = 200;
      this.flashTimer = 0;
      this.messageTimer = 0;
      this.returnState = "menu";
      this.lastTime = 0;
      this.bindInput();
      requestAnimationFrame((time) => this.frame(time));
    }

    bindInput() {
      window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        const dir = { arrowleft: "left", a: "left", arrowright: "right", d: "right", arrowup: "up", w: "up", arrowdown: "down", s: "down" }[key];
        if (dir) {
          event.preventDefault();
          this.audio.resume();
          this.player.nextDir = DIRS[dir];
        }
        if (key === "enter" || key === " ") this.confirm();
        if (key === "p" || key === "escape") this.togglePause();
        if (key === "s" && this.state !== "playing") this.openSettings();
        if (key === "m") this.toMenu();
        if (key === "r" && this.state === "gameover") this.newGame();
        if (key === "," || key === "[") this.audio.setVolume(-0.08);
        if (key === "." || key === "]") this.audio.setVolume(0.08);
        if (key === "0") this.audio.toggleMute();
      });

      let start = null;
      canvas.addEventListener("pointerdown", (event) => {
        this.audio.resume();
        start = { x: event.clientX, y: event.clientY };
        if (this.state !== "playing") this.confirm();
      });
      canvas.addEventListener("pointerup", (event) => {
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.hypot(dx, dy) > 24) this.player.nextDir = Math.abs(dx) > Math.abs(dy) ? DIRS[dx > 0 ? "right" : "left"] : DIRS[dy > 0 ? "down" : "up"];
        start = null;
      });

      document.querySelectorAll("[data-dir]").forEach((button) => {
        button.addEventListener("pointerdown", () => {
          this.audio.resume();
          this.player.nextDir = DIRS[button.dataset.dir];
          if (this.state === "menu") this.newGame();
        });
      });
    }

    confirm() {
      this.audio.resume();
      if (this.state === "menu" || this.state === "gameover") this.newGame();
      else if (this.state === "paused") this.state = "playing";
      else if (this.state === "settings") this.state = this.returnState;
    }

    togglePause() {
      if (this.state === "playing") this.state = "paused";
      else if (this.state === "paused") this.state = "playing";
      else if (this.state === "settings") this.state = this.returnState;
    }

    toMenu() {
      if (this.state === "paused" || this.state === "gameover" || this.state === "settings") this.state = "menu";
    }

    openSettings() {
      this.returnState = this.state === "paused" ? "paused" : "menu";
      this.state = "settings";
    }

    newGame() {
      this.maze.reset();
      this.player.reset();
      this.ghosts.forEach((ghost) => ghost.reset(1));
      this.state = "playing";
      this.score = 0;
      this.level = 1;
      this.lives = 3;
      this.mode = "scatter";
      this.modeTimer = 7;
      this.frightenedTimer = 0;
      this.combo = 200;
      this.flashTimer = 0;
      this.messageTimer = 1.5;
    }

    nextLevel() {
      this.level += 1;
      this.maze.reset();
      this.player.reset();
      this.ghosts.forEach((ghost) => ghost.reset(this.level));
      this.mode = "scatter";
      this.modeTimer = 6;
      this.frightenedTimer = 0;
      this.combo = 200;
      this.flashTimer = 1.1;
      this.messageTimer = 1.2;
      this.audio.level();
    }

    loseLife() {
      this.lives -= 1;
      this.audio.death();
      if (this.lives <= 0) {
        this.state = "gameover";
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem("nmc_high_score", String(this.highScore));
        }
        return;
      }
      this.player.reset();
      this.ghosts.forEach((ghost) => ghost.reset(this.level));
      this.frightenedTimer = 0;
      this.combo = 200;
      this.messageTimer = 1.2;
    }

    update(dt) {
      if (this.state !== "playing") return;
      this.modeTimer -= dt;
      if (this.modeTimer <= 0) {
        this.mode = this.mode === "scatter" ? "chase" : "scatter";
        this.modeTimer = this.mode === "scatter" ? 7 : 18;
      }
      if (this.frightenedTimer > 0) this.frightenedTimer -= dt;
      if (this.flashTimer > 0) this.flashTimer -= dt;
      if (this.messageTimer > 0) this.messageTimer -= dt;

      this.player.update(dt, this.maze, this.level);
      this.ghosts.forEach((ghost) => ghost.update(dt, this));
      this.collectPellet();
      this.resolveGhosts();
      if (this.maze.pellets <= 0) this.nextLevel();
    }

    collectPellet() {
      if (!this.player.centered()) return;
      const x = Math.round(this.player.x);
      const y = Math.round(this.player.y);
      const pellet = this.maze.eat(x, y);
      if (pellet === ".") {
        this.score += 10;
        this.audio.pellet();
      } else if (pellet === "o") {
        this.score += 50;
        this.frightenedTimer = Math.max(5.5, 8 - this.level * 0.25);
        this.combo = 200;
        this.audio.power();
      }
      if (this.score > this.highScore) this.highScore = this.score;
    }

    resolveGhosts() {
      for (const ghost of this.ghosts) {
        if (ghost.spawnDelay > 0) continue;
        const hit = Math.hypot(this.player.x - ghost.x, this.player.y - ghost.y) < 0.62;
        if (!hit) continue;
        if (this.frightenedTimer > 0 && ghost.deadTimer <= 0) {
          this.score += this.combo;
          this.combo = Math.min(1600, this.combo * 2);
          ghost.deadTimer = 2.2;
          ghost.x = ghost.config.start.x;
          ghost.y = ghost.config.start.y;
          ghost.spawnDelay = 1.0;
          this.audio.ghost();
        } else if (ghost.deadTimer <= 0) {
          this.loseLife();
        }
        break;
      }
    }

    frame(time) {
      const dt = Math.min(0.05, (time - this.lastTime) / 1000 || 0);
      this.lastTime = time;
      this.update(dt);
      this.render();
      requestAnimationFrame((next) => this.frame(next));
    }

    render() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.drawHud();
      this.drawMaze();
      this.drawPlayer();
      this.ghosts.forEach((ghost) => this.drawGhost(ghost));
      if (this.messageTimer > 0 && this.state === "playing") this.centerText(this.level === 1 ? "READY!" : "LEVEL " + this.level, 42, "#f8d849");
      if (this.state === "menu") this.drawMenu();
      if (this.state === "paused") this.drawPause();
      if (this.state === "settings") this.drawSettings();
      if (this.state === "gameover") this.drawGameOver();
    }

    drawHud() {
      ctx.fillStyle = "#070b14";
      ctx.fillRect(0, 0, WIDTH, HUD);
      ctx.fillStyle = "#f8d849";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.textAlign = "left";
      ctx.fillText("SCORE " + this.score, 18, 27);
      ctx.fillText("LEVEL " + this.level, 18, 55);
      ctx.textAlign = "right";
      ctx.fillText("HIGH " + this.highScore, WIDTH - 18, 27);
      ctx.fillText("LIVES " + this.lives, WIDTH - 18, 55);
      ctx.textAlign = "center";
      ctx.fillStyle = this.frightenedTimer > 0 ? "#75e0ff" : "#f7f0ad";
      ctx.fillText(this.frightenedTimer > 0 ? "POWER " + Math.ceil(this.frightenedTimer) : this.mode.toUpperCase(), WIDTH / 2, 42);
    }

    drawMaze() {
      const offsetY = HUD;
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLS; x += 1) {
          const cell = this.maze.tile(x, y);
          const px = x * TILE;
          const py = offsetY + y * TILE;
          if (cell === "#") {
            ctx.fillStyle = this.flashTimer > 0 && Math.floor(this.flashTimer * 12) % 2 === 0 ? "#f8d849" : "#173dc9";
            ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
            ctx.fillStyle = "#07105a";
            ctx.fillRect(px + 6, py + 6, TILE - 12, TILE - 12);
          } else if (cell === "D") {
            ctx.fillStyle = "#f4a7ff";
            ctx.fillRect(px + 3, py + TILE / 2 - 2, TILE - 6, 4);
          } else if (cell === "." || cell === "o") {
            ctx.fillStyle = cell === "o" ? "#f8d849" : "#fff6b0";
            ctx.beginPath();
            const pulse = cell === "o" ? 2 + Math.sin(performance.now() / 120) * 1.3 : 0;
            ctx.arc(px + TILE / 2, py + TILE / 2, cell === "o" ? 6 + pulse : 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    drawPlayer() {
      const px = this.player.x * TILE + TILE / 2;
      const py = HUD + this.player.y * TILE + TILE / 2;
      const mouth = 0.18 + Math.abs(Math.sin(this.player.mouth)) * 0.5;
      const angle = this.player.dir.angle;
      ctx.fillStyle = "#ffd21f";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.arc(px, py, TILE * 0.43, angle + mouth, angle + Math.PI * 2 - mouth);
      ctx.closePath();
      ctx.fill();
    }

    drawGhost(ghost) {
      if (ghost.spawnDelay > 0 && Math.floor(ghost.spawnDelay * 8) % 2 === 0) return;
      const px = ghost.x * TILE + TILE / 2;
      const py = HUD + ghost.y * TILE + TILE / 2;
      const frightened = this.frightenedTimer > 0 && ghost.deadTimer <= 0;
      ctx.fillStyle = ghost.deadTimer > 0 ? "#d7f4ff" : frightened ? (Math.floor(this.frightenedTimer * 6) % 2 ? "#224dff" : "#75e0ff") : ghost.color;
      ctx.beginPath();
      ctx.arc(px, py - 2, TILE * 0.39, Math.PI, 0);
      ctx.lineTo(px + TILE * 0.39, py + TILE * 0.32);
      for (let i = 2; i >= -2; i -= 1) {
        ctx.lineTo(px + i * TILE * 0.16, py + (i % 2 === 0 ? TILE * 0.2 : TILE * 0.34));
      }
      ctx.lineTo(px - TILE * 0.39, py - 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px - 5, py - 3, 4.2, 0, Math.PI * 2);
      ctx.arc(px + 5, py - 3, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#101935";
      ctx.beginPath();
      ctx.arc(px - 5 + ghost.dir.x * 1.5, py - 3 + ghost.dir.y * 1.5, 1.8, 0, Math.PI * 2);
      ctx.arc(px + 5 + ghost.dir.x * 1.5, py - 3 + ghost.dir.y * 1.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    drawOverlay() {
      ctx.fillStyle = "rgba(1, 3, 10, 0.82)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    centerText(text, y, color) {
      ctx.save();
      ctx.fillStyle = color || "#f7f0ad";
      ctx.font = "bold 32px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(117, 224, 255, 0.75)";
      ctx.shadowBlur = 16;
      ctx.fillText(text, WIDTH / 2, HUD + y);
      ctx.restore();
    }

    drawMenu() {
      this.drawOverlay();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffd21f";
      ctx.font = "bold 46px Trebuchet MS";
      ctx.fillText("NEON MAZE", WIDTH / 2, 154);
      ctx.fillStyle = "#75e0ff";
      ctx.font = "bold 24px Trebuchet MS";
      ctx.fillText("CHASE", WIDTH / 2, 188);
      this.menuLine("Enter / Space: start", 250);
      this.menuLine("Arrows or WASD: move", 284);
      this.menuLine("P or Esc: pause", 318);
      this.menuLine("S: settings", 352);
      this.menuLine("High score: " + this.highScore, 408);
    }

    drawPause() {
      this.drawOverlay();
      this.centerText("PAUSED", 176, "#f8d849");
      this.menuLine("Enter, Space, P, or Esc: resume", 304);
      this.menuLine("S: settings", 338);
      this.menuLine("M: return to menu", 372);
    }

    drawSettings() {
      this.drawOverlay();
      this.centerText("SETTINGS", 132, "#75e0ff");
      this.menuLine("Volume: " + Math.round(this.audio.volume * 100) + "%", 244);
      this.menuLine("Muted: " + (this.audio.muted ? "yes" : "no"), 278);
      this.menuLine("[ ]: adjust volume", 338);
      this.menuLine("0: toggle mute", 372);
      this.menuLine("Enter / Esc: back", 426);
    }

    drawGameOver() {
      this.drawOverlay();
      this.centerText("GAME OVER", 154, "#f34949");
      this.menuLine("Score: " + this.score, 258);
      this.menuLine("High score: " + this.highScore, 292);
      this.menuLine("R / Enter / Space: play again", 352);
      this.menuLine("M: menu", 386);
    }

    menuLine(text, y) {
      ctx.fillStyle = "#f7f0ad";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText(text, WIDTH / 2, y);
    }
  }

  new Game();
}());
