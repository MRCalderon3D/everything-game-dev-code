#!/usr/bin/env node
const path = require("path");
const fs = require("fs");

const ENGINE_PROFILES = ["unity", "unreal", "godot", "web"];

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
  // Web markers are checked first: web projects commonly contain generic
  // "assets/" paths that would otherwise false-positive as Unity.
  if (
    source.includes("index.html") ||
    source.includes("<canvas") ||
    source.includes("phaser") ||
    source.includes("requestanimationframe")
  ) {
    return "web";
  }
  if (source.includes("assets/") || source.includes(".unity") || source.includes("projectsettings/")) {
    return "unity";
  }
  if (source.includes(".uproject") || source.includes("/content/") || source.includes(".uasset") || source.includes(".umap")) {
    return "unreal";
  }
  if (source.includes("project.godot") || source.includes(".tscn") || source.includes(".tres")) {
    return "godot";
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
