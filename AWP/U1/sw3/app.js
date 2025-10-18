// app.js - Gestor de Service Worker SW3 (Bryan Rocha Moreno - 21307041)
let registroSW = null;
let estadoCache = null;

// Registrar Service Worker
function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(respuesta => {
            registroSW = respuesta;
            console.log('✅ SW3: Service Worker registrado exitosamente');
            console.log('📌 Alcance:', respuesta.scope);
            console.log('🔄 Estado:', respuesta.active ? 'Activo' : 'En proceso');
            
            // Actualizar estado en la interfaz
            actualizarEstadoUI('registrado');
            
            // Escuchar mensajes del Service Worker
            navigator.serviceWorker.addEventListener('message', manejarMensajeSW);
            
        })
        .catch(error => {
            console.error('❌ SW3: Error al registrar Service Worker:', error);
            actualizarEstadoUI('error', error.message);
        });
    } else {
        console.warn('⚠️ SW3: El navegador no soporta Service Workers');
        actualizarEstadoUI('no-soportado');
    }
}

// Desregistrar Service Worker
function desregistrarServiceWorker() {
    if (!navigator.serviceWorker) return;
    
    navigator.serviceWorker.getRegistrations()
    .then(registros => {
        if (registros.length === 0) {
            console.log('ℹ️ SW3: No hay Service Workers registrados');
            return;
        }
        
        registros.forEach(registro => {
            registro.unregister();
            console.log('🗑️ SW3: Service Worker desregistrado');
        });
        
        actualizarEstadoUI('desregistrado');
    })
    .catch(error => {
        console.error('❌ SW3: Error al desregistrar:', error);
        actualizarEstadoUI('error', error.message);
    });
}

// Manejar mensajes del Service Worker
function manejarMensajeSW(evento) {
    console.log('📨 SW3: Mensaje recibido del Service Worker:', evento.data);
    
    switch (evento.data.tipo) {
        case 'CACHE_ACTUALIZADO':
            mostrarNotificacion('✅ Cache actualizado correctamente');
            break;
        case 'CACHE_LIMPIADO':
            mostrarNotificacion('🧹 Cache limpiado exitosamente');
            break;
        case 'ESTADO_CACHE':
            estadoCache = evento.data;
            actualizarInfoCache();
            break;
    }
}

// Solicitar estado del cache al Service Worker
function obtenerEstadoCache() {
    if (!registroSW || !registroSW.active) {
        console.warn('⚠️ SW3: Service Worker no está activo');
        return;
    }
    
    registroSW.active.postMessage({ tipo: 'OBTENER_ESTADO' });
    console.log('🔍 SW3: Solicitando estado del cache...');
}

// Actualizar cache manualmente
function actualizarCache() {
    if (!registroSW || !registroSW.active) {
        console.warn('⚠️ SW3: Service Worker no está activo');
        return;
    }
    
    registroSW.active.postMessage({ tipo: 'ACTUALIZAR_CACHE' });
    console.log('🔄 SW3: Solicitando actualización de cache...');
    mostrarNotificacion('🔄 Actualizando cache...');
}

// Limpiar cache
function limpiarCache() {
    if (!registroSW || !registroSW.active) {
        console.warn('⚠️ SW3: Service Worker no está activo');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar el cache?')) {
        registroSW.active.postMessage({ tipo: 'LIMPIAR_CACHE' });
        console.log('🧹 SW3: Solicitando limpieza de cache...');
        mostrarNotificacion('🧹 Limpiando cache...');
    }
}

// Probar funcionamiento del cache
function probarCache() {
    console.log('🧪 SW3: Probando funcionamiento del cache...');
    
    // Simular varias peticiones para probar el cache
    const recursos = ['./', './app.js', './gestor-cache.js'];
    
    recursos.forEach(recurso => {
        fetch(recurso)
            .then(respuesta => {
                console.log(`✅ ${recurso}: ${respuesta.status === 200 ? 'Cargado' : 'Error'}`);
            })
            .catch(error => {
                console.error(`❌ ${recurso}: ${error.message}`);
            });
    });
}

// Actualizar interfaz de usuario
function actualizarEstadoUI(estado, mensajeError = '') {
    const elementoEstado = document.getElementById('estadoSW');
    const contenedorAcciones = document.querySelector('.acciones-cache');
    
    if (!elementoEstado) return;
    
    const estados = {
        'registrado': { 
            texto: '✅ Service Worker ACTIVO y funcionando', 
            clase: 'estado-activo' 
        },
        'desregistrado': { 
            texto: '❌ Service Worker INACTIVO', 
            clase: 'estado-inactivo' 
        },
        'error': { 
            texto: `⚠️ Error: ${mensajeError}`, 
            clase: 'estado-error' 
        },
        'no-soportado': { 
            texto: '🚫 Service Workers no soportados en este navegador', 
            clase: 'estado-no-soportado' 
        }
    };
    
    const infoEstado = estados[estado] || { 
        texto: '🔍 Estado desconocido', 
        clase: 'estado-desconocido' 
    };
    
    elementoEstado.innerHTML = infoEstado.texto;
    elementoEstado.className = `estado ${infoEstado.clase}`;
    
    // Mostrar botones secundarios solo cuando el SW esté activo
    if (contenedorAcciones) {
        contenedorAcciones.style.display = estado === 'registrado' ? 'block' : 'none';
    }
}

// Actualizar información del cache en la UI
function actualizarInfoCache() {
    if (!estadoCache) return;
    
    const infoCache = document.getElementById('infoCache');
    if (!infoCache) return;
    
    infoCache.innerHTML = `
        <div class="info-cache">
            <h4>📊 Estado del Cache</h4>
            <p><strong>Nombre:</strong> ${estadoCache.nombre || 'N/A'}</p>
            <p><strong>Recursos:</strong> ${estadoCache.cantidadRecursos || 0}</p>
            <p><strong>Estado:</strong> ${estadoCache.estado || 'Desconocido'}</p>
        </div>
    `;
}

// Mostrar notificación temporal
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación si no existe
    let notificacion = document.getElementById('notificacionSW');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.id = 'notificacionSW';
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notificacion);
    }
    
    notificacion.textContent = mensaje;
    notificacion.style.opacity = '1';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
    }, 3000);
}

// CONEXIÓN DEL BOTÓN PRINCIPAL - CÓDIGO NUEVO AGREGADO
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 SW3: Conectando botón de inicialización...');
    
    // Conectar el botón principal
    const botonInicializar = document.getElementById('initSW');
    if (botonInicializar) {
        botonInicializar.addEventListener('click', function() {
            console.log('🎯 SW3: Botón clickeado - Inicializando Service Worker...');
            registrarServiceWorker();
            
            // Feedback visual
            this.innerHTML = '⏳ Inicializando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '✅ Service Worker Inicializado';
                this.disabled = false;
            }, 3000);
        });
        console.log('✅ SW3: Botón initSW conectado correctamente');
    } else {
        console.error('❌ SW3: No se encontró el botón initSW');
    }
    
    // Conectar botones secundarios
    const botonProbar = document.getElementById('probarCache');
    const botonActualizar = document.getElementById('actualizarCache');
    const botonLimpiar = document.getElementById('limpiarCache');
    const botonEstado = document.getElementById('obtenerEstado');
    
    if (botonProbar) {
        botonProbar.addEventListener('click', probarCache);
        console.log('✅ SW3: Botón probarCache conectado');
    }
    if (botonActualizar) {
        botonActualizar.addEventListener('click', actualizarCache);
        console.log('✅ SW3: Botón actualizarCache conectado');
    }
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', limpiarCache);
        console.log('✅ SW3: Botón limpiarCache conectado');
    }
    if (botonEstado) {
        botonEstado.addEventListener('click', obtenerEstadoCache);
        console.log('✅ SW3: Botón obtenerEstado conectado');
    }
    
    console.log('🚀 SW3: Aplicación completamente inicializada - Bryan Rocha Moreno (21307041)');
});

// Inicializar Service Worker automáticamente cuando carga la página (OPCIONAL)
// window.addEventListener('load', function() {
//     console.log('📄 SW3: Página cargada');
//     // Comentado para que el usuario tenga control con el botón
//     // registrarServiceWorker();
// });

// Manejar clics para probar fetch (manteniendo funcionalidad original)
window.addEventListener('click', function(evento) {
    // Solo ejecutar si no se hizo clic en un botón específico
    if (!evento.target.matches('button')) {
        console.log('🖱️ SW3: Clic detectado, probando recursos...');
        probarCache();
    }
});

// Exportar funciones para uso global (si es necesario)
window.SW3Manager = {
    registrar: registrarServiceWorker,
    desregistrar: desregistrarServiceWorker,
    actualizarCache: actualizarCache,
    limpiarCache: limpiarCache,
    obtenerEstado: obtenerEstadoCache,
    probar: probarCache
};

console.log('📦 SW3: Módulo JavaScript cargado - Listo para usar');