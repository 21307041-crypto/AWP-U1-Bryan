//verficar si el navegador soporta service worker
if('serviceWorker' in navigator){

    //llamar al meytodo register para registrar el service worker
    //El parametro /sw.js es la ruta del archivo del service worker
    navigator.serviceWorker.register('sw.js')

    //then se ejecuta si el registro fue exitoso
    //reg es un objrto tipo ServiceWorkerRegistration con informacion del SW
   .then((reg) => console.log('Service Worker registrado', reg))
    //catch se ejecuta si hubo un error al registrar el SW
    //err contiene el mensaje o detalle del error
    .catch((err) => console.log('Error al registrar el SW:', err));
}

//Agregamos un evento clic al boton check
document.getElementById('check').addEventListener('click', () => {
    //verificamos si hay un service worker activo
    if(navigator.serviceWorker.controller){ 
        alert('El SW esta activo y controlando la pagina');
    } else {
        alert('El SW no esta activo');
    }
});


//Area de notificacion 
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
        if(perm === "granted"){
            console.log("Permiso de notificaciones concedido");
        }
    });
}
