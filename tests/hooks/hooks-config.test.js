#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const hooksPath = path.join(repoRoot, 'hooks', 'hooks.json');

assert.ok(fs.existsSync(hooksPath), 'hooks/hooks.json must exist.');
const config = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

assert.ok(config && typeof config === 'object', 'hooks config must be an object.');
assert.ok(config.hooks && typeof config.hooks === 'object', 'hooks config must contain a hooks object.');

const allowedPhases = new Set(['PreToolUse', 'PostToolUse', 'Stop', 'SessionStart', 'SessionEnd']);
for (const [phase, entries] of Object.entries(config.hooks)) {
  assert.ok(allowedPhases.has(phase), `Unexpected hook phase '${phase}'.`);
  assert.ok(Array.isArray(entries), `hooks.${phase} must be an array.`);
  for (const [index, entry] of entries.entries()) {
    assert.ok(entry && typeof entry === 'object', `hooks.${phase}[${index}] must be an object.`);
    assert.strictEqual(typeof entry.matcher, 'string', `hooks.${phase}[${index}].matcher must be a string.`);
    assert.ok(entry.matcher.length > 0, `hooks.${phase}[${index}].matcher must not be empty.`);
    assert.strictEqual(typeof entry.description, 'string', `hooks.${phase}[${index}].description must be a string.`);
    assert.ok(entry.description.length > 0, `hooks.${phase}[${index}].description must not be empty.`);
  }
}

console.log('PASS hooks/hooks-config.test.js');
