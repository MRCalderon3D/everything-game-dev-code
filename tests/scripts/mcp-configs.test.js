#!/usr/bin/env node
// The MCP catalog supports two transports: stdio (command + args) and http
// (url, e.g. the official Unreal Engine 5.8 in-editor MCP server). The schema
// must require the field that matches the declared transport, and the config
// generators must emit http servers in each harness's http/remote shape.
// Portable entries marked `prewired: false` are opt-in and never emitted.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const { validateAgainstSchema } = require(path.join(repoRoot, 'scripts', 'lib', 'schema-validation.js'));

const SCHEMA = path.join('schemas', 'mcp-servers.schema.json');

function registryWith(server) {
  return {
    version: 1,
    profiles: { test: ['test-server'] },
    servers: { 'test-server': server },
  };
}

// --- schema: stdio servers still require a command ---
assert.ok(
  validateAgainstSchema(SCHEMA, registryWith({ purpose: 'x', transport: 'stdio' })).length > 0,
  'stdio server without command should fail schema validation'
);
assert.strictEqual(
  validateAgainstSchema(
    SCHEMA,
    registryWith({ purpose: 'x', transport: 'stdio', command: 'npx', args: ['-y', 'pkg'] })
  ).length,
  0,
  'stdio server with command should pass schema validation'
);

// --- schema: http servers require a url instead of a command ---
assert.ok(
  validateAgainstSchema(SCHEMA, registryWith({ purpose: 'x', transport: 'http' })).length > 0,
  'http server without url should fail schema validation'
);
assert.strictEqual(
  validateAgainstSchema(
    SCHEMA,
    registryWith({ purpose: 'x', transport: 'http', url: 'http://127.0.0.1:8000/mcp' })
  ).length,
  0,
  'http server with url (and no command) should pass schema validation'
);

// --- schema: unknown transports are rejected ---
assert.ok(
  validateAgainstSchema(
    SCHEMA,
    registryWith({ purpose: 'x', transport: 'websocket', url: 'ws://localhost' })
  ).length > 0,
  'unknown transport should fail schema validation'
);

// --- catalog: the official UE 5.8 in-editor server is pre-wired over http ---
const registry = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'mcp-configs', 'mcp-servers.json'), 'utf8')
);
const unreal = registry.servers['unreal-editor'];
assert.ok(unreal, "catalog should define an 'unreal-editor' server");
assert.strictEqual(unreal.transport, 'http', 'unreal-editor should use the http transport');
assert.strictEqual(
  unreal.url,
  'http://127.0.0.1:8000/mcp',
  'unreal-editor should point at the official in-editor MCP endpoint'
);

// --- generated configs: http servers are emitted in each harness's shape ---
const universal = JSON.parse(fs.readFileSync(path.join(repoRoot, '.mcp.json'), 'utf8'));
assert.deepStrictEqual(
  universal.mcpServers['unreal-editor'],
  { type: 'http', url: 'http://127.0.0.1:8000/mcp' },
  '.mcp.json should carry unreal-editor as a type:http server'
);

const opencode = JSON.parse(
  fs.readFileSync(path.join(repoRoot, '.opencode', 'opencode.json'), 'utf8')
);
assert.deepStrictEqual(
  opencode.mcp['unreal-editor'],
  { type: 'remote', url: 'http://127.0.0.1:8000/mcp', enabled: true },
  'opencode.json should carry unreal-editor as a type:remote server'
);

const kilo = JSON.parse(fs.readFileSync(path.join(repoRoot, '.kilo', 'kilo.json'), 'utf8'));
assert.deepStrictEqual(
  kilo.mcp['unreal-editor'],
  { type: 'remote', url: 'http://127.0.0.1:8000/mcp', enabled: true },
  '.kilo/kilo.json should carry unreal-editor as a type:remote server'
);
assert.strictEqual(
  kilo.$schema,
  'https://app.kilo.ai/config.json',
  '.kilo/kilo.json should declare the Kilo config schema'
);
assert.strictEqual(
  kilo.mcp['fal-media'].environment.FAL_KEY,
  '{env:FAL_KEY}',
  '.kilo/kilo.json should use Kilo {env:VAR} interpolation, not ${VAR}'
);

const codexToml = fs.readFileSync(
  path.join(repoRoot, 'mcp-configs', 'generated', 'codex.toml'),
  'utf8'
);
assert.ok(
  codexToml.includes('[mcp_servers.unreal-editor]') &&
    codexToml.includes('url = "http://127.0.0.1:8000/mcp"'),
  'codex.toml should carry unreal-editor as a url-based server'
);

// --- catalog: Unity's official MCP server (Unity CLI) is the pre-wired default ---
// `unity mcp` is the stdio server the CLI itself writes into client configs; the
// bare `unity` command keeps the committed configs portable.
const unity = registry.servers['unity-editor'];
assert.ok(unity, "catalog should define a 'unity-editor' server");
assert.strictEqual(unity.command, 'unity', 'unity-editor should launch the Unity CLI by its bare name');
assert.deepStrictEqual(unity.args, ['mcp'], 'unity-editor should start the CLI MCP stdio server');
assert.deepStrictEqual(
  universal.mcpServers['unity-editor'],
  { command: 'unity', args: ['mcp'] },
  '.mcp.json should carry the official Unity CLI server'
);
assert.ok(
  !('unity-editor-native' in registry.servers),
  'the deprecated in-Editor relay entry should be gone from the catalog'
);

// --- prewired: false keeps a portable alternative out of every committed config ---
const { runnableServers, optInServers } = require(path.join(repoRoot, 'scripts', 'lib', 'mcp-catalog.js'));
const community = registry.servers['unity-editor-community'];
assert.ok(community, "catalog should define a 'unity-editor-community' server");
assert.strictEqual(community.prewired, false, 'the community Unity bridge must be opt-in');
assert.ok(
  !runnableServers(registry).some(([id]) => id === 'unity-editor-community') &&
    optInServers(registry).some(([id]) => id === 'unity-editor-community'),
  'opt-in servers must be excluded from runnable servers and listed as opt-in'
);
for (const [label, ids] of [
  ['.mcp.json', Object.keys(universal.mcpServers)],
  ['.opencode/opencode.json', Object.keys(opencode.mcp)],
  ['.kilo/kilo.json', Object.keys(kilo.mcp)],
]) {
  assert.ok(!ids.includes('unity-editor-community'), `opt-in servers must not leak into ${label}`);
}
assert.ok(
  !codexToml.includes('[mcp_servers.unity-editor-community]'),
  'opt-in servers must not leak into codex.toml'
);
assert.strictEqual(
  validateAgainstSchema(
    SCHEMA,
    registryWith({ purpose: 'x', transport: 'stdio', command: 'npx', prewired: false })
  ).length,
  0,
  'prewired: false should pass schema validation'
);
assert.ok(
  validateAgainstSchema(
    SCHEMA,
    registryWith({ purpose: 'x', transport: 'stdio', command: 'npx', prewired: 'no' })
  ).length > 0,
  'a non-boolean prewired should fail schema validation'
);

console.log('PASS scripts/mcp-configs.test.js');
