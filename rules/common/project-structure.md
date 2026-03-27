# Project Structure

## Purpose
Define the repository and project organization rules that keep documentation, code, content, tools, and engine-specific work coherent.

## Scope
Applies to the root repository and to all engine-specific substructures.

## Structure Principles
- Organize by clear ownership and purpose.
- Keep common and engine-specific concerns separate.
- Make high-value artifacts easy to find.
- Avoid path structures that encode fragile implementation detail.

## Root Organization
- Shared docs, rules, agents, commands, templates, schemas, and workflows belong in common top-level locations.
- Engine-specific guidance belongs in engine namespaces.
- Example projects, experiments, and prototypes should be clearly marked and isolated from production source.
- Tests, automation, and validation scripts should be discoverable and documented.

## Separation Rules
- `rules/common` contains engine-neutral policy.
- `rules/unity`, `rules/unreal`, and `rules/godot` contain engine-specific extensions.
- Shared skills live in common folders; engine execution skills live in their engine folder.
- Do not duplicate the same rule in multiple places unless one version explicitly extends the other.

## Documentation Placement
- Design docs, technical docs, production docs, QA docs, and release docs should have predictable homes.
- Templates belong in dedicated template folders, not mixed with active project docs.
- Archived material should remain accessible but clearly marked inactive.

## Asset and Content Placement
- Runtime content, source content, generated content, and third-party content must be distinguishable.
- Avoid mixing experiments, vendor drops, and shipping assets in the same paths.

## Naming and Discoverability
- Folder names should reflect domain language the team already uses.
- Filenames should favor stable identifiers over temporary milestone nicknames.
- Searchability matters more than aesthetic brevity.

## Change Rules
- Structural changes should be justified by team scale, workflow clarity, or automation needs.
- Large moves require migration notes and reference updates.

## Deliverables
- Repository map.
- Folder naming guide.
- Common versus engine-specific boundary guide.
- Archive policy.

## Done Criteria
Project structure is healthy when contributors can predict where artifacts live and engine-specific work stays isolated from shared policy.
