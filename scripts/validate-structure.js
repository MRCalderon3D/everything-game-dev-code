#!/usr/bin/env node
const {
  exists,
  extractHeadingBullets,
  extractLevelThreeHeadings,
  listMarkdownBasenames,
  listSkillNames,
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

for (const command of commandNames) {
  const codexCommandPath = `.codex/commands/${command}.md`;
  if (!exists(codexCommandPath)) {
    errors.push(`Missing Codex command wrapper '${codexCommandPath}'.`);
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
];

for (const relPath of adapterExpectations) {
  if (!exists(relPath)) {
    errors.push(`Missing adapter contract file '${relPath}'.`);
  }
}

report(errors, "PASS validate:structure");
