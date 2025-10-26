// sw.js para SW3 - Basado en el video de Service Worker
const CACHE_NAME = 'sw3-cache-v1';
const urlsToCache = [
    './',
    './app.js',
    './icono.png'
];

self.addEventListener('install', event => {
    console.log('SW3: Instalado');
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('SW3: Cacheando archivos...');
            return cache.addAll(urlsToCache);
        })
        .then(() => {
            console.log('SW3: Archivos cacheados correctamente');
        })
        .catch(error => {
            console.log('SW3: Error al cachear archivos:', error);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('SW3: Activado');
    
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW3: Eliminando cache viejo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('SW3: Interceptando:', event.request.url);
    
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                console.log('SW3: Sirviendo desde cache:', event.request.url);
                return response;
            }
            
            console.log('SW3: Haciendo fetch a internet:', event.request.url);
            return fetch(event.request);
        })
        .catch(error => {
            console.log('SW3: Error en fetch:', error);
        })
    );
});

console.log('SW3: Service Worker cargado - Bryan Rocha Moreno');
