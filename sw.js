const CACHE_NAME = 'hosomattich-v1';
const assetsToCache = [
  './index.html',
  './style.css',
  './game.js',
  './manifest.json'
];

// Cài đặt và cache các tài nguyên tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Phục vụ tài nguyên từ cache khi ngoại tuyến
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});