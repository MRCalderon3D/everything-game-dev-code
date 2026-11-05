export const NPCS = [
  {
    id: 'thorpe',
    name: 'Alcalde Thorpe',
    color: '#f5c66b',
    x: 360, y: 230,
    role: 'quest',
    introLines: [
      'Renacido. Sí, ya sé que el Sistema os llama así.',
      'Minoc resiste a duras penas. Las hierbas de Elara escasean y los jabalíes se han vuelto malditos.',
      '¿Aceptas mi encargo? Tres ramos de Moonstalks de los claros del bosque. Te pagaré bien.',
    ],
    afterAccept: [
      'Cada Moonstalk que traigas alivia a un enfermo. No te demores.',
    ],
    onComplete: [
      'Has cumplido. Por Minoc y por Elara, gracias.',
      'El alfa está suelto. Si lo derrotas, no quedará jabalí maldito en kilómetros.',
    ],
    quest: {
      id: 'hierbas',
      title: 'Recolector de Hierbas',
      goal: 3,
      reward: { cobre: 30, fama: 2, eco: 'minocAmigo' },
    },
  },
  {
    id: 'garrett',
    name: 'Herrero Garrett',
    color: '#dfe7f5',
    x: 600, y: 330,
    role: 'shop',
    introLines: [
      'Hierro afilado. Para esos jabalíes necesitas algo mejor que un palo.',
      'Te ofrezco un filo afilado. Cuesta 20 de cobre y subirás tu Esgrima en cada combate.',
    ],
    afterShop: [
      'Cuídala bien. El acero hay que respetarlo.',
    ],
    shop: {
      id: 'filoAfilado',
      label: 'Filo Afilado (+2 daño base)',
      cost: 20,
      grant: { upgrade: 'filoAfilado' },
    },
  },
  {
    id: 'elara',
    name: 'Herborista Elara',
    color: '#74e07a',
    x: 200, y: 410,
    role: 'shop',
    introLines: [
      'Las hierbas saben quién las arranca. No mancilles los claros.',
      'Una poción de salud por 10 de cobre. Solo me queda una.',
    ],
    afterShop: [
      'Bebe solo si lo necesitas. No es magia, es prudencia.',
    ],
    shop: {
      id: 'pocion',
      label: 'Poción de Salud (+15 PV en run)',
      cost: 10,
      grant: { consume: 'pocion' },
    },
  },
  {
    id: 'aldous',
    name: 'Posadero Aldous',
    color: '#f5c66b',
    x: 760, y: 200,
    role: 'rest',
    introLines: [
      'Renacido, descansa. Aquí el Sistema no canta tanto.',
      '¿Quieres descansar? Restaura PV y resistencia. Cuesta 5 de cobre.',
    ],
    afterRest: [
      'Buen sueño es media batalla.',
    ],
    shop: {
      id: 'descanso',
      label: 'Descansar (+PV, +Resistencia, +Meditación)',
      cost: 5,
      grant: { rest: true },
    },
  },
  {
    id: 'brand',
    name: 'Brand',
    color: '#d6c79a',
    x: 480, y: 480,
    role: 'archive',
    introLines: [
      'Renacido. Entrena conmigo cuando vuelvas y aprende lo que el Sistema no escribe.',
      'Aquí puedes consultar el Archivo de Ecos. Cada hito que cumples queda registrado y te fortalece.',
    ],
    afterArchive: [
      'No olvides lo que has aprendido. La próxima incursión empieza con ello.',
    ],
  },
];
