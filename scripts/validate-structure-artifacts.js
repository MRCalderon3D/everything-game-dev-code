#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { report } = require("./lib/validation");
const {
  generateStructureOverview,
  generateStructureTree,
  repoRoot,
  updateReadmeBadges,
} = require("./lib/structure-artifacts");

const { normalizeEol } = require("./lib/text");

const errors = [];

const structureTreePath = path.join(repoRoot, "STRUCTURE-TREE.txt");
const structureOverviewPath = path.join(repoRoot, "docs", "structure-overview.md");

const actualTree = normalizeEol(fs.readFileSync(structureTreePath, "utf8"));
const expectedTree = normalizeEol(generateStructureTree());
if (actualTree !== expectedTree) {
  errors.push(
    "STRUCTURE-TREE.txt is out of date. Run 'npm run sync:structure' to refresh it."
  );
}

const actualOverview = normalizeEol(fs.readFileSync(structureOverviewPath, "utf8"));
const expectedOverview = normalizeEol(generateStructureOverview());
if (actualOverview !== expectedOverview) {
  errors.push(
    "docs/structure-overview.md is out of date. Run 'npm run sync:structure' to refresh it."
  );
}

const readmeText = fs.readFileSync(path.join(repoRoot, "README.md"), "utf8");
if (normalizeEol(readmeText) !== normalizeEol(updateReadmeBadges(readmeText))) {
  errors.push(
    "README.md count badges are out of date. Run 'npm run sync:structure' to refresh them."
  );
}

report(errors, "PASS validate:structure-artifacts");
