import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {
  FIELD,
  MAX_ENEMIES,
  MAX_MINIONS,
  MAX_PLAYER_BULLETS,
  MAX_ENEMY_BULLETS,
  MAX_POWERUPS,
  ENEMY_TYPES,
  PLAYER,
  FORCE,
  BOSS,
  HAZARD,
} from '../sim/config.js';

// The rendering module owns the renderer, scene, camera, and every GPU
// resource. It reads sim state and interpolates with `alpha`; it never mutates
// the sim. All resources are created once and reused across runs, so restarting
// holds GPU memory flat (verify via getInfo() / window.__nl.info()).
//
// NebulaLance is 2.5D: 3D meshes on a flat play plane (z=0) in front of
// scrolling parallax layers. Placeholders are flat-color primitives; generated
// OBJ models (./assets/models/*.obj + baked diffuse) swap onto the same meshes
// in place when present, the same drop-in pattern as PrismDefense3DAssetsGen.

const DPR_CAP = 2;

// The ship geometry is oriented to face +x at load (orientForwardX), so the base
// rotation is identity; runtime adds only a pitch about z from vertical movement
// (nose up when flying up).
const SHIP_BASE_ROT = { x: 0, y: 0, z: 0 };
const SHIP_PITCH = 0.3;

const COLORS = {
  player: 0x49e0c8,
  force: 0xff4dd2,
  playerShot: 0x9bf7e8,
  beam: 0xffffff,
  enemyShot: 0xff5c6e,
  boss: 0x2a2440,
  bossCore: 0xff4dd2,
  powerup: { force: 0xff4dd2, power: 0x49e0c8, speed: 0xffd24c, shield: 0x6ea8ff },
  hazard: 0x3a2740,
  explosion: 0xffd0a0,
};

function modelDef(name, height) {
  return { url: `./assets/models/${name}.obj`, tex: `./assets/models/${name}-tex.jpg`, height };
}
const MODELS = {
  player: { ...modelDef('ship', 0.95), autoFaceX: true },
  force: modelDef('force', 0.9),
  boss: modelDef('boss', 4.0),
  gunner: modelDef('enemy-gunner', 0.8),
  weaver: modelDef('enemy-weaver', 0.72),
  carrier: modelDef('enemy-carrier', 1.3),
  turret: modelDef('enemy-turret', 0.95),
};

export function createRendering(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  // Filmic tone map + slight over-exposure so the dark biomechanical models and
  // neon accents read brightly (the generated diffuse maps are quite dark).
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070f);
  scene.fog = new THREE.Fog(0x05070f, 30, 52);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  // Bright, multi-direction rig so models are lit from front and sides.
  scene.add(new THREE.AmbientLight(0xaebcd8, 0.9));
  scene.add(new THREE.HemisphereLight(0xbfe4ff, 0x46324f, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(-3, 4, 9);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfe0ff, 1.6);
  fill.position.set(4, -2, 7);
  scene.add(fill);
  const rim = new THREE.PointLight(0xff4dd2, 55, 34);
  rim.position.set(6, 0, 6);
  scene.add(rim);

  const textures = [];
  const geometries = [];
  const materials = [];
  const texLoader = new THREE.TextureLoader();
  const objLoader = new OBJLoader();
  function geo(g) { geometries.push(g); return g; }
  function mat(m) { materials.push(m); return m; }

  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  function lerp(a, b, t) { return a + (b - a) * t; }

  // ---------- parallax backdrop ----------
  function makeStarLayer(count, size, tint, depth) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, 256, 256);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * size + 0.4;
      ctx.globalAlpha = 0.4 + Math.random() * 0.6;
      ctx.fillStyle = '#cfe7ff';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    textures.push(tex);
    const m = mat(new THREE.MeshBasicMaterial({ map: tex, transparent: true, color: tint, depthWrite: false }));
    const mesh = new THREE.Mesh(geo(new THREE.PlaneGeometry(60, 34)), m);
    mesh.position.z = depth;
    scene.add(mesh);
    return { mesh, tex, speed: 0.02 / -depth };
  }
  // A dim nebula gradient far back + two star layers at different depths.
  const nebulaCanvas = document.createElement('canvas');
  nebulaCanvas.width = nebulaCanvas.height = 256;
  {
    const ctx = nebulaCanvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, '#0a0f24');
    g.addColorStop(0.5, '#161033');
    g.addColorStop(1, '#04060f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalAlpha = 0.5;
    for (const [cx, cy, col] of [[80, 90, '#1d6b66'], [180, 170, '#5a1d52']]) {
      const rg = ctx.createRadialGradient(cx, cy, 4, cx, cy, 110);
      rg.addColorStop(0, col);
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, 256, 256);
    }
  }
  const nebulaTex = new THREE.CanvasTexture(nebulaCanvas);
  nebulaTex.wrapS = nebulaTex.wrapT = THREE.RepeatWrapping;
  textures.push(nebulaTex);
  const nebulaMat = mat(new THREE.MeshBasicMaterial({ map: nebulaTex, depthWrite: false }));
  const nebula = new THREE.Mesh(geo(new THREE.PlaneGeometry(64, 36)), nebulaMat);
  nebula.position.z = -16;
  scene.add(nebula);
  const starLayers = [makeStarLayer(90, 1.4, 0xbfe0ff, -10), makeStarLayer(60, 2.2, 0x9fc6ff, -6)];

  // Swap a generated equirectangular/flat nebula image in if present.
  texLoader.load('./assets/img/nebula.png', (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    nebulaMat.map = t;
    nebulaMat.needsUpdate = true;
    textures.push(t);
  }, undefined, () => {});

  // Symmetric 3x3 eigen-decomposition (Jacobi), returns {val,vec} sorted desc.
  function eigenSym3(A) {
    const a = A.map((r) => r.slice());
    const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    for (let sweep = 0; sweep < 32; sweep++) {
      let p = 0, q = 1, max = Math.abs(a[0][1]);
      if (Math.abs(a[0][2]) > max) { max = Math.abs(a[0][2]); p = 0; q = 2; }
      if (Math.abs(a[1][2]) > max) { max = Math.abs(a[1][2]); p = 1; q = 2; }
      if (max < 1e-10) break;
      const phi = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]);
      const c = Math.cos(phi), s = Math.sin(phi);
      for (let k = 0; k < 3; k++) { const kp = a[k][p], kq = a[k][q]; a[k][p] = c * kp - s * kq; a[k][q] = s * kp + c * kq; }
      for (let k = 0; k < 3; k++) { const pk = a[p][k], qk = a[q][k]; a[p][k] = c * pk - s * qk; a[q][k] = s * pk + c * qk; }
      for (let k = 0; k < 3; k++) { const kp = V[k][p], kq = V[k][q]; V[k][p] = c * kp - s * kq; V[k][q] = s * kp + c * kq; }
    }
    return [0, 1, 2]
      .map((i) => ({ val: a[i][i], vec: [V[0][i], V[1][i], V[2][i]] }))
      .sort((x, y) => y.val - x.val);
  }

  // Deterministically orient a centered geometry so its longest axis (the ship's
  // nose-tail line) lies exactly along +x, viewed from the SIDE: the flattest
  // axis (top-bottom) points up on screen and the medium axis (wingspan) points
  // toward the camera. This removes hand-tuned Euler angles for 3/4-view models.
  function orientForwardX(g) {
    const pos = g.attributes.position;
    const n = pos.count;
    let xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0;
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      xx += x * x; xy += x * y; xz += x * z; yy += y * y; yz += y * z; zz += z * z;
    }
    const eig = eigenSym3([[xx, xy, xz], [xy, yy, yz], [xz, yz, zz]]);
    const nrm = (v) => { const L = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / L, v[1] / L, v[2] / L]; };
    const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const fwd = nrm(eig[0].vec);   // longest extent = nose-tail -> +x
    let up = nrm(eig[2].vec);      // flattest extent = top-bottom -> +y (vertical)
    const cam = nrm(cross(fwd, up)); // medium extent = wingspan -> +z (toward camera)
    up = cross(cam, fwd);          // re-orthogonalize (right-handed: y = z x x)
    // Rotation mapping fwd->+x, up->+y, cam->+z (rows are the basis vectors).
    const m = new THREE.Matrix4().set(
      fwd[0], fwd[1], fwd[2], 0,
      up[0], up[1], up[2], 0,
      cam[0], cam[1], cam[2], 0,
      0, 0, 0, 1
    );
    g.applyMatrix4(m);
    g.computeBoundingBox();
    // Nose = the pointier (smaller cross-section) end; flip it to +x if needed.
    const bx = g.boundingBox;
    let fc = 0, fs = 0, bc = 0, bs = 0;
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), r = Math.hypot(pos.getY(i), pos.getZ(i));
      if (x > bx.max.x * 0.55) { fs += r; fc++; }
      else if (x < bx.min.x * 0.55) { bs += r; bc++; }
    }
    const frontSpread = fc ? fs / fc : 0;
    const backSpread = bc ? bs / bc : 0;
    if (frontSpread > backSpread) g.rotateZ(Math.PI); // nose was at -x; bring it to +x
  }

  // ---------- model upgrade helper ----------
  function loadModel({ url, tex, height, noAutoFace, autoFaceX }, onReady) {
    objLoader.load(
      url,
      (group) => {
        group.updateMatrixWorld(true);
        let src = null;
        group.traverse((n) => {
          if (!n.isMesh || !n.geometry.getAttribute('position')) return;
          const c = n.geometry.getAttribute('position').count;
          if (!src || c > src.count) src = { node: n, count: c };
        });
        if (!src) return;
        const g = src.node.geometry.clone();
        g.applyMatrix4(src.node.matrixWorld);
        if (!g.getAttribute('normal')) g.computeVertexNormals();
        g.computeBoundingBox();
        const b = g.boundingBox;
        const sy = Math.max(b.max.y - b.min.y, 1e-4);
        const s = height / sy;
        g.scale(s, s, s);
        g.computeBoundingBox();
        const bb = g.boundingBox;
        g.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
        // Ship: orient deterministically by geometry (longest axis -> +x).
        // Other models: their authored facing turns to +x with a fixed quarter turn.
        if (autoFaceX) orientForwardX(g);
        else if (!noAutoFace) g.rotateY(Math.PI / 2);
        const map = texLoader.load(tex, () => {}, undefined, () => {});
        map.colorSpace = THREE.SRGBColorSpace;
        textures.push(map);
        // Emissive lift (uses the same diffuse map) so the dark generated albedo
        // never falls to pure black under the lights.
        const material = mat(new THREE.MeshStandardMaterial({
          map, color: 0xffffff, roughness: 0.6, metalness: 0.25,
          emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.35,
        }));
        onReady(geo(g), material);
      },
      undefined,
      () => {} // missing model: primitive stays
    );
  }

  // ---------- player ship ----------
  const shipMat = mat(new THREE.MeshStandardMaterial({ color: COLORS.player, emissive: 0x1e7a6f, emissiveIntensity: 0.8, roughness: 0.4, metalness: 0.5 }));
  // Cone nose is +Y by default — same native facing as the generated ship model,
  // so SHIP_BASE_ROT orients the placeholder and the model identically.
  const shipGeo = geo(new THREE.ConeGeometry(0.34, 0.95, 16));
  const ship = new THREE.Mesh(shipGeo, shipMat);
  scene.add(ship);
  loadModel(MODELS.player, (g, m) => { ship.geometry = g; ship.material = m; });

  // charge glow behind the nose
  const chargeMat = mat(new THREE.MeshBasicMaterial({ color: 0x9bf7e8, transparent: true, opacity: 0 }));
  const chargeGlow = new THREE.Mesh(geo(new THREE.SphereGeometry(0.3, 16, 12)), chargeMat);
  scene.add(chargeGlow);

  // ---------- force pod ----------
  const forceMat = mat(new THREE.MeshStandardMaterial({ color: COLORS.force, emissive: 0x5a1240, roughness: 0.3, metalness: 0.6 }));
  const forceMesh = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(0.42, 0)), forceMat);
  forceMesh.visible = false;
  scene.add(forceMesh);
  loadModel(MODELS.force, (g, m) => { forceMesh.geometry = g; forceMesh.material = m; });

  // ---------- instanced entities ----------
  function makeInstanced(geometry, color, capacity, opts = {}) {
    const material = opts.unlit
      ? mat(new THREE.MeshBasicMaterial({ color }))
      : mat(new THREE.MeshStandardMaterial({ color, emissive: opts.emissive || 0x000000, roughness: 0.5, metalness: 0.3 }));
    const m = new THREE.InstancedMesh(geo(geometry), material, capacity);
    m.count = 0;
    m.frustumCulled = false;
    if (opts.colors) {
      for (let i = 0; i < capacity; i++) m.setColorAt(i, tmpColor.setRGB(1, 1, 1));
    }
    scene.add(m);
    return m;
  }

  const enemyGeo = {
    gunner: geo(new THREE.OctahedronGeometry(0.4, 0)),
    weaver: geo(new THREE.TetrahedronGeometry(0.42, 0)),
    carrier: geo(new THREE.BoxGeometry(0.95, 0.8, 0.8)),
    turret: geo(new THREE.CylinderGeometry(0.32, 0.46, 0.7, 10)),
  };
  const enemyMeshes = {
    gunner: makeInstanced(enemyGeo.gunner, ENEMY_TYPES.gunner.color, MAX_ENEMIES, { emissive: 0x12463f }),
    weaver: makeInstanced(enemyGeo.weaver, ENEMY_TYPES.weaver.color, MAX_ENEMIES, { emissive: 0x231d52 }),
    carrier: makeInstanced(enemyGeo.carrier, ENEMY_TYPES.carrier.color, MAX_ENEMIES, { emissive: 0x55360c }),
    turret: makeInstanced(enemyGeo.turret, ENEMY_TYPES.turret.color, MAX_ENEMIES, { emissive: 0x551226 }),
  };
  // Upgrade enemy instanced meshes to generated models when present.
  for (const type of Object.keys(enemyMeshes)) {
    loadModel(MODELS[type], (g, m) => { enemyMeshes[type].geometry = g; enemyMeshes[type].material = m; });
  }
  const minionMesh = makeInstanced(geo(new THREE.IcosahedronGeometry(0.3, 0)), ENEMY_TYPES.minion.color, MAX_MINIONS, { emissive: 0x551247 });

  const playerBulletMesh = makeInstanced(geo(new THREE.SphereGeometry(0.14, 8, 6)), COLORS.playerShot, MAX_PLAYER_BULLETS, { unlit: true });
  const enemyBulletMesh = makeInstanced(geo(new THREE.SphereGeometry(0.16, 8, 6)), COLORS.enemyShot, MAX_ENEMY_BULLETS, { unlit: true });
  const powerupMesh = makeInstanced(geo(new THREE.BoxGeometry(0.5, 0.5, 0.5)), 0xffffff, MAX_POWERUPS, { unlit: true, colors: true });

  // ---------- boss ----------
  const bossBody = new THREE.Mesh(
    geo(new THREE.IcosahedronGeometry(BOSS.bodyRadius, 1)),
    mat(new THREE.MeshStandardMaterial({ color: COLORS.boss, emissive: 0x140a24, roughness: 0.8, metalness: 0.3 }))
  );
  bossBody.visible = false;
  scene.add(bossBody);
  loadModel(MODELS.boss, (g, m) => { bossBody.geometry = g; bossBody.material = m; });
  const bossCore = new THREE.Mesh(
    geo(new THREE.SphereGeometry(BOSS.coreRadius, 18, 14)),
    mat(new THREE.MeshBasicMaterial({ color: COLORS.bossCore }))
  );
  bossCore.visible = false;
  scene.add(bossCore);

  // beam telegraph
  const beamMesh = new THREE.Mesh(
    geo(new THREE.PlaneGeometry(1, 1)),
    mat(new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: 0, depthWrite: false }))
  );
  beamMesh.visible = false;
  scene.add(beamMesh);

  // ---------- hazard walls ----------
  const wallMat = mat(new THREE.MeshStandardMaterial({ color: COLORS.hazard, emissive: 0x180a1a, roughness: 0.9 }));
  const wallGeo = geo(new THREE.BoxGeometry(FIELD.xMax - FIELD.xMin + 2, HAZARD.wallThickness, 2));
  const wallTop = new THREE.Mesh(wallGeo, wallMat);
  const wallBot = new THREE.Mesh(wallGeo, wallMat);
  wallTop.visible = wallBot.visible = false;
  scene.add(wallTop, wallBot);

  // ---------- explosions ----------
  const explosions = [];
  const exGeo = geo(new THREE.IcosahedronGeometry(0.5, 0));
  for (let i = 0; i < 28; i++) {
    const m = new THREE.Mesh(
      exGeo,
      mat(new THREE.MeshBasicMaterial({ color: COLORS.explosion, transparent: true, opacity: 0, depthWrite: false }))
    );
    m.visible = false;
    scene.add(m);
    explosions.push({ mesh: m, life: 0, maxLife: 0, scale: 1 });
  }
  function fxExplosion(x, y, scale) {
    for (const ex of explosions) {
      if (ex.life > 0) continue;
      ex.life = ex.maxLife = 0.4;
      ex.scale = scale;
      ex.mesh.position.set(x, y, 0);
      ex.mesh.visible = true;
      return;
    }
  }

  // ---------- picking ----------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const playPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hitPoint = new THREE.Vector3();
  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(playPlane, hitPoint)) return null;
    return { x: hitPoint.x, y: hitPoint.y };
  }

  // ---------- camera fit ----------
  function fitCamera(aspect) {
    const halfFov = (camera.fov * Math.PI) / 180 / 2;
    const t = Math.tan(halfFov);
    const needW = 9.6; // half-width to keep visible
    const needH = 5.6; // half-height to keep visible
    const dForW = needW / (t * aspect);
    const dForH = needH / t;
    camera.position.set(0, -0.6, Math.max(dForW, dForH));
    camera.lookAt(0, 0, 0);
  }

  // ---------- per-frame packing ----------
  function packType(mesh, list, type, alpha, radius) {
    let n = 0;
    for (const e of list) {
      if (!e.active || (type && e.type !== type)) continue;
      dummy.position.set(lerp(e.prevX, e.x, alpha), lerp(e.prevY, e.y, alpha), 0);
      dummy.rotation.set(0, 0, 0);
      const flash = e.hitFlash > 0 ? 1.25 : 1;
      dummy.scale.set(flash, flash, flash);
      dummy.updateMatrix();
      mesh.setMatrixAt(n++, dummy.matrix);
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  }

  function packBullets(mesh, list, alpha, beamScaleKind) {
    let n = 0;
    for (const b of list) {
      if (!b.active) continue;
      dummy.position.set(lerp(b.prevX, b.x, alpha), lerp(b.prevY, b.y, alpha), 0);
      dummy.rotation.set(0, 0, 0);
      if (beamScaleKind && b.kind === 'beam') {
        dummy.scale.set(6, b.radius / 0.14, b.radius / 0.14);
      } else {
        dummy.scale.set(1, 1, 1);
      }
      dummy.updateMatrix();
      mesh.setMatrixAt(n++, dummy.matrix);
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  }

  function packPowerups(sim, alpha, timeSec) {
    let n = 0;
    for (const u of sim.powerups) {
      if (!u.active) continue;
      dummy.position.set(lerp(u.prevX, u.x, alpha), lerp(u.prevY, u.y, alpha), 0);
      dummy.rotation.set(timeSec * 1.5, timeSec * 2, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      powerupMesh.setMatrixAt(n, dummy.matrix);
      powerupMesh.setColorAt(n, tmpColor.setHex(COLORS.powerup[u.kind] || 0xffffff));
      n++;
    }
    powerupMesh.count = n;
    powerupMesh.instanceMatrix.needsUpdate = true;
    if (powerupMesh.instanceColor) powerupMesh.instanceColor.needsUpdate = true;
  }

  function updateExplosions(dt) {
    for (const ex of explosions) {
      if (ex.life <= 0) continue;
      ex.life -= dt;
      if (ex.life <= 0) {
        ex.mesh.visible = false;
        ex.mesh.material.opacity = 0;
        continue;
      }
      const k = 1 - ex.life / ex.maxLife;
      const s = ex.scale * (0.4 + k * 1.3);
      ex.mesh.scale.set(s, s, s);
      ex.mesh.material.opacity = 0.9 * (1 - k);
    }
  }

  let lastTime = 0;
  let firstFit = true;

  return {
    screenToWorld,

    resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fitCamera(camera.aspect);
      firstFit = false;
    },

    render(sim, alpha, timeSec) {
      const dt = lastTime ? Math.min(timeSec - lastTime, 0.1) : 0;
      lastTime = timeSec;

      // parallax scroll
      nebulaTex.offset.x = timeSec * 0.006;
      for (const l of starLayers) l.tex.offset.x = timeSec * (l === starLayers[1] ? 0.05 : 0.025);

      // player ship
      const p = sim.player;
      const px = lerp(p.prevX, p.x, alpha);
      const py = lerp(p.prevY, p.y, alpha);
      ship.position.set(px, py, 0);
      ship.visible = p.alive;
      // blink during invulnerability
      if (p.invuln > 0) ship.visible = p.alive && Math.floor(timeSec * 18) % 2 === 0;
      // Ship always faces forward (+x); only pitches up/down with vertical movement.
      ship.rotation.set(SHIP_BASE_ROT.x, SHIP_BASE_ROT.y, SHIP_BASE_ROT.z + sim.moveY * SHIP_PITCH);

      // charge glow
      const charge = sim.chargeLevel();
      chargeGlow.position.set(px + 0.55, py, 0);
      chargeGlow.material.opacity = charge * 0.8;
      const cs = 0.3 + charge * 0.9;
      chargeGlow.scale.set(cs, cs, cs);

      // force
      const f = sim.force;
      forceMesh.visible = f.granted;
      if (f.granted) {
        forceMesh.position.set(lerp(f.prevX, f.x, alpha), lerp(f.prevY, f.y, alpha), 0);
        forceMesh.rotation.y += 0.1;
        forceMesh.rotation.x += 0.05;
      }

      // enemies / minions
      for (const type of Object.keys(enemyMeshes)) packType(enemyMeshes[type], sim.enemies, type, alpha);
      packType(minionMesh, sim.minions, null, alpha);

      // bullets / powerups
      packBullets(playerBulletMesh, sim.playerBullets, alpha, true);
      packBullets(enemyBulletMesh, sim.enemyBullets, alpha, false);
      packPowerups(sim, alpha, timeSec);

      // boss
      const boss = sim.boss;
      const showBoss = boss.active;
      bossBody.visible = showBoss;
      bossCore.visible = showBoss && boss.mode === 'fight';
      if (showBoss) {
        const bx = lerp(boss.prevX, boss.x, alpha);
        const by = lerp(boss.prevY, boss.y, alpha);
        bossBody.position.set(bx, by, 0);
        bossBody.rotation.z = Math.sin(timeSec * 0.6) * 0.05;
        bossBody.rotation.y += 0.004;
        const cx = bx + BOSS.coreOffsetX;
        bossCore.position.set(cx, by, 0.2);
        const pulse = 0.85 + 0.15 * Math.sin(timeSec * 6);
        const flash = boss.coreFlash > 0 ? 1.6 : 1;
        const inv = boss.invuln > 0 ? (Math.floor(timeSec * 12) % 2 === 0 ? 0.4 : 1) : 1;
        bossCore.scale.setScalar(pulse * flash);
        bossCore.material.color.setHex(boss.invuln > 0 ? 0x884466 : COLORS.bossCore);
        bossCore.material.opacity = inv;
        bossCore.material.transparent = boss.invuln > 0;

        // beam telegraph
        if (boss.beamState === 'warn' || boss.beamState === 'fire') {
          beamMesh.visible = true;
          const span = bx - FIELD.xMin;
          const half = boss.beamState === 'fire' ? BOSS.beamHalfH * 2 : 0.18;
          beamMesh.scale.set(span, half, 1);
          beamMesh.position.set(FIELD.xMin + span / 2, boss.beamY, 0.1);
          beamMesh.material.color.setHex(boss.beamState === 'fire' ? 0xff3344 : 0xffd24c);
          beamMesh.material.opacity = boss.beamState === 'fire' ? 0.8 : 0.35 + 0.25 * Math.sin(timeSec * 24);
        } else {
          beamMesh.visible = false;
        }
      } else {
        beamMesh.visible = false;
      }

      // hazard walls
      if (sim.hazard.active) {
        wallTop.visible = wallBot.visible = true;
        const gy = sim.hazard.gap + HAZARD.wallThickness / 2;
        wallTop.position.set(0, gy, 0);
        wallBot.position.set(0, -gy, 0);
      } else {
        wallTop.visible = wallBot.visible = false;
      }

      updateExplosions(dt);
      rim.position.set(boss.active ? boss.x : 6, boss.active ? boss.y : 0, 6);

      renderer.render(scene, camera);
    },

    fxExplosion,
    getInfo() { return renderer.info; },

    dispose() {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();
      renderer.dispose();
    },
  };
}
