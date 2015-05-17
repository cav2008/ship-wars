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