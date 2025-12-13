"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Flame,
    ChevronLeft,
    Lock,
    CheckCircle2,
    Play,
    Clock,
    Trophy,
    ArrowRight,
    Loader2,
    Sparkles,
    MessageCircle,
} from "lucide-react";

interface ChallengeModule {
    id: string;
    day: number;
    title: string;
    description: string | null;
    videoId: string | null;
    content: string | null;
    actionTask: string | null;
    communityPrompt: string | null;
}

interface ChallengeBadge {
    id: string;
    day: number;
    name: string;
    icon: string;
    description: string | null;
}

interface Challenge {
    id: string;
    title: string;
    slug: string;
    description: string;
    durationDays: number;
    isEnrolled: boolean;
    currentDay: number;
    completedDays: number[];
    unlockedDays: number[];
    startedAt?: Date;
    modules: ChallengeModule[];
    badges: ChallengeBadge[];
}

interface ChallengeDetailClientProps {
    challenge: Challenge;
    userId: string;
}

export function ChallengeDetailClient({ challenge, userId }: ChallengeDetailClientProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>(
        challenge.isEnrolled ? challenge.currentDay : null
    );
    const [completing, setCompleting] = useState(false);
    const [localChallenge, setLocalChallenge] = useState(challenge);
    const [enrolling, setEnrolling] = useState(false);

    const selectedModule = localChallenge.modules.find((m) => m.day === selectedDay);
    const selectedBadge = localChallenge.badges.find((b) => b.day === selectedDay);
    const progressPercent =
        (localChallenge.completedDays.length / localChallenge.durationDays) * 100;

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const res = await fetch("/api/challenges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ challengeId: challenge.id }),
            });
            const data = await res.json();
            if (data.success) {
                setLocalChallenge((prev) => ({
                    ...prev,
                    isEnrolled: true,
                    currentDay: 1,
                    completedDays: [],
                    unlockedDays: [1],
                }));
                setSelectedDay(1);
            }
        } catch (error) {
            console.error("Enroll error:", error);
        } finally {
            setEnrolling(false);
        }
    };

    const handleCompleteDay = async () => {
        if (!selectedDay) return;
        setCompleting(true);
        try {
            const res = await fetch(`/api/challenges/${challenge.id}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ day: selectedDay }),
            });
            const data = await res.json();
            if (data.success) {
                const newCompletedDays = [...localChallenge.completedDays, selectedDay];
                const nextDay = selectedDay + 1;
                setLocalChallenge((prev) => ({
                    ...prev,
                    completedDays: newCompletedDays,
                    currentDay: nextDay,
                    unlockedDays: [...prev.unlockedDays, nextDay].filter(
                        (d) => d <= challenge.durationDays
                    ),
                }));
                // Show celebration
                if (data.data.isComplete) {
                    // Challenge complete!
                }
            }
        } catch (error) {
            console.error("Complete error:", error);
        } finally {
            setCompleting(false);
        }
    };

    const isDayLocked = (day: number) => !localChallenge.unlockedDays.includes(day);
    const isDayCompleted = (day: number) => localChallenge.completedDays.includes(day);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Back Button */}
            <Link
                href="/challenges"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Challenges
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-800 rounded-3xl p-6 md:p-8 mb-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Flame className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{challenge.title}</h1>
                        <p className="text-white/80 mb-4">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {challenge.durationDays} days
                            </span>
                            <span className="flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                {challenge.badges.length} badges to earn
                            </span>
                        </div>
                    </div>
                    {localChallenge.isEnrolled && (
                        <div className="flex flex-col items-end">
                            <div className="text-4xl font-bold">{Math.round(progressPercent)}%</div>
                            <div className="text-white/70 text-sm">Complete</div>
                            <Progress value={progressPercent} className="w-32 h-2 mt-2 bg-white/20" />
                        </div>
                    )}
                </div>
            </div>

            {/* Not Enrolled State */}
            {!localChallenge.isEnrolled && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Flame className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Transform?</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Join this {challenge.durationDays}-day challenge and unlock your potential.
                        New lessons unlock daily at 8 AM.
                    </p>
                    <Button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        size="lg"
                        className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
                    >
                        {enrolling ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Flame className="w-4 h-4 mr-2" />
                        )}
                        Start Challenge Now
                    </Button>
                </div>
            )}

            {/* Main Content */}
            {localChallenge.isEnrolled && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Day Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Your Journey</h3>
                            <div className="space-y-2">
                                {localChallenge.modules.map((module) => {
                                    const locked = isDayLocked(module.day);
                                    const completed = isDayCompleted(module.day);
                                    const isActive = selectedDay === module.day;
                                    const badge = localChallenge.badges.find((b) => b.day === module.day);

                                    return (
                                        <button
                                            key={module.id}
                                            onClick={() => !locked && setSelectedDay(module.day)}
                                            disabled={locked}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                                                isActive && "bg-burgundy-50 border-2 border-burgundy-200",
                                                !isActive && !locked && "hover:bg-gray-50",
                                                locked && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                                    completed
                                                        ? "bg-green-100 text-green-600"
                                                        : locked
                                                            ? "bg-gray-100 text-gray-400"
                                                            : isActive
                                                                ? "bg-burgundy-600 text-white"
                                                                : "bg-gray-100 text-gray-600"
                                                )}
                                            >
                                                {completed ? (
                                                    <CheckCircle2 className="w-5 h-5" />
                                                ) : locked ? (
                                                    <Lock className="w-4 h-4" />
                                                ) : (
                                                    <span className="font-bold">{module.day}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {module.title}
                                                </p>
                                                <p className="text-xs text-gray-500">Day {module.day}</p>
                                            </div>
                                            {badge && completed && (
                                                <span className="text-lg">{badge.icon}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Badges Gallery */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Badges Earned</h4>
                                <div className="flex flex-wrap gap-2">
                                    {localChallenge.badges.map((badge) => {
                                        const earned = isDayCompleted(badge.day);
                                        return (
                                            <div
                                                key={badge.id}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
                                                    earned
                                                        ? "bg-gold-100 border-2 border-gold-300"
                                                        : "bg-gray-100 grayscale opacity-40"
                                                )}
                                                title={badge.name}
                                            >
                                                {badge.icon}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Day Content */}
                    <div className="lg:col-span-2">
                        {selectedModule ? (
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Video */}
                                {selectedModule.videoId && (
                                    <div className="aspect-video bg-gray-900">
                                        <iframe
                                            src={`https://fast.wistia.net/embed/iframe/${selectedModule.videoId}`}
                                            allowFullScreen
                                            className="w-full h-full"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                                            Day {selectedModule.day}
                                        </Badge>
                                        {selectedBadge && (
                                            <Badge className="bg-gold-100 text-gold-700 border-0">
                                                {selectedBadge.icon} {selectedBadge.name}
                                            </Badge>
                                        )}
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {selectedModule.title}
                                    </h2>

                                    {selectedModule.description && (
                                        <p className="text-gray-600 mb-6">{selectedModule.description}</p>
                                    )}

                                    {selectedModule.content && (
                                        <div
                                            className="prose prose-burgundy max-w-none mb-6"
                                            dangerouslySetInnerHTML={{ __html: selectedModule.content }}
                                        />
                                    )}

                                    {/* Action Task */}
                                    {selectedModule.actionTask && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-6">
                                            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                                                <Sparkles className="w-5 h-5" />
                                                Today's Action Task
                                            </h3>
                                            <p className="text-blue-800">{selectedModule.actionTask}</p>
                                        </div>
                                    )}

                                    {/* Community Prompt */}
                                    {selectedModule.communityPrompt && (
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5 mb-6">
                                            <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                                                <MessageCircle className="w-5 h-5" />
                                                Share with the Community
                                            </h3>
                                            <p className="text-purple-800">{selectedModule.communityPrompt}</p>
                                        </div>
                                    )}

                                    {/* Complete Button */}
                                    {!isDayCompleted(selectedModule.day) && (
                                        <Button
                                            onClick={handleCompleteDay}
                                            disabled={completing}
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        >
                                            {completing ? (
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                            )}
                                            Complete Day {selectedModule.day}
                                        </Button>
                                    )}

                                    {isDayCompleted(selectedModule.day) && (
                                        <div className="flex items-center justify-center gap-2 py-4 text-green-600 font-medium">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Day {selectedModule.day} Completed!
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                                <p className="text-gray-500">Select a day to begin</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
