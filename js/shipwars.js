$(document).ready(function(){
    // rules of the game
    var game = new APP.Game();
    var board = game.getBoard();

    $('.square').click(function() {
        var sqId = $(this).data('id');
        $(this).css('background', 'red');
        console.log(sqId);
        board.getSquare(sqId).getId();
    });
});