import { BASKET_MAX } from './constants.js';

export class Basket {
    constructor() {
        this.pieces = []; // array of piece type strings
    }

    reset() {
        this.pieces = [];
    }

    store(type) {
        if (this.pieces.length >= BASKET_MAX) return false;
        this.pieces.push(type);
        return true;
    }

    retrieve(index) {
        if (index < 0 || index >= this.pieces.length) return null;
        return this.pieces.splice(index, 1)[0];
    }

    isFull() {
        return this.pieces.length >= BASKET_MAX;
    }

    isEmpty() {
        return this.pieces.length === 0;
    }

    getContents() {
        return [...this.pieces];
    }

    getCount() {
        return this.pieces.length;
    }
}
