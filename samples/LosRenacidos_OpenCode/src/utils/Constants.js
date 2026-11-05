const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;
const TILE_SIZE = 32;

const COLORS = {
  BG_DARK: '#0a0a0f',
  BG_PANEL: '#1a1a2e',
  BG_INPUT: '#16213e',
  TEXT_GOLD: '#d4a843',
  TEXT_BLUE: '#4488cc',
  TEXT_WHITE: '#cccccc',
  TEXT_DIM: '#666688',
  TEXT_RED: '#cc4444',
  TEXT_GREEN: '#44aa44',
  HEALTH_BAR: '#cc3333',
  HEALTH_BG: '#331111',
  STAMINA_BAR: '#ccaa33',
  STAMINA_BG: '#332211',
  MANA_BAR: '#3366cc',
  MANA_BG: '#111133',
  XP_BAR: '#44cc88',
  CORRUPTION: '#44cc44',
  CORRUPTION_BG: '#113311',
  PLAYER: '#4488cc',
  PLAYER_SHIELD: '#6688aa',
  ENEMY_JABALI: '#886644',
  ENEMY_CONEJO: '#998877',
  ENEMY_GOBLIN: '#66aa44',
  ENEMY_BANDIDO: '#aa4444',
  ENEMY_BOSS: '#cc44cc',
  ENEMY_ELITE: '#ccaa44',
  NPC_ALLY: '#4488aa',
  NPC_MERCHANT: '#ddaa44',
  NPC_QUEST: '#44aa88',
  TERRAIN_GRASS: '#2a4a2a',
  TERRAIN_DIRT: '#4a3a2a',
  TERRAIN_STONE: '#3a3a4a',
  TERRAIN_WATER: '#1a2a4a',
  TREE_GREEN: '#1a4a1a',
  TREE_TRUNK: '#5a3a1a',
  ROCK: '#555566',
  ITEM_COMMON: '#aaaaaa',
  ITEM_RARE: '#4488cc',
  ITEM_LEGENDARY: '#cc8844',
  NOTIFICATION_BG: 'rgba(10,10,20,0.85)',
  DIALOG_BG: 'rgba(10,10,20,0.9)',
  BUTTON_BG: '#1a1a3e',
  BUTTON_HOVER: '#2a2a5e',
  BUTTON_BORDER: '#4488cc',
  BUTTON_TEXT: '#d4a843',
  NODE_COMBAT: '#cc4444',
  NODE_EVENT: '#ccaa44',
  NODE_REST: '#44aa44',
  NODE_MERCHANT: '#ddaa44',
  NODE_ELITE: '#cc44cc',
  NODE_BOSS: '#ff4444',
  NODE_HUB: '#4488cc',
  NODE_LOCKED: '#333344',
  NODE_PATH: '#444466',
};

const STATS_DEFAULTS = {
  player: {
    fuerza: 12, destreza: 8, inteligencia: 4, fama: 0,
    saludMax: 100, manaMax: 20, resistenciaMax: 80,
    corrupcion: 0, velocidad: 3.0,
  },
};

const SKILLS = [
  { id: 'esgrima', name: 'Esgrima', icon: 'S', category: 'combat', xpPerUse: 5, xpThreshold: 50 },
  { id: 'tactica', name: 'Táctica', icon: 'T', category: 'combat', xpPerUse: 3, xpThreshold: 40 },
  { id: 'anatomia', name: 'Anatomía', icon: 'A', category: 'knowledge', xpPerUse: 4, xpThreshold: 35 },
  { id: 'curacion', name: 'Curación', icon: 'C', category: 'survival', xpPerUse: 6, xpThreshold: 45 },
  { id: 'parada', name: 'Parada', icon: 'P', category: 'combat', xpPerUse: 8, xpThreshold: 60 },
  { id: 'supervivencia', name: 'Supervivencia', icon: 'V', category: 'survival', xpPerUse: 3, xpThreshold: 35 },
  { id: 'negociacion', name: 'Negociación', icon: 'N', category: 'social', xpPerUse: 5, xpThreshold: 40 },
  { id: 'herboristeria', name: 'Herboristería', icon: 'H', category: 'survival', xpPerUse: 4, xpThreshold: 35 },
];

const ENEMY_TYPES = {
  jabali_maldito: { name: 'Jabalí Maldito', salud: 40, daño: 8, velocidad: 1.8, tipoDaño: 'impacto', xp: 15, color: COLORS.ENEMY_JABALI, size: 18 },
  conejo_maldito: { name: 'Conejo Maldito', salud: 15, daño: 5, velocidad: 3.0, tipoDaño: 'corte', xp: 8, color: COLORS.ENEMY_CONEJO, size: 10 },
  goblin: { name: 'Goblin', salud: 30, daño: 10, velocidad: 3.8, tipoDaño: 'corte', xp: 20, color: COLORS.ENEMY_GOBLIN, size: 14 },
  bandido: { name: 'Bandido', salud: 50, daño: 12, velocidad: 2.5, tipoDaño: 'corte', xp: 25, color: COLORS.ENEMY_BANDIDO, size: 16 },
  lobo_corrupto: { name: 'Lobo Corrupto', salud: 35, daño: 10, velocidad: 3.2, tipoDaño: 'perforacion', xp: 18, color: '#556622', size: 16 },
  goblin_arquero: { name: 'Goblin Arquero', salud: 25, daño: 8, velocidad: 2.0, tipoDaño: 'perforacion', xp: 22, color: COLORS.ENEMY_GOBLIN, size: 14, ranged: true },
  capita_bandido: { name: 'Capitán Bandido', salud: 120, daño: 18, velocidad: 2.2, tipoDaño: 'corte', xp: 60, color: COLORS.ENEMY_BOSS, size: 22, boss: true },
  jabali_alfa: { name: 'Jabalí Maldito Alfa', salud: 180, daño: 22, velocidad: 2.5, tipoDaño: 'impacto', xp: 80, color: COLORS.ENEMY_BOSS, size: 26, boss: true },
};

const ITEMS = {
  venda: { name: 'Venda', type: 'consumable', desc: 'Restaura 20 de salud', effect: { health: 20 }, value: 5 },
  hierba_moonstalk: { name: 'Moonstalk', type: 'consumable', desc: 'Cura veneno leve', effect: { curePoison: true }, value: 8 },
  pan: { name: 'Pan', type: 'consumable', desc: 'Restaura 10 de salud', effect: { health: 10 }, value: 3 },
  pocion_vital: { name: 'Poción Vital', type: 'consumable', desc: 'Restaura 40 de salud', effect: { health: 40 }, value: 15 },
  aceite_arma: { name: 'Aceite de Arma', type: 'consumable', desc: '+5 daño por 3 combates', effect: { damageBuff: 5 }, value: 12 },
  espada_hierro: { name: 'Espada de Hierro', type: 'weapon', slot: 'weapon', daño: 10, tipoDaño: 'corte', durabilidadMax: 50, value: 30 },
  escudo_madera: { name: 'Escudo de Madera', type: 'shield', slot: 'shield', defensa: 5, durabilidadMax: 40, value: 25 },
  armadura_cuero: { name: 'Armadura de Cuero', type: 'armor', slot: 'armor', defensa: 4, durabilidadMax: 45, value: 35 },
  hacha_grande: { name: 'Gran Hacha', type: 'weapon', slot: 'weapon', daño: 16, tipoDaño: 'impacto', durabilidadMax: 40, value: 50 },
};

const BIOMES = {
  frontera: { name: 'Frontera', color: COLORS.TERRAIN_GRASS, enemyPool: ['jabali_maldito', 'conejo_maldito', 'lobo_corrupto'], boss: 'jabali_alfa' },
  camino_valdrenot: { name: 'Camino a Valdrenot', color: COLORS.TERRAIN_DIRT, enemyPool: ['goblin', 'bandido', 'goblin_arquero'], boss: 'capita_bandido' },
};

const NPC_DEFS = {
  comerciante_errante: { name: 'Comerciante Errante', color: COLORS.NPC_MERCHANT, role: 'merchant', items: ['venda', 'pan', 'pocion_vital', 'aceite_arma'] },
  thorpe: { name: 'Thorpe (Alcalde)', color: COLORS.NPC_QUEST, role: 'quest', mission: 'recoleccion_hierbas' },
  brand: { name: 'Brand', color: COLORS.NPC_ALLY, role: 'trainer', trains: 'esgrima' },
  garrick: { name: 'Garrick (Herrero)', color: COLORS.NPC_ALLY, role: 'blacksmith' },
  aldous: { name: 'Aldous (Posadero)', color: COLORS.NPC_ALLY, role: 'innkeeper' },
  elara: { name: 'Elara (Herborista)', color: COLORS.NPC_ALLY, role: 'herbalist' },
};

const MISSION_TEMPLATES = {
  recoleccion_hierbas: { name: 'Recolector de Hierbas', giver: 'thorpe', type: 'gather', target: 'hierarchy_moonstalk', count: 5, reward: { cobre: 20, xp: 30 } },
  escolta: { name: 'Escolta de Caravana', giver: 'aldous', type: 'escort', description: 'Protege la caravana de bandidos', reward: { cobre: 40, xp: 50, fama: 5 } },
};

export {
  GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, COLORS, STATS_DEFAULTS,
  SKILLS, ENEMY_TYPES, ITEMS, BIOMES, NPC_DEFS, MISSION_TEMPLATES,
};
