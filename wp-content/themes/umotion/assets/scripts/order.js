jQuery(document).ready(function ($) {

    // Append price
    priceAppender();

    if ($('#mySpriteSpin').length) {
        initSpin();

        var frames = SpriteSpin.sourceArray('/images/360/uMotion_360_{frame}.png', {
            frame: [1, 36],
            digits: 3
        });
        var cutoff = 780;
        var spin;
        var api;
        var activeFrame = -1;
    }


    // Transition
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

    // Menu switcher
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

    // Scroll add fixed bar
    $(document).scroll(function () {
        if ($(document).scrollTop() >= 200) {
            $('.fixed-nav').addClass('show');
        } else {
            $('.fixed-nav').removeClass('show');
        }
    });

    // Menu toggler
    $('.menu-toggler').click(function () {
        $(this).toggleClass('active');
        $('.mobile-navigation').toggleClass('show');
    });

    $('#checkout').click(function () {
        $('.right-order').css('opacity', '.2');
    });

    // Variation color picker
    $('.color-picker .color').on('click', function () {
        var holder = $(this).parents('.color-picker');
        var attr = holder.data('attr');
        var value = $(this).data('value');

        var formAppender = '.' + attr;

        $(formAppender).val(value);

        // Price delay styling
        $('.right-order').addClass('disable');

        // Switch selected
        holder.find('.color-inside').removeClass('selected');
        $(this).find('.color-inside').addClass('selected');

        // Append value to select
        $('#' + attr).val(value).change();

        // Append value to label
        $(this).parents('.configuration-item').find('.color-code').text(value);

        // Update model
        updateProductModel();

        // Append price
        priceAppender();
    });

    // Increase product amount
    $('.amount-picker .add').on('click', function () {
        var holder = $(this).parents('.amount-picker').find('.number');
        var value = parseInt(holder.text());
        value++;

        // Value cannot be lower than zero
        if (value >= 0) {
            holder.text(value);
        }

        // Update overview
        updateOverview();

        // Update model
        updateProductModel();
    });

    // Decrease product amount
    $('.amount-picker .remove').on('click', function () {
        var holder = $(this).parents('.amount-picker').find('.number');
        var value = parseInt(holder.text());
        value--;

        // Value cannot be lower than zero
        if (value >= 0) {
            holder.text(value);
        }

        // Update overview
        updateOverview();

        // Update model
        updateProductModel();
    });

    // Amount picker append to form
    $('.amount-picker').on('click', function () {
        var data = $(this).closest('.extra-item').data('id');
        var value = $(this).find('.number').text();

        // Hardcoded IDs
        if (data == '953' || data == '954') {
            $('.bag-amount').val(value);
        }

        if (data == '433' || data == '938') {
            $('.laser-amount').val(value);
        }

        priceAppender();
    });


    // Append price to form
    function priceAppender() {
        var value = $('.total-price').find('.amount').text();
        $('.popup-form').find('.total-price').val(value);
    }

    var formSubmitted = false;
    var addToCartCount = 0;

    $('#checkout').on('click', function (e) {
        e.preventDefault();

        var items = $('.extras .extra-item');
        var wait = 0;

        // For each additional product
        items.each(function () {

            // Update data attribute of add to cart button
            var amount = convertToNumber($(this).find('.amount-picker .number').text());
            var button = $(this).find('.ajax_add_to_cart');
            button.attr('data-quantity', amount);

            // Order only when amount is set
            if(amount > 0) {

                // Add wait
                wait += 1500;
                setTimeout(function () {

                    // Trigger add to cart
                    button.click();
                }, wait);

            } else {
                addToCartCount++;
            }
        });

        // When no additional products are added to cart
        if(addToCartCount >= 2) {

            console.log('No extra products selected');

            // Trigger form submit
            $('.variations_form').submit();
        }
    });

    // Update overview totals after ajax complete
    $(document).ajaxComplete(function (event, xhr, settings) {

        console.log('AJAX CALL');

        updateOverview();

        // Price delay styling
        $('.right-order').removeClass('disable');

        // Append price
        priceAppender();

        // Update add to cart count
        if (settings.url.indexOf('add_to_cart') !== -1) {

            console.log('Extra product call');

            addToCartCount++;
        }

        // When additional products are added to cart, submit form with main product
        if (addToCartCount >= 2 && formSubmitted == false) {

            // Add wait
            var wait = 1500;
            setTimeout(function () {

                console.log('Extra products called');

                // Trigger form submit
                $('.variations_form').submit();

                formSubmitted = true;
            }, wait);
        }
    });

    // Update overview totals
    function updateOverview() {
        var totalPrice = 0;
        var productPrice = convertToNumber($('.woocommerce-variation-price').text());
        totalPrice += productPrice;

        // For each additional product
        $('.extras .extra-item').each(function () {
            var amount = convertToNumber($(this).find('.number').text());
            var price = convertToNumber($(this).find('.price .amount').text());

            // Add additional product price to total price
            totalPrice += amount * price;
        });

        // Append prices
        if (totalPrice) {
            $('.calculator .price .amount').text(convertToMoney(totalPrice));
        }
        if (productPrice) {
            $('.title-price-default .amount').text(convertToMoney(totalPrice));
        }
    }

    function updateProductModel() {
        $('.extras .extra-item').each(function (index) {

            // Upper frame
            toggleFrameImage('upperframe');

            // Lower frame
            toggleFrameImage('lowerframe');

            // Extras
            toggleExtraImage($(this));
        });
    }

    // Show extra option in model when selected
    function toggleExtraImage(item) {
        var productId = $(item).data('id');
        var extra = $('.model .extra[data-id="' + productId + '"]');
        var amount = convertToNumber(item.find('.number').text());

        if (amount > 0) {
            extra.show();
        } else {
            extra.hide();
        }
    }

    // Show frame colors when selected
    function toggleFrameImage(frameAttribute) {
        var frame = $('.model .' + frameAttribute);
        var frameColor = $('.color-picker[data-attr="color-' + frameAttribute + '"] .selected').parent().data('value');
        frameColor = frameColor.toLowerCase();

        // Replace frame image source
        frame.find('img').attr('src', assets.image_url + '/product-opties/umotion_' + frameAttribute + '_' + frameColor + '.png');
    }

    // Convert money text to decimal
    function convertToNumber(numText) {
        var number;
        number = numText.replace('€', '');
        number = number.replace(',', '.');
        number = number.replace('.', ' ');
        number = parseFloat(number);

        if (number != 'NaN') {
            return number;
        } else {
            return 0;
        }
    }

    // Convert decimal to money text
    function convertToMoney(decimal) {
        decimal = decimal.toFixed(2);
        decimal = decimal.toString().replace('.', ',');
        return decimal;
    }


    var fadeIn = null;


    //Spritespinner
    function initSpin() {

        var dir = assets.image_url + '/360/';

        console.log(dir);

        spin = $('#mySpriteSpin').spritespin({
            source: [
                dir + 'uMotion_360_001.png',
                dir + 'uMotion_360_002.png',
                dir + 'uMotion_360_003.png',
                dir + 'uMotion_360_004.png',
                dir + 'uMotion_360_005.png',
                dir + 'uMotion_360_006.png',
                dir + 'uMotion_360_007.png',
                dir + 'uMotion_360_008.png',
                dir + 'uMotion_360_009.png',
                dir + 'uMotion_360_010.png',
                dir + 'uMotion_360_011.png',
                dir + 'uMotion_360_012.png',
                dir + 'uMotion_360_013.png',
                dir + 'uMotion_360_014.png',
                dir + 'uMotion_360_015.png',
                dir + 'uMotion_360_016.png',
                dir + 'uMotion_360_017.png',
                dir + 'uMotion_360_018.png',
                dir + 'uMotion_360_019.png',
                dir + 'uMotion_360_020.png',
                dir + 'uMotion_360_021.png',
                dir + 'uMotion_360_022.png',
                dir + 'uMotion_360_023.png',
                dir + 'uMotion_360_024.png',
                dir + 'uMotion_360_025.png',
                dir + 'uMotion_360_026.png',
                dir + 'uMotion_360_027.png',
                dir + 'uMotion_360_028.png',
                dir + 'uMotion_360_029.png',
                dir + 'uMotion_360_030.png',
                dir + 'uMotion_360_031.png',
                dir + 'uMotion_360_032.png',
                dir + 'uMotion_360_033.png',
                dir + 'uMotion_360_034.png',
                dir + 'uMotion_360_035.png',
                dir + 'uMotion_360_036.png'
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

        $('#spinloader').width($('#mySpriteSpin').width()).height(($('#mySpriteSpin').width() * 0.3));

    }

    //Hide preoload
    function hidePreload() {
        $('#spinloader').hide();
        $('#mySpriteSpin').show();
    }

    // Connects
    $('.product-highlights li').click(function (event) {
        $('.product-highlights li.active').removeClass('active');
        event.preventDefault();

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


        //$(".product-highlight").remove();

        if (activeFrame == '') {
            activeFrame = 0;
        }
        api.playTo(activeFrame);
    }
    

    function showHighlight(data) {
        $('.product-highlight').remove();
        var dir = assets.image_url;
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
            $('<div class="product-highlight"><img src="' + dir + '/360/highlight/' + image + '"/></div>').hide().appendTo('#mySpriteSpin').fadeIn();
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

    $('#test-ride').click(function (e) {
        e.preventDefault();
        $('.popup-container').addClass('show');

        $("html, body").animate({scrollTop: "0"}, 800);
    });

    $('.popup-container').find('.close-button').click(function () {
        $(this).closest('.popup-container').removeClass('show');
    });

    $('.all-properties').click(function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('.product-specifications').offset().top
        }, 1000);
    });
});