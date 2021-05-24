//do over
//
//card.hover 0.5s ->
//     trigger modal animation
var timer = null;
const MODAL_SHOW_DELAY = 500;
const FADE_OUT = 0;
const FADE_IN = 1;

var isOpen = false;
var isOpening = false;
var isClosing = false;
var isClosed = true;

$('body')[0].addEventListener('touchstart',(event)=>{
    console.log('body touchstart');
    if(isOpen || isOpening){
        //check target instead
        //no matter what i need to check if the touch event was inside of the modal
        //
        //modal open -> ontouch non modal  -> close modal 
        //modal close -> ontouch non modal -> do nothing
        if(!$('#modal_container')[0].contains(event.target)){
            console.log('close modal!');
            closeModal();
        }
        
    }
});

$('#modal_container').on('touchstart',(event)=>{
    //do nothing other elements handle this
    //
});


export function setCardListeners() {
    $('.custom-card').mouseenter((event) => {
        if (timer == null) {
            timer = setTimeout(showModal, MODAL_SHOW_DELAY, event);
        }
    });

    $('.custom-card').mouseleave((event) => {
        clearTimeout(timer);
        timer = null;
    });
}

export function removeCardListeners(){
    $('.custom-card').unbind('mouseenter');
    $('.custom-card').unbind('mouseleave');
}

setCardListeners();

function closeModal(){
    if (isOpen || isOpening) {
        isClosing = true;
        isOpen = false;
        $('.modal-custom').css({
            'transition-duration': '0.2s',
            'transform': 'scale(1)',
            'box-shadow': '0 0px 0px rgba(0,0,0,0)'
        });
        //fade out footer
        fade('.modal-custom-footer', FADE_OUT);
        //fade poster back in on close
        fade('.modal-poster', FADE_IN);
    }
}

$('.modal-custom').mouseleave((event) => {
    //close or cancel modal transition
    //if we leave before shits open then its canceld
    closeModal();
});

function fade(selector, opacity) {
    $(selector).css({ 'opacity': opacity });
}

$('.modal-custom').on('transitionstart', (event) => {

});
$('.modal-custom').on('transitioncancel', (event) => {
    //any open or close transition has been canceled
    //but only open operations are closeable
    if ($(event.target).hasClass('modal-custom')) {
        if (isOpening) {
            isOpening = false;
            isClosing = true;
        }
    }
});


$('.modal-custom').on('transitionend', (event) => {
    if ($(event.target).hasClass('modal-custom')) {
        if (isOpening) {
            isOpen = true;
            isClosed = false;
            //fade out poster on open
            fade('.modal-poster', FADE_OUT);
        }
        if (isClosing) {
            isOpen = false;
            isClosed = true;
            $('.modal-custom').css({ 'visibility': 'hidden' });
            $('.modal-video').children('source').remove();
            $('.modal-poster').attr('src', '');
        }
        isOpening = false;
        isClosing = false;
    }
});

$('.modal-play-button').on('click', (event) => {
    $(event.currentTarget).children('a')[0].click();
});

function showModal(event) {
    //reset timer
    if(!isClosed){
        return;
    }
    isOpening = true;
    isClosed = false;
    //set top and left
    let card = $(event.currentTarget);
    let cardWidth = card.width();
    let cardHeight = card.height();
    let cardThumbnailUrl = card.children('img').attr('src');
    let cardPreviewUrl = card.attr('data-preview-url');

    let modal = $('.modal-custom');
    let poster = $('.modal-poster');
    let video = $('.modal-video');

    //
    let offset_x = getHorizontalBoundsOffset(1.3, card.offset().left, cardWidth, $('.content-container').offset().left, $('.content-container').width());
    modal.css({
        'visibility': 'visible',
        'left': card.offset().left,
        'top': card.offset().top,
        'transition-duration': '0.3s',
        'transform': 'scale(1.3) translateX(' + offset_x + 'px) translateY(-24px)',
        'box-shadow': '0 3px 6px rgba(0,0,0,0.23)'
    });

    poster.attr('src', cardThumbnailUrl);
    poster.css({
        'width': cardWidth,
        'height': cardHeight,
    });

    let type = card.attr('data-type');
    let id = card.attr('data-watchable-id');
    let runtime = parseInt(card.attr('data-runtime'));
    let genre = card.attr('data-genre');

    setFooterScaleReposition();
    setVideoElementAttrs(video, cardWidth, cardHeight, cardPreviewUrl);
    $('.modal-watchable-link').attr('href', '/notflix/watch/' + type + '/' + id);

    //if type == movie
    if(type == "movie"){
        //grab runtime
        //
        //seconds to hours
        let HOUR_SECONDS = 3600;
        let MINUTE_SECONDS = 60;
        //convert seconds to minutes and hours
        //first seconds remaining = seconds/hours_seconds
        let hours = Math.floor(runtime / HOUR_SECONDS);
        let remaining = (runtime/HOUR_SECONDS) - hours;//in minutes
        let minutes = Math.floor(remaining * 60);
        //so now what
        $('.modal-runtime').text('Runtime '+hours + 'h ' +  minutes+'m');
    }else{
        //tvshow
        $('.modal-seasons').text('Seasons 1');
    }
    $('.modal-genre').text(genre);
}

function setFooterScaleReposition() {
    let modalFooter = $('.modal-custom-footer');
    let modalFooterParent = $('.modal-scale-down');
    let modalFooterParentPosition = modalFooterParent.position();
    //height and width will be scaled by 70%
    //so reposition relative to parent 
    let cx = modalFooterParentPosition.left + modalFooterParent.width() / 2;
    let cy = modalFooterParentPosition.top + modalFooterParent.height() / 2;
    let new_left = cx - (0.7 * modalFooterParent.width()) / 2;
    let new_top = cy - (0.7 * modalFooterParent.height()) / 2;

    let deltaX = modalFooterParentPosition.left - new_left;
    let deltaY = modalFooterParentPosition.top - new_top;
    modalFooterParent.css({
        'transform': 'scale(0.7) translateX(' + deltaX + 'px) translateY(' + deltaY + 'px)',
    });
    //fade in footer
    modalFooter.css({
        'opacity': 1,
        'height': 0.7 * modalFooterParent.height() + 16
    });
}

//translate left if offscreen from the right
//translate right if offscreen from the left
function getHorizontalBoundsOffset(scale, left, width, parentLeft, parentWidth) {
    let offset = 0;
    let cx = left + width / 2;
    let parentRight = parentLeft + parentWidth;
    let newWidth = width * scale;
    let newLeft = cx - (newWidth / 2);
    let newRight = cx + (newWidth / 2);

    if (newLeft < parentLeft) {
        offset = (parentLeft - newLeft) - 8;//translate right as many units
        //as we are off the screen to the left
    }
    else if (newRight > parentRight) {
        offset = -(newRight - parentRight) + 8;
        //translate left as many units as we are off the right
    }
    return offset;
}

function setVideoElementAttrs(element, width, height, url) {
    element.attr('width', width);
    element.attr('height', height);
    element.append('<source src=/static/' + url + '>');
    element[0].load();
}