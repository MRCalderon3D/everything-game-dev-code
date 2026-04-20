#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function listMarkdownBasenames(relDir) {
  return fs
    .readdirSync(path.join(repoRoot, relDir))
    .filter((name) => name.endsWith(".md") && name !== "README.md")
    .map((name) => path.basename(name, ".md"))
    .sort();
}

function listSkillNames() {
  const result = [];
  const skillsRoot = path.join(repoRoot, "skills");
  for (const domain of fs.readdirSync(skillsRoot)) {
    const domainPath = path.join(skillsRoot, domain);
    if (!fs.statSync(domainPath).isDirectory()) {
      continue;
    }
    for (const skill of fs.readdirSync(domainPath)) {
      const skillPath = path.join(domainPath, skill);
      if (
        fs.statSync(skillPath).isDirectory() &&
        fs.existsSync(path.join(skillPath, "SKILL.md"))
      ) {
        result.push({
          name: skill,
          qualified: `${domain}/${skill}`,
          file: path.join("skills", domain, skill, "SKILL.md"),
        });
      }
    }
  }
  return result.sort((a, b) => a.qualified.localeCompare(b.qualified));
}

function extractHeadingBullets(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(
    new RegExp(`## ${escaped}\\r?\\n([\\s\\S]*?)(\\r?\\n## |$)`)
  );
  if (!match) {
    return null;
  }
  return [...match[1].matchAll(/^-\\s+(.+)$/gm)].map((item) => item[1].trim());
}

function extractLevelThreeHeadings(text) {
  return [...text.matchAll(/^###\s+([a-z0-9-]+)$/gm)].map((match) => match[1]);
}

function firstPathSegment(globPattern) {
  const normalized = String(globPattern || "").replace(/\\/g, "/");
  return normalized.split("/")[0];
}

function report(errors, successMessage) {
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR: ${error}`);
    }
    process.exit(1);
  }
  console.log(successMessage);
}

module.exports = {
  exists,
  extractHeadingBullets,
  extractLevelThreeHeadings,
  firstPathSegment,
  listMarkdownBasenames,
  listSkillNames,
  readJson,
  readText,
  repoRoot,
  report,
};
