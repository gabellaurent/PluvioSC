const CACHE_NAME = 'pluviosc-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deletando cache antigo do PWA:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first strategy para HTML, APIs, snapshots e novos bundles JS/CSS
  if (
    event.request.mode === 'navigate' ||
    event.request.url.includes('api.open-meteo.com') ||
    event.request.url.includes('flood-api.open-meteo.com') ||
    event.request.url.includes('snapshots') ||
    event.request.url.includes('.json') ||
    event.request.url.includes('.js') ||
    event.request.url.includes('.css')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Guarda cópia atualizada
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache first para imagens e fontes estáticas
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
