// Service worker molt simple per a PWA (placeholder).
// En producció, considera Workbox o VitePWA per a caché més avançat.
self.addEventListener('install', (e) => {
  self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  self.clients.claim()
})
