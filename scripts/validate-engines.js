#!/usr/bin/env node
// Validates the structural contract of every engine layer declared in
// manifests/engines.json (the registry that scripts, tests, and hooks derive
// engine lists from). Each engine must ship its rules layer, skill pack,
// reviewer agent, core commands, and manifest entries — and every
// engine-shaped directory or manifest entry must be declared in the registry.

const fs = require("fs");
const path = require("path");
const { report, repoRoot } = require("./lib/validation");
const { loadEngines, engineIds } = require("./lib/engines");

const errors = [];
const engines = loadEngines();
const ids = engineIds();

if (new Set(ids).size !== ids.length) {
  errors.push("manifests/engines.json contains duplicate engine ids.");
}

const components = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "manifests", "install-components.json"), "utf8")
).components || [];
const componentIds = new Set(components.map((component) => component.id));

const modulesDoc = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "manifests", "install-modules.json"), "utf8")
);
const modules = modulesDoc.modules || {};
const rulesCoreGlobs = (modules["rules-core"] && modules["rules-core"].includes) || [];

const profiles = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "manifests", "install-profiles.json"), "utf8")
).profiles || [];

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

for (const engine of engines) {
  const id = engine.id;

  if (!exists(`rules/${id}/README.md`)) {
    errors.push(`Engine '${id}' is missing rules/${id}/README.md.`);
  }

  const skillsDir = path.join(repoRoot, "skills", id);
  const hasSkills =
    fs.existsSync(skillsDir) &&
    fs.readdirSync(skillsDir).some((entry) =>
      fs.existsSync(path.join(skillsDir, entry, "SKILL.md"))
    );
  if (!hasSkills) {
    errors.push(`Engine '${id}' is missing a skills/${id}/ pack with at least one SKILL.md.`);
  }

  if (!exists(`agents/${id}-reviewer.md`)) {
    errors.push(`Engine '${id}' is missing agents/${id}-reviewer.md.`);
  }
  if (engine.buildResolverAgent && !exists(`agents/${id}-build-resolver.md`)) {
    errors.push(`Engine '${id}' declares buildResolverAgent but agents/${id}-build-resolver.md is missing.`);
  }

  for (const command of [`${id}-setup`, `${id}-review`, `${id}-build-fix`]) {
    if (!exists(`commands/${command}.md`)) {
      errors.push(`Engine '${id}' is missing commands/${command}.md.`);
    }
  }

  if (!componentIds.has(`engine:${id}`)) {
    errors.push(`install-components.json is missing component 'engine:${id}'.`);
  }
  if (!modules[`engine-${id}`]) {
    errors.push(`install-modules.json is missing module 'engine-${id}'.`);
  }
  if (!rulesCoreGlobs.some((glob) => glob.includes(`rules/${id}/`))) {
    errors.push(`install-modules.json 'rules-core' does not include rules/${id}/.`);
  }
  if (!profiles.some((profile) => (profile.components || []).includes(`engine:${id}`))) {
    errors.push(`install-profiles.json has no profile using component 'engine:${id}'.`);
  }
}

// Reverse direction: nothing engine-shaped may exist outside the registry.
const idSet = new Set(ids);
for (const entry of fs.readdirSync(path.join(repoRoot, "rules"))) {
  if (entry === "common" || entry === "README.md") {
    continue;
  }
  if (!idSet.has(entry)) {
    errors.push(`rules/${entry}/ exists but '${entry}' is not declared in manifests/engines.json.`);
  }
}
for (const component of components) {
  if (component.id.startsWith("engine:") && !idSet.has(component.id.slice("engine:".length))) {
    errors.push(`Component '${component.id}' is not declared in manifests/engines.json.`);
  }
}

report(errors, `PASS validate:engines (${ids.length} engine layers verified)`);
