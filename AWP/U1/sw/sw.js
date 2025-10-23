//Nombre del cache actual (identificador unico)
const CACHE_NAME = "mi-app-cache-v1";

//Listar los archivos que se guardaran en cache
const urlsToCache = [
    "./", //Ruta de la raiz
    "./index.html", //Documento raiz
    "./styles.css", //Hoja de estilos
    "./app.js", //Script del cliente
    "./logo.png" //Logotipo de canvas
]; 

//Evento de instalacion (se dispara cuando se instala el sw)
self.addEventListener("install", (event) => {
    console.log("SW: Instalado");

    // Saltar waiting para activarse inmediatamente
    self.skipWaiting();

    //event.waitUntil() asegura que la instalacion espere hasta que se complete la promise() de cachear los archivos
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("SW: Archivos cacheados");

            //cache.addAll() agrega todos los archivos de urlsToCache al cache final
            return cache.addAll(urlsToCache);
        })
    );
});

//Evento de activacion (se dispara cuando el sw toma el control).
self.addEventListener("activate", (event) => {
    console.log("SW: activado");

    event.waitUntil(
        //Caches.keys() obtiene todos los nombres de caches almacenados
        caches.keys().then((cacheNames) => 
            //Promise.all() espera a que se eliminen todos los caches viejos
            Promise.all(
                cacheNames.map((cache) => {
                    //si el cache no coincide con el actual se elimina
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return caches.delete(cache);
                    }
                })
            )
        ).then(() => {
            // Tomar control de todas las pestañas inmediatamente
            console.log("SW: Tomando control de las pestañas");
            return self.clients.claim();
        })
    );
});

// Evento fetch - Interceptar peticiones (ESENCIAL que falataba)
self.addEventListener("fetch", (event) => {
    console.log("SW: Interceptando petición:", event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, devolverlo
                if (response) {
                    console.log("SW: Sirviendo desde cache:", event.request.url);
                    return response;
                }
                
                // Si no está en cache, hacer fetch normal
                console.log("SW: Haciendo petición a internet:", event.request.url);
                return fetch(event.request);
            })
    );
});
