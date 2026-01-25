// Service Worker for Biblical Alignment
// Provides offline caching for Bible content

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const BIBLE_CACHE = `bible-${CACHE_VERSION}`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// Bible books and chapters for pre-caching (optional)
const BIBLE_ROUTES = [
  '/read',
  '/search',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old version caches
            return (
              name.startsWith('static-') ||
              name.startsWith('dynamic-') ||
              name.startsWith('bible-')
            ) && !name.includes(CACHE_VERSION);
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Handle different types of requests
  if (isStaticAsset(url)) {
    // Static assets: Cache first, fallback to network
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isBibleContent(url)) {
    // Bible content: Stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request, BIBLE_CACHE));
  } else if (isSearchIndex(url)) {
    // Search index: Cache first (large file, rarely changes)
    event.respondWith(cacheFirst(request, BIBLE_CACHE));
  } else if (isPageRequest(request)) {
    // HTML pages: Network first, cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Other requests: Network first, cache fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Message event - handle cache commands from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_ALL_CONTENT') {
    cacheAllBibleContent();
  } else if (event.data.type === 'CACHE_CHAPTER') {
    const { book, chapter } = event.data;
    cacheChapter(book, chapter);
  } else if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper functions

function isStaticAsset(url) {
  const staticExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.css', '.js'];
  return (
    staticExtensions.some((ext) => url.pathname.endsWith(ext)) ||
    url.pathname === '/manifest.webmanifest'
  );
}

function isBibleContent(url) {
  // Match /read/[book]/[chapter] patterns
  return url.pathname.startsWith('/read/') && url.pathname.split('/').length >= 4;
}

function isSearchIndex(url) {
  return url.pathname.includes('search-index.json');
}

function isPageRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Caching strategies

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (isPageRequest(request)) {
      const offlinePage = await cache.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response('Offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Start network request in background
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Network fetch failed, using cache:', error);
      return null;
    });

  // Return cached response immediately if available, otherwise wait for network
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response('Offline', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

// Pre-cache functions

async function cacheAllBibleContent() {
  console.log('[SW] Starting to cache all Bible content');
  const cache = await caches.open(BIBLE_CACHE);

  // Cache the search index
  try {
    const searchIndexResponse = await fetch('/search-index.json');
    if (searchIndexResponse.ok) {
      await cache.put('/search-index.json', searchIndexResponse);
      console.log('[SW] Cached search index');
    }
  } catch (error) {
    console.error('[SW] Failed to cache search index:', error);
  }

  // Notify clients that caching is complete
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'CACHE_COMPLETE',
      success: true,
    });
  });
}

async function cacheChapter(book, chapter) {
  const cache = await caches.open(BIBLE_CACHE);
  const url = `/read/${book}/${chapter}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      console.log(`[SW] Cached ${url}`);
    }
  } catch (error) {
    console.error(`[SW] Failed to cache ${url}:`, error);
  }
}
