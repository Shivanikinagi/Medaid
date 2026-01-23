// Force cache clear and reload
console.log('🔄 Clearing cache and reloading...');

// Unregister service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
    console.log('✅ Service workers unregistered');
  });
}

// Clear cache storage
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => caches.delete(name));
    console.log('✅ Cache storage cleared');
  });
}

// Clear localStorage
localStorage.clear();
console.log('✅ LocalStorage cleared');

// Force reload
setTimeout(() => {
  window.location.reload(true);
}, 1000);
