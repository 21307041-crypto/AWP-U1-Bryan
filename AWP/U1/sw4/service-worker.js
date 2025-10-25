/* Service Worker – SW4 (network-first + fallback a caché + caché dinámico) */
const VERSION = 'v1.0.0';
const STATIC_CACHE = `sw4-static-${VERSION}`;
const DYNAMIC_CACHE = `sw4-dynamic-${VERSION}`;

const cacheAssets = [
  './',                 // permite abrir index desde la raíz del SW4
  './index.html',
  './pagina1.html',
  './pagina2.html',
  './pagina3.html',
  './styles.css',
  './main.js',
  './logo.png',
  './img1.jpeg',
  './img2.png',
  './img3.png',
  './img4.png',
  './img5.png',
  './img6.png',
];

// Estrategia Network-First con fallback y caché dinámico
self.addEventListener('fetch', (e) => {
  const req = e.request;

  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    (async () => {
      try {
        const netRes = await fetch(req);
        if (netRes && netRes.status === 200) {
          const clone = netRes.clone();
          const dyn = await caches.open(DYNAMIC_CACHE);
          dyn.put(req, clone);
        }
        return netRes;
      } catch {
        const match = await caches.match(req);
        if (match) return match;
        if (req.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      }
    })()
  );
});

// Click en notificación: abrir o enfocar
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      for (const client of clientsArr) {
        if (client.url.includes('sw4') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});