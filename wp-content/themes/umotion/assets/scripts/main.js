jQuery(document).ready(function ($) {

    $(window).bind('scroll load', function () {
            $('section').each(
                function () {
                    var n = $(this).offset().top, t = $(window).scrollTop() + $(window).height();
                    t > n && $(this).css
                    ({opacity: '1'})
                }
            )
        }
    );

    if ($('#mySpriteSpin').length) {
        initSpin();
    }

    var frames = SpriteSpin.sourceArray('../images/360/uMotion_360_{frame}.png', {
        frame: [1, 36],
        digits: 3
    });

    var cutoff = 780;
    var spin;
    var api;
    var activeFrame = -1;

    var mainBannerSlider = $('.home-banner-slide-holder').lightSlider({
        item: 1,
        autoWidth: false,
        slideMargin: 0,
        enableDrag: false,
        pager: true,
        auto: true,
        loop: true,
        pause: 10000,
        controls: false,
        mode: 'fade'
    });

    $('.main-banner .next-button').click(function () {
        mainBannerSlider.goToNextSlide();
    });

    $('.main-banner .prev-button').click(function () {
        mainBannerSlider.goToPrevSlide();
    });

    var quoteSlider = $('.quote-slider .slide-holder').lightSlider({
        item: 1,
        autoWidth: false,
        slideMargin: 0,
        enableDrag: false,
        pager: false,
        auto: true,
        loop: true,
        pause: 10000,
        controls: false,
        mode: 'fade'
    });

    $('.next-quote').click(function () {
        quoteSlider.goToNextSlide();
    });

    $('.prev-quote').click(function () {
        quoteSlider.goToPrevSlide();
    });

    var productSlider = $('.product-slider').lightSlider({
        item: 1,
        autoWidth: false,
        slideMargin: 0,
        enableDrag: false,
        pager: true,
        auto: true,
        loop: true,
        pause: 10000,
        controls: false,
        mode: 'fade'
    });

    $('.product-slider-holder .next-button').click(function () {
        productSlider.goToNextSlide();
    });

    $('.product-slider-holder .prev-button').click(function () {
        productSlider.goToPrevSlide();
    });

    $('.top-header a').not('.close-button').click(function () {
        var target = $(this).data('target');
        if ($('.header-pages').hasClass('active')) {

            $('.header-pages').removeClass('active');

            setTimeout(function () {
                $('.header-pages').addClass('active');
                $('.header-page').removeClass('active');
                $(target).addClass('active');
            }, 500);

        } else {
            $('.header-pages').addClass('active');
            $('.header-page').removeClass('active');
            $(target).addClass('active');
        }
        $(this).toggleClass('active');

        $('html, body').animate({scrollTop: '0px'}, 300);

        $('.close-button').click(function () {
            $('.header-pages').removeClass('active');

        });

    });

    var fadeIn = null;

    function initSpin() {

        spin = $('#mySpriteSpin').spritespin({
            source: [
                '../images/360/uMotion_360_001.png',
                '../images/360/uMotion_360_002.png',
                '../images/360/uMotion_360_003.png',
                '../images/360/uMotion_360_004.png',
                '../images/360/uMotion_360_005.png',
                '../images/360/uMotion_360_006.png',
                '../images/360/uMotion_360_007.png',
                '../images/360/uMotion_360_008.png',
                '../images/360/uMotion_360_009.png',
                '../images/360/uMotion_360_010.png',
                '../images/360/uMotion_360_011.png',
                '../images/360/uMotion_360_012.png',
                '../images/360/uMotion_360_013.png',
                '../images/360/uMotion_360_014.png',
                '../images/360/uMotion_360_015.png',
                '../images/360/uMotion_360_016.png',
                '../images/360/uMotion_360_017.png',
                '../images/360/uMotion_360_018.png',
                '../images/360/uMotion_360_019.png',
                '../images/360/uMotion_360_020.png',
                '../images/360/uMotion_360_021.png',
                '../images/360/uMotion_360_022.png',
                '../images/360/uMotion_360_023.png',
                '../images/360/uMotion_360_024.png',
                '../images/360/uMotion_360_025.png',
                '../images/360/uMotion_360_026.png',
                '../images/360/uMotion_360_027.png',
                '../images/360/uMotion_360_028.png',
                '../images/360/uMotion_360_029.png',
                '../images/360/uMotion_360_030.png',
                '../images/360/uMotion_360_031.png',
                '../images/360/uMotion_360_032.png',
                '../images/360/uMotion_360_033.png',
                '../images/360/uMotion_360_034.png',
                '../images/360/uMotion_360_035.png',
                '../images/360/uMotion_360_036.png'
            ],

            sense: -1,
            animate: false,
            onFrame: function (event, data) {
                $('.product-highlight').remove();
                if (fadeIn != null) {
                    clearTimeout(fadeIn);
                }
                fadeIn = setTimeout(function () {
                    showHighlight(data)
                }, 500);
            },
            onLoad: function () {
                hidePreload();
            }
        });

        api = spin.spritespin('api');
        goToFrame(0);

        $('#spinloader').width($('#mySpriteSpin').width()).height(($('#mySpriteSpin').width() * 0.92));

    }

    function hidePreload() {
        $('#spinloader').hide();
        $('#mySpriteSpin').show();
    }

    $('.product-highlights li').click(function (event) {
        $('.product-highlights li.active').removeClass('active');

        var dataFrame = $(this).find('a').attr('data-frame');

        if (typeof(dataFrame) == 'undefined') {
            $('.product-highlights li:first-child').addClass('active');
            $('html, body').animate({scrollTop: $('#framework').offset().top}, 1000);
            return;
        }

        if (dataFrame == '') {
            dataFrame = 0;
        }
        var frame = parseInt(dataFrame);

        $(this).addClass('active');

        if (!isNaN(frame)) {
            goToFrame(frame);
        }

    });

    $('.product-steps li:first-child').addClass('active');

    function goToFrame(frame) {

        activeFrame = frame;
        if (activeFrame == 0) {
            activeFrame = '';
        }

        if ($(window).width() > cutoff) {
            //$(".product-highlight").remove();

            if (activeFrame == '') {
                activeFrame = 0;
            }
            api.playTo(activeFrame);
        }

    }

    function showHighlight(data) {
        $('.product-highlight').remove();

        var image = '';
        var frame = data.frame;

        if (frame == 0) {
            image = '6396_uFrame.png';
        }

        if (frame == 4) {
            image = '6400_Stootbumper.png';
        }

        if (frame == 12) {
            image = '6408_Drempelhulp.png';
        }

        if (frame == 14) {
            image = '6410_Laser.png';
        }
        if (frame == 15) {
            image = '6411_Verstelbaarheid.png';
        }

        if (frame == 18) {
            image = '6414_Sleeprem.png';
        }

        if (frame == 22) {
            image = '6418_Zitting.png';
        }

        if (frame == 27) {
            image = '6423_Omgekeerd-remsysteem.png';
        }

        if (image != '') {
            $('<div class="product-highlight"><img src="images/360/highlight/' + image + '"/></div>').hide().appendTo('#mySpriteSpin').fadeIn();
        }

        $('.step-data').fadeOut().promise().done(function () {
            $('.step-' + frame).fadeIn();
        });
    }

    $('.product-next').click(function (event) {
        var currentIndex = $('.product-highlights li.active').index() + 1;

        if (currentIndex >= $('.product-highlights li')) {
            return;
        }

        if (currentIndex == 0) {
            $('.product-highlights li:first-child').click();
        } else {
            $('.product-highlights li.active').next().click();
        }

        if ($(this).parents('#content').length > 0) {
            scrolltoProperties();
        }
    });

    $('.product-prev').click(function (event) {
        var currentIndex = $('.product-highlights li.active').index() + 1;

        if (currentIndex <= 1) {
            return;
        }
        $('.product-highlights li.active').prev().click();

    });

    $('.ps-item .toggle-dropdown').click(function () {
        $(this).closest('.ps-item').toggleClass('clicked');
    });


    $('.right-image-holder .product-highlights a').click(function (e) {
        e.preventDefault();
    });

    // Scroll add fixed bar

    $(document).scroll(function () {
        if (!$('.header-pages').hasClass('active')) {

            if ($(document).scrollTop() >= 200) {
                $('.fixed-nav').addClass('show');
            } else {
                $('.fixed-nav').removeClass('show');
            }

        }
    });


    // Menu toggler
    $('.menu-toggler').click(function () {
        $(this).toggleClass('active');
        $('.mobile-navigation').toggleClass('show');
    });

    $('a.video, a.video-item').lightbox();


    $('.parallax-window').each(function () {
        var path = $(this).data('image-src');
        $(this).parallax({imageSrc: path});
    })

    $('.parallax-window').parallax({imageSrc: '/path/to/image.jpg'});


    $('.button').click(function(){

        setTimeout(function () {
            if(window.location.hash) {
                var hash = window.location.hash.substr(1);
                console.log(hash);

                setTimeout(function () {
                    $('.header-pages').addClass('active');
                    $('.header-page').removeClass('active');
                    $('#' + hash).addClass('active');
                }, 500);

                $('html, body').animate({scrollTop: '0px'}, 300);

            } else {
                console.log('no hash')
            }
        }, 200);
    })

});