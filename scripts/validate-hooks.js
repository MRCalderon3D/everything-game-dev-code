#!/usr/bin/env node
const path = require("path");
const { exists, readJson, report, repoRoot } = require("./lib/validation");

const errors = [];

const hooksConfig = readJson("hooks/hooks.json");
const hooksSchema = readJson("schemas/hooks.schema.json");
const hooksDir = path.join(repoRoot, "hooks");

const allowedPhases = new Set(
  (((hooksSchema.properties || {}).hooks || {}).propertyNames || {}).enum || []
);

if (!exists("hooks/hooks.json")) {
  errors.push("Missing hooks/hooks.json.");
}
if (!exists("schemas/hooks.schema.json")) {
  errors.push("Missing schemas/hooks.schema.json.");
}

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
  if (!allowedPhases.has(phase)) {
    errors.push(`hooks/hooks.json uses unsupported phase '${phase}'.`);
  }
  if (!Array.isArray(entries) || entries.length === 0) {
    errors.push(`hooks.${phase} must be a non-empty array.`);
    continue;
  }
  for (const [index, entry] of entries.entries()) {
    const ref = `hooks.${phase}[${index}]`;
    if (!entry || typeof entry !== "object") {
      errors.push(`${ref} must be an object.`);
      continue;
    }
    if (typeof entry.matcher !== "string" || entry.matcher.trim() === "") {
      errors.push(`${ref}.matcher must be a non-empty string.`);
    }
    if (typeof entry.description !== "string" || entry.description.trim() === "") {
      errors.push(`${ref}.description must be a non-empty string.`);
    }
    if (!entry.command && !entry.script) {
      errors.push(`${ref} must define either command or script.`);
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

if (exists(".cursor/hooks.json")) {
  const cursorHooks = readJson(".cursor/hooks.json");
  for (const [phase, entries] of Object.entries(cursorHooks.hooks || {})) {
    if (!Array.isArray(entries)) {
      errors.push(`.cursor/hooks.json phase '${phase}' must be an array.`);
      continue;
    }
    for (const [index, entry] of entries.entries()) {
      if (!entry.command) {
        errors.push(`.cursor/hooks.json ${phase}[${index}] must define command.`);
        continue;
      }
      const match = String(entry.command).match(/^node\s+(.+)$/);
      if (!match) {
        continue;
      }
      const target = match[1].trim();
      if (!exists(target)) {
        errors.push(`.cursor/hooks.json references missing script '${target}'.`);
      }
    }
  }
}

report(errors, "PASS validate:hooks");
