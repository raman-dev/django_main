var thumb = $('.slider-thumb');
//now the position should be the same no matter what size of the window
var new_mouse_pos = -1;
var old_mouse_pos = -1;

var left_min = $('.slider-container').offset().left;
var left_max = left_min + $('.slider-container').width();
var slider_width = $('.slider-container').width();

console.log('left_min => '+left_min);
console.log('left_max => '+left_max);
var progress_bar = $('.volume-progress-bar');
progress_bar.css({ 'transition': 'none' });
//left min is 0;
thumb.mousedown((event) => {
    if (event.which == 1) {
        //so we can now drag the element left or right
        //left limit is left 0%;
        //right limit is 100%;
        //but we need pixel value 
        //save mouse position so we can get a delta on drag
        old_mouse_pos = event.pageX;//returns position relative to page subtract to get local
        //get relative to slider-container
        //now while the mouse is down we need to know when the mouse click is released
        //so we need to register mouse up on the document since user may move mouse off of 
        //slider thumb
        $(document).mousemove(thumb_move);
        $(document).mouseup(release_thumb);
    }
});

function release_thumb(event){
    //also need mousemove
    $(document).unbind('mouseup',release_thumb);
    $(document).unbind('mousemove',thumb_move);
}
function thumb_move(event) {
    new_mouse_pos = event.pageX;
    //now what?
    //if we move beyond left max do nothing
    if (new_mouse_pos > left_max || new_mouse_pos < left_min) {
        return;
    }
    //since we are within the slider container width
    //we can move left and right
    console.log('old_pos => '+old_mouse_pos);
    console.log('new_pos => '+new_mouse_pos);
    var delta_x = new_mouse_pos - old_mouse_pos;
    //change
    var current_thumb_pos = thumb.offset().left;
    current_thumb_pos += delta_x;
    current_thumb_pos -= left_min; //to relative coordinates
    if(current_thumb_pos < 0){
        current_thumb_pos = 0;
    }else if(current_thumb_pos > slider_width){
        current_thumb_pos = slider_width;
    }
    thumb.css({ 'left': current_thumb_pos + 'px' });
    progress_bar.css({ 'width': current_thumb_pos + 5 + "px" });
    //current thumb_pos a percentage of 
    var volume = 100*(current_thumb_pos/200);
    console.log(volume);
    volume_changed(volume);
    old_mouse_pos = new_mouse_pos;
}

var volume_controls = $('.volume-controls');
var volume_button = $('.volume-button');
var volume_slider = $('.volume-slider');
//need the difference between  parent width and 
//right position of title
//do math.min of 200px and difference between 
volume_controls.mouseenter((event)=>{
    volume_button.css({
        'transform':'scale(1.2)'
    });
    volume_slider.css({
        'width':'200px',
        'opacity':'1'
    });
});
volume_controls.mouseleave((event)=>{
    volume_button.css({
        'transform':'scale(1)'
    });
    volume_slider.css({
        'width':'0px',
        'opacity':'0'
    });
});

function volume_changed(volume){
    //set the audio level of the video
    //normalize the value
    //so shit was already muted
    var data_level = volume_slider.attr('data-level');
    if(volume > 35){
        //if volume changes in between 35 and 100 no need to change graphic
        if(data_level == 'low'){
            setVolumeGraphic(volume_on_svg,'normal');
        }
    }else{
        //less than 35
        if(volume > 0){
            //if changing between 0 and 35 don't change graphic
            if(data_level =='normal' || data_level =='mute'){
                setVolumeGraphic(volume_low_svg,'low');
            }
        }else{
            setVolumeGraphic(volume_off_svg,'mute');
        }
        
    }
    video.prop('volume',volume/100);//volume of video elements is normalized from 0 to 1
}

function setVolumeGraphic(graphic,level){
    volume_button.children().remove();
    volume_button.append(graphic);
    volume_slider.attr('data-level',level);
}
