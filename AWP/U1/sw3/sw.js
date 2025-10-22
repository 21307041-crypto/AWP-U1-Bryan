// sw.js - Service Worker básico - Bryan Rocha Moreno - 21307041
const CACHE_NAME = 'sw3-cache-v1';
const FILES_TO_CACHE = [
    './',
    './app.js',
    './icono.png'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
    console.log('Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Guardando archivos en cache');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(function() {
                console.log('Archivos guardados en cache');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.log('Error al guardar en cache:', error);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker activado');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Si está en cache, devolverlo
                if (response) {
                    console.log('Sirviendo desde cache:', event.request.url);
                    return response;
                }
                
                // Si no está en cache, hacer la petición normal
                console.log('Haciendo petición a internet:', event.request.url);
                return fetch(event.request)
                    .then(function(networkResponse) {
                        // Si la respuesta es válida, guardarla en cache
                        if (networkResponse && networkResponse.status === 200) {
                            var responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                    console.log('Guardado en cache:', event.request.url);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(function(error) {
                        console.log('Error en la petición:', error);
                        // Si es una página y hay error, mostrar la página offline
                        if (event.request.destination === 'document') {
                            return caches.match('./');
                        }
                        return new Response('No hay conexión a internet');
                    });
            })
    );
});

console.log('Service Worker cargado');
