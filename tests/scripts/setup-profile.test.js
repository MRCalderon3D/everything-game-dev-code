#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const scriptPath = path.join(repoRoot, 'scripts', 'setup-profile.js');

assert.ok(fs.existsSync(scriptPath), 'scripts/setup-profile.js must exist.');
const source = fs.readFileSync(scriptPath, 'utf8');

const expectedMarkers = [
  'profile-resolution',
  'active_profile',
  'profile.json',
  'profile',
];

for (const marker of expectedMarkers) {
  assert.ok(
    source.includes(marker),
    `scripts/setup-profile.js should reference '${marker}' as part of the profile setup contract.`
  );
}

console.log('PASS scripts/setup-profile.test.js');
