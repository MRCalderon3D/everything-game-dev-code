#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { validateAgainstSchema } = require('../../scripts/lib/schema-validation');

const repoRoot = path.resolve(__dirname, '..', '..');
const hooksPath = path.join(repoRoot, 'hooks', 'hooks.json');

assert.ok(fs.existsSync(hooksPath), 'hooks/hooks.json must exist.');
const config = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

// Shape rules live only in schemas/hooks.schema.json — enforced here via ajv.
// This test adds the cross-field rules a schema cannot express.
const schemaErrors = validateAgainstSchema('schemas/hooks.schema.json', config);
assert.deepStrictEqual(
  schemaErrors,
  [],
  `hooks/hooks.json violates its schema: ${schemaErrors.join('; ')}`
);

const seenIds = new Set();
for (const entries of Object.values(config.hooks)) {
  for (const entry of entries) {
    assert.ok(!seenIds.has(entry.id), `Duplicate hook id '${entry.id}'.`);
    seenIds.add(entry.id);
    if (entry.script) {
      const scriptPath = path.resolve(repoRoot, 'hooks', entry.script);
      assert.ok(
        fs.existsSync(scriptPath),
        `Hook '${entry.id}' script points to missing file '${entry.script}'.`
      );
    }
  }
}

console.log('PASS hooks/hooks-config.test.js');
