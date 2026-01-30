"use client";

import { useEffect, useState } from "react";
import { Clock, Flame, AlertTriangle, Trophy, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompletionUrgencyBannerProps {
    /** Current lesson number */
    currentLesson: number;
    /** Total lessons */
    totalLessons: number;
    /** Hours remaining until access expires (optional) */
    hoursRemaining?: number;
    /** Callback when user clicks to continue */
    onContinue: () => void;
    /** User's first name */
    firstName?: string;
    /** Whether to show as a fixed banner or inline */
    variant?: "banner" | "inline" | "modal-trigger";
}

// Format time remaining
function formatTimeRemaining(hours: number): string {
    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) {
        return `${h} hour${h !== 1 ? "s" : ""}`;
    }
    return `${h}h ${m}m`;
}

export function CompletionUrgencyBanner({
    currentLesson,
    totalLessons,
    hoursRemaining,
    onContinue,
    firstName = "there",
    variant = "inline",
}: CompletionUrgencyBannerProps) {
    const [pulseAnimation, setPulseAnimation] = useState(false);
    const lessonsRemaining = totalLessons - currentLesson;
    const progressPercent = Math.round((currentLesson / totalLessons) * 100);
    const minutesRemaining = lessonsRemaining * 7; // ~7 min per lesson

    // Determine urgency level
    const isVeryClose = lessonsRemaining <= 2;
    const isClose = lessonsRemaining <= 4;

    // Pulse animation for urgency
    useEffect(() => {
        if (hoursRemaining && hoursRemaining < 6) {
            const interval = setInterval(() => {
                setPulseAnimation(prev => !prev);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [hoursRemaining]);

    if (variant === "banner") {
        return (
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-40 px-4 py-3 shadow-lg transition-all",
                    isVeryClose
                        ? "bg-gradient-to-r from-green-600 to-green-500"
                        : "bg-gradient-to-r from-[#722f37] to-[#9a4a54]"
                )}
            >
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white">
                        {isVeryClose ? (
                            <Trophy className="w-6 h-6" />
                        ) : (
                            <Flame className="w-6 h-6" />
                        )}
                        <div>
                            <p className="font-bold">
                                {isVeryClose
                                    ? `Almost there, ${firstName}! Only ${lessonsRemaining} lesson${lessonsRemaining === 1 ? "" : "s"} left!`
                                    : `${progressPercent}% complete — keep the momentum!`}
                            </p>
                            <p className="text-sm text-white/80">
                                {minutesRemaining} minutes to your certificate
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={onContinue}
                        className="bg-white text-[#722f37] hover:bg-gray-100 font-bold px-6"
                    >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // Inline card variant
    return (
        <div
            className={cn(
                "rounded-2xl overflow-hidden transition-all",
                pulseAnimation && hoursRemaining && hoursRemaining < 6 && "ring-2 ring-red-400"
            )}
            style={{
                background: isVeryClose
                    ? "linear-gradient(135deg, #065f46 0%, #059669 100%)"
                    : "linear-gradient(135deg, #722f37 0%, #9a4a54 100%)",
            }}
        >
            <div className="p-6 text-white">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        {isVeryClose ? (
                            <Trophy className="w-6 h-6" />
                        ) : (
                            <Zap className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-black">
                            {isVeryClose
                                ? `🏁 ${firstName}, You're So Close!`
                                : `⚡ Keep Going, ${firstName}!`}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {progressPercent}% done — {lessonsRemaining} lesson{lessonsRemaining !== 1 ? "s" : ""} left
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black">{lessonsRemaining}</p>
                        <p className="text-xs text-white/70">Lessons Left</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-2xl font-black">{minutesRemaining}m</p>
                        <p className="text-xs text-white/70">To Certificate</p>
                    </div>
                </div>

                {/* Social proof message */}
                <div className="bg-white/10 rounded-xl p-3 mb-4 text-center text-sm">
                    <p>
                        <strong>89% of people who reach Module 7 finish.</strong>
                        <br />
                        Don't be the 11% who give up this close!
                    </p>
                </div>

                {/* Access expiry warning (if applicable) */}
                {hoursRemaining && hoursRemaining < 24 && (
                    <div
                        className={cn(
                            "flex items-center gap-2 p-3 rounded-xl mb-4",
                            hoursRemaining < 6 ? "bg-red-500/30" : "bg-yellow-500/30"
                        )}
                    >
                        <AlertTriangle className="w-5 h-5" />
                        <p className="text-sm">
                            <strong>Access expires in {formatTimeRemaining(hoursRemaining)}</strong>
                            {hoursRemaining < 12 && " — finish now or restart from Module 1!"}
                        </p>
                    </div>
                )}

                {/* CTA */}
                <Button
                    onClick={onContinue}
                    className="w-full h-14 text-lg font-bold bg-white text-[#722f37] hover:bg-gray-100 rounded-xl shadow-lg"
                >
                    Finish Now — {minutesRemaining} min remaining
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}
