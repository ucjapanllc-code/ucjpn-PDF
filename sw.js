const CACHE_NAME = 'pdf-merger-v1';
const PRECACHE_URLS = [
  './', './index.html', './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => {
    return cached || fetch(e.request).then(response => {
      if (response.status === 200) { const clone = response.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, clone)); }
      return response;
    });
  }).catch(() => caches.match('./index.html')));
});
