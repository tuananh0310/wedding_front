// Utility functions
const Utils = {
  showToast: function(vueInstance, text, type) {
    vueInstance.$set(vueInstance.toastMessage, 'show', true);
    vueInstance.$set(vueInstance.toastMessage, 'text', text);
    vueInstance.$set(vueInstance.toastMessage, 'type', type || 'success');
    
    setTimeout(() => {
      vueInstance.$set(vueInstance.toastMessage, 'show', false);
    }, 4000);
  },
  
  preloadImages: function(gallery, config) {
    const totalImages = gallery.length;
    const batch1Size = config.images.preloadBatch1 || 8;
    const batch2Size = config.images.preloadBatch2 || 8;
    
    // Batch 1: Preload với priority cao
    const batch1 = gallery.slice(0, batch1Size);
    const preloadPromises1 = batch1.map((imgSrc) => {
      return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imgSrc;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
        
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = imgSrc;
      });
    });
    
    // Batch 2: Preload sau batch 1
    const batch2 = gallery.slice(batch1Size, batch1Size + batch2Size);
    Promise.all(preloadPromises1).then(() => {
      const preloadPromises2 = batch2.map((imgSrc) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = imgSrc;
        });
      });
      
      // Batch 3: Preload ảnh còn lại
      const batch3 = gallery.slice(batch1Size + batch2Size);
      Promise.all(preloadPromises2).then(() => {
        if (batch3.length > 0) {
          batch3.forEach((imgSrc) => {
            const img = new Image();
            img.src = imgSrc;
          });
        }
      });
    });
    
    // Prefetch ảnh còn lại với priority thấp
    if (totalImages > batch1Size + batch2Size) {
      const imagesToPrefetch = gallery.slice(batch1Size + batch2Size);
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
  
  handleImageError: function(event) {
    console.warn('Image failed to load:', event.target.src);
    const img = event.target;
    const currentSrc = img.src;
    
    // Thử load lại với đường dẫn đầy đủ
    if (currentSrc && !currentSrc.startsWith('http') && 
        !currentSrc.startsWith('/') && 
        !currentSrc.startsWith(window.location.origin)) {
      img.src = '/' + currentSrc.replace(/^\//, '');
    } else {
      // Nếu vẫn lỗi, thêm class error để có thể style
      img.classList.add('error');
      img.alt = 'Không thể tải ảnh';
    }
  }
};
