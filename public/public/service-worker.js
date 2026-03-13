// Minimal service worker to enable basic PWA installability.
// This is intentionally very light to avoid caching bugs.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches here if you add them in the future
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Let the network handle all requests for now.
});

