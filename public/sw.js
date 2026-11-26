const STATIC_CACHE = 'kitzero-static-v2';
const PAGE_CACHE = 'kitzero-pages-v2';
const VALID_CACHES = [STATIC_CACHE, PAGE_CACHE];

const CORE_ASSETS = [
  '/',
  '/en/',
  '/favicon.svg',
  '/favicon.ico',
  '/site.webmanifest',
  '/pdf.worker.min.mjs',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !VALID_CACHES.includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Immutable Vite/Astro chunks & PDF worker: Cache-first for instant offline tool execution
  if (url.pathname.startsWith('/_astro/') || url.pathname === '/pdf.worker.min.mjs') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // HTML navigations & other assets: Network-first with offline cache fallback
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          const targetCache = event.request.mode === 'navigate' ? PAGE_CACHE : STATIC_CACHE;
          caches.open(targetCache).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match(url.pathname.startsWith('/en') ? '/en/' : '/');
          }
          return undefined;
        })
      )
  );
});
