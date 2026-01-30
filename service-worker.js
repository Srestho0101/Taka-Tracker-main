const CACHE_NAME = 'taka-tracker-v3.0';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// CDN resources - cache separately
const cdnUrls = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Install event - cache all resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    Promise.all([
      // Cache local files
      caches.open(CACHE_NAME).then(cache => {
        console.log('[Service Worker] Caching app files');
        return cache.addAll(urlsToCache);
      }),
      // Cache CDN resources
      caches.open(CACHE_NAME + '-cdn').then(cache => {
        console.log('[Service Worker] Caching CDN resources');
        return cache.addAll(cdnUrls).catch(err => {
          console.warn('[Service Worker] CDN caching failed (will work online):', err);
        });
      })
    ])
  );
  self.skipWaiting();
});

// Fetch event - Network first, fallback to cache for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If online, update cache and return response
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          const cacheName = event.request.url.includes('unpkg.com') || 
                           event.request.url.includes('cdn.tailwindcss') ? 
                           CACHE_NAME + '-cdn' : CACHE_NAME;
          
          caches.open(cacheName).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If offline, serve from cache
        return caches.match(event.request).then(response => {
          if (response) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return response;
          }
          
          // If not in cache, return offline page or error
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  const cacheWhitelist = [CACHE_NAME, CACHE_NAME + '-cdn'];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
  console.log('[Service Worker] Ready! App works offline now. 🚀');
});

// Message event - for manual cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
