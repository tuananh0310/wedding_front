// Load config first
const config = window.APP_CONFIG || {};

let app = new Vue({
  el: '.js-app',
  data: {
    years: (new Date()).getFullYear() - 2005,
    gallery: (window.APP_IMAGES || []),
    weddingDate: new Date(config.wedding?.date || '2026-01-29T10:00:00'),
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
    toastMessage: {
      show: false,
      text: '',
      type: 'success'
    },
    isMusicPlaying: false,
    musicAudio: null,
    musicLoadFailed: false,
    groomQRCode: 'images/qr/IMG_9575.jpg',
    brideQRCode: 'images/qr/IMG_9576.jpg',
    lightboxOpen: false,
    lightboxImageIndex: 0,
    weddingMessages: [],
    messageCount: 0
  },
  methods: {
    ensureActiveSlide: function() {
      Navigation.ensureActiveSlide(this);
    },
    activateSlideById: function(hash) {
      Navigation.activateSlideById(this, hash);
    },
    scroll: function(event) {
      Navigation.scroll(this, event);
    },
    updateCountdown: function() {
      Countdown.update(this);
    },
    showToast: function(text, type) {
      Utils.showToast(this, text, type);
    },
    submitRSVP: function() {
      RSVP.submit(this, config, Utils);
    },
    openMap: function() {
      RSVP.openMap(config);
    },
    initMusic: function() {
      MusicPlayer.init(this, config);
    },
    playMusic: function() {
      MusicPlayer.play(this, config);
    },
    toggleMusic: function() {
      MusicPlayer.toggle(this, config);
    },
    preloadImages: function() {
      Utils.preloadImages(this.gallery, config);
    },
    openLightbox: function(index, event) {
      Lightbox.open(this, index);
    },
    closeLightbox: function() {
      Lightbox.close(this);
    },
    onLightboxImageLoad: function(event) {
      Lightbox.onImageLoad(event);
    },
    handleImageError: function(event) {
      Utils.handleImageError(event);
    },
    fetchWeddingMessages: function() {
      Messages.fetch(this, config);
    },
    lightboxNextImage: function() {
      Lightbox.next(this);
    },
    lightboxPrevImage: function() {
      Lightbox.prev(this);
    },
    initLazyLoading: function() {
      LazyLoading.init(this, config);
    }
  },
  mounted: function() {
    document.title = 'Tuấn Anh  Thu Phương. ';
    
    $('[data-toggle="tooltip"]').tooltip();
    
    Navigation.initScrollSpy(this);
    
    const sparkle = new Sparkle();
    sparkle.init('.highlight');
    
    const initialHash = window.location.hash || '#start';
    Navigation.activateSlideById(this, initialHash);
    Navigation.ensureActiveSlide(this);
    
    Navigation.initIntersectionObserver(this);
    Navigation.initHashNavigation(this);
    Navigation.initScrollActivation(this);
    
    setTimeout(() => Navigation.ensureActiveSlide(this), 50);
    
    Countdown.start(this);
    
    MusicPlayer.init(this, config);
    setTimeout(() => {
      MusicPlayer.play(this, config);
    }, config.music?.autoplayDelay || 1000);
    
    Utils.preloadImages(this.gallery, config);
    LazyLoading.init(this, config);
    
    Messages.startAutoRefresh(this, config);
    
    Lightbox.initKeyboard(this);
  },
  beforeDestroy: function() {
    Countdown.stop(this);
    MusicPlayer.cleanup(this);
    Messages.stopAutoRefresh(this);
  }
});
