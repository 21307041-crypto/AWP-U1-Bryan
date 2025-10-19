//registrar el service worker completo

if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then((reg) => console.Log('SW registrado', reg)
            ).catch((err) => console.Log('Error al registrar el SW', err));

        }

        //Boton para verificar el estado del SW
        document.getElementById('check').addEventListener('click', () => {
            if (navigator.serviceWorker.controller) {
                alert('El SW esta activo');
            } else {
                alert('El SW no esta activo');
            }
        });

//Pedir permiso de notificacion
if (Notification.permission === 'default') {
    Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
console.log('Permiso de notificación concedido');

        } else {
            console.log('Permiso de notificación denegado');
        }
    });
}

//Boton para lanzar notificacion local
document.getElementById("btnNotificacion").addEventListener('click', () => {

    if (navigator.serviceWorker.controller)
        navigator.serviceWorker.controller.postMessage('mostrar-notificacion');
    else {

        console.log('El service Worker no esta activo aun');
        
    }
});