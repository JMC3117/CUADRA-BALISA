const CACHE='cuadra-balisa-v5';
const STATIC=['./fotos/noche.jpg','./fotos/nicole.jpg','./fotos/nespresso.jpg','./fotos/fina.jpg','./fotos/marisa.jpg','./fotos/ronbay.jpg','./fotos/albana.jpg','./fotos/victoria.jpg','./fotos/suki.jpg','./fotos/logo.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  // Always fetch index.html and Firebase calls fresh from network
  const url=e.request.url;
  if(url.includes('firestore') || url.includes('firebase') || url.endsWith('index.html') || url.endsWith('/')){
    e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));
    return;
  }
  // Static assets: cache first
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
});
