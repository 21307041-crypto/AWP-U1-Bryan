// Verificar si el navegador soporta Service Worker
if ('serviceWorker' in navigator) {
    // Registrar el Service Worker con un scope definido
    navigator.serviceWorker.register('./sw.js', { scope: './' })
        .then(reg => console.log("Service Worker registrado correctamente:", reg))
        .catch((err) => console.log("Error al registrar el SW:", err));
}

// Agregamos un evento click al botón
document.getElementById("check").addEventListener("click", () => {
    // Verificamos si el SW controla la página actual
    if (navigator.serviceWorker.controller) {
        alert("✅ El Service Worker está activo y controlando la página actual");
    } else {
        alert("❌ El Service Worker NO está activo");
    }
});
