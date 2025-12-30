/* global Vue, VueI18n, $, Sparkle, APP_I18N */

let app = new Vue({
  el: '.js-app',
  i18n: (window.APP_I18N || undefined),
  data: {
    years: (new Date()).getFullYear() - 2005,
    gallery: (window.APP_IMAGES || []),
    currentLocale: 'vi', // Luôn sử dụng tiếng Việt
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

      // Trên mobile, dùng native scroll thay vì animate để mượt hơn
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Native scroll cho mobile - mượt hơn
        $target[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Delay nhỏ để đảm bảo scroll xong mới activate
        setTimeout(() => {
          this.activateSlideById(hash);
        }, 300);
      } else {
        // Animate cho desktop
        $('html, body').animate({
          scrollTop: $target.offset().top
        }, 1000, () => {
          this.activateSlideById(hash);
        });
      }
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
        const musicPath = 'music/Heart-Of-The-Ocean(chosic.com).mp3';
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
    },
    preloadImages: function() {
      // Tối ưu: Load tất cả ảnh song song để sử dụng tối đa CPU/GPU/RAM
      const totalImages = this.gallery.length;

      // Batch 1: Preload 8 ảnh đầu với priority cao (song song)
      const batch1 = this.gallery.slice(0, 8);
      const preloadPromises1 = batch1.map((imgSrc) => {
        return new Promise((resolve) => {
          // Preload link
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imgSrc;
          link.fetchPriority = 'high';
          document.head.appendChild(link);

          // Load image object song song
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = imgSrc;
        });
      });

      // Batch 2: Preload 8 ảnh tiếp theo (song song, sau batch 1)
      const batch2 = this.gallery.slice(8, 16);
      Promise.all(preloadPromises1).then(() => {
        const preloadPromises2 = batch2.map((imgSrc) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = imgSrc;
          });
        });

        // Batch 3: Preload ảnh còn lại (song song, sau batch 2)
        const batch3 = this.gallery.slice(16);
        Promise.all(preloadPromises2).then(() => {
          if (batch3.length > 0) {
            batch3.forEach((imgSrc) => {
              const img = new Image();
              img.src = imgSrc;
            });
          }
        });
      });

      // Prefetch tất cả ảnh còn lại với priority thấp (background)
      if (totalImages > 16) {
        const imagesToPrefetch = this.gallery.slice(16);
        // Sử dụng requestIdleCallback để prefetch khi CPU rảnh
        const prefetchBatch = (startIndex, batchSize = 5) => {
          const endIndex = Math.min(startIndex + batchSize, imagesToPrefetch.length);
          const batch = imagesToPrefetch.slice(startIndex, endIndex);

          batch.forEach((imgSrc) => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = imgSrc;
            document.head.appendChild(link);
          });

          if (endIndex < imagesToPrefetch.length) {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                prefetchBatch(endIndex, batchSize);
              }, { timeout: 1000 });
            } else {
              setTimeout(() => prefetchBatch(endIndex, batchSize), 200);
            }
          }
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            prefetchBatch(0, 5);
          }, { timeout: 2000 });
        } else {
          setTimeout(() => prefetchBatch(0, 5), 1000);
        }
      }
    },
    initLazyLoading: function() {
      // Sử dụng Intersection Observer để lazy load ảnh với tối ưu tối đa GPU/CPU
      if ('IntersectionObserver' in window) {
        // Tối ưu: chỉ tạo một observer và reuse
        if (!this._imageObserver) {
          // Queue để batch load ảnh (tận dụng CPU/GPU)
          this._imageLoadQueue = [];
          this._isProcessingQueue = false;

          const processImageQueue = () => {
            if (this._isProcessingQueue || this._imageLoadQueue.length === 0) return;

            this._isProcessingQueue = true;
            const batch = this._imageLoadQueue.splice(0, 5); // Load 5 ảnh song song

            const loadPromises = batch.map(({ img, dataSrc }) => {
              return new Promise((resolve) => {
                const imageLoader = new Image();
                imageLoader.onload = () => {
                  // Sử dụng requestAnimationFrame để tận dụng GPU
                  requestAnimationFrame(() => {
                    img.src = dataSrc;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    img.fetchPriority = 'auto';
                    resolve();
                  });
                };
                imageLoader.onerror = () => {
                  img.classList.add('error');
                  resolve();
                };
                imageLoader.src = dataSrc;
              });
            });

            Promise.all(loadPromises).then(() => {
              this._isProcessingQueue = false;
              if (this._imageLoadQueue.length > 0) {
                // Tiếp tục xử lý queue
                requestAnimationFrame(processImageQueue);
              }
            });
          };

          this._imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc && !img.classList.contains('loading')) {
                  img.classList.add('loading');
                  // Thêm vào queue để batch process
                  this._imageLoadQueue.push({ img, dataSrc });
                  observer.unobserve(img);

                  // Trigger queue processing
                  requestAnimationFrame(processImageQueue);
                }
              }
            });
          }, {
            rootMargin: '300px', // Tăng lên để load sớm hơn, tận dụng RAM
            threshold: 0.01
          });
        }

        // Quan sát tất cả ảnh lazy với debounce
        const observeImages = () => {
          this.$nextTick(() => {
            document.querySelectorAll('.lazy-image:not(.observed)').forEach(img => {
              img.classList.add('observed');
              this._imageObserver.observe(img);
            });
          });
        };

        // Quan sát ngay
        observeImages();

        // Quan sát lại khi Vue cập nhật DOM với debounce
        let watchTimeout;
        this.$watch('gallery', () => {
          clearTimeout(watchTimeout);
          watchTimeout = setTimeout(observeImages, 100);
        });

        // Prefetch ảnh khi scroll - load ảnh sắp vào viewport
        let scrollTimeout;
        let lastScrollTop = 0;
        $(window).on('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            observeImages();

            // Prefetch ảnh sắp vào viewport khi scroll
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            lastScrollTop = scrollTop;

            // Tìm các ảnh sắp vào viewport (cách viewport 300px)
            document.querySelectorAll('.lazy-image:not(.prefetched)').forEach(img => {
              const rect = img.getBoundingClientRect();
              const isNearViewport = rect.top < windowHeight + 300 && rect.bottom > -300;

              if (isNearViewport) {
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                  // Prefetch ảnh
                  const prefetchLink = document.createElement('link');
                  prefetchLink.rel = 'prefetch';
                  prefetchLink.as = 'image';
                  prefetchLink.href = dataSrc;
                  document.head.appendChild(prefetchLink);
                  img.classList.add('prefetched');
                }
              }
            });
          }, 16); // ~60fps
        });
      } else {
        // Fallback cho trình duyệt không hỗ trợ Intersection Observer
        document.querySelectorAll('.lazy-image').forEach(img => {
          const dataSrc = img.getAttribute('data-src');
          if (dataSrc) {
            img.src = dataSrc;
            img.classList.remove('lazy-image');
            img.classList.add('loaded');
          }
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

    // Tắt scrollspy trên mobile để tránh tự động jump
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      $('body').scrollspy({ target: '.navbar', offset: $(window).height()/2 });
      $('.navbar').on('activate.bs.scrollspy', () => {
        this.onSlideOut();
        this.onSlideIn($($('.navbar .nav .active a').attr('href')));
      });
    }

    let sparkle = new Sparkle();
    sparkle.init('.highlight');

    // Ensure first slide is visible/active on initial load
    const initialHash = window.location.hash || '#start';
    this.activateSlideById(initialHash);
    this.ensureActiveSlide();

    // Activate slides as they come into view (so images/text reveal on scroll)
    // Trên mobile, không thay đổi hash để tránh tự động jump
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.onSlideOut();
          this.onSlideIn($(entry.target));
          if (id) {
            $('.navbar .nav li').removeClass('active');
            $(`.navbar .nav a[href="#${id}"]`).parent().addClass('active');
            // Chỉ thay đổi hash trên desktop, không thay đổi trên mobile để tránh jump
            if (!isMobile) {
              // Sử dụng history.replaceState thay vì thay đổi hash trực tiếp để tránh scroll
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

    // Hash navigation (direct link or back/forward)
    // Trên mobile, không scroll tự động khi hash thay đổi để tránh jump
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash || '#start';
      if (isMobile) {
        // Chỉ activate slide, không scroll tự động
        this.activateSlideById(hash);
      } else {
        this.activateSlideById(hash);
        this.ensureActiveSlide();
      }
    });

    // Fallback: on scroll, activate the nearest slide to the viewport middle
    // Tối ưu cho mobile: throttle scroll event để tránh lag
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
        this.activateSlideById(`#${closestId}`);
      }
    };

    // Throttle scroll event trên mobile để tối ưu performance
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

    // Preload một số ảnh đầu tiên để cache
    this.preloadImages();

    // Khởi tạo lazy loading cho ảnh
    this.initLazyLoading();
  },
  beforeDestroy: function () {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
    }
  }
});
