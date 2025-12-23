/* global Vue, VueI18n, $, Sparkle, APP_I18N */

let app = new Vue({
  el: '.js-app',
  i18n: (window.APP_I18N || undefined),
  data: {
    years: (new Date()).getFullYear() - 2005,
    gallery: (window.APP_IMAGES || [])
  },
  methods: {
    ensureActiveSlide: function () {
      // If nothing is active, try to activate the hashed slide or the first slide
      if ($('.slide.active').length) return;
      const hash = window.location.hash;
      if (hash && $(hash).length) {
        this.activateSlideById(hash);
        return;
      }
      const $first = $('.slide').first();
      if ($first.length) {
        this.activateSlideById(`#${$first.attr('id')}`);
      }
    },
    activateSlideById: function (hash) {
      if (!hash) {
        return;
      }
      const $slide = $(hash);
      if ($slide.length) {
        this.onSlideOut();
        this.onSlideIn($slide);
        $('.navbar .nav li').removeClass('active');
        $(`.navbar .nav a[href="${hash}"]`).parent().addClass('active');
      }
    },
    scroll: function(event) {
      event.preventDefault();
      $(':focus').blur();

      let hash = $(event.currentTarget).attr('href');
      let $target = $(hash);
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, 1000, () => {
        this.activateSlideById(hash);
      });
    },
    onSlideOut: function () {
      $('.slide.active').removeClass('active');
    },
    onSlideIn: function ($slide) {
      $slide.addClass('active');
    }
  },
  mounted: function()  {
    // Update page title with names and slogan
    if (this.$t) {
      const names = this.$t('start.names');
      const slogan = this.$t('start.slogan');
      document.title = `${names}. ${slogan}`;
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('body').scrollspy({ target: '.navbar', offset: $(window).height()/2 });
    $('.navbar').on('activate.bs.scrollspy', () => {
      this.onSlideOut();
      this.onSlideIn($($('.navbar .nav .active a').attr('href')));
    });

    let sparkle = new Sparkle();
    sparkle.init('.highlight');

    // Ensure first slide is visible/active on initial load
    const initialHash = window.location.hash || '#start';
    this.activateSlideById(initialHash);
    this.ensureActiveSlide();

    // Activate slides as they come into view (so images/text reveal on scroll)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.onSlideOut();
          this.onSlideIn($(entry.target));
          if (id) {
            $('.navbar .nav li').removeClass('active');
            $(`.navbar .nav a[href="#${id}"]`).parent().addClass('active');
            window.location.hash = `#${id}`;
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    });

    $('.slide').each((_, el) => observer.observe(el));

    // Hash navigation (direct link or back/forward)
    window.addEventListener('hashchange', () => {
      this.activateSlideById(window.location.hash || '#start');
      this.ensureActiveSlide();
    });

    // Fallback: on scroll, activate the nearest slide to the viewport middle
    const activateClosest = () => {
      const scrollPos = $(window).scrollTop();
      const mid = scrollPos + ($(window).height() * 0.5);
      let closestId = null;
      let closestDist = Infinity;
      $('.slide').each((_, el) => {
        const $el = $(el);
        const top = $el.offset().top;
        const dist = Math.abs(mid - top);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = $el.attr('id');
        }
      });
      if (closestId) {
        this.activateSlideById(`#${closestId}`);
      }
    };

    $(window).on('scroll', () => {
      window.requestAnimationFrame(activateClosest);
    });

    // Ensure active state after initial layout
    setTimeout(() => this.ensureActiveSlide(), 50);
  }
});
