//Nombre de la cache
const cacheName = 'mi-cache-v2';

//Archivos que se guardaran en cache
const cacheAssets = [
    './index.html',
    './pagina1.html', 
    './pagina2.html',
    './offline.html',
    './styles.css',
    './main.js',
    './icono.png'
];

//Instalacion del service worker
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('SW: Cacheando archivos...');
            return cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
        .catch((err) => console.log('Error al cachear archivos:', err))
    );
});

//Activacion del service worker
self.addEventListener('activate', (event) => {
    console.log('SW: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        console.log(`SW: Eliminando cache antigua: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

//Escuchar mensajes desde la pagina
self.addEventListener('message', (event) => {
    console.log('SW: recibio:', event.data);
    if (event.data === 'mostrar-notificacion') {
        self.registration.showNotification('Notificacion Local', {
            body: 'Esta es una prueba de notificacion sin servidor push.',
            icon: './icono.png'
        });
    }
});

//Manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event) => {
    //Ignorar peticiones innecesarias como extensiones o favicon
    if(
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            //Si la respuesta es valida la devuelve y la guarda en el cache dinamico
            const clone = response.clone();
            caches.open(cacheName).then((cache) => cache.put(event.request, clone));
            return response;
        })
        .catch(() => {
            //Si no hay red buscar en cache
            return caches.match(event.request).then((response) => {
                if (response) {
                    console.log('SW: Recurso desde cache', event.request.url);
                    return response;
                } else {
                    console.warn('SW: Mostrando pagina offline.');
                    return caches.match('./offline.html');
                }
            });
        })
    );
});
