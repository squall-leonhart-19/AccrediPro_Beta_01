"use client";

import { useEffect } from "react";
import { useNotifications } from "@/components/providers/notification-provider";

export function MarkCertificatesRead() {
  const { refresh } = useNotifications();

  useEffect(() => {
    // Mark certificate notifications as read when visiting this page
    const markAsRead = async () => {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "certificates" }),
        });
        // Refresh notification counts
        await refresh();
      } catch (error) {
        console.error("Failed to mark certificates as read:", error);
      }
    };

    markAsRead();
  }, [refresh]);

  return null;
}
