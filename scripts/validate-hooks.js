#!/usr/bin/env node
const path = require("path");
const { exists, readJson, report, repoRoot } = require("./lib/validation");
const { buildClaudeHooks, buildCursorHooks } = require("./lib/hook-wiring");

const errors = [];

if (!exists("hooks/hooks.json")) {
  errors.push("Missing hooks/hooks.json.");
  report(errors, "PASS validate:hooks");
}

const hooksConfig = readJson("hooks/hooks.json");
const hooksDir = path.join(repoRoot, "hooks");

// Structural shape rules live in schemas/hooks.schema.json and are enforced
// by validate:schemas (ajv). This script covers what a schema cannot express:
// unique ids, script files existing on disk, and generated harness wiring
// staying in sync with the source of truth.

const schemaRef = hooksConfig.$schema;
if (typeof schemaRef !== "string" || schemaRef.trim() === "") {
  errors.push("hooks/hooks.json must declare a $schema reference.");
} else {
  const schemaPath = path.resolve(hooksDir, schemaRef);
  if (!exists(path.relative(repoRoot, schemaPath))) {
    errors.push(`hooks/hooks.json references missing schema '${schemaRef}'.`);
  }
}

const seenIds = new Set();
for (const [phase, entries] of Object.entries(hooksConfig.hooks || {})) {
  for (const [index, entry] of (entries || []).entries()) {
    const ref = `hooks.${phase}[${index}]`;
    if (!entry || typeof entry !== "object") {
      errors.push(`${ref} must be an object.`);
      continue;
    }
    if (entry.id) {
      if (seenIds.has(entry.id)) {
        errors.push(`Duplicate hook id '${entry.id}'.`);
      }
      seenIds.add(entry.id);
    }
    if (entry.script) {
      const scriptPath = path.resolve(hooksDir, entry.script);
      if (!exists(path.relative(repoRoot, scriptPath))) {
        errors.push(`${ref}.script points to missing file '${entry.script}'.`);
      }
    }
  }
}

// Harness wiring is generated from hooks/hooks.json; committed wiring must
// match exactly what the generator would produce.
if (!exists(".cursor/hooks.json")) {
  errors.push("Missing .cursor/hooks.json. Run 'npm run sync:hook-wiring'.");
} else {
  const actualCursor = readJson(".cursor/hooks.json");
  const expectedCursor = buildCursorHooks(hooksConfig);
  if (JSON.stringify(actualCursor) !== JSON.stringify(expectedCursor)) {
    errors.push(
      ".cursor/hooks.json is out of sync with hooks/hooks.json. Run 'npm run sync:hook-wiring'."
    );
  }
}

if (!exists(".claude/settings.json")) {
  errors.push("Missing .claude/settings.json. Run 'npm run sync:hook-wiring'.");
} else {
  const claudeSettings = readJson(".claude/settings.json");
  const expectedClaudeHooks = buildClaudeHooks(hooksConfig);
  if (JSON.stringify(claudeSettings.hooks) !== JSON.stringify(expectedClaudeHooks)) {
    errors.push(
      ".claude/settings.json hooks block is out of sync with hooks/hooks.json. Run 'npm run sync:hook-wiring'."
    );
  }
}

report(errors, "PASS validate:hooks");
