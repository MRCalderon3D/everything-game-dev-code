import { PATH_WAYPOINTS, tileToWorldX, tileToWorldZ } from './config.js';

// Precomputed S-curve polyline in world space, with cumulative segment lengths
// so enemies can be positioned from a single scalar (distance along path).
export function buildPath() {
  const points = PATH_WAYPOINTS.map(([col, row]) => ({
    x: tileToWorldX(col),
    z: tileToWorldZ(row),
  }));

  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dz = points[i].z - points[i - 1].z;
    cumulative.push(cumulative[i - 1] + Math.hypot(dx, dz));
  }
  const totalLength = cumulative[cumulative.length - 1];

  // Every tile the path crosses (waypoints are axis-aligned), keyed "col,row".
  const tiles = new Set();
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const [c0, r0] = PATH_WAYPOINTS[i - 1];
    const [c1, r1] = PATH_WAYPOINTS[i];
    const steps = Math.abs(c1 - c0) + Math.abs(r1 - r0);
    const dc = Math.sign(c1 - c0);
    const dr = Math.sign(r1 - r0);
    for (let s = 0; s <= steps; s++) {
      tiles.add(`${c0 + dc * s},${r0 + dr * s}`);
    }
  }

  // Writes into `out` to avoid allocating in the sim loop.
  function posAt(dist, out) {
    const d = Math.max(0, Math.min(dist, totalLength));
    let i = 1;
    while (i < cumulative.length - 1 && cumulative[i] < d) i++;
    const segStart = cumulative[i - 1];
    const segLen = cumulative[i] - segStart || 1;
    const t = (d - segStart) / segLen;
    out.x = points[i - 1].x + (points[i].x - points[i - 1].x) * t;
    out.z = points[i - 1].z + (points[i].z - points[i - 1].z) * t;
    return out;
  }

  return { points, totalLength, tiles, posAt };
}
