# Cursor Commands Adapter

This folder maps Cursor slash commands to the shared `commands/` layer.

Every `<name>.md` here is **generated** from `commands/<name>.md` by
`npm run sync:wrappers` (declared in `manifests/harnesses.json`) — do not edit
wrappers by hand; edit the shared command and re-run the sync.

## Rule
Do not redefine commands here unless Cursor-specific prompt structure is truly required.

## Adapter rule
When a Cursor workflow mentions a command, resolve it to the shared command file with the same name.
