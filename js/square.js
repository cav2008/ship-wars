// Square class
var APP = (function(module) {

    // Constructor function
    function Square(id) {
        var _id = id;

        this.getId = function() {
            return _id;
        }
    }

    module.Square = Square;

    return module;

})(APP || {});