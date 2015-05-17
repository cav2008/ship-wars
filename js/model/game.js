// APP is the global name space which is like a package in java
var APP = (function(module) {

    // Constructor method
    function Game() {
        // Private variables
        var _board;
        var _player;
        var _weapon;

        // Sets up a default game
        this.setupGame = function() {
            _board = new module.Board(10);

            _weapon = new module.Weapon('torpedo', 30);

            _player = new module.Player(1, false, _weapon);
        }

         // Get a board
        this.getBoard = function() {
            return _board;
        }

        this.getPlayer = function() {
            return _player;
        }

        this.setupGame();
    }

    // Add Game class to APP package
    module.Game = Game;

    return module;

})(APP || {});