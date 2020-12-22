let myChessBoard = new Chessboard();
myChessBoard.printBoard();

function getMove() {
    let move = prompt("Enter your move")
    move = move.split("");
    moveSuccessful = myChessBoard.makeMove(parseInt(move[0]), parseInt(move[1]), 
    parseInt(move[2]), parseInt(move[3]));
    myChessBoard.printBoard();
    return moveSuccessful;
}

for (let i = 0; i < 10; i++) {
    console.log(getMove());
}