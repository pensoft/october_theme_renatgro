/**
 * ReNatgro Theme - Main Application Script
 *
 * Modules:
 *  - Navbar        Scroll-based sticky header
 *  - MobileMenu    Hamburger toggle for small screens
 *  - Accordion     Expand/collapse content blocks
 *  - Tabs          Tab switching (partners, etc.)
 *  - HashNav       Smooth-scroll to anchored sections
 *  - Popup         Objective diagram popups
 */
;(function ($, window, document) {
    'use strict';

    var BREAKPOINT_LARGE = 992;
    var SCROLL_THRESHOLD = 100;
    var HEADER_OFFSET    = 150;
    var ANIM_SPEED       = 300;

    /* ─── Navbar ─────────────────────────────────────────── */

    var Navbar = {
        init: function () {
            this.el = document.getElementById('headernavbar');
            if (!this.el) return;
            this.scrolledPadding = window.innerWidth < BREAKPOINT_LARGE ? '15px 20px' : '15px 81px';
            var handler = this.onScroll.bind(this);
            window.addEventListener('scroll', handler, { passive: true });
            document.body.addEventListener('scroll', handler, { passive: true });
            this.onScroll();
        },
        getScrollTop: function () {
            return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        },
        onScroll: function () {
            if (this.getScrollTop() > SCROLL_THRESHOLD) {
                this.el.classList.add('scrolled');
                this.el.setAttribute('style',
                    'position:fixed;top:0;left:0;width:100%;z-index:10000;' +
                    'background:rgba(0,28,68,0.95);backdrop-filter:blur(10px);' +
                    '-webkit-backdrop-filter:blur(10px);padding:' + this.scrolledPadding +
                    ';box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;'
                );
            } else {
                this.el.classList.remove('scrolled');
                this.el.removeAttribute('style');
            }
        }
    };

    /* ─── Mobile Menu ────────────────────────────────────── */

    var MobileMenu = {
        init: function () {
            if (window.innerWidth >= BREAKPOINT_LARGE) return;
            var $toggle = $('#menuToggle input[type="checkbox"]');
            if (!$toggle.length) return;

            $toggle.on('change', function () {
                var open = $(this).is(':checked');
                var $menu = $('#menu');
                if (open) {
                    $menu.show('slide', { direction: 'right' }, 400);
                    $menu.add($menu.find('*')).css('visibility', 'visible');
                    $('body').css('overflow', 'hidden');
                } else {
                    $menu.hide('slide', { direction: 'right' }, 400);
                    $('body').css('overflow', '');
                }
            });
        }
    };

    /* ─── Accordion ──────────────────────────────────────── */

    var Accordion = {
        init: function () {
            $(document).on('click', '.accordion-toggle', function () {
                var $content = $(this).next('.accordion-content');
                var $label   = $(this).find('.plusminus');
                if ($content.is(':visible')) {
                    $content.slideUp(ANIM_SPEED);
                    $label.html('<span class="plus">Read more</span>');
                } else {
                    $content.slideDown(ANIM_SPEED);
                    $label.html('<span class="minus">Read less</span>');
                }
            });
        }
    };

    /* ─── Tabs ───────────────────────────────────────────── */

    var Tabs = {
        init: function () {
            $('.tabs').each(function () {
                var $links  = $(this).find('a');
                if (!$links.length) return;

                var $active  = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
                var $content = $($active[0].hash);

                $active.addClass('active');
                $links.not($active).removeClass('active').each(function () {
                    $(this.hash).hide();
                });

                if (location.hash && $(location.hash).length) {
                    $content.slideDown('fast');
                }

                $links.on('click', function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('active')) return;

                    $active.removeClass('active');
                    $content.hide();

                    $active  = $(this).addClass('active');
                    $content = $(this.hash).slideDown('fast');
                    location.hash = this.hash;
                });
            });
        }
    };

    /* ─── Hash Navigation ────────────────────────────────── */

    var HashNav = {
        init: function () {
            this.scrollToHash();
            $(window).on('hashchange', this.scrollToHash.bind(this));
        },

        scrollToHash: function () {
            if (!window.location.hash) return;
            var id = window.location.hash.substring(1);
            var $target = $('#' + id);

            if ($target.length && $target.offset()) {
                $('html, body').animate({ scrollTop: $target.offset().top - HEADER_OFFSET }, 500);
            } else {
                this.openMatchingAccordion(id);
            }
        },

        openMatchingAccordion: function (id) {
            $('.accordion-border').each(function () {
                var title   = $(this).find('.accordion-toggle .col-xs.start-xs').text().toUpperCase();
                var $toggle = $(this).find('.accordion-toggle');
                if (title.indexOf(id.toUpperCase()) >= 0 && !$toggle.next('.accordion-content').is(':visible')) {
                    $('html, body').animate({ scrollTop: $toggle.parent().offset().top - HEADER_OFFSET }, 500);
                    $toggle.trigger('click');
                }
            });
        }
    };

    /* ─── Objective Popup ────────────────────────────────── */

    var Popup = {
        init: function () {
            if (!$('.objective-popup-overlay').length) return;

            // Ensure close buttons have an icon (fallback if CMS stripped it)
            $('[data-popup-close]').each(function () {
                if (!$(this).find('img, svg').length) {
                    $(this).html('<img src="/themes/pensoft-renatgro/assets/images/icon-close.svg" alt="Close">');
                }
            });

            $(document).on('click', '[data-popup-target]', this.open.bind(this));
            $(document).on('click', '[data-popup-close]', this.close.bind(this));
            $(document).on('click', '.objective-popup-overlay', this.onOverlayClick.bind(this));
            $(document).on('keydown', this.onKeydown.bind(this));
        },

        open: function (e) {
            e.stopPropagation();
            var id = $(e.currentTarget).attr('data-popup-target');
            if (!id) return;
            $('#' + id).css('display', 'flex');
            $('body').css('overflow', 'hidden');
        },

        close: function () {
            $('.objective-popup-overlay').css('display', 'none');
            $('body').css('overflow', '');
        },

        onOverlayClick: function (e) {
            if ($(e.target).hasClass('objective-popup-overlay')) this.close();
        },

        onKeydown: function (e) {
            if (e.key === 'Escape') this.close();
        }
    };

    /* ─── Diagram Dots (inject if missing) ──────────────────── */

    var DiagramDots = {
        dots: [
            { cls: 'dot-tl', popup: 'objectivePopup1' },
            { cls: 'dot-tr', popup: 'objectivePopup2' },
            { cls: 'dot-bl', popup: 'objectivePopup3' },
            { cls: 'dot-br', popup: 'objectivePopup4' }
        ],
        init: function () {
            // Desktop dots inside .diagram-core
            var core = document.querySelector('.diagram-core');
            if (core) {
                this.dots.forEach(function (d) {
                    if (core.querySelector('.' + d.cls)) return;
                    var btn = document.createElement('button');
                    btn.className = 'obj-dot ' + d.cls;
                    btn.setAttribute('data-popup-target', d.popup);
                    var span = document.createElement('span');
                    btn.appendChild(span);
                    core.appendChild(btn);
                });
            }
            // Mobile dots inside .mobile-item
            document.querySelectorAll('.objective-list-mobile .mobile-item').forEach(function (item) {
                if (item.querySelector('.obj-dot')) return;
                var btn = document.createElement('button');
                btn.className = 'obj-dot';
                var span = document.createElement('span');
                btn.appendChild(span);
                item.insertBefore(btn, item.firstChild);
            });
        }
    };

    /* ─── Diagram Hover Link ────────────────────────────────── */

    var DiagramHover = {
        init: function () {
            $(document).on('mouseenter', '[data-popup-target]', function () {
                var id = $(this).attr('data-popup-target');
                $('[data-popup-target="' + id + '"]').addClass('is-hovered');
            });
            $(document).on('mouseleave', '[data-popup-target]', function () {
                var id = $(this).attr('data-popup-target');
                $('[data-popup-target="' + id + '"]').removeClass('is-hovered');
            });
        }
    };

    /* ─── Hero Text Reveal ──────────────────────────────────── */

    var HeroReveal = {
        init: function () {
            var h1 = document.querySelector('.hero-content h1');
            if (!h1) return;

            var text = h1.textContent.trim();
            var words = text.split(/\s+/);
            h1.innerHTML = '';
            h1.classList.add('hero-reveal');

            words.forEach(function (word, i) {
                var span = document.createElement('span');
                span.className = 'hero-word';
                span.textContent = word;
                span.style.animationDelay = (i * 0.12) + 's';
                h1.appendChild(span);
                if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
            });
        }
    };

    /* ─── Scroll Fill Text ──────────────────────────────── */

    var ScrollFillText = {
        init: function () {
            var elements = document.querySelectorAll('.scroll-fill-text');
            if (!elements.length) return;
            this.instances = [];
            var self = this;

            elements.forEach(function (el) {
                var text = el.textContent.trim();
                var words = text.split(/\s+/);
                el.innerHTML = '';

                words.forEach(function (word, i) {
                    var span = document.createElement('span');
                    span.className = 'scroll-fill-word';
                    span.textContent = word;
                    el.appendChild(span);
                    if (i < words.length - 1) {
                        el.appendChild(document.createTextNode(' '));
                    }
                });

                self.instances.push({
                    el: el,
                    words: el.querySelectorAll('.scroll-fill-word')
                });
            });

            this.ticking = false;
            var handler = function () {
                if (!self.ticking) {
                    self.ticking = true;
                    requestAnimationFrame(function () {
                        self.update();
                        self.ticking = false;
                    });
                }
            };
            window.addEventListener('scroll', handler, { passive: true });
            document.body.addEventListener('scroll', handler, { passive: true });
            this.update();
        },

        update: function () {
            var winH = window.innerHeight;

            this.instances.forEach(function (inst) {
                var rect = inst.el.getBoundingClientRect();
                var start = winH * 0.9;
                var end = winH * 0.3;
                var progress = (start - rect.top) / (start - end);
                progress = Math.max(0, Math.min(1, progress));

                var total = inst.words.length;
                var read = progress * total;

                for (var i = 0; i < total; i++) {
                    if (i < read) {
                        inst.words[i].classList.add('is-read');
                    } else {
                        inst.words[i].classList.remove('is-read');
                    }
                }
            });
        }
    };

    /* ─── Reveal Items (fade-up one by one) ────────────────── */

    var RevealItems = {
        init: function () {
            var items = document.querySelectorAll('.reveal-item');
            if (!items.length) return;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var delay = el.dataset.revealDelay || 0;
                        setTimeout(function () {
                            el.classList.add('is-visible');
                        }, delay);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.15 });

            items.forEach(function (el, i) {
                el.dataset.revealDelay = i * 120;
                observer.observe(el);
            });
        }
    };

    /* ─── Bootstrap ──────────────────────────────────────── */

    $(function () {
        Navbar.init();
        MobileMenu.init();
        Accordion.init();
        Tabs.init();
        HashNav.init();
        DiagramDots.init();
        Popup.init();
        DiagramHover.init();
        HeroReveal.init();
        ScrollFillText.init();
        RevealItems.init();
    });

})(jQuery, window, document);
