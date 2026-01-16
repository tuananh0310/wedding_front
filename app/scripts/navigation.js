// Navigation and slide management module
const Navigation = {
  ensureActiveSlide: function (vueInstance) {
    if ($('.slide.active').length) return;

    const hash = window.location.hash;
    if (hash && $(hash).length) {
      this.activateSlideById(vueInstance, hash);
      return;
    }

    const $first = $('.slide').first();
    if ($first.length) {
      this.activateSlideById(vueInstance, `#${$first.attr('id')}`);
    }
  },

  activateSlideById: function (vueInstance, hash) {
    if (!hash) return;

    // Sanitize hash: remove invalid characters like / from URL
    // e.g., "#/start" becomes "#start"
    hash = hash.replace(/^#\/?/, '#');

    const $slide = $(hash);
    if ($slide.length) {
      this.onSlideOut();
      this.onSlideIn($slide);
      $('.navbar .nav li').removeClass('active');
      $(`.navbar .nav a[href="${hash}"]`).parent().addClass('active');
    }
  },

  onSlideOut: function () {
    $('.slide.active').removeClass('active');
  },

  onSlideIn: function ($slide) {
    $slide.addClass('active');
  },

  scroll: function (vueInstance, event) {
    event.preventDefault();
    $(':focus').blur();

    const hash = $(event.currentTarget).attr('href');
    const $target = $(hash);
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      $target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        this.activateSlideById(vueInstance, hash);
      }, 300);
    } else {
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, 1000, () => {
        this.activateSlideById(vueInstance, hash);
      });
    }
  },

  initScrollSpy: function (vueInstance) {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      $('body').scrollspy({
        target: '.navbar',
        offset: $(window).height() / 2
      });
      $('.navbar').on('activate.bs.scrollspy', () => {
        this.onSlideOut();
        this.onSlideIn($($('.navbar .nav .active a').attr('href')));
      });
    }
  },

  initIntersectionObserver: function (vueInstance) {
    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.onSlideOut();
          this.onSlideIn($(entry.target));
          if (id) {
            $('.navbar .nav li').removeClass('active');
            $(`.navbar .nav a[href="#${id}"]`).parent().addClass('active');
            if (!isMobile) {
              if (window.history && window.history.replaceState) {
                window.history.replaceState(null, null, `#${id}`);
              } else {
                window.location.hash = `#${id}`;
              }
            }
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    });

    $('.slide').each((_, el) => observer.observe(el));
  },

  initHashNavigation: function (vueInstance) {
    const isMobile = window.innerWidth <= 768;

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash || '#start';
      if (isMobile) {
        this.activateSlideById(vueInstance, hash);
      } else {
        this.activateSlideById(vueInstance, hash);
        this.ensureActiveSlide(vueInstance);
      }
    });
  },

  initScrollActivation: function (vueInstance) {
    const isMobile = window.innerWidth <= 768;
    let scrollTimeout;

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
        this.activateSlideById(vueInstance, `#${closestId}`);
      }
    };

    const scrollThrottle = isMobile ? 150 : 0;
    $(window).on('scroll', () => {
      if (scrollThrottle > 0) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          window.requestAnimationFrame(activateClosest);
        }, scrollThrottle);
      } else {
        window.requestAnimationFrame(activateClosest);
      }
    });
  }
};
