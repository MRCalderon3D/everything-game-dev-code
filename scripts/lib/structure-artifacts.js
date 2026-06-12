#!/usr/bin/env node
const path = require("path");
const { execFileSync } = require("child_process");

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

let trackedFilesCache = null;

// Structure artifacts are derived from `git ls-files`, not a filesystem walk,
// so local output always matches what CI regenerates from a clean checkout
// (gitignored and untracked content can never leak into committed artifacts).
// Files deleted locally but not yet committed are subtracted so the artifacts
// reflect what the next commit will actually contain.
function gitListFiles(args) {
  const stdout = execFileSync("git", ["ls-files", "-z", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return stdout.split("\0").filter(Boolean).map(normalizePath);
}

function trackedFiles() {
  if (!trackedFilesCache) {
    const deleted = new Set(gitListFiles(["--deleted"]));
    trackedFilesCache = gitListFiles([]).filter((relPath) => !deleted.has(relPath));
  }
  return trackedFilesCache;
}

function walk(currentDir) {
  const rel = normalizePath(path.relative(repoRoot, currentDir));
  const prefix = rel === "" || rel === "." ? "" : `${rel}/`;
  return trackedFiles()
    .filter((relPath) => relPath.startsWith(prefix))
    .map((relPath) => relPath.slice(prefix.length));
}

function buildTree(paths) {
  const root = new Map();
  for (const relPath of paths) {
    const parts = relPath.split("/");
    let node = root;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      if (isFile) {
        if (!node.has(part)) {
          node.set(part, null);
        }
      } else {
        if (!(node.get(part) instanceof Map)) {
          node.set(part, new Map());
        }
        node = node.get(part);
      }
    }
  }
  return root;
}

function sortTreeEntries(node) {
  return [...node.entries()].sort((a, b) => {
    const aIsDir = a[1] instanceof Map;
    const bIsDir = b[1] instanceof Map;
    if (aIsDir !== bIsDir) {
      return aIsDir ? -1 : 1;
    }
    return compareNames(a[0], b[0]);
  });
}

function renderTree(node, prefix = "") {
  const entries = sortTreeEntries(node);
  const lines = [];

  entries.forEach(([name, child], index) => {
    const isLast = index === entries.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    lines.push(`${prefix}${branch}${name}`);
    if (child instanceof Map) {
      lines.push(...renderTree(child, childPrefix));
    }
  });

  return lines;
}

function countMarkdownFiles(relDir, { excludeReadme = false } = {}) {
  return walk(path.join(repoRoot, relDir)).filter((relPath) => {
    if (!relPath.endsWith(".md")) {
      return false;
    }
    if (excludeReadme && (relPath === "README.md" || relPath.endsWith("/README.md"))) {
      return false;
    }
    return true;
  }).length;
}

// READMEs document a layer; they are not agents, commands, rules, or contexts.
function structureCounts() {
  return {
    agents: countMarkdownFiles("agents", { excludeReadme: true }),
    commands: countMarkdownFiles("commands", { excludeReadme: true }),
    skills: walk(path.join(repoRoot, "skills")).filter((relPath) =>
      relPath.endsWith("/SKILL.md")
    ).length,
    rules: countMarkdownFiles("rules", { excludeReadme: true }),
    contexts: countMarkdownFiles("contexts", { excludeReadme: true }),
  };
}

// Rewrites the shields.io count badges in README.md from the live counts so
// they can never drift. Badge colors and any other badges are left untouched.
function updateReadmeBadges(readmeText) {
  const counts = structureCounts();
  let result = readmeText;
  for (const [name, value] of Object.entries(counts)) {
    result = result.replace(
      new RegExp(`(!\\[${name}\\]\\(https://img\\.shields\\.io/badge/${name}-)\\d+(-[a-z]+\\))`),
      `$1${value}$2`
    );
  }
  return result;
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function trackedDirectoriesUnder(relDir) {
  const prefix = `${relDir}/`;
  const dirs = new Set();
  for (const relPath of trackedFiles()) {
    if (!relPath.startsWith(prefix)) {
      continue;
    }
    const remainder = relPath.slice(prefix.length);
    const slashIndex = remainder.indexOf("/");
    if (slashIndex > 0) {
      dirs.add(remainder.slice(0, slashIndex));
    }
  }
  return [...dirs].sort(compareNames);
}

function generateStructureTree() {
  return (
    [path.basename(repoRoot), ...renderTree(buildTree(trackedFiles()))].join("\n") + "\n"
  );
}

function generateStructureOverview() {
  const engineDirs = trackedDirectoriesUnder("rules").filter(
    (name) => name !== "common"
  );

  const domainDirs = trackedDirectoriesUnder("skills");

  const documentTemplates = trackedFiles()
    .filter(
      (relPath) =>
        relPath.startsWith("docs/templates/") &&
        relPath.endsWith(".md") &&
        relPath.split("/").length === 3
    )
    .map((relPath) => titleFromFilename(path.basename(relPath)))
    .sort(compareNames);

  const lines = [
    "# Structure Overview",
    "",
    "Generated from the current repository structure. Update with `npm run sync:structure`.",
    "",
    "## Current Count",
    `- Agents: ${structureCounts().agents}`,
    `- Commands: ${structureCounts().commands}`,
    `- Skills: ${structureCounts().skills}`,
    `- Rule files: ${structureCounts().rules}`,
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
  structureCounts,
  updateReadmeBadges,
  walk,
};
