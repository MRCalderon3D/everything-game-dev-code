import { BOARD_SIZE } from '../sim/config.js';

const MIN_PITCH = 0.3;
const MAX_PITCH = 1.4;
const MIN_DIST = 8;
const ORBIT_SPEED = 0.005;

// Orbital rig around the board center. Pitch and zoom are clamped, and the max
// zoom-out is recomputed per resize so the board always fits the frame in both
// portrait and landscape.
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.yaw = -Math.PI / 4;
    this.pitch = 0.8; // ~45 degrees
    this.distance = 16;
    this.maxDist = 24;
    this.apply();
  }

  orbit(dx, dy) {
    this.yaw -= dx * ORBIT_SPEED;
    this.pitch = Math.min(MAX_PITCH, Math.max(MIN_PITCH, this.pitch + dy * ORBIT_SPEED));
    this.apply();
  }

  zoom(factor) {
    this.distance = Math.min(this.maxDist, Math.max(MIN_DIST, this.distance * factor));
    this.apply();
  }

  // Distance at which the whole board fits the tighter screen axis.
  fitDistance(aspect) {
    const radius = (BOARD_SIZE * Math.SQRT2) / 2 + 1.5;
    const vFov = (this.camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    return radius / Math.tan(Math.min(vFov, hFov) / 2);
  }

  setViewport(aspect, isFirstFit) {
    const fit = this.fitDistance(aspect);
    this.maxDist = fit * 1.45;
    if (isFirstFit || this.distance > this.maxDist) this.distance = Math.min(fit, this.maxDist);
    this.apply();
  }

  apply() {
    const c = this.camera;
    const horiz = this.distance * Math.cos(this.pitch);
    c.position.set(
      Math.sin(this.yaw) * horiz,
      this.distance * Math.sin(this.pitch),
      Math.cos(this.yaw) * horiz
    );
    c.lookAt(0, 0, 0);
  }
}
