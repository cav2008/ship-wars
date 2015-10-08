// Stats class
var APP = (function(module) {

    // Constructor function
    function Stats() {
        var _lowestTorpFire;
        var _gamesWon;
        var _gamesLost;
        var _comboBreaker;

        load();

        /**
         * Public method to save highscore if necessary
         */
        this.save = function(torp, outcome, combo) {
            if(torp < _lowestTorpFire) {
                write('fire', torp);
            }

            if(outcome === 'win') {
                write('won', ++_gamesWon);
            }
            else {
                write('lost', ++_gamesLost);
            }

            if(combo > _comboBreaker) {
                write('combo', combo);
            }
        }

        /**
         * Function that writes to local storage
         */
        function load() {
            _lowestTorpFire = localStorage.getItem('fire');
            _gamesWon = localStorage.getItem('won');
            _gamesLost = localStorage.getItem('lost');
            _comboBreaker = localStorage.getItem('combo');
        }

        function write(key, value) {
            localStorage.setItem(key, value);
        }

        this.getLowestTorpFire = function() {
            return _lowestTorpFire;
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