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
        this.save = function(outcome, combo) {
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