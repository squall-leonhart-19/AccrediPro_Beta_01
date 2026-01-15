"use client";

import { useState, useEffect } from "react";
import { X, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export function PushNotificationPrompt() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
  } = usePushNotifications();

  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Don't show if not supported or already subscribed
    if (!isSupported || isSubscribed || isLoading) return;

    // Don't show if permission was denied
    if (permission === "denied") return;

    // Check if user dismissed recently (7 days)
    const dismissed = localStorage.getItem("push-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Show after 60 seconds on page (after install prompt)
    const timer = setTimeout(() => setShowPrompt(true), 60000);
    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, isLoading, permission]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    const success = await subscribe();
    setIsSubscribing(false);

    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("push-prompt-dismissed", Date.now().toString());
  };

  // Don't render if shouldn't show
  if (!showPrompt || !isSupported || isSubscribed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d4af37] to-[#c9a227] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Stay Updated</h3>
                <p className="text-xs text-white/80">Get notified instantly</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li className="flex items-center gap-2">
              <span className="text-[#722f37]">✓</span>
              New message alerts from mentors
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#722f37]">✓</span>
              Certificate completion updates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#722f37]">✓</span>
              Course deadline reminders
            </li>
          </ul>

          {permission === "denied" ? (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <BellOff className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Notifications blocked</span>
              </div>
              <p className="text-xs">
                Enable notifications in your browser settings to receive updates.
              </p>
            </div>
          ) : (
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="w-full bg-[#722f37] hover:bg-[#5a252c] text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              {isSubscribing ? "Enabling..." : "Enable Notifications"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
