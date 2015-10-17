// The controller

$(document).ready(function(){
    // rules of the game
    var game = new APP.Game();
    var board = game.getBoard();
    var player = game.getPlayer();
    var sound = new APP.Sound();
    var stats = new APP.Stats();

    var combo = 0;
    var currentCombo = 0;

    init();

    renderToolbar();

    // Event listener function for clicking on square
    $('.square').click(function() {
        var sqId = $(this).data('id');
        var square = board.getSquare(sqId);

        // check if already fired
        if(!square.getClicked()) {
            square.reveal();
            player.fire('torpedo');

            // ship hit
            if(square.getOccupied() === true) {
                var occupiedShip = game.getShip(square.getShipId());
                // get the ship id from the square and reduce that ship's hp
                occupiedShip.reduceHitPoint();
                $(this).addClass('hit');
                sound.hitSound();

                // let user know if ship is destroyed or not
                var shipSunk = occupiedShip.alertDestroyed();
                if(shipSunk) {
                    var toolbarShipSel = '.ship-' + square.getShipId() + ' .ship-name';
                    $(toolbarShipSel).addClass('destroyed');
                    sound.destroyedSound();
                }

                // add combo
                currentCombo++;
            }
            // missed
            else {
                $(this).addClass('miss');
                sound.missSound();

                // save if current combo streak is higher
                if(currentCombo > combo) {
                    combo = currentCombo;
                }

                // combo breakkkkkerrrr
                currentCombo = 0;
            }
        }
        else {
            console.log('You already fired there fool!');
        }

        // Update toobar
        renderToolbar();

        // check game over and display message
        if(game.checkGameOver() === 'WIN' || game.checkGameOver() === 'LOSE') {

            if(game.checkGameOver() === 'WIN') {
                sound.winSound();
                window.alert('You win! You are the captain now!');
                stats.save('win', combo);
            }
            else {
                window.alert('You Lose! (and you suck)');
                sound.gameOverSound();
                stats.save('lose', combo);
            }

            renderHighScores();
        }
    });

    // Function to render the toolbar
    function renderToolbar() {
        // Show number of torpedos left
        $('.tNumber').text(player.getTorp().getAmmo());

        var ships = game.getShips();

        // Setting enemy ship names and hp
        for(var i = 0; i < ships.length; i++) {
            var shipSelector = '.ship-' + ships[i].getId();

            $(shipSelector + ' .ship-name').text(game.getShip(i).getName());

            $(shipSelector + ' .ship-hp-now').text(game.getShip(i).getHitPoint());

            // Calculating ship hp percentage
            var percentage = (ships[i].getHitPoint() / ships[i].getMaxHP()) * 100;

            // If the ship has run out of health, then fill the health bar to red
            if(percentage === 0) {
                $(shipSelector + ' .progress-bar').width('100%')
                    .addClass('progress-bar-danger')
                    .removeClass('progress-bar-success');
            }
            else {
                $(shipSelector + ' .progress-bar').width(percentage + '%');
            }
        }
    }

    // Function to render highscores
    function renderHighScores() {
        // Set up highscores
        $('.games-won').text(stats.getGamesWon());
        $('.games-lost').text(stats.getGamesLost());
        $('.combo').text(stats.getCombo());
    }

    // Reset game button
    $('.reset-btn').click(function() {
        window.location.reload();
    });

    // initialise function
    function init() {
        var ships = game.getShips();

        // Setting enemy ship max hp
        for(var i = 0; i < ships.length; i++) {
            var shipSelector = '.ship-' + ships[i].getId();

            $(shipSelector + ' .ship-hp-max').text(game.getShip(i).getHitPoint());
        }

        renderHighScores();
    }
});

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

// APP is the global name space which is like a package in java
var APP = (function(module) {

    // Constructor method
    function Game() {
        // Private variables
        var _board;
        var _player;
        var _weapon;
        var _ships = [];

        // bind the Game object's this to private function scope. Otherwise the private methods will use it's own this
        var getShipLocationsFunc = getShipLocations.bind(this);
        var checkLocationsTakenFunc = checkLocationsTaken.bind(this);
        var randomShipPositionFunc = randomShipPosition.bind(this);
        var cpuPlaceShipFunc = cpuPlaceShip.bind(this);

        // array of ships data
        var _shipsData = [
            { id: 0, name: 'Aircraft Carrier', hp: 6 },
            { id: 1, name: 'Helicopter Carrier', hp: 4 },
            { id: 2, name: 'Battle Cruiser', hp: 4 },
            { id: 3, name: 'Destroyer', hp: 4 },
            { id: 4, name: 'Frigate', hp: 2 },
            { id: 5, name: 'Patrol Boat', hp: 2 },
        ];

        // Sets up a default game
        this.setupGame = function() {
            _board = new module.Board(10);

            _weapon = new module.Weapon('torpedo', 50);

            _player = new module.Player(1, false, _weapon);

            for(var i = 0; i < _shipsData.length; i++) {
                var x = new module.Ship(_shipsData[i].id, _shipsData[i].name, _shipsData[i].hp);
                _ships.push(x);
            }

            // cpu place ships
            cpuPlaceShipFunc();
        }

        /**
         * If playing against cpu, randomly place ships function
         */
        function cpuPlaceShip() {
            // loop through all the ships and randomly place them.
            for(var i = 0; i < _ships.length; i++) {
                var shipId = _ships[i].getId();
                var successfulSet = false;

                // set ship vert/ hori position
                randomShipPositionFunc(shipId);

                // if placement of the ship was not sucessful, then repeat with new start location
                while(!successfulSet) {
                    // get random start square
                    var startSquare = randomStart();

                    successfulSet = this.setShipLocation(startSquare, shipId);
                }
            }
        }

        /**
         * Place ships on the board function
         * int squareId, id of the first square
         * int shipId, id of the ship to place on square
         * return boolean, for successful placement or not
         */
        this.setShipLocation = function(squareId, shipId) {
            var locations = getShipLocationsFunc(squareId, shipId);

            // check if the locations are already taken up or not
            if(checkLocationsTakenFunc(locations) === false) {
                // setting the squares
                for(var i = 0; i < locations.length; i++) {
                    var square = _board.getSquare(locations[i]);
                    square.placeShip(shipId);
                }

                return true;
            }
            else {
                return false;
            }
        }

        /**
         * Function to return an array list of square ids for placing a ship
         * int squareId, first square id of where user wants to place a ship
         * int shipId, id of the ship the user want to place on the board
         * return square id array
         */
        function getShipLocations(squareId, shipId) {
            var shipSize = this.getShip(shipId).getHitPoint();
            var horizontal = this.getShip(shipId).getHorizontal();
            var start = squareId;

            // if the ship is horizontal
            if(horizontal) {
                var place = start + (shipSize - 1);
                var rowMax = (Math.trunc(start/10) * 10) + 9;
                var placeSquares = [];

                if(place <= rowMax) {
                    for(var i = 0; i < shipSize; i++) {
                        var x = start + i;
                        placeSquares.push(x);
                    }

                    return placeSquares;
                }
                else {
                    return placeSquares;
                }
            }
            // else if the ship is vertical
            else {
                var place = start + ((shipSize - 1) * 10);
                var colMax = 99;
                var placeSquares = [];

                if(place <= colMax) {
                    for(var i = 0; i < shipSize; i++) {
                        var x = start + (i * 10);
                        placeSquares.push(x);
                    }

                    return placeSquares;
                }
                else {
                    return placeSquares;
                }
            }
        }

        // Checks if squares are occupied or not and returns true or false
        function checkLocationsTaken(squareIds) {
            // if empty array return taken true. because we can not use that
            if(squareIds.length <= 0) {
                return true;
            }

            for(var i = 0; i < squareIds.length; i++) {
                if(this.getBoard().getSquare(squareIds[i]).getOccupied() === true) {
                    return true;
                }
            }

            return false;
        }

        // Randomize the ship position (horizontal or vertical)
        function randomShipPosition(shipId) {
            if(Math.round(Math.random())) {
                this.getShip(shipId).rotate();
            }
        }

        this.checkGameOver = function() {
            var ammo = this.getPlayer().getTorp().getAmmo();

            // assume all ships are destroyed
            var shipsAlive = false;

            for(var i = 0; i < _ships.length; i++) {
                // if there is a ship with hp then it is alive and break loop
                if(_ships[i].getHitPoint() !== 0) {
                    shipsAlive = true;
                    break;
                }
            }

            // lose
            if(ammo === 0 && shipsAlive === true) {
                return 'LOSE';
            } // win
            else if(ammo >= 0 && shipsAlive === false) {
                return 'WIN';
            }
        }

        // Randomize the ship start square
        function randomStart() {
            return Math.round((Math.random() * 100));
        }

        // Get a ship
        this.getShip = function(shipId) {
            return _ships[shipId];
        }

        // Get all ships
        this.getShips = function() {
            return _ships;
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

// Player class
var APP = (function(module) {

    // Constructor function
    function Player(id, computer, weapons) {
        var _id = id;
        var _cpu = computer;
        var _isTurn = true;
        var _torpedo = weapons;

        this.getTorp = function() {
            return _torpedo;
        }

        this.fire = function(weapon) {
            if(weapon === 'torpedo') {
                _torpedo.decrease();
            }
        }
    }

    module.Player = Player;

    return module;
})(APP || {});

// Ship Class
var APP = (function(module) {

    // Ship constructor function
    function Ship(id, name, hp) {

        // private variables
        var _id = id;
        var _name = name;
        var _maxHP = hp;
        var _hitPoint = hp;
        var _horizontal = false;
        var _alert = false;

        this.rotate = function() {
            _horizontal = true;
        }

        this.reduceHitPoint = function() {
            --_hitPoint;
        }

        this.getId = function() {
            return _id;
        }

        this.getName = function() {
            return _name;
        }

        // Size and the hp are the same thing.
        this.getHitPoint = function() {
            return _hitPoint;
        }

        this.getHorizontal = function() {
            return _horizontal;
        }

        this.getMaxHP = function() {
            return _maxHP;
        }

        this.alertDestroyed = function() {
            if(_alert === false && _hitPoint === 0) {
                var message = _name + " has been destroyed!";

                _alert = true;
                return message;
            }
        }
    }

    module.Ship = Ship;

    return module;

})(APP || {});

// Sound Class
var APP = (function(module) {

    // Sound constructor function
    function Sound() {

        // private variables
        var _explosion = new Audio('dist/sound/explosion.mp3');
        var _hit = new Audio('dist/sound/hit.mp3');
        var _miss = new Audio('dist/sound/miss.mp3');
        var _gameOverTheme = new Audio('dist/sound/game-over-theme.mp3');
        var _winTheme = new Audio('dist/sound/urf-win.mp3');

        // object to hold the sound variables
        var _soundData = {
            'explosion': _explosion,
            'hit': _hit,
            'miss': _miss,
            'game over': _gameOverTheme,
            'win': _winTheme
        }

        this.playSound = function(file) {
            _soundData[file].play();
        }

        this.missSound = function() {
            this.playSound('miss');
        }

        this.hitSound = function() {
            this.playSound('hit');
        }

        this.destroyedSound = function() {
            this.playSound('explosion');
        }

        this.winSound = function() {
            this.playSound('win');
        }

        this.gameOverSound = function() {
            this.playSound('game over');
        }
    }

    // add the sound class to the app package
    module.Sound = Sound;

    return module;

})(APP || {});
// Square class
var APP = (function(module) {

    // Constructor function
    function Square(id) {
        var _id = id;
        var _clicked = false;
        var _shipId;

        this.reveal = function() {
            _clicked = true;
        }

        this.placeShip = function(shipId) {
            _shipId = shipId;
        }

        this.getId = function() {
            return _id;
        }

        this.getClicked = function() {
            return _clicked;
        }

        this.getOccupied = function() {
            if(_shipId !== undefined) {
                return true;
            }

            return false;
        }

        this.getShipId = function() {
            return _shipId;
        }
    }

    module.Square = Square;

    return module;

})(APP || {});

// Stats class
var APP = (function(module) {

    // Constructor function
    function Stats() {
        var _gamesWon;
        var _gamesLost;
        var _comboBreaker;

        load();

        /**
         * Public method to save highscore if necessary
         */
        this.save = function(torp, outcome, combo) {
            if(outcome === 'win') {
                write('won', ++_gamesWon);
            }
            else {
                write('lost', ++_gamesLost);
            }

            if(combo > _comboBreaker) {
                write('combo', combo);
            }

            fetchData();
        }

        /**
         * Function to load
         */
        function load() {
            fetchData();

            // Set up initial scores if load fail
            if(_comboBreaker == null) {
                write('fire', 50);
                write('won', 0);
                write('lost', 0);
                write('combo', 0);
            }
        }

        /**
         * Function that gets scores from local storage
         */
        function fetchData() {
            _gamesWon = localStorage.getItem('won');
            _gamesLost = localStorage.getItem('lost');
            _comboBreaker = localStorage.getItem('combo');
        }

        function write(key, value) {
            localStorage.setItem(key, value);
        }

        this.getGamesWon = function() {
            return _gamesWon;
        }

        this.getGamesLost = function() {
            return _gamesLost;
        }

        this.getCombo = function() {
            return _comboBreaker;
        }
    }

    module.Stats = Stats;

    return module;

})(APP || {});
// Weapon class
var APP = (function(module) {
    // Constructor function
    function Weapon(name, amount) {
        var _name = name;
        var _ammo = amount;

        this.getAmmo = function() {
            return _ammo;
        }

        this.decrease = function() {
            --_ammo;
        }
    }

    module.Weapon = Weapon;

    return module;

})(APP || {});
