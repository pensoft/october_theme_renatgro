/**
 * ReNatgro Theme - Main Application Script
 *
 * Modules:
 *  - Navbar        Scroll-based sticky header
 *  - MobileMenu    Hamburger toggle for small screens
 *  - Accordion     Expand/collapse content blocks
 *  - Tabs          Tab switching (partners, etc.)
 *  - LocaleSelect  Custom language switcher dropdown
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
            window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        },
        onScroll: function () {
            this.el.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
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

    /* ─── Locale Select (custom dropdown) ────────────────── */

    var LocaleSelect = {
        init: function () {
            document.querySelectorAll('select.locale-select').forEach(this.build.bind(this));
            document.addEventListener('click', this.closeAll);
        },

        build: function (select) {
            var wrapper  = this.wrap(select);
            var selected = select.options[select.selectedIndex];
            var code     = this.extractCode(selected.value);
            var regex    = new RegExp('^(/' + code + ')(/|$)');
            var hash     = window.location.hash;

            var trigger = document.createElement('div');
            trigger.className = 'custom-select__trigger';
            trigger.innerHTML = '<span class="flag-icon flag-icon-' + code + '"></span> <span>' + code + '</span>';
            wrapper.appendChild(trigger);

            var list = document.createElement('div');
            list.className = 'custom-select__options';

            for (var i = 0; i < select.options.length; i++) {
                var opt        = select.options[i];
                var localeCode = this.extractCode(opt.value);
                var newPath    = this.buildPath(localeCode, regex, hash);

                var item = document.createElement('div');
                item.className = 'custom-select__option' + (opt.selected ? ' is-selected' : '');
                item.dataset.value = newPath;
                item.innerHTML = '<span class="flag-icon flag-icon-' + localeCode + '"></span> ' + opt.text;
                list.appendChild(item);
            }
            wrapper.appendChild(list);

            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                document.querySelectorAll('.custom-select.is-open').forEach(function (el) {
                    if (el !== wrapper) el.classList.remove('is-open');
                });
                wrapper.classList.toggle('is-open');
            });

            list.addEventListener('click', function (e) {
                var option = e.target.closest('.custom-select__option');
                if (option) window.location.assign(option.dataset.value);
            });
        },

        wrap: function (select) {
            var wrapper = document.createElement('div');
            wrapper.className = 'custom-select';
            select.parentNode.insertBefore(wrapper, select);
            wrapper.appendChild(select);
            return wrapper;
        },

        extractCode: function (value) {
            return value.split('/')[1] || value.split('/')[0];
        },

        buildPath: function (localeCode, regex, hash) {
            var path = window.location.pathname.replace(regex, '/' + localeCode + '/');
            if (!window.location.pathname.match(regex)) {
                path = '/' + localeCode + window.location.pathname;
            }
            return path.replace(/\/\/+/g, '/') + hash;
        },

        closeAll: function () {
            document.querySelectorAll('.custom-select.is-open').forEach(function (el) {
                el.classList.remove('is-open');
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
            this.$overlay = $('#objectivePopupOverlay');
            if (!this.$overlay.length) return;

            $(document).on('click', '[data-objective]', this.open.bind(this));
            $(document).on('click', '#popupClose',      this.close.bind(this));
            $(document).on('click', '#objectivePopupOverlay', this.onOverlayClick.bind(this));
            $(document).on('keydown', this.onKeydown.bind(this));
        },

        open: function (e) {
            e.stopPropagation();
            var $el    = $(e.currentTarget).closest('[data-objective]');
            var title  = $el.attr('data-title');
            var image  = $el.attr('data-image');
            var raw    = $el.attr('data-items');
            if (!title || !raw) return;

            $('#popupTitle').text(title);
            $('#popupImage').attr({ src: image, alt: title });

            var $list = $('#popupList').empty();
            raw.split('||').forEach(function (text) {
                text = text.trim();
                if (text) $list.append('<li>' + text + '</li>');
            });

            this.$overlay.css('display', 'flex');
            $('body').css('overflow', 'hidden');
        },

        close: function () {
            this.$overlay.css('display', 'none');
            $('body').css('overflow', '');
        },

        onOverlayClick: function (e) {
            if (e.target === this.$overlay[0]) this.close();
        },

        onKeydown: function (e) {
            if (e.key === 'Escape') this.close();
        }
    };

    /* ─── Bootstrap ──────────────────────────────────────── */

    Navbar.init();

    $(function () {
        MobileMenu.init();
        Accordion.init();
        Tabs.init();
        LocaleSelect.init();
        HashNav.init();
        Popup.init();
    });

})(jQuery, window, document);
