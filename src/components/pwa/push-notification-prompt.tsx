"use client";

import { useState, useEffect, useRef } from "react";
import { X, Bell, BellOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export function PushNotificationPrompt() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    autoSubscribe,
  } = usePushNotifications();

  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const hasAutoSubscribed = useRef(false);

  // Auto-subscribe if permission is already granted (silent, no UI)
  useEffect(() => {
    if (hasAutoSubscribed.current || isLoading || !isSupported) return;
    if (isSubscribed) return;

    // If permission already granted, silently subscribe
    if (permission === "granted") {
      hasAutoSubscribed.current = true;
      autoSubscribe().then((success) => {
        if (success) {
          console.log("[Push] Auto-subscribed successfully");
        }
      });
    }
  }, [permission, isSubscribed, isLoading, isSupported, autoSubscribe]);

  // Show prompt for users who haven't granted permission yet
  useEffect(() => {
    // Don't show if not supported, already subscribed, or still loading
    if (!isSupported || isSubscribed || isLoading) return;

    // Don't show if permission was denied
    if (permission === "denied") return;

    // Don't show if permission already granted (we auto-subscribe instead)
    if (permission === "granted") return;

    // Check if user dismissed recently (7 days)
    const dismissed = localStorage.getItem("push-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Show after 60 seconds on page
    const timer = setTimeout(() => setShowPrompt(true), 60000);
    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, isLoading, permission]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setSubscribeError(false);

    try {
      const success = await subscribe();

      if (success) {
        setSubscribeSuccess(true);
        // Hide after showing success
        setTimeout(() => {
          setShowPrompt(false);
        }, 2000);
      } else {
        setSubscribeError(true);
      }
    } catch {
      setSubscribeError(true);
    } finally {
      setIsSubscribing(false);
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
                {subscribeSuccess ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {subscribeSuccess ? "Notifications Enabled!" : "Stay Updated"}
                </h3>
                <p className="text-xs text-white/80">
                  {subscribeSuccess ? "You're all set" : "Get notified instantly"}
                </p>
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
        {!subscribeSuccess && (
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
            ) : subscribeError ? (
              <div className="space-y-2">
                <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
                  <p className="text-xs">
                    Could not enable notifications. Please try again.
                  </p>
                </div>
                <Button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full bg-[#722f37] hover:bg-[#5a252c] text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
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
        )}
      </div>
    </div>
  );
}
