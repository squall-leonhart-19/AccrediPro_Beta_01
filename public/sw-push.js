// Custom Push Notification Handler for AccrediPro PWA
// This file is loaded by the main service worker

// Handle push events
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body || "",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: data.badge || "/icons/icon-96x96.png",
      tag: data.tag || "default",
      renotify: true,
      requireInteraction: data.requireInteraction || false,
      data: data.data || {},
      actions: data.actions || [],
      vibrate: [100, 50, 100],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "AccrediPro Academy", options)
    );
  } catch (error) {
    console.error("Push event error:", error);
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || "/dashboard";

  // Handle action buttons
  if (event.action === "view") {
    event.waitUntil(clients.openWindow(url));
    return;
  }

  if (event.action === "dismiss") {
    return;
  }

  // Default click - open the URL
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes("learn.accredipro.academy") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window if none found
      return clients.openWindow(url);
    })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  // Track notification dismissal for analytics
  const data = event.notification.data || {};
  if (data.trackingId) {
    // Could send to analytics endpoint
    console.log("Notification dismissed:", data.trackingId);
  }
});
