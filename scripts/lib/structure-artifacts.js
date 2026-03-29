#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function normalizePath(relPath) {
  return relPath.replace(/\\/g, "/");
}

function compareNames(a, b) {
  const left = String(a);
  const right = String(b);

  if (left === right) {
    return 0;
  }

  const leftLower = left.toLowerCase();
  const rightLower = right.toLowerCase();
  if (leftLower < rightLower) {
    return -1;
  }
  if (leftLower > rightLower) {
    return 1;
  }

  return left < right ? -1 : 1;
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) {
      return a.isDirectory() ? -1 : 1;
    }
    return compareNames(a.name, b.name);
  });
}

function walk(currentDir, relDir = "") {
  const entries = sortEntries(
    fs
      .readdirSync(currentDir, { withFileTypes: true })
      .filter((entry) => ![".git", ".game-dev", "node_modules", "temp"].includes(entry.name))
  );

  const files = [];
  for (const entry of entries) {
    const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath, relPath));
      continue;
    }
    files.push(normalizePath(relPath));
  }
  return files;
}

function renderTree(dirPath, prefix = "") {
  const entries = sortEntries(
    fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((entry) => ![".git", ".game-dev", "node_modules", "temp"].includes(entry.name))
  );
  const lines = [];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    lines.push(`${prefix}${branch}${entry.name}`);
    if (entry.isDirectory()) {
      lines.push(...renderTree(path.join(dirPath, entry.name), childPrefix));
    }
  });

  return lines;
}

function countMarkdownFiles(relDir, { excludeReadme = false } = {}) {
  return walk(path.join(repoRoot, relDir)).filter((relPath) => {
    if (!relPath.endsWith(".md")) {
      return false;
    }
    if (excludeReadme && relPath.endsWith("/README.md")) {
      return false;
    }
    return true;
  }).length;
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function generateStructureTree() {
  return [path.basename(repoRoot), ...renderTree(repoRoot)].join("\n") + "\n";
}

function generateStructureOverview() {
  const engineDirs = fs
    .readdirSync(path.join(repoRoot, "rules"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "common")
    .map((entry) => entry.name)
    .sort(compareNames);

  const domainDirs = fs
    .readdirSync(path.join(repoRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareNames);

  const documentTemplates = fs
    .readdirSync(path.join(repoRoot, "docs", "templates"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => titleFromFilename(entry.name))
    .sort(compareNames);

  const lines = [
    "# Structure Overview",
    "",
    "Generated from the current repository structure. Update with `npm run sync:structure`.",
    "",
    "## Current Count",
    `- Agents: ${countMarkdownFiles("agents")}`,
    `- Commands: ${countMarkdownFiles("commands")}`,
    `- Skills: ${walk(path.join(repoRoot, "skills")).filter((relPath) => relPath.endsWith("/SKILL.md")).length}`,
    `- Rule files: ${countMarkdownFiles("rules", { excludeReadme: true })}`,
    "",
    "## Supported Engines",
    ...engineDirs.map((engine) => `- ${engine.charAt(0).toUpperCase() + engine.slice(1)}`),
    "",
    "## Domains",
    ...domainDirs.map((domain) => `- ${domain}`),
    "",
    "## Documentation",
    ...documentTemplates.map((doc) => `- ${doc}`),
    "",
  ];

  return lines.join("\n");
}

module.exports = {
  generateStructureOverview,
  generateStructureTree,
  repoRoot,
  walk,
};
