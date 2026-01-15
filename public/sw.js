// AccrediPro Service Worker for Push Notifications
// This SW handles push notifications and basic caching

const CACHE_NAME = 'accredipro-v1';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(self.clients.claim());
});

// Push notification handler
self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();

        const options = {
            body: data.body || '',
            icon: data.icon || '/icons/icon-192x192.png',
            badge: data.badge || '/icons/icon-96x96.png',
            tag: data.tag || 'default',
            renotify: true,
            requireInteraction: data.requireInteraction || false,
            data: data.data || {},
            actions: data.actions || [],
            vibrate: [100, 50, 100],
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'AccrediPro Academy', options)
        );
    } catch (error) {
        console.error('[SW] Push event error:', error);
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data || {};
    let url = data.url || '/dashboard';

    // Handle action buttons
    if (event.action) {
        switch (event.action) {
            case 'view':
                url = data.viewUrl || data.url || '/dashboard';
                break;
            case 'dismiss':
                return;
            default:
                url = data.url || '/dashboard';
        }
    }

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // Focus existing window if available
            for (const client of clients) {
                if (client.url.includes('learn.accredipro.academy') && 'focus' in client) {
                    client.focus();
                    if (url !== '/dashboard') {
                        client.navigate(url);
                    }
                    return;
                }
            }
            // Otherwise open new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});

// Fetch handler - network first, cache fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API requests
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request);
            })
    );
});
