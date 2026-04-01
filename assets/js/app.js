var width = window.innerWidth;

/* Navbar scroll behavior */
window.addEventListener('scroll', function (e) {
    var headernavbar = document.getElementById("headernavbar");
    if (headernavbar) {
        if (window.scrollY > 100){
            headernavbar.classList.add('scrolled');
            headernavbar.style.position = 'fixed';
            headernavbar.style.top = '0';
            headernavbar.style.background = 'rgba(0, 28, 68, 0.95)';
            headernavbar.style.backdropFilter = 'blur(10px)';
            headernavbar.style.padding = '15px 81px';
        } else {
            headernavbar.classList.remove('scrolled');
            headernavbar.style.position = '';
            headernavbar.style.top = '';
            headernavbar.style.background = '';
            headernavbar.style.backdropFilter = '';
            headernavbar.style.padding = '';
        }
    }
});

function elementScrolled(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    if($(elem).offset()){
        var elemTop = $(elem).offset().top;
        return ((elemTop <= docViewBottom) && (elemTop >= docViewTop));
    }
}

$(document).ready(function() {
    /* MENU */
    $('.navbar-nav').attr('id', 'menu');
    $( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
    $( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );

    var divs = $(".card-profiles > div");
    for(var i = 0; i < divs.length; i+=2) {
        divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
    }

    var headerNavbar = $('#headerNavbar');
    var width100 = $('.width100');
    var innerWidth = $('body').innerWidth();
    headerNavbar.width(innerWidth);
    width100.width(innerWidth);

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    /* Language dropdown */
    (function(){
        var $dropdown = $('#language-switcher.language-dropdown');
        if(!$dropdown.length){ return; }

        var $toggle = $dropdown.find('.selected-language');
        var $menu = $dropdown.find('.language-options');

        function closeDropdown(){
            $dropdown.removeClass('open');
            $toggle.attr('aria-expanded', 'false');
        }

        function openDropdown(){
            $dropdown.addClass('open');
            $toggle.attr('aria-expanded', 'true');
        }

        $toggle.on('click', function(e){
            e.preventDefault();
            if($dropdown.hasClass('open')){ closeDropdown(); } else { openDropdown(); }
        });

        $(document).on('click', function(e){
            if(!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0){
                closeDropdown();
            }
        });

        $(document).on('keydown', function(e){
            if(e.key === 'Escape'){
                closeDropdown();
            }
        });
    })();

    $("nav").removeClass("no-transition");

    /* Mobile menu */
    if (width < 992) {
        $('#menuToggle input[type="checkbox"]').change(function(){
            var checked = $(this).is(":checked");
            if(checked){
                $('#menu').show("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('#menu, #menu *').css({
                    'visibility': 'visible'
                });
                $('body', 'html').css({
                    'overflow': 'hidden'
                });
            }else{
                $('#menu').hide("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('body', 'html').css({
                    'overflow': 'auto'
                });
            }
        });
    }

    /* Accordion toggle */
    $('body').on('click', '.accordion-toggle', function () {
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").slideUp(300);
            $(this).children(".plusminus").html('<span class="plus">Read more</span>');
        } else {
            $(this).next(".accordion-content").slideDown(300);
            $(this).children(".plusminus").html('<span class="minus">Read less</span>');
        }
    });

    /* Hash navigation */
    if (window.location.hash) {
        var link = window.location.hash;
        var anchorId = link.substr(link.indexOf("#") + 1);
        if($("#"+anchorId).offset()){
            $('html, body').animate({
                scrollTop: $("#"+anchorId).offset().top - 150
            }, 500);
        } else {
            $('.accordion-border').each(function(){
                var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                var toggler = $(this).find(".accordion-toggle");
                if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger( "click" );
                }
            });
        }
    }

    /* Dropdown anchor navigation */
    $('.dropdown a').click(function(event) {
        if (location.href.indexOf("#") != -1) {
            var link = $(this).attr('href');
            var anchorId = link.substr(link.indexOf("#") + 1);
            if($("#"+anchorId).length>0){
                $('html, body').animate({
                    scrollTop: $("#"+anchorId).offset().top - 150
                }, 500);
            } else {
                $('.accordion-border').each(function(){
                    var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    var toggler = $(this).find(".accordion-toggle");
                    if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger( "click" );
                        event.preventDefault();
                    }
                });
            }
        }
    });

    /* Library author formatting */
    $('.library-item').each(function(){
        var element = $(this).find('.text-ligth');
        if (element.length) {
            var texts = $(element[0]).text().split(',');
            var boldTexts = texts.map(function(text) { return '<span class="author_item">' + text + '</span>'; }).join('');
            $(element[0]).html(boldTexts);
        }
    });

    /* Tabs (partners, etc.) */
    $('.partners .tabs').each(function(){
        var $active, $content, $links = $(this).find('a');
        var speed = "fast";
        var activeTab = $(location.hash);

        $active = $($links.filter("[href='"+location.hash+"']")[0] || $links[0]);

        if($(this).parent().parent().hasClass('partners')){
            $active.addClass('active');
        }

        $links.not($active).removeClass('active');
        $content = $($active[0].hash);

        $links.not($active).each(function () {
            $(this.hash).hide();
        });

        if(activeTab.length){
            $content.slideDown(speed);
            $('html, body').animate({
                scrollTop: activeTab.offset().top - $('header').height()
            }, speed);
        }

        $(this).find("a").click(function (e) {
            if($(this).hasClass('active')) {
                e.preventDefault();
                return false;
            }
            $active.removeClass('active');
            $content.hide();

            $active = $(this);
            $content = $(this.hash);

            location.hash = $active[0].hash;

            $active.addClass('active');
            $content.slideDown(speed);

            e.preventDefault();
        });
    });

    onHashChange();
    $(window).on("hashchange", function() {
        onHashChange();
    });

    $('.nav.nav-pills').removeAttr('id');
    $('.see_all_partners_link').hide();

    $('<div class="mark"></div>').insertAfter($('.group-holder input'));

    /* Keyboard navigation */
    $('body').on("keyup", function(e) {
        var code = e.which;
        if (code == 39) {
            e.preventDefault();
            $('.next').trigger('click');
        } else if (code == 37) {
            e.preventDefault();
            $('.prev').trigger('click');
        }
    });

    /* LANGUAGE SWITCH - custom select */
    document.querySelectorAll('select.locale-select').forEach(function(select) {
        var wrapper = document.createElement('div');
        wrapper.className = 'custom-select';
        select.parentNode.insertBefore(wrapper, select);
        wrapper.appendChild(select);

        var selected = select.options[select.selectedIndex];

        var trigger = document.createElement('div');
        var selectedCode = selected.value.split('/')[1] || selected.value.split('/')[0];
        var regex = new RegExp('^(\/' + selectedCode + ')(\/|$)');
        var hash = window.location.hash;

        trigger.className = 'custom-select__trigger';
        trigger.innerHTML = '<span class="flag-icon flag-icon-' + selectedCode + '"></span> <span>' + selectedCode + '</span>';
        wrapper.appendChild(trigger);

        var list = document.createElement('div');
        list.className = 'custom-select__options';

        for (var i = 0; i < select.options.length; i++) {
            var opt = select.options[i];
            var localeCode = opt.value.split('/')[1] || opt.value.split('/')[0];
            var newPath = window.location.pathname.replace(regex, '/' + localeCode + '/');

            if (!window.location.pathname.match(regex)) {
                newPath = '/' + localeCode + window.location.pathname;
            }

            newPath = newPath.replace(/\/\/+/g, '/');

            var item = document.createElement('div');
            item.className = 'custom-select__option' + (opt.selected ? ' is-selected' : '');
            item.dataset.value = newPath + hash;
            item.innerHTML = '<span class="flag-icon flag-icon-' + localeCode + '"></span> ' + opt.text;
            list.appendChild(item);
        }
        wrapper.appendChild(list);

        trigger.onclick = function(e) {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.is-open').forEach(function(el) {
                if (el !== wrapper) el.classList.remove('is-open');
            });
            wrapper.classList.toggle('is-open');
        };

        list.onclick = function(e) {
            var option = e.target.closest('.custom-select__option');
            if (option) window.location.assign(option.dataset.value);
        };
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select.is-open').forEach(function(el) {
            el.classList.remove('is-open');
        });
    });
});

function expandBiography(el){
    var $el = $(el);
    var $body = $el.parent().parent().parent().find('.body');
    if($body.is(':visible')){
        $body.slideUp(300);
        $el.addClass('expanded');
    } else {
        $body.slideDown(300);
        $el.removeClass('expanded');
    }
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    if($(elem).height()){
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        return ((elemBottom/2 <= docViewBottom) && (elemTop >= docViewTop));
    }
    return false;
}

function onHashChange(){
    $(".accordion-content").hide();
    var caseStudiesHashTitle = location.hash;
    if(caseStudiesHashTitle){
        var caseStudiesTitle = caseStudiesHashTitle.substring(1, caseStudiesHashTitle.length);
    }
}

function getScreenSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    };
}
