// The controller

$(document).ready(function(){
    // rules of the game
    var game = new APP.Game();
    var board = game.getBoard();
    var player = game.getPlayer();

    renderToolbar();

    // Event listener function for clicking on square
    $('.square').click(function() {
        var sqId = $(this).data('id');
        var square = board.getSquare(sqId);

        console.log(square.getId());

        // check if all ready fired
        if(!square.getClicked()) {
            square.reveal();
            player.fire('torpedo');

            if(square.getOccupied() === true) {
                var occupiedShip = game.getShip(square.getShipId());
                console.log('hit');
                // get the ship id from the square and reduce that ship's hp
                occupiedShip.reduceHitPoint();
                $(this).addClass('hit');

                // let user know if ship is destroyed or not
                var shipSunk = occupiedShip.alertDestroyed();
                if(shipSunk) {
                    window.alert(shipSunk);
                    var toolbarShipSel = '.ship-' + square.getShipId();
                    $(toolbarShipSel).addClass('destroyed');
                }
            }
            else {
                console.log('missed');
                $(this).addClass('miss');
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
                window.alert('You win! You are the captain now!');
            }
            else {
                window.alert('You Lose! (and you suck)');
            }
        }
    });

    // Function to render the toolbar
    function renderToolbar() {
        // Show number of torpedos left
        $('.tNumber').text(player.getTorp().getAmmo());

        var ships = game.getShips();

        console.log('all ships: ', ships);

        for(var i = 0; i < ships.length; i++) {
            var shipSelector = '.ship-' + ships[i].getId();

            $(shipSelector).text(game.getShip(i).getName());
        }
    }

    $('.reset-btn').click(function() {
        console.log('game reset');
        window.location.reload();
    });
});
