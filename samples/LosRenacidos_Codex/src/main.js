(function () {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const SAVE_KEY = "los_renacidos_codex_save_v1";
  const TWO_PI = Math.PI * 2;
  const ASSET_PATHS = {
    titleHub: "assets/images/title-hub.png",
    arena: "assets/images/arena-frontier.png",
    archive: "assets/images/archive-map.png",
    erik: "assets/images/erik.png",
    alphaBoar: "assets/images/alpha-boar.png",
    goblin: "assets/images/goblin.png"
  };

  const COLORS = {
    ink: "#080b08",
    panel: "rgba(14, 20, 15, 0.9)",
    panel2: "rgba(23, 33, 25, 0.86)",
    gold: "#d9bb66",
    pale: "#e8dfbd",
    blue: "#81c7d7",
    green: "#6fbf8f",
    red: "#c96a57",
    corruption: "#75d36e",
    shadow: "rgba(0, 0, 0, 0.42)"
  };

  const NODE_TYPES = {
    combat: { label: "Combat", color: "#a95d4d" },
    event: { label: "Event", color: "#6f9f83" },
    rest: { label: "Rest", color: "#8db1a7" },
    merchant: { label: "Merchant", color: "#d2b16d" },
    training: { label: "Training", color: "#9a8ac6" },
    elite: { label: "Elite", color: "#d0795f" },
    boss: { label: "Alpha Echo", color: "#c84f3f" }
  };

  const ENEMY_TEMPLATES = {
    rabbit: { name: "Cursed Rabbit", hp: 22, speed: 120, damage: 7, range: 22, windup: 0.34, cooldown: 1.0, radius: 13, xp: 1, copper: 2, color: "#bcae9a" },
    boar: { name: "Cursed Boar", hp: 48, speed: 92, damage: 14, range: 30, windup: 0.5, cooldown: 1.35, radius: 19, xp: 2, copper: 4, color: "#765645" },
    goblin: { name: "Frontier Goblin", hp: 36, speed: 110, damage: 10, range: 27, windup: 0.38, cooldown: 1.12, radius: 15, xp: 2, copper: 5, color: "#688b55" },
    bandit: { name: "Hill Bandit", hp: 58, speed: 96, damage: 16, range: 34, windup: 0.46, cooldown: 1.25, radius: 17, xp: 3, copper: 8, color: "#8f6b52" },
    archer: { name: "Road Archer", hp: 34, speed: 82, damage: 12, range: 240, windup: 0.72, cooldown: 1.7, radius: 15, xp: 3, copper: 7, color: "#8ca068", ranged: true },
    alpha: { name: "Alpha Cursed Boar", hp: 230, speed: 104, damage: 24, range: 42, windup: 0.58, cooldown: 1.05, radius: 31, xp: 12, copper: 30, color: "#9a473c", boss: true }
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function normalize(x, y) {
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  function drawRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function imageReady(image) {
    return image && image.complete && image.naturalWidth > 0;
  }

  function drawImageCover(image, x, y, w, h) {
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (image.naturalWidth - sw) / 2;
    const sy = (image.naturalHeight - sh) / 2;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }

  class AudioSystem {
    constructor(save) {
      this.ctx = null;
      this.master = null;
      this.ambient = null;
      this.volume = save.volume ?? 0.55;
      this.muted = save.muted ?? false;
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
      this.volume = clamp(this.volume + delta, 0, 1);
      this.applyVolume();
    }

    toggleMute() {
      this.muted = !this.muted;
      this.applyVolume();
    }

    applyVolume() {
      if (this.master) this.master.gain.value = this.muted ? 0 : this.volume;
    }

    tone(freq, duration, type, gain, endFreq) {
      this.resume();
      if (!this.ctx || !this.master) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const amp = this.ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(gain || 0.07, now + 0.018);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(amp);
      amp.connect(this.master);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    }

    system() {
      this.tone(720, 0.08, "triangle", 0.035, 980);
    }

    hit() {
      this.tone(120, 0.07, "sawtooth", 0.08, 70);
    }

    heavy() {
      this.tone(180, 0.14, "square", 0.1, 90);
    }

    block() {
      this.tone(520, 0.08, "triangle", 0.055, 340);
    }

    hurt() {
      this.tone(92, 0.24, "sawtooth", 0.08, 52);
    }

    corruption() {
      this.tone(70, 0.4, "sawtooth", 0.055, 120);
    }

    victory() {
      [392, 494, 587, 784].forEach((freq, i) => setTimeout(() => this.tone(freq, 0.12, "triangle", 0.05), i * 80));
    }

    death() {
      this.tone(260, 0.75, "sawtooth", 0.095, 42);
    }
  }

  class Player {
    constructor(mastery) {
      this.mastery = mastery;
      this.x = 480;
      this.y = 360;
      this.radius = 18;
      this.facing = { x: 1, y: 0 };
      this.maxHp = 112 + mastery * 8;
      this.hp = this.maxHp;
      this.maxStamina = 92 + mastery * 5;
      this.stamina = this.maxStamina;
      this.bandages = 2;
      this.baseDamage = 16 + mastery * 1.5;
      this.speed = 178;
      this.attackCooldown = 0;
      this.dodgeTimer = 0;
      this.invulnerable = 0;
      this.blocking = false;
      this.skills = {
        Swordsmanship: 1 + Math.floor(mastery / 2),
        Tactics: 1,
        Parry: 1,
        Healing: 1,
        Survival: 1,
        Negotiation: 1
      };
      this.skillXp = {};
    }

    update(dt, game) {
      const input = game.input;
      let mx = 0;
      let my = 0;
      if (input.down.has("arrowleft") || input.down.has("a")) mx -= 1;
      if (input.down.has("arrowright") || input.down.has("d")) mx += 1;
      if (input.down.has("arrowup") || input.down.has("w")) my -= 1;
      if (input.down.has("arrowdown") || input.down.has("s")) my += 1;
      const moving = mx || my;
      if (moving) this.facing = normalize(mx, my);

      this.blocking = input.down.has("shift") && this.stamina > 4 && this.dodgeTimer <= 0;
      if (this.blocking) {
        this.stamina = Math.max(0, this.stamina - dt * 7);
      }

      const speedMod = this.blocking ? 0.45 : this.dodgeTimer > 0 ? 2.1 : 1;
      if (moving) {
        const n = normalize(mx, my);
        this.x += n.x * this.speed * speedMod * dt;
        this.y += n.y * this.speed * speedMod * dt;
      }

      this.x = clamp(this.x, 56, W - 56);
      this.y = clamp(this.y, 108, H - 56);
      this.attackCooldown = Math.max(0, this.attackCooldown - dt);
      this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
      this.invulnerable = Math.max(0, this.invulnerable - dt);
      if (!this.blocking && this.dodgeTimer <= 0) {
        this.stamina = clamp(this.stamina + dt * 23, 0, this.maxStamina);
      }
    }

    dodge(game) {
      if (this.dodgeTimer > 0 || this.stamina < 24) return;
      this.stamina -= 24;
      this.dodgeTimer = 0.18;
      this.invulnerable = 0.34;
      game.log("[DODGE] Stamina spent.");
      game.audio.system();
    }

    attack(game, heavy) {
      const cost = heavy ? 26 : 9;
      const cooldown = heavy ? 0.7 : 0.32;
      if (this.attackCooldown > 0 || this.stamina < cost || this.blocking) return;
      this.attackCooldown = cooldown;
      this.stamina -= cost;
      const range = heavy ? 82 : 62;
      const arc = heavy ? 0.32 : 0.48;
      const damage = this.baseDamage + this.skills.Swordsmanship * (heavy ? 4.2 : 2.5) + (heavy ? 13 : 0);
      let hit = false;
      for (const enemy of game.enemies) {
        if (enemy.dead) continue;
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const d = Math.hypot(dx, dy);
        if (d > range + enemy.radius) continue;
        const n = normalize(dx, dy);
        const dot = n.x * this.facing.x + n.y * this.facing.y;
        if (dot < arc) continue;
        enemy.takeDamage(damage, game, heavy);
        hit = true;
      }
      if (hit) {
        game.gainSkill("Swordsmanship", heavy ? 0.3 : 0.18);
        game.audio[heavy ? "heavy" : "hit"]();
      } else {
        game.audio.tone(220, 0.04, "triangle", 0.02);
      }
      game.effects.push({ type: "slash", x: this.x, y: this.y, facing: { ...this.facing }, heavy, age: 0, life: 0.16 });
    }

    heal(game) {
      if (this.bandages <= 0 || this.hp >= this.maxHp) return;
      this.bandages -= 1;
      const amount = 26 + this.skills.Healing * 5;
      this.hp = clamp(this.hp + amount, 0, this.maxHp);
      game.gainSkill("Healing", 0.55);
      game.log("[HEALING: +" + Math.round(amount) + "] Bandage used.");
      game.audio.tone(520, 0.18, "triangle", 0.05, 760);
    }

    takeDamage(amount, game, source) {
      if (this.invulnerable > 0) return;
      let final = amount;
      if (this.blocking && this.stamina > 0) {
        final *= 0.34;
        this.stamina = Math.max(0, this.stamina - amount * 0.8);
        game.gainSkill("Parry", 0.22);
        game.audio.block();
        game.floatText("BLOCK", this.x, this.y - 30, COLORS.blue);
      } else {
        game.audio.hurt();
      }
      final *= game.run.corruption >= 80 ? 1.24 : 1;
      this.hp = clamp(this.hp - final, 0, this.maxHp);
      game.floatText("-" + Math.round(final), this.x, this.y - 36, COLORS.red);
      if (this.hp <= 0) game.endRun(false, source || "The Echo collapsed around Erik.");
    }
  }

  class Enemy {
    constructor(type, x, y, depth, corruption) {
      const t = ENEMY_TEMPLATES[type];
      this.type = type;
      this.name = t.name;
      this.x = x;
      this.y = y;
      this.radius = t.radius;
      this.maxHp = t.hp + depth * 7 + corruption * 0.12;
      this.hp = this.maxHp;
      this.speed = t.speed + depth * 3;
      this.damage = t.damage + depth * 1.3 + corruption * 0.04;
      this.range = t.range;
      this.windupTime = t.windup;
      this.cooldownBase = t.cooldown;
      this.xp = t.xp;
      this.copper = t.copper;
      this.color = t.color;
      this.ranged = !!t.ranged;
      this.boss = !!t.boss;
      this.dead = false;
      this.cooldown = rand(0.2, 0.8);
      this.windup = 0;
      this.target = null;
      this.phase = rand(0, TWO_PI);
    }

    update(dt, game) {
      if (this.dead) return;
      const player = game.player;
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const d = Math.hypot(dx, dy) || 1;
      const dir = { x: dx / d, y: dy / d };
      this.cooldown = Math.max(0, this.cooldown - dt);

      if (this.windup > 0) {
        this.windup -= dt;
        if (this.windup <= 0) this.resolveAttack(game);
        return;
      }

      const desiredRange = this.ranged ? 190 : this.range * 0.78;
      if (d > desiredRange) {
        this.x += dir.x * this.speed * dt;
        this.y += dir.y * this.speed * dt;
      } else if (this.ranged && d < 135) {
        this.x -= dir.x * this.speed * 0.72 * dt;
        this.y -= dir.y * this.speed * 0.72 * dt;
      } else {
        const side = Math.sin(performance.now() / 600 + this.phase) > 0 ? 1 : -1;
        this.x += -dir.y * side * this.speed * 0.22 * dt;
        this.y += dir.x * side * this.speed * 0.22 * dt;
      }

      this.x = clamp(this.x, 46, W - 46);
      this.y = clamp(this.y, 104, H - 46);

      if (this.cooldown <= 0 && d < (this.ranged ? this.range : this.range + player.radius + 8)) {
        this.windup = this.windupTime;
        this.target = { x: player.x, y: player.y };
      }
    }

    resolveAttack(game) {
      this.cooldown = this.cooldownBase + rand(-0.15, 0.25);
      const player = game.player;
      if (this.ranged) {
        game.projectiles.push({
          x: this.x,
          y: this.y,
          vx: normalize(this.target.x - this.x, this.target.y - this.y).x * 265,
          vy: normalize(this.target.x - this.x, this.target.y - this.y).y * 265,
          damage: this.damage,
          life: 1.6,
          color: "#b4d27d"
        });
        game.audio.tone(340, 0.08, "square", 0.035, 260);
        return;
      }

      if (dist(this, player) <= this.range + player.radius + 10) {
        player.takeDamage(this.damage, game, this.name);
      }
    }

    takeDamage(amount, game, heavy) {
      this.hp = clamp(this.hp - amount, 0, this.maxHp);
      game.floatText("-" + Math.round(amount), this.x, this.y - 28, heavy ? COLORS.gold : COLORS.pale);
      if (this.hp <= 0) {
        this.dead = true;
        game.run.copper += this.copper + Math.floor(game.run.corruption / 25);
        game.gainSkill("Tactics", this.boss ? 1.2 : 0.28);
        game.floatText("+copper", this.x, this.y - 48, COLORS.gold);
        game.audio.tone(this.boss ? 110 : 180, 0.18, "sawtooth", 0.07, 70);
      }
    }
  }

  class RouteMap {
    constructor() {
      this.columns = [];
      this.currentColumn = 0;
      this.selectedNode = null;
      this.generate();
    }

    generate() {
      this.columns = [];
      const pool = [
        ["combat", "event", "combat"],
        ["combat", "merchant", "training"],
        ["elite", "rest", "event"],
        ["combat", "training", "merchant"],
        ["boss"]
      ];
      for (let c = 0; c < pool.length; c += 1) {
        const types = pool[c].slice().sort(() => Math.random() - 0.5);
        this.columns.push(types.map((type, r) => ({
          type,
          col: c,
          row: r,
          id: c + "-" + r,
          cleared: false
        })));
      }
    }

    availableNodes() {
      return this.columns[this.currentColumn] || [];
    }
  }

  class Game {
    constructor() {
      this.save = this.loadSave();
      this.audio = new AudioSystem(this.save);
      this.assets = this.loadAssets();
      this.input = { down: new Set(), pressed: new Set(), mouse: { x: 0, y: 0 } };
      this.buttons = [];
      this.choiceHandlers = [];
      this.previousScreen = "hub";
      this.settingsReturn = "title";
      this.screen = "title";
      this.route = null;
      this.player = null;
      this.enemies = [];
      this.projectiles = [];
      this.effects = [];
      this.floaters = [];
      this.props = [];
      this.logs = [
        "[SYSTEM] Session initialized.",
        "[WELCOME TO TALASARIA]"
      ];
      this.run = null;
      this.eventData = null;
      this.rewardChoices = [];
      this.lastTime = 0;
      this.bindInput();
      requestAnimationFrame((t) => this.frame(t));
    }

    loadSave() {
      try {
        return {
          fragments: 0,
          bestDepth: 0,
          volume: 0.55,
          muted: false,
          ...JSON.parse(localStorage.getItem(SAVE_KEY) || "{}")
        };
      } catch (_) {
        return { fragments: 0, bestDepth: 0, volume: 0.55, muted: false };
      }
    }

    loadAssets() {
      const assets = {};
      for (const [key, path] of Object.entries(ASSET_PATHS)) {
        const image = new Image();
        image.src = path;
        assets[key] = image;
      }
      return assets;
    }

    writeSave() {
      this.save.volume = this.audio.volume;
      this.save.muted = this.audio.muted;
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.save));
    }

    mastery() {
      return Math.floor(this.save.fragments / 3);
    }

    bindInput() {
      window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (!this.input.down.has(key)) this.input.pressed.add(key);
        this.input.down.add(key);
        if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
        this.audio.resume();
        this.handleGlobalKey(key);
      });

      window.addEventListener("keyup", (event) => {
        this.input.down.delete(event.key.toLowerCase());
      });

      canvas.addEventListener("pointermove", (event) => {
        const p = this.pointer(event);
        this.input.mouse.x = p.x;
        this.input.mouse.y = p.y;
      });

      canvas.addEventListener("pointerdown", (event) => {
        const p = this.pointer(event);
        this.input.mouse.x = p.x;
        this.input.mouse.y = p.y;
        this.audio.resume();
        if (this.screen === "combat") {
          const aim = normalize(p.x - this.player.x, p.y - this.player.y);
          this.player.facing = aim;
          this.player.attack(this, false);
        } else {
          this.handleClick(p.x, p.y);
        }
      });
    }

    pointer(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    handleGlobalKey(key) {
      if (key === "p" || key === "escape") {
        if (this.screen === "pause") {
          this.screen = this.previousScreen;
        } else if (!["title", "run-end", "archive", "settings"].includes(this.screen)) {
          this.previousScreen = this.screen;
          this.screen = "pause";
        }
      }
      if (key === "[" || key === ",") {
        this.audio.setVolume(-0.08);
        this.writeSave();
      }
      if (key === "]" || key === ".") {
        this.audio.setVolume(0.08);
        this.writeSave();
      }
      if (key === "0") {
        this.audio.toggleMute();
        this.writeSave();
      }
      const num = Number(key);
      if (num >= 1 && num <= 9) this.choose(num - 1);
      if (key === "enter" || key === "e") this.choose(0);
    }

    handleClick(x, y) {
      for (const button of this.buttons) {
        if (x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h) {
          button.action();
          return;
        }
      }
      if (this.screen === "map" && this.route) {
        for (const node of this.route.availableNodes()) {
          const dx = x - node.uiX;
          const dy = y - node.uiY;
          if (Math.hypot(dx, dy) < 34) {
            this.startNode(node);
            return;
          }
        }
      }
    }

    choose(index) {
      const handler = this.choiceHandlers[index];
      if (handler) {
        this.audio.system();
        handler();
      }
    }

    newRun() {
      this.route = new RouteMap();
      this.player = new Player(this.mastery());
      this.enemies = [];
      this.projectiles = [];
      this.effects = [];
      this.floaters = [];
      this.run = {
        depth: 0,
        copper: 12 + this.mastery() * 2,
        supplies: 2,
        corruption: 8,
        fragments: 0,
        nodeHistory: [],
        biome: "Frontier"
      };
      this.logs = [
        "[SYSTEM] Player session initialized.",
        "[STATS ASSIGNED] Strength high. Dexterity medium. Intelligence low.",
        "[OBJECTIVE] Survive the Echo and recover Archive fragments."
      ];
      this.screen = "hub";
    }

    startNode(node) {
      this.route.selectedNode = node;
      this.run.depth = node.col + 1;
      this.run.nodeHistory.push(node.type);
      this.save.bestDepth = Math.max(this.save.bestDepth || 0, this.run.depth);
      this.writeSave();
      if (node.type === "combat" || node.type === "elite" || node.type === "boss") {
        this.setupCombat(node);
      } else {
        this.setupEvent(node.type);
      }
    }

    setupCombat(node) {
      this.screen = "combat";
      this.enemies = [];
      this.projectiles = [];
      this.effects = [];
      this.floaters = [];
      this.props = this.makeProps(node.type);
      this.player.x = 480;
      this.player.y = 370;
      this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 20);

      const depth = this.run.depth;
      const corruption = this.run.corruption;
      const groups = {
        combat: depth < 2 ? ["rabbit", "boar", "goblin"] : ["boar", "goblin", "bandit", "archer"],
        elite: ["bandit", "bandit", "archer", "boar"],
        boss: ["alpha"]
      };
      const list = node.type === "boss" ? groups.boss : [];
      if (node.type !== "boss") {
        const count = node.type === "elite" ? 4 : 3 + Math.floor(depth / 2);
        for (let i = 0; i < count; i += 1) list.push(pick(groups[node.type]));
      }
      list.forEach((type, i) => {
        const angle = (i / list.length) * TWO_PI;
        const radius = node.type === "boss" ? 0 : rand(150, 240);
        this.enemies.push(new Enemy(type, 480 + Math.cos(angle) * radius, 350 + Math.sin(angle) * radius * 0.72, depth, corruption));
      });
      this.log(node.type === "boss" ? "[DANGER: ALPHA CURSED BOAR]" : "[ENEMY DETECTED]");
      if (node.type === "boss") this.audio.corruption();
    }

    makeProps(type) {
      const props = [];
      const count = type === "boss" ? 9 : 7;
      for (let i = 0; i < count; i += 1) {
        props.push({
          x: rand(90, W - 90),
          y: rand(140, H - 70),
          r: rand(10, 24),
          kind: pick(["stone", "stump", "rift"])
        });
      }
      return props;
    }

    setupEvent(type) {
      const events = {
        event: [
          {
            title: "Thorpe's Herb Trail",
            body: "Moonstalk grows beside a corrupted creek. Taking time to harvest may save lives in Minoc.",
            choices: [
              { label: "Harvest carefully (+supplies, +Survival)", run: () => { this.run.supplies += 2; this.gainSkill("Survival", 0.65); this.completeNode("[SURVIVAL: +] Herbs secured."); } },
              { label: "Rush the work (+fragment, +corruption)", run: () => { this.run.fragments += 1; this.run.corruption += 12; this.completeNode("[ARCHIVE FRAGMENT] Risk accepted."); } }
            ]
          },
          {
            title: "A Rift Shows The Gym",
            body: "For a heartbeat Erik sees fluorescent lights, iron plates, and his old reflection.",
            choices: [
              { label: "Study the Echo (+fragment)", run: () => { this.run.fragments += 1; this.run.corruption += 6; this.completeNode("[ECHO RECORDED] Modern memory stabilized."); } },
              { label: "Step away (+heal)", run: () => { this.player.hp = clamp(this.player.hp + 20, 0, this.player.maxHp); this.completeNode("[SYSTEM] Pulse normalized."); } }
            ]
          }
        ],
        rest: [
          {
            title: "Safe Campfire",
            body: "A sheltered hollow keeps the wind down. The System records quiet practice.",
            choices: [
              { label: "Rest (+health, -corruption)", run: () => { this.player.hp = clamp(this.player.hp + 45, 0, this.player.maxHp); this.run.corruption = Math.max(0, this.run.corruption - 8); this.completeNode("[CAMPING] Rest successful."); } },
              { label: "Cook supplies (+max stamina)", run: () => { this.run.supplies = Math.max(0, this.run.supplies - 1); this.player.maxStamina += 8; this.player.stamina = this.player.maxStamina; this.gainSkill("Survival", 0.4); this.completeNode("[SURVIVAL] Endurance improved."); } }
            ]
          }
        ],
        merchant: [
          {
            title: "Wandering Merchant",
            body: "A cart with too many locks waits by the road. The merchant smiles as if he expected Erik.",
            choices: [
              { label: "Buy bandage (-6 copper)", run: () => { if (this.run.copper >= 6) { this.run.copper -= 6; this.player.bandages += 1; this.gainSkill("Negotiation", 0.3); } this.completeNode("[INVENTORY] Trade complete."); } },
              { label: "Buy whetstone (-10 copper, +damage)", run: () => { if (this.run.copper >= 10) { this.run.copper -= 10; this.player.baseDamage += 4; this.gainSkill("Negotiation", 0.45); } this.completeNode("[EQUIPMENT] Edge restored."); } },
              { label: "Trade rumor (+fragment, +corruption)", run: () => { this.run.fragments += 1; this.run.corruption += 8; this.gainSkill("Negotiation", 0.2); this.completeNode("[CORVUS ARCHIVE] Rumor indexed."); } }
            ]
          }
        ],
        training: [
          {
            title: "Brand's Road Drill",
            body: "Brand forces Erik through footwork, shield pressure, and ugly practical cuts.",
            choices: [
              { label: "Sword drill (+Swordsmanship)", run: () => { this.gainSkill("Swordsmanship", 0.8); this.player.stamina = Math.max(0, this.player.stamina - 15); this.completeNode("[TRAINING] Blade memory sharpened."); } },
              { label: "Shield drill (+Parry)", run: () => { this.gainSkill("Parry", 0.8); this.player.maxStamina += 5; this.completeNode("[TRAINING] Guard improved."); } },
              { label: "Tactical lecture (+Tactics)", run: () => { this.gainSkill("Tactics", 0.75); this.completeNode("[TACTICS] Pattern recognition improved."); } }
            ]
          }
        ]
      };
      this.eventData = pick(events[type]);
      this.screen = "event";
    }

    completeNode(message) {
      const node = this.route.selectedNode;
      if (node) node.cleared = true;
      this.log(message);
      this.run.corruption = clamp(this.run.corruption + 4 + this.run.depth * 1.5, 0, 100);
      this.route.currentColumn += 1;
      if (this.route.currentColumn >= this.route.columns.length) {
        this.endRun(true, "The Echo closes with Erik still standing.");
      } else {
        this.screen = "map";
      }
    }

    updateCombat(dt) {
      this.run.corruption = clamp(this.run.corruption + dt * 0.85, 0, 100);
      if (this.run.corruption > 70 && Math.random() < dt * 0.18) this.log("[ALERT] Archelas' presence strains the Echo.");

      this.player.update(dt, this);
      if (this.input.pressed.has(" ")) this.player.dodge(this);
      if (this.input.pressed.has("j")) this.player.attack(this, false);
      if (this.input.pressed.has("k")) this.player.attack(this, true);
      if (this.input.pressed.has("q")) this.player.heal(this);

      for (const enemy of this.enemies) enemy.update(dt, this);
      this.updateProjectiles(dt);
      this.effects.forEach((effect) => { effect.age += dt; });
      this.effects = this.effects.filter((effect) => effect.age < effect.life);
      this.updateFloaters(dt);

      if (this.enemies.every((enemy) => enemy.dead)) {
        const node = this.route.selectedNode;
        if (node.type === "boss") {
          this.run.fragments += 3;
          this.audio.victory();
          this.endRun(true, "The Alpha Cursed Boar falls. Corvus will want this memory.");
        } else {
          const bonus = node.type === "elite" ? 2 : 1;
          this.run.fragments += node.type === "elite" ? 1 : 0;
          this.run.copper += bonus * 4;
          this.run.supplies += Math.random() < 0.35 ? 1 : 0;
          this.prepareRewards(node.type);
          this.gainSkill("Survival", 0.22);
          this.screen = "reward";
        }
      }
    }

    updateProjectiles(dt) {
      for (const p of this.projectiles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life > 0 && Math.hypot(p.x - this.player.x, p.y - this.player.y) < this.player.radius + 6) {
          p.life = 0;
          this.player.takeDamage(p.damage, this, "Road Archer");
        }
      }
      this.projectiles = this.projectiles.filter((p) => p.life > 0 && p.x > 0 && p.x < W && p.y > 80 && p.y < H);
    }

    prepareRewards(type) {
      const pool = [
        { label: "Memory of Pain: +18 max health", run: () => { this.player.maxHp += 18; this.player.hp += 18; } },
        { label: "Breath Discipline: +14 max stamina", run: () => { this.player.maxStamina += 14; this.player.stamina += 14; } },
        { label: "Sharpened Edge: +5 base damage", run: () => { this.player.baseDamage += 5; } },
        { label: "Corvus Note: +1 Archive fragment", run: () => { this.run.fragments += 1; } },
        { label: "Garrick's Scrap: +12 copper", run: () => { this.run.copper += 12; } },
        { label: "Field Dressing: +1 bandage", run: () => { this.player.bandages += 1; } }
      ];
      this.rewardChoices = pool.sort(() => Math.random() - 0.5).slice(0, type === "elite" ? 4 : 3);
    }

    claimReward(index) {
      const reward = this.rewardChoices[index];
      if (!reward) return;
      reward.run();
      this.completeNode("[REWARD] " + reward.label);
    }

    endRun(victory, reason) {
      if (this.screen === "run-end") return;
      const gained = this.run ? this.run.fragments : 0;
      this.save.fragments += gained;
      this.writeSave();
      this.endData = { victory, reason, gained };
      this.screen = "run-end";
      this.audio[victory ? "victory" : "death"]();
    }

    gainSkill(name, amount) {
      if (!this.player) return;
      const before = Math.floor(this.player.skills[name]);
      this.player.skills[name] += amount;
      const after = Math.floor(this.player.skills[name]);
      if (after > before) {
        this.log("[" + name.toUpperCase() + ": +" + (after - before) + "]");
        this.floatText(name + " +" + (after - before), this.player.x, this.player.y - 54, COLORS.blue);
      }
    }

    log(message) {
      this.logs.unshift(message);
      this.logs = this.logs.slice(0, 6);
      this.audio.system();
    }

    floatText(text, x, y, color) {
      this.floaters.push({ text, x, y, color, life: 0.9, age: 0 });
    }

    updateFloaters(dt) {
      for (const f of this.floaters) {
        f.age += dt;
        f.y -= dt * 28;
      }
      this.floaters = this.floaters.filter((f) => f.age < f.life);
    }

    frame(time) {
      const dt = Math.min(0.05, (time - this.lastTime) / 1000 || 0);
      this.lastTime = time;
      if (this.screen === "combat") this.updateCombat(dt);
      if (this.screen !== "combat") this.updateFloaters(dt);
      this.render();
      this.input.pressed.clear();
      requestAnimationFrame((t) => this.frame(t));
    }

    render() {
      this.buttons = [];
      this.choiceHandlers = [];
      this.drawBackground();
      if (this.screen === "title") this.drawTitle();
      else if (this.screen === "hub") this.drawHub();
      else if (this.screen === "map") this.drawMap();
      else if (this.screen === "combat") this.drawCombat();
      else if (this.screen === "event") this.drawEvent();
      else if (this.screen === "reward") this.drawReward();
      else if (this.screen === "archive") this.drawArchive();
      else if (this.screen === "settings") this.drawSettings();
      else if (this.screen === "pause") this.drawPause();
      else if (this.screen === "run-end") this.drawRunEnd();
    }

    drawBackground() {
      const background = ["map", "archive"].includes(this.screen) ? this.assets.archive : this.assets.titleHub;
      if (imageReady(background)) {
        drawImageCover(background, 0, 0, W, H);
        ctx.fillStyle = "rgba(2, 4, 3, 0.32)";
        ctx.fillRect(0, 0, W, H);
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, "#11170f");
        gradient.addColorStop(0.55, "#172015");
        gradient.addColorStop(1, "#070907");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.strokeStyle = "rgba(117, 211, 110, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 18; i += 1) {
        const x = (i * 89 + performance.now() * 0.006) % W;
        ctx.beginPath();
        ctx.moveTo(x, 84);
        ctx.lineTo(x - 130, H);
        ctx.stroke();
      }
    }

    panel(x, y, w, h, title) {
      ctx.save();
      ctx.fillStyle = COLORS.panel;
      drawRoundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(217, 187, 102, 0.58)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      if (title) {
        ctx.fillStyle = COLORS.gold;
        ctx.font = "bold 19px Georgia";
        ctx.textAlign = "left";
        ctx.fillText(title, x + 18, y + 32);
      }
      ctx.restore();
    }

    button(label, x, y, w, h, action) {
      ctx.save();
      const hover = this.input.mouse.x >= x && this.input.mouse.x <= x + w && this.input.mouse.y >= y && this.input.mouse.y <= y + h;
      ctx.fillStyle = hover ? "rgba(77, 108, 85, 0.94)" : "rgba(31, 45, 34, 0.94)";
      drawRoundRect(x, y, w, h, 7);
      ctx.fill();
      ctx.strokeStyle = hover ? COLORS.gold : "rgba(129, 199, 215, 0.4)";
      ctx.stroke();
      ctx.fillStyle = COLORS.pale;
      ctx.font = "bold 17px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(label, x + w / 2, y + h / 2 + 6);
      ctx.restore();
      this.buttons.push({ x, y, w, h, action });
      this.choiceHandlers.push(action);
    }

    wrapText(text, x, y, width, lineHeight, color, font) {
      ctx.save();
      ctx.fillStyle = color || COLORS.pale;
      ctx.font = font || "18px Georgia";
      ctx.textAlign = "left";
      const words = text.split(" ");
      let line = "";
      let yy = y;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > width && line) {
          ctx.fillText(line.trim(), x, yy);
          line = word + " ";
          yy += lineHeight;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, yy);
      ctx.restore();
      return yy + lineHeight;
    }

    drawTitle() {
      this.panel(120, 86, 720, 468);
      ctx.textAlign = "center";
      ctx.fillStyle = COLORS.gold;
      ctx.font = "bold 46px Georgia";
      ctx.fillText("Los Renacidos", W / 2, 180);
      ctx.fillStyle = COLORS.blue;
      ctx.font = "24px Georgia";
      ctx.fillText("Echoes of Talasaria", W / 2, 220);
      this.wrapText("A System-lit action roguelike vertical slice: survive the Frontier, learn by doing, recover Archive fragments, and endure the corruption pressing through the Echo.", 210, 272, 540, 27, COLORS.pale, "19px Georgia");
      this.button("1  Start Echo", 330, 360, 300, 44, () => this.newRun());
      this.button("2  Archive", 330, 416, 300, 44, () => { this.screen = "archive"; });
      this.button("3  Settings", 330, 472, 300, 44, () => { this.settingsReturn = "title"; this.screen = "settings"; });
    }

    drawHub() {
      this.panel(54, 62, 852, 516, "Minoc Echo Camp");
      this.wrapText("A cold fire burns beside Minoc's memory. Thorpe's herb request, Brand's drills, the Wandering Merchant, and the road to Valdrenot keep folding into the same unstable route.", 92, 120, 520, 26);
      this.drawSystemLog(650, 104, 220, 178);
      this.drawRunStats(650, 304, 220, 186);
      this.button("1  Enter Procedural Echo", 92, 328, 300, 46, () => { this.screen = "map"; });
      this.button("2  Corvus Archive", 92, 386, 300, 46, () => { this.screen = "archive"; });
      this.button("3  Settings", 92, 444, 300, 46, () => { this.settingsReturn = "hub"; this.screen = "settings"; });
    }

    drawMap() {
      this.panel(50, 58, 860, 520, "Route Selection");
      this.wrapText("Choose one visible node. The route shifts after each Echo, but the milestones remain: survive, learn, recover proof, and reach the Alpha Cursed Boar.", 84, 112, 760, 24, COLORS.pale, "18px Georgia");
      const startX = 150;
      const gapX = 160;
      for (const column of this.route.columns) {
        for (const node of column) {
          const x = startX + node.col * gapX;
          const y = 220 + (node.row - (column.length - 1) / 2) * 96;
          node.uiX = x;
          node.uiY = y;
          ctx.strokeStyle = "rgba(129, 199, 215, 0.24)";
          if (node.col < this.route.columns.length - 1) {
            const next = this.route.columns[node.col + 1];
            for (const n of next) {
              const ny = 220 + (n.row - (next.length - 1) / 2) * 96;
              ctx.beginPath();
              ctx.moveTo(x + 34, y);
              ctx.lineTo(startX + (node.col + 1) * gapX - 34, ny);
              ctx.stroke();
            }
          }
        }
      }
      for (const column of this.route.columns) {
        for (const node of column) {
          const available = node.col === this.route.currentColumn;
          const meta = NODE_TYPES[node.type];
          ctx.fillStyle = node.cleared ? "rgba(90, 112, 84, 0.7)" : available ? meta.color : "rgba(48, 56, 47, 0.88)";
          ctx.beginPath();
          ctx.arc(node.uiX, node.uiY, available ? 34 : 27, 0, TWO_PI);
          ctx.fill();
          ctx.strokeStyle = available ? COLORS.gold : "rgba(232, 223, 189, 0.28)";
          ctx.lineWidth = available ? 3 : 1;
          ctx.stroke();
          ctx.fillStyle = COLORS.pale;
          ctx.font = "bold 13px Georgia";
          ctx.textAlign = "center";
          ctx.fillText(meta.label, node.uiX, node.uiY + 4);
        }
      }
      this.drawRunStats(680, 396, 188, 128);
    }

    drawCombat() {
      this.drawArena();
      for (const p of this.projectiles) this.drawProjectile(p);
      for (const enemy of this.enemies) this.drawEnemy(enemy);
      this.drawPlayer();
      for (const effect of this.effects) this.drawEffect(effect);
      this.drawFloaters();
      this.drawCombatHud();
    }

    drawArena() {
      if (imageReady(this.assets.arena)) {
        drawImageCover(this.assets.arena, 0, 82, W, H - 82);
        ctx.fillStyle = "rgba(2, 5, 3, 0.12)";
        ctx.fillRect(0, 82, W, H - 82);
      } else {
        ctx.fillStyle = "#172113";
        ctx.fillRect(0, 82, W, H - 82);
        const g = ctx.createRadialGradient(480, 360, 80, 480, 360, 520);
        g.addColorStop(0, "rgba(83, 107, 72, 0.45)");
        g.addColorStop(1, "rgba(4, 7, 4, 0.9)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 82, W, H - 82);
      }
      ctx.strokeStyle = "rgba(217, 187, 102, 0.22)";
      ctx.strokeRect(42, 100, W - 84, H - 134);
      for (const prop of this.props) {
        ctx.fillStyle = prop.kind === "rift" ? "rgba(117, 211, 110, 0.35)" : prop.kind === "stone" ? "#32372f" : "#3a281c";
        ctx.beginPath();
        ctx.ellipse(prop.x, prop.y, prop.r * 1.4, prop.r * 0.65, 0, 0, TWO_PI);
        ctx.fill();
        if (prop.kind === "rift") {
          ctx.strokeStyle = COLORS.corruption;
          ctx.beginPath();
          ctx.moveTo(prop.x - prop.r, prop.y);
          ctx.lineTo(prop.x + prop.r * 0.2, prop.y - prop.r);
          ctx.lineTo(prop.x + prop.r, prop.y + prop.r * 0.2);
          ctx.stroke();
        }
      }
    }

    drawCombatHud() {
      ctx.fillStyle = "rgba(7, 10, 7, 0.94)";
      ctx.fillRect(0, 0, W, 82);
      this.bar(22, 18, 220, 16, this.player.hp / this.player.maxHp, "#b9594f", "Health " + Math.ceil(this.player.hp) + "/" + Math.ceil(this.player.maxHp));
      this.bar(22, 46, 220, 13, this.player.stamina / this.player.maxStamina, "#d8b95f", "Stamina");
      this.bar(276, 18, 190, 13, this.run.corruption / 100, COLORS.corruption, "Corruption " + Math.floor(this.run.corruption) + "%");
      ctx.fillStyle = COLORS.pale;
      ctx.font = "bold 15px Georgia";
      ctx.fillText("Copper " + this.run.copper + "  Supplies " + this.run.supplies + "  Bandages " + this.player.bandages, 276, 54);
      ctx.textAlign = "right";
      ctx.fillText("J attack  K heavy  Space dodge  Shift block  Q bandage", W - 20, 30);
      ctx.fillText("Enemies " + this.enemies.filter((e) => !e.dead).length, W - 20, 56);
      ctx.textAlign = "left";
    }

    bar(x, y, w, h, value, color, label) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w * clamp(value, 0, 1), h);
      ctx.strokeStyle = "rgba(232, 223, 189, 0.35)";
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = COLORS.pale;
      ctx.font = "12px Georgia";
      ctx.fillText(label, x + 4, y + h - 3);
    }

    drawPlayer() {
      const p = this.player;
      ctx.save();
      ctx.fillStyle = COLORS.shadow;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 17, 24, 9, 0, 0, TWO_PI);
      ctx.fill();
      if (imageReady(this.assets.erik)) {
        const w = p.blocking ? 74 : 66;
        const h = p.blocking ? 86 : 80;
        ctx.drawImage(this.assets.erik, p.x - w / 2, p.y - h + 28, w, h);
        if (p.blocking) {
          ctx.strokeStyle = COLORS.blue;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 28, -1.2, 1.2);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }
      ctx.fillStyle = p.blocking ? "#8db1a7" : "#c49a54";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, TWO_PI);
      ctx.fill();
      ctx.fillStyle = "#2c3d37";
      ctx.fillRect(p.x - 7, p.y - 24, 14, 18);
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.x + p.facing.x * 10, p.y + p.facing.y * 10);
      ctx.lineTo(p.x + p.facing.x * 32, p.y + p.facing.y * 32);
      ctx.stroke();
      if (p.blocking) {
        ctx.strokeStyle = COLORS.blue;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 28, -1.2, 1.2);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawEnemy(enemy) {
      if (enemy.dead) return;
      ctx.save();
      ctx.fillStyle = COLORS.shadow;
      ctx.beginPath();
      ctx.ellipse(enemy.x, enemy.y + enemy.radius * 0.75, enemy.radius * 1.35, enemy.radius * 0.5, 0, 0, TWO_PI);
      ctx.fill();
      const sprite = enemy.boss || enemy.type === "boar" ? this.assets.alphaBoar : this.assets.goblin;
      if (imageReady(sprite)) {
        const size = enemy.boss ? 118 : enemy.type === "boar" ? 66 : 58;
        const h = enemy.boss ? 96 : enemy.type === "boar" ? 54 : 66;
        ctx.globalAlpha = enemy.windup > 0 ? 0.82 : 1;
        ctx.drawImage(sprite, enemy.x - size / 2, enemy.y - h + enemy.radius * 0.45, size, h);
        ctx.globalAlpha = 1;
        this.bar(enemy.x - enemy.radius, enemy.y - enemy.radius - 13, enemy.radius * 2, 5, enemy.hp / enemy.maxHp, COLORS.red, "");
        if (enemy.windup > 0) {
          ctx.strokeStyle = COLORS.gold;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.ranged ? 42 : enemy.range + enemy.radius, 0, TWO_PI);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }
      ctx.fillStyle = enemy.windup > 0 ? COLORS.red : enemy.color;
      ctx.beginPath();
      if (enemy.boss) ctx.ellipse(enemy.x, enemy.y, enemy.radius * 1.25, enemy.radius * 0.88, 0, 0, TWO_PI);
      else ctx.arc(enemy.x, enemy.y, enemy.radius, 0, TWO_PI);
      ctx.fill();
      ctx.strokeStyle = enemy.windup > 0 ? COLORS.gold : "rgba(0,0,0,0.35)";
      ctx.lineWidth = enemy.windup > 0 ? 4 : 2;
      ctx.stroke();
      this.bar(enemy.x - enemy.radius, enemy.y - enemy.radius - 13, enemy.radius * 2, 5, enemy.hp / enemy.maxHp, COLORS.red, "");
      if (enemy.windup > 0) {
        ctx.strokeStyle = "rgba(201, 106, 87, 0.55)";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.ranged ? 42 : enemy.range + enemy.radius, 0, TWO_PI);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawProjectile(p) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, TWO_PI);
      ctx.fill();
    }

    drawEffect(effect) {
      const t = effect.age / effect.life;
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = effect.heavy ? COLORS.gold : COLORS.pale;
      ctx.lineWidth = effect.heavy ? 9 : 5;
      ctx.beginPath();
      const base = Math.atan2(effect.facing.y, effect.facing.x);
      ctx.arc(effect.x, effect.y, effect.heavy ? 74 : 56, base - 0.75, base + 0.75);
      ctx.stroke();
      ctx.restore();
    }

    drawFloaters() {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 16px Georgia";
      for (const f of this.floaters) {
        ctx.globalAlpha = 1 - f.age / f.life;
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.restore();
    }

    drawEvent() {
      this.panel(140, 116, 680, 392, this.eventData.title);
      this.wrapText(this.eventData.body, 180, 178, 600, 28, COLORS.pale, "19px Georgia");
      this.eventData.choices.forEach((choice, i) => {
        this.button((i + 1) + "  " + choice.label, 198, 292 + i * 58, 564, 42, choice.run);
      });
      this.drawRunStats(656, 40, 220, 64);
    }

    drawReward() {
      this.panel(150, 116, 660, 392, "System Reward");
      this.wrapText("The arena quiets. The System converts pain, practice, and survival into temporary leverage for this Echo.", 190, 176, 580, 28);
      this.rewardChoices.forEach((reward, i) => {
        this.button((i + 1) + "  " + reward.label, 200, 294 + i * 54, 560, 40, () => this.claimReward(i));
      });
    }

    drawArchive() {
      this.panel(120, 82, 720, 476, "Corvus Archive");
      const mastery = this.mastery();
      this.wrapText("Fragments survive failed Echoes. Corvus cannot explain why the System preserves them, but each indexed memory makes Erik start future runs stronger.", 170, 148, 620, 27);
      ctx.fillStyle = COLORS.blue;
      ctx.font = "bold 22px Georgia";
      ctx.fillText("Archive fragments: " + this.save.fragments, 170, 248);
      ctx.fillText("Mastery level: " + mastery, 170, 286);
      ctx.fillText("Best depth reached: " + (this.save.bestDepth || 0), 170, 324);
      ctx.fillStyle = COLORS.pale;
      ctx.font = "17px Georgia";
      ctx.fillText("Every 3 fragments grant +8 health, +5 stamina, and improved starting Swordsmanship.", 170, 372);
      this.button("1  Back", 330, 454, 300, 44, () => { this.screen = this.run ? "hub" : "title"; });
    }

    drawSettings() {
      this.panel(240, 126, 480, 354, "Settings");
      ctx.fillStyle = COLORS.pale;
      ctx.font = "20px Georgia";
      ctx.fillText("Volume: " + Math.round(this.audio.volume * 100) + "%", 300, 210);
      ctx.fillText("Muted: " + (this.audio.muted ? "yes" : "no"), 300, 246);
      this.button("1  Volume Down", 310, 294, 340, 40, () => { this.audio.setVolume(-0.08); this.writeSave(); });
      this.button("2  Volume Up", 310, 344, 340, 40, () => { this.audio.setVolume(0.08); this.writeSave(); });
      this.button("3  Toggle Mute", 310, 394, 340, 40, () => { this.audio.toggleMute(); this.writeSave(); });
      this.button("4  Back", 310, 444, 340, 40, () => { this.screen = this.settingsReturn || (this.run ? "hub" : "title"); });
    }

    drawPause() {
      if (this.previousScreen === "combat" && this.player) this.drawCombat();
      else this.drawBackground();
      ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
      ctx.fillRect(0, 0, W, H);
      this.panel(280, 184, 400, 238, "Paused");
      this.button("1  Resume", 340, 258, 280, 42, () => { this.screen = this.previousScreen; });
      this.button("2  Settings", 340, 314, 280, 42, () => { this.settingsReturn = "pause"; this.screen = "settings"; });
      this.button("3  Abandon Echo", 340, 370, 280, 42, () => this.endRun(false, "Erik abandoned the unstable Echo."));
    }

    drawRunEnd() {
      this.panel(130, 92, 700, 456, this.endData.victory ? "Echo Stabilized" : "Echo Failed");
      this.wrapText(this.endData.reason, 180, 162, 600, 28, this.endData.victory ? COLORS.gold : COLORS.red, "21px Georgia");
      ctx.fillStyle = COLORS.pale;
      ctx.font = "19px Georgia";
      ctx.fillText("Fragments recovered this run: " + this.endData.gained, 180, 252);
      ctx.fillText("Total Archive fragments: " + this.save.fragments, 180, 288);
      ctx.fillText("Archive mastery: " + this.mastery(), 180, 324);
      this.button("1  Return to Hub", 300, 402, 360, 44, () => this.newRun());
      this.button("2  Archive", 300, 458, 360, 44, () => { this.screen = "archive"; });
    }

    drawSystemLog(x, y, w, h) {
      this.panel(x, y, w, h, "System");
      ctx.fillStyle = COLORS.blue;
      ctx.font = "13px Georgia";
      this.logs.slice(0, 5).forEach((line, i) => ctx.fillText(line, x + 14, y + 56 + i * 22));
    }

    drawRunStats(x, y, w, h) {
      this.panel(x, y, w, h, "Run");
      if (!this.run || !this.player) return;
      ctx.fillStyle = COLORS.pale;
      ctx.font = "14px Georgia";
      const lines = [
        "Health: " + Math.ceil(this.player.hp) + "/" + Math.ceil(this.player.maxHp),
        "Copper: " + this.run.copper,
        "Supplies: " + this.run.supplies,
        "Fragments: " + this.run.fragments,
        "Corruption: " + Math.floor(this.run.corruption) + "%"
      ];
      lines.forEach((line, i) => ctx.fillText(line, x + 14, y + 52 + i * 22));
    }
  }

  new Game();
}());
