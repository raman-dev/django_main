//page-1

$('.page-0 .img-col .img-card').on('transitionend',(event)=>{
    // console.log('transitionend event');
    //transition box-shadow
    if (!event.target.classList.contains('elevate-box-shadow')){
        event.target.classList.add('elevate-box-shadow');
    }
});
