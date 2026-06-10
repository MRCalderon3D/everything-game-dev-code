#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { ensureDir, writeJson } = require("./lib/utils");
const { getWorkspaceRoot } = require("./lib/profile-resolution");
const { walk } = require("./lib/structure-artifacts");

const repoRoot = path.resolve(__dirname, "..");

// Accept both the positional form and the --profile flag form so every
// documented invocation works.
function parseRequestedProfile(argv) {
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--profile" || args[i] === "-p") {
      return String(args[i + 1] || "").trim().toLowerCase();
    }
    if (!args[i].startsWith("-")) {
      return String(args[i]).trim().toLowerCase();
    }
  }
  return "";
}

const requestedProfile = parseRequestedProfile(process.argv);

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), "utf8"));
}

function normalizePath(relPath) {
  return relPath.replace(/\\/g, "/");
}

function globToRegExp(globPattern) {
  let source = normalizePath(globPattern)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "__DOUBLE_STAR__")
    .replace(/\*/g, "[^/]*")
    .replace(/__DOUBLE_STAR__/g, ".*");

  return new RegExp(`^${source}$`);
}

function collectOrderedUnique(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    result.push(value);
  }
  return result;
}

function resolveModuleFiles(moduleEntry, repoFiles) {
  const includes = (moduleEntry && moduleEntry.includes) || [];
  const excludes = (moduleEntry && moduleEntry.excludes) || [];
  const includeMatchers = includes.map(globToRegExp);
  const excludeMatchers = excludes.map(globToRegExp);

  return repoFiles.filter((file) => {
    const included = includeMatchers.some((matcher) => matcher.test(file));
    if (!included) {
      return false;
    }
    return !excludeMatchers.some((matcher) => matcher.test(file));
  });
}

function printUsage(validProfiles) {
  process.stderr.write(
    "Usage: node scripts/install-profile.js <profile>\n" +
      "       node scripts/install-profile.js --profile <profile>\n\n"
  );
  process.stderr.write("Available profiles:\n");
  for (const profile of validProfiles) {
    process.stderr.write(`  ${profile}\n`);
  }
}

const componentsDoc = readJson("manifests/install-components.json");
const modulesDoc = readJson("manifests/install-modules.json");
const profilesDoc = readJson("manifests/install-profiles.json");

const profiles = profilesDoc.profiles || [];
const validProfileIds = profiles.map((profile) => profile.id).sort();

if (!requestedProfile) {
  printUsage(validProfileIds);
  process.exit(1);
}

const profile = profiles.find((entry) => entry.id === requestedProfile);
if (!profile) {
  process.stderr.write(`Unknown profile '${requestedProfile}'.\n\n`);
  printUsage(validProfileIds);
  process.exit(2);
}

const components = new Map((componentsDoc.components || []).map((entry) => [entry.id, entry]));
const modules = modulesDoc.modules || {};
const repoFiles = walk(repoRoot);

const resolvedComponents = [];
const resolvedModules = [];
const resolvedFiles = [];

for (const componentId of profile.components || []) {
  const component = components.get(componentId);
  if (!component) {
    process.stderr.write(`Profile '${profile.id}' references unknown component '${componentId}'.\n`);
    process.exit(3);
  }

  resolvedComponents.push(componentId);
  for (const moduleId of component.modules || []) {
    const moduleEntry = modules[moduleId];
    if (!moduleEntry) {
      process.stderr.write(`Component '${componentId}' references unknown module '${moduleId}'.\n`);
      process.exit(4);
    }
    resolvedModules.push(moduleId);
    resolvedFiles.push(...resolveModuleFiles(moduleEntry, repoFiles));
  }
}

const installedComponents = collectOrderedUnique(resolvedComponents);
const installedModules = collectOrderedUnique(resolvedModules);
const installedFiles = collectOrderedUnique(resolvedFiles);
const activeEngineComponent = installedComponents.find((id) => id.startsWith("engine:")) || "";
const activeEngine = activeEngineComponent ? activeEngineComponent.split(":")[1] : "";

const workspaceRoot = getWorkspaceRoot();
const stateDir = path.join(workspaceRoot, ".game-dev");
const installedAt = new Date().toISOString();

ensureDir(stateDir);

const installState = {
  version: 1,
  active_profile: profile.id,
  installed_components: installedComponents,
  installed_modules: installedModules,
  installed_at: installedAt,
  notes: [
    `Installed from profile '${profile.id}'.`,
    "Use install-report.json for the resolved file list.",
  ],
};

if (activeEngine) {
  installState.active_engine = activeEngine;
}

const profileState = {
  active_profile: activeEngine,
  install_profile: profile.id,
  updated_at: installedAt,
};

const installReport = {
  version: 1,
  profile: {
    id: profile.id,
    summary: profile.summary,
  },
  active_engine: activeEngine,
  workspace_root: workspaceRoot,
  installed_components: installedComponents,
  installed_modules: installedModules,
  included_files: installedFiles,
};

const stateFile = path.join(stateDir, "install-state.json");
const profileFile = path.join(stateDir, "profile.json");
const reportFile = path.join(stateDir, "install-report.json");

writeJson(stateFile, installState);
writeJson(profileFile, profileState);
writeJson(reportFile, installReport);

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      profile: profile.id,
      active_engine: activeEngine,
      installed_components: installedComponents.length,
      installed_modules: installedModules.length,
      included_files: installedFiles.length,
      state_file: stateFile,
      profile_file: profileFile,
      report_file: reportFile,
    },
    null,
    2
  )
);
