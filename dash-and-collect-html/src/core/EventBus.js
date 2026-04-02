// EventBus.js — Shared event emitter + event name constants

const EVENTS = {
    STATE_CHANGED:         'stateChanged',
    GAME_START:            'gameStart',
    GAME_RESTART:          'gameRestart',
    GAME_OVER:             'gameOver',
    RETURN_TO_MENU:        'returnToMenu',
    SCORE_CHANGED:         'scoreChanged',
    CHAIN_COMPLETED:       'chainCompleted',
    HIGH_SCORE_BEATEN:     'highScoreBeaten',
    COLLECTIBLE_PICKED_UP: 'collectiblePickedUp',
    PLAYER_DIED:           'playerDied',
    LANE_CHANGED:          'laneChanged',
    BIAS_CHANGED:          'biasChanged'
};

// Singleton — created once, shared by all systems
const EventBus = new Phaser.Events.EventEmitter();
