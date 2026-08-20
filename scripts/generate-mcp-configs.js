#!/usr/bin/env node
// Generates ready-to-use, harness-native MCP configs from the single source of
// truth (mcp-configs/mcp-servers.json) so any MCP-capable harness can adopt the
// scaffold's MCP servers without hand-copying. Same source -> generated, drift
// checked pattern as generate-wrappers.js.
//
//   node scripts/generate-mcp-configs.js          rewrite generated configs
//   node scripts/generate-mcp-configs.js --check  exit 1 if anything would change
//
// Outputs under mcp-configs/generated/:
//   mcp.json            universal `mcpServers` object (Claude Code .mcp.json,
//                       Cursor .cursor/mcp.json, Kiro .kiro/settings/mcp.json,
//                       Windsurf, Cline, VS Code, ... — the de-facto standard)
//   codex.toml          [mcp_servers.*] fragments for Codex (config.toml)
//   opencode.mcp.json   `mcp` block to merge into .opencode/opencode.json
//   kilo.json           Kilo `mcp` object for .kilo/kilo.json
//   README.md           per-harness install steps + servers left to configure
//
// Only servers with a real command are emitted as runnable. Catalog entries that
// still carry a `<your-...>` placeholder command are listed in the README as
// "configure per team", never written into a config that would fail to launch.

const fs = require("fs");
const path = require("path");
const { sameText } = require("./lib/text");
const { loadHarnesses } = require("./lib/harnesses");
const {
  isHttp,
  envExpansion,
  loadMcpRegistry,
  runnableServers,
  placeholderServers,
  buildEmbeddedMcp,
} = require("./lib/mcp-catalog");

const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join("mcp-configs", "generated");
const checkOnly = process.argv.includes("--check");

const registry = loadMcpRegistry();
const runnable = runnableServers(registry);
const placeholders = placeholderServers(registry);

function buildUniversal() {
  const mcpServers = {};
  for (const [id, def] of runnable) {
    let entry;
    if (isHttp(def)) {
      entry = { type: "http", url: def.url };
    } else {
      entry = { command: def.command };
      if (Array.isArray(def.args) && def.args.length > 0) {
        entry.args = def.args;
      }
    }
    if (def.env && Object.keys(def.env).length > 0) {
      entry.env = envExpansion(def.env);
    }
    mcpServers[id] = entry;
  }
  return `${JSON.stringify({ mcpServers }, null, 2)}\n`;
}

function buildOpencode() {
  return `${JSON.stringify(
    { $schema: "https://opencode.ai/config.json", mcp: buildEmbeddedMcp(runnable) },
    null,
    2
  )}\n`;
}

function buildKilo() {
  return `${JSON.stringify(
    {
      $schema: "https://app.kilo.ai/config.json",
      mcp: buildEmbeddedMcp(runnable, { envStyle: "kilo" }),
    },
    null,
    2
  )}\n`;
}

function tomlString(value) {
  return JSON.stringify(String(value));
}

// [mcp_servers.*] TOML blocks shared by every TOML-config harness (Codex,
// Grok Build). Env values stay as ${VAR} — both harnesses expand environment
// variables when loading the server, so no secret is written to disk.
function tomlServerBlocks() {
  const lines = [];
  for (const [id, def] of runnable) {
    lines.push(`[mcp_servers.${id}]`);
    if (isHttp(def)) {
      // Codex reaches streamable-HTTP servers via a url entry instead of a
      // launched command.
      lines.push(`url = ${tomlString(def.url)}`);
    } else {
      lines.push(`command = ${tomlString(def.command)}`);
      const args = Array.isArray(def.args) ? def.args : [];
      lines.push(`args = [${args.map(tomlString).join(", ")}]`);
    }
    if (def.env && Object.keys(def.env).length > 0) {
      lines.push(`[mcp_servers.${id}.env]`);
      for (const key of Object.keys(def.env)) {
        lines.push(`${key} = ${tomlString(`\${${key}}`)}`);
      }
    }
    lines.push("");
  }
  return lines;
}

function buildToml(headerLines) {
  const lines = [...headerLines, "", ...tomlServerBlocks()];
  return `${lines.join("\n").replace(/\n+$/, "\n")}`;
}

function buildCodex() {
  return buildToml([
    "# Generated from mcp-configs/mcp-servers.json by scripts/generate-mcp-configs.js.",
    "# Do not edit by hand. Merge these blocks into .codex/config.toml (or your",
    "# Codex config) — or run the `codex mcp add` commands in generated/README.md.",
  ]);
}

function buildProjectToml() {
  return buildToml([
    "# Generated from mcp-configs/mcp-servers.json by scripts/generate-mcp-configs.js.",
    "# Do not edit by hand; run `npm run sync:mcp`. Project-scoped MCP servers for",
    "# harnesses that read a config.toml with [mcp_servers.*] sections (Grok Build).",
    "# ${VAR} env values are expanded by the harness at launch.",
  ]);
}

function buildReadme() {
  const runnableList = runnable
    .map(([id, def]) => `- \`${id}\` — ${def.purpose}`)
    .join("\n");
  const placeholderList = placeholders.length
    ? placeholders.map(([id]) => `\`${id}\``).join(", ")
    : "_(none)_";

  return `# Generated MCP configs

<!-- Generated from ../mcp-servers.json by scripts/generate-mcp-configs.js. Do not edit by hand; run \`npm run sync:mcp\`. -->

These files let **any MCP-capable harness** use the scaffold's MCP servers. They are
generated from the single source of truth ([../mcp-servers.json](../mcp-servers.json)) —
edit that catalog and run \`npm run sync:mcp\`, never edit these files directly.

For full setup instructions (per-harness install, secrets, and a Blender
end-to-end walkthrough), see [docs/mcp-setup.md](../../docs/mcp-setup.md).

MCP is an open, vendor-neutral protocol, so every server here works with any model
behind a compatible client.

**Pre-wired in the repo (no copy step).** Opening the scaffold already gives these
harnesses the servers, via committed project-scoped configs (which harnesses have
one is declared in \`manifests/harnesses.json\`):

| Harness | Live config (committed) |
|---|---|
${loadHarnesses()
  .filter((harness) => harness.mcp)
  .map((harness) => {
    const note =
      harness.mcp.format === "opencode"
        ? `\`mcp\` block in \`${harness.mcp.path}\` (generated by \`sync:wrappers\`)`
        : `\`${harness.mcp.path}\``;
    return `| ${harness.display} | ${note} |`;
  })
  .join("\n")}

**Needs one step.** Codex reads only its global \`~/.codex/config.toml\` (no
project-scoped config), so it can't be pre-wired in the repo — run the one-liners
below once, or merge [codex.toml](./codex.toml). Other clients (Windsurf, Cline,
VS Code, …) accept the de-facto-standard \`mcpServers\` shape in [mcp.json](./mcp.json).

The files in this folder are format reference copies; the live configs above are
generated from the same catalog so they always match.

## Runnable servers included

${runnableList}

Env values are emitted as \`\${VAR}\` so secrets are read from your environment at
launch and never written to disk. Set the variable (e.g. \`FAL_KEY\`) before use.

### Codex one-liners

\`\`\`bash
${runnable
  .filter(([, def]) => !isHttp(def))
  .map(([id, def]) => {
    const parts = [def.command, ...(Array.isArray(def.args) ? def.args : [])];
    return `codex mcp add ${id} -- ${parts.join(" ")}`;
  })
  .join("\n")}
\`\`\`

HTTP servers (${
    runnable.filter(([, def]) => isHttp(def)).map(([id]) => `\`${id}\``).join(", ") || "_none_"
  }) have no launch command — merge their \`url\` blocks from
[codex.toml](./codex.toml) into \`~/.codex/config.toml\` instead.

## Configure per team (not generated)

These catalog entries still use a \`<your-...-command>\` placeholder, so they are
intentionally **not** emitted here — give them a real command in
[../mcp-servers.json](../mcp-servers.json) and re-run \`npm run sync:mcp\`:

${placeholderList}
`;
}

const universal = buildUniversal();

const outputs = new Map([
  // Reference copies (one per format) under mcp-configs/generated/.
  [path.join(outDir, "mcp.json"), universal],
  [path.join(outDir, "opencode.mcp.json"), buildOpencode()],
  [path.join(outDir, "kilo.json"), buildKilo()],
  [path.join(outDir, "codex.toml"), buildCodex()],
  [path.join(outDir, "README.md"), buildReadme()],
]);

// Live, project-scoped configs committed into the harness-native locations so
// anyone who opens the scaffold gets the servers pre-wired — no copy step.
// Portable bare commands only (no machine paths). Which harnesses get one is
// declared in manifests/harnesses.json. The OpenCode `mcp` block ("opencode"
// format) is emitted by generate-wrappers.js (it owns the whole registry file),
// and harnesses with `mcp: null` (Codex is home-config only) have no live file
// here.
for (const harness of loadHarnesses()) {
  if (!harness.mcp) {
    continue;
  }
  const livePath = harness.mcp.path.split("/").join(path.sep);
  if (harness.mcp.format === "universal") {
    outputs.set(livePath, universal);
  } else if (harness.mcp.format === "toml") {
    outputs.set(livePath, buildProjectToml());
  } else if (harness.mcp.format === "kilo") {
    outputs.set(livePath, buildKilo());
  }
}

const changed = [];
for (const [relPath, content] of outputs) {
  const fullPath = path.join(repoRoot, relPath);
  const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
  if (!sameText(current, content)) {
    changed.push(relPath.split(path.sep).join("/"));
    if (!checkOnly) {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

if (checkOnly && changed.length > 0) {
  for (const relPath of changed) {
    console.error(`ERROR: ${relPath} is out of sync with mcp-configs/mcp-servers.json. Run 'npm run sync:mcp'.`);
  }
  process.exit(1);
}

const verb = checkOnly ? "checked" : changed.length > 0 ? `updated ${changed.length}` : "verified";
console.log(
  `PASS ${checkOnly ? "validate" : "sync"}:mcp (${runnable.length} runnable servers, ${verb} config files)`
);
