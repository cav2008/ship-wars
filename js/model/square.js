// Square class
var APP = (function(module) {

    // Constructor function
    function Square(id) {
        var _id = id;
        var _occupied = false;
        var _clicked = false;

        this.reveal = function() {
            _clicked = true;
        }

        this.getId = function() {
            return _id;
        }

        this.getClicked = function() {
            return _clicked;
        }
    }

    module.Square = Square;

    return module;

})(APP || {});