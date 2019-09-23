'use strict';

$(document).ready(function () {
    $(document).foundation();
    kokoc.init();
    $(' input[type="tel"]').mask('+7 (999) 999-9999');
    $(window).resize(function () {
        kokoc.plugins.articles.init();
        $('.advantages_slider').slick('resize');
        $('.main_photogallery-slider').slick('resize');
    });
});

var kokoc = {
    init: function init() {
        this.plugins.search.init();
        this.plugins.mobileMenu.init();
        this.plugins.sliders.init();
        this.plugins.mainPage.init();
        this.plugins.forms.init();
        this.plugins.articles.init();
        this.plugins.deliveryCalc.init();
        this.plugins.map.init();
        this.plugins.calculator.init();
    },
    plugins: {
        search: {
            init: function init() {
                $('.header-search .search_btn').on('click', function (e) {
                    e.preventDefault();
                    $('.header-search').addClass('is-open');
                });
                $('.header-search .search_btn-close').on('click', function (e) {
                    $('.header-search').removeClass('is-open');
                });
            }
        },
        map: {
            init: function init() {
                if ($('#map').length > 0) {
                    var map;
                    ymaps.ready(['Map', 'GeoObjectCollection', 'Placemark']).then(function () {
                        var collection = new ymaps.GeoObjectCollection({}, { preset: 'islands#blueStretchyIcon' });
                        var palcemarkOptions = {
                            iconLayout: 'default#image',
                            iconImageHref: '/assets/img/ballon.svg',
                            iconImageSize: [40, 43],
                            iconImageOffset: [-5, -38]
                        };

                        if (mapsPoints && mapsPoints.length > 0) {
                            mapsPoints.forEach(function (place) {
                                return collection.add(new ymaps.Placemark(place.coords, { locationUrl: place.locationUrl }, palcemarkOptions));
                            });
                        }
                        collection.add(new ymaps.Placemark([55.8545, 38.4418], { locationUrl: '/arenda-bytovok-v-noginske/' }, palcemarkOptions));

                        map = new ymaps.Map('map', { center: [55.74, 37.62], zoom: 7, controls: [] }, {});
                        map.geoObjects.add(collection);

                        map.setBounds(collection.getBounds(), { checkZoomRange: true, zoomMargin: 10 });
                        map.geoObjects.events.add('click', function (e) {
                            var target = e.get('target');

                            window.location.href = target.properties.get('locationUrl');
                        });
                    });
                }
                if ($('#contact-map').length > 0) {
                    ymaps.ready(init);
                }

                function init() {
                    // Создание карты.
                    var myMap = new ymaps.Map("contact-map", {
                        center: [55.734582569011664, 37.39181650000001],
                        zoom: 16,
                        controls: []
                    });
                    var myPlacemark = new ymaps.Placemark([55.734582569011664, 37.39181650000001], {}, {
                        preset: 'islands#icon',
                        iconColor: '#0095b6'
                    });
                    myMap.geoObjects.add(myPlacemark);
                }
            }
        },
        mobileMenu: {
            init: function init() {
                var hamb = $('.hamburger');

                hamb.on('click', function () {
                    $('body').toggleClass('menu-open');
                });
                $('.menu-arrows').on('click', function () {
                    $(this).closest('li').toggleClass('mobile-open');
                });
            }
        },
        mainPage: {
            init: function init() {
                var question = $('.often-question-item');

                question.on('click', '.often-question-ask', function () {
                    $(this).next().slideToggle();
                });
            }
        },
        articles: {
            init: function init() {
                if ($(window).width() < 980) {
                    $('.main_article a').on('click', function (e) {
                        e.preventDefault();
                        $('.main_article-wrapper').slideToggle();
                    });
                }
            }
        },
        calculator: {
            init: function init() {
                var checkboxCalc = $('.calculator_form input[type="checkbox"]'),
                    deliveryCalc = $('.calculator_form input[name="distance"] '),
                    countGoods = $('.calculator_form input[name="count"] ').val(),
                    rentCount = $('.calculator_form input[name="rent"] ').val(),
                    priceDelivery = 50,
                    result = "";

                checkboxCalc.on('change', function () {
                    if ($(this).prop('checked')) {
                        deliveryCalc.prop('disabled', false);
                    } else {
                        deliveryCalc.prop('disabled', true).val('');
                    }
                });
            }
        },
        deliveryCalc: {
            init: function init() {
                var checkboxDelivery = $('.delivery_calculator input[type="checkbox"]'),
                    inputDelivery = $('.delivery_calculator input[type="text"] '),
                    minDistance = 50,
                    fixCost = 6500,
                    priceDelivery = 50,
                    result = "";

                checkboxDelivery.on('change', function () {
                    if ($(this).prop('checked')) {
                        inputDelivery.prop('disabled', false);
                    } else {
                        inputDelivery.prop('disabled', true).val('');
                        $('.delivery_calculator-price span').html(fixCost);
                        console.log(fixCost);
                    }
                });

                inputDelivery.on('change', function () {
                    var delivery = $(this).val(),
                        cost = fixCost + (delivery - minDistance) * priceDelivery;

                    if (delivery > minDistance) {
                        result = cost;
                    } else {
                        result = fixCost;
                    }

                    $('.delivery_calculator-price span').html(result);
                    console.log(delivery);
                });
            }
        },
        forms: {
            init: function init() {

                $('.order_form-group input, .order_form-group textarea').each(function () {
                    kokoc.plugins.forms.formValidation($(this));
                });
                $('.order_form-group input, .order_form-group textarea').blur(function () {
                    kokoc.plugins.forms.formValidation($(this));
                });
                $(".select").select2({
                    placeholder: "Выбрать тип бытовки",
                    allowClear: false

                });
                $(".select").on('change', function (e) {
                    $(this).select2('close');
                });

                $('input.number').keypress(function (event) {
                    var key, keyChar;
                    if (!event) var event = window.event;

                    if (event.keyCode) key = event.keyCode;else if (event.which) key = event.which;

                    if (key == null || key == 0 || key == 8 || key == 13 || key == 9 || key == 46 || key == 37 || key == 39) return true;
                    keyChar = String.fromCharCode(key);

                    if (!/\d/.test(keyChar)) return false;
                });
            },
            formValidation: function formValidation(input) {
                var inputVal = input.val();

                if (inputVal) {
                    input.addClass('value-exists');
                } else {
                    input.removeClass('value-exists');
                }
            }
        },
        sliders: {
            init: function init() {
                var mainSlider = $('.main_slider'),
                    bytovkaSlider = $('.preview_bytovka-slider');

                mainSlider.slick({
                    slidesToShow: 1,
                    autoplay: false,
                    responsive: [{
                        breakpoint: 980,
                        settings: {
                            dots: true,
                            arrows: false
                        }
                    }]
                });

                bytovkaSlider.slick({
                    slidesToShow: 1
                });
                $('.advantages_slider').slick({
                    mobileFirst: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    responsive: [{
                        breakpoint: 980,
                        settings: "unslick"
                    }]
                });

                $('.main_photogallery-slider').slick({
                    slidesToShow: 1,
                    mobileFirst: true,
                    dots: true,
                    rows: 1,
                    arrows: false,
                    slidesPerRow: 1,
                    responsive: [{
                        breakpoint: 980,
                        settings: {
                            slidesToShow: 1,
                            slidesPerRow: 2,
                            rows: 2,
                            dots: false,
                            arrows: true
                        }
                    }]
                });

                $('.photogallery-for').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: '.photogallery-nav',
                    responsive: [{
                        breakpoint: 980,
                        settings: {
                            dots: true
                        }
                    }]
                });
                $('.photogallery-nav').slick({
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    asNavFor: '.photogallery-for',
                    dots: false,
                    infinite: false
                });

                $('.card_bytovka-for').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    infinite: false,
                    asNavFor: '.card_bytovka-nav',
                    responsive: [{
                        breakpoint: 980,
                        settings: {
                            dots: true,
                            arrows: true
                        }
                    }]
                });
                $('.card_bytovka-nav').slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: '.card_bytovka-for',
                    dots: false,
                    focusOnSelect: true
                });

                mainSlider.css("visibility", "visible");
                bytovkaSlider.css("visibility", "visible");
                $('.card_bytovka-nav').css("visibility", "visible");
                $('.card_bytovka-for').css("visibility", "visible");
            }
        }
    }
};