// Configuration file for API endpoints and app settings
window.APP_CONFIG = {
  api: {
    baseUrl: 'https://learning4.uk/api',
    endpoints: {
      rsvp: '/wedding-rsvps',
      messages: '/wedding-rsvps'
    }
  },
  wedding: {
    date: '2026-01-29T10:00:00',
    location: 'NHÀ VĂN HOÁ XÓM 8, WCQH+5VR, Unnamed, Road, Yên Thành, Nghệ An, Việt Nam',
    mapUrl: 'https://maps.google.com?q=NHÀ VĂN HOÁ XÓM 8, WCQH+5VR, Unnamed, Road, Yên Thành, Nghệ An, Việt Nam'
  },
  music: {
    path: 'music/Em Đồng Ý (I Do).mp3',
    volume: 0.4,
    autoplayDelay: 1000
  },
  messages: {
    refreshInterval: 30000 // 30 seconds
  },
  images: {
    preloadBatch1: 8,
    preloadBatch2: 8,
    lazyLoadRootMargin: '300px',
    lazyLoadBatchSize: 5
  }
};
