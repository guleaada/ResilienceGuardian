// Resilience Guardian — Service Worker v4
// Network-first for HTML, cache-first for assets
// Auto-updates when new version deployed

const CACHE_VERSION = 'rg-v4';
const CACHE_NAME = `resilience-guardian-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

// ── INSTALL: cache static assets only ────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.log('[SW] Cache addAll error (non-fatal):', err))
  );
  // Take control immediately — don't wait for old SW to die
  self.skipWaiting();
});

// ── ACTIVATE: delete ALL old caches ──────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating, clearing old caches...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      // Take control of all open clients immediately
      return self.clients.claim();
    }).then(() => {
      // Tell all clients to reload to get fresh content
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
        });
      });
    })
  );
});

// ── FETCH: smart caching strategy ────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. API calls — always network, never cache
  if (url.pathname.startsWith('/api/') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('tfhub.dev') ||
      url.hostname.includes('jsdelivr.net') ||
      url.hostname.includes('fonts.g')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        url.pathname.startsWith('/api/')
          ? new Response(JSON.stringify({ error: 'offline' }), {
              headers: { 'Content-Type': 'application/json' }
            })
          : new Response('')
      )
    );
    return;
  }

  // 2. HTML pages — NETWORK FIRST (always get latest)
  if (event.request.mode === 'navigate' ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the fresh HTML
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback to cached HTML
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 3. Static assets (icons, fonts) — cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
