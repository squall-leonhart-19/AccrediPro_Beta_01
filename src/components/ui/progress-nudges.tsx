"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    X,
    BookOpen,
    Trophy,
    Flame,
    Target,
    Star,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Zap,
    Gift,
    Clock,
    CheckCircle2
} from "lucide-react";

// Types for nudges
interface Nudge {
    id: string;
    type: "progress" | "streak" | "recommendation" | "completion" | "challenge";
    title: string;
    message: string;
    progress?: number;
    action?: {
        label: string;
        link: string;
    };
    icon: React.ReactNode;
    color: string;
    dismissable?: boolean;
}

// Mock nudges based on user activity
const generateNudges = (): Nudge[] => {
    const nudges: Nudge[] = [];

    // Course progress nudge
    nudges.push({
        id: "course-progress",
        type: "progress",
        title: "🎓 You're 60% to Certified Health Coach!",
        message: "Complete 2 more lessons this week to stay on track",
        progress: 60,
        action: { label: "Continue Learning", link: "/my-courses" },
        icon: <BookOpen className="w-5 h-5" />,
        color: "purple",
        dismissable: false,
    });

    // Streak nudge
    nudges.push({
        id: "streak-reminder",
        type: "streak",
        title: "🔥 7-Day Streak! Keep it going!",
        message: "You're on fire! Login tomorrow to maintain your streak",
        action: { label: "View XP", link: "/gamification" },
        icon: <Flame className="w-5 h-5" />,
        color: "orange",
        dismissable: true,
    });

    // Recommendation nudge
    nudges.push({
        id: "recommendation",
        type: "recommendation",
        title: "📚 Recommended for You",
        message: "Based on your progress, you might enjoy the Gut Health Specialist course",
        action: { label: "View Course", link: "/courses" },
        icon: <Sparkles className="w-5 h-5" />,
        color: "blue",
        dismissable: true,
    });

    // Profile completion
    nudges.push({
        id: "profile-complete",
        type: "completion",
        title: "✨ Complete Your Coach Profile",
        message: "Add a bio and specializations to look more professional",
        progress: 40,
        action: { label: "Complete Profile", link: "/coach/workspace" },
        icon: <Star className="w-5 h-5" />,
        color: "emerald",
        dismissable: true,
    });

    return nudges;
};

interface ProgressNudgesProps {
    maxDisplay?: number;
    variant?: "card" | "banner";
}

export function ProgressNudges({ maxDisplay = 2, variant = "card" }: ProgressNudgesProps) {
    const [nudges, setNudges] = useState<Nudge[]>([]);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    useEffect(() => {
        // Load dismissed nudges from localStorage
        const stored = localStorage.getItem("dismissed-nudges");
        if (stored) {
            setDismissedIds(JSON.parse(stored));
        }
        setNudges(generateNudges());
    }, []);

    const dismissNudge = (id: string) => {
        const updated = [...dismissedIds, id];
        setDismissedIds(updated);
        localStorage.setItem("dismissed-nudges", JSON.stringify(updated));
    };

    const visibleNudges = nudges
        .filter(n => !dismissedIds.includes(n.id))
        .slice(0, maxDisplay);

    if (visibleNudges.length === 0) return null;

    if (variant === "banner") {
        const nudge = visibleNudges[0];
        return (
            <div className={`bg-gradient-to-r from-${nudge.color}-500 to-${nudge.color}-600 rounded-xl p-4 text-white mb-6`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            {nudge.icon}
                        </div>
                        <div>
                            <p className="font-semibold">{nudge.title}</p>
                            <p className="text-sm text-white/80">{nudge.message}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {nudge.action && (
                            <a href={nudge.action.link}>
                                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                                    {nudge.action.label} <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </a>
                        )}
                        {nudge.dismissable && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8"
                                onClick={() => dismissNudge(nudge.id)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
                {nudge.progress !== undefined && (
                    <div className="mt-3">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all"
                                style={{ width: `${nudge.progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6">
            {visibleNudges.map((nudge) => (
                <div
                    key={nudge.id}
                    className={`bg-gradient-to-r from-${nudge.color}-50 to-${nudge.color}-100 border border-${nudge.color}-200 rounded-xl p-4`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 bg-${nudge.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-${nudge.color}-600`}>{nudge.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-gray-900">{nudge.title}</p>
                                    <p className="text-sm text-gray-600 mt-0.5">{nudge.message}</p>
                                </div>
                                {nudge.dismissable && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-gray-600 flex-shrink-0 h-6 w-6"
                                        onClick={() => dismissNudge(nudge.id)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {nudge.progress !== undefined && (
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className={`text-${nudge.color}-700 font-medium`}>{nudge.progress}% complete</span>
                                    </div>
                                    <Progress value={nudge.progress} className="h-2" />
                                </div>
                            )}

                            {nudge.action && (
                                <a href={nudge.action.link} className="inline-block mt-3">
                                    <Button
                                        size="sm"
                                        className={`bg-${nudge.color}-600 hover:bg-${nudge.color}-700 h-8`}
                                    >
                                        {nudge.action.label} <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Compact inline nudge for sidebar or small spaces
export function InlineNudge() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 text-white text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>60% to certification!</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-white/60 hover:text-white"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>
            <a href="/my-courses" className="block mt-2 text-xs text-white/80 hover:text-white">
                Continue learning →
            </a>
        </div>
    );
}

export default ProgressNudges;
