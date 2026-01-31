"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingStep {
    id: string;
    label: string;
    description: string;
    href: string;
    completed: boolean;
}

interface OnboardingData {
    progress: {
        profileComplete: boolean;
        welcomeVideoWatched: boolean;
        goalsSet: boolean;
        firstMessageSent: boolean;
        firstLessonComplete: boolean;
        communityIntro: boolean;
        resourceDownloaded: boolean;
        completedAt: string | null;
    } | null;
    completedCount: number;
    totalSteps: number;
    percentage: number;
    isComplete: boolean;
}

export default function OnboardingChecklist() {
    const [data, setData] = useState<OnboardingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const res = await fetch("/api/onboarding/progress");
            if (!res.ok) return;
            const json = await res.json();
            if (json.progress) {
                setData(json);

                // Celebrate on first 100% completion
                if (json.isComplete && !json.progress.completedAt) {
                    triggerCelebration();
                }
            }
        } catch (error) {
            console.error("Failed to fetch onboarding progress:", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerCelebration = () => {
        setShowCelebration(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8B1538", "#D4AF37", "#1E3A5F"],
        });
        setTimeout(() => setShowCelebration(false), 5000);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data || !data.progress) {
        return null; // Don't show for leads
    }

    // Hide if completed (after celebration)
    if (data.isComplete && data.progress.completedAt && !showCelebration) {
        return null;
    }

    const steps: OnboardingStep[] = [
        {
            id: "profileComplete",
            label: "Complete your profile",
            description: "Add a photo and bio",
            href: "/profile",
            completed: data.progress.profileComplete,
        },
        {
            id: "welcomeVideoWatched",
            label: "Watch welcome video",
            description: "Get started with Sarah",
            href: "/start-here",
            completed: data.progress.welcomeVideoWatched,
        },
        {
            id: "goalsSet",
            label: "Set your goals",
            description: "Income, timeline & motivation",
            href: "/start-here/questions",
            completed: data.progress.goalsSet,
        },
        {
            id: "firstMessageSent",
            label: "Message Coach Sarah",
            description: "Say hello to your mentor",
            href: "/messages",
            completed: data.progress.firstMessageSent,
        },
        {
            id: "firstLessonComplete",
            label: "Complete your first lesson",
            description: "Start learning today",
            href: "/my-courses",
            completed: data.progress.firstLessonComplete,
        },
        {
            id: "communityIntro",
            label: "Introduce yourself",
            description: "Join the community",
            href: "/community/cmkvj0klb0000bim95cl2peji",
            completed: data.progress.communityIntro,
        },
        {
            id: "resourceDownloaded",
            label: "Browse your resources",
            description: "Explore guides & PDFs",
            href: "/my-library",
            completed: data.progress.resourceDownloaded,
        },
    ];

    return (
        <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 rounded-xl border border-burgundy-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                        <h3 className="font-semibold text-white">Getting Started</h3>
                    </div>
                    <span className="text-sm font-medium text-burgundy-100">
                        {data.completedCount}/{data.totalSteps} complete
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-burgundy-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-500 ease-out"
                        style={{ width: `${data.percentage}%` }}
                    />
                </div>
            </div>

            {/* Celebration Banner */}
            {showCelebration && (
                <div className="px-6 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-center">
                    <p className="text-lg font-bold text-burgundy-900">
                        🎉 Congratulations! You're all set up!
                    </p>
                    <p className="text-sm text-burgundy-800 mt-1">
                        You've completed all onboarding steps. Time to accelerate your learning!
                    </p>
                </div>
            )}

            {/* Steps */}
            <div className="p-4 space-y-2">
                {steps.map((step, index) => (
                    <Link
                        key={step.id}
                        href={step.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${step.completed
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-white hover:bg-burgundy-50 border border-gray-100"
                            }`}
                    >
                        {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-400">{index + 1}</span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${step.completed ? "text-green-700 line-through opacity-70" : "text-gray-900"}`}>
                                {step.label}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {step.description}
                            </p>
                        </div>
                        {!step.completed && (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
