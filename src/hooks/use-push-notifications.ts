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
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/push/preferences", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

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

    // Helper to wrap promises with timeout
    const withTimeout = <T,>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(errorMsg)), ms)
        ),
      ]);
    };

    try {
      // Request permission if not granted
      if (Notification.permission !== "granted") {
        console.log("[Push] Requesting permission...");
        const result = await requestPermission();
        console.log("[Push] Permission result:", result);
        if (result !== "granted") {
          console.log("[Push] Permission denied");
          return false;
        }
      }

      // Get service worker registration with timeout
      console.log("[Push] Getting service worker...");
      let registration;
      try {
        registration = await withTimeout(
          navigator.serviceWorker.ready,
          10000,
          "Service worker timeout"
        );
        console.log("[Push] Service worker ready");
      } catch (swError) {
        console.error("[Push] Service worker not ready:", swError);
        return false;
      }

      // Get VAPID public key from server with timeout
      console.log("[Push] Fetching VAPID key...");
      let vapidPublicKey;
      try {
        const keyResponse = await withTimeout(
          fetch("/api/push/subscribe"),
          10000,
          "VAPID key fetch timeout"
        );
        if (!keyResponse.ok) {
          const errorData = await keyResponse.json().catch(() => ({}));
          console.error("[Push] Failed to get VAPID key:", keyResponse.status, errorData);
          return false;
        }
        const keyData = await keyResponse.json();
        vapidPublicKey = keyData.vapidPublicKey;

        if (!vapidPublicKey) {
          console.error("[Push] No VAPID key returned - check env vars");
          return false;
        }
        console.log("[Push] Got VAPID key");
      } catch (keyError) {
        console.error("[Push] Error fetching VAPID key:", keyError);
        return false;
      }

      // Subscribe to push service with timeout
      console.log("[Push] Subscribing to push manager...");
      let subscription;
      try {
        subscription = await withTimeout(
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          }),
          10000,
          "Push manager subscribe timeout"
        );
        console.log("[Push] Subscribed to push manager");
      } catch (subError) {
        console.error("[Push] Failed to subscribe to push manager:", subError);
        return false;
      }

      // Send subscription to server with timeout
      console.log("[Push] Saving subscription to server...");
      try {
        const response = await withTimeout(
          fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription: subscription.toJSON() }),
          }),
          10000,
          "Save subscription timeout"
        );

        if (response.ok) {
          console.log("[Push] Subscription saved successfully");
          setIsSubscribed(true);
          await fetchStatus();
          return true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("[Push] Failed to save subscription:", response.status, errorData);
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
