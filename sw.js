const CACHE='cuadra-balisa-v6';

self.addEventListener('install', e => {
  // No precaching - just activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always go to network for Firebase and HTML
  const url = e.request.url;
  if (url.includes('firestore') || url.includes('firebase') || 
      url.includes('googleapis') || url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(fetch(e.request).catch(() => new Response('Sin conexión')));
    return;
  }
  // Network first for everything else
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
