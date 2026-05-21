// Resilience Guardian - Service Worker v3
const CACHE_NAME = 'resilience-guardian-v3';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // Network only for APIs
  if (url.includes('/api/') || url.includes('googleapis.com') ||
      url.includes('open-meteo.com') || url.includes('tfhub.dev') ||
      url.includes('translate.googleapis')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        url.includes('/api/') ?
          new Response(JSON.stringify({error:'offline'}), {headers:{'Content-Type':'application/json'}}) :
          new Response('')
      )
    );
    return;
  }
  // Cache first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res && res.status === 200 && event.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
