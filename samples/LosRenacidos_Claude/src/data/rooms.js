function wall(x, y, w, h) { return { x, y, w, h }; }

export const ROOM_TEMPLATES = {
  claroBosque: {
    name: 'Claro del Bosque',
    flavor: 'Un claro hÃºmedo. La maleza huele a corrupciÃ³n.',
    walls: [
      wall(140, 110, 80, 22),
      wall(560, 130, 90, 18),
      wall(420, 260, 60, 60),
      wall(220, 420, 100, 22),
      wall(620, 400, 60, 60),
    ],
    spawns: [
      { type: 'conejo', x: 260, y: 200 },
      { type: 'conejo', x: 600, y: 220 },
      { type: 'conejo', x: 700, y: 380 },
    ],
    herbDrops: 1,
  },
  emboscadaBandidos: {
    name: 'Emboscada en el Camino',
    flavor: 'PolladelluviayhuelladelcaballodeAldric.',
    walls: [
      wall(200, 80, 380, 20),
      wall(200, 80, 20, 120),
      wall(560, 80, 20, 120),
      wall(140, 360, 380, 20),
      wall(620, 360, 220, 20),
    ],
    spawns: [
      { type: 'bandido', x: 320, y: 260 },
      { type: 'bandido', x: 540, y: 280 },
      { type: 'goblin', x: 480, y: 460 },
    ],
    isQuest: 'escolta',
    fameReward: 3,
  },
  campamentoGoblins: {
    name: 'Campamento Goblin',
    flavor: 'Fogatas apagadas y huesos roÃ­dos.',
    walls: [
      wall(180, 180, 60, 60),
      wall(620, 180, 60, 60),
      wall(180, 380, 60, 60),
      wall(620, 380, 60, 60),
      wall(400, 280, 80, 40),
    ],
    spawns: [
      { type: 'goblin', x: 300, y: 200 },
      { type: 'goblin', x: 580, y: 200 },
      { type: 'goblin', x: 300, y: 440 },
      { type: 'goblin', x: 580, y: 440 },
    ],
  },
  senderoJabalies: {
    name: 'Sendero de los Jabalíes',
    flavor: 'Huellas profundas, gruÃ±idos en la espesura.',
    walls: [
      wall(140, 200, 40, 200),
      wall(800, 200, 40, 200),
      wall(440, 100, 40, 80),
      wall(440, 420, 40, 80),
    ],
    spawns: [
      { type: 'jabali', x: 320, y: 200 },
      { type: 'jabali', x: 660, y: 420 },
    ],
    herbDrops: 1,
  },
  arenaAlfa: {
    name: 'Cubil del Alfa',
    flavor: 'La criatura mas vieja del bosque te espera.',
    walls: [
      wall(120, 60, 720, 18),
      wall(120, 540, 720, 18),
      wall(120, 60, 18, 480),
      wall(820, 60, 18, 480),
      wall(280, 280, 60, 60),
      wall(620, 280, 60, 60),
    ],
    spawns: [
      { type: 'jabaliAlfa', x: 480, y: 300 },
    ],
    isBossRoom: true,
  },
};

export const NODE_TYPES = {
  combat: { label: 'Combate', icon: 'x' },
  elite: { label: 'Élite', icon: '!' },
  rest: { label: 'Descanso', icon: '+' },
  event: { label: 'Evento', icon: '?' },
  boss: { label: 'Jefe', icon: '#' },
};
