#!/usr/bin/env node
// Layout rules for skill folders: SKILL.md plus an optional references/ folder
// whose every file is listed in the SKILL.md's References section.
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { skillLayoutErrors } = require('../../scripts/lib/skill-layout');

function makeSkills(tree) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-layout-'));
  const skillsRoot = path.join(root, 'skills');
  for (const [rel, content] of Object.entries(tree)) {
    const full = path.join(skillsRoot, rel);
    if (content === null) {
      fs.mkdirSync(full, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
  }
  return { root, skillsRoot };
}

function check(tree) {
  const { root, skillsRoot } = makeSkills(tree);
  try {
    return skillLayoutErrors(skillsRoot);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

const PLAIN = '# Skill\n\n## Process\n1. do it\n\n## Notes\n- note\n';
const withRefs = (lines) =>
  `# Skill\n\n## Process\n1. do it\n\n## References\n${lines}\n\n## Notes\n- note\n`;

// A plain skill and a skill with fully listed references are both valid.
assert.deepStrictEqual(check({ 'design/plain/SKILL.md': PLAIN }), []);
assert.deepStrictEqual(
  check({
    'design/deep/SKILL.md': withRefs(
      '- [Hit-stop](references/hit-stop.md) — read when tuning contact feedback\n- [Camera](references/camera.md) — read when tuning follow'
    ),
    'design/deep/references/hit-stop.md': '# Hit-stop\n',
    'design/deep/references/camera.md': '# Camera\n',
  }),
  []
);

// A reference no SKILL.md lists can never be loaded.
let errors = check({
  'design/deep/SKILL.md': withRefs('- [Hit-stop](references/hit-stop.md) — read when tuning'),
  'design/deep/references/hit-stop.md': '# Hit-stop\n',
  'design/deep/references/orphan.md': '# Orphan\n',
});
assert.strictEqual(errors.length, 1);
assert.ok(errors[0].includes('skills/design/deep/references/orphan.md'));
assert.ok(errors[0].includes('not linked'));

// A link elsewhere in the SKILL.md does not count: it must be in the References section.
errors = check({
  'design/deep/SKILL.md': `# Skill\n\n## Process\n1. see [x](references/x.md)\n\n## References\n- none listed\n\n## Notes\n- n\n`,
  'design/deep/references/x.md': '# X\n',
});
assert.strictEqual(errors.length, 1);
assert.ok(errors[0].includes('not linked'));

// references/ without a References section, and the reverse.
errors = check({
  'design/deep/SKILL.md': PLAIN,
  'design/deep/references/x.md': '# X\n',
});
assert.ok(errors.some((e) => e.includes("no 'References' section")));
errors = check({ 'design/deep/SKILL.md': withRefs('- [x](references/x.md) — read when') });
assert.strictEqual(errors.length, 1);
assert.ok(errors[0].includes('no references/ folder'));

// Only Markdown files, no subfolders, no empty folder.
errors = check({
  'design/deep/SKILL.md': withRefs('- [x](references/x.md) — read when'),
  'design/deep/references/x.md': '# X\n',
  'design/deep/references/data.json': '{}',
  'design/deep/references/nested': null,
});
assert.strictEqual(errors.length, 2);
assert.ok(errors.every((e) => e.includes('Markdown files only')));
errors = check({ 'design/deep/SKILL.md': PLAIN, 'design/deep/references': null });
assert.ok(errors.some((e) => e.includes('is empty')));

// Nothing else may live next to SKILL.md.
errors = check({ 'design/plain/SKILL.md': PLAIN, 'design/plain/notes.md': '# stray\n' });
assert.strictEqual(errors.length, 1);
assert.ok(errors[0].includes('skills/design/plain/notes.md'));

// Folders without a SKILL.md (e.g. domain READMEs) are not skills and are ignored.
assert.deepStrictEqual(check({ 'design/README.md': '# design\n', 'design/empty': null }), []);

// The real scaffold must satisfy its own rules.
const repoSkills = path.resolve(__dirname, '..', '..', 'skills');
assert.deepStrictEqual(skillLayoutErrors(repoSkills), []);

console.log('PASS scripts/skill-layout.test.js');
