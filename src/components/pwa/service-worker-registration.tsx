"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
    useEffect(() => {
        // Register service worker for push notifications
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Wait for window to load
            window.addEventListener("load", async () => {
                try {
                    const registration = await navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                    });
                    console.log("[SW] Service Worker registered:", registration.scope);

                    // Check for updates
                    registration.addEventListener("updatefound", () => {
                        console.log("[SW] New service worker found, installing...");
                    });
                } catch (error) {
                    console.error("[SW] Service Worker registration failed:", error);
                }
            });
        }
    }, []);

    return null;
}
