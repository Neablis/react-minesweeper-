var height = 0;
var width = 0;
var board = [];
var visualBoard = [];
var bombs = 0;

module.exports = {
    reset: function () {
        height = 0;
        width = 0;
        board = [];
        visualBoard = [];
        bombs = 0;
    },
    createBoard: function (w, h, b) {
        height = h;
        width = w;
        bombs = b;
        var x;
        var y;
        var bombsPlaced = 0;

        board = new Array(w);
        for (x = 0; x < w; x++) {
            board[x] = new Array(h);
        }

        visualBoard = board.map(function(arr) {
            return arr.slice();
        });

        for (x = 0; bombsPlaced < bombs; x++) {
            var xBomb = this.getRandomIntInclusive(0, width-1);
            var yBomb = this.getRandomIntInclusive(0, height-1);
            if (board[xBomb][yBomb] === undefined) {
                bombsPlaced += 1;
                board[xBomb][yBomb] = 'B';
            }
        }

        for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
                visualBoard[x][y] = 'x';
                if (board[x][y] !== 'B') {
                    board[x][y] = this.checkNeighbors(x, y);
                }
            }
        }

        return board;
    },
    checkIfBomb: function (x, y) {
        if (board[x][y] === 'B') {
            return true;
        }

        return false;
    },
    reveal: function (x, y) {
        if (visualBoard[x][y] === 0) {
            var row;
            var col;
            for(row = x-1; row <= x+1; row++){
                for(col = y-1;  col <= y+1; col++) {
                    if(!(x === row &&  y === col) && row >= 0 && col >= 0 && row < width && col < height ) {
                        if (this.getCell(row, col) === 0 && visualBoard[row][col] === 'x') {
                            this.setCell(row, col, 0);
                            this.reveal(row, col);
                        } else if (this.getCell(row, col) !== 'B') {
                            this.setCell(row, col, this.getCell(row, col));
                        }

                    }
                }
            }
        }
    },
    checkWin: function () {
        var x;
        var y;
        var unrevealed = 0;
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (visualBoard[x][y] === 'x') {
                    unrevealed += 1;
                }
            }
        }

        unrevealed -= bombs;

        if (0 >= unrevealed) {
            return true;
        }
        return false;
    },
    checkNeighbors: function (x, y) {
        var adjacentMines = 0;
        var row;
        var col;
        for(row = x-1; row <= x+1; row++){
            for(col = y-1;  col <= y+1; col++) {
                if(!(x === row &&  y === col) && row >= 0 && col >= 0 && row < width && col < height ) {
                    if (board[row][col] === 'B') {
                        adjacentMines += 1;
                    }
                }
            }
        }
        return adjacentMines;
    },
    printBoard: function (arr) {
        var row;
        var x;
        var y;

        for (x = 0; x < width; x++) {
            row = '';
            for (y = 0; y < height; y++) {
                row += '' + arr[x][y];
            }
            console.log(row);
        }
    },
    answer: function () {
        visualBoard = board;
    },
    getBombsLeft: function () {
        return bombs;
    },
    getBoard: function () {
        return visualBoard;
    },
    getCell: function (x, y) {
        return board[x][y];
    },
    setCell: function (x, y, value) {
        visualBoard[x][y] = value;
    },
    getRandomIntInclusive: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};