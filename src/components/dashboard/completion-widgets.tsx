"use client";

import { DollarSign, TrendingUp, Calendar, Flame, BookOpen, Play, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IncomeProjectionProps {
    progress: number; // 0-100
    hasPro?: boolean;
    className?: string;
}

// Income ranges based on completion + Pro status
const getIncomeProjection = (progress: number, hasPro: boolean) => {
    // Higher income ranges to match reality of successful practitioners
    const baseMin = 5000;  // $5K base
    const baseMax = 10000; // $10K ceiling
    const proMultiplier = hasPro ? 2.5 : 1.0;

    // Scale income with progress (minimum 40% to avoid too low numbers)
    const progressMultiplier = Math.max(0.4, progress / 100);

    const minIncome = Math.round((baseMin * progressMultiplier * proMultiplier) / 1000) * 1000;
    const maxIncome = Math.round((baseMax * progressMultiplier * proMultiplier) / 1000) * 1000;

    return { minIncome, maxIncome };
};

export function IncomeProjectionWidget({ progress, hasPro = false, className }: IncomeProjectionProps) {
    const { minIncome, maxIncome } = getIncomeProjection(progress, hasPro);

    // Format income
    const formatIncome = (amount: number) => {
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount}`;
    };

    return (
        <Card className={cn("bg-gradient-to-br from-gold-500 to-amber-600 border-0 shadow-lg overflow-hidden", className)}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/90">Income Potential</span>
                    </div>
                    {hasPro && (
                        <Badge className="bg-white/20 text-white border-0 text-xs">
                            Pro Boost
                        </Badge>
                    )}
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                        {formatIncome(minIncome)}-{formatIncome(maxIncome)}
                    </span>
                    <span className="text-sm text-white/80">/month</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-xs text-white/70">
                    <TrendingUp className="w-3 h-3" />
                    <span>Based on {Math.round(progress)}% completion</span>
                </div>
            </CardContent>
        </Card>
    );
}

interface DaysCountdownProps {
    enrolledAt: Date;
    lessonsCompleted: number;
    totalLessons: number;
    className?: string;
}

export function DaysCountdownWidget({
    enrolledAt,
    lessonsCompleted,
    totalLessons,
    className
}: DaysCountdownProps) {
    // Calculate progress
    const progress = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
    const remainingLessons = Math.max(0, totalLessons - lessonsCompleted);

    // If all done - celebration!
    if (remainingLessons === 0) {
        return (
            <Card className={cn("bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-lg overflow-hidden", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/90">Certified! 🎉</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">Start Earning Now</span>
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                        $3K-$5K/month awaits!
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Calculate weeks to finish (based on focused 3-5 lessons/day pace)
    // Fast track = 5 lessons/day = ~3-4 weeks for most programs
    const fastTrackDays = Math.ceil(remainingLessons / 5);
    const fastTrackWeeks = Math.max(1, Math.ceil(fastTrackDays / 7));

    // Cap display at 6 weeks (encouraging)
    const displayWeeks = Math.min(fastTrackWeeks, 6);
    const lessonsPerDay = Math.ceil(remainingLessons / (displayWeeks * 7));

    // Get motivational level
    const getMotivationStyle = () => {
        if (progress >= 75) return { gradient: "from-green-500 to-emerald-600", msg: "Almost there!" };
        if (progress >= 50) return { gradient: "from-blue-500 to-blue-600", msg: "Halfway to your new career!" };
        if (progress >= 25) return { gradient: "from-purple-500 to-purple-600", msg: "Making great progress!" };
        return { gradient: "from-burgundy-500 to-burgundy-600", msg: "Your new career starts here" };
    };

    const { gradient, msg } = getMotivationStyle();

    return (
        <Card className={cn(`bg-gradient-to-br ${gradient} border-0 shadow-lg overflow-hidden`, className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Fast Track</span>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold text-white">
                        {displayWeeks === 1 ? "1 week" : `${displayWeeks} weeks`}
                    </span>
                    <span className="text-sm text-white/80">to finish</span>
                </div>

                <p className="text-xs text-white/90 font-medium">
                    → Start earning $5K-$10K/mo
                </p>

                <p className="text-xs text-white/60 mt-1">
                    {lessonsPerDay} lessons/day • {msg}
                </p>
            </CardContent>
        </Card>
    );
}

interface StreakWidgetProps {
    currentStreak: number;
    longestStreak: number;
    className?: string;
}

export function StreakWidget({ currentStreak, longestStreak, className }: StreakWidgetProps) {
    // Get streak tier for styling - all using burgundy/wine tones for brand consistency
    const getStreakStyle = (streak: number) => {
        if (streak >= 30) return { gradient: "from-burgundy-700 to-burgundy-900", label: "Unstoppable!" };
        if (streak >= 14) return { gradient: "from-burgundy-600 to-burgundy-700", label: "On Fire!" };
        if (streak >= 7) return { gradient: "from-burgundy-500 to-burgundy-600", label: "Great Momentum!" };
        if (streak >= 3) return { gradient: "from-burgundy-500 to-burgundy-600", label: "Building Habit!" };
        return { gradient: "from-burgundy-400 to-burgundy-500", label: "Getting Started" };
    };

    const { gradient, label } = getStreakStyle(currentStreak);

    return (
        <Card className={cn(`bg-gradient-to-br ${gradient} border-0 shadow-lg overflow-hidden`, className)}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <Flame className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/90">Learning Streak</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                        {label}
                    </Badge>
                </div>

                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{currentStreak}</span>
                    <span className="text-sm text-white/80">day{currentStreak !== 1 ? "s" : ""}</span>
                </div>

                {longestStreak > currentStreak && (
                    <p className="text-xs text-white/70 mt-2">
                        Best: {longestStreak} days • {longestStreak - currentStreak} to beat!
                    </p>
                )}
                {longestStreak <= currentStreak && currentStreak > 0 && (
                    <p className="text-xs text-white/70 mt-2">
                        🏆 Personal best! Keep it going!
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// Continue Learning Widget - Smart widget showing next lesson
interface ContinueLearningProps {
    lessonTitle: string;
    moduleTitle: string;
    courseTitle: string;
    progress: number; // 0-100
    estimatedMinutes?: number;
    lessonUrl: string;
    className?: string;
}

export function ContinueLearningWidget({
    lessonTitle,
    moduleTitle,
    courseTitle,
    progress,
    estimatedMinutes = 12,
    lessonUrl,
    className
}: ContinueLearningProps) {
    return (
        <Card className={cn("border-2 border-burgundy-200 bg-gradient-to-r from-burgundy-50 via-white to-gold-50 shadow-lg overflow-hidden", className)}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-burgundy-600 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-burgundy-600">Continue Learning</span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                            {lessonTitle}
                        </h3>
                        <p className="text-sm text-gray-500 truncate mb-3">
                            {moduleTitle} • {courseTitle}
                        </p>

                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-burgundy-700 whitespace-nowrap">
                                {Math.round(progress)}%
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href={lessonUrl}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-burgundy-700 hover:to-burgundy-800 transition-all shadow-md hover:shadow-lg group"
                            >
                                <Play className="w-4 h-4" />
                                Continue
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                ~{estimatedMinutes} min
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
