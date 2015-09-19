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
