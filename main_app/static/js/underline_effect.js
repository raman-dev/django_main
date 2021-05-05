$('li.nav-item').mouseenter((event) => {
    let link = $(event.currentTarget).children('a');
    if (!link.hasClass('active')) {
        //a non active class has been entered
        //make the non active link 0
        let activeLink = $('a.active');
        //so only a single link has an underline at any time
        activeLink.children('.underline-effect').css({ 'width': '0%' });
    }
    let underline = link.children('.underline-effect');
    underline.css({
        'width': '100%'
    });
});
$('li.nav-item').mouseleave((event) => {
    //if it is the currently active class don't change width to 0
    let link = $(event.currentTarget).children('a');
    if (link.hasClass('active')) {
        //if we exit
        return;
    } else {
        //restor active link
        let activeLink = $('a.active');
        activeLink.children('.underline-effect').css({ 'width': '100%' });
    }
    link.children('.underline-effect').css({ 'width': '0%' });
});


