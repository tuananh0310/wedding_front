// Lazy loading images module
const LazyLoading = {
  init: function(vueInstance, config) {
    if (!('IntersectionObserver' in window)) {
      this.fallback(vueInstance);
      return;
    }
    
    if (!vueInstance._imageObserver) {
      vueInstance._imageLoadQueue = [];
      vueInstance._isProcessingQueue = false;
      
      const processImageQueue = () => {
        if (vueInstance._isProcessingQueue || vueInstance._imageLoadQueue.length === 0) {
          return;
        }
        
        vueInstance._isProcessingQueue = true;
        const batch = vueInstance._imageLoadQueue.splice(0, 5);
        
        const loadPromises = batch.map(({ img, dataSrc }) => {
          return new Promise((resolve) => {
            const imageLoader = new Image();
            imageLoader.onload = () => {
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
              img.alt = 'Không thể tải ảnh';
              console.warn('Failed to load image:', dataSrc);
              resolve();
            };
            imageLoader.src = dataSrc;
          });
        });
        
        Promise.all(loadPromises).then(() => {
          vueInstance._isProcessingQueue = false;
          if (vueInstance._imageLoadQueue.length > 0) {
            requestAnimationFrame(processImageQueue);
          }
        });
      };
      
      vueInstance._imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc && !img.classList.contains('loading')) {
              img.classList.add('loading');
              vueInstance._imageLoadQueue.push({ img, dataSrc });
              observer.unobserve(img);
              requestAnimationFrame(processImageQueue);
            }
          }
        });
      }, {
        rootMargin: config.images.lazyLoadRootMargin || '300px',
        threshold: 0.01
      });
    }
    
    this.observeImages(vueInstance);
    this.setupScrollPrefetch(vueInstance);
  },
  
  observeImages: function(vueInstance) {
    const observe = () => {
      vueInstance.$nextTick(() => {
        document.querySelectorAll('.lazy-image:not(.observed)').forEach(img => {
          img.classList.add('observed');
          vueInstance._imageObserver.observe(img);
        });
      });
    };
    
    observe();
    
    let watchTimeout;
    vueInstance.$watch('gallery', () => {
      clearTimeout(watchTimeout);
      watchTimeout = setTimeout(observe, 100);
    });
  },
  
  setupScrollPrefetch: function(vueInstance) {
    let scrollTimeout;
    
    $(window).on('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.observeImages(vueInstance);
        
        const windowHeight = $(window).height();
        
        document.querySelectorAll('.lazy-image:not(.prefetched)').forEach(img => {
          const rect = img.getBoundingClientRect();
          const isNearViewport = rect.top < windowHeight + 300 && rect.bottom > -300;
          
          if (isNearViewport) {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.as = 'image';
              prefetchLink.href = dataSrc;
              document.head.appendChild(prefetchLink);
              img.classList.add('prefetched');
            }
          }
        });
      }, 16);
    });
  },
  
  fallback: function(_vueInstance) {
    document.querySelectorAll('.lazy-image').forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.src = dataSrc;
        img.classList.remove('lazy-image');
        img.classList.add('loaded');
      }
    });
  }
};
