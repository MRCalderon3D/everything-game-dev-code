# schemas/

Schema files provide JSON Schema validation for the scaffold's configuration and manifest files. They enforce naming conventions, required fields, and structural constraints so that manifests, hooks, and plugin metadata remain consistent and machine-readable.

## What schemas do

The scaffold generates and consumes structured JSON files — manifests, hook configurations, profile state. Without validation, small inconsistencies in these files cause silent failures: a wrong component ID breaks an install, a malformed hook never fires, a misnamed module produces no output.

Schemas catch these errors at the source:

- they enforce field presence, type, and format before a file is used
- they document the expected structure for any contributor editing a JSON file
- they are used by `scripts/validate-manifests.js` and the test suite in `tests/schemas/`

All schemas follow [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12).

## Schema files

### Manifest schemas

| Schema | Validates |
|--------|----------|
| `install-components.schema.json` | `manifests/install-components.json` — component registry |
| `install-modules.schema.json` | `manifests/install-modules.json` — module-to-file mapping |
| `install-profiles.schema.json` | `manifests/install-profiles.json` — installation profiles |
| `install-state.schema.json` | `.game-dev/profile.json` — runtime installation state |

### Configuration schemas

| Schema | Validates |
|--------|----------|
| `hooks.schema.json` | `hooks/hooks.json` — hook event configuration |
| `package-manager.schema.json` | `.claude/package-manager.json` — harness package configuration |
| `role-matrix.schema.json` | Role-to-skill and role-to-command mapping documents |
| `plugin.schema.json` | Plugin metadata files in `plugins/` |

## Key validation rules

### Naming conventions

Component IDs must match `^(baseline|engine|domain|capability):[a-z0-9][a-z0-9-]*$`
Module names must match `^[a-z0-9][a-z0-9-]*$`
Profile IDs must match `^[a-z0-9][a-z0-9-]*$`
Hook event names are an enum: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`
Environment variable names must match `^[A-Z_][A-Z0-9_]*$`

### Strictness

Most schemas use `additionalProperties: false` — any field not in the schema causes validation to fail. The exception is `plugin.schema.json`, which uses `additionalProperties: true` to allow third-party metadata without breaking changes.

### Hook contract

A hook entry must declare both `matcher` and `description`. It must include either `command` or `script` — not both. This prevents ambiguous or silent hook entries.

## How to run validation

```bash
node scripts/validate-manifests.js
```

This validates all three manifest files against their schemas. Errors include the schema path and the invalid value, making it straightforward to locate and fix the problem.

The test suite in `tests/schemas/manifests-schema.test.js` also runs validation as part of CI.

## Relationship to other folders

- **manifests/** — the primary target of manifest schema validation
- **hooks/** — `hooks.schema.json` validates the hook configuration entry point
- **scripts/** — `validate-manifests.js` and `validate-hooks.js` use these schemas at runtime
- **tests/schemas/** — the CI test suite runs schema validation against all JSON files
- **plugins/** — `plugin.schema.json` validates any plugin metadata file contributed to the scaffold
