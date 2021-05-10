import { setCardListeners,removeCardListeners } from './modal_manager.js';

var isLoading = false;
var isLoaded = true;

$(document).ready(() => {
    //need to add click listener for the nav items
    $("li.nav-item").on('click', (event) => {
        //remove the currently
        $('.navbar-nav').find('.active').removeClass('active');
        $(event.currentTarget).addClass('active');
        //
        var id = $(event.currentTarget).attr('id');
        var contentContainer = $('.content-container');
        contentContainer.css({
            'opacity': 0
        });
        removeCardListeners();
        isLoaded = false;
        contentContainer.on('transitionend',(event)=>{
            if(!isLoading && !isLoaded){
                loadContent(id,contentContainer);
            }else{
                setCardListeners();
            }
        });
    });
});

function loadContent(id, contentContainer) {
    //so depending on which link we click if it is 
    //home, movies, tvshows
    //if home fade in from current
    //
    var watchable_type = 0;
    var id_str = null;
    if (id == 'tv_shows_link') {
        watchable_type = 2;
        id_str = 'tvshows';
    } else if (id == 'movies_link') {
        watchable_type = 1;
        id_str = 'movies';
    } else {
        watchable_type = 0;
        id_str = '';
    }

    //get count of number of rows
    var numRows = contentContainer.children('h5').length;
    if (watchable_type > 0) {
        $.ajax({
            url: '/' + id_str,
            tyep: 'get',
            success: function (data) {
                //need json data of what
                //watchable tv or movie objects
                //now populate the content container
                //to get an individual row call 
                isLoading = false;
                isLoaded = true;
                var array = data['watchableRowList'];
                var i = 0;
                for (i = 0; i < numRows; i++) {
                    var row = $('#row-' + i); //i 0 to numRows
                    //remove all children
                    row.empty();
                    //now add children ro current row 
                    //title should not change
                    //response will be json
                    //of what?
                    //of lists of 12 max 
                    var watchableList = JSON.parse(array[i]['list']);
                    //watchable items ordered by genre
                    //
                    var j = 0;
                    watchableList.forEach(watchable_item => {
                        var card = '<div id=\"card-' + j + '\" class=\"card-container p-1 col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2\"> <div class=\"custom-card\" data-preview-url=\"' + watchable_item.fields.preview_url + '\" data-watchable-id=\"' + watchable_item.pk + '\" data-watchable-type=\"' + watchable_item.fields.type + '\"> <img class=\"card-img-top rounded\" src=\"/static/' + watchable_item.fields.thumbnail_url + '\" /></div> </div>'
                        row.append(card);
                        j += 1;
                    });
                }
                contentContainer.css({
                    'opacity': 1
                });
            },
            failure: function (data) {
                console.log('failed to get resources');
            },
        });
    } else {
        //reload home page
        isLoading = false;
    }
}