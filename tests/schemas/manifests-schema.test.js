#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const schemaDir = path.join(repoRoot, 'schemas');
const manifestDir = path.join(repoRoot, 'manifests');

const schemaFiles = [
  'hooks.schema.json',
  'install-components.schema.json',
  'install-state.schema.json',
  'install-modules.schema.json',
  'install-profiles.schema.json',
  'mcp-servers.schema.json',
  'package-manager.schema.json',
  'plugin.schema.json',
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

const schemaBackedDocuments = [
  {
    file: path.join(repoRoot, '.claude', 'package-manager.json'),
    expectedSchema: '../schemas/package-manager.schema.json',
  },
  {
    file: path.join(repoRoot, '.claude-plugin', 'plugin.json'),
    expectedSchema: '../schemas/plugin.schema.json',
  },
  {
    file: path.join(repoRoot, 'mcp-configs', 'mcp-servers.json'),
    expectedSchema: '../schemas/mcp-servers.schema.json',
  },
  {
    file: path.join(repoRoot, 'hooks', 'hooks.json'),
    expectedSchema: '../schemas/hooks.schema.json',
  },
  {
    file: path.join(repoRoot, 'manifests', 'install-components.json'),
    expectedSchema: '../schemas/install-components.schema.json',
  },
  {
    file: path.join(repoRoot, 'manifests', 'install-modules.json'),
    expectedSchema: '../schemas/install-modules.schema.json',
  },
  {
    file: path.join(repoRoot, 'manifests', 'install-profiles.json'),
    expectedSchema: '../schemas/install-profiles.schema.json',
  },
];

for (const { file, expectedSchema } of schemaBackedDocuments) {
  assert.ok(fs.existsSync(file), `Missing schema-backed document '${path.relative(repoRoot, file)}'.`);
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.strictEqual(typeof parsed, 'object', `${path.relative(repoRoot, file)} must parse to an object.`);
  assert.strictEqual(
    parsed.$schema,
    expectedSchema,
    `${path.relative(repoRoot, file)} should reference '${expectedSchema}'.`
  );
}

console.log('PASS schemas/manifests-schema.test.js');
