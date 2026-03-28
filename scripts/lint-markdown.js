#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { repoRoot, report } = require("./lib/validation");

const errors = [];
const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".dist",
  "coverage",
  "temp",
  "private",
]);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      lintFile(fullPath);
    }
  }
}

function lintFile(fullPath) {
  const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, "/");
  const text = fs.readFileSync(fullPath, "utf8");
  const lines = text.split(/\r?\n/);
  const endsWithNewline = /\r?\n$/.test(text);

  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1;
    const line = lines[i];

    if (/[ \t]+$/.test(line)) {
      errors.push(`${relPath}:${lineNumber} has trailing whitespace.`);
    }
    if (/\t/.test(line)) {
      errors.push(`${relPath}:${lineNumber} contains a tab character.`);
    }
  }

  if (!endsWithNewline) {
    errors.push(`${relPath} must end with a newline.`);
  }

  let blankRun = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() === "") {
      blankRun += 1;
      if (blankRun > 2) {
        errors.push(`${relPath}:${i + 1} has more than two consecutive blank lines.`);
        break;
      }
    } else {
      blankRun = 0;
    }
  }
}

walk(repoRoot);
report(errors, "PASS lint:markdown");
