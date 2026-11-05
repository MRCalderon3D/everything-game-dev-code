// Headless smoke test for the simulation (no DOM, no Three.js).
// 1. Lose path: no towers -> lives reach 0 -> 'lost'.
// 2. Win path: scripted build-out -> wave 10 cleared -> 'won'.
// 3. Economy sanity: a realistic budget-constrained bot, reported (not asserted).
import { Emitter } from '../src/core/events.js';
import { SimGame } from '../src/sim/sim-game.js';
import { TOWER_TYPES, BOARD_SIZE } from '../src/sim/config.js';

const DT = 1 / 60;
const MAX_SIM_SECONDS = 1200;

function run(label, configure, perStep) {
  const events = new Emitter();
  const sim = new SimGame(events);
  let maxConcurrent = 0;
  events.on('waveStart', (n) => process.stdout.write(`  wave ${n}...`));
  events.on('waveClear', () => process.stdout.write(' clear\n'));
  if (configure) configure(sim);
  let t = 0;
  while (!sim.outcome && t < MAX_SIM_SECONDS) {
    sim.forceNextWave(); // skip countdowns to keep the test fast
    sim.step(DT);
    if (perStep) perStep(sim);
    maxConcurrent = Math.max(maxConcurrent, sim.aliveCount);
    t += DT;
  }
  console.log(
    `\n[${label}] outcome=${sim.outcome} waves=${sim.wavesCleared} lives=${sim.lives} gold=${sim.gold} score=${sim.getScore()} maxConcurrent=${maxConcurrent} simTime=${t.toFixed(0)}s`
  );
  return sim;
}

// Tiles adjacent to the path, best build spots first (precomputed greedy list).
function buildSpots(sim) {
  const spots = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!sim.canBuildAt(col, row)) continue;
      // Count path tiles within range ~2.5 as a coverage heuristic.
      let coverage = 0;
      for (const key of sim.path.tiles) {
        const [pc, pr] = key.split(',').map(Number);
        if ((pc - col) ** 2 + (pr - row) ** 2 <= 2.5 ** 2) coverage++;
      }
      if (coverage > 0) spots.push({ col, row, coverage });
    }
  }
  spots.sort((a, b) => b.coverage - a.coverage);
  return spots;
}

console.log('--- Test 1: lose path (no towers) ---');
const lost = run('lose', null, null);
if (lost.outcome !== 'lost') {
  console.error('FAIL: expected lost');
  process.exit(1);
}

console.log('\n--- Test 2: win path (funded build-out) ---');
const winSim = run(
  'win',
  (sim) => {
    sim.gold = 100000; // prove the win state is mechanically reachable
    const spots = buildSpots(sim);
    const order = ['cannon', 'frost', 'laser'];
    for (let i = 0; i < Math.min(24, spots.length); i++) {
      const ok = sim.buildTower(spots[i].col, spots[i].row, order[i % order.length]);
      if (ok && i % 2 === 0) sim.upgradeTower(sim.towers[sim.towers.length - 1]);
    }
    sim.gold = 120; // back to a realistic wallet for the run itself
    console.log(`  built ${sim.towers.length} towers`);
  },
  null
);
if (winSim.outcome !== 'won') {
  console.error('FAIL: expected won');
  process.exit(1);
}

console.log('\n--- Test 3: economy-realistic greedy bot (informational) ---');
run(
  'bot',
  null,
  (sim) => {
    // Spend gold greedily (players can build mid-wave too): build on the best
    // free spot, upgrade when nothing affordable to build.
    const order = ['cannon', 'cannon', 'frost', 'laser'];
    const spots = buildSpots(sim);
    if (spots.length > 0) {
      const type = order[sim.towers.length % order.length];
      if (sim.gold >= TOWER_TYPES[type].cost) {
        sim.buildTower(spots[0].col, spots[0].row, type);
        return;
      }
    }
    for (const t of sim.towers) {
      if (t.level === 0 && sim.gold >= TOWER_TYPES[t.type].upgradeCost) {
        sim.upgradeTower(t);
        return;
      }
    }
  }
);

console.log('\nAll required smoke assertions passed.');
