#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { report } = require("./lib/validation");
const { repoRoot, walk } = require("./lib/structure-artifacts");

const errors = [];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function readPngInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
    throw new Error("File is not a valid PNG.");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlaceMethod = 0;
  const idatParts = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    offset += 4;
    const data = buffer.subarray(offset, offset + length);
    offset += length;
    offset += 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlaceMethod = data[12];
    } else if (type === "IDAT") {
      idatParts.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!width || !height) {
    throw new Error("PNG is missing IHDR metadata.");
  }
  if (bitDepth !== 8) {
    throw new Error(`Unsupported PNG bit depth '${bitDepth}'. Only 8-bit PNGs are supported.`);
  }
  if (![0, 2, 4, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG color type '${colorType}'.`);
  }
  if (interlaceMethod !== 0) {
    throw new Error("Interlaced PNGs are not supported by this validator.");
  }

  const channelsByColorType = {
    0: 1,
    2: 3,
    4: 2,
    6: 4,
  };
  const channels = channelsByColorType[colorType];
  const bytesPerPixel = channels;
  const rowLength = width * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idatParts));
  const expectedLength = (rowLength + 1) * height;
  if (inflated.length !== expectedLength) {
    throw new Error(
      `Unexpected decoded PNG size. Expected ${expectedLength} bytes, got ${inflated.length}.`
    );
  }

  const image = Buffer.alloc(rowLength * height);
  let inOffset = 0;
  let outOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inOffset];
    inOffset += 1;

    for (let i = 0; i < rowLength; i += 1) {
      const raw = inflated[inOffset + i];
      const left = i >= bytesPerPixel ? image[outOffset + i - bytesPerPixel] : 0;
      const up = y > 0 ? image[outOffset + i - rowLength] : 0;
      const upLeft = y > 0 && i >= bytesPerPixel ? image[outOffset + i - rowLength - bytesPerPixel] : 0;

      let value = raw;
      if (filter === 1) {
        value = (raw + left) & 0xff;
      } else if (filter === 2) {
        value = (raw + up) & 0xff;
      } else if (filter === 3) {
        value = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        value = (raw + predictor) & 0xff;
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter type '${filter}'.`);
      }

      image[outOffset + i] = value;
    }

    inOffset += rowLength;
    outOffset += rowLength;
  }

  function alphaAt(x, y) {
    if (colorType === 6) {
      return image[y * rowLength + x * channels + 3];
    }
    if (colorType === 4) {
      return image[y * rowLength + x * channels + 1];
    }
    return 255;
  }

  let alphaMin = 255;
  let alphaMax = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = alphaAt(x, y);
      if (alpha < alphaMin) {
        alphaMin = alpha;
      }
      if (alpha > alphaMax) {
        alphaMax = alpha;
      }
    }
  }

  return {
    width,
    height,
    alphaMin,
    alphaMax,
    hasAlphaChannel: colorType === 4 || colorType === 6,
    cornerAlphas: [
      alphaAt(0, 0),
      alphaAt(width - 1, 0),
      alphaAt(0, height - 1),
      alphaAt(width - 1, height - 1),
    ],
  };
}

function validateSizeObject(relManifestPath, assetId, label, value) {
  if (!isObject(value)) {
    errors.push(`${relManifestPath} asset '${assetId}' is missing '${label}' object.`);
    return;
  }
  if (!isPositiveNumber(value.width) || !isPositiveNumber(value.height)) {
    errors.push(
      `${relManifestPath} asset '${assetId}' has invalid '${label}' dimensions; width and height must be positive numbers.`
    );
  }
}

const manifestFiles = walk(repoRoot).filter((relPath) => relPath.endsWith("/generated-assets.json"));

for (const relManifestPath of manifestFiles) {
  const fullManifestPath = path.join(repoRoot, relManifestPath);
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(fullManifestPath, "utf8"));
  } catch (error) {
    errors.push(`${relManifestPath} is not valid JSON: ${error.message}`);
    continue;
  }

  if (!isPositiveNumber(manifest.version)) {
    errors.push(`${relManifestPath} must include a positive numeric 'version'.`);
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    errors.push(`${relManifestPath} must include a non-empty 'assets' array.`);
    continue;
  }

  for (const asset of manifest.assets) {
    const assetId = asset && asset.id ? String(asset.id) : "<missing-id>";
    if (!isObject(asset)) {
      errors.push(`${relManifestPath} contains an invalid asset entry.`);
      continue;
    }

    if (!asset.id || typeof asset.id !== "string") {
      errors.push(`${relManifestPath} contains an asset without a valid 'id'.`);
    }
    if (!asset.path || typeof asset.path !== "string") {
      errors.push(`${relManifestPath} asset '${assetId}' is missing a valid 'path'.`);
      continue;
    }
    if (!["transparent", "opaque", "full-bleed"].includes(asset.background_policy)) {
      errors.push(
        `${relManifestPath} asset '${assetId}' must set 'background_policy' to 'transparent', 'opaque', or 'full-bleed'.`
      );
    }

    const fullAssetPath = path.resolve(path.dirname(fullManifestPath), asset.path);
    if (!fs.existsSync(fullAssetPath)) {
      errors.push(`${relManifestPath} asset '${assetId}' references missing file '${asset.path}'.`);
      continue;
    }

    if (path.extname(fullAssetPath).toLowerCase() === ".png") {
      try {
        const png = readPngInfo(fullAssetPath);
        if (asset.background_policy === "transparent") {
          if (!png.hasAlphaChannel || png.alphaMin === 255) {
            errors.push(
              `${relManifestPath} asset '${assetId}' is marked transparent but '${asset.path}' has no usable alpha.`
            );
          }

          const cornerPolicy = asset.corner_alpha_policy || "all-zero";
          if (cornerPolicy === "all-zero" && png.cornerAlphas.some((alpha) => alpha !== 0)) {
            errors.push(
              `${relManifestPath} asset '${assetId}' is marked transparent but '${asset.path}' has opaque corners.`
            );
          }
        }
      } catch (error) {
        errors.push(`${relManifestPath} asset '${assetId}' failed PNG validation: ${error.message}`);
      }
    }

    const integration = asset.integration;
    if (integration !== undefined && !isObject(integration)) {
      errors.push(`${relManifestPath} asset '${assetId}' has invalid 'integration' metadata.`);
      continue;
    }
    if (!integration) {
      continue;
    }

    if (integration.display_size !== undefined) {
      validateSizeObject(relManifestPath, assetId, "display_size", integration.display_size);
    }

    if (
      integration.physics_role &&
      ["collidable", "projectile", "pickup"].includes(integration.physics_role)
    ) {
      validateSizeObject(relManifestPath, assetId, "body_size", integration.body_size);
    }

    if (
      isObject(integration.display_size) &&
      isObject(integration.body_size) &&
      isPositiveNumber(integration.display_size.width) &&
      isPositiveNumber(integration.display_size.height) &&
      isPositiveNumber(integration.body_size.width) &&
      isPositiveNumber(integration.body_size.height)
    ) {
      if (integration.body_size.width > integration.display_size.width * 1.5) {
        errors.push(
          `${relManifestPath} asset '${assetId}' body width is much larger than its display width.`
        );
      }
      if (integration.body_size.height > integration.display_size.height * 1.5) {
        errors.push(
          `${relManifestPath} asset '${assetId}' body height is much larger than its display height.`
        );
      }
    }
  }
}

report(errors, "PASS validate:generated-assets");
