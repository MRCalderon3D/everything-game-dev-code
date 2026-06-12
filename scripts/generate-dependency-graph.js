#!/usr/bin/env node
// Generates docs/orchestration/dependency-graph.md — Mermaid graphs of
// command -> agent and command -> skill edges, grouped by the sections of
// command-agent-map.md, plus an orphaned-skills report (skills referenced by
// no command and no agent).
//
//   node scripts/generate-dependency-graph.js          rewrite in place
//   node scripts/generate-dependency-graph.js --check  exit 1 on drift

const fs = require("fs");
const path = require("path");
const {
  extractHeadingBullets,
  listMarkdownBasenames,
  listSkillNames,
  readText,
  repoRoot,
} = require("./lib/validation");

const checkOnly = process.argv.includes("--check");
const OUTPUT_PATH = "docs/orchestration/dependency-graph.md";

// --- Collect data ------------------------------------------------------------

const commands = listMarkdownBasenames("commands").sort();
const commandData = new Map();
for (const command of commands) {
  const text = readText(`commands/${command}.md`);
  commandData.set(command, {
    agents: extractHeadingBullets(text, "Invokes Agents") || [],
    skills: extractHeadingBullets(text, "Required Skills") || [],
  });
}

// Section grouping mirrors command-agent-map.md, the routing source of truth.
const mapText = readText("docs/orchestration/command-agent-map.md");
const sections = [];
for (const match of mapText.matchAll(/^## (.+)$/gm)) {
  sections.push({ title: match[1].trim(), index: match.index, commands: [] });
}
for (const match of mapText.matchAll(/^### \/([-a-z0-9]+)$/gm)) {
  const owner = [...sections].reverse().find((section) => section.index < match.index);
  if (owner && commandData.has(match[1])) {
    owner.commands.push(match[1]);
  }
}
const groups = sections.filter((section) => section.commands.length > 0);

// --- Build the document --------------------------------------------------------

function nodeId(prefix, name) {
  return `${prefix}_${name.replace(/[^a-z0-9]/gi, "_")}`;
}

const lines = [
  "# Dependency Graph",
  "",
  "Generated from `commands/*.md` (Invokes Agents, Required Skills) and the section grouping of `command-agent-map.md`. Update with `npm run sync:graph` — do not edit by hand.",
  "",
  "Legend: rectangles are commands, rounded nodes are agents (solid arrows = invokes), hexagons are skills (dotted arrows = requires).",
  "",
];

for (const group of groups) {
  lines.push(`## ${group.title}`, "", "```mermaid", "graph LR");
  const declared = new Set();
  const edges = [];
  for (const command of group.commands) {
    const data = commandData.get(command);
    const commandNode = nodeId("c", command);
    if (!declared.has(commandNode)) {
      declared.add(commandNode);
      lines.push(`  ${commandNode}["/${command}"]:::command`);
    }
    for (const agent of data.agents) {
      const agentNode = nodeId("a", agent);
      if (!declared.has(agentNode)) {
        declared.add(agentNode);
        lines.push(`  ${agentNode}("${agent}"):::agent`);
      }
      edges.push(`  ${commandNode} --> ${agentNode}`);
    }
    for (const skill of data.skills) {
      const skillNode = nodeId("s", skill);
      if (!declared.has(skillNode)) {
        declared.add(skillNode);
        lines.push(`  ${skillNode}{{"${skill}"}}:::skill`);
      }
      edges.push(`  ${commandNode} -.-> ${skillNode}`);
    }
  }
  lines.push(...edges);
  lines.push("  classDef command fill:#1f6feb,color:#ffffff,stroke:#0d419d");
  lines.push("  classDef agent fill:#238636,color:#ffffff,stroke:#196c2e");
  lines.push("  classDef skill fill:#9e6a03,color:#ffffff,stroke:#7d4e00");
  lines.push("```", "");
}

// --- Orphaned skills -----------------------------------------------------------

const referencedSkills = new Set();
for (const data of commandData.values()) {
  for (const skill of data.skills) {
    referencedSkills.add(skill.includes("/") ? skill.split("/").pop() : skill);
  }
}
for (const agent of listMarkdownBasenames("agents")) {
  const text = readText(`agents/${agent}.md`);
  for (const skill of extractHeadingBullets(text, "Uses These Skills") || []) {
    referencedSkills.add(skill.includes("/") ? skill.split("/").pop() : skill);
  }
}

const allSkills = listSkillNames();
const orphans = allSkills
  .filter((skill) => !referencedSkills.has(skill.name))
  .map((skill) => skill.qualified)
  .sort();

lines.push("## Orphaned Skills", "");
lines.push(
  `Skills referenced by no command (Required Skills) and no agent (Uses These Skills): ${orphans.length} of ${allSkills.length}. These are reachable only through the agent-skill matrix or ad hoc use — candidates for a command entry point or an explicit agent assignment.`,
  ""
);
for (const orphan of orphans) {
  lines.push(`- \`${orphan}\``);
}
lines.push("");

const output = lines.join("\n");

// --- Write or check --------------------------------------------------------------

const fullPath = path.join(repoRoot, OUTPUT_PATH);
const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8").replace(/\r\n/g, "\n") : null;

if (checkOnly) {
  if (current !== output) {
    console.error(`ERROR: ${OUTPUT_PATH} is out of sync. Run 'npm run sync:graph'.`);
    process.exit(1);
  }
  console.log(`PASS validate:graph (${groups.length} sections, ${orphans.length} orphaned skills)`);
} else {
  fs.writeFileSync(fullPath, output, "utf8");
  console.log(`PASS sync:graph (${groups.length} sections, ${orphans.length} orphaned skills)`);
}
