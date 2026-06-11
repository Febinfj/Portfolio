/* ==========================================================================
   Febin Jacob - Premium Personal Portfolio Scripts
   ========================================================================== */

(function($) {
    'use strict';

    var pluginName = 'ScrollIt',
        pluginVersion = '1.0.3';

    /*
     * OPTIONS
     */
    var defaults = {
        upKey: 38,
        downKey: 40,
        easing: 'linear',
        scrollTime: 600,
        activeClass: 'active',
        onPageChange: null,
        topOffset : -60
    };

    $.scrollIt = function(options) {

        /*
         * DECLARATIONS
         */
        var settings = $.extend(defaults, options),
            active = 0,
            lastIndex = $('[data-scroll-index]:last').attr('data-scroll-index');

        /*
         * METHODS
         */

        /**
         * navigate
         *
         * sets up navigation animation
         */
        var navigate = function(ndx) {
            if(ndx < 0 || ndx > lastIndex) return;

            var targetTop = $('[data-scroll-index=' + ndx + ']').offset().top + settings.topOffset + 1;
            $('html,body').animate({
                scrollTop: targetTop,
                easing: settings.easing
            }, settings.scrollTime);
        };

        /**
         * doScroll
         *
         * runs navigation() when criteria are met
         */
        var doScroll = function (e) {
            var target = $(e.target).closest("[data-scroll-nav]").attr('data-scroll-nav') ||
            $(e.target).closest("[data-scroll-goto]").attr('data-scroll-goto');
            navigate(parseInt(target));
        };

        /**
         * keyNavigation
         *
         * sets up keyboard navigation behavior
         */
        var keyNavigation = function (e) {
            var key = e.which;
            if($('html,body').is(':animated') && (key == settings.upKey || key == settings.downKey)) {
                return false;
            }
            if(key == settings.upKey && active > 0) {
                navigate(parseInt(active) - 1);
                return false;
            } else if(key == settings.downKey && active < lastIndex) {
                navigate(parseInt(active) + 1);
                return false;
            }
            return true;
        };

        /**
         * updateActive
         *
         * sets the currently active item
         */
        var updateActive = function(ndx) {
            if(settings.onPageChange && ndx && (active != ndx)) settings.onPageChange(ndx);

            active = ndx;
            $('[data-scroll-nav]').removeClass(settings.activeClass);
            $('[data-scroll-nav=' + ndx + ']').addClass(settings.activeClass);
        };

        /**
         * watchActive
         *
         * watches currently active item and updates accordingly
         */
        var watchActive = function() {
            var winTop = $(window).scrollTop();

            var visible = $('[data-scroll-index]').filter(function(ndx, div) {
                return winTop >= $(div).offset().top + settings.topOffset &&
                winTop < $(div).offset().top + (settings.topOffset) + $(div).outerHeight()
            });
            var newActive = visible.first().attr('data-scroll-index');
            updateActive(newActive);
        };

        /*
         * runs methods
         */
        $(window).on('scroll',watchActive).scroll();

        $(window).on('keydown', keyNavigation);

        $('body').on('click','[data-scroll-nav], [data-scroll-goto]', function(e){
            e.preventDefault();
            doScroll(e);
        });

    };
}(jQuery));

/* ==========================================================================
   Custom Script Functions
   ========================================================================== */

$(document).ready(function() {
    'use strict';

    // 1. Sticky Header
    $(window).on("scroll", function() {
        if($(this).scrollTop() > 50) {
            $(".navbar").addClass("navbar-shrink");
        } else {
            $(".navbar").removeClass("navbar-shrink");
        }
    });
    
    // Trigger scroll shrinkage check on load
    if ($(window).scrollTop() > 50) {
        $(".navbar").addClass("navbar-shrink");
    }

    // 2. Parallax Setup
    function initParallax() {
        if($("#parallax").length && typeof Parallax !== 'undefined') {
            var scene = document.getElementById("parallax");
            var parallaxInstance = new Parallax(scene);
        }
    }
    initParallax();

    // 3. Dark/Light Mode Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Initialize Theme on Load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // Toggle click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
            
            localStorage.setItem('theme', theme);
        });
    }

    // 4. Typewriter Animation Effect
    const typewriterEl = document.getElementById('typewriter');
    const words = ["UI/UX Designer", "Web Developer", "Creative Freelancer", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 150;

    function handleTypewriter() {
        if (!typewriterEl) return;
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 60; // Erase faster
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 120; // Type delay speed
        }

        // Add standard glowing blinking cursor via style.css styling class
        typewriterEl.classList.add('typewriter-text');

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeDelay = 2000; // Hold at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeDelay = 500; // Pause before next word
        }

        setTimeout(handleTypewriter, typeDelay);
    }
    
    if (typewriterEl) {
        setTimeout(handleTypewriter, 1000);
    }

    // 5. Scroll Triggered Skills Animation (Runs Only Once)
    var animatedSkills = false;
    $(window).on('scroll', function() {
        var skillWrapper = $("#skill-bar-wrapper");
        if(skillWrapper.length) {
            var hT = skillWrapper.offset().top;
            var hH = skillWrapper.outerHeight();
            var wH = $(window).height();
            var wS = $(this).scrollTop();

            if (!animatedSkills && wS > (hT + hH - 1.3 * wH)) {
                animatedSkills = true;
                $('.skillbar-container').each(function() {
                    $(this).find('.skills').animate({
                        width: $(this).attr('data-percent')
                    }, 2000);
                });
            }
        }
    });

    // 6. Isotope Grid Layout & Filtering
    var $grid = $('.img-gallery .grid').imagesLoaded(function() {
        $grid.isotope({
            itemSelector: '.single-work',
            layoutMode: 'fitRows',
            transitionDuration: '0.6s'
        });
    });

    // Filtering active button and trigger layouts
    $('.img-gallery .sortBtn .filter-btn').on('click', function(e) {
        e.preventDefault();
        $('.img-gallery .sortBtn .filter-btn').removeClass('active');
        $(this).addClass('active');

        var selector = $(this).attr('data-filter');
        $grid.isotope({
            filter: selector
        });
        return false;
    });

    // 7. Magnific Popup Image Gallery
    if ($.fn.magnificPopup) {
        $('.image-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                titleSrc: function(item) {
                    return item.el.attr('title') || 'My Work Project';
                }
            },
            zoom: {
                enabled: true,
                duration: 300,
                opener: function(element) {
                    return element.find('img');
                }
            }
        });
    }

    // 8. Owl Carousel Initializer
    if ($.fn.owlCarousel) {
        $('.testimonial-slider').owlCarousel({
            loop: true,
            margin: 20,
            autoplay: true,
            autoplayTimeout: 4000,
            smartSpeed: 800,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                },
                768: {
                    items: 2,
                },
                1000: {
                    items: 3,
                }
            }
        });
    }

    // 9. ScrollIt Plugin Activation
    if ($.scrollIt) {
        $.scrollIt({
            upKey: 38,
            downKey: 40,
            easing: 'swing',
            scrollTime: 800,
            activeClass: 'active',
            onPageChange: null,
            topOffset: -80
        });
    }

    // 10. Hide Mobile Navbar when an item is selected
    $(".nav-link").on("click", function() {
        $(".navbar-collapse").collapse("hide");
    });

});