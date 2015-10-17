// The controller

$(document).ready(function(){
    // rules of the game
    var game = new APP.Game();
    var board = game.getBoard();
    var player = game.getPlayer();
    var sound = new APP.Sound();
    var stats = new APP.Stats();

    var combo = 0;
    var currentCombo = 0;

    init();

    renderToolbar();

    // Event listener function for clicking on square
    $('.square').click(function() {
        var sqId = $(this).data('id');
        var square = board.getSquare(sqId);

        // check if already fired
        if(!square.getClicked()) {
            square.reveal();
            player.fire('torpedo');

            // ship hit
            if(square.getOccupied() === true) {
                var occupiedShip = game.getShip(square.getShipId());
                // get the ship id from the square and reduce that ship's hp
                occupiedShip.reduceHitPoint();
                $(this).addClass('hit');
                sound.hitSound();

                // let user know if ship is destroyed or not
                var shipSunk = occupiedShip.alertDestroyed();
                if(shipSunk) {
                    var toolbarShipSel = '.ship-' + square.getShipId() + ' .ship-name';
                    $(toolbarShipSel).addClass('destroyed');
                    sound.destroyedSound();
                }

                // add combo
                currentCombo++;
            }
            // missed
            else {
                $(this).addClass('miss');
                sound.missSound();

                // save if current combo streak is higher
                if(currentCombo > combo) {
                    combo = currentCombo;
                }

                // combo breakkkkkerrrr
                currentCombo = 0;
            }
        }
        else {
            console.log('You already fired there fool!');
        }

        // Update toobar
        renderToolbar();

        // check game over and display message
        if(game.checkGameOver() === 'WIN' || game.checkGameOver() === 'LOSE') {

            if(game.checkGameOver() === 'WIN') {
                sound.winSound();
                window.alert('You win! You are the captain now!');
                stats.save('win', combo);
            }
            else {
                window.alert('You Lose! (and you suck)');
                sound.gameOverSound();
                stats.save('lose', combo);
            }

            renderHighScores();
        }
    });

    // Function to render the toolbar
    function renderToolbar() {
        // Show number of torpedos left
        $('.tNumber').text(player.getTorp().getAmmo());

        var ships = game.getShips();

        // Setting enemy ship names and hp
        for(var i = 0; i < ships.length; i++) {
            var shipSelector = '.ship-' + ships[i].getId();

            $(shipSelector + ' .ship-name').text(game.getShip(i).getName());

            $(shipSelector + ' .ship-hp-now').text(game.getShip(i).getHitPoint());

            // Calculating ship hp percentage
            var percentage = (ships[i].getHitPoint() / ships[i].getMaxHP()) * 100;

            // If the ship has run out of health, then fill the health bar to red
            if(percentage === 0) {
                $(shipSelector + ' .progress-bar').width('100%')
                    .addClass('progress-bar-danger')
                    .removeClass('progress-bar-success');
            }
            else {
                $(shipSelector + ' .progress-bar').width(percentage + '%');
            }
        }
    }

    // Function to render highscores
    function renderHighScores() {
        // Set up highscores
        $('.games-won').text(stats.getGamesWon());
        $('.games-lost').text(stats.getGamesLost());
        $('.combo').text(stats.getCombo());
    }

    // Reset game button
    $('.reset-btn').click(function() {
        window.location.reload();
    });

    // initialise function
    function init() {
        var ships = game.getShips();

        // Setting enemy ship max hp
        for(var i = 0; i < ships.length; i++) {
            var shipSelector = '.ship-' + ships[i].getId();

            $(shipSelector + ' .ship-hp-max').text(game.getShip(i).getHitPoint());
        }

        renderHighScores();
    }
});
