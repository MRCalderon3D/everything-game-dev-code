import * as THREE from 'three';
import {
  BOARD_SIZE,
  MAX_ENEMIES,
  MAX_PROJECTILES,
  TOWER_TYPES,
  PATH_WAYPOINTS,
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

const MAX_TOWERS_PER_TYPE = 60;
const DPR_CAP = 2;

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
  scene.background = new THREE.Color(COLORS.background);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  const rig = new CameraRig(camera);

  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x2c2418, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(6, 10, 4);
  scene.add(sun);

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

  // ---------- static board ----------

  const pathTiles = new Set();
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const [c0, r0] = PATH_WAYPOINTS[i - 1];
    const [c1, r1] = PATH_WAYPOINTS[i];
    const steps = Math.abs(c1 - c0) + Math.abs(r1 - r0);
    const dc = Math.sign(c1 - c0);
    const dr = Math.sign(r1 - r0);
    for (let s = 0; s <= steps; s++) pathTiles.add(`${c0 + dc * s},${r0 + dr * s}`);
  }
  const baseTile = PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];

  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  const tileGeo = geo(new THREE.BoxGeometry(0.94, 0.22, 0.94));
  const tileMesh = new THREE.InstancedMesh(tileGeo, lambert(COLORS.tile), BOARD_SIZE * BOARD_SIZE);
  const pathGeo = geo(new THREE.BoxGeometry(1.0, 0.12, 1.0));
  const pathMesh = new THREE.InstancedMesh(pathGeo, lambert(COLORS.path), pathTiles.size);
  {
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
  }
  scene.add(tileMesh, pathMesh);

  // Crystal base: two cones forming a diamond (primitives only).
  const baseMat = mat(
    new THREE.MeshLambertMaterial({ color: COLORS.base, emissive: 0x1d4a66 })
  );
  const baseGroup = new THREE.Group();
  const coneUp = new THREE.Mesh(geo(new THREE.ConeGeometry(0.4, 0.6, 6)), baseMat);
  coneUp.position.y = 0.9;
  const coneDown = new THREE.Mesh(geo(new THREE.ConeGeometry(0.4, 0.6, 6)), baseMat);
  coneDown.rotation.x = Math.PI;
  coneDown.position.y = 0.3;
  baseGroup.add(coneUp, coneDown);
  baseGroup.position.set(tileToWorldX(baseTile[0]), 0, tileToWorldZ(baseTile[1]));
  scene.add(baseGroup);

  // ---------- instanced entity views ----------

  function makeInstanced(geometry, color, capacity) {
    const mesh = new THREE.InstancedMesh(geo(geometry), lambert(color), capacity);
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
    cannon: makeInstanced(new THREE.SphereGeometry(0.1, 8, 6), COLORS.cannonShot, MAX_PROJECTILES),
    laser: makeInstanced(new THREE.SphereGeometry(0.06, 8, 6), COLORS.laserShot, MAX_PROJECTILES),
  };

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

  function packTowers(sim) {
    const counts = { cannon: 0, frost: 0, laser: 0 };
    for (const t of sim.towers) {
      const mesh = towerMeshes[t.type];
      const i = counts[t.type]++;
      const s = t.level > 0 ? 1.25 : 1;
      dummy.position.set(t.x, TOWER_Y[t.type] * s, t.z);
      dummy.rotation.set(0, 0, 0);
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

  // ---------- public API ----------

  let firstFit = true;

  return {
    rig,
    pickTile,

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
      renderer.dispose();
    },
  };
}
