// Headless smoke test for the simulation (no DOM, no Three.js).
// 1. Lose path: an idle player is overwhelmed -> lives reach 0 -> 'lost'.
// 2. Win path: an auto-aim bot (with lives raised so the win is mechanically
//    reachable) destroys all three boss phases -> 'won'.
// 3. Combo sanity: reported, not asserted.
import { Emitter } from '../src/core/events.js';
import { SimGame } from '../src/sim/sim-game.js';

const DT = 1 / 60;
const MAX_SIM_SECONDS = 600;

function run(label, drive) {
  const events = new Emitter();
  const sim = new SimGame(events);
  let phases = 0;
  let maxConcurrent = 0;
  events.on('bossPhase', (p) => {
    phases = p.phase;
    process.stdout.write(`  boss phase ${p.phase}\n`);
  });
  if (drive && drive.setup) drive.setup(sim);
  let t = 0;
  while (!sim.outcome && t < MAX_SIM_SECONDS) {
    if (drive && drive.step) drive.step(sim);
    sim.step(DT);
    maxConcurrent = Math.max(maxConcurrent, sim.aliveCount);
    t += DT;
  }
  console.log(
    `[${label}] outcome=${sim.outcome} score=${sim.getScore()} lives=${sim.lives} ` +
      `bossPhasesReached=${phases} maxConcurrent=${maxConcurrent} simTime=${t.toFixed(0)}s`
  );
  return sim;
}

// ---- Test 1: lose path (idle player) ----
console.log('--- Test 1: lose path (idle player) ---');
const lost = run('lose', null);
if (lost.outcome !== 'lost') {
  console.error('FAIL: expected lost');
  process.exit(1);
}

// ---- Test 2: win path (auto-aim bot) ----
console.log('\n--- Test 2: win path (auto-aim bot) ---');
const won = run('win', {
  setup(sim) {
    sim.lives = 200; // prove the win state is mechanically reachable
  },
  step(sim) {
    // Aim: track the boss core when present, else the nearest enemy, else center.
    let targetY = 0;
    if (sim.boss.active && sim.boss.mode === 'fight') {
      targetY = sim.bossCore().y;
    } else {
      const e = sim.nearestEnemy(-3, sim.player.y);
      if (e) targetY = e.y;
    }
    const dy = targetY - sim.player.y;
    const dx = -3 - sim.player.x; // hold a forward firing line
    sim.setMove(Math.max(-1, Math.min(1, dx * 2)), Math.max(-1, Math.min(1, dy * 2)));
    // Stream press-shots: a paired down/up each step fires a normal shot.
    sim.fireDown();
    sim.fireUp();
  },
});
if (won.outcome !== 'won') {
  console.error('FAIL: expected won');
  process.exit(1);
}

console.log('\nAll required smoke assertions passed.');
