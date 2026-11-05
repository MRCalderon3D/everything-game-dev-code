#!/usr/bin/env node
// Validates every tracked JSON document that declares a local $schema pointer
// against that schema, for real, via ajv. Complements validate-manifests.js
// (cross-reference checks) by enforcing the declared structural contracts.

const fs = require("fs");
const path = require("path");
const { report, repoRoot } = require("./lib/validation");
const { walk } = require("./lib/structure-artifacts");
const { validateAgainstSchema } = require("./lib/schema-validation");

const errors = [];
const LOCAL_SCHEMA_REF = /(^|\/)schemas\/[a-z0-9-]+\.schema\.json$/;

const jsonFiles = walk(repoRoot).filter(
  (relPath) =>
    relPath.endsWith(".json") &&
    !relPath.startsWith("schemas/") &&
    !relPath.startsWith("samples/")
);

let validatedCount = 0;
for (const relPath of jsonFiles) {
  let document;
  try {
    document = JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), "utf8"));
  } catch {
    continue;
  }
  const schemaRef =
    document && typeof document.$schema === "string" ? document.$schema : "";
  if (!LOCAL_SCHEMA_REF.test(schemaRef)) {
    continue;
  }
  const schemaRelPath = path.posix.normalize(
    path.posix.join(path.posix.dirname(relPath), schemaRef)
  );
  if (!fs.existsSync(path.join(repoRoot, schemaRelPath))) {
    errors.push(`${relPath} declares missing schema '${schemaRef}'.`);
    continue;
  }
  try {
    for (const error of validateAgainstSchema(schemaRelPath, document)) {
      errors.push(`${relPath}: ${error}`);
    }
    validatedCount += 1;
  } catch (failure) {
    errors.push(failure.message);
    break;
  }
}

// Cross-field rule not expressible in JSON Schema: every MCP profile entry
// must reference a defined server.
const mcpRegistry = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "mcp-configs", "mcp-servers.json"), "utf8")
);
const serverIds = new Set(Object.keys(mcpRegistry.servers || {}));
for (const [profileName, serverList] of Object.entries(mcpRegistry.profiles || {})) {
  for (const serverId of serverList || []) {
    if (!serverIds.has(serverId)) {
      errors.push(
        `mcp-configs/mcp-servers.json profile '${profileName}' references undefined server '${serverId}'.`
      );
    }
  }
}

report(errors, `PASS validate:schemas (${validatedCount} documents validated)`);
