#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const readmePath = path.join(repoRoot, 'README.md');

assert.ok(fs.existsSync(readmePath), 'README.md must exist at repository root.');
const readme = fs.readFileSync(readmePath, 'utf8');

const expectedSections = [
  '# Everything Game Dev Code',
  'agents/',
  'skills/',
  'commands/',
  'rules/',
  'docs/templates/',
  'docs/orchestration/',
  'manifests/',
  'schemas/',
];

for (const needle of expectedSections) {
  assert.ok(
    readme.includes(needle),
    `README.md should mention or document '${needle}'.`
  );
}

console.log('PASS ci/readme.test.js');
