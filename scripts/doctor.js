#!/usr/bin/env node
// Diagnoses an end-user installation of the scaffold: environment, git hook
// wiring, active engine profile, harness adapter presence, and drift between
// sources of truth and their generated artifacts. Prints PASS/WARN/FAIL per
// check with a remediation hint; exits non-zero only when a FAIL is found.
//
//   npm run doctor

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { engineIds } = require("./lib/engines");
const { getActiveProfile, isValidProfile } = require("./lib/profile-resolution");

const repoRoot = path.resolve(__dirname, "..");
const results = [];

function record(level, name, message, hint) {
  results.push({ level, name, message, hint });
}

function pass(name, message) {
  record("PASS", name, message);
}

function warn(name, message, hint) {
  record("WARN", name, message, hint);
}

function failCheck(name, message, hint) {
  record("FAIL", name, message, hint);
}

// --- Environment -----------------------------------------------------------

const requiredMajor = 18;
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= requiredMajor) {
  pass("node", `Node ${process.versions.node} satisfies >=${requiredMajor}.`);
} else {
  failCheck(
    "node",
    `Node ${process.versions.node} is older than the required >=${requiredMajor}.`,
    "Install Node 18 or newer."
  );
}

try {
  require.resolve("ajv");
  pass("dependencies", "devDependencies are installed (ajv resolves).");
} catch {
  failCheck("dependencies", "devDependencies are not installed.", "Run: npm ci");
}

// --- Git hooks -------------------------------------------------------------

const hooksPath = spawnSync("git", ["config", "core.hooksPath"], {
  cwd: repoRoot,
  encoding: "utf8",
});
if ((hooksPath.stdout || "").trim() === ".githooks") {
  pass("git-hooks", "git core.hooksPath points at .githooks (pre-commit guard active).");
} else {
  warn(
    "git-hooks",
    "git core.hooksPath is not set to .githooks — the pre-commit validation guard is inactive.",
    "Run: npm run setup:hooks"
  );
}

// --- Engine profile --------------------------------------------------------

const activeProfile = getActiveProfile();
if (!activeProfile) {
  warn(
    "profile",
    "No active engine profile (GAME_DEV_PROFILE unset and no .game-dev state).",
    `Run: node scripts/setup-profile.js --engine <${engineIds().join("|")}>`
  );
} else if (isValidProfile(activeProfile)) {
  pass("profile", `Active engine profile: ${activeProfile}.`);
} else {
  failCheck(
    "profile",
    `Active profile '${activeProfile}' is not a registered engine (${engineIds().join(", ")}).`,
    "Fix GAME_DEV_PROFILE or .game-dev/profile.json, or register the engine via npm run new:engine."
  );
}

function readJsonIfExists(relPath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), "utf8"));
  } catch {
    return null;
  }
}

const profileState = readJsonIfExists(".game-dev/profile.json");
const installState = readJsonIfExists(".game-dev/install-state.json");
const profileEngine = String((profileState && profileState.active_profile) || "").toLowerCase();
const installEngine = String((installState && installState.active_engine) || "").toLowerCase();
if (profileEngine && installEngine && profileEngine !== installEngine) {
  warn(
    "game-dev-state",
    `.game-dev/profile.json says '${profileEngine}' but install-state.json says '${installEngine}'.`,
    "Re-run setup-profile.js or install-profile.js so both agree."
  );
} else if (profileEngine || installEngine) {
  pass("game-dev-state", ".game-dev profile state is consistent.");
}

// --- Harness adapters ------------------------------------------------------

const adapterFiles = [
  ".claude/settings.json",
  ".claude/commands",
  ".codex/commands",
  ".opencode/opencode.json",
  ".cursor/hooks.json",
  ".kiro/README.md",
];
const missingAdapters = adapterFiles.filter(
  (relPath) => !fs.existsSync(path.join(repoRoot, relPath))
);
if (missingAdapters.length === 0) {
  pass("adapters", "All harness adapter entry points are present.");
} else {
  failCheck(
    "adapters",
    `Missing harness adapter files: ${missingAdapters.join(", ")}.`,
    "Restore them from git or regenerate with npm run sync:wrappers / sync:hook-wiring."
  );
}

// --- Generated artifact drift ----------------------------------------------

const driftChecks = [
  { name: "wrappers", script: "generate-wrappers.js", args: ["--check"], fix: "npm run sync:wrappers" },
  { name: "hook-wiring", script: "validate-hooks.js", args: [], fix: "npm run sync:hook-wiring" },
  { name: "structure-artifacts", script: "validate-structure-artifacts.js", args: [], fix: "npm run sync:structure" },
  { name: "engine-contract", script: "validate-engines.js", args: [], fix: "see validator output (npm run validate:engines)" },
];
for (const check of driftChecks) {
  const run = spawnSync(process.execPath, [path.join(__dirname, check.script), ...check.args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (run.status === 0) {
    pass(check.name, "In sync with its source of truth.");
  } else {
    const detail = `${run.stdout || ""}${run.stderr || ""}`.trim().split(/\r?\n/)[0] || "validator failed";
    failCheck(check.name, detail, `Run: ${check.fix}`);
  }
}

// --- MCP configuration (informational) ---------------------------------------

const mcpText = fs.readFileSync(path.join(repoRoot, "mcp-configs", "mcp-servers.json"), "utf8");
if (mcpText.includes("<your-")) {
  warn(
    "mcp-configs",
    "mcp-configs/mcp-servers.json still contains <your-*> placeholders (intentional until configured per team).",
    "Fill in real server commands when adopting MCP servers."
  );
} else {
  pass("mcp-configs", "MCP server registry has no placeholder commands.");
}

// --- Report ------------------------------------------------------------------

const width = Math.max(...results.map((entry) => entry.name.length));
for (const entry of results) {
  console.log(`[${entry.level}] ${entry.name.padEnd(width)}  ${entry.message}`);
  if (entry.hint && entry.level !== "PASS") {
    console.log(`${" ".repeat(7 + width)}fix: ${entry.hint}`);
  }
}

const failures = results.filter((entry) => entry.level === "FAIL").length;
const warnings = results.filter((entry) => entry.level === "WARN").length;
console.log(
  `\ndoctor: ${results.length} checks, ${failures} failed, ${warnings} warning${warnings === 1 ? "" : "s"}.`
);
process.exit(failures > 0 ? 1 : 0);
