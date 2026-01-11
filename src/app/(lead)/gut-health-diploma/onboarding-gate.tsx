"use client";

import { useState, useEffect } from "react";
import { WelcomeVideoStep } from "@/components/lead-portal/WelcomeVideoStep";
import { OnboardingQuestionsStep } from "@/components/lead-portal/OnboardingQuestionsStep";
import { LeadStepChecklist } from "@/components/lead-portal/LeadStepChecklist";

interface OnboardingGateProps {
    firstName: string;
    userAvatar?: string | null;
    watchedVideo: boolean;
    completedQuestions: boolean;
    completedLessons: number[];
    children: React.ReactNode;
}

export function OnboardingGate({
    firstName,
    userAvatar,
    watchedVideo: initialWatchedVideo,
    completedQuestions: initialCompletedQuestions,
    completedLessons,
    children,
}: OnboardingGateProps) {
    const [watchedVideo, setWatchedVideo] = useState(initialWatchedVideo);
    const [completedQuestions, setCompletedQuestions] = useState(initialCompletedQuestions);
    const [isLoading, setIsLoading] = useState(false);

    // Build 12 steps for the sidebar checklist
    const steps = [
        { id: 1, title: "Watch Welcome Video", completed: watchedVideo },
        { id: 2, title: "Tell Us About You", completed: completedQuestions },
        { id: 3, title: "Lesson 1: Meet Your Hormones", completed: completedLessons.includes(1) },
        { id: 4, title: "Lesson 2: The Monthly Dance", completed: completedLessons.includes(2) },
        { id: 5, title: "Lesson 3: When Hormones Go Rogue", completed: completedLessons.includes(3) },
        { id: 6, title: "Lesson 4: The Gut-Hormone Axis", completed: completedLessons.includes(4) },
        { id: 7, title: "Lesson 5: Thyroid & Energy", completed: completedLessons.includes(5) },
        { id: 8, title: "Lesson 6: Stress & Your Adrenals", completed: completedLessons.includes(6) },
        { id: 9, title: "Lesson 7: Food as Medicine", completed: completedLessons.includes(7) },
        { id: 10, title: "Lesson 8: Life Stage Support", completed: completedLessons.includes(8) },
        { id: 11, title: "Lesson 9: Your Next Step", completed: completedLessons.includes(9) },
        { id: 12, title: "Claim Certificate & Review", completed: completedLessons.length === 9 },
    ];

    const completedCount = steps.filter((s) => s.completed).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    // Calculate current step
    let currentStep = 1;
    if (watchedVideo && !completedQuestions) currentStep = 2;
    else if (watchedVideo && completedQuestions) {
        // Find first incomplete lesson
        for (let i = 1; i <= 9; i++) {
            if (!completedLessons.includes(i)) {
                currentStep = i + 2;
                break;
            }
        }
        if (completedLessons.length === 9) currentStep = 12;
    }

    const handleVideoComplete = () => {
        setWatchedVideo(true);
    };

    const handleQuestionsComplete = () => {
        setCompletedQuestions(true);
    };

    // Step 1: Must watch video first
    if (!watchedVideo) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="mb-8">
                        <LeadStepChecklist
                            steps={steps}
                            currentStep={1}
                            progress={progress}
                            lessonBaseUrl="/gut-health-diploma/lesson"
                        />
                    </div>
                    <WelcomeVideoStep
                        onComplete={handleVideoComplete}
                        isCompleted={false}
                        firstName={firstName}
                    />
                </div>
            </div>
        );
    }

    // Step 2: Must complete questions
    if (!completedQuestions) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="mb-8">
                        <LeadStepChecklist
                            steps={steps}
                            currentStep={2}
                            progress={progress}
                            lessonBaseUrl="/gut-health-diploma/lesson"
                        />
                    </div>
                    <OnboardingQuestionsStep
                        onComplete={handleQuestionsComplete}
                        isCompleted={false}
                        firstName={firstName}
                        userAvatar={userAvatar}
                    />
                </div>
            </div>
        );
    }

    // Steps 3-12: Show lessons (pass through to original content)
    // But add the step checklist as a collapsible sidebar or header
    return (
        <>
            {/* Progress Summary Banner */}
            <div className="bg-burgundy-600 text-white py-3 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-sm">Your Progress</div>
                        <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-400 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="text-sm font-bold">{progress}%</div>
                    </div>
                    <div className="text-sm text-burgundy-200">
                        {completedCount}/{steps.length} steps completed
                    </div>
                </div>
            </div>
            {children}
        </>
    );
}
