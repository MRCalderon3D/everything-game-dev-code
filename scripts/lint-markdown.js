#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { report } = require("./lib/validation");
const { repoRoot, walk } = require("./lib/structure-artifacts");

const errors = [];

// samples/ holds verbatim output of external AI harnesses; it is not held to
// scaffold authoring style.
const ignoredPrefixes = ["samples/"];

function lintableMarkdownFiles() {
  return walk(repoRoot).filter(
    (relPath) =>
      relPath.endsWith(".md") &&
      !ignoredPrefixes.some((prefix) => relPath.startsWith(prefix))
  );
}

function lintFile(relPath) {
  const fullPath = path.join(repoRoot, relPath);
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

for (const relPath of lintableMarkdownFiles()) {
  lintFile(relPath);
}
report(errors, "PASS lint:markdown");
