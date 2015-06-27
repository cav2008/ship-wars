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
