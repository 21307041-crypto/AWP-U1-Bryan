// Nombre del cache actual (identificador único)
const CACHE_NAME = "mi-app-cache-v1";

// Listar los archivos que se guardarán en cache
const urlsToCache = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    // "./logo.png" // <- Descomenta si existe este archivo
];

// Evento de instalación (se dispara cuando se instala el SW)
self.addEventListener("install", (event) => {
    console.log("SW: Instalando...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("SW: Cacheando archivos...");
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error("SW: Error al cachear archivos", err))
    );
});

// Evento de activación (se dispara cuando el SW toma control)
self.addEventListener("activate", (event) => {
    console.log("SW: Activado ✅");

    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Interceptar las peticiones y servir desde cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Devuelve el recurso desde cache o lo solicita a la red
            return response || fetch(event.request);
        })
    );
});
