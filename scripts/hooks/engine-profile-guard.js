#!/usr/bin/env node
const { flattenEventText, readEvent, result } = require("../lib/utils");
const { detectProfileFromPaths, ENGINE_PROFILES, getActiveProfile, isValidProfile } = require("../lib/profile-resolution");

(async function main() {
  const event = await readEvent();
  const source = flattenEventText(event);
  const active = getActiveProfile();
  const detected = detectProfileFromPaths(source);
  const needsProfile = Boolean(detected);

  let status = "ok";
  let severity = "info";
  let message = "No engine profile issue detected.";

  if (needsProfile && !isValidProfile(active)) {
    status = "attention";
    severity = "warning";
    message = `Detected likely ${detected} work but no active GAME_DEV_PROFILE is set. Activate one of ${ENGINE_PROFILES.join(", ")} before continuing.`;
  } else if (needsProfile && active && active !== detected) {
    status = "attention";
    severity = "warning";
    message = `Detected likely ${detected} work but the active profile is ${active}. Verify that the correct engine layer is active before continuing.`;
  }

  result({
    ok: true,
    status,
    title: "Engine profile guard",
    message,
    severity,
    tags: ["profile", "engine-isolation", "workflow"],
    data: {
      active_profile: active,
      detected_profile: detected,
      needs_profile: needsProfile
    }
  });
})().catch((error) => {
  result({
    ok: false,
    status: "error",
    title: "Engine profile guard",
    message: error && error.message ? error.message : "Unexpected hook failure.",
    severity: "error",
    tags: ["profile", "engine-isolation", "workflow"]
  });
});
