#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { report } = require("./lib/validation");
const { repoRoot, walk } = require("./lib/structure-artifacts");

const errors = [];
const markdownFiles = walk(repoRoot).filter((relPath) => relPath.endsWith(".md"));

for (const relPath of markdownFiles) {
  const fullPath = path.join(repoRoot, relPath);
  const text = fs.readFileSync(fullPath, "utf8");
  const matches = text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);

  for (const match of matches) {
    const target = String(match[1] || "").trim();
    if (!target) {
      continue;
    }
    if (
      target.startsWith("#") ||
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:")
    ) {
      continue;
    }

    const cleanTarget = target.split("#")[0].split("?")[0];
    if (!cleanTarget || /\s/.test(cleanTarget) || !/[./\\]/.test(cleanTarget)) {
      continue;
    }

    const resolvedPath = path.resolve(path.dirname(fullPath), cleanTarget);
    if (!fs.existsSync(resolvedPath)) {
      errors.push(`${relPath} references missing path '${target}'.`);
    }
  }
}

// Component-id tokens used in examples/ must resolve to real components —
// the teaching layer must never contradict the manifest vocabulary.
const componentIds = new Set(
  (
    JSON.parse(
      fs.readFileSync(path.join(repoRoot, "manifests", "install-components.json"), "utf8")
    ).components || []
  ).map((component) => component.id)
);
const exampleFiles = walk(repoRoot).filter(
  (relPath) =>
    relPath.startsWith("examples/") &&
    (relPath.endsWith(".md") || relPath.endsWith(".json"))
);
for (const relPath of exampleFiles) {
  const text = fs.readFileSync(path.join(repoRoot, relPath), "utf8");
  for (const match of text.matchAll(
    /\b(?:baseline|engine|domain|capability):[a-z0-9][a-z0-9-]*\b/g
  )) {
    if (!componentIds.has(match[0])) {
      errors.push(`${relPath} references unknown component id '${match[0]}'.`);
    }
  }
}

report(errors, "PASS validate:references");
