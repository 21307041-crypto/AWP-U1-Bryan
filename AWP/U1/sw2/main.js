//Registrar el service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw.js")
        .then((reg) => {
            console.log("SW registrado. ", reg);
        })
        .catch((err) => { 
            console.log("Error al registrar el sw", err);
        });
}

//Boton para verficar el estado del SW
document.getElementById("check").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
        alert("El SW esta activo y controlando la pagina");
    } else {
        alert("El SW aun no esta activo");
    }
});

//Pedir permiso de notificaciones
if (Notification.permission === "default") {
    Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
            console.log("Permiso de Notificacion concedido");
        } else {
            console.log("Permiso de Notificacion denegado");
        }
    });
}

// Botón para lanzar notificación local
document.getElementById("btnNotificacion").addEventListener("click", () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("mostrar-notificacion");
    } else {
        console.log("El SW no está activo aún");
    }
});
