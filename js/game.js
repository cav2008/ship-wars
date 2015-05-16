// APP is the global name space which is like a package in java
var APP = (function(module) {

    // Constructor method
    function Game() {
        // Private variables
        var _board;

        // Sets up a default game
        this.setupGame = function() {
            _board = new module.Board(10);
        }

         // Get a board
        this.getBoard = function() {
            return _board;
        }

        this.setupGame();
    }

    // Add Game class to APP package
    module.Game = Game;

    return module;

})(APP || {});