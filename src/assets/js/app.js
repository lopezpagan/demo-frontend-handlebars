/**
 * Site Main JS
 */ 

(function($){
     
     function checkBootstrap(){
          var bootstrap_enabled = (typeof $().modal == 'function');

          if (bootstrap_enabled) {
               console.log('Bootstrap is Loaded!');
          } else {
               console.log('Bootstrap not installed!');
          }
     }
     
     checkBootstrap();
     
     $('.carousel').carousel({
       interval: 5000,
       pause: 'hover'
     });
     
    //SmothScroll
    $('a.page-scroll').bind('click', function(event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');

        event.preventDefault();
    });
    
    $(window).scroll(function(){

        var wScroll = $(this).scrollTop();
        var wScrollReverse = 1-(wScroll/600);
        var wLeft  = -wScroll/10;
        var wRight = -wScroll/10;
        var wTop = 100 + wScroll/8;
        var wRotate = 0;
            wRotate = wRotate + wScroll/20;

        /*console.log('wScroll: ' + wScroll); 
        console.log('wTop: ' + wTop);
        console.log('wRotate: ' + wRotate);*/
        
        //LEFT BOTTLE
        /*$('.image__milk-left').css({
            'transform': 'translate(0px, ' + wScroll/100 + '%)'
        });*/
        /*$('.image__milk-left').css({
            'transform': 'rotate(' + wRotate + 'deg)'
        });
        $('.image__milk-left').css({
            'left': wLeft + 'px'
        });*/
        $('.logo').css({
            'opacity': wScrollReverse.toFixed(2)
        });
         
        //RIGHT BOTTLE
        /*$('.image__milk-right').css({
            'transform': 'translate(0px, -' + wScroll/100 + '%)'
        });*/
        /*$('.image__milk-right').css({
            'transform': 'rotate(-' + wRotate + 'deg)'
        });
        $('.image__milk-right').css({
            'right': wRight + 'px'
        });*/
        
        //FULL IMAGE BLOCK
        /*$('.site-title').css({ 
            'top': wTop + 'px'
        });*/

    }); 
    
    function animate(element_ID, animation) {
        $(element_ID).addClass(animation);
        var wait = window.setTimeout( function(){
            $(element_ID).removeClass(animation)}, 1300
        );
    }
    
    var $animation_elements = $('.animation-element');
    var $window = $(window);

    function check_if_in_view() {
      var window_height = $window.height();
      var window_top_position = $window.scrollTop();
      var window_bottom_position = (window_top_position + window_height - 150);
        //console.log(window_bottom_position);
        
      $.each($animation_elements, function() {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = (element_top_position + element_height);

        //check to see if this current container is within viewport
        if ((element_bottom_position >= window_top_position) &&
          (element_top_position <= window_bottom_position)) {
          $element.addClass('in-view');
        } else {
          $element.removeClass('in-view');
        }
      });
    }
    
    function resizeVideos() {
        var $allVideos = $("iframe[src^='//player.vimeo.com'], iframe[src^='//www.youtube.com'], object, embed"),
        $fluidEl = $("figure");

        $allVideos.each(function() {

          $(this)
            // jQuery .data does not work on object/embed elements
            .attr('data-aspectRatio', this.height / this.width)
            .removeAttr('height')
            .removeAttr('width');

        });

        $(window).resize(function() {

          var newWidth = $fluidEl.width();
          $allVideos.each(function() {

            var $el = $(this);
            $el
                .width(newWidth)
                .height(newWidth * $el.attr('data-aspectRatio'));

          });

        }).resize();
    }
    
    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');
    
    resizeVideos();
    
    
})(jQuery); 