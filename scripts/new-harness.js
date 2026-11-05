#!/usr/bin/env node
// Scaffolds a new harness adapter following the conventions of the existing
// .claude/.codex/.cursor/.opencode/.kiro/.grok/.kilo adapters. The new adapter starts at
// the conservative "Rules only" tier (no commands, no hooks, no MCP) — flip
// capabilities in manifests/harnesses.json once the harness's real support
// surface is confirmed, and the generators pick them up.
//
//   npm run new:harness -- <id> [display name...] [--dry-run]
//
// Generates .<id>/README.md (thin adapter routing back to the shared
// scaffold), registers the harness in manifests/harnesses.json, and adds it
// to the docs/harness-support.md matrix and the root README harness list.

const fs = require("fs");
const path = require("path");
const { loadHarnesses } = require("./lib/harnesses");

const repoRoot = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positional = args.filter((arg) => arg !== "--dry-run");
const id = (positional[0] || "").trim();
const display = positional.slice(1).join(" ").trim() || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "");

function fail(message) {
  console.error(`new:harness error: ${message}`);
  console.error("Usage: npm run new:harness -- <id> [display name...] [--dry-run]");
  process.exit(1);
}

if (!id) {
  fail("missing harness id.");
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  fail(`harness id '${id}' must be kebab-case ([a-z0-9-]).`);
}
if (loadHarnesses().some((harness) => harness.id === id)) {
  fail(`harness '${id}' already exists in manifests/harnesses.json.`);
}
const dir = `.${id}`;
if (fs.existsSync(path.join(repoRoot, dir))) {
  fail(`'${dir}/' already exists.`);
}

// ---------------------------------------------------------------------------
// Planned content
// ---------------------------------------------------------------------------

function adapterReadme() {
  return [
    `# ${display} Adapter`,
    "",
    `This adapter keeps ${display} configuration thin and routes behavior back to the shared scaffold.`,
    "",
    "## Rule",
    `Never duplicate the shared scaffold into ${display} configuration.`,
    "Route to `rules/`, `agents/`, `skills/`, and `commands/` in the shared scaffold instead.",
    "",
    "## Getting started",
    `- Treat \`AGENTS.md\` and \`rules/\` as the authoritative behavior layer.`,
    "- Resolution order: `rules/common/` first, then exactly one engine layer.",
    "- A slash-style command such as `/plan` or `/gdd` resolves to `commands/<name>.md`.",
    "",
    "## Support tier",
    `Registered in \`manifests/harnesses.json\` at the "Rules only" tier. To raise it,`,
    "flip the registry entry's capabilities (`commands`, `hooks`, `mcp`) and re-run the",
    "matching sync (`npm run sync:wrappers` / `sync:hook-wiring` / `sync:mcp`) — see",
    "`docs/harness-support.md`.",
    "",
  ].join("\n");
}

const newFiles = new Map();
newFiles.set(`${dir}/README.md`, adapterReadme());

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function writeText(relPath, text) {
  const fullPath = path.join(repoRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, text, "utf8");
}

function editJson(relPath, mutate) {
  const document = JSON.parse(readText(relPath));
  mutate(document);
  return `${JSON.stringify(document, null, 2)}\n`;
}

const edits = new Map();

edits.set(
  "manifests/harnesses.json",
  editJson("manifests/harnesses.json", (doc) => {
    doc.harnesses.push({
      id,
      display,
      dir,
      commands: null,
      hooks: false,
      mcp: null,
      entryPoints: [`${dir}/README.md`],
    });
  })
);

const matrixText = readText("docs/harness-support.md");
const matrixAnchor = matrixText.match(/^\| `\.agents\/` \|[^\n]*\|$/m);
if (!matrixAnchor) {
  fail("docs/harness-support.md no longer contains the '.agents/' matrix row anchor.");
}
edits.set(
  "docs/harness-support.md",
  matrixText.replace(
    matrixAnchor[0],
    `| \`${dir}/\` | Rules only | none yet | \`AGENTS.md\` + shared \`rules/\` | none | Scaffolded by \`npm run new:harness\` |\n${matrixAnchor[0]}`
  )
);

const readmeText = readText("README.md");
const readmeAnchor = readmeText.match(/^## Supported Harnesses\r?\n(?:- [^\r\n]+\r?\n)+/m);
if (!readmeAnchor) {
  fail("README.md no longer contains the 'Supported Harnesses' list anchor.");
}
edits.set(
  "README.md",
  readmeText.replace(readmeAnchor[0], `${readmeAnchor[0]}- ${display}\n`)
);

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

if (dryRun) {
  console.log(`new:harness dry run for '${id}' (${display}) — nothing written.`);
  console.log("\nWould create:");
  for (const relPath of newFiles.keys()) {
    console.log(`  ${relPath}`);
  }
  console.log("\nWould update:");
  for (const relPath of edits.keys()) {
    console.log(`  ${relPath}`);
  }
  process.exit(0);
}

for (const [relPath, content] of newFiles) {
  writeText(relPath, content);
}
for (const [relPath, content] of edits) {
  writeText(relPath, content);
}

console.log(`\nPASS new:harness — '${id}' (${display}) scaffolded at the "Rules only" tier.`);
console.log("\nNext steps:");
console.log(`  1. Author ${dir}/README.md with the harness's real config surface (instructions file, commands, MCP).`);
console.log(`  2. Flip capabilities in manifests/harnesses.json as confirmed (commands / hooks / mcp),`);
console.log("     then run the matching sync: npm run sync:wrappers / sync:hook-wiring / sync:mcp.");
console.log(`  3. Update the '${dir}/' row in docs/harness-support.md when the tier changes.`);
console.log("  4. git add -A   (structure artifacts derive from tracked files)");
console.log("  5. npm run sync:structure");
console.log("  6. npm run validate && npm test");
