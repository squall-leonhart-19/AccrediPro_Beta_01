"use client";

import { useState, useEffect, useRef } from "react";
import { X, Smartphone, Bell, Download, Zap, Wifi, Share, Plus, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function DashboardPWABanner() {
    // PWA Install state
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [justInstalled, setJustInstalled] = useState(false);
    const promptCaptured = useRef(false);

    // Push notifications state
    const {
        isSupported: pushSupported,
        permission,
        isSubscribed,
        isLoading: pushLoading,
        subscribe,
    } = usePushNotifications();

    const [isSubscribing, setIsSubscribing] = useState(false);
    const [justSubscribed, setJustSubscribed] = useState(false);
    const [subscriptionFailed, setSubscriptionFailed] = useState(false);

    // Banner visibility state
    const [isDismissed, setIsDismissed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Check PWA install state
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Check if already installed
        const standalone = window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
        setIsStandalone(standalone);

        // Check if iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
        setIsIOS(iOS);

        // Check if dismissed (7 day cooldown)
        const dismissed = localStorage.getItem("pwa-banner-dismissed");
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                setIsDismissed(true);
                return;
            }
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            if (!promptCaptured.current) {
                promptCaptured.current = true;
                setDeferredPrompt(e as BeforeInstallPromptEvent);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Show banner after short delay for nice animation
        setTimeout(() => setIsVisible(true), 500);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // Handle install click
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
                setJustInstalled(true);
                setDeferredPrompt(null);
            }
        } catch (error) {
            console.error("Install error:", error);
        } finally {
            setIsInstalling(false);
        }
    };

    // Handle notifications click
    const handleEnableNotifications = async () => {
        setIsSubscribing(true);
        setSubscriptionFailed(false); // Reset failed state on retry

        // Create a timeout promise to prevent infinite hang
        const timeoutPromise = new Promise<boolean>((_, reject) =>
            setTimeout(() => reject(new Error("Subscription timeout")), 15000)
        );

        try {
            // Race between subscribe and timeout
            const success = await Promise.race([
                subscribe(),
                timeoutPromise
            ]);

            if (success) {
                setJustSubscribed(true);
            } else {
                // Subscribe returned false (failed but didn't throw)
                setSubscriptionFailed(true);
            }
        } catch (error) {
            console.error("Notification error:", error);
            setSubscriptionFailed(true);
        } finally {
            setIsSubscribing(false);
        }
    };

    // Handle dismiss
    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsDismissed(true);
            localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
        }, 300);
    };

    // Determine what to show
    const canInstall = isIOS || deferredPrompt !== null;
    const needsInstall = !isStandalone && canInstall;
    const needsNotifications = pushSupported && !isSubscribed && permission !== "denied" && !pushLoading;

    // Don't show if dismissed or nothing to show
    if (isDismissed) return null;
    if (isStandalone && (isSubscribed || !pushSupported)) return null;
    if (!needsInstall && !needsNotifications) return null;

    // Both done - hide banner
    if (justInstalled && justSubscribed) {
        setTimeout(() => setIsDismissed(true), 2000);
    }

    return (
        <>
            <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#722f37] via-[#8b3a44] to-[#722f37] border border-[#d4af37]/30 shadow-xl transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
            >
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#d4af37]/5 rounded-full blur-2xl" />
                </div>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors z-10"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#c9a227] flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 pr-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                                🚀 Game Changer!
                            </h3>
                            <p className="text-sm text-white/80">
                                Get the full AccrediPro experience on your device
                            </p>
                        </div>
                    </div>

                    {/* Benefits grid */}
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mb-5">
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                                <Wifi className="w-3 h-3 text-[#d4af37]" />
                            </div>
                            <span>Learn offline anywhere</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-3 h-3 text-[#d4af37]" />
                            </div>
                            <span>Get certificate alerts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                                <Smartphone className="w-3 h-3 text-[#d4af37]" />
                            </div>
                            <span>One-tap from home screen</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                                <Bell className="w-3 h-3 text-[#d4af37]" />
                            </div>
                            <span>Never miss mentor messages</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Install Button */}
                        {needsInstall && !justInstalled && (
                            <Button
                                onClick={handleInstall}
                                disabled={isInstalling}
                                className="flex-1 bg-white hover:bg-gray-100 text-[#722f37] font-semibold h-11 shadow-lg"
                            >
                                {isInstalling ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#722f37]/30 border-t-[#722f37] rounded-full animate-spin mr-2" />
                                        Installing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Install App
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Installed success state */}
                        {justInstalled && (
                            <div className="flex-1 flex items-center justify-center gap-2 bg-white/10 rounded-lg h-11 text-white">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="font-medium">App Installed!</span>
                            </div>
                        )}

                        {/* Notifications Button */}
                        {needsNotifications && !justSubscribed && (
                            <Button
                                onClick={handleEnableNotifications}
                                disabled={isSubscribing}
                                className={`flex-1 font-semibold h-11 shadow-lg ${subscriptionFailed
                                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                                        : "bg-[#d4af37] hover:bg-[#c9a227] text-white"
                                    }`}
                            >
                                {isSubscribing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Enabling...
                                    </>
                                ) : subscriptionFailed ? (
                                    <>
                                        <Bell className="w-4 h-4 mr-2" />
                                        Try Again
                                    </>
                                ) : (
                                    <>
                                        <Bell className="w-4 h-4 mr-2" />
                                        Enable Notifications
                                    </>
                                )}
                            </Button>
                        )}

                        {/* Subscribed success state */}
                        {justSubscribed && (
                            <div className="flex-1 flex items-center justify-center gap-2 bg-white/10 rounded-lg h-11 text-white">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="font-medium">Notifications On!</span>
                            </div>
                        )}
                    </div>

                    {/* Maybe later link */}
                    <div className="mt-3 text-center">
                        <button
                            onClick={handleDismiss}
                            className="text-xs text-white/50 hover:text-white/70 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>

            {/* iOS Install Guide Modal */}
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
                        <div className="w-8 h-8 rounded-full bg-[#722f37]/10 flex items-center justify-center flex-shrink-0 text-[#722f37] font-bold text-sm">
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
                        <div className="w-8 h-8 rounded-full bg-[#722f37]/10 flex items-center justify-center flex-shrink-0 text-[#722f37] font-bold text-sm">
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
                        <div className="w-8 h-8 rounded-full bg-[#722f37]/10 flex items-center justify-center flex-shrink-0 text-[#722f37] font-bold text-sm">
                            3
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-1">Tap &ldquo;Add&rdquo; to confirm</p>
                            <p className="text-sm text-gray-500">The app will appear on your home screen</p>
                        </div>
                    </div>
                </div>

                {/* Arrow pointing down */}
                <div className="pb-4 flex flex-col items-center">
                    <p className="text-xs text-gray-400 mb-2">Share button is below</p>
                    <ChevronDown className="w-6 h-6 text-[#722f37]/50 animate-bounce" />
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <Button onClick={onClose} variant="outline" className="w-full">
                        Got it!
                    </Button>
                </div>
            </div>
        </div>
    );
}
