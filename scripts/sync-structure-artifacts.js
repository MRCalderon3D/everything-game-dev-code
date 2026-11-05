#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  generateStructureOverview,
  generateStructureTree,
  repoRoot,
  updateReadmeBadges,
} = require("./lib/structure-artifacts");

fs.writeFileSync(path.join(repoRoot, "STRUCTURE-TREE.txt"), generateStructureTree(), "utf8");
fs.writeFileSync(
  path.join(repoRoot, "docs", "structure-overview.md"),
  generateStructureOverview(),
  "utf8"
);

const readmePath = path.join(repoRoot, "README.md");
const readmeText = fs.readFileSync(readmePath, "utf8");
const updatedReadme = updateReadmeBadges(readmeText);
if (updatedReadme !== readmeText) {
  fs.writeFileSync(readmePath, updatedReadme, "utf8");
}

console.log("PASS sync:structure");
