function minmax(chessboard, maxPlayer, depth, alpha, beta) {
    if (depth === 0 || chessboard.gameOver()) {
        return chessboard.staticEval();
    }

    if (maxPlayer) {
        let maxEval = -100000;
        possibleMoves = chessboard.getMoves();
        for (position in possibleMoves) {
            newboard = chessboard.copy();
            newboard.makeMove(position[0], position[1], position[2], position[3]);
            let eval = minmax(newboard, false, depth-1, alpha, beta);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (alpha >= beta) {
                break;
            }
        }
        return maxEval;
    }

    else {
        let minEval = 100000;
        possibleMoves = chessboard.getMoves();
        for (position in possibleMoves) {
            newboard = chessboard.copy();
            newboard.makeMove(position[0], position[1], position[2], position[3]);
            let eval = minmax(newboard, true, depth-1, alpha, beta);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (alpha >= beta) {
                break;
            }
        }
        return minEval;
    }
}