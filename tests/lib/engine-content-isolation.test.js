#!/usr/bin/env node
// Backs the scaffold's strictest promise with a real content check: no
// engine-specific layer may mention another engine's APIs or file formats.
// (engine-isolation.test.js checks manifest globs; this checks actual text.)
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

const ENGINE_MARKERS = {
  unity: /\b(MonoBehaviour|ScriptableObject|UnityEngine|ProjectSettings)\b|\.unity\b/,
  unreal: /\b(UCLASS|UPROPERTY|UFUNCTION|AActor|Blueprints?)\b|\.uasset\b|\.umap\b|\.uproject\b/,
  godot: /\b(GDScript|PackedScene|CharacterBody2D|Node2D|onready)\b|\.tscn\b|\.tres\b|project\.godot/,
};

const SCAN_ROOTS = ['rules', 'skills'];
const ENGINES = Object.keys(ENGINE_MARKERS);

function walkMarkdown(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdown(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

const violations = [];
for (const engine of ENGINES) {
  const foreignEngines = ENGINES.filter((other) => other !== engine);
  for (const root of SCAN_ROOTS) {
    const dir = path.join(repoRoot, root, engine);
    if (!fs.existsSync(dir)) {
      continue;
    }
    for (const file of walkMarkdown(dir)) {
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        for (const other of foreignEngines) {
          if (ENGINE_MARKERS[other].test(line)) {
            violations.push(
              `${path.relative(repoRoot, file).replace(/\\/g, '/')}:${index + 1} ` +
                `(${engine} layer) contains a ${other} marker: ${line.trim().slice(0, 100)}`
            );
          }
        }
      });
    }
  }
}

assert.deepStrictEqual(
  violations,
  [],
  `Cross-engine contamination detected:\n${violations.join('\n')}`
);

console.log('PASS lib/engine-content-isolation.test.js');
