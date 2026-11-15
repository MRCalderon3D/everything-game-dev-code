# Hit-stop

Defaults for the brief freeze on contact. Verify each one in play; every value named here should be a tuning variable.

- freeze briefly on every meaningful contact, in any genre; also on a boss kill and on the player's own defeat, so the moment registers
- scale the freeze with damage, then apply a per-move multiplier, so heavy moves read as heavy
- during the freeze, shake the receiver strongly and the attacker slightly — move only the visuals, never the hit or hurt volumes
- shake horizontally for grounded targets and add vertical only for airborne ones; start large and settle
- blend the receiver into its hurt pose over a few frames rather than snapping or holding still
- increase shake amplitude as the camera gets farther, so distant hits still read

Source: distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). These reflect large-scale action-game experience — adapt them to the genre and scope at hand.
