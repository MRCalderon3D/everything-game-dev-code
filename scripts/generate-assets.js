#!/usr/bin/env node
// Generates real game assets (images, skyboxes, 3D models, SFX, music, speech,
// video) from text prompts via the provider registry in
// manifests/asset-providers.json. Zero dependencies — Node 18+ global fetch.
//
//   node scripts/generate-assets.js --type image --prompt "pixel-art coin" --out staging/
//   node scripts/generate-assets.js --type model3d --prompt "low poly crystal tower" --out staging/ --name tower-crystal
//   node scripts/generate-assets.js --type video --prompt "studio logo reveal" --out staging/ --dry-run
//
// Options:
//   --type <capability>   image | skybox | model3d | sfx | music | speech | video (required)
//   --prompt <text>       text prompt (required unless --input-json supplies it)
//   --out <dir>           output directory, created if missing (required)
//   --name <base>         base filename without extension (default: derived from prompt)
//   --provider <id>       provider id from the registry (default: registry defaultProvider)
//   --quality <tier>      budget | balanced | premium (default: registry defaultQuality);
//                         picks the capability's per-tier model. ASSET_GEN_QUALITY also works.
//   --model <id>          override the resolved model id (wins over --quality)
//   --seed <n>            numeric seed for reproducibility (passed through when supported)
//   --input-json <json>   raw JSON merged over the assembled request input (wins on conflict)
//   --poll-ms <n>         queue polling interval (default 3000)
//   --timeout-ms <n>      overall timeout (default 900000 = 15 min; video can be slow)
//   --confirm-over <usd>  override the registry cost threshold for this run
//   --yes                 acknowledge the estimated cost and run without the gate
//   --dry-run             print the resolved model, payload, and cost estimate; no request
//
// Cost confirmation: every run prints an estimated USD cost (from estCostUsd in
// the registry x the number of outputs). If that estimate is at or above the
// confirm threshold (registry confirmOverUsd, or --confirm-over, or the
// ASSET_GEN_CONFIRM_OVER env var) the run refuses to start and asks to be
// re-invoked with --yes — so an agent must surface the cost to the user and get
// confirmation before spending. Set ASSET_GEN_YES=1 to pre-authorize all runs.
// Estimates are approximate; the provider bills the real amount.
//
// Every downloaded file gets a <name>.provenance.json sidecar (provider, model,
// prompt, seed, request id, timestamp, source URLs) — required by the
// AI-generated asset rules in rules/common/asset-pipeline.md.
//
// The API key is read from the provider's apiKeyEnv environment variable
// (FAL_KEY for fal.ai) and is never written to disk.

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const EXTENSION_BY_CONTENT_TYPE = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "model/gltf-binary": ".glb",
  "application/x-gltf-binary": ".glb",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/ogg": ".ogg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const MEDIA_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".glb", ".gltf", ".obj", ".fbx",
  ".mp3", ".wav", ".ogg", ".flac", ".mp4", ".webm", ".mov",
]);

function fail(message) {
  console.error(`FAIL generate-assets: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const key = token.slice(2);
    if (key === "dry-run") {
      args.dryRun = true;
      continue;
    }
    if (key === "yes") {
      args.yes = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      fail(`Option --${key} requires a value.`);
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

const QUALITY_TIERS = ["budget", "balanced", "premium"];

// Resolve the quality tier: --quality, then ASSET_GEN_QUALITY, then the registry
// defaultQuality, then "balanced".
function resolveQuality(registry, args) {
  const q = args.quality || process.env.ASSET_GEN_QUALITY || registry.defaultQuality || "balanced";
  if (!QUALITY_TIERS.includes(q)) {
    fail(`Unknown --quality '${q}'. Choose one of: ${QUALITY_TIERS.join(", ")}.`);
  }
  return q;
}

// Pick the model + per-output cost for a capability: an explicit --model always
// wins; otherwise the chosen quality tier's model (byQuality); otherwise the
// capability's plain default. Returns { model, perCost }.
function resolveModel(capability, args, quality) {
  const tier = capability.byQuality && capability.byQuality[quality];
  if (args.model) {
    const perCost = tier ? tier.estCostUsd : capability.estCostUsd;
    return { model: args.model, perCost: typeof perCost === "number" ? perCost : 0 };
  }
  if (tier) return { model: tier.model, perCost: tier.estCostUsd };
  return { model: capability.model, perCost: typeof capability.estCostUsd === "number" ? capability.estCostUsd : 0 };
}

// Rough run-cost estimate: per-output cost x output count. num_images
// (image/skybox) and explicit batch counts scale it; everything else is one unit.
function estimateCostUsd(perCost, input) {
  const count = Number(input.num_images) > 0 ? Number(input.num_images) : 1;
  return perCost * count;
}

function resolveConfirmThreshold(registry, args) {
  if (args["confirm-over"] !== undefined) return Number(args["confirm-over"]);
  if (process.env.ASSET_GEN_CONFIRM_OVER !== undefined) {
    return Number(process.env.ASSET_GEN_CONFIRM_OVER);
  }
  if (typeof registry.confirmOverUsd === "number") return registry.confirmOverUsd;
  return Infinity; // no threshold configured: never gate
}

function slugify(text, maxLength) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
}

function loadRegistry() {
  const registryPath = path.join(repoRoot, "manifests", "asset-providers.json");
  return JSON.parse(fs.readFileSync(registryPath, "utf8"));
}

function resolveCapability(registry, providerId, type) {
  const provider = registry.providers.find((entry) => entry.id === providerId);
  if (!provider) {
    fail(`Unknown provider '${providerId}'. Known: ${registry.providers.map((p) => p.id).join(", ")}.`);
  }
  const capability = provider.capabilities[type];
  if (!capability) {
    fail(
      `Provider '${providerId}' has no '${type}' capability. Known: ${Object.keys(provider.capabilities).join(", ")}.`
    );
  }
  return { provider, capability };
}

function collectFileUrls(value, found) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectFileUrls(item, found);
    }
    return;
  }
  if (value && typeof value === "object") {
    if (typeof value.url === "string" && value.url.startsWith("http")) {
      found.push({
        url: value.url,
        contentType: typeof value.content_type === "string" ? value.content_type : "",
        fileName: typeof value.file_name === "string" ? value.file_name : "",
      });
      return;
    }
    for (const item of Object.values(value)) {
      collectFileUrls(item, found);
    }
    return;
  }
  if (typeof value === "string" && value.startsWith("http")) {
    const extension = path.extname(new URL(value).pathname).toLowerCase();
    if (MEDIA_EXTENSIONS.has(extension)) {
      found.push({ url: value, contentType: "", fileName: "" });
    }
  }
}

function pickExtension(file) {
  if (file.contentType && EXTENSION_BY_CONTENT_TYPE[file.contentType.split(";")[0].trim()]) {
    return EXTENSION_BY_CONTENT_TYPE[file.contentType.split(";")[0].trim()];
  }
  const fromName = file.fileName ? path.extname(file.fileName).toLowerCase() : "";
  if (MEDIA_EXTENSIONS.has(fromName)) {
    return fromName;
  }
  const fromUrl = path.extname(new URL(file.url).pathname).toLowerCase();
  if (MEDIA_EXTENSIONS.has(fromUrl)) {
    return fromUrl;
  }
  return ".bin";
}

async function requestJson(url, options, label) {
  const response = await fetch(url, options);
  const text = await response.text();
  if (!response.ok) {
    fail(`${label} returned HTTP ${response.status}: ${text.slice(0, 500)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    fail(`${label} returned non-JSON output: ${text.slice(0, 200)}`);
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const type = args.type;
  const outDir = args.out;
  if (!type) {
    fail("Missing required option --type.");
  }
  if (!outDir) {
    fail("Missing required option --out.");
  }

  const registry = loadRegistry();
  const providerId = args.provider || registry.defaultProvider;
  const { provider, capability } = resolveCapability(registry, providerId, type);
  const quality = resolveQuality(registry, args);
  const { model, perCost } = resolveModel(capability, args, quality);

  let extraInput = {};
  if (args["input-json"]) {
    try {
      extraInput = JSON.parse(args["input-json"]);
    } catch (error) {
      fail(`--input-json is not valid JSON: ${error.message}`);
    }
  }

  const input = { ...(capability.defaults || {}) };
  if (args.prompt) {
    input[capability.promptField] = args.prompt;
  }
  if (args.seed !== undefined) {
    input.seed = Number(args.seed);
  }
  Object.assign(input, extraInput);

  // Some models take no text prompt at all (e.g. image-to-3d): an explicit
  // --input-json is then the full request and the prompt requirement is waived.
  if (input[capability.promptField] === undefined && !args["input-json"]) {
    fail(`Missing --prompt (or '${capability.promptField}' inside --input-json).`);
  }

  const endpoint = `${provider.queueBaseUrl}/${model}`;

  const estUsd = estimateCostUsd(perCost, input);
  const threshold = resolveConfirmThreshold(registry, args);
  const preApproved = args.yes || process.env.ASSET_GEN_YES === "1";
  const estLabel = perCost ? `~$${estUsd.toFixed(2)}` : "unknown";

  if (args.dryRun) {
    console.log(`DRY RUN — no request sent.`);
    console.log(`provider : ${provider.id} (${provider.display})`);
    console.log(`quality  : ${quality}${args.model ? " (model overridden)" : ""}`);
    console.log(`model    : ${model}`);
    console.log(`endpoint : POST ${endpoint}`);
    console.log(`input    : ${JSON.stringify(input, null, 2)}`);
    console.log(`output   : ${capability.output} -> ${outDir}`);
    console.log(`est. cost : ${estLabel}`);
    if (Number.isFinite(threshold)) {
      console.log(
        `confirm   : runs >= $${threshold.toFixed(2)} need --yes (this run ${
          estUsd >= threshold ? "WOULD" : "would not"
        } be gated)`
      );
    }
    return;
  }

  // Cost gate: refuse to spend at or above the threshold without explicit
  // acknowledgement, so an agent must confirm the cost with the user first.
  if (estUsd >= threshold && !preApproved) {
    fail(
      `Estimated cost ${estLabel} is at or above the confirmation threshold of $${threshold.toFixed(2)}. ` +
        `Surface this cost to the user and, once they confirm, re-run with --yes (or set ASSET_GEN_YES=1 to ` +
        `pre-authorize all runs, or raise the threshold with --confirm-over / ASSET_GEN_CONFIRM_OVER). ` +
        `Cheaper options: a lower-cost model via --model, fewer outputs, or the procedural placeholder path.`
    );
  }

  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) {
    fail(
      `Environment variable ${provider.apiKeyEnv} is not set, so AI asset generation is unavailable. ` +
        `This capability is optional: without a provider key, keep using the scaffold's built-in asset tooling ` +
        `(the engine placeholder commands — /unity-placeholders, /godot-placeholders, /web-placeholders — and ` +
        `the procedural/Canvas/WebAudio pipelines), exactly as before. ` +
        `To enable generation, get a key at ${provider.docsUrl} and export it as ${provider.apiKeyEnv}; keys are never stored in the repository.`
    );
  }

  const headers = {
    Authorization: `Key ${apiKey}`,
    "Content-Type": "application/json",
  };

  console.log(`Submitting ${type} request to ${model} [${quality}] (est. ${estLabel}) ...`);
  const submitted = await requestJson(
    endpoint,
    { method: "POST", headers, body: JSON.stringify(input) },
    "Queue submit"
  );

  const requestId = submitted.request_id || "";
  const statusUrl = submitted.status_url;
  const responseUrl = submitted.response_url;
  if (!statusUrl || !responseUrl) {
    fail(`Queue submit did not return status_url/response_url: ${JSON.stringify(submitted).slice(0, 300)}`);
  }

  const pollMs = Number(args["poll-ms"] || 3000);
  const timeoutMs = Number(args["timeout-ms"] || 900000);
  const deadline = Date.now() + timeoutMs;
  let status = "";

  for (;;) {
    if (Date.now() > deadline) {
      fail(`Timed out after ${timeoutMs} ms waiting for request ${requestId} (last status: ${status}).`);
    }
    const statusDoc = await requestJson(statusUrl, { headers }, "Queue status");
    status = statusDoc.status || "";
    if (status === "COMPLETED") {
      break;
    }
    if (status !== "IN_QUEUE" && status !== "IN_PROGRESS") {
      fail(`Request ${requestId} ended with status '${status}': ${JSON.stringify(statusDoc).slice(0, 500)}`);
    }
    process.stdout.write(`  ${status.toLowerCase().replace("_", " ")}...\r`);
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }

  const result = await requestJson(responseUrl, { headers }, "Queue result");
  const files = [];
  collectFileUrls(result, files);
  const uniqueFiles = [...new Map(files.map((file) => [file.url, file])).values()];
  if (uniqueFiles.length === 0) {
    fail(`Request completed but no downloadable file URLs were found: ${JSON.stringify(result).slice(0, 500)}`);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const baseName = args.name || `${type}-${slugify(input[capability.promptField], 40) || "asset"}`;
  const written = [];

  for (let i = 0; i < uniqueFiles.length; i += 1) {
    const file = uniqueFiles[i];
    const suffix = uniqueFiles.length > 1 ? `-${i + 1}` : "";
    const extension = pickExtension(file);
    const filePath = path.join(outDir, `${baseName}${suffix}${extension}`);
    const download = await fetch(file.url);
    if (!download.ok) {
      fail(`Download of ${file.url} returned HTTP ${download.status}.`);
    }
    fs.writeFileSync(filePath, Buffer.from(await download.arrayBuffer()));
    written.push(filePath);
  }

  const provenance = {
    provider: provider.id,
    model,
    quality,
    type,
    prompt: input[capability.promptField],
    input,
    seed: input.seed !== undefined ? input.seed : null,
    requestId,
    generatedAt: new Date().toISOString(),
    sourceUrls: uniqueFiles.map((file) => file.url),
    files: written.map((filePath) => path.basename(filePath)),
    license: `Generated via ${provider.display}; review provider and upstream model license terms before shipping.`,
  };
  const provenancePath = path.join(outDir, `${baseName}.provenance.json`);
  fs.writeFileSync(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`);

  console.log(`PASS generate-assets: ${written.length} file(s) written.`);
  for (const filePath of written) {
    console.log(`  ${filePath}`);
  }
  console.log(`  ${provenancePath}`);
}

main().catch((error) => {
  fail(error && error.stack ? error.stack : String(error));
});
