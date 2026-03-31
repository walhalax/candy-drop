// Service Worker for Candy-Drops PWA
const CACHE_VERSION = 'v1';
const CACHE_NAME = `candydrop-${CACHE_VERSION}`;

// Assets to cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './bgm_samples/smile.mp3',
  './bgm_samples/goo_lee.mp3',
  './bgm_samples/light_it_up.mp3',
  './bgm_samples/smile.wav',
  './bgm_samples/goo_lee.wav',
  './bgm_samples/light_it_up.wav'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Activate immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('candydrop-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response (can only be consumed once)
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin requests or specific external resources
                const url = new URL(event.request.url);
                if (url.origin === location.origin ||
                    url.href.startsWith('https://fonts.googleapis.com') ||
                    url.href.startsWith('https://fonts.gstatic.com')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          })
          .catch(() => {
            // Network failed and not in cache
            // For navigation requests, return the cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});
