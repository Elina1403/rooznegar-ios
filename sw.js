const CACHE = 'rooznegar-2aa36663098bdf79';
const ASSETS = ["./Rooznegar-Widget.js?v=f011c49aca1d7dae","./app.7032999abfb0c084.css","./app.a921181d436cfdd3.js","./fonts/Vazirmatn-Bold.ttf","./fonts/Vazirmatn-Regular.ttf","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./index.html","./licenses/Jalaali-MIT.txt","./licenses/Vazirmatn-OFL.txt","./licenses/data-sources.txt","./manifest.webmanifest"];
const appRoot = new URL('./', self.location.href);
const primary = new URL('index.html', appRoot).href;
const files = new Set(ASSETS.map(asset => new URL(asset, appRoot).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache =>
    cache.addAll([...files].map(url => new Request(url, {cache:'reload'}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(key => key.startsWith('rooznegar-') && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== appRoot.origin || !url.pathname.startsWith(appRoot.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(new Request(event.request, {cache:'no-cache'}))
      .catch(() => caches.open(CACHE).then(cache => cache.match(primary))));
  } else if (files.has(url.href)) {
    event.respondWith(caches.open(CACHE).then(cache =>
      cache.match(event.request).then(cached => cached || fetch(event.request))));
  }
});
