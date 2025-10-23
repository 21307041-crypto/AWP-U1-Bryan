//Verificar si el navegador soporta Service Worker
if ('serviceWorker' in navigator) {
    //Llamar el metodo register para registrar el SW
    //El primer parametro es el archivo de Service Worker
    navigator.serviceWorker.register('./sw.js')
        //then se ejecuta si el registro fue exitoso
        //reg es un objeto tipo ServiceWorkerRegistration con información del sw
        .then(reg => console.log("Service Worker registrado", reg))
        //catch se ejecuta si hubo un error en el registro
        //err contiene el mensaje de error o detalles del error
        .catch((error) => console.log("Error al registrar el SW", error));
}
//Agregamos un evento click al botón
document.getElementById("check").addEventListener("click", () => {
    //Verificamos si el sw controla la pagina actual
    if (navigator.serviceWorker.controller) {
        alert("El Service Worker está Activo y controlando la pagina actual");
    } else {
        alert("El Service Worker NO está activo");
    }
});
