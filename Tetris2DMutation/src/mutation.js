import {
    MUTATION_BASE_CHANCE, MUTATION_CHANCE_PER_LEVEL, MUTATION_MAX_CHANCE,
    MUTATION_TRIGGER_MIN, MUTATION_TRIGGER_MAX, MUTATION_WARNING_DURATION,
    PIECE_TYPES, ROWS,
} from './constants.js';
import { Piece } from './piece.js';

export class MutationSystem {
    constructor() {
        this.reset();
    }

    reset() {
        this.willMutate = false;
        this.triggerRow = -1;
        this.warningActive = false;
        this.warningTimer = 0;
        this.mutationDone = false;
        this.newType = null;
    }

    preparePiece(piece, level) {
        this.reset();
        const chance = Math.min(
            MUTATION_BASE_CHANCE + MUTATION_CHANCE_PER_LEVEL * (level - 1),
            MUTATION_MAX_CHANCE
        );
        if (Math.random() < chance) {
            this.willMutate = true;
            // Pick a trigger row between 30%-70% of the board
            const triggerFraction = MUTATION_TRIGGER_MIN +
                Math.random() * (MUTATION_TRIGGER_MAX - MUTATION_TRIGGER_MIN);
            this.triggerRow = Math.floor(triggerFraction * ROWS);
            // Pick a different type
            const otherTypes = PIECE_TYPES.filter(t => t !== piece.type);
            this.newType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
        }
    }

    update(dt, piece, board) {
        if (!this.willMutate || this.mutationDone) return null;

        // Check if piece has reached the trigger row (accounting for hidden rows)
        const pieceVisibleRow = piece.y - 2; // subtract hidden rows
        if (pieceVisibleRow >= this.triggerRow && !this.warningActive) {
            this.warningActive = true;
            this.warningTimer = 0;
            piece.mutationWarning = true;
        }

        if (this.warningActive) {
            this.warningTimer += dt;
            if (this.warningTimer >= MUTATION_WARNING_DURATION) {
                // Attempt mutation
                this.warningActive = false;
                piece.mutationWarning = false;
                this.mutationDone = true;
                return this.attemptMutation(piece, board);
            }
        }

        return null;
    }

    attemptMutation(piece, board) {
        const newPiece = new Piece(this.newType);
        newPiece.x = piece.x;
        newPiece.y = piece.y;
        newPiece.rotation = piece.rotation % Piece.getRotationCount();

        // Validate the new shape fits
        if (board.isValid(newPiece)) {
            newPiece.mutated = true;
            return newPiece;
        }

        // Try rotation 0 as fallback
        newPiece.rotation = 0;
        if (board.isValid(newPiece)) {
            newPiece.mutated = true;
            return newPiece;
        }

        // Mutation cancelled — doesn't fit
        return null;
    }
}
