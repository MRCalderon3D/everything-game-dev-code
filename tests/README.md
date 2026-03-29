# tests/

The test suite verifies that the scaffold remains internally consistent. Tests check that documentation maps match actual files, manifests conform to their schemas, hook configuration is valid, scripts include required markers, and engine isolation rules hold. They run in CI on every push.

## What the tests verify

The scaffold is self-referential — agents reference commands, commands invoke agents, orchestration documents map both. Drift between these references is silent: the scaffold still loads, but routes work incorrectly or invokes agents that no longer exist.

Tests make this drift visible before it causes problems:

- documentation maps stay in sync with actual agent and command files
- manifests are well-formed and conform to their declared schemas
- hook configuration is valid and all referenced handlers exist
- scripts contain the implementation markers required for correct behavior
- engine isolation is preserved — engine-specific rules do not bleed into the common layer

## Test structure

```
tests/
├── run-all.js               ← master test runner
├── ci/
│   └── readme.test.js       ← README completeness validation
├── hooks/
│   └── hooks-config.test.js ← validates hooks.json structure and handler references
├── integration/
│   ├── install-profile-script.test.js  ← tests profile setup execution
│   └── profile-install.test.js         ← tests installation workflow end-to-end
├── lib/
│   └── engine-isolation.test.js        ← tests that engine layers remain separate
├── schemas/
│   └── manifests-schema.test.js        ← validates manifests and schema-backed config files
└── scripts/
    └── setup-profile.test.js           ← validates setup-profile.js implementation markers
```

## Test categories

### CI tests — tests/ci/

Validates that README files exist for key folders and contain expected sections. Catches documentation gaps early in the review cycle.

### Hook tests — tests/hooks/

Validates `hooks/hooks.json`:
- all phase names are valid enum values (`PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `SessionEnd`)
- each hook entry is an object with string `matcher` and `description` fields
- referenced handler files exist in `scripts/hooks/`

### Integration tests — tests/integration/

Validates the profile installation workflow end-to-end:
- `setup-profile.js` writes the correct `profile.json` for a given engine argument
- `install-profile.js` resolves a profile ID to the correct component and module sets
- The installed file set matches the manifest declaration

### Library tests — tests/lib/

Validates engine isolation logic:
- engine-specific rule files are not present in the `common/` layer
- `common/` rule files do not contain engine-specific API references
- Profile resolution correctly identifies the active engine without cross-engine contamination

### Schema tests — tests/schemas/

Validates manifests against their schemas:
- `manifests/install-components.json` — validated against `schemas/install-components.schema.json`
- `manifests/install-modules.json` — validated against `schemas/install-modules.schema.json`
- `manifests/install-profiles.json` — validated against `schemas/install-profiles.schema.json`
- `.claude/package-manager.json` — validated against `schemas/package-manager.schema.json`
- `mcp-configs/mcp-servers.json` — validated against its schema

### Script tests — tests/scripts/

Validates that script implementations contain the required markers:
- `setup-profile.js` includes `profile-resolution`, `active_profile`, `profile.json`, and `profile` markers indicating correct implementation

## Running tests

```bash
node tests/run-all.js
```

Individual suites can be run directly:
```bash
node tests/schemas/manifests-schema.test.js
node tests/hooks/hooks-config.test.js
```

Tests use Node.js native `assert` — no external test framework required.

## Test output

Tests print pass/fail per assertion. A failure includes the file, the assertion that failed, and the expected vs. actual value. All tests must pass before a push to `main`.

The `/verify` command runs the full validation suite including these tests.

## Relationship to other folders

- **schemas/** — schema test suite validates all JSON files against the schemas defined here
- **scripts/** — script tests verify that script implementations include correct behavior markers
- **hooks/** — hook tests validate the configuration file and handler references
- **manifests/** — integration tests validate the install workflow using the manifest files
- **rules/** — library tests verify engine isolation rules are upheld in the `common/` layer
