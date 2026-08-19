#!/usr/bin/env node
// Generates harness command wrappers from commands/*.md, the single source of
// truth. Hand-maintained wrapper descriptions are how adapters drift (the
// OpenCode /tdd divergence); generated wrappers cannot.
//
//   node scripts/generate-wrappers.js          rewrite wrappers in place
//   node scripts/generate-wrappers.js --check  exit 1 if anything would change
//
// Outputs per source command <name>:
//   .claude/commands/<name>.md   frontmatter description + resolution line
//   .codex/commands/<name>.md    same format as .claude
//   .opencode/commands/<name>.md adapter-behavior wrapper (owners derived
//                                from the source command's Invokes Agents)
//   .opencode/opencode.json      command registry (descriptions + templates)

const fs = require("fs");
const path = require("path");
const { sameText } = require("./lib/text");

const repoRoot = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

// OpenCode's adapter config (opencode.json) carries both the command registry and
// the MCP servers, so this generator owns the whole file. The `mcp` block is
// derived from the same catalog as scripts/generate-mcp-configs.js (runnable
// servers only, ${VAR} env expansion) so the two representations never diverge.
function isHttp(def) {
  return def.transport === "http";
}

function buildOpencodeMcp() {
  const registry = JSON.parse(readText("mcp-configs/mcp-servers.json"));
  const mcp = {};
  const entries = Object.entries(registry.servers).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  );
  for (const [id, def] of entries) {
    // Skip servers with a `<...>` placeholder in their launch fields (command/
    // args for stdio, url for http) — a missing command or a machine-specific
    // path can't be pre-wired portably.
    const parts = isHttp(def)
      ? [def.url]
      : [def.command, ...(Array.isArray(def.args) ? def.args : [])];
    const placeholder = parts.some(
      (p) => typeof p === "string" && p.includes("<") && p.includes(">")
    );
    if (placeholder) {
      continue;
    }
    let entry;
    if (isHttp(def)) {
      entry = { type: "remote", url: def.url, enabled: true };
    } else {
      const command = [def.command, ...(Array.isArray(def.args) ? def.args : [])];
      entry = { type: "local", command, enabled: true };
    }
    if (def.env && Object.keys(def.env).length > 0) {
      entry.environment = {};
      for (const key of Object.keys(def.env)) {
        entry.environment[key] = `\${${key}}`;
      }
    }
    mcp[id] = entry;
  }
  return mcp;
}

function parseFrontmatterDescription(text, relPath) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`${relPath} has no frontmatter block.`);
  }
  const descMatch = match[1].match(/^description:\s*(.+)$/m);
  if (!descMatch) {
    throw new Error(`${relPath} frontmatter has no description.`);
  }
  return descMatch[1].trim();
}

function parseHeadingBullets(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(
    new RegExp(`## ${escaped}\\r?\\n([\\s\\S]*?)(\\r?\\n## |$)`)
  );
  if (!match) {
    return [];
  }
  return [...match[1].matchAll(/^-\s+(.+)$/gm)].map((item) => item[1].trim());
}

function claudeStyleWrapper(name, description) {
  return `---\ndescription: ${description}\n---\n\nRead \`commands/${name}.md\` and execute it as instructed.\n`;
}

function opencodeWrapper(name, description, agents) {
  const lines = [`# /${name}`, "", `Resolve to the shared \`commands/${name}.md\` workflow.`, "", "## Adapter behavior"];
  if (agents.length > 0) {
    lines.push(`- primary owners: ${agents.map((agent) => `\`${agent}\``).join(", ")}`);
  }
  lines.push(
    "- follow the shared command instructions for invoked agents, required skills, and expected output"
  );
  return `${lines.join("\n")}\n`;
}

const commandNames = fs
  .readdirSync(path.join(repoRoot, "commands"))
  .filter((file) => file.endsWith(".md") && file !== "README.md")
  .map((file) => path.basename(file, ".md"))
  .sort();

const outputs = new Map();
const opencodeCommands = {};

for (const name of commandNames) {
  const sourceRelPath = `commands/${name}.md`;
  const sourceText = readText(sourceRelPath);
  const description = parseFrontmatterDescription(sourceText, sourceRelPath);
  const agents = parseHeadingBullets(sourceText, "Invokes Agents");

  outputs.set(`.claude/commands/${name}.md`, claudeStyleWrapper(name, description));
  outputs.set(`.codex/commands/${name}.md`, claudeStyleWrapper(name, description));
  outputs.set(`.opencode/commands/${name}.md`, opencodeWrapper(name, description, agents));

  opencodeCommands[name] = {
    description,
    template: `Read .opencode/commands/${name}.md and execute the shared commands/${name}.md workflow.`,
  };
}

outputs.set(
  ".opencode/opencode.json",
  `${JSON.stringify(
    {
      $schema: "https://opencode.ai/config.json",
      command: opencodeCommands,
      mcp: buildOpencodeMcp(),
    },
    null,
    2
  )}\n`
);

const changed = [];
for (const [relPath, content] of outputs) {
  const fullPath = path.join(repoRoot, relPath);
  const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
  if (!sameText(current, content)) {
    changed.push(relPath);
    if (!checkOnly) {
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

if (checkOnly && changed.length > 0) {
  for (const relPath of changed) {
    console.error(`ERROR: ${relPath} is out of sync with commands/. Run 'npm run sync:wrappers'.`);
  }
  process.exit(1);
}

const verb = checkOnly ? "checked" : changed.length > 0 ? `updated ${changed.length}` : "verified";
console.log(
  `PASS ${checkOnly ? "validate" : "sync"}:wrappers (${commandNames.length} commands, ${verb} wrapper files)`
);
