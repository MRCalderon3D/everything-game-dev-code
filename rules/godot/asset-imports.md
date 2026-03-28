# Godot Asset Imports

## Purpose
Define how external content is imported, configured, and validated in Godot projects.

## Scope
Applies to textures, sprites, audio, 3D assets, fonts, localization files, and imported source assets.

## Import Rules
- Import settings must be treated as project configuration, not ad hoc editor tweaks.
- Asset import defaults should be documented for each major asset category.
- Changes to import settings that affect memory, compression, filtering, or runtime appearance must be reviewed.

## Authoring Rules
- Keep original source assets outside runtime folders where appropriate, but maintain traceability between source and imported assets.
- Naming must support discoverability by feature, content type, and ownership.
- Avoid duplicate imported variants unless they are justified by platform or performance constraints.

## Validation Rules
- Texture compression, mipmap usage, filtering, audio import quality, and mesh settings must be validated against target platform needs.
- Localization and text assets must preserve encoding and parsing expectations.
- Asset moves and renames must be verified to avoid broken references in scenes and resources.

## Done Criteria
Asset import health is achieved when import settings are intentional, reproducible, and aligned with runtime quality and budget goals.
