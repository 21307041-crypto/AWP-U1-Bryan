// app.js para SW3 - Basado en el video de Service Worker
let registration = null;

function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(reg => {
                registration = reg;
                console.log("Service Worker registrado correctamente", reg);
                updateStatus('Service Worker registrado - Recarga la página para activar');
            })
            .catch(error => {
                console.log("Error al registrar el Service Worker", error);
                updateStatus('Error: ' + error.message);
            });
    } else {
        console.log("Service Workers no soportados");
        updateStatus('Service Workers no soportados en este navegador');
    }
}

function unregisterSW() {
    if (!navigator.serviceWorker) return;
    
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log("Service Worker desregistrado");
            });
            updateStatus('Service Worker desregistrado');
        })
        .catch(error => {
            console.log("Error al desregistrar", error);
        });
}

function testCache() {
    console.log("Probando cache...");
    fetch('./')
        .then(res => {
            console.log('Página cargada:', res.status === 200 ? 'Éxito' : 'Error');
            updateStatus('Cache funcionando - Página cargada correctamente');
        })
        .catch(error => {
            console.log('Error al cargar página:', error);
            updateStatus('Error al probar cache');
        });
}

function updateStatus(message) {
    const statusElement = document.getElementById('estadoSW');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Configurar eventos cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Botón de activar
    const initBtn = document.getElementById('initSW');
    if (initBtn) {
        initBtn.addEventListener('click', function() {
            this.textContent = 'Activando...';
            this.disabled = true;
            registerSW();
            
            setTimeout(() => {
                this.textContent = 'Service Worker Activado';
                document.getElementById('probarCache').style.display = 'inline-block';
            }, 2000);
        });
    }
    
    // Botón de probar cache
    const testBtn = document.getElementById('probarCache');
    if (testBtn) {
        testBtn.addEventListener('click', testCache);
    }
});

// Probar recursos al hacer clic en la página (como en el video)
window.addEventListener('click', function() {
    if (!event.target.matches('button')) {
        console.log('Probando recursos...');
        testCache();
    }
});

console.log('SW3 - Bryan Rocha Moreno - 21307041');
