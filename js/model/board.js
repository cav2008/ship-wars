// Board Class
var APP = (function(module) {

    // Constructor function
    function Board(size) {
        var _boardSize = size;
        var _squares = [];

        this.createSquares = function(size) {
            var loop = size * size;

            for(var i = 0; i < loop; i++) {
                var square = new module.Square(i);
                _squares.push(square);
            }
        }

        this.getSquares = function() {
            return _squares;
        }

        this.getSquare = function(squareId) {
            return _squares[squareId];
        }

        this.createSquares(size);
    }

    // Add the class to the module
    module.Board = Board;

    return module;

})(APP || {});
