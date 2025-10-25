// ====== Registrar el Service Worker ======
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => {
        console.log('✅ SW registrado con éxito:', reg.scope);
      })
      .catch(err => console.error('❌ Error al registrar el SW:', err));
  });
}

// ====== Solicitar permiso de notificaciones ======
async function pedirPermisos() {
  if (!('Notification' in window)) {
    alert('Este navegador no soporta notificaciones.');
    return;
  }

  const permiso = await Notification.requestPermission();
  if (permiso === 'granted') {
    alert('✅ Permiso concedido para notificaciones.');
  } else {
    alert('⚠️ Permiso denegado o bloqueado.');
  }
}

// ====== Mostrar notificación ======
async function mostrarNotificacion() {
  if (!('serviceWorker' in navigator)) {
    alert('Este navegador no soporta Service Workers.');
    return;
  }

  // Esperar a que el SW esté activo
  const reg = await navigator.serviceWorker.ready;

  if (Notification.permission !== 'granted') {
    await pedirPermisos();
  }

  if (Notification.permission === 'granted') {
    reg.showNotification('Kour.io — ¡Partida lista!', {
      body: 'Tu escuadrón te espera. Mantén el momentum 🕹️',
      icon: './logo.png',
      badge: './logo.png',
      vibrate: [200, 100, 200],
      tag: 'kourio-notif'
    });
  } else {
    alert('Debes permitir notificaciones para recibir alertas del juego.');
  }
}

// ====== Enlazar eventos a los botones ======
document.getElementById('btn-perm')?.addEventListener('click', pedirPermisos);
document.getElementById('btn-notif')?.addEventListener('click', mostrarNotificacion);
