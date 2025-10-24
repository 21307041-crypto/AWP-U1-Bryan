// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .then((reg) => console.log('SW registrado correctamente ✅', reg))
        .catch((err) => console.log('Error al registrar el SW ❌', err));
}

// Botón para verificar el estado del SW
document.getElementById('check').addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
        alert('✅ El Service Worker está activo');
    } else {
        alert('❌ El Service Worker no está activo');
    }
});

// Pedir permiso de notificación
if (Notification.permission === 'default') {
    Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
            console.log('Permiso de notificación concedido ✅');
        } else {
            console.log('Permiso de notificación denegado ❌');
        }
    });
}

// Botón para lanzar notificación local
document.getElementById("btnNotificacion").addEventListener('click', () => {
    if (navigator.serviceWorker.controller)
        navigator.serviceWorker.controller.postMessage('mostrar-notificacion');
    else
        console.log('El Service Worker no está activo aún');
});
