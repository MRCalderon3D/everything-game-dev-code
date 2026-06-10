#!/usr/bin/env node
// Builders that derive per-harness hook wiring from hooks/hooks.json, the
// single source of truth. Used by generate-hook-wiring.js (writer) and
// validate-hooks.js (regenerate-and-compare drift check).

const TOOL_NAME_MAP = {
  Write: "write",
  Edit: "edit",
  MultiEdit: "multi_edit",
  Bash: "bash",
  Read: "read",
};

const CURSOR_PHASE_MAP = {
  PreToolUse: "preToolUse",
  PostToolUse: "postToolUse",
  Stop: "stop",
};

function claudeMatcherUnion(entries) {
  const tools = [];
  for (const entry of entries) {
    const matcher = String(entry.matcher || "");
    if (matcher === "*") {
      return "*";
    }
    for (const tool of matcher.split("|")) {
      if (tool && !tools.includes(tool)) {
        tools.push(tool);
      }
    }
  }
  return tools.join("|");
}

// One adapter invocation per phase: the adapter reads the event payload,
// matches it against hooks/hooks.json entries itself, and runs the matching
// scripts. Warn-only: the adapter always exits 0.
function buildClaudeHooks(hooksConfig) {
  const result = {};
  for (const [phase, entries] of Object.entries(hooksConfig.hooks || {})) {
    const entryObj = {};
    if (phase !== "Stop") {
      entryObj.matcher = claudeMatcherUnion(entries);
    }
    entryObj.hooks = [
      {
        type: "command",
        command: `node scripts/hooks/claude-adapter.js ${phase}`,
        timeout: 30,
      },
    ];
    result[phase] = [entryObj];
  }
  return result;
}

function toCursorMatcher(matcher) {
  const source = String(matcher || "");
  if (source === "*") {
    return "*";
  }
  return source
    .split("|")
    .map((tool) => TOOL_NAME_MAP[tool] || tool.toLowerCase())
    .join("|");
}

function buildCursorHooks(hooksConfig) {
  const hooks = {};
  for (const [phase, entries] of Object.entries(hooksConfig.hooks || {})) {
    const cursorPhase =
      CURSOR_PHASE_MAP[phase] || phase.charAt(0).toLowerCase() + phase.slice(1);
    hooks[cursorPhase] = entries.map((entry) => ({
      matcher: toCursorMatcher(entry.matcher),
      command: `node ${String(entry.script || "").replace(/^\.\.\//, "")}`,
    }));
  }
  return {
    $schema: "https://cursor.com/docs/hooks",
    hooks,
  };
}

module.exports = {
  buildClaudeHooks,
  buildCursorHooks,
};
