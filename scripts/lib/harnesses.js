#!/usr/bin/env node
// Loads the harness adapter registry (manifests/harnesses.json), the single
// source of truth for which harness adapters exist and what each supports.
// Mirrors lib/engines.js for the engine layer registry.

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const registryPath = path.join(repoRoot, "manifests", "harnesses.json");

let cachedHarnesses = null;

function loadHarnesses() {
  if (!cachedHarnesses) {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    cachedHarnesses = registry.harnesses || [];
  }
  return cachedHarnesses;
}

function harnessIds() {
  return loadHarnesses().map((harness) => harness.id);
}

module.exports = {
  harnessIds,
  loadHarnesses,
  registryPath,
};
