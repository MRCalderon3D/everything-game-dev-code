#!/usr/bin/env node
// Real JSON Schema validation via ajv. Every scaffold document that declares
// a local $schema pointer is validated against it (see validate-schemas.js).

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

let ajvInstance = null;
const validatorCache = new Map();

function getAjv() {
  if (ajvInstance) {
    return ajvInstance;
  }
  let Ajv;
  let addFormats;
  try {
    // The scaffold schemas use JSON Schema draft 2020-12.
    Ajv = require("ajv/dist/2020");
    addFormats = require("ajv-formats");
  } catch {
    throw new Error(
      "ajv is not installed. Run 'npm install' to enable JSON Schema validation."
    );
  }
  ajvInstance = new Ajv({ allErrors: true, strict: false });
  addFormats(ajvInstance);
  return ajvInstance;
}

function validateAgainstSchema(schemaRelPath, document) {
  let validator = validatorCache.get(schemaRelPath);
  if (!validator) {
    const schema = JSON.parse(
      fs.readFileSync(path.join(repoRoot, schemaRelPath), "utf8")
    );
    validator = getAjv().compile(schema);
    validatorCache.set(schemaRelPath, validator);
  }
  if (validator(document)) {
    return [];
  }
  return (validator.errors || []).map(
    (error) => `${error.instancePath || "/"} ${error.message}`
  );
}

module.exports = {
  validateAgainstSchema,
};
