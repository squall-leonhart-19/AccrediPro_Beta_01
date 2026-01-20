"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface NotificationCounts {
  messages: number;
  certificates: number;
  announcements: number;
  total: number;
}

interface NotificationContextType {
  counts: NotificationCounts;
  refresh: () => Promise<void>;
  isLoading: boolean;
  isRealtimeConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string;
}) {
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    certificates: 0,
    announcements: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = getSupabaseClient();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (data.success) {
        setCounts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ============ SUPABASE REALTIME ============
  // Subscribe to Message and Notification table changes for instant badge updates
  useEffect(() => {
    if (!userId || !supabase) return;

    const channelName = `notifications:${userId}`;

    // Cleanup previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(channelName)
      // Listen for new messages TO this user
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `receiverId=eq.${userId}`,
        },
        (payload) => {
          console.log("[REALTIME] New message notification:", payload);
          // Increment message count instantly
          setCounts((prev) => ({
            ...prev,
            messages: prev.messages + 1,
            total: prev.total + 1,
          }));
        }
      )
      // Listen for message read status changes (to decrement)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Message",
          filter: `receiverId=eq.${userId}`,
        },
        (payload) => {
          const oldRecord = payload.old as { isRead?: boolean };
          const newRecord = payload.new as { isRead?: boolean };

          // If message was just marked as read, decrement count
          if (!oldRecord.isRead && newRecord.isRead) {
            console.log("[REALTIME] Message marked read:", payload);
            setCounts((prev) => ({
              ...prev,
              messages: Math.max(0, prev.messages - 1),
              total: Math.max(0, prev.total - 1),
            }));
          }
        }
      )
      // Listen for new notifications (certificates, etc.)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${userId}`,
        },
        (payload) => {
          console.log("[REALTIME] New notification:", payload);
          const notification = payload.new as { type?: string };

          // Increment appropriate counter based on type
          if (notification.type === "CERTIFICATE_ISSUED" || notification.type === "MODULE_COMPLETE") {
            setCounts((prev) => ({
              ...prev,
              certificates: prev.certificates + 1,
              total: prev.total + 1,
            }));
          } else {
            // Other notification types
            setCounts((prev) => ({
              ...prev,
              announcements: prev.announcements + 1,
              total: prev.total + 1,
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log(`[REALTIME] Notification channel status:`, status);
        setIsRealtimeConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, supabase]);
  // ============ END REALTIME ============

  // Poll for updates - REDUCED frequency when realtime is connected
  useEffect(() => {
    // When realtime connected: poll every 60s as fallback
    // When not connected: poll every 10s for responsiveness
    const pollInterval = isRealtimeConnected ? 60000 : 10000;

    const interval = setInterval(() => {
      // Skip if page not visible
      if (document.hidden) return;
      fetchNotifications();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [fetchNotifications, isRealtimeConnected]);

  // Refresh when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchNotifications();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        counts,
        refresh: fetchNotifications,
        isLoading,
        isRealtimeConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
