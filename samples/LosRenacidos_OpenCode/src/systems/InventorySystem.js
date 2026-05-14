import { ITEMS } from '../utils/Constants.js';

class InventorySystem {
  constructor() {
    this.reset();
  }

  reset() {
    this.coins = { cobre: 10, plata: 0, oro: 0 };
    this.equipment = {
      weapon: this._copy(ITEMS.espada_hierro),
      shield: this._copy(ITEMS.escudo_madera),
      armor: null,
      ring: null,
    };
    this.consumables = [
      { ...ITEMS.venda, qty: 2 },
      { ...ITEMS.pan, qty: 1 },
      null, null,
    ];
  }

  _copy(item) {
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  }

  getWeaponDamage() {
    return this.equipment.weapon ? this.equipment.weapon.daño : 5;
  }

  getWeaponType() {
    return this.equipment.weapon ? this.equipment.weapon.tipoDaño : 'corte';
  }

  getArmorDefense() {
    let def = 0;
    if (this.equipment.shield) def += this.equipment.shield.defensa || 0;
    if (this.equipment.armor) def += this.equipment.armor.defensa || 0;
    return def;
  }

  useConsumable(index) {
    const slot = this.consumables[index];
    if (!slot || slot.qty <= 0) return null;
    slot.qty--;
    const item = { ...slot };
    if (slot.qty <= 0) this.consumables[index] = null;
    return item;
  }

  addItem(itemId, qty = 1) {
    const template = ITEMS[itemId];
    if (!template) return false;
    if (template.type === 'consumable') {
      const existing = this.consumables.find(c => c && c.name === template.name);
      if (existing) { existing.qty += qty; return true; }
      const emptySlot = this.consumables.findIndex(c => !c);
      if (emptySlot >= 0) { this.consumables[emptySlot] = { ...template, qty }; return true; }
    }
    return false;
  }

  addCoins(type, amount) {
    if (this.coins[type] !== undefined) this.coins[type] += amount;
  }

  getEquipmentForSlot(slot) {
    return this.equipment[slot];
  }

  canAfford(price, coinType = 'cobre') {
    return (this.coins[coinType] || 0) >= price;
  }

  spendCoins(type, amount) {
    if (this.canAfford(amount, type)) { this.coins[type] -= amount; return true; }
    return false;
  }

  getSaveData() {
    return {
      coins: { ...this.coins },
      equipment: JSON.parse(JSON.stringify(this.equipment)),
      consumables: this.consumables.map(c => c ? { ...c } : null),
    };
  }
}

export default InventorySystem;
