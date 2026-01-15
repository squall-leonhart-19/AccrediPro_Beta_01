"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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
  autoSubscribe: () => Promise<boolean>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState(0);
  const [devices, setDevices] = useState<PushDevice[]>([]);
  const [preferences, setPreferences] = useState<PushPreferences | null>(null);
  const hasInitialized = useRef(false);

  // Check if push is supported
  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    } else {
      setIsLoading(false);
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
    if (isSupported && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchStatus();
    }
  }, [isSupported, fetchStatus]);

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
    if (!isSupported) {
      console.log("[Push] Not supported");
      return false;
    }

    try {
      // Request permission if not granted
      if (Notification.permission !== "granted") {
        const result = await requestPermission();
        if (result !== "granted") {
          console.log("[Push] Permission denied");
          return false;
        }
      }

      // Get service worker registration
      let registration;
      try {
        registration = await navigator.serviceWorker.ready;
      } catch (swError) {
        console.error("[Push] Service worker not ready:", swError);
        return false;
      }

      // Get VAPID public key from server
      let vapidPublicKey;
      try {
        const keyResponse = await fetch("/api/push/subscribe");
        if (!keyResponse.ok) {
          console.error("[Push] Failed to get VAPID key:", keyResponse.status);
          return false;
        }
        const keyData = await keyResponse.json();
        vapidPublicKey = keyData.vapidPublicKey;

        if (!vapidPublicKey) {
          console.error("[Push] No VAPID key returned - check env vars");
          return false;
        }
      } catch (keyError) {
        console.error("[Push] Error fetching VAPID key:", keyError);
        return false;
      }

      // Subscribe to push service
      let subscription;
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      } catch (subError) {
        console.error("[Push] Failed to subscribe to push manager:", subError);
        return false;
      }

      // Send subscription to server
      try {
        const response = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        });

        if (response.ok) {
          setIsSubscribed(true);
          await fetchStatus();
          return true;
        } else {
          console.error("[Push] Failed to save subscription:", response.status);
          return false;
        }
      } catch (saveError) {
        console.error("[Push] Error saving subscription:", saveError);
        return false;
      }
    } catch (error) {
      console.error("[Push] Unexpected error:", error);
      return false;
    }
  }, [isSupported, requestPermission, fetchStatus]);

  // Auto-subscribe if permission already granted
  const autoSubscribe = useCallback(async (): Promise<boolean> => {
    if (!isSupported || isSubscribed || isLoading) return false;

    // Only auto-subscribe if permission is already granted
    if (Notification.permission === "granted") {
      return subscribe();
    }

    return false;
  }, [isSupported, isSubscribed, isLoading, subscribe]);

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
    autoSubscribe,
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
