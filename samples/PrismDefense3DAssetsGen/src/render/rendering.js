import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {
  BOARD_SIZE,
  MAX_ENEMIES,
  MAX_PROJECTILES,
  TOWER_TYPES,
  LEVELS,
  tileToWorldX,
  tileToWorldZ,
  worldToCol,
  worldToRow,
} from '../sim/config.js';
import { CameraRig } from './camera-rig.js';

// The rendering module owns the renderer, scene, camera, and every GPU
// resource. It reads sim state and interpolates; it never mutates the sim.
// All resources are created once here and reused across runs, so restarting
// holds GPU memory flat (verify with getInfo() / window.__pd.info()).
//
// AssetsGen variant: every visual asset is AI-generated through the scaffold's
// provider registry (manifests/asset-providers.json, fal.ai default) — the
// equirectangular skybox, the tileable board/path/terrain textures, and the
// Hunyuan3D models (OBJ + baked diffuse) for towers, enemies, and the crystal.
// Every asset ships with a .provenance.json sidecar. Models upgrade the
// primitives asynchronously: the game is playable with flat-color primitives
// before (or without) the model files, and instancing + per-instance damage
// tinting survive because we swap the geometry/material of the existing
// InstancedMesh objects in place.

const MAX_TOWERS_PER_TYPE = 60;
const DPR_CAP = 2;

// Per-level visual themes, indexed like LEVELS. repeat 0.5 crops each tile
// face to a quarter of the generated texture: bigger blocks, clearer glowing
// veins at gameplay zoom.
const THEMES = [
  {
    sky: './assets/img/skybox-aurora.png',
    fog: 0x141b30,
    hemi: [0xcfe0ff, 0x4a4636],
    sun: 0xfff4e0,
    tile: { url: './assets/textures/rock.png', tint: 0xffffff, repeat: 0.5 },
    path: { url: './assets/textures/dirt.png', tint: 0xffe2c4, repeat: 0.5 },
    ground: { url: './assets/textures/grass.png', tint: 0xe9f2ee, repeat: 10 },
  },
  {
    sky: './assets/img/skybox-mars.png',
    fog: 0x3d1f12,
    hemi: [0xffd9b4, 0x4a2418],
    sun: 0xffd9a8,
    tile: { url: './assets/textures/mars-rock.png', tint: 0xffffff, repeat: 0.5 },
    path: { url: './assets/textures/mars-dirt.png', tint: 0xffd9b8, repeat: 0.5 },
    ground: { url: './assets/textures/mars-ground.png', tint: 0xf2e0d4, repeat: 10 },
  },
];

// Generated model upgrades (Hunyuan3D Rapid ships OBJ + a baked diffuse map).
// height is the target world-unit height; placeY must equal the Y the packing
// functions position instances at, so the model base lands on the tile surface
// (towers scale by level, and their packed Y scales with it, so a base baked
// at -placeY stays grounded at every scale).
function modelDef(name, height) {
  return {
    url: `./assets/models/${name}.obj`,
    tex: `./assets/models/${name}-tex.jpg`,
    height,
  };
}
const MODELS = {
  // aimOffset aligns each generated model's authored facing with the +Z aim
  // convention (tuned visually; concepts were generated in 3/4 view).
  towers: {
    cannon: { ...modelDef('tower-cannon', 0.92), aimOffset: 0 },
    frost: { ...modelDef('tower-frost', 1.05), aimOffset: 0 },
    laser: { ...modelDef('tower-laser', 1.12), aimOffset: 0 },
  },
  enemies: {
    runner: modelDef('enemy-runner', 0.62),
    tank: modelDef('enemy-tank', 0.74),
    boss: modelDef('enemy-boss', 1.4),
  },
  crystal: modelDef('crystal-base', 1.5),
  // Environment props scattered on the terrain around the board; `theme`
  // matches the LEVELS index that shows them.
  props: {
    crystals: { ...modelDef('prop-crystals', 1.7), count: 24, minR: 11, maxR: 36, minS: 0.6, maxS: 1.8, theme: 0 },
    tree: { ...modelDef('prop-tree', 2.6), count: 18, minR: 12, maxR: 38, minS: 0.7, maxS: 1.5, theme: 0 },
    boulder: { ...modelDef('prop-boulder', 1.0), count: 26, minR: 10, maxR: 36, minS: 0.6, maxS: 2.0, theme: 0 },
    marsSpire: { ...modelDef('prop-mars-spire', 3.0), count: 20, minR: 11, maxR: 38, minS: 0.7, maxS: 1.8, theme: 1 },
    marsArch: { ...modelDef('prop-mars-arch', 1.9), count: 16, minR: 12, maxR: 36, minS: 0.8, maxS: 1.9, theme: 1 },
  },
};

const COLORS = {
  background: 0x141a28,
  tile: 0x2e3b4e,
  path: 0xb08d57,
  base: 0x7fd4ff,
  runner: 0xa8e64c,
  tank: 0xd94f4f,
  boss: 0xb14ce6,
  cannonShot: 0xffe0a3,
  laserShot: 0xff5cb3,
  selection: 0xffffff,
  range: 0x7fd4ff,
  fxBuild: 0xffffff,
  fxFrost: 0x4cc9f0,
};

const ENEMY_Y = { runner: 0.5, tank: 0.36, boss: 0.58 };
const SLOW_TINT = new THREE.Color(0.55, 0.78, 1.35);

export function createRendering(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  renderer.shadowMap.enabled = false; // flat placeholders: no shadow budget

  const scene = new THREE.Scene();

  // Sky: runtime-generated vertical gradient + matching fog for depth.
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 16;
  skyCanvas.height = 256;
  const skyCtx = skyCanvas.getContext('2d');
  const grad = skyCtx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#33486e');
  grad.addColorStop(0.55, '#1b2a47');
  grad.addColorStop(1, '#0c111e');
  skyCtx.fillStyle = grad;
  skyCtx.fillRect(0, 0, 16, 256);
  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  skyTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = skyTexture;
  scene.fog = new THREE.Fog(0x1b2a47, 28, 85);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  const rig = new CameraRig(camera);

  // Brighter than the Visuals variant: the generated texture set is darker
  // (slate + night palette), so the light rig compensates to keep readability.
  // Colors are retinted per level by setLevel().
  const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x4a4636, 1.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff4e0, 2.3);
  sun.position.set(6, 10, 4);
  scene.add(sun);
  // One cheap point light makes the crystal read as the thing to protect.
  const crystalLight = new THREE.PointLight(0x7fd4ff, 6, 9);
  scene.add(crystalLight);

  const textures = [skyTexture];
  const texLoader = new THREE.TextureLoader();

  // Theme texture cache + deferred assignment: a material never gets a map
  // before its image is decoded (an incomplete map renders black), so the
  // tint color remains the flat fallback. Textures load once and are reused
  // across level switches.
  const themeMaps = new Map(); // url -> texture
  const pendingSurface = new Map(); // material -> awaited url
  function themeMap({ url, repeat = 1 }) {
    let t = themeMaps.get(url);
    if (!t) {
      t = texLoader.load(url, (tex) => {
        for (const [material, wanted] of pendingSurface) {
          if (wanted === url) {
            material.map = tex;
            material.needsUpdate = true;
            pendingSurface.delete(material);
          }
        }
      });
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat, repeat);
      t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      themeMaps.set(url, t);
      textures.push(t);
    }
    return t;
  }
  function applyThemeSurface(material, def) {
    material.color.setHex(def.tint);
    const t = themeMap(def);
    if (t.image) {
      material.map = t;
      pendingSurface.delete(material);
    } else {
      material.map = null;
      pendingSurface.set(material, def.url);
    }
    material.needsUpdate = true;
  }

  // Equirectangular skyboxes load lazily per level; the gradient canvas stays
  // as the no-network fallback until the first one arrives.
  let currentLevel = 0;
  const skyTexById = [];
  function applySky(levelIndex) {
    const loaded = skyTexById[levelIndex];
    if (loaded) {
      scene.background = loaded;
      return;
    }
    texLoader.load(THEMES[levelIndex].sky, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.mapping = THREE.EquirectangularReflectionMapping;
      skyTexById[levelIndex] = t;
      textures.push(t);
      if (currentLevel === levelIndex) scene.background = t;
    });
  }

  // Track everything we create for dispose().
  const geometries = [];
  const materials = [];
  function geo(g) {
    geometries.push(g);
    return g;
  }
  function mat(m) {
    materials.push(m);
    return m;
  }
  function lambert(color) {
    return mat(new THREE.MeshLambertMaterial({ color }));
  }

  // ---------- board (rebuilt per level by setLevel) ----------

  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  // Terrain: a displaced plane instead of a flat one. Rolling hills rise away
  // from the board (the board area itself stays perfectly flat) and fade into
  // the fog. terrainHeight() is shared with the prop scatter so environment
  // models sit on the surface.
  const GROUND_Y = -0.28;
  function terrainHeight(wx, wz) {
    const d = Math.max(Math.abs(wx), Math.abs(wz));
    const ramp = THREE.MathUtils.smoothstep(d, 8.5, 17);
    if (ramp === 0) return 0;
    const n =
      Math.sin(wx * 0.23) * Math.sin(wz * 0.27) * 0.55 +
      Math.sin(wx * 0.11 + wz * 0.17) * 0.3 +
      Math.sin(wx * 0.43 - wz * 0.31) * 0.15;
    return ramp * (1.6 + n * 1.5);
  }
  const groundMat = lambert(0x3a4a32);
  const groundGeo = geo(new THREE.PlaneGeometry(90, 90, 80, 80));
  {
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      // Plane local XY maps to world X,-Z after the -90° X rotation.
      pos.setZ(i, terrainHeight(pos.getX(i), -pos.getY(i)));
    }
    groundGeo.computeVertexNormals();
  }
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = GROUND_Y;
  scene.add(groundMesh);

  // Both instanced board meshes are allocated at full-board capacity so any
  // level's tile/path split fits without reallocation.
  const tileGeo = geo(new THREE.BoxGeometry(0.94, 0.22, 0.94));
  const tileMat = lambert(COLORS.tile);
  const tileMesh = new THREE.InstancedMesh(tileGeo, tileMat, BOARD_SIZE * BOARD_SIZE);
  const pathGeo = geo(new THREE.BoxGeometry(1.0, 0.12, 1.0));
  const pathMat = lambert(COLORS.path);
  const pathMesh = new THREE.InstancedMesh(pathGeo, pathMat, BOARD_SIZE * BOARD_SIZE);
  scene.add(tileMesh, pathMesh);

  function rebuildBoard(levelIndex) {
    const waypoints = LEVELS[levelIndex].waypoints;
    const pathTiles = new Set();
    for (let i = 1; i < waypoints.length; i++) {
      const [c0, r0] = waypoints[i - 1];
      const [c1, r1] = waypoints[i];
      const steps = Math.abs(c1 - c0) + Math.abs(r1 - r0);
      const dc = Math.sign(c1 - c0);
      const dr = Math.sign(r1 - r0);
      for (let s = 0; s <= steps; s++) pathTiles.add(`${c0 + dc * s},${r0 + dr * s}`);
    }
    let ti = 0;
    let pi = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isPath = pathTiles.has(`${col},${row}`);
        dummy.position.set(tileToWorldX(col), isPath ? -0.08 : -0.11, tileToWorldZ(row));
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        if (isPath) pathMesh.setMatrixAt(pi++, dummy.matrix);
        else tileMesh.setMatrixAt(ti++, dummy.matrix);
      }
    }
    tileMesh.count = ti;
    pathMesh.count = pi;
    tileMesh.instanceMatrix.needsUpdate = true;
    pathMesh.instanceMatrix.needsUpdate = true;
    const baseTile = waypoints[waypoints.length - 1];
    baseGroup.position.set(tileToWorldX(baseTile[0]), 0, tileToWorldZ(baseTile[1]));
    crystalLight.position.set(baseGroup.position.x, 1.3, baseGroup.position.z);
  }

  // Crystal base: two cones forming a diamond, with a pulsing glow.
  // (let: the generated crystal GLB material takes over the pulse on load.)
  let baseMat = mat(
    new THREE.MeshLambertMaterial({ color: COLORS.base, emissive: 0x2d6f99 })
  );
  const baseGroup = new THREE.Group();
  const coneUp = new THREE.Mesh(geo(new THREE.ConeGeometry(0.4, 0.6, 6)), baseMat);
  coneUp.position.y = 0.9;
  const coneDown = new THREE.Mesh(geo(new THREE.ConeGeometry(0.4, 0.6, 6)), baseMat);
  coneDown.rotation.x = Math.PI;
  coneDown.position.y = 0.3;
  baseGroup.add(coneUp, coneDown);
  scene.add(baseGroup); // positioned per level by rebuildBoard()

  // ---------- instanced entity views ----------

  function makeInstanced(geometry, color, capacity, unlit = false) {
    const material = unlit
      ? mat(new THREE.MeshBasicMaterial({ color })) // projectiles glow, fog-free punch
      : lambert(color);
    const mesh = new THREE.InstancedMesh(geo(geometry), material, capacity);
    mesh.count = 0;
    mesh.frustumCulled = false; // counts change every frame; skip per-frame bounds
    scene.add(mesh);
    return mesh;
  }

  const enemyMeshes = {
    runner: makeInstanced(new THREE.CapsuleGeometry(0.18, 0.28, 4, 8), COLORS.runner, MAX_ENEMIES),
    tank: makeInstanced(new THREE.BoxGeometry(0.5, 0.5, 0.5), COLORS.tank, MAX_ENEMIES),
    boss: makeInstanced(new THREE.BoxGeometry(0.95, 0.95, 0.95), COLORS.boss, 2),
  };
  // Allocate instanceColor buffers up front.
  for (const mesh of Object.values(enemyMeshes)) {
    for (let i = 0; i < mesh.instanceMatrix.count; i++) mesh.setColorAt(i, tmpColor.setRGB(1, 1, 1));
  }

  const towerMeshes = {
    cannon: makeInstanced(new THREE.ConeGeometry(0.34, 0.85, 10), TOWER_TYPES.cannon.color, MAX_TOWERS_PER_TYPE),
    frost: makeInstanced(new THREE.SphereGeometry(0.32, 12, 10), TOWER_TYPES.frost.color, MAX_TOWERS_PER_TYPE),
    laser: makeInstanced(new THREE.BoxGeometry(0.24, 0.95, 0.24), TOWER_TYPES.laser.color, MAX_TOWERS_PER_TYPE),
  };
  const TOWER_Y = { cannon: 0.425, frost: 0.55, laser: 0.475 };

  const projectileMeshes = {
    cannon: makeInstanced(new THREE.SphereGeometry(0.1, 8, 6), COLORS.cannonShot, MAX_PROJECTILES, true),
    laser: makeInstanced(new THREE.SphereGeometry(0.06, 8, 6), COLORS.laserShot, MAX_PROJECTILES, true),
  };

  // ---------- generated model upgrades ----------

  const objLoader = new OBJLoader();

  // Loads an OBJ + its baked diffuse map, bakes world transforms into one
  // geometry, and normalizes it: visual height becomes `height` and the base
  // is baked at -placeY, so an instance positioned at y = placeY * scale
  // always sits on the tile surface.
  function loadModel({ url, tex, height }, placeY, onReady) {
    objLoader.load(
      url,
      (group) => {
        group.updateMatrixWorld(true);
        let source = null;
        group.traverse((node) => {
          if (!node.isMesh || !node.geometry.getAttribute('position')) return;
          const count = node.geometry.getAttribute('position').count;
          if (!source || count > source.count) source = { node, count };
        });
        if (!source) return;
        const geometry = source.node.geometry.clone();
        geometry.applyMatrix4(source.node.matrixWorld);
        if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const sizeY = Math.max(box.max.y - box.min.y, 1e-4);
        const s = height / sizeY;
        geometry.scale(s, s, s);
        geometry.computeBoundingBox();
        const b = geometry.boundingBox;
        geometry.translate(
          -(b.min.x + b.max.x) / 2,
          -b.min.y - placeY,
          -(b.min.z + b.max.z) / 2
        );
        const map = texLoader.load(tex, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
          t.needsUpdate = true;
        });
        textures.push(map);
        const material = mat(new THREE.MeshLambertMaterial({ map, color: 0xffffff }));
        onReady(geo(geometry), material);
      },
      undefined,
      () => {} // missing/failed model: flat-color primitives remain playable
    );
  }

  // Swap geometry/material on the live InstancedMesh: instancing, counts, and
  // per-instance damage tint buffers all survive the upgrade.
  function upgradeInstanced(mesh, def, placeY) {
    loadModel(def, placeY, (geometry, material) => {
      mesh.geometry = geometry;
      mesh.material = material;
    });
  }

  for (const [type, def] of Object.entries(MODELS.towers)) {
    upgradeInstanced(towerMeshes[type], def, TOWER_Y[type]);
  }
  for (const [type, def] of Object.entries(MODELS.enemies)) {
    upgradeInstanced(enemyMeshes[type], def, ENEMY_Y[type]);
  }

  // Crystal: hide the placeholder cones and hand the emissive pulse to the
  // generated crystal's material when it loads.
  loadModel(MODELS.crystal, 0, (geometry, material) => {
    coneUp.visible = false;
    coneDown.visible = false;
    material.emissive = new THREE.Color(0x2d6f99);
    baseGroup.add(new THREE.Mesh(geometry, material));
    baseMat = material;
  });

  // Environment props: each prop type is one InstancedMesh scattered once on
  // the terrain ring around the board (deterministic enough — placement only
  // affects visuals, never the sim).
  let propSeed = 1234567;
  function srand() {
    propSeed = (propSeed * 16807) % 2147483647;
    return propSeed / 2147483647;
  }
  const propMeshes = [];
  for (const def of Object.values(MODELS.props)) {
    loadModel(def, 0, (geometry, material) => {
      const mesh = new THREE.InstancedMesh(geometry, material, def.count);
      for (let i = 0; i < def.count; i++) {
        const ang = srand() * Math.PI * 2;
        const r = def.minR + srand() * (def.maxR - def.minR);
        const x = Math.cos(ang) * r;
        const z = Math.sin(ang) * r;
        const s = def.minS + srand() * (def.maxS - def.minS);
        dummy.position.set(x, GROUND_Y + terrainHeight(x, z) - 0.05 * s, z);
        dummy.rotation.set(0, srand() * Math.PI * 2, 0);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.visible = def.theme === currentLevel;
      scene.add(mesh);
      propMeshes.push({ mesh, def });
    });
  }

  // ---------- selection + range indicator ----------

  const selectionMesh = new THREE.Mesh(
    geo(new THREE.RingGeometry(0.45, 0.55, 24)),
    mat(new THREE.MeshBasicMaterial({ color: COLORS.selection, transparent: true, opacity: 0.9 }))
  );
  selectionMesh.rotation.x = -Math.PI / 2;
  selectionMesh.position.y = 0.03;
  selectionMesh.visible = false;
  const rangeMesh = new THREE.Mesh(
    geo(new THREE.CircleGeometry(1, 40)),
    mat(
      new THREE.MeshBasicMaterial({
        color: COLORS.range,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      })
    )
  );
  rangeMesh.rotation.x = -Math.PI / 2;
  rangeMesh.position.y = 0.02;
  rangeMesh.visible = false;
  scene.add(selectionMesh, rangeMesh);

  // ---------- fx ring pools (created once, reused) ----------

  const ringGeo = geo(new THREE.RingGeometry(0.7, 0.85, 28));
  const fxPool = [];
  function addFxRings(count, color) {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(
        ringGeo,
        mat(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }))
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.05;
      m.visible = false;
      scene.add(m);
      fxPool.push({ mesh: m, life: 0, maxLife: 0, fromScale: 1, toScale: 1, color });
    }
  }
  addFxRings(10, COLORS.fxBuild);
  addFxRings(6, COLORS.fxFrost);

  function spawnRing(x, z, kind, toScale) {
    for (const fx of fxPool) {
      if (fx.life > 0) continue;
      if (kind === 'frost' && fx.color !== COLORS.fxFrost) continue;
      if (kind !== 'frost' && fx.color === COLORS.fxFrost) continue;
      fx.life = fx.maxLife = kind === 'frost' ? 0.45 : 0.35;
      fx.fromScale = 0.3;
      fx.toScale = toScale;
      fx.mesh.position.x = x;
      fx.mesh.position.z = z;
      fx.mesh.visible = true;
      return;
    }
  }

  // ---------- picking ----------

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const pickPoint = new THREE.Vector3();

  function pickTile(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(groundPlane, pickPoint)) return null;
    const col = worldToCol(pickPoint.x);
    const row = worldToRow(pickPoint.z);
    if (col < 0 || row < 0 || col >= BOARD_SIZE || row >= BOARD_SIZE) return null;
    return { col, row };
  }

  // ---------- per-frame packing ----------

  function packEnemies(sim, alpha) {
    const counts = { runner: 0, tank: 0, boss: 0 };
    for (const e of sim.enemies) {
      if (!e.active) continue;
      const mesh = enemyMeshes[e.type];
      const i = counts[e.type]++;
      dummy.position.set(
        e.prevX + (e.x - e.prevX) * alpha,
        ENEMY_Y[e.type],
        e.prevZ + (e.z - e.prevZ) * alpha
      );
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // Tint: darker as hp drops, blue while slowed, bright flash on hit.
      const hpFrac = 0.45 + 0.55 * Math.max(0, e.hp / e.maxHp);
      tmpColor.setRGB(hpFrac, hpFrac, hpFrac);
      if (e.slowFactor < 1) tmpColor.multiply(SLOW_TINT);
      if (e.hitFlash > 0) tmpColor.setRGB(2.2, 2.2, 2.2);
      mesh.setColorAt(i, tmpColor);
    }
    for (const type of Object.keys(enemyMeshes)) {
      const mesh = enemyMeshes[type];
      mesh.count = counts[type];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }

  // View-side aim: mirrors the sim's targeting rules (cannon = furthest along
  // the path in range, laser = highest hp in range) by reading sim state —
  // never mutating it. Frost has no single target and idles in a slow spin.
  const towerYaw = new Map(); // "x,z" -> current smoothed yaw
  function aimTarget(sim, t) {
    const stats = TOWER_TYPES[t.type].levels[t.level];
    const r2 = stats.range * stats.range;
    let best = null;
    let bestKey = -Infinity;
    for (const e of sim.enemies) {
      if (!e.active) continue;
      const dx = e.x - t.x;
      const dz = e.z - t.z;
      if (dx * dx + dz * dz > r2) continue;
      const key = t.type === 'cannon' ? e.pathDist : e.hp;
      if (key > bestKey) {
        bestKey = key;
        best = e;
      }
    }
    return best;
  }

  function packTowers(sim) {
    const counts = { cannon: 0, frost: 0, laser: 0 };
    for (const t of sim.towers) {
      const mesh = towerMeshes[t.type];
      const i = counts[t.type]++;
      const s = t.level > 0 ? 1.25 : 1;
      const id = `${t.x},${t.z}`;
      let yaw = towerYaw.get(id) ?? 0;
      if (t.type === 'frost') {
        yaw += 0.012; // idle spin, ~0.7 rad/s at 60fps
      } else {
        const target = aimTarget(sim, t);
        if (target) {
          const want =
            Math.atan2(target.x - t.x, target.z - t.z) + MODELS.towers[t.type].aimOffset;
          const dy = Math.atan2(Math.sin(want - yaw), Math.cos(want - yaw));
          yaw += dy * 0.25; // smooth shortest-arc turn; holds last aim when idle
        }
      }
      towerYaw.set(id, yaw);
      dummy.position.set(t.x, TOWER_Y[t.type] * s, t.z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    for (const type of Object.keys(towerMeshes)) {
      const mesh = towerMeshes[type];
      mesh.count = counts[type];
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  function packProjectiles(sim, alpha) {
    const counts = { cannon: 0, laser: 0 };
    for (const p of sim.projectiles) {
      if (!p.active) continue;
      const mesh = projectileMeshes[p.kind];
      const i = counts[p.kind]++;
      dummy.position.set(
        p.prevX + (p.x - p.prevX) * alpha,
        0.45,
        p.prevZ + (p.z - p.prevZ) * alpha
      );
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    for (const kind of Object.keys(projectileMeshes)) {
      const mesh = projectileMeshes[kind];
      mesh.count = counts[kind];
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  let lastFxTime = 0;

  function updateFx(timeSec) {
    const dt = lastFxTime ? Math.min(timeSec - lastFxTime, 0.1) : 0;
    lastFxTime = timeSec;
    for (const fx of fxPool) {
      if (fx.life <= 0) continue;
      fx.life -= dt;
      if (fx.life <= 0) {
        fx.mesh.visible = false;
        fx.mesh.material.opacity = 0;
        continue;
      }
      const t = 1 - fx.life / fx.maxLife;
      const s = fx.fromScale + (fx.toScale - fx.fromScale) * t;
      fx.mesh.scale.set(s, s, s);
      fx.mesh.material.opacity = 0.85 * (1 - t);
    }
  }

  // ---------- level switching ----------

  function setLevel(levelIndex) {
    currentLevel = levelIndex;
    const theme = THEMES[levelIndex];
    applySky(levelIndex);
    scene.fog.color.setHex(theme.fog);
    hemi.color.setHex(theme.hemi[0]);
    hemi.groundColor.setHex(theme.hemi[1]);
    sun.color.setHex(theme.sun);
    applyThemeSurface(tileMat, theme.tile);
    applyThemeSurface(pathMat, theme.path);
    applyThemeSurface(groundMat, theme.ground);
    rebuildBoard(levelIndex);
    for (const p of propMeshes) p.mesh.visible = p.def.theme === levelIndex;
    towerYaw.clear();
  }
  setLevel(0);

  // ---------- public API ----------

  let firstFit = true;

  return {
    rig,
    pickTile,
    setLevel,

    resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(w, h, false); // explicit drawing-buffer resize
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rig.setViewport(camera.aspect, firstFit);
      firstFit = false;
    },

    render(sim, alpha, timeSec) {
      packEnemies(sim, alpha);
      packTowers(sim);
      packProjectiles(sim, alpha);
      updateFx(timeSec);
      baseGroup.rotation.y = timeSec * 0.8;
      const pulse = 0.75 + 0.25 * Math.sin(timeSec * 2.5);
      baseMat.emissiveIntensity = pulse;
      crystalLight.intensity = 4 + 3 * pulse;
      renderer.render(scene, camera);
    },

    setSelection(sel) {
      if (!sel) {
        selectionMesh.visible = false;
        rangeMesh.visible = false;
        return;
      }
      selectionMesh.visible = true;
      selectionMesh.position.x = sel.x;
      selectionMesh.position.z = sel.z;
      if (sel.range > 0) {
        rangeMesh.visible = true;
        rangeMesh.position.x = sel.x;
        rangeMesh.position.z = sel.z;
        rangeMesh.scale.set(sel.range, sel.range, 1);
      } else {
        rangeMesh.visible = false;
      }
    },

    fxBuild(x, z) {
      spawnRing(x, z, 'build', 1.1);
    },
    fxDeath(x, z) {
      spawnRing(x, z, 'death', 0.9);
    },
    fxFrost(x, z, range) {
      spawnRing(x, z, 'frost', range);
    },

    getInfo() {
      return renderer.info;
    },

    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();
      renderer.dispose();
    },
  };
}
