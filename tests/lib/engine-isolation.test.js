#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const modulesPath = path.join(repoRoot, 'manifests', 'install-modules.json');
const profilesPath = path.join(repoRoot, 'manifests', 'install-profiles.json');
const componentsPath = path.join(repoRoot, 'manifests', 'install-components.json');

for (const p of [modulesPath, profilesPath, componentsPath]) {
  assert.ok(fs.existsSync(p), `Required manifest missing: ${path.relative(repoRoot, p)}`);
}

const modulesDoc = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
const profilesDoc = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
const componentsDoc = JSON.parse(fs.readFileSync(componentsPath, 'utf8'));

const modules = modulesDoc.modules || {};
const components = new Map((componentsDoc.components || []).map(c => [c.id, c]));

// Engine list derives from the registry so new engine layers are covered
// automatically (see manifests/engines.json).
const { engineIds } = require('../../scripts/lib/engines');
const engineModulePrefixes = Object.fromEntries(
  engineIds().map(id => [
    `engine:${id}`,
    [`rules/${id}/`, `skills/${id}/`, `agents/${id}-`, `commands/${id}-`],
  ])
);

for (const [componentId, prefixes] of Object.entries(engineModulePrefixes)) {
  const component = components.get(componentId);
  assert.ok(component, `Missing engine component '${componentId}'.`);
  for (const moduleId of component.modules || []) {
    const moduleEntry = modules[moduleId];
    const globs = Array.isArray(moduleEntry) ? moduleEntry : (moduleEntry && moduleEntry.includes) || [];
    assert.ok(Array.isArray(globs), `Module '${moduleId}' must map to an array of globs.`);
    for (const glob of globs) {
      const matchesOwnEngine = prefixes.some(prefix => glob.includes(prefix));
      const matchesOtherEngine = Object.entries(engineModulePrefixes)
        .filter(([id]) => id !== componentId)
        .some(([, otherPrefixes]) => otherPrefixes.some(prefix => glob.includes(prefix)));

      assert.ok(
        !matchesOtherEngine,
        `Module '${moduleId}' for '${componentId}' includes another engine path: ${glob}`
      );

      if (glob.includes('rules/') || glob.includes('skills/') || glob.includes('agents/') || glob.includes('commands/')) {
        assert.ok(
          matchesOwnEngine || !engineIds().some(id => glob.includes(`${id}/`)),
          `Module '${moduleId}' includes unexpected engine-scoped path: ${glob}`
        );
      }
    }
  }
}

for (const profile of profilesDoc.profiles || []) {
  const engineComponents = (profile.components || []).filter(id => id.startsWith('engine:'));
  assert.ok(engineComponents.length <= 1, `Profile '${profile.id}' breaks engine isolation.`);
}

console.log('PASS lib/engine-isolation.test.js');
