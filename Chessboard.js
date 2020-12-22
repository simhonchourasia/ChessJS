let initial_board = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
];
let WHITE = 0;
let BLACK = 1;
let EMP = " ";

class Chessboard {
    constructor() {
        this.board = initial_board;
        this.whiteKingChecked = false;
        this.blackKingChecked = false;
        this.canCastleKingside = [true, true];
        this.canCastleQueenside = [false, false];
    }

    // Copy constructor
    copy() {
        let ret = new Chessboard();
        ret.setBoard(this.board);
        return ret;
    }

    // Output board to console
    // White is lowercase, black is uppercase
    printBoard() {
        for (let i = 0; i < 8; i++) {
            let ret = ""
            for (let j = 0; j < 8; j++) {
                ret += this.board[i][j] + " ";
            }
            console.log(ret);
        }
        console.log("--------");
    }

    // Accessor/Mutator methods
    getPiece(i, j) {
        return this.board[i][j];
    }

    getPieceColour(piece) {
        if (piece.toUpperCase() === piece) {
            return BLACK;
        }
        return WHITE;
    }

    setBoard(board) {
        this.board = board;
    }

    setPiece(piece, row, col) {
        this.board[row][col] = piece;
    }

    // Checks if a square is empty
    checkEmpty(row, col) {
        return this.board[row][col] === EMP;
    }

    // Checks if a row or column on the board is empty (not including final or current square)
    // Return false if the initial and final positions are not in the same row or column
    checkRCEmpty(iRow, iCol, fRow, fCol) {
        // Check if in same row/column
        if ((iRow !== fRow) && (iCol !== fCol)) {
            return false;
        }

        // Across a row
        if (iRow === fRow) {
            let minC = Math.min(iCol, fCol);
            let maxC = Math.max(iCol, fCol);
            for (let c = minC + 1; c < maxC; c++) {
                if (!(this.checkEmpty(iRow, c))) {
                    return false;
                }
            }
        }

        // Across a row
        if (iCol === fCol) {
            let minR = Math.min(iRow, fRow);
            let maxR = Math.max(iRow, fRow);
            for (let r = minR + 1; r < maxR; r++) {
                if (!(this.checkEmpty(iRow, c))) {
                    return false
                }
            }
        }

        return true;
    }

    // Checks if a diagonal on the board is empty (not including final or current square)
    // Returns false if the initial and final positions are not on the same diagonal
    checkDiagonalEmpty(iRow, iCol, fRow, fCol) {
        let minR = Math.min(iRow, fRow);
        let maxR = Math.max(iRow, fRow);
        let minC = Math.min(iCol, fCol);
        let maxC = Math.max(iCol, fCol);

        // Check if in same diagonal
        if ((maxR - minR) !== (maxC - minC)) {
            return false;
        }

        for (let i = minR+1; i < maxR; i++) {
            for (let j = minC+1; j < maxC; j++) {
                if (! (this.checkEmpty(i, j))) {
                    return false;
                }
            }
        }
        return true;
    }

    // Checks if the king of the given colour is in check
    checkKingChecked(colour) {
        let kingR = -1;
        let kingC = -1;
        let kingPiece;
        if (colour == WHITE) kingPiece = 'k';
        if (colour == BLACK) kingPiece = 'K';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.getPiece(i, j) == kingPiece) {
                    kingR = i;
                    kingC = j;
                }
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // Make sure that the piece is of the opposite colour
                if (this.getPieceColour(this.getPiece(i, j) !== colour)) {
                    if(this.isAttacking(i, j, kingR, kingC)) {
                        return true;
                        console.log(true);
                    }
                }
            }
        }
        console.log(false);
        return false;
        
    }

    // Finds out if a piece at iRow, iCol is attacking the square given by fRow, fCol
    isAttacking(iRow, iCol, fRow, fCol) {
        let piece = this.getPiece(iRow, iCol);

        // First, we check if the final position is occupied by an allied piece
        if (this.getPieceColour(piece) === this.getPieceColour(piece)){
            return false;
        }

        let dR = Math.abs(iRow - fRow); // difference in row number
        let dC = Math.abs(iRow - fRow); // difference in column number

        // Knight (N/n)
        if (piece === 'n' || piece === 'N') {
            return (Math.min(dR, dC) === 1 && Math.max(dR, dC) === 2)
        }

        // Rook (R/r)
        if (piece === 'r' || piece === 'R') {
            return this.checkRCEmpty(iRow, iCol, fRow, fCol);
        }

        // Bishop (B/b)
        if (piece === 'b' || piece === 'B') {
            return this.checkDiagonalEmpty(iRow, iCol, fRow, fCol);
        }

        // King (K/k)
        if (piece === 'k' || piece === 'K') {
            return (dR <= 1 && dC <= 1);
        }

        // Queen (Q/q)
        if (piece === 'q' || piece === 'Q') {
            // Check if it is moving like a rook
            if (dRow === 0 || dCol === 0) {
                return this.checkRCEmpty(iRow, iCol, fRow, fCol);
            }
            // Otherwise it is moving like a bishop
            if (dRow === dCol) {
                return this.checkDiagonalEmpty(iRow, iCol, fRow, fCol);
            }
        }

        // Pawn (P/q)
        if (piece === 'p' || piece === 'P') {
            // White
            if (piece === 'p') {
                if (fRow - iRow === -1 && dC === 1){
                    return true;
                }
            }
            // Black
            if (piece === 'P') {
                if (fRow - iRow === 1 && dC === 1) {
                    return true;
                }
            }
        }

        // Return false if none of the above are true
        return false;
    }

    // Makes the move from initial position to final position
    // Returns true if successful, false otherwise
    makeMove(iR, iC, fR, fC) {
        let piece = this.getPiece(iR, iC);
        let pieceColour = this.getPieceColour(piece);

        // Handle castling
        /*
        if (piece === 'k' || piece === 'K') {
            if (ic === fC) {
                // Kingside
                if (Math.abs(fR - iR) == 2 &&  this.canCastleKingside[this.getPieceColour(piece)]){
                    this.setPiece(piece, fR, fC);
                }
            }
        }
        */

        // Handle en passant

        // Handle pawn movement (without capturing) and promotion
        // White
        if (piece == 'p') {
            if (fC - iC === -1 && iR === fR && this.checkEmpty(fR, fC)) {
                this.setPiece(piece, fR, fC);
                this.setPiece(EMP, iR, iC);
                // promote
                if (fR === 0) {
                    this.setPiece('q', fR, fC); // default to queen
                }
                return true;
            }
        }
        // Black
        if (piece == 'P') {
            if (fC - iC === 1 && iR === fR && this.checkEmpty(fR, fC)) {
                this.setPiece(piece, fR, fC);
                this.setPiece(EMP, iR, iC);
                // promote
                if (fR === 7) {
                    this.setPiece('Q', fR, fC);
                }
                return true;
            }
        }

        // Handle all other movement rules
        if (this.isAttacking(iR, iC, fR, fC)) {
            let futureBoard = this.copy();
            futureBoard.setPiece(piece, fR, fC);
            futureBoard.setPiece(EMP, iR, iC);
            // Make sure that the move does not leave the allied king open to check
            if (futureBoard.checkKingChecked(pieceColour)) {
                3
                //return false;
            }
            this.setPiece(piece, fR, fC);
            this.setPiece(EMP, iR, iC);
            return true;
        }
        return false;
    }
    
}