const STATIC_CACHE = 'adtok-static-v1';
const DOCS_CACHE = 'adtok-docs-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/main.js',
  './src/tabs.js',
  './src/charts.js',
  './src/styles/main.css',
  './assets/images/adtok-logo-3d.png',
  './assets/images/adtok-logo-mobile.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/audio/tiktok-algorithm-secrets.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(new Request(asset, { cache: 'reload' })))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DOCS_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== self.location.origin) {
    return;
  }

  if (event.request.destination === 'document') {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (
    ['style', 'script', 'image', 'font', 'audio', 'manifest'].includes(event.request.destination) ||
    STATIC_ASSETS.some((asset) => requestURL.pathname.endsWith(asset.replace('./', '/')))
  ) {
    event.respondWith(cacheFirst(event.request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(DOCS_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }
    return caches.match('./index.html');
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
