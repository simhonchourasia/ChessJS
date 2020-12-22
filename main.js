let myChessBoard = new Chessboard();
myChessBoard.printBoard();

function getMove() {
    if (myChessBoard.currentTurn == 1){
        console.log("It is black's move.");
    }
    else {
        console.log("It is white's move.");
    }
    let move = prompt("Enter your move. ");
    
    move = move.split("");
    //console.log(move);
    moveSuccessful = myChessBoard.makeMove(parseInt(move[0]), parseInt(move[1]), 
    parseInt(move[2]), parseInt(move[3]));
    myChessBoard.printBoard();
    return moveSuccessful;
}

for (let i = 0; i < 10; i++) {
    console.log(getMove());
}