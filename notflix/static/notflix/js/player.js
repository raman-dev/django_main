//scale video element to fit windw
//get aspect from video
//should be 16x9 
//find the smallest 16X9 ratio that fits inside 
//how to scale
const resumed = 'resumed';
const paused = 'paused';

var pause_svg = '<svg class="pause_graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
var play_svg = '<svg class="play_graphic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"> <path d="M0 0h24v24H0z" fill="none" /> <path d="M8 5v14l11-7z" /> </svg>';
var volume_off_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
var volume_low_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>';
var volume_on_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

var video = $('video');
var controls_overlay = $('.controls-overlay');

var timeStampTimer = null;
$('.play_button').on('click', (event) => {
    var state = $(event.currentTarget).attr('data-state');
    onVideoStateChanged(state);
});

function onVideoStateChanged(state){
    var play_button = $('.play_button');
    if (state == resumed){
        $('video')[0].pause();
        //video should now be paused
        console.log('video paused!');
        //stop time_stamp update function
        clearInterval(timeStampTimer);
        //replace the child
        play_button.attr('data-state', paused);
        play_button.children().remove();
        play_button.append(play_svg);
    }else{
        $('video')[0].play();
        //video shouod now be resumed
        console.log('video resumed!');
        //start time_stamp update function
        timeStampTimer = setInterval(updateControls, 1000);
        play_button.attr('data-state', resumed);
        play_button.children().remove();
        play_button.append(pause_svg);
    }
}

$(document).ready(() => {
    //set the progress bar cursor 
    //or every time window is resized
    updateControls();
    setTimeout(() => {
        onVideoStateChanged(paused);
        document.querySelector('video').muted = false;
    },300);
});

function updateControls() {
    var duration = $('video')[0].duration;
    var currentTime = $('video')[0].currentTime;
    var percent = 100 * (currentTime / duration);

    // console.log(`currentTime => ${currentTime} \n duration => ${duration}`);
    updateProgressBar(percent);
    updateProgressBarCursor(percent);//move cursor
    updateTimeStamp(currentTime, duration);
}

var cursor = $('.video-progress-cursor');
function updateProgressBarCursor(percent) {
    //now what?
    //move the cursor along with 
    //move cursor to edge of absolute width and left and
    //top of progress bar
    //
    //the position must be a percentage
    //query every time
    //
    var pbar = $('.progress');
    var position =  (percent/100)*(pbar.width());
    
    //now what do i have to do 
    cursor.css({
        'left':position
    });
    //so now what
    //given percentage calculate 
}

function updateProgressBar(percent) {
    //update as a function of the current time and out of duration
    //now set the progress bar to the percentage of width
    $('.video-progress-bar').css({ 'width': percent + "%" });
}

function updateTimeStamp(time_elapsed, duration) {
    //need a function that updates the timestamp
    //by 1 second as soon as play is pressed 
    var currentTime = time_elapsed;
    if (isNaN(currentTime)) {
        currentTime = duration;
    } else {
        currentTime = duration - currentTime;
    }
    //convert currentTime to hh:mm:ss24
    //ok grab hours from this how?
    //so we are given seconds remove the seconds 
    //that in hours
    //given 
    var hours = Math.floor(currentTime / 3600);
    currentTime = currentTime - hours * 3600;//get remaining seconds
    //
    var minutes = Math.floor(currentTime / 60);
    currentTime = currentTime - minutes * 60;//get remaining seconds
    var seconds = Math.floor(currentTime);
    if (seconds < 0) {
        seconds = 0;
    }
    var timeString = "";
    timeString += (hours + ":");
    if (minutes < 10) {
        timeString += "0" + minutes;
    } else {
        timeString += minutes;
    }
    timeString += ":";
    if (seconds < 10) {
        timeString += "0" + seconds;
    } else {
        timeString += seconds;
    }
    $('.time_stamp').html(timeString);
}

//make the progress bar cursor position locked to the progress
//and also
//ok so 
var back_button = $('.back_button');
var back_button_label = $('.back_button_label');
back_button.mouseenter((event) => {
    //so do what?
    //scale arrow
    //show label
    back_button.css({
        'transform': 'scale(1.1)'
    });
    back_button_label.css({ 'opacity': 1 });
});
back_button.mouseleave((event) => {
    back_button.css({
        'transform': 'scale(1)'
    })
    back_button_label.css({ 'opacity': 0 });
});

var modal = $('.modal');
var hideTimer = null;
$(document).mousemove((event) => {
    //when the mouse moves show the modal
    //when the mouse has not moved for 3 seconds hide modal
    //when mouse is moved any in progress hide controls is cancelled
    //
    clearInterval(hideTimer);
    modal.modal('show');
    controls_overlay.css({ 'opacity': 1 });
    hideTimer = setInterval(() => {
        hideControls();
    }, 3000);
});

function hideControls() {
    //if position has changed within 3 seconds cancel this event
    //return 
    modal.modal('hide');
    controls_overlay.css({ 'opacity': 0 });
    //don't continuously call hide controls
    clearInterval(hideTimer);
}

$('.fullscreen-toggle').on('click',(event)=>{
    //make window fullscreen
    console.log('click fullscreen toggles');
    if($(document).get(0).fullscreenElement == null){
        $('body').get(0).requestFullscreen();
    }else{
        $(document).get(0).exitFullscreen();
    }
});








