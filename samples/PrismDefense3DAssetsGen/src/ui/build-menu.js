import { TOWER_TYPES } from '../sim/config.js';

// Bottom sheet for build / upgrade / sell. Pure DOM, thumb-sized targets,
// no hover dependence: tap a card to act, tap elsewhere to dismiss.
export function createBuildMenu({ onBuild, onUpgrade, onSell, onClose }) {
  const sheet = document.getElementById('sheet');

  function colorOf(type) {
    return `#${TOWER_TYPES[type].color.toString(16).padStart(6, '0')}`;
  }

  function clear() {
    while (sheet.firstChild) sheet.removeChild(sheet.firstChild);
  }

  function card({ label, sub, dotColor, disabled, danger, onClick }) {
    const btn = document.createElement('button');
    btn.className = 'sheet-card' + (danger ? ' danger' : '');
    btn.disabled = !!disabled;
    if (dotColor) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.background = dotColor;
      btn.appendChild(dot);
    }
    const b = document.createElement('b');
    b.textContent = label;
    btn.appendChild(b);
    const span = document.createElement('span');
    span.className = 'cost';
    span.textContent = sub;
    btn.appendChild(span);
    btn.addEventListener('click', onClick);
    sheet.appendChild(btn);
  }

  return {
    showBuild(tile, gold) {
      clear();
      for (const type of Object.keys(TOWER_TYPES)) {
        const def = TOWER_TYPES[type];
        card({
          label: def.name,
          sub: `${def.cost}g`,
          dotColor: colorOf(type),
          disabled: gold < def.cost,
          onClick: () => onBuild(tile, type),
        });
      }
      sheet.classList.remove('hidden');
    },

    showTower(tower, gold, refund) {
      clear();
      const def = TOWER_TYPES[tower.type];
      const maxed = tower.level >= def.levels.length - 1;
      card({
        label: maxed ? `${def.name} MAX` : `Upgrade`,
        sub: maxed ? 'level 2/2' : `${def.upgradeCost}g`,
        dotColor: colorOf(tower.type),
        disabled: maxed || gold < def.upgradeCost,
        onClick: () => onUpgrade(tower),
      });
      card({
        label: 'Sell',
        sub: `+${refund}g`,
        danger: true,
        onClick: () => onSell(tower),
      });
      card({ label: 'Close', sub: '', onClick: onClose });
      sheet.classList.remove('hidden');
    },

    hide() {
      sheet.classList.add('hidden');
      clear();
    },

    isOpen() {
      return !sheet.classList.contains('hidden');
    },
  };
}
