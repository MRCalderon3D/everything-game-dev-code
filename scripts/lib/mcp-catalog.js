// Shared MCP catalog helpers. generate-mcp-configs.js and generate-wrappers.js
// both emit runnable servers from mcp-configs/mcp-servers.json; keep the
// placeholder filter and the OpenCode/Kilo embedded `mcp` shape in one place
// so those surfaces cannot drift.

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function isPlaceholder(value) {
  return typeof value === "string" && value.includes("<") && value.includes(">");
}

function isHttp(def) {
  return def.transport === "http";
}

function hasPlaceholder(def) {
  if (isHttp(def)) {
    return isPlaceholder(def.url);
  }
  return [def.command, ...(Array.isArray(def.args) ? def.args : [])].some(isPlaceholder);
}

function envExpansion(env, style) {
  const out = {};
  for (const key of Object.keys(env || {})) {
    out[key] = style === "kilo" ? `{env:${key}}` : `\${${key}}`;
  }
  return out;
}

function loadMcpRegistry() {
  return JSON.parse(
    fs.readFileSync(path.join(repoRoot, "mcp-configs", "mcp-servers.json"), "utf8")
  );
}

function catalogEntries(registry) {
  return Object.entries(registry.servers).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  );
}

function runnableServers(registry) {
  return catalogEntries(registry).filter(([, def]) => !hasPlaceholder(def));
}

function placeholderServers(registry) {
  return catalogEntries(registry).filter(([, def]) => hasPlaceholder(def));
}

// OpenCode and Kilo share this embedded `mcp` object (type local|remote).
// envStyle: omit or "dollar" → ${VAR} (OpenCode); "kilo" → {env:VAR}.
function buildEmbeddedMcp(runnable, options) {
  const envStyle = options && options.envStyle;
  const mcp = {};
  for (const [id, def] of runnable) {
    let entry;
    if (isHttp(def)) {
      entry = { type: "remote", url: def.url, enabled: true };
    } else {
      const command = [def.command, ...(Array.isArray(def.args) ? def.args : [])];
      entry = { type: "local", command, enabled: true };
    }
    if (def.env && Object.keys(def.env).length > 0) {
      entry.environment = envExpansion(def.env, envStyle);
    }
    mcp[id] = entry;
  }
  return mcp;
}

module.exports = {
  isPlaceholder,
  isHttp,
  hasPlaceholder,
  envExpansion,
  loadMcpRegistry,
  catalogEntries,
  runnableServers,
  placeholderServers,
  buildEmbeddedMcp,
};
