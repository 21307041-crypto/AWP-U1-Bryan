// SW3 - Gestor Avanzado de Cache (Bryan Rocha Moreno - 21307041)
const CACHE_ACTUAL = 'sw3-cache-v1';
const ARCHIVOS_CACHE = [
    './',
    './app.js',
    './gestor-cache.js',
    './estilos.css',
    './recursos.json'
];

// Evento de instalación del Service Worker
self.addEventListener('install', evento => {
    console.log('🛠️ SW3: Iniciando instalación...');
    
    // Tomar control inmediato de las páginas
    self.skipWaiting();
    
    evento.waitUntil(
        caches.open(CACHE_ACTUAL)
        .then(cache => {
            console.log('📦 SW3: Almacenando recursos en cache...');
            return cache.addAll(ARCHIVOS_CACHE);
        })
        .then(() => {
            console.log('✅ SW3: Todos los recursos fueron cacheados exitosamente');
        })
        .catch(error => {
            console.error('❌ SW3: Error al cachear recursos:', error);
        })
    );
});

// Evento de activación - Limpieza de caches antiguos
self.addEventListener('activate', evento => {
    console.log('⚡ SW3: Service Worker activado');
    
    evento.waitUntil(
        caches.keys()
        .then(nombresCache => {
            return Promise.all(
                nombresCache.map(nombreCache => {
                    // Eliminar caches que no sean el actual
                    if (nombreCache !== CACHE_ACTUAL) {
                        console.log('🗑️ SW3: Eliminando cache antiguo:', nombreCache);
                        return caches.delete(nombreCache);
                    }
                })
            );
        })
        .then(() => {
            console.log('🎯 SW3: Ahora controla todas las pestañas');
            return self.clients.claim();
        })
    );
});

// Evento fetch - Intercepta todas las peticiones
self.addEventListener('fetch', evento => {
    const urlSolicitud = evento.request.url;
    
    console.log('🔍 SW3: Interceptando petición:', urlSolicitud);
    
    // Estrategia: Cache First con fallback a network
    evento.respondWith(
        caches.match(evento.request)
            .then(respuestaCache => {
                // Si existe en cache, devolverlo
                if (respuestaCache) {
                    console.log('💾 SW3: Sirviendo desde cache:', urlSolicitud);
                    return respuestaCache;
                }
                
                // Si no está en cache, hacer fetch
                console.log('🌐 SW3: Obteniendo desde network:', urlSolicitud);
                return fetch(evento.request)
                    .then(respuestaNetwork => {
                        // Verificar que la respuesta sea válida
                        if (!respuestaNetwork || respuestaNetwork.status !== 200) {
                            return respuestaNetwork;
                        }
                        
                        // Clonar respuesta para almacenar en cache
                        const respuestaClonada = respuestaNetwork.clone();
                        
                        // Almacenar nueva respuesta en cache
                        caches.open(CACHE_ACTUAL)
                            .then(cache => {
                                cache.put(evento.request, respuestaClonada);
                                console.log('🆕 SW3: Nuevo recurso almacenado en cache:', urlSolicitud);
                            });
                        
                        return respuestaNetwork;
                    })
                    .catch(error => {
                        console.error('🚫 SW3: Error en fetch:', error);
                        
                        // Para solicitudes de página, podrías devolver una página offline personalizada
                        if (evento.request.destination === 'document') {
                            return caches.match('./')
                                .then(respuestaIndex => {
                                    return respuestaIndex || new Response(
                                        '<h1>Modo Offline</h1><p>Esta funcionalidad requiere conexión a internet.</p>',
                                        { headers: { 'Content-Type': 'text/html' } }
                                    );
                                });
                        }
                        
                        return new Response('Recurso no disponible en modo offline', {
                            status: 408,
                            statusText: 'Offline'
                        });
                    });
            })
    );
});

// Manejo de mensajes desde la aplicación
self.addEventListener('message', evento => {
    console.log('📨 SW3: Mensaje recibido:', evento.data);
    
    switch (evento.data.tipo) {
        case 'ACTUALIZAR_CACHE':
            actualizarCache();
            break;
        case 'LIMPIAR_CACHE':
            limpiarCache();
            break;
        case 'OBTENER_ESTADO':
            obtenerEstadoCache().then(estado => {
                evento.ports[0].postMessage(estado);
            });
            break;
    }
});

// Función para actualizar cache manualmente
async function actualizarCache() {
    try {
        const cache = await caches.open(CACHE_ACTUAL);
        await cache.addAll(ARCHIVOS_CACHE);
        console.log('🔄 SW3: Cache actualizado manualmente');
    } catch (error) {
        console.error('❌ SW3: Error al actualizar cache:', error);
    }
}

// Función para limpiar cache específico
async function limpiarCache() {
    try {
        await caches.delete(CACHE_ACTUAL);
        console.log('🧹 SW3: Cache limpiado exitosamente');
    } catch (error) {
        console.error('❌ SW3: Error al limpiar cache:', error);
    }
}

// Función para obtener estado del cache
async function obtenerEstadoCache() {
    try {
        const cache = await caches.open(CACHE_ACTUAL);
        const keys = await cache.keys();
        
        return {
            nombre: CACHE_ACTUAL,
            cantidadRecursos: keys.length,
            recursos: keys.map(key => key.url),
            estado: 'ACTIVO'
        };
    } catch (error) {
        return {
            estado: 'ERROR',
            error: error.message
        };
    }
}

// Manejo de sincronización en segundo plano
self.addEventListener('sync', evento => {
    if (evento.tag === 'actualizacion-fondo') {
        console.log('🔄 SW3: Sincronización en segundo plano iniciada');
        evento.waitUntil(actualizarCache());
    }
});

console.log('🚀 SW3: Service Worker cargado y listo');