#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Tests are discovered, not listed: any tests/**/*.test.js runs automatically.
function discoverTests(dir) {
  const tests = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      tests.push(...discoverTests(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.test.js')) {
      tests.push(fullPath);
    }
  }
  return tests.sort();
}

const tests = discoverTests(__dirname);

if (tests.length === 0) {
  console.error('No test files found under tests/.');
  process.exit(1);
}

let failed = 0;
for (const abs of tests) {
  const result = spawnSync(process.execPath, [abs], { stdio: 'inherit' });
  if (result.status !== 0) {
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} test file(s) failed.`);
  process.exit(1);
}

console.log('\nAll test files passed.');
