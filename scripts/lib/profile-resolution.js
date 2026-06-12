#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { loadEngines, engineIds } = require("./engines");

const ENGINE_PROFILES = engineIds();

function getWorkspaceRoot() {
  return process.env.WORKSPACE_ROOT || process.cwd();
}

function readProfileState(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function getActiveProfile() {
  const raw = process.env.GAME_DEV_PROFILE || "";
  const explicitProfile = raw.trim().toLowerCase();
  if (explicitProfile) {
    return explicitProfile;
  }

  const workspaceRoot = getWorkspaceRoot();
  const profileFile = path.join(workspaceRoot, ".game-dev", "profile.json");
  const profileState = readProfileState(profileFile);
  const profileFromFile = String(profileState.active_profile || "").trim().toLowerCase();
  if (profileFromFile) {
    return profileFromFile;
  }

  const installStateFile = path.join(workspaceRoot, ".game-dev", "install-state.json");
  const installState = readProfileState(installStateFile);
  return String(installState.active_engine || "").trim().toLowerCase();
}

function detectProfileFromPaths(text) {
  const source = String(text || "").toLowerCase();
  // Registry array order is detection priority: engines with the most
  // specific markers come first (web precedes unity because web projects
  // commonly contain generic "assets/" paths).
  for (const engine of loadEngines()) {
    if (engine.pathMarkers.some((marker) => source.includes(marker))) {
      return engine.id;
    }
  }
  return "";
}

function isValidProfile(profile) {
  return ENGINE_PROFILES.includes(profile);
}

function getProfileInfo(profile = getActiveProfile()) {
  return {
    active_profile: profile || "",
    is_engine_profile: isValidProfile(profile),
    workspace_root: getWorkspaceRoot(),
  };
}

module.exports = {
  detectProfileFromPaths,
  ENGINE_PROFILES,
  getActiveProfile,
  getProfileInfo,
  getWorkspaceRoot,
  isValidProfile,
};
