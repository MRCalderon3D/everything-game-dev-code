// GameConfig.js — All tuning constants (replaces Unity ScriptableObjects)
// PPU = 16: Unity units × 16 = pixels

const GAME_CONFIG = {
    canvas: { width: 320, height: 180 },

    lanes: {
        positions: [128, 160, 192],   // px X for lanes 0, 1, 2
        count: 3
    },

    player: {
        dashDuration: 80,       // ms
        recoveryDuration: 50,   // ms
        spawnY: 150,            // px from top — near bottom of screen
        spriteKey: 'player-run'
    },

    spawn: {
        initialSpeed: 80,       // px/s  (5 units × 16)
        speedIncrement: 8,      // px/s  (0.5 × 16)
        maxSpeed: 320,          // px/s  (20 × 16)
        escalationDistance: 4000, // px  (250m × 16)
        lookAheadDistance: 240,  // px above camera top to trigger spawn
        recycleBuffer: 32,      // px below camera bottom to recycle
        poolSizePerChunk: 3,
        chunkHeight: 96         // px (6 units × 16)
    },

    score: {
        basePickupScore: 10,
        chainBonusScore: 50,
        coinsPerChain: 1
    },

    modifiers: {
        dashBiasDuration: 5000,   // ms
        shieldDuration: 15000,    // ms
        surgeDuration: 8000,      // ms
        surgeSpeedBonus: 48,      // px/s (3 × 16)
        surgeMultiplier: 2
    },

    colors: {
        dash:    0x33ccff,
        shield:  0x3366ff,
        surge:   0xff9919,
        grey:    0x4d4d4d,
        coinFlash: 0xffee58
    },

    parallax: {
        far:  0.1,
        mid:  0.3,
        near: 0.6
    }
};
