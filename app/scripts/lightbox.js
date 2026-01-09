// Lightbox gallery module
const Lightbox = {
  open: function(vueInstance, index) {
    if (index < 0 || index >= vueInstance.gallery.length) {
      console.error('Invalid image index:', index);
      return;
    }
    
    vueInstance.$set(vueInstance, 'lightboxImageIndex', index);
    vueInstance.$set(vueInstance, 'lightboxOpen', true);
    document.body.style.overflow = 'hidden';
  },
  
  close: function(vueInstance) {
    vueInstance.lightboxOpen = false;
    document.body.style.overflow = '';
  },
  
  next: function(vueInstance) {
    if (vueInstance.lightboxImageIndex < vueInstance.gallery.length - 1) {
      vueInstance.lightboxImageIndex++;
    } else {
      vueInstance.lightboxImageIndex = 0;
    }
  },
  
  prev: function(vueInstance) {
    if (vueInstance.lightboxImageIndex > 0) {
      vueInstance.lightboxImageIndex--;
    } else {
      vueInstance.lightboxImageIndex = vueInstance.gallery.length - 1;
    }
  },
  
  onImageLoad: function(event) {
    const img = event.target;
    img.style.display = 'block';
    img.style.visibility = 'visible';
    img.style.opacity = '1';
    img.style.position = 'relative';
    img.style.zIndex = '10001';
    img.style.maxWidth = '85vw';
    img.style.maxHeight = '85vh';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.margin = 'auto';
    img.style.background = 'rgba(255, 255, 255, 0.1)';
    img.style.border = '2px solid rgba(255, 255, 255, 0.2)';
  },
  
  initKeyboard: function(vueInstance) {
    document.addEventListener('keydown', function(e) {
      if (vueInstance.lightboxOpen) {
        if (e.key === 'Escape') {
          Lightbox.close(vueInstance);
        } else if (e.key === 'ArrowLeft') {
          Lightbox.prev(vueInstance);
        } else if (e.key === 'ArrowRight') {
          Lightbox.next(vueInstance);
        }
      }
    });
  }
};
