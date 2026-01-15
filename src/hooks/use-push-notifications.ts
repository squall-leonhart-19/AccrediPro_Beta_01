"use client";

import { useState, useEffect, useCallback } from "react";

interface PushPreferences {
  messagesEnabled: boolean;
  coursesEnabled: boolean;
  remindersEnabled: boolean;
  marketingEnabled: boolean;
}

interface PushDevice {
  id: string;
  deviceType: string;
  subscribedAt: string;
  lastPushAt: string | null;
}

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | "unsupported";
  isSubscribed: boolean;
  isLoading: boolean;
  deviceCount: number;
  devices: PushDevice[];
  preferences: PushPreferences | null;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  updatePreferences: (prefs: Partial<PushPreferences>) => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState(0);
  const [devices, setDevices] = useState<PushDevice[]>([]);
  const [preferences, setPreferences] = useState<PushPreferences | null>(null);

  // Check if push is supported
  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // Fetch subscription status and preferences
  const fetchStatus = useCallback(async () => {
    if (!isSupported) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/push/preferences");
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.subscribed);
        setDeviceCount(data.deviceCount);
        setDevices(data.devices);
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Failed to fetch push status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied";

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return "denied";
    }
  }, [isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      // Request permission if not granted
      if (Notification.permission !== "granted") {
        const result = await requestPermission();
        if (result !== "granted") return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from server
      const keyResponse = await fetch("/api/push/subscribe");
      if (!keyResponse.ok) return false;

      const { vapidPublicKey } = await keyResponse.json();
      if (!vapidPublicKey) return false;

      // Subscribe to push service
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        await fetchStatus();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
      return false;
    }
  }, [isSupported, requestPermission, fetchStatus]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe();

        // Remove from server
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      setIsSubscribed(false);
      setDeviceCount(0);
      setDevices([]);
      setPreferences(null);
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      return false;
    }
  }, [isSupported]);

  // Update notification preferences
  const updatePreferences = useCallback(
    async (newPrefs: Partial<PushPreferences>): Promise<boolean> => {
      try {
        const response = await fetch("/api/push/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPrefs),
        });

        if (response.ok) {
          setPreferences((prev) => (prev ? { ...prev, ...newPrefs } : null));
          return true;
        }

        return false;
      } catch (error) {
        console.error("Failed to update preferences:", error);
        return false;
      }
    },
    []
  );

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    deviceCount,
    devices,
    preferences,
    subscribe,
    unsubscribe,
    updatePreferences,
    requestPermission,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
