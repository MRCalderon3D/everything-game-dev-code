// Board dimensions
export const COLS = 10;
export const ROWS = 20;
export const HIDDEN_ROWS = 2;
export const TOTAL_ROWS = ROWS + HIDDEN_ROWS;
export const CELL_SIZE = 30;

// Canvas layout
export const BOARD_X = 200;
export const BOARD_Y = 60;
export const CANVAS_WIDTH = BOARD_X + COLS * CELL_SIZE + 200;
export const CANVAS_HEIGHT = BOARD_Y + ROWS * CELL_SIZE + 40;

// Timing
export const BASE_FALL_INTERVAL = 1000; // ms at level 1
export const MIN_FALL_INTERVAL = 100;   // ms at max speed
export const SOFT_DROP_INTERVAL = 50;
export const DAS_INITIAL_DELAY = 170;
export const DAS_REPEAT_DELAY = 50;
export const LOCK_DELAY = 500;
export const MUTATION_WARNING_DURATION = 500;
export const BASKET_SWAP_WINDOW = 500;
export const LINES_PER_LEVEL = 10;

// Basket
export const BASKET_MAX = 3;

// Mutation
export const MUTATION_BASE_CHANCE = 0.10;
export const MUTATION_CHANCE_PER_LEVEL = 0.02;
export const MUTATION_MAX_CHANCE = 0.40;
export const MUTATION_TRIGGER_MIN = 0.30;
export const MUTATION_TRIGGER_MAX = 0.70;

// Scoring
export const SCORE_LINES = [0, 100, 300, 500, 800];
export const SCORE_SOFT_DROP = 1;
export const SCORE_HARD_DROP = 2;
export const SCORE_MUTATION_SURVIVED = 50;

// Colors
export const COLORS = {
    background: '#0a0a1a',
    grid: '#1a1a3a',
    gridBorder: '#2a2a4a',
    panel: '#12122a',
    panelBorder: '#2a2a4a',
    text: '#e0e0ff',
    textDim: '#7070a0',
    mutationGlow: '#ff00ff',
    highlight: '#ffffff',
    pieces: {
        I: '#00f0f0',
        O: '#f0f000',
        T: '#a000f0',
        S: '#00f000',
        Z: '#f00000',
        J: '#0000f0',
        L: '#f0a000',
    },
};

// Piece types
export const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Actions
export const Actions = {
    MOVE_LEFT: 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    SOFT_DROP: 'SOFT_DROP',
    HARD_DROP: 'HARD_DROP',
    ROTATE_CW: 'ROTATE_CW',
    ROTATE_CCW: 'ROTATE_CCW',
    BASKET_STORE: 'BASKET_STORE',
    BASKET_SWAP: 'BASKET_SWAP',
    PAUSE: 'PAUSE',
    CONFIRM: 'CONFIRM',
    SELECT_1: 'SELECT_1',
    SELECT_2: 'SELECT_2',
    SELECT_3: 'SELECT_3',
};

// Key mappings
export const KEY_MAP = {
    'ArrowLeft': Actions.MOVE_LEFT,
    'a': Actions.MOVE_LEFT,
    'A': Actions.MOVE_LEFT,
    'ArrowRight': Actions.MOVE_RIGHT,
    'd': Actions.MOVE_RIGHT,
    'D': Actions.MOVE_RIGHT,
    'ArrowDown': Actions.SOFT_DROP,
    's': Actions.SOFT_DROP,
    'S': Actions.SOFT_DROP,
    'ArrowUp': Actions.ROTATE_CW,
    'w': Actions.ROTATE_CW,
    'W': Actions.ROTATE_CW,
    'z': Actions.ROTATE_CCW,
    'Z': Actions.ROTATE_CCW,
    ' ': Actions.HARD_DROP,
    'c': Actions.BASKET_STORE,
    'C': Actions.BASKET_STORE,
    'x': Actions.BASKET_SWAP,
    'X': Actions.BASKET_SWAP,
    'Escape': Actions.PAUSE,
    'p': Actions.PAUSE,
    'P': Actions.PAUSE,
    'Enter': Actions.CONFIRM,
    '1': Actions.SELECT_1,
    '2': Actions.SELECT_2,
    '3': Actions.SELECT_3,
};
