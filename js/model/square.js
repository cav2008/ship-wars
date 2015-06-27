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
