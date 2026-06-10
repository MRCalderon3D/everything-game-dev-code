#!/usr/bin/env node
// Claude Code protocol adapter for the scaffold's hooks.
//
// Claude Code invokes this adapter once per phase event (wired by
// scripts/generate-hook-wiring.js). The adapter reads the event payload from
// stdin, runs every hooks/hooks.json entry of the given phase whose matcher
// matches the tool, translates the scaffold's stdout-json result contract
// ({status, severity, title, message}) into a Claude Code systemMessage, and
// ALWAYS exits 0 so a hook can warn but never block the session.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { readEvent } = require("../lib/utils");

const repoRoot = path.resolve(__dirname, "..", "..");
const phase = String(process.argv[2] || "").trim();

function matcherMatches(matcher, toolName) {
  const source = String(matcher || "");
  if (source === "*") {
    return true;
  }
  if (!toolName) {
    return false;
  }
  return new RegExp(`^(?:${source})$`).test(toolName);
}

(async function main() {
  const event = await readEvent();
  const toolName = String(event.tool_name || "");
  const rawPayload = JSON.stringify(event);

  const hooksConfig = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "hooks", "hooks.json"), "utf8")
  );
  const entries = (hooksConfig.hooks || {})[phase] || [];

  const warnings = [];
  for (const entry of entries) {
    if (entry.enabled === false || !matcherMatches(entry.matcher, toolName)) {
      continue;
    }
    const scriptPath = path.resolve(repoRoot, "hooks", entry.script);
    const child = spawnSync(process.execPath, [scriptPath], {
      cwd: repoRoot,
      input: rawPayload,
      encoding: "utf8",
      timeout: entry.timeout_ms || 8000,
    });
    if (child.status !== 0 || !child.stdout) {
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(child.stdout);
    } catch {
      continue;
    }
    if (parsed.severity === "warning" || parsed.severity === "error") {
      warnings.push(`${parsed.title || entry.id}: ${parsed.message || ""}`.trim());
    }
  }

  if (warnings.length > 0) {
    process.stdout.write(
      JSON.stringify({ systemMessage: `[game-dev hooks] ${warnings.join(" | ")}` })
    );
  }
  process.exit(0);
})().catch(() => {
  // Adapter failures must never block the session.
  process.exit(0);
});
