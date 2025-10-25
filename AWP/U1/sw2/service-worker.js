//Nombre de la cache
const cacheName = 'mi-cache-v2';

//Archivosque se guardaran en cache
const cacheAssets = [
	'index.html',
	'pagina1.html',
	'pagina2.html',
	'offline.html',
	'style.css',
	'main.js',
	'icono.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('SW: Instalado 🛠️');
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('SW: Cacheando archivos...');
                return cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.log('Error al cachear archivos:', err))
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('SW: Activado ✅');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log(`SW: Eliminando caché antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Escuchar mensajes desde la página
self.addEventListener('message', (event) => {
    console.log('SW: Recibió mensaje ->', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('📢 Notificación Local', {
            body: 'Esta es una prueba de notificación sin servidor push.',
            icon: 'icono.png'
        });
    }
});

// Manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event) => {
    // Ignorar extensiones o favicon
    if (
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clonar la respuesta y guardarla en caché dinámica
                const clone = response.clone();
                caches.open(cacheName).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => {
                // Si no hay red, buscar en caché
                return caches.match(event.request).then((response) => {
                    if (response) {
                        console.log('SW: Recurso cargado desde caché ->', event.request.url);
                        return response;
                    } else {
                        console.warn('SW: Mostrando página offline.');
                        return caches.match('offline.html');
                    }
                });
            })
    );
});

