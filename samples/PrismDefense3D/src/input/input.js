// Pointer-events input: tap vs orbit-drag detection, two-finger pinch zoom,
// wheel zoom. Touch and mouse share one code path; no hover anywhere.
const TAP_SLOP_PX = 9;

export function createInput(canvas, { onTap, onOrbit, onZoom }) {
  const pointers = new Map(); // pointerId -> {x, y}
  let primaryId = -1;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let isDrag = false;
  let pinchDist = 0;
  let suppressTap = false;

  function pinchDistance() {
    const pts = [...pointers.values()];
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      primaryId = e.pointerId;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      isDrag = false;
      suppressTap = false;
    } else if (pointers.size === 2) {
      pinchDist = pinchDistance();
      suppressTap = true; // a pinch is never a tap
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointers.size === 2) {
      const d = pinchDistance();
      if (pinchDist > 0 && d > 0) onZoom(pinchDist / d);
      pinchDist = d;
      return;
    }

    if (e.pointerId !== primaryId) return;
    if (!isDrag && Math.hypot(e.clientX - startX, e.clientY - startY) > TAP_SLOP_PX) {
      isDrag = true;
    }
    if (isDrag) {
      onOrbit(e.clientX - lastX, e.clientY - lastY);
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (e.pointerId === primaryId) {
      if (!isDrag && !suppressTap && e.type === 'pointerup') {
        onTap(e.clientX, e.clientY);
      }
      primaryId = pointers.size > 0 ? [...pointers.keys()][0] : -1;
      isDrag = pointers.size > 0; // remaining finger continues as drag, not tap
      if (primaryId >= 0) {
        const p = pointers.get(primaryId);
        lastX = p.x;
        lastY = p.y;
      }
    }
    if (pointers.size < 2) pinchDist = 0;
  }

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      onZoom(e.deltaY > 0 ? 1.08 : 0.93);
    },
    { passive: false }
  );
}
