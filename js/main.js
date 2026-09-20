;(function () {
	
	'use strict';

	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
	    	}
	    }
		});

	};


	var offcanvasMenu = function() {

		$('#page').prepend('<div id="fh5co-offcanvas" />');
		$('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#fh5co-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#fh5co-offcanvas').append(clone2);

		$('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#fh5co-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function(){
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');				
		}).mouseleave(function(){

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');				
		});


		$(window).resize(function(){

			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
		});
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('overflow offcanvas') ) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 80);
				
			}

		} , { offset: '85%' } );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	// Defer the full-resolution gallery cover images until the gallery is near.
	var lazyBackgrounds = function() {
		var elements = Array.prototype.slice.call(document.querySelectorAll('[data-bg-image]'));
		if (!elements.length) return;

		var load = function(element) {
			var source = element.getAttribute('data-bg-image');
			if (!source) return;
			element.style.backgroundImage = 'url("' + source.replace(/"/g, '\\"') + '")';
			element.removeAttribute('data-bg-image');
		};

		if (!('IntersectionObserver' in window)) {
			elements.forEach(load);
			return;
		}

		var observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (!entry.isIntersecting) return;
				load(entry.target);
				observer.unobserve(entry.target);
			});
		}, { rootMargin: '600px 0px' });

		elements.forEach(function(element) { observer.observe(element); });
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	
	$(function(){
		lazyBackgrounds();
		if ($('.fh5co-nav').length) {
			mobileMenuOutsideClick();
			offcanvasMenu();
			burgerMenu();
			dropdown();
		}
		parallax();
		contentWayPoint();
		goToTop();
		loaderPage();
	});


}());

// --- Info modals (open/close) ---
(function(){
	var lastScrollY = 0;
	var lastFocused = null;

	function setBackgroundInert(inert){
		var page = document.getElementById('page');
		var languageToggle = document.querySelector('.lang-toggle-wrap');
		[page, languageToggle].forEach(function(element){
			if(!element) return;
			if(inert) element.setAttribute('aria-hidden', 'true');
			else element.removeAttribute('aria-hidden');
			if('inert' in element) element.inert = inert;
		});
	}
	
  function openModal(id){
    var modal = document.getElementById(id);
    if(!modal) return;
	lastFocused = document.activeElement;

    // Remember scroll position and lock background scroll (mobile/webviews)
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = (-lastScrollY) + 'px';
    document.body.classList.add('modal-open');
	setBackgroundInert(true);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
	var closeButton = modal.querySelector('.fh5co-modal__close');
	(closeButton || modal.querySelector('.fh5co-modal__panel')).focus();
  }

  function closeModal(modal){
    if(!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    // Unlock scroll and restore position
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
	setBackgroundInert(false);
    window.scrollTo(0, lastScrollY);
	if(lastFocused && document.contains(lastFocused)) lastFocused.focus();
	lastFocused = null;
  }

  // Open on click
  document.addEventListener('click', function(e){
    var opener = e.target.closest('.info-opener');
    if(opener){
      openModal(opener.getAttribute('data-modal'));
      return;
    }

    // Close on overlay or close button
    if(e.target && e.target.getAttribute('data-close') === 'true'){
      closeModal(e.target.closest('.fh5co-modal'));
    }
  });

  // ESC closes
  document.addEventListener('keydown', function(e){
	var modal = document.querySelector('.fh5co-modal.is-open');
	if(!modal) return;
    if(e.key === 'Escape'){
	  e.preventDefault();
	  closeModal(modal);
	  return;
    }
	if(e.key !== 'Tab') return;
	var focusable = Array.prototype.slice.call(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
	if(!focusable.length) return;
	var first = focusable[0];
	var last = focusable[focusable.length - 1];
	if(e.shiftKey && document.activeElement === first){
		e.preventDefault();
		last.focus();
	} else if(!e.shiftKey && document.activeElement === last){
		e.preventDefault();
		first.focus();
	}
  });
})();
