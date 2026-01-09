// Service Worker for Wedding Website
const CACHE_NAME = 'wedding-site-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/scripts/config.js',
  '/scripts/utils.js',
  '/scripts/countdown.js',
  '/scripts/music.js',
  '/scripts/lightbox.js',
  '/scripts/rsvp.js',
  '/scripts/messages.js',
  '/scripts/lazy-loading.js',
  '/scripts/navigation.js',
  '/scripts/sparkle.js',
  '/scripts/images-list.js',
  '/images/cloud.png',
  '/images/footer.png',
  '/images/miguel-miriam.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'image') {
          return new Response('<svg role="img" aria-label="Image placeholder"></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
      })
  );
});
