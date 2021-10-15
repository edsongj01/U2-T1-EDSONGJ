let principal = $('#principal');
let notice = $('#notice');

$('.btn-seguir').on('click',function(e){
    e.preventDefault();
    console.log('Pulsaste el btn-seguir');

    principal.fadeOut(function(){
        notice.slideDown(1000)
    })

    //notice.fadeIn('slow',function(){
      //  principal.slideUp(1000)
    //});
});

$('.btn-regresar').on('click',function(){
    notice.fadeOut('slow',function(){
        principal.slideDown(1000)
    });
});

const swDirector =
    window.location.href.includes("localhost") ? "/sw.js" : "/U2-T1-EDSONGJ/sw.js";

if (navigator.serviceWorker){
    navigator.serviceWorker.register(swDirector);
}