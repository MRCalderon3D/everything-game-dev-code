#!/usr/bin/env node
// Regenerates per-harness hook wiring from hooks/hooks.json.
// - .claude/settings.json: replaces only the "hooks" key, preserving any
//   other settings in the file.
// - .cursor/hooks.json: fully generated.
// Run via `npm run sync:hook-wiring`; validate:hooks fails when the committed
// wiring drifts from what this script would produce.

const fs = require("fs");
const path = require("path");
const { buildClaudeHooks, buildCursorHooks } = require("./lib/hook-wiring");

const repoRoot = path.resolve(__dirname, "..");

function readJsonIfExists(relPath) {
  const fullPath = path.join(repoRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function writeJson(relPath, data) {
  const fullPath = path.join(repoRoot, relPath);
  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

const hooksConfig = readJsonIfExists("hooks/hooks.json");

const claudeSettings = readJsonIfExists(".claude/settings.json");
claudeSettings.hooks = buildClaudeHooks(hooksConfig);
writeJson(".claude/settings.json", claudeSettings);

writeJson(".cursor/hooks.json", buildCursorHooks(hooksConfig));

const phaseCount = Object.keys(hooksConfig.hooks || {}).length;
const entryCount = Object.values(hooksConfig.hooks || {}).reduce(
  (sum, entries) => sum + entries.length,
  0
);
console.log(
  `PASS sync:hook-wiring (${entryCount} hooks across ${phaseCount} phases -> .claude/settings.json, .cursor/hooks.json)`
);
