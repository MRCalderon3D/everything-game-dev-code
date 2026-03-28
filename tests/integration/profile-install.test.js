#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const componentsPath = path.join(repoRoot, 'manifests', 'install-components.json');
const modulesPath = path.join(repoRoot, 'manifests', 'install-modules.json');
const profilesPath = path.join(repoRoot, 'manifests', 'install-profiles.json');

for (const p of [componentsPath, modulesPath, profilesPath]) {
  assert.ok(fs.existsSync(p), `Required manifest missing: ${path.relative(repoRoot, p)}`);
}

const componentsDoc = JSON.parse(fs.readFileSync(componentsPath, 'utf8'));
const modulesDoc = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
const profilesDoc = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

const components = new Map((componentsDoc.components || []).map(c => [c.id, c]));
const modules = modulesDoc.modules || {};
const profiles = profilesDoc.profiles || [];

assert.ok(components.size > 0, 'install-components.json must define components.');
assert.ok(Object.keys(modules).length > 0, 'install-modules.json must define modules.');
assert.ok(profiles.length > 0, 'install-profiles.json must define profiles.');

for (const component of components.values()) {
  assert.ok(Array.isArray(component.modules), `Component '${component.id}' must define a modules array.`);
  for (const moduleId of component.modules) {
    assert.ok(modules[moduleId], `Component '${component.id}' references unknown module '${moduleId}'.`);
  }
}

for (const profile of profiles) {
  assert.ok(profile.id && typeof profile.id === 'string', 'Profile must have a string id.');
  assert.ok(Array.isArray(profile.components), `Profile '${profile.id}' must define a components array.`);
  const seen = new Set();
  for (const componentId of profile.components) {
    assert.ok(!seen.has(componentId), `Profile '${profile.id}' contains duplicate component '${componentId}'.`);
    seen.add(componentId);
    assert.ok(components.has(componentId), `Profile '${profile.id}' references unknown component '${componentId}'.`);
  }

  const engineComponents = profile.components.filter(id => id.startsWith('engine:'));
  assert.ok(
    engineComponents.length <= 1,
    `Profile '${profile.id}' mixes multiple engine components: ${engineComponents.join(', ')}`
  );
}

console.log('PASS integration/profile-install.test.js');
