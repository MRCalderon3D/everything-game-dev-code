// Layout rules for a skill folder (skills/<domain>/<skill>/).
//
// A skill is a SKILL.md plus, optionally, a references/ folder of Markdown
// files that hold detail too long for the SKILL.md itself. An agent loads the
// SKILL.md always and a reference only when the SKILL.md's "## References"
// section says the task needs it — so a reference that is not listed there is
// unreachable, and anything else in the folder is clutter the agent never sees.
const fs = require("fs");
const path = require("path");

const REFERENCES_DIR = "references";

function referencesSection(text) {
  const match = text.match(/^## References\r?\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  return match ? match[1] : null;
}

/**
 * Validate every skill folder under `skillsRoot`.
 * @returns {string[]} human-readable errors, paths relative to `skillsRoot`'s parent
 */
function skillLayoutErrors(skillsRoot) {
  const errors = [];
  const label = (...parts) => path.posix.join(path.basename(skillsRoot), ...parts);

  for (const domain of fs.readdirSync(skillsRoot).sort()) {
    const domainPath = path.join(skillsRoot, domain);
    if (!fs.statSync(domainPath).isDirectory()) continue;

    for (const skill of fs.readdirSync(domainPath).sort()) {
      const skillPath = path.join(domainPath, skill);
      if (!fs.statSync(skillPath).isDirectory()) continue;
      const skillFile = path.join(skillPath, "SKILL.md");
      if (!fs.existsSync(skillFile)) continue;

      for (const entry of fs.readdirSync(skillPath).sort()) {
        if (entry !== "SKILL.md" && entry !== REFERENCES_DIR) {
          errors.push(
            `${label(domain, skill, entry)} is not allowed: a skill folder holds SKILL.md and an optional references/ folder only.`
          );
        }
      }

      const text = fs.readFileSync(skillFile, "utf8");
      const section = referencesSection(text);
      const refsPath = path.join(skillPath, REFERENCES_DIR);
      const hasRefsDir = fs.existsSync(refsPath) && fs.statSync(refsPath).isDirectory();

      if (!hasRefsDir) {
        if (section !== null) {
          errors.push(
            `${label(domain, skill, "SKILL.md")} has a 'References' section but the skill has no references/ folder.`
          );
        }
        continue;
      }

      const files = fs.readdirSync(refsPath).sort();
      if (files.length === 0) {
        errors.push(`${label(domain, skill, REFERENCES_DIR)} is empty; remove it or add a reference.`);
      }
      if (section === null) {
        errors.push(
          `${label(domain, skill, "SKILL.md")} has a references/ folder but no 'References' section listing when to read each file.`
        );
      }
      for (const file of files) {
        const filePath = path.join(refsPath, file);
        if (!fs.statSync(filePath).isFile() || !file.endsWith(".md")) {
          errors.push(
            `${label(domain, skill, REFERENCES_DIR, file)} is not allowed: references/ holds Markdown files only, no subfolders.`
          );
          continue;
        }
        if (section !== null && !section.includes(`(${REFERENCES_DIR}/${file})`)) {
          errors.push(
            `${label(domain, skill, REFERENCES_DIR, file)} is not linked from the 'References' section of its SKILL.md, so no agent will ever load it.`
          );
        }
      }
    }
  }
  return errors;
}

module.exports = { skillLayoutErrors, referencesSection };
