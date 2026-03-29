#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { report } = require("./lib/validation");
const {
  generateStructureOverview,
  generateStructureTree,
  repoRoot,
} = require("./lib/structure-artifacts");

const errors = [];

function normalizeLineEndings(text) {
  return String(text).replace(/\r\n/g, "\n");
}

const structureTreePath = path.join(repoRoot, "STRUCTURE-TREE.txt");
const structureOverviewPath = path.join(repoRoot, "docs", "structure-overview.md");

const actualTree = normalizeLineEndings(fs.readFileSync(structureTreePath, "utf8"));
const expectedTree = normalizeLineEndings(generateStructureTree());
if (actualTree !== expectedTree) {
  errors.push(
    "STRUCTURE-TREE.txt is out of date. Run 'npm run sync:structure' to refresh it."
  );
}

const actualOverview = normalizeLineEndings(fs.readFileSync(structureOverviewPath, "utf8"));
const expectedOverview = normalizeLineEndings(generateStructureOverview());
if (actualOverview !== expectedOverview) {
  errors.push(
    "docs/structure-overview.md is out of date. Run 'npm run sync:structure' to refresh it."
  );
}

report(errors, "PASS validate:structure-artifacts");
