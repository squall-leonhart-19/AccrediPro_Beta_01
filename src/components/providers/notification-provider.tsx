"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface NotificationCounts {
  messages: number;
  announcements: number;
  total: number;
}

interface NotificationContextType {
  counts: NotificationCounts;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    announcements: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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

  // Poll for updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
