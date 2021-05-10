//how to scroll horizontally on click  <script>
$('.next').on('click', (event) => {
    var nextButton = $(event.currentTarget);
    nextButton.clearQueue();

    //we need to know how many cards are visible within the current window
    var visibleCards = Math.floor(window.innerWidth / ($('.card-container').width()));
    var parent = $(event.currentTarget).parent();
    var prev = parent.children('.prev');
    var max_cards = parseInt(parent.attr('data-max-cards'));

    var currentPosition = parseInt(parent.attr('data-scroll-pos'));
    //changes with width
    var max_init_position = max_cards - visibleCards;//
    if (currentPosition < max_init_position) {
        var newFinalPosition = currentPosition + (2 * visibleCards) - 1;
        newFinalPosition = Math.min(newFinalPosition, max_cards - 1);
        var newInitPosition = newFinalPosition - visibleCards + 1;
        var card_final = '#card-' + (newFinalPosition);

        /*console.log(currentPosition);
        console.log('#card-'+newInitPosition);
        console.log(card_final);*/
        //grab the row
        parent.attr('data-scroll-pos', newInitPosition);
        var row = parent.children('.card-row');

        prev.css({ 'visibility': 'visible' });
        if (newFinalPosition == max_cards - 1) {
            nextButton.css({ 'visibility': 'hidden' });
        }
        //map argument is to prevent reposition of vertical window view
        row.children(card_final)[0].scrollIntoView({ block: "nearest" });
    }
});
$('.prev').on('click', (event) => {
    var prevButton = $(event.currentTarget);
    //we need to know how many cards are visible within the current window
    var visibleCards = Math.floor(window.innerWidth / ($('.card-container').width()));
    var parent = prevButton.parent();
    var currentPosition = parseInt(parent.attr('data-scroll-pos'));
    //can only go left if leftmost is greater than 0
    if (currentPosition > 0) {
        //ok so to get the new init position do what?
        var newInitPosition = currentPosition - visibleCards;
        newInitPosition = Math.max(0, newInitPosition);
        parent.attr('data-scroll-pos', newInitPosition);
        var card_init = "#card-" + newInitPosition;
        if (newInitPosition == 0) {
            prevButton.css({ 'visibility': 'hidden' });
        }
        parent.children('.next').css({ 'visibility': 'visible' });
        var row = parent.children('.card-row');
        row.children(card_init)[0].scrollIntoView({ block: "nearest" });
    }
});

$('.row-container').mouseenter((event) => {
    //    background-color: rgba(0,0,0,0.27);
    var current = $(event.currentTarget);
    var prev = current.children('.prev');
    var next = current.children('.next');
    current.children('.prev').css({ 'background-color': 'rgba(0,0,0,0.27)' });
    current.children('.next').css({ 'background-color': 'rgba(0,0,0,0.27)' });
    next.children('.next-char').css({'color':'white'});
    prev.children('.prev-char').css({'color':'white'});
});

$('.row-container').mouseleave((event) => {
    var current = $(event.currentTarget);
    var prev = current.children('.prev');
    var next = current.children('.next');
    prev.css({ 'background-color': 'rgba(0,0,0,0)' });
    next.css({ 'background-color': 'rgba(0,0,0,0)' });
    prev.children('.prev-char').css({'color':'rgba(0,0,0,0)'});
    next.children('.next-char').css({'color':'rgba(0,0,0,0)'});
});


$('.next').mouseenter((event) => {
    $(event.currentTarget).children('.next-char').css({ 'transform': 'scale(1.4)' });
});
$('.next').mouseleave((event) => {
    $(event.currentTarget).children('.next-char').css({  'transform': 'scale(1)' });
});
$('.prev').mouseenter((event) => {
    $(event.currentTarget).children('.prev-char').css({  'transform': 'scale(1.4)' });
});
$('.prev').mouseleave((event) => {
    $(event.currentTarget).children('.prev-char').css({ 'transform': 'scale(1)' });
});