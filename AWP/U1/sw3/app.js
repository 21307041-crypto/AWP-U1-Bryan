// app.js - Práctica SW3 - Bryan Rocha Moreno - 21307041
let swRegistration = null;

// Función para registrar el Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                swRegistration = registration;
                console.log('Service Worker registrado correctamente');
                updateStatus('Service Worker activo y funcionando', 'success');
                
                // Mostrar botón de prueba
                document.getElementById('probarCache').style.display = 'inline-block';
            })
            .catch(function(error) {
                console.log('Error al registrar Service Worker:', error);
                updateStatus('Error: ' + error.message, 'error');
            });
    } else {
        console.log('Este navegador no soporta Service Workers');
        updateStatus('Service Workers no soportados', 'warning');
    }
}

// Función para probar el cache
function testCache() {
    console.log('Probando cache...');
    
    // Intentar cargar algunos recursos para ver si están en cache
    fetch('./')
        .then(response => {
            if (response.status === 200) {
                console.log('Página principal cargada correctamente');
                updateStatus('✓ Cache funcionando - Página cargada desde cache', 'success');
            }
        })
        .catch(error => {
            console.log('Error al cargar página:', error);
        });
}

// Función para actualizar el estado en la interfaz
function updateStatus(message, type) {
    const statusElement = document.getElementById('estadoSW');
    if (statusElement) {
        statusElement.textContent = message;
        
        // Cambiar color según el tipo
        statusElement.style.backgroundColor = 
            type === 'success' ? '#d4edda' : 
            type === 'error' ? '#f8d7da' : 
            type === 'warning' ? '#fff3cd' : '#d1ecf1';
        
        statusElement.style.color = 
            type === 'success' ? '#155724' : 
            type === 'error' ? '#721c24' : 
            type === 'warning' ? '#856404' : '#0c5460';
    }
}

// Cuando la página carga, configuramos los botones
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página SW3 cargada');
    
    // Botón de activar Service Worker
    const initButton = document.getElementById('initSW');
    if (initButton) {
        initButton.addEventListener('click', function() {
            this.textContent = 'Activando...';
            this.disabled = true;
            registerServiceWorker();
            
            // Restaurar botón después de 2 segundos
            setTimeout(() => {
                this.textContent = 'Service Worker Activado';
            }, 2000);
        });
    }
    
    // Botón de probar cache (inicialmente oculto)
    const testButton = document.getElementById('probarCache');
    if (testButton) {
        testButton.addEventListener('click', testCache);
    }
});

// Mensaje inicial en consola
console.log('SW3 - Práctica de Service Worker por Bryan Rocha Moreno');
