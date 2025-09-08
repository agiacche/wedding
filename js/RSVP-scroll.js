// RSVP scroll

$(document).ready(function() {
    // Normal scroll animations for all other sections
    $('.animate-box').not('#fh5co-started .animate-box').each(function() {
        var $el = $(this);
        $el.waypoint(function(direction) {
            $el.addClass('animated fadeInUp');
        }, { offset: '75%' });
    });

    // RSVP click: scroll and animate only the RSVP section
    $('a[href="#fh5co-started"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('#fh5co-started').offset().top
        }, 800, function() {
            // Animate RSVP section immediately
            $('#fh5co-started .animate-box').addClass('animated fadeInUp');
        });
    });
});