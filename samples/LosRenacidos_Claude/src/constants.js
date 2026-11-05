export const CANVAS = { width: 960, height: 600 };

export const ROOM = {
  width: 720,
  height: 540,
  originX: 120,
  originY: 30,
};

export const PLAYER = {
  radius: 11,
  speed: 150,
  dashSpeed: 360,
  dashDuration: 0.32,
  dashIFrames: 0.28,
  attackWindup: 0.06,
  attackActive: 0.13,
  attackRecover: 0.18,
  attackRange: 30,
  attackArc: Math.PI * 0.55,
  blockArc: Math.PI * 0.7,
  parryWindow: 0.18,
  baseAttackDmg: 8,
  baseSaludMax: 30,
  baseManaMax: 10,
  baseResMax: 100,
  resRegen: 28,
  resRegenBlock: 8,
  resAttackCost: 16,
  resDashCost: 22,
  resBlockDrain: 28,
};

export const COLORS = {
  bg: '#0a0f17',
  floor: '#1d2535',
  floorAlt: '#1a2030',
  wall: '#3c2a1a',
  wallHi: '#5b4226',
  pellet: '#d6c79a',
  fg: '#d6c79a',
  gold: '#f5c66b',
  azure: '#7ec8ff',
  corruption: '#74e07a',
  danger: '#c0392b',
  player: '#f5c66b',
  playerArmor: '#a8753a',
  playerSword: '#dfe7f5',
  blockShield: '#7ec8ff',
  parry: '#ffffff',
  bandit: '#9a4f48',
  goblin: '#7da94b',
  boar: '#7d4b3f',
  boarAlpha: '#a83a2c',
  rabbit: '#b07a8e',
  npc: '#d6c79a',
  npcAccent: '#f5c66b',
  dialog: '#0e1422',
  dialogBorder: '#f5c66b',
  hpFill: '#c0392b',
  hpEmpty: '#3a1a18',
  manaFill: '#7ec8ff',
  resFill: '#dfe7f5',
};

export const SKILLS = [
  { id: 'esgrima', name: 'Esgrima', desc: 'Ataques cuerpo a cuerpo.' },
  { id: 'parada', name: 'Parada', desc: 'Bloqueos y paradas perfectas.' },
  { id: 'tactica', name: 'Táctica', desc: 'Esquivas precisas y posicionamiento.' },
  { id: 'supervivencia', name: 'Supervivencia', desc: 'Tiempo en la frontera.' },
  { id: 'anatomia', name: 'Anatomía', desc: 'Golpes críticos y puntos débiles.' },
  { id: 'curacion', name: 'Curación', desc: 'Vendar heridas, pociones.' },
  { id: 'meditacion', name: 'Meditación', desc: 'Recuperación de mana.' },
  { id: 'negociacion', name: 'Negociación', desc: 'Precios y diálogos.' },
];

export const SKILL_XP_CURVE = (level) => 8 + level * 4;

export const STORAGE_KEY = 'los-renacidos-claude/save/v1';

export const SYSTEM_PREFIX = {
  gain: '[SISTEMA]',
  alert: '[ALERTA]',
  quest: '[MISIÓN]',
  archive: '[ARCHIVO]',
  warn: '[CORRUPCIÓN]',
};
