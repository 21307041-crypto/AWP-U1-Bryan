const CACHE_NAME = "sw1-v2";

// Asegúrate que TODOS estos archivos existen en /SW1/ (o la carpeta de tu SW1)
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./logo.png", // solo si existe
];

self.addEventListener("install", (event) => {
  console.log("SW1: instalando…");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  console.log("SW1: activado ✅");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Estrategia: cache-first para todo.
// Si es una navegación (HTML) y falla red/cache, caemos a index.html del caché.
self.addEventListener("fetch", (event) => {
  // ignora chucherías
  if (event.request.url.includes("chrome-extension") || event.request.url.includes("favicon.ico")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        // Guarda en caché dinámico opcional
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        return res;
      }).catch(async () => {
        // Fallback especial para navegaciones (documentos HTML)
        if (event.request.mode === "navigate") {
          const cache = await caches.open(CACHE_NAME);
          return cache.match("./index.html");
        }
      });
    })
  );
});

