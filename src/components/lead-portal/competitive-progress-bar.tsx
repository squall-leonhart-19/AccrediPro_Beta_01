"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompetitiveProgressBarProps {
    /** Current progress percentage (0-100) */
    progress: number;
    /** Number of completed lessons */
    lessonsCompleted: number;
    /** Total lessons */
    totalLessons: number;
    /** User's first name for personalization */
    firstName?: string;
    /** Style variant */
    variant?: "default" | "compact" | "celebration";
}

// Messages based on progress milestones
function getProgressMessage(progress: number): {
    message: string;
    percentile: number;
    emoji: string;
} {
    if (progress === 0) {
        return { message: "Ready to start your journey!", percentile: 0, emoji: "🚀" };
    }
    if (progress < 25) {
        return { message: "Great start! You're building momentum.", percentile: 45, emoji: "💪" };
    }
    if (progress < 50) {
        return { message: "Making great progress!", percentile: 58, emoji: "🔥" };
    }
    if (progress < 75) {
        return { message: "Over halfway there!", percentile: 67, emoji: "⭐" };
    }
    if (progress < 100) {
        return { message: "Almost at the finish line!", percentile: 89, emoji: "🏆" };
    }
    return { message: "You did it! Certificate unlocked!", percentile: 100, emoji: "🎉" };
}

export function CompetitiveProgressBar({
    progress,
    lessonsCompleted,
    totalLessons,
    firstName = "there",
    variant = "default",
}: CompetitiveProgressBarProps) {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const { message, percentile, emoji } = getProgressMessage(progress);

    // Animate progress on mount and when it changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 100);
        return () => clearTimeout(timeout);
    }, [progress]);

    // Show celebration animation when reaching milestones
    useEffect(() => {
        if (progress === 33 || progress === 66 || progress === 100) {
            setShowCelebration(true);
            const timeout = setTimeout(() => setShowCelebration(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [progress]);

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${animatedProgress}%`,
                            background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                        }}
                    />
                </div>
                <span className="text-sm font-bold text-[#722f37]">{progress}%</span>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative rounded-2xl p-6 overflow-hidden transition-all",
                showCelebration && "ring-2 ring-yellow-400 ring-offset-2"
            )}
            style={{
                background: "linear-gradient(135deg, #fdf8f0 0%, #fff 100%)",
                border: "1px solid #e5e7eb",
            }}
        >
            {/* Celebration overlay */}
            {showCelebration && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-4 text-2xl animate-bounce">🎉</div>
                    <div className="absolute top-2 right-4 text-2xl animate-bounce delay-100">⭐</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce delay-200">🔥</div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#722f3715" }}
                    >
                        <Trophy className="w-5 h-5 text-[#722f37]" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">Your Progress</p>
                        <p className="text-sm text-gray-500">{lessonsCompleted} of {totalLessons} lessons</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-[#722f37]">{progress}%</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${animatedProgress}%`,
                        background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #d4af37 100%)",
                    }}
                />
                {/* Milestone markers */}
                <div className="absolute inset-0 flex items-center">
                    <div className="absolute left-1/3 w-0.5 h-full bg-white/50" />
                    <div className="absolute left-2/3 w-0.5 h-full bg-white/50" />
                </div>
            </div>

            {/* Social Proof Message */}
            {percentile > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                        <span className="font-bold">You're ahead of {percentile}% of enrollees!</span>
                        {" "}Keep going, {firstName}!
                    </p>
                </div>
            )}

            {/* Motivation Message */}
            <div className="mt-3 text-center text-sm text-gray-600">
                <span className="mr-1">{emoji}</span>
                {message}
            </div>

            {/* Unlock Preview (if not complete) */}
            {progress < 100 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Unlock at 100%:</span>
                    </div>
                    <span className="font-medium text-gray-900">Your Certificate + Bonus Guide</span>
                </div>
            )}
        </div>
    );
}
