const state = {
  left: false,
  right: false,
  fire: false,
};

function bind(id, key) {
  const el = document.getElementById(id);
  if (!el) return;

  const press = (e) => {
    e.preventDefault();
    state[key] = true;
    el.classList.add('pressed');
  };
  const release = (e) => {
    e.preventDefault();
    state[key] = false;
    el.classList.remove('pressed');
  };

  el.addEventListener('touchstart', press, { passive: false });
  el.addEventListener('touchend', release, { passive: false });
  el.addEventListener('touchcancel', release, { passive: false });

  el.addEventListener('mousedown', press);
  el.addEventListener('mouseup', release);
  el.addEventListener('mouseleave', release);
}

export function initTouchControls() {
  bind('btn-left', 'left');
  bind('btn-right', 'right');
  bind('btn-fire', 'fire');
}

export function getTouchState() {
  return state;
}
