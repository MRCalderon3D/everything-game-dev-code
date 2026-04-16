import { COLORS, PIECE_TYPES } from './constants.js';

// Shape definitions: each piece has 4 rotations, each rotation is a 4x4 grid
// 1 = filled, 0 = empty
const SHAPES = {
    I: [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    ],
    O: [
        [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    ],
    T: [
        [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
        [[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
        [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
    ],
    S: [
        [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]],
        [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
        [[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
    ],
    Z: [
        [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
        [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],
    ],
    J: [
        [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
        [[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],
    ],
    L: [
        [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],
        [[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
        [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
    ],
};

export class Piece {
    constructor(type) {
        this.type = type;
        this.color = COLORS.pieces[type];
        this.rotation = 0;
        this.x = 3; // spawn column
        this.y = 0; // spawn row (in hidden area)
        this.mutationWarning = false;
        this.mutated = false;
    }

    getShape() {
        return SHAPES[this.type][this.rotation];
    }

    getBlocks() {
        const shape = this.getShape();
        const blocks = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    blocks.push({ x: this.x + c, y: this.y + r });
                }
            }
        }
        return blocks;
    }

    clone() {
        const p = new Piece(this.type);
        p.x = this.x;
        p.y = this.y;
        p.rotation = this.rotation;
        p.mutationWarning = this.mutationWarning;
        p.mutated = this.mutated;
        return p;
    }

    static getShapeForPreview(type, rotation = 0) {
        return SHAPES[type][rotation];
    }

    static getColor(type) {
        return COLORS.pieces[type];
    }

    static getRandomType() {
        return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    }

    static getRotationCount() {
        return 4;
    }
}

// 7-bag randomizer: generates all 7 types in random order, then repeats
export class PieceBag {
    constructor() {
        this.bag = [];
        this.refill();
    }

    refill() {
        this.bag = [...PIECE_TYPES];
        // Fisher-Yates shuffle
        for (let i = this.bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }

    next() {
        if (this.bag.length === 0) {
            this.refill();
        }
        return this.bag.pop();
    }

    peek(count) {
        const result = [];
        const tempBag = [...this.bag];
        for (let i = 0; i < count; i++) {
            if (tempBag.length === 0) {
                // generate a new shuffled set for peeking
                const newBag = [...PIECE_TYPES];
                for (let j = newBag.length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [newBag[j], newBag[k]] = [newBag[k], newBag[j]];
                }
                tempBag.push(...newBag);
            }
            result.push(tempBag.pop());
        }
        return result;
    }
}
