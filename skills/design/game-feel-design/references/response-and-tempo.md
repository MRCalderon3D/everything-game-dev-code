# Response and tempo

Defaults for input acknowledgement and for the time the player spends waiting. Verify each one in play.

- show acceptance on the first frame of an input with a visibly different pose; never let automatic blending delay the response
- no button press should produce nothing — acknowledge even rejected input (recovery, cooldown) with a muted cue
- treat slowness as the one flaw nobody forgives: count wait time, fades, blackouts, and time-to-retry, and cut them until it feels slightly too tight
- restart after failure fast; how quickly control returns matters more than how heavy the penalty is

Source: distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). These reflect large-scale action-game experience — adapt them to the genre and scope at hand.
