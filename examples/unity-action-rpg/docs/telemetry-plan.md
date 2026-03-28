# Ashen Veil Telemetry Plan

## Questions To Answer

- Which encounters create the highest retry rate in the slice?
- How many players reach the first traversal unlock without opening the pause menu tutorial?
- Where do players abandon the slice after loading a saved game?

## Suggested Events

- `slice_start`
- `slice_complete`
- `encounter_start`
- `encounter_fail`
- `encounter_complete`
- `unlock_acquired`
- `save_created`
- `save_loaded`

## Critical Dimensions

- encounter_id
- player_level_band
- equipped_weapon_type
- input_device
- average_fps_bucket
- load_origin

## Review Notes

- Instrument only the events needed for the first slice decision.
- Keep event names stable across tuning passes so playtest comparisons remain usable.
