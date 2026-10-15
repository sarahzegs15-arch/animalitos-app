/* Service worker: deja la app funcionando sin internet.
   Si cambias cualquier archivo, sube el número de VERSION. */
var VERSION = 'animalitos-v1';
var FILES = [
  './', './index.html', './style.css', './app.js', './manifest.json',
  './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png',
  './images/unicornio.png', './images/unicornio_sucio.png',
  './images/gatito.png', './images/gatito_sucio.png',
  './images/perrito.png', './images/perrito_sucio.png',
  './images/pollito.png', './images/pollito_sucio.png',
  './images/leon.png', './images/leon_sucio.png',
  './images/elefante.png', './images/elefante_sucio.png'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(VERSION).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return caches.match('./index.html'); });
  }));
});
