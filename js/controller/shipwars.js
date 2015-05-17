// The controller

$(document).ready(function(){
    // rules of the game
    var game = new APP.Game();
    var board = game.getBoard();
    var player = game.getPlayer();

    renderToolbar();

    $('.square').click(function() {
        var sqId = $(this).data('id');
        $(this).css('background', 'red');
        console.log(board.getSquare(sqId).getId());

        board.getSquare(sqId).reveal();

        player.fire('torpedo');

        // Update toobar
        renderToolbar();
    });

    function renderToolbar() {
        // Show number of torpedos left
        $('.tNumber').text(player.getTorp().getAmmo());
    }
});