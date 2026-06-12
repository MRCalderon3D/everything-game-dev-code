#!/usr/bin/env node
// Scaffolds a new engine layer following the conventions of the existing
// Unity, Unreal, Godot, and web layers. Generated content is a stub set with
// TODO markers that passes `npm run validate` immediately; engine expertise
// is authored afterwards.
//
//   npm run new:engine -- <id> [display name...] [--dry-run]
//
// Generates rules/<id>/, skills/<id>/ (4 starter skills),
// agents/<id>-reviewer.md, four commands, and wires the registry, manifests,
// orchestration docs, and indexes. Runs sync:wrappers itself; prints the
// remaining manual steps (author content, git add, sync:structure, validate).

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { loadEngines } = require("./lib/engines");

const repoRoot = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const positional = args.filter((arg) => arg !== "--dry-run");
const id = (positional[0] || "").trim();
const display = positional.slice(1).join(" ").trim() || (id ? id.charAt(0).toUpperCase() + id.slice(1) : "");

function fail(message) {
  console.error(`new:engine error: ${message}`);
  console.error('Usage: npm run new:engine -- <id> [display name...] [--dry-run]');
  process.exit(1);
}

if (!id) {
  fail("missing engine id.");
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  fail(`engine id '${id}' must be kebab-case ([a-z0-9-]).`);
}
if (loadEngines().some((engine) => engine.id === id)) {
  fail(`engine '${id}' already exists in manifests/engines.json.`);
}
for (const collision of [`rules/${id}`, `skills/${id}`, `agents/${id}-reviewer.md`, `commands/${id}-setup.md`]) {
  if (fs.existsSync(path.join(repoRoot, collision))) {
    fail(`'${collision}' already exists.`);
  }
}

// ---------------------------------------------------------------------------
// Planned content
// ---------------------------------------------------------------------------

// The rule-file set shared by all four existing engine layers.
const RULE_FILES = [
  "asset-pipeline",
  "build-release",
  "coding-style",
  "documentation",
  "memory",
  "networking",
  "patterns",
  "performance",
  "project-structure",
  "qa",
  "telemetry",
  "testing",
  "ui",
  "version-control",
];

const SKILLS = [
  { name: `${id}-project-structure`, summary: `Organize a ${display} project so source, assets, configuration, and tests stay predictable.` },
  { name: `${id}-coding-standards`, summary: `Define coding standards and idioms for ${display} game code.` },
  { name: `${id}-build-release`, summary: `Define build, packaging, and release workflows for ${display} projects.` },
  { name: `${id}-testing`, summary: `Define automated and manual testing expectations for ${display} projects.` },
];

const COMMANDS = [
  {
    name: `${id}-setup`,
    description: `Set up or normalize a ${display} project according to the scaffold rules.`,
    agents: [`${id}-reviewer`, "technical-design-lead", "build-engineer"],
    skills: [`${id}-project-structure`, `${id}-coding-standards`],
  },
  {
    name: `${id}-review`,
    description: `Review a ${display} project for structure, architecture, maintainability, and risk.`,
    agents: [`${id}-reviewer`, "code-reviewer"],
    skills: [`${id}-project-structure`, `${id}-coding-standards`],
  },
  {
    name: `${id}-build-fix`,
    description: `Diagnose and resolve ${display} build, packaging, or configuration issues.`,
    agents: [`${id}-reviewer`, "build-engineer"],
    skills: [`${id}-build-release`, `${id}-testing`],
  },
  {
    name: `${id}-scene-audit`,
    description: `Audit ${display} scenes, content structure, and composition patterns.`,
    agents: [`${id}-reviewer`, "qa-lead"],
    skills: [`${id}-project-structure`, `${id}-testing`],
  },
];

function titleCase(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function rulesReadme() {
  return [
    `# ${display}`,
    "",
    `Extends \`rules/common/\` with ${display}-specific conventions.`,
    "",
    "## Layering",
    "- `rules/common/` defines engine-neutral policy.",
    `- \`rules/${id}/\` adds ${display}-only implementation rules.`,
    `- ${display} rules must never prescribe patterns from the other engine layers.`,
    "",
    "## Coverage",
    ...RULE_FILES.map((name) => `- ${titleCase(name).toLowerCase()}`),
    "",
  ].join("\n");
}

function ruleStub(name) {
  return [
    `# ${display} ${titleCase(name)}`,
    "",
    `Extends \`rules/common/${name}.md\` with ${display}-specific rules.`,
    "",
    "## Purpose",
    `TODO: state what this rule layer guarantees for ${display} projects.`,
    "",
    "## Scope",
    `TODO: describe what this rule applies to in ${display} work.`,
    "",
    "## Rules",
    `- TODO: replace with ${display}-specific rules.`,
    "",
    "## Done Criteria",
    "TODO: define when this rule is satisfied.",
    "",
  ].join("\n");
}

function skillStub(skill) {
  return [
    "---",
    `name: ${skill.name}`,
    `description: ${skill.summary}`,
    "origin: everything-game-dev-code",
    `category: ${id}`,
    "---",
    "",
    `# ${titleCase(skill.name)}`,
    "",
    "## Purpose",
    skill.summary,
    "",
    "## Use When",
    `- TODO: describe when this skill applies in ${display} work`,
    "",
    "## Inputs",
    "- TODO: list required inputs",
    "",
    "## Process",
    "1. TODO: define the repeatable process steps",
    "",
    "## Outputs",
    "- TODO: list concrete outputs",
    "",
    "## Quality Bar",
    "- is usable by contributors without tribal knowledge",
    "- respects quality bars and runtime constraints together",
    "- defines validation and ownership for the work it produces",
    "",
    "## Common Failure Modes",
    "- TODO: list the failure modes this skill prevents",
    "",
    "## Related Agents",
    `- ${id}-reviewer`,
    "- architect",
    "",
    "## Related Commands",
    `- ${id}-setup`,
    `- ${id}-review`,
    `- ${id}-build-fix`,
    "",
    "## Notes",
    "- Keep this skill aligned with the relevant rules layer and current project documentation.",
    "- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.",
    "",
  ].join("\n");
}

function reviewerAgent() {
  return [
    "---",
    `name: ${id}-reviewer`,
    `description: Reviews ${display} project structure, architecture, implementation quality, and engine-specific risks.`,
    'tools: ["Read", "Grep", "Glob"]',
    "model: sonnet",
    "---",
    "",
    `# ${id}-reviewer`,
    "",
    "## Role",
    `Reviews ${display} project structure, architecture, implementation quality, and engine-specific risks.`,
    "",
    "## Responsibilities",
    `- TODO: define the ${display}-specific review surface (project layout, gameplay architecture, performance, build health).`,
    `- Keep ${display} advice inside the ${id} layer and guard engine isolation for it.`,
    "",
    "## Uses These Skills",
    ...SKILLS.map((skill) => `- ${skill.name}`),
    "",
    "## Collaborates With",
    "- gameplay-programmer",
    "- performance-reviewer",
    "- qa-lead",
    "",
    "## Deliverables",
    `- ${id} review notes`,
    "- engine-specific risks",
    "- integration findings",
    "- repair recommendations",
    "",
    "## Activation Guidance",
    `- Use this agent when the task is clearly ${display} work.`,
    "- Keep engine-neutral outputs free of engine-specific implementation detail unless the task is engine-specific.",
    "- Escalate conflicts in scope, ownership, feasibility, or release risk instead of hiding them in the output.",
    "",
  ].join("\n");
}

function commandStub(command) {
  return [
    "---",
    `description: ${command.description}`,
    "---",
    "",
    `# /${command.name}`,
    "",
    "## Purpose",
    command.description,
    "",
    "## Use When",
    "- The task needs a repeatable command entry point rather than an ad hoc workflow.",
    "- The scope is clear enough to define expected outputs and validation.",
    "- The result should align with the scaffold rules and agent boundaries.",
    "",
    "## Invokes Agents",
    ...command.agents.map((agent) => `- ${agent}`),
    "",
    "## Required Skills",
    ...command.skills.map((skill) => `- ${skill}`),
    "",
    "## Expected Output",
    "- A structured result that can be reviewed, acted on, or handed off.",
    "- Clear assumptions, risks, and open questions where relevant.",
    "- Updated documentation or follow-up tasks when the command changes project understanding.",
    "",
    "## Notes",
    "- Keep engine-neutral commands free of engine-specific implementation detail unless an engine-specific command is being called.",
    `- TODO: add ${display}-specific guidance.`,
    "- Escalate to the relevant reviewer or specialist when risks exceed the command's normal scope.",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Planned writes and edits
// ---------------------------------------------------------------------------

const newFiles = new Map();
newFiles.set(`rules/${id}/README.md`, rulesReadme());
for (const name of RULE_FILES) {
  newFiles.set(`rules/${id}/${name}.md`, ruleStub(name));
}
for (const skill of SKILLS) {
  newFiles.set(`skills/${id}/${skill.name}/SKILL.md`, skillStub(skill));
}
newFiles.set(`agents/${id}-reviewer.md`, reviewerAgent());
for (const command of COMMANDS) {
  newFiles.set(`commands/${command.name}.md`, commandStub(command));
}

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function writeText(relPath, text) {
  const fullPath = path.join(repoRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, text, "utf8");
}

function editJson(relPath, mutate) {
  const document = JSON.parse(readText(relPath));
  mutate(document);
  return `${JSON.stringify(document, null, 2)}\n`;
}

const edits = new Map();

edits.set(
  "manifests/engines.json",
  editJson("manifests/engines.json", (doc) => {
    doc.engines.push({
      id,
      display,
      pathMarkers: [id],
      buildResolverAgent: false,
    });
  })
);

edits.set(
  "manifests/install-components.json",
  editJson("manifests/install-components.json", (doc) => {
    doc.components.push({
      id: `engine:${id}`,
      family: "engine",
      summary: `${display} rule, skill, command, and review surface.`,
      modules: [`engine-${id}`],
    });
  })
);

edits.set(
  "manifests/install-modules.json",
  editJson("manifests/install-modules.json", (doc) => {
    doc.modules["rules-core"].includes.push(`rules/${id}/**`);
    doc.modules[`engine-${id}`] = {
      includes: [`rules/${id}/**`, `skills/${id}/**`, `agents/${id}-*.md`, `commands/${id}-*.md`],
      notes: `${display} engine surface. Use with baseline components and avoid mixing with other engine packs in active production profiles.`,
    };
  })
);

edits.set(
  "manifests/install-profiles.json",
  editJson("manifests/install-profiles.json", (doc) => {
    doc.profiles.push({
      id: `${id}-production`,
      summary: `Baseline scaffold plus ${display} surface for a production project.`,
      components: [
        "baseline:rules",
        "baseline:agents",
        "baseline:commands",
        "baseline:skills",
        "baseline:docs",
        "baseline:contexts",
        `engine:${id}`,
        "domain:workflow",
        "domain:design",
        "domain:engineering-common",
        "domain:art-audio-content",
        "domain:qa-release",
      ],
    });
  })
);

function appendSection(text, section) {
  return `${text.replace(/\n+$/, "\n")}\n${section}`;
}

edits.set(
  "docs/orchestration/command-agent-map.md",
  appendSection(
    readText("docs/orchestration/command-agent-map.md"),
    [
      `## ${display} Engine Commands`,
      "",
      ...COMMANDS.flatMap((command) => [
        `### /${command.name}`,
        `Primary: \`${command.agents[0]}\``,
        "Support:",
        ...command.agents.slice(1).map((agent) => `- \`${agent}\``),
        "",
      ]),
    ]
      .join("\n")
      .replace(/\n+$/, "\n")
  )
);

const matrixText = readText("docs/orchestration/agent-skill-matrix.md");
const matrixAnchor = "## Routing Rules";
if (!matrixText.includes(matrixAnchor)) {
  fail("agent-skill-matrix.md no longer contains the '## Routing Rules' anchor.");
}
edits.set(
  "docs/orchestration/agent-skill-matrix.md",
  matrixText.replace(
    matrixAnchor,
    [
      `### ${id}-reviewer`,
      "Primary skills:",
      ...SKILLS.map((skill) => `- ${id}/${skill.name}`),
      "",
      matrixAnchor,
    ].join("\n")
  )
);

const skillsReadmeText = readText("skills/README.md");
const skillsAnchor = "## Skill file format";
if (!skillsReadmeText.includes(skillsAnchor)) {
  fail("skills/README.md no longer contains the '## Skill file format' anchor.");
}
edits.set(
  "skills/README.md",
  skillsReadmeText.replace(
    skillsAnchor,
    [
      `### ${id}/`,
      "",
      `${display} engine-specific skills. Strictly isolated from the other engine layers.`,
      "",
      "| Skill | Purpose |",
      "|-------|---------|",
      ...SKILLS.map((skill) => `| \`${skill.name}\` | ${skill.summary.replace(/\.$/, "")} |`),
      "",
      skillsAnchor,
    ].join("\n")
  )
);

let commandsReadmeText = readText("commands/README.md");
const commandRows = [
  { anchor: /\| `\/web-setup` \|[^\n]*\|/, row: `| \`/${id}-setup\` | Initialize ${display} project structure and conventions |` },
  { anchor: /\| `\/web-scene-audit` \|[^\n]*\|/, row: `| \`/${id}-review\` | Review ${display} code and content for quality and compliance |\n| \`/${id}-scene-audit\` | Audit ${display} scenes and content structure |` },
  { anchor: /\| `\/web-build-fix` \|[^\n]*\|/, row: `| \`/${id}-build-fix\` | Diagnose and resolve ${display} build failures |` },
];
for (const { anchor, row } of commandRows) {
  const match = commandsReadmeText.match(anchor);
  if (!match) {
    fail(`commands/README.md anchor not found for row insertion: ${anchor}`);
  }
  commandsReadmeText = commandsReadmeText.replace(match[0], `${match[0]}\n${row}`);
}
edits.set("commands/README.md", commandsReadmeText);

let opencodeReadme = readText(".opencode/commands/README.md");
const countMatch = opencodeReadme.match(/## Available commands \((\d+)\)/);
if (!countMatch) {
  fail(".opencode/commands/README.md no longer contains the command count heading.");
}
opencodeReadme = opencodeReadme.replace(
  countMatch[0],
  `## Available commands (${Number(countMatch[1]) + COMMANDS.length})`
);
const listLineMatch = opencodeReadme.match(/^`[^\n]+`$/m);
if (!listLineMatch) {
  fail(".opencode/commands/README.md no longer contains the backtick command list line.");
}
opencodeReadme = opencodeReadme.replace(
  listLineMatch[0],
  `${listLineMatch[0]}, ${COMMANDS.map((command) => `\`${command.name}\``).join(", ")}`
);
edits.set(".opencode/commands/README.md", opencodeReadme);

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------

if (dryRun) {
  console.log(`new:engine dry run for '${id}' (${display}) — nothing written.`);
  console.log("\nWould create:");
  for (const relPath of newFiles.keys()) {
    console.log(`  ${relPath}`);
  }
  console.log("\nWould update:");
  for (const relPath of edits.keys()) {
    console.log(`  ${relPath}`);
  }
  console.log("\nWould then run: npm run sync:wrappers");
  process.exit(0);
}

for (const [relPath, content] of newFiles) {
  writeText(relPath, content);
}
for (const [relPath, content] of edits) {
  writeText(relPath, content);
}

const wrappers = spawnSync(process.execPath, [path.join(__dirname, "generate-wrappers.js")], {
  cwd: repoRoot,
  stdio: "inherit",
});
if (wrappers.status !== 0) {
  process.exit(wrappers.status || 1);
}

console.log(`\nPASS new:engine — '${id}' (${display}) scaffolded.`);
console.log("\nNext steps:");
console.log(`  1. Author the TODO content in rules/${id}/, skills/${id}/, agents/${id}-reviewer.md, and the four commands.`);
console.log(`  2. Refine pathMarkers for '${id}' in manifests/engines.json (placeholder marker is the engine id).`);
console.log("  3. git add -A   (structure artifacts derive from tracked files)");
console.log("  4. npm run sync:structure");
console.log("  5. npm run validate && npm test");
