/* global Vue, VueI18n, $, Sparkle, APP_I18N */

let app = new Vue({
  el: '.js-app',
  i18n: (window.APP_I18N || undefined),
  data: {
    years: (new Date()).getFullYear() - 2005,
    gallery: (window.APP_IMAGES || []),
    currentLocale: (window.APP_I18N && window.APP_I18N.locale) || 'vi',
    // Thay đổi ngày này thành ngày cưới thực tế của bạn
    // Hiện tại: 29/01/2026 lúc 10:00 (theo giờ trình duyệt)
    weddingDate: new Date('2026-01-29T10:00:00'),
    countdown: {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    rsvpName: '',
    rsvpAttending: 'yes',
    rsvpMessage: '',
    rsvpSubmitted: false,
    // Nhạc nền chill
    isMusicPlaying: false,
    musicAudio: null,
    musicLoadFailed: false
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
    },
    updateCountdown: function () {
      if (!this.weddingDate) {
        return;
      }

      const now = new Date();
      let diff = this.weddingDate.getTime() - now.getTime();
      if (diff < 0) {
        diff = 0;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      this.countdown = {
        totalMs: diff,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    },
    submitRSVP: function () {
      if (!this.rsvpName) {
        // Nhắc nhập tên đơn giản, không gây khó chịu
        alert(this.$t ? this.$t('rsvp.nameRequired') : 'Vui lòng nhập tên');
        return;
      }

      // Chuẩn bị nội dung email gửi về địa chỉ của bạn
      const to = 'anhlxt2@fpt.com';
      const subject = this.$t ? this.$t('rsvp.title') : 'RSVP Wedding';

      const attendingText = (function () {
        if (this.$t) {
          return this.rsvpAttending === 'yes'
            ? this.$t('rsvp.attendingYes')
            : this.$t('rsvp.attendingNo');
        }
        return this.rsvpAttending === 'yes' ? 'Yes' : 'No';
      }.call(this));

      const bodyLines = [
        `Tên: ${this.rsvpName}`,
        `Tham dự: ${attendingText}`,
        `Lời nhắn: ${this.rsvpMessage || '(trống)'}`
      ];

      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      // Mở ứng dụng email của khách để họ gửi mail
      window.location.href = mailto;

      this.rsvpSubmitted = true;
    },
    changeLocale: function (locale) {
      if (!this.$i18n) return;
      this.$i18n.locale = locale;
      this.currentLocale = locale;

      // Cập nhật lại title trang cho phù hợp ngôn ngữ mới
      const names = this.$t('start.names');
      const slogan = this.$t('start.slogan');
      document.title = `${names}. ${slogan}`;
    },
    openMap: function () {
      // Thay link này thành link Google Maps đến địa điểm cưới của bạn
      const url = 'https://maps.google.com?q=Your+Wedding+Location';
      window.open(url, '_blank');
    },
    initMusic: function () {
      // Khởi tạo audio nếu chưa có
      if (!this.musicAudio && !this.musicLoadFailed) {
        // File nhạc chill của bạn (sau khi build sẽ nằm trong thư mục dist/music)
        // Dùng đường dẫn tương đối để chạy tốt cả local và khi deploy (ví dụ GitHub Pages)
        const musicPath = 'music/Em Đồng Ý (I Do).mp3';
        this.musicAudio = new Audio(musicPath);
        this.musicAudio.loop = true;
        this.musicAudio.volume = 0.4;

        // Xử lý lỗi khi file nhạc không tồn tại (im lặng, không log)
        this.musicAudio.addEventListener('error', (e) => {
          // Đánh dấu là đã thử load và thất bại
          this.musicLoadFailed = true;
          this.musicAudio = null;
          this.isMusicPlaying = false;
          // Không hiển thị warning để tránh làm phiền người dùng
        });
      }
    },
    playMusic: function () {
      // Khởi tạo audio nếu chưa có
      this.initMusic();

      // Nếu đã thử load và thất bại, không làm gì
      if (this.musicLoadFailed || !this.musicAudio) {
        return;
      }

      // Phát nhạc
      this.musicAudio.play().then(() => {
        this.isMusicPlaying = true;
      }).catch((error) => {
        // Nếu bị chặn hoặc lỗi, đánh dấu là failed và không làm gì thêm
        // (Trình duyệt có thể chặn autoplay nếu chưa có user interaction)
        this.musicLoadFailed = true;
        this.musicAudio = null;
        this.isMusicPlaying = false;
      });
    },
    toggleMusic: function () {
      // Khởi tạo audio nếu chưa có
      this.initMusic();

      // Nếu đã thử load và thất bại, không làm gì
      if (this.musicLoadFailed || !this.musicAudio) {
        return;
      }

      if (this.isMusicPlaying) {
        this.musicAudio.pause();
        this.isMusicPlaying = false;
      } else {
        // Trình duyệt chỉ cho play sau khi có thao tác người dùng – ở đây là nút bấm
        this.musicAudio.play().then(() => {
          this.isMusicPlaying = true;
        }).catch((error) => {
          // Nếu bị chặn hoặc lỗi, đánh dấu là failed và không làm gì thêm
          this.musicLoadFailed = true;
          this.musicAudio = null;
          this.isMusicPlaying = false;
        });
      }
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

    // Bật đếm ngược
    this.updateCountdown();
    this._countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);

    // Tự động phát nhạc khi trang được load
    // Lưu ý: Trình duyệt có thể chặn autoplay nếu chưa có user interaction
    // Nhưng sẽ thử phát sau một khoảng thời gian ngắn
    setTimeout(() => {
      this.playMusic();
    }, 500);
  },
  beforeDestroy: function () {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
    }
  }
});
