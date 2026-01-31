"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Pages where PWA prompt should NOT show (public/lead pages)
const EXCLUDED_PATH_PATTERNS = [
  "/functional-medicine-mini-diploma",
  "/womens-health-diploma",
  "/gut-health-diploma",
  "/hormone-health-diploma",
  "/holistic-nutrition-diploma",
  "/nurse-coach-diploma",
  "/health-coach-diploma",
  "/roots-method",
  "/fm-career-pathway",
  "/login",
  "/register",
  "/checkout",
];

export function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Check if current path is excluded (lead/public pages)
  const isExcludedPage = EXCLUDED_PATH_PATTERNS.some(pattern => pathname?.includes(pattern));

  useEffect(() => {
    // Don't show on excluded pages (lead gen, public)
    if (isExcludedPage) return;

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Don't show if already installed
    if (standalone) return;

    // Check if user dismissed recently (24 hours)
    let dismissed: string | null = null;
    try { dismissed = localStorage.getItem("pwa-prompt-dismissed"); } catch {}
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) return;
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds on page
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // For iOS, show after delay since there's no beforeinstallprompt
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 30000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isExcludedPage]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try { localStorage.setItem("pwa-prompt-dismissed", Date.now().toString()); } catch {}
  };

  // Don't render if already installed, shouldn't show, or on excluded pages
  if (isStandalone || !showPrompt || isExcludedPage) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#722f37] to-[#8b3a42] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Install AccrediPro</h3>
                <p className="text-xs text-white/80">Learn anytime, anywhere</p>
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
              <span className="text-[#d4af37]">✓</span>
              Access lessons offline
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span>
              Get certificate notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#d4af37]">✓</span>
              Quick access from home screen
            </li>
          </ul>

          {isIOS ? (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
              <p className="font-medium mb-2">To install on iOS:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Tap the <span className="font-semibold">Share</span> button</li>
                <li>Scroll and tap <span className="font-semibold">"Add to Home Screen"</span></li>
                <li>Tap <span className="font-semibold">Add</span></li>
              </ol>
            </div>
          ) : (
            <Button
              onClick={handleInstall}
              className="w-full bg-[#722f37] hover:bg-[#5a252c] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
