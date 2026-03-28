#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const schemaDir = path.join(repoRoot, 'schemas');
const manifestDir = path.join(repoRoot, 'manifests');

const schemaFiles = [
  'install-components.schema.json',
  'install-modules.schema.json',
  'install-profiles.schema.json',
  'hooks.schema.json',
];

const manifestFiles = [
  'install-components.json',
  'install-modules.json',
  'install-profiles.json',
];

for (const file of schemaFiles) {
  const full = path.join(schemaDir, file);
  assert.ok(fs.existsSync(full), `Missing schema file '${file}'.`);
  const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
  assert.strictEqual(typeof parsed, 'object', `Schema '${file}' must parse to an object.`);
  assert.ok(parsed.$schema, `Schema '${file}' should declare a $schema.`);
  assert.ok(parsed.type, `Schema '${file}' should declare a top-level type.`);
}

for (const file of manifestFiles) {
  const full = path.join(manifestDir, file);
  assert.ok(fs.existsSync(full), `Missing manifest file '${file}'.`);
  const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
  assert.strictEqual(typeof parsed, 'object', `Manifest '${file}' must parse to an object.`);
  assert.strictEqual(typeof parsed.version, 'number', `Manifest '${file}' must declare a numeric version.`);
}

console.log('PASS schemas/manifests-schema.test.js');
