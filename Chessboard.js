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
        this.canCastleQueenside = [true, true];
        this.currentTurn = WHITE;
        this.enPassant = [-1, -1];
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
                if (!(this.checkEmpty(r, iCol))) {
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

        for (let i = minR + 1; i < maxR; i++) {
            for (let j = minC + 1; j < maxC; j++) {
                if (!(this.checkEmpty(i, j))) {
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
                if (this.getPieceColour(this.getPiece(i, j)) !== colour) {
                    if (this.isAttacking(i, j, kingR, kingC)) {
                        return true;
                        console.log(true);
                    }
                }
            }
        }
        //console.log(false);
        return false;

    }

    // Finds out if a piece at iRow, iCol is attacking the square given by fRow, fCol
    isAttacking(iRow, iCol, fRow, fCol) {
        let piece = this.getPiece(iRow, iCol);

        // First, we check if the final position is occupied by an allied piece
        if (this.getPiece(fRow, fCol) !== EMP) {
            if (this.getPieceColour(piece) === this.getPieceColour(this.getPiece(fRow, fCol))) {
                return false;
            }
        }

        let dR = Math.abs(iRow - fRow); // difference in row number
        let dC = Math.abs(iCol - fCol); // difference in column number

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
            if (dR === 0 || dC === 0) {
                return this.checkRCEmpty(iRow, iCol, fRow, fCol);
            }
            // Otherwise it is moving like a bishop
            if (dR === dC) {
                return this.checkDiagonalEmpty(iRow, iCol, fRow, fCol);
            }
        }

        // Pawn (P/q)
        if (piece === 'p' || piece === 'P') {
            // White
            if (piece === 'p') {
                if (fRow - iRow === -1 && dC === 1) {
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
    makeMoveHelper(iR, iC, fR, fC) {
        let piece = this.getPiece(iR, iC);
        let pieceColour = this.getPieceColour(piece);

        // Handle castling
        // White
        if (piece === 'k') {
            if (iR === fR) {
                // Kingside
                if (fC - iC === 2 &&  this.canCastleKingside[WHITE]){
                    if (this.checkEmpty(iR, iC+1) && this.checkEmpty(iR, iC+2)) {
                        this.setPiece(piece, fR, fC);
                        this.setPiece('r', iR, fC-1);
                        this.setPiece(EMP, iR, iC);
                        this.setPiece(EMP, iR, iC+3);
                        return true;
                    }
                }
                // Queenside
                if (fC - iC === -2 && this.canCastleQueenside[WHITE]) {
                    if (this.checkEmpty(iR, iC-1) && this.checkEmpty(iR, iC-2) && this.checkEmpty(iR, iC-3)) {
                        this.setPiece(piece, fR, fC);
                        this.setPiece('r', iR, fC+1);
                        this.setPiece(EMP, iR, iC);
                        this.setPiece(EMP, iR, iC-3);
                        this.setPiece(EMP, iR, iC-4);
                        return true;
                    }
                }
            }
        }

        // Black
        if (piece === 'K') {
            if (iR === fR) {
                // Kingside
                if (fC - iC === 2 &&  this.canCastleKingside[BLACK]){
                    if (this.checkEmpty(iR, iC+1) && this.checkEmpty(iR, iC+2)) {
                        this.setPiece(piece, fR, fC);
                        this.setPiece('R', iR, fC-1);
                        this.setPiece(EMP, iR, iC);
                        this.setPiece(EMP, iR, iC+3);
                        return true;
                    }
                }
                // Queenside
                if (fC - iC === -2 && this.canCastleQueenside[BLACK]) {
                    if (this.checkEmpty(iR, iC-1) && this.checkEmpty(iR, iC-2) && this.checkEmpty(iR, iC-3)) {
                        this.setPiece(piece, fR, fC);
                        this.setPiece('R', iR, fC+1);
                        this.setPiece(EMP, iR, iC);
                        this.setPiece(EMP, iR, iC-3);
                        this.setPiece(EMP, iR, iC-4);
                        return true;
                    }
                }
            }
        }
        

        // Handle en passant

        // Handle pawn movement (without capturing) and promotion
        // White
        if (piece == 'p') {
            // Double move
            if (fR - iR === -2 && iC === fC && this.checkEmpty(fR, fC) && iR === 6) {
                this.setPiece(piece, fR, fC);
                this.setPiece(EMP, iR, iC);
                return true;
            }

            // Single move
            if (fR - iR === -1 && iC === fC && this.checkEmpty(fR, fC)) {
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
            // Double move
            if (fR - iR === 2 && iC === fC && this.checkEmpty(fR, fC) && iR === 1) {
                this.setPiece(piece, fR, fC);
                this.setPiece(EMP, iR, iC);
                return true;
            }
            
            // Single move
            if (fR - iR === 1 && iC === fC && this.checkEmpty(fR, fC)) {
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
                return false;
            }
            this.setPiece(piece, fR, fC);
            this.setPiece(EMP, iR, iC);
            return true;
        }
        return false;
    }

    makeMove(iR, iC, fR, fC) {
        if (this.getPieceColour(this.getPiece(iR, iC)) === this.currentTurn){
            if (this.makeMoveHelper(iR, iC, fR, fC)) {
                this.currentTurn = 1 - this.currentTurn;
                // Disallow castling on the corresponding side
                if (iR === 0 && iC === 0) {
                    this.canCastleQueenside[BLACK] = false;
                }
                if (iR === 0 && iC === 7) {
                    this.canCastleKingside[BLACK] = false;
                }
                if (iR === 7 && iC === 0) {
                    this.canCastleQueenside[WHITE] = false;
                }
                if (iR === 7 && iC === 7) {
                    this.canCastleKingside[BLACK] = false;
                }
                return true;
            }
        }
        return false;
    }

    // Returns static evaluation of position
    // Positive evaluation favours white
    // Negative evaluation favours black
    staticEval() {
        dict = {
            'p': 1, 'P': -1,
            'b': 3, 'B': -3,
            'n': 3, 'N': -3,
            'r': 5, 'R': -5,
            'q': 9, 'Q': -9,
            'k': 300, 'K': -300
        }
        ret = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                piece = this.getPiece(i, j)
                ret += dict[piece];
            }
        }
        return ret;
    }

    // Returns whether the game is over
    gameOver() {
        return false;
    }

    // Returns all possible moves from the given colour
    getMoves() {
        return [];
    }

}