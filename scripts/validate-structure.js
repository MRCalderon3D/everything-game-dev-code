#!/usr/bin/env node
const {
  exists,
  extractHeadingBullets,
  extractLevelThreeHeadings,
  listMarkdownBasenames,
  listSkillNames,
  readJson,
  readText,
  report,
} = require("./lib/validation");

const errors = [];

const agentNames = listMarkdownBasenames("agents");
const commandNames = listMarkdownBasenames("commands");
const skillEntries = listSkillNames();
const skillNames = new Set(skillEntries.map((entry) => entry.name));
const qualifiedSkills = new Set(skillEntries.map((entry) => entry.qualified));
const agentSet = new Set(agentNames);
const commandSet = new Set(commandNames);

const commandMapText = readText("docs/orchestration/command-agent-map.md");
const mappedCommands = new Set(
  [...commandMapText.matchAll(/^###\s+(\/[-a-z0-9]+)$/gm)].map((match) =>
    match[1].slice(1)
  )
);

for (const command of commandNames) {
  if (!mappedCommands.has(command)) {
    errors.push(`command-agent-map.md is missing command '/${command}'.`);
  }
}
for (const command of mappedCommands) {
  if (!commandSet.has(command)) {
    errors.push(`command-agent-map.md references missing command '/${command}'.`);
  }
}

const matrixText = readText("docs/orchestration/agent-skill-matrix.md");
const mappedAgents = new Set(extractLevelThreeHeadings(matrixText));
for (const agent of agentNames) {
  if (!mappedAgents.has(agent)) {
    errors.push(`agent-skill-matrix.md is missing agent '${agent}'.`);
  }
}
for (const agent of mappedAgents) {
  if (!agentSet.has(agent)) {
    errors.push(`agent-skill-matrix.md references missing agent '${agent}'.`);
  }
}

for (const command of commandNames) {
  const relPath = `commands/${command}.md`;
  const text = readText(relPath);
  const requiredSkills = extractHeadingBullets(text, "Required Skills");
  if (!requiredSkills) {
    errors.push(`${relPath} is missing a 'Required Skills' section.`);
    continue;
  }
  for (const skill of requiredSkills) {
    if (!skillNames.has(skill) && !qualifiedSkills.has(skill)) {
      errors.push(`${relPath} references unknown required skill '${skill}'.`);
    }
  }
}

// Two-way parity: every source command needs a wrapper in each mirroring
// adapter, and every wrapper needs a source command (no orphans).
const wrapperAdapters = [".claude/commands", ".codex/commands", ".opencode/commands"];

for (const adapterDir of wrapperAdapters) {
  const wrapperNames = listMarkdownBasenames(adapterDir);
  const wrapperSet = new Set(wrapperNames);
  for (const command of commandNames) {
    if (!wrapperSet.has(command)) {
      errors.push(`Missing command wrapper '${adapterDir}/${command}.md'.`);
    }
  }
  for (const wrapper of wrapperNames) {
    if (!commandSet.has(wrapper)) {
      errors.push(
        `Orphan command wrapper '${adapterDir}/${wrapper}.md' has no source in commands/.`
      );
    }
  }
}

const opencodeConfig = readJson(".opencode/opencode.json");
const opencodeCommandKeys = Object.keys(opencodeConfig.command || {});
const opencodeCommandSet = new Set(opencodeCommandKeys);
for (const command of commandNames) {
  if (!opencodeCommandSet.has(command)) {
    errors.push(`.opencode/opencode.json is missing command entry '${command}'.`);
  }
}
for (const key of opencodeCommandKeys) {
  if (!commandSet.has(key)) {
    errors.push(`.opencode/opencode.json has orphan command entry '${key}'.`);
  }
}

for (const agent of agentNames) {
  const relPath = `agents/${agent}.md`;
  const text = readText(relPath);
  const usedSkills = extractHeadingBullets(text, "Uses These Skills") || [];
  for (const skill of usedSkills) {
    if (!skillNames.has(skill) && !qualifiedSkills.has(skill)) {
      errors.push(`${relPath} references unknown skill '${skill}'.`);
    }
  }
}

for (const skill of skillEntries) {
  const text = readText(skill.file);
  const relatedAgents = extractHeadingBullets(text, "Related Agents") || [];
  const relatedCommands = extractHeadingBullets(text, "Related Commands") || [];
  const relatedSkills = extractHeadingBullets(text, "Related Skills") || [];

  for (const agent of relatedAgents) {
    if (!agentSet.has(agent)) {
      errors.push(`${skill.file} references unknown related agent '${agent}'.`);
    }
  }
  for (const command of relatedCommands) {
    if (!commandSet.has(command)) {
      errors.push(`${skill.file} references unknown related command '${command}'.`);
    }
  }
  for (const related of relatedSkills) {
    if (!skillNames.has(related) && !qualifiedSkills.has(related)) {
      errors.push(`${skill.file} references unknown related skill '${related}'.`);
    }
  }
}

// VERSION, package.json, and CHANGELOG.md must move together.
const versionValue = readText("VERSION").trim();
const changelogText = readText("CHANGELOG.md");
if (!changelogText.includes(`## ${versionValue}`)) {
  errors.push(`CHANGELOG.md has no entry for VERSION '${versionValue}'.`);
}
const packageVersion = readJson("package.json").version;
if (packageVersion !== versionValue) {
  errors.push(
    `package.json version '${packageVersion}' does not match VERSION '${versionValue}'.`
  );
}

// Every skill must appear in the skills/README.md domain index.
const skillsReadme = readText("skills/README.md");
for (const skill of skillEntries) {
  if (!skillsReadme.includes(`\`${skill.name}\``)) {
    errors.push(`skills/README.md is missing skill '${skill.qualified}'.`);
  }
}

const adapterExpectations = [
  ".claude/README.md",
  ".cursor/README.md",
  ".opencode/README.md",
  ".kiro/README.md",
  ".codex/README.md",
  ".codex/AGENTS.md",
  ".codex/commands/README.md",
  ".codex/skills/README.md",
  ".codex/rules/README.md",
  ".codex/hooks/README.md",
  ".codex/mcp/README.md",
  ".claude-plugin/plugin.json",
  "docs/harness-support.md",
];

for (const relPath of adapterExpectations) {
  if (!exists(relPath)) {
    errors.push(`Missing adapter contract file '${relPath}'.`);
  }
}

report(errors, "PASS validate:structure");
