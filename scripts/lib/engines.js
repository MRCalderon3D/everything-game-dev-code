#!/usr/bin/env node
// Loads the engine layer registry (manifests/engines.json), the single source
// of truth for which engine layers exist. Registry array order is the path
// detection priority (most specific markers first).

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const registryPath = path.join(repoRoot, "manifests", "engines.json");

let cachedEngines = null;

function loadEngines() {
  if (!cachedEngines) {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    cachedEngines = registry.engines || [];
  }
  return cachedEngines;
}

function engineIds() {
  return loadEngines().map((engine) => engine.id);
}

module.exports = {
  engineIds,
  loadEngines,
  registryPath,
};
