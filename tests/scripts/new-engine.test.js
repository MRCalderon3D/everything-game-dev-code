#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repoRoot, 'scripts', 'new-engine.js');

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

// Dry run plans the full file set without writing anything.
const probeId = 'dry-run-probe';
const dry = run([probeId, 'Dry Run Probe', '--dry-run']);
assert.strictEqual(dry.status, 0, `dry run failed: ${dry.stderr}`);
for (const expected of [
  `rules/${probeId}/README.md`,
  `rules/${probeId}/project-structure.md`,
  `skills/${probeId}/${probeId}-project-structure/SKILL.md`,
  `agents/${probeId}-reviewer.md`,
  `commands/${probeId}-setup.md`,
  `commands/${probeId}-scene-audit.md`,
  'manifests/engines.json',
  'docs/orchestration/command-agent-map.md',
  'docs/orchestration/agent-skill-matrix.md',
]) {
  assert.ok(dry.stdout.includes(expected), `dry run output missing '${expected}'.`);
}
assert.ok(!fs.existsSync(path.join(repoRoot, 'rules', probeId)), 'dry run must not create files.');

const registry = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'manifests', 'engines.json'), 'utf8')
);
assert.ok(
  !registry.engines.some(engine => engine.id === probeId),
  'dry run must not modify the engine registry.'
);

// Invalid ids and collisions are rejected.
assert.notStrictEqual(run(['Bad_Name', '--dry-run']).status, 0, 'non-kebab id must be rejected.');
assert.notStrictEqual(run([]).status, 0, 'missing id must be rejected.');
assert.notStrictEqual(run(['unity', '--dry-run']).status, 0, 'existing engine id must be rejected.');

console.log('PASS scripts/new-engine.test.js');
