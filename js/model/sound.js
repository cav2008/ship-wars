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