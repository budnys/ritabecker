(function ($) {

	new WOW().init();

	jQuery(window).load(function() {
		jQuery("#preloader").delay(100).fadeOut("slow");
		jQuery("#load").delay(100).fadeOut("slow");
	});


	//jQuery to collapse the navbar on scroll
	$(window).scroll(function() {
		if ($(".navbar").offset().top > 50) {
			$(".navbar-fixed-top").addClass("top-nav-collapse");
		} else {
			$(".navbar-fixed-top").removeClass("top-nav-collapse");
		}
	});

	//jQuery for page scrolling feature - requires jQuery Easing plugin
	$(function() {
		$('.navbar-nav li a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
		$('.page-scroll a').bind('click', function(event) {
			var $anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $($anchor.attr('href')).offset().top
			}, 1500, 'easeInOutExpo');
			event.preventDefault();
		});
	});

	//JQuery for changing the background
	$(function() {

		setInterval(function(){
			//randomize bg#.jpg
			var rndm = Math.floor(Math.random() * 5) + 1;

			var image = $('.intro');
			image.fadeOut(1000, function () {
				image.css("background", "url('./img/bg"+rndm+".jpg') no-repeat top center");
				image.fadeIn(1000);
			})

			//set the bg to the .intro css class
			//$('.intro').css("background", "url('./img/bg"+rndm+".jpg') no-repeat top center");
		}, 15000);

	});

})(jQuery);
