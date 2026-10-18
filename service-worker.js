const CACHE_NAME = 'pricing-calculate-system-v1';
const APP_SHELL = [
  './index.html',
  './freelan_pricing_calculator.css',
  './freelan_pricing_calculator.js',
  './pricing_calculator_logo.svg',
  './manifest.webmanifest',
  './icons/pricing-calculator-192.png',
  './icons/pricing-calculator-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
