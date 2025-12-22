// Service Worker for Push Notifications
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Become Better'
  const options = {
    body: data.body || 'You have a new update',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.url || '/',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data))
})

