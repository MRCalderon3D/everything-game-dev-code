#!/usr/bin/env node
const path = require("path");
const {
  exists,
  firstPathSegment,
  readJson,
  repoRoot,
  report,
} = require("./lib/validation");

const errors = [];

const schemaFiles = [
  "schemas/install-components.schema.json",
  "schemas/install-modules.schema.json",
  "schemas/install-profiles.schema.json",
];

for (const relPath of schemaFiles) {
  if (!exists(relPath)) {
    errors.push(`Missing schema file '${relPath}'.`);
  }
}

const componentsDoc = readJson("manifests/install-components.json");
const modulesDoc = readJson("manifests/install-modules.json");
const profilesDoc = readJson("manifests/install-profiles.json");

for (const [name, doc] of Object.entries({
  "install-components.json": componentsDoc,
  "install-modules.json": modulesDoc,
  "install-profiles.json": profilesDoc,
})) {
  if (typeof doc.version !== "number") {
    errors.push(`${name} must declare a numeric version.`);
  }
  if (typeof doc.description !== "string" || doc.description.trim() === "") {
    errors.push(`${name} must declare a non-empty description.`);
  }
}

const modules = modulesDoc.modules || {};
const moduleIds = new Set(Object.keys(modules));
for (const [moduleId, moduleEntry] of Object.entries(modules)) {
  if (!moduleEntry || typeof moduleEntry !== "object" || Array.isArray(moduleEntry)) {
    errors.push(`Module '${moduleId}' must be an object with includes/notes.`);
    continue;
  }
  if (!Array.isArray(moduleEntry.includes) || moduleEntry.includes.length === 0) {
    errors.push(`Module '${moduleId}' must define a non-empty includes array.`);
  }
  if (typeof moduleEntry.notes !== "string" || moduleEntry.notes.trim() === "") {
    errors.push(`Module '${moduleId}' must define non-empty notes.`);
  }
  for (const key of ["includes", "excludes"]) {
    const values = moduleEntry[key];
    if (!values) {
      continue;
    }
    if (!Array.isArray(values)) {
      errors.push(`Module '${moduleId}' field '${key}' must be an array when present.`);
      continue;
    }
    const seen = new Set();
    for (const pattern of values) {
      if (typeof pattern !== "string" || pattern.trim() === "") {
        errors.push(`Module '${moduleId}' has an invalid '${key}' entry.`);
        continue;
      }
      if (seen.has(pattern)) {
        errors.push(`Module '${moduleId}' has a duplicate '${key}' pattern '${pattern}'.`);
      }
      seen.add(pattern);
      const segment = firstPathSegment(pattern);
      if (segment && segment !== "**" && !exists(segment)) {
        errors.push(
          `Module '${moduleId}' references top-level path '${segment}' that does not exist.`
        );
      }
    }
  }
}

const componentIds = new Set();
for (const component of componentsDoc.components || []) {
  if (!component || typeof component !== "object") {
    errors.push("install-components.json contains an invalid component entry.");
    continue;
  }
  if (componentIds.has(component.id)) {
    errors.push(`Duplicate component id '${component.id}'.`);
  }
  componentIds.add(component.id);

  const expectedPrefix = `${component.family}:`;
  if (typeof component.id !== "string" || !component.id.startsWith(expectedPrefix)) {
    errors.push(
      `Component '${component.id}' should use the '${component.family}:' prefix.`
    );
  }
  if (!Array.isArray(component.modules) || component.modules.length === 0) {
    errors.push(`Component '${component.id}' must define at least one module.`);
    continue;
  }
  for (const moduleId of component.modules) {
    if (!moduleIds.has(moduleId)) {
      errors.push(`Component '${component.id}' references missing module '${moduleId}'.`);
    }
  }
}

for (const profile of profilesDoc.profiles || []) {
  if (!profile || typeof profile !== "object") {
    errors.push("install-profiles.json contains an invalid profile entry.");
    continue;
  }
  if (!Array.isArray(profile.components) || profile.components.length === 0) {
    errors.push(`Profile '${profile.id}' must define at least one component.`);
    continue;
  }
  const engineComponents = profile.components.filter((id) => String(id).startsWith("engine:"));
  if (engineComponents.length > 1) {
    errors.push(`Profile '${profile.id}' activates multiple engine components.`);
  }
  for (const componentId of profile.components) {
    if (!componentIds.has(componentId)) {
      errors.push(`Profile '${profile.id}' references missing component '${componentId}'.`);
    }
  }
}

if (
  profilesDoc.policy &&
  typeof profilesDoc.policy.default_active_engine_count === "number" &&
  profilesDoc.policy.default_active_engine_count < 1
) {
  errors.push("install-profiles.json policy.default_active_engine_count must be >= 1.");
}

report(errors, "PASS validate:manifests");
