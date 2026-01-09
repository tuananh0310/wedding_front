// Music player module
const MusicPlayer = {
  init: function(vueInstance, config) {
    if (vueInstance.musicAudio || vueInstance.musicLoadFailed) {
      return;
    }
    
    const musicPath = config.music.path;
    vueInstance.musicAudio = new Audio(musicPath);
    vueInstance.musicAudio.loop = true;
    vueInstance.musicAudio.volume = config.music.volume || 0.4;
    vueInstance.musicAudio.preload = 'auto';
    
    vueInstance.musicAudio.addEventListener('play', () => {
      vueInstance.isMusicPlaying = true;
    });
    
    vueInstance.musicAudio.addEventListener('pause', () => {
      vueInstance.isMusicPlaying = false;
    });
    
    vueInstance.musicAudio.addEventListener('ended', () => {
      vueInstance.isMusicPlaying = false;
    });
    
    vueInstance.musicAudio.addEventListener('error', (e) => {
      console.warn('Music file failed to load:', e);
      vueInstance.musicLoadFailed = true;
      vueInstance.musicAudio = null;
      vueInstance.isMusicPlaying = false;
      // Silently fail - không làm gián đoạn trải nghiệm
    });
    
    vueInstance.musicAudio.load();
  },
  
  play: function(vueInstance, config) {
    this.init(vueInstance, config);
    
    if (vueInstance.musicLoadFailed || !vueInstance.musicAudio) {
      return;
    }
    
    if (vueInstance.musicAudio.readyState >= 2) {
      vueInstance.musicAudio.play().then(() => {
        vueInstance.isMusicPlaying = true;
      }).catch((error) => {
        console.log('Autoplay blocked:', error);
      });
    } else {
      const playWhenReady = () => {
        if (vueInstance.musicAudio.readyState >= 2) {
          vueInstance.musicAudio.play().then(() => {
            vueInstance.isMusicPlaying = true;
          }).catch((error) => {
            console.log('Autoplay blocked:', error);
          });
        } else {
          setTimeout(playWhenReady, 100);
        }
      };
      playWhenReady();
    }
  },
  
  toggle: function(vueInstance, config) {
    this.init(vueInstance, config);
    
    if (vueInstance.musicLoadFailed || !vueInstance.musicAudio) {
      return;
    }
    
    if (vueInstance.isMusicPlaying) {
      vueInstance.musicAudio.pause();
      vueInstance.isMusicPlaying = false;
    } else {
      if (vueInstance.musicAudio.readyState >= 2) {
        vueInstance.musicAudio.play().then(() => {
          vueInstance.isMusicPlaying = true;
        }).catch((error) => {
          console.error('Error playing music:', error);
          vueInstance.musicLoadFailed = true;
          vueInstance.musicAudio = null;
          vueInstance.isMusicPlaying = false;
        });
      } else {
        const playWhenReady = () => {
          if (vueInstance.musicAudio && vueInstance.musicAudio.readyState >= 2) {
            vueInstance.musicAudio.play().then(() => {
              vueInstance.isMusicPlaying = true;
            }).catch((error) => {
              console.error('Error playing music:', error);
              vueInstance.musicLoadFailed = true;
              vueInstance.musicAudio = null;
              vueInstance.isMusicPlaying = false;
            });
          } else if (vueInstance.musicAudio) {
            setTimeout(playWhenReady, 100);
          }
        };
        playWhenReady();
      }
    }
  },
  
  cleanup: function(vueInstance) {
    if (vueInstance.musicAudio) {
      vueInstance.musicAudio.pause();
      vueInstance.musicAudio.src = '';
      vueInstance.musicAudio = null;
    }
  }
};
