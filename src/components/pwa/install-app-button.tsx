"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Smartphone, Share, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallAppButtonProps {
  variant?: "default" | "sidebar" | "compact";
  className?: string;
}

export function InstallAppButton({ variant = "default", className = "" }: InstallAppButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const promptCaptured = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    // Don't capture prompt if already installed
    if (standalone) return;

    // Listen for the beforeinstallprompt event (Android/Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      if (!promptCaptured.current) {
        promptCaptured.current = true;
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error("Install error:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // Don't show on Android/Chrome if no prompt available (not supported or already installed)
  if (!isIOS && !deferredPrompt) return null;

  // Compact variant (icon only)
  if (variant === "compact") {
    return (
      <>
        <button
          onClick={handleInstall}
          className={`p-2 rounded-lg bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-600 transition-colors ${className}`}
          title="Install App"
        >
          <Download className="w-5 h-5" />
        </button>
        {showIOSGuide && <IOSInstallGuide onClose={() => setShowIOSGuide(false)} />}
      </>
    );
  }

  // Sidebar variant
  if (variant === "sidebar") {
    return (
      <>
        <button
          onClick={handleInstall}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-burgundy-50 to-gold-50 hover:from-burgundy-100 hover:to-gold-100 text-burgundy-700 transition-all group ${className}`}
        >
          <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center group-hover:bg-burgundy-200 transition-colors">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Install App</p>
            <p className="text-xs text-burgundy-500">Quick access</p>
          </div>
          <Download className="w-4 h-4 text-burgundy-400" />
        </button>
        {showIOSGuide && <IOSInstallGuide onClose={() => setShowIOSGuide(false)} />}
      </>
    );
  }

  // Default variant (full button)
  return (
    <>
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`bg-burgundy-600 hover:bg-burgundy-700 text-white ${className}`}
      >
        <Download className="w-4 h-4 mr-2" />
        {isInstalling ? "Installing..." : "Install App"}
      </Button>
      {showIOSGuide && <IOSInstallGuide onClose={() => setShowIOSGuide(false)} />}
    </>
  );
}

// iOS Install Guide Overlay
function IOSInstallGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#722f37] to-[#8b3a42] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Install AccrediPro</h3>
                <p className="text-xs text-white/80">3 quick steps</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 text-burgundy-600 font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">Tap the Share button</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Share className="w-4 h-4 text-blue-500" />
                </div>
                <span>At the bottom of Safari</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 text-burgundy-600 font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">Scroll down and tap</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <Plus className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Add to Home Screen</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 text-burgundy-600 font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">Tap "Add" to confirm</p>
              <p className="text-sm text-gray-500">The app will appear on your home screen</p>
            </div>
          </div>
        </div>

        {/* Arrow pointing down (to Safari share button) */}
        <div className="pb-6 flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-2">Share button is below</p>
          <ChevronDown className="w-6 h-6 text-burgundy-400 animate-bounce" />
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
