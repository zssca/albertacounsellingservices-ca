// Service Worker for Alberta Counselling Services
// Version: 1.0.0

const CACHE_NAME = 'albertacounsellingservices.ca-v1';
const RUNTIME_CACHE = 'albertacounsellingservices.ca-runtime-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
];

// Cache strategies
const CACHE_STRATEGIES = {
  networkFirst: [
    /^\/api\//,
    /^\/services/,
    /^\/contact/,
  ],
  cacheFirst: [
    /\.(?:js|css|woff2?)$/,
    /^\/assets\//,
    /^\/images\//,
  ],
  staleWhileRevalidate: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  ],
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // Determine cache strategy
  const strategy = getStrategy(url.pathname);
  
  event.respondWith(
    strategy(request).catch(() => {
      // Fallback to offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});

// Cache strategies implementation
function getStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(pathname))) {
      switch (strategy) {
        case 'networkFirst':
          return networkFirst;
        case 'cacheFirst':
          return cacheFirst;
        case 'staleWhileRevalidate':
          return staleWhileRevalidate;
      }
    }
  }
  return networkFirst; // Default strategy
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cachedResponse || fetchPromise;
}

// Message event - handle cache operations
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
      );
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(
        caches.open(RUNTIME_CACHE).then((cache) => {
          return cache.addAll(payload.urls);
        })
      );
      break;
  }
});