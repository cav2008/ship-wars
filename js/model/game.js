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

            _weapon = new module.Weapon('torpedo', 60);

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
                    console.log('random start point at: ', startSquare);

                    successfulSet = this.setShipLocation(startSquare, shipId);
                    console.log('placed successfully: ', successfulSet);
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
            console.log('locations: ', locations);

            // check if the locations are already taken up or not
            console.log('checking taken: ', checkLocationsTakenFunc(locations));
            if(checkLocationsTakenFunc(locations) === false) {
                // setting the squares
                for(var i = 0; i < locations.length; i++) {
                    var square = _board.getSquare(locations[i]);
                    square.placeShip(shipId);
                }

                return true;
            }
            else {
                console.log('Move bitch, get out of the way');

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
                    console.log('No space to place ship');

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
                    console.log('No space to place ship');

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
            console.log('checking game over');
            var ammo = this.getPlayer().getTorp().getAmmo();

            // assume all ships are destroyed
            var shipsAlive = false;

            for(var i = 0; i < _ships.length; i++) {
                // if there is a ship with hp then it is alive and break loop
                console.log('ship health: ', _ships[i].getName(),  _ships[i].getHitPoint());
                if(_ships[i].getHitPoint() !== 0) {
                    shipsAlive = true;
                    break;
                }
            }

            console.log('ships alive :', shipsAlive);

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
