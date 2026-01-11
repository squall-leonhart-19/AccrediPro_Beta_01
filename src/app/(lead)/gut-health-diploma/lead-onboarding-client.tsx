"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Play,
    CheckCircle,
    Lock,
    Trophy,
    Sparkles,
    ArrowRight,
    Star,
    Clock,
} from "lucide-react";
import { WelcomeVideoStep } from "@/components/lead-portal/WelcomeVideoStep";
import { OnboardingQuestionsStep } from "@/components/lead-portal/OnboardingQuestionsStep";

interface Step {
    id: number;
    title: string;
    completed: boolean;
}

interface LeadOnboardingClientProps {
    firstName: string;
    userAvatar?: string | null;
    watchedVideo: boolean;
    completedQuestions: boolean;
    completedLessons: number[];
    steps: Step[];
    currentStep: number;
    progress: number;
    isTestUser: boolean;
}

export function LeadOnboardingClient({
    firstName,
    userAvatar,
    watchedVideo: initialWatchedVideo,
    completedQuestions: initialCompletedQuestions,
    completedLessons,
    steps: initialSteps,
    currentStep: initialCurrentStep,
    progress: initialProgress,
    isTestUser,
}: LeadOnboardingClientProps) {
    const [watchedVideo, setWatchedVideo] = useState(initialWatchedVideo);
    const [completedQuestions, setCompletedQuestions] = useState(initialCompletedQuestions);
    const [currentStep, setCurrentStep] = useState(initialCurrentStep);

    // Recalculate steps and progress when state changes
    const steps = initialSteps.map((s, i) => {
        if (s.id === 1) return { ...s, completed: watchedVideo };
        if (s.id === 2) return { ...s, completed: completedQuestions };
        return s;
    });

    const stepsCompleted = steps.filter((s) => s.completed).length;
    const progress = Math.round((stepsCompleted / 12) * 100);

    const handleVideoComplete = () => {
        setWatchedVideo(true);
        setCurrentStep(2);
    };

    const handleQuestionsComplete = () => {
        setCompletedQuestions(true);
        setCurrentStep(3);
    };

    // Render current step content
    const renderStepContent = () => {
        // Step 1: Welcome Video
        if (!watchedVideo) {
            return (
                <WelcomeVideoStep
                    onComplete={handleVideoComplete}
                    isCompleted={false}
                    firstName={firstName}
                />
            );
        }

        // Step 2: Onboarding Questions
        if (!completedQuestions) {
            return (
                <OnboardingQuestionsStep
                    onComplete={handleQuestionsComplete}
                    isCompleted={false}
                    firstName={firstName}
                    userAvatar={userAvatar}
                />
            );
        }

        // Steps 3-12: Show lesson list
        const isAllLessonsComplete = completedLessons.length === 9;

        return (
            <div className="space-y-4">
                {/* Completion CTA or Next Lesson */}
                {isAllLessonsComplete ? (
                    <Card className="border-0 shadow-xl bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
                        <CardContent className="p-6 text-center">
                            <Trophy className="w-12 h-12 mx-auto mb-4 text-gold-400" />
                            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                            <p className="text-burgundy-200 mb-4">
                                You&apos;ve completed all 9 lessons!
                            </p>
                            <Link href="/womens-health-diploma/complete">
                                <Button size="lg" className="bg-white text-burgundy-600 hover:bg-burgundy-50">
                                    Claim Your Certificate
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-burgundy-200 text-sm">Continue Learning</p>
                                    <h3 className="text-lg font-bold text-white">
                                        Lesson {currentStep - 2}: {steps[currentStep - 1]?.title.replace(/Lesson \d+: /, "")}
                                    </h3>
                                </div>
                                <Link href={`/womens-health-diploma/lesson/${currentStep - 2}`}>
                                    <Button className="bg-white text-burgundy-600 hover:bg-burgundy-50">
                                        Start <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lesson List */}
                <Card className="shadow-lg">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lessonNum) => {
                                const isCompleted = completedLessons.includes(lessonNum);
                                const stepIndex = lessonNum + 1; // steps array index (0-based, +2 offset for video/questions)
                                const lessonTitle = steps[stepIndex]?.title.replace(/Lesson \d+: /, "") || `Lesson ${lessonNum}`;
                                const isNext = currentStep === lessonNum + 2;
                                const prevCompleted = lessonNum === 1 || completedLessons.includes(lessonNum - 1);
                                const isLocked = !isCompleted && !prevCompleted;

                                return (
                                    <div
                                        key={lessonNum}
                                        className={`flex items-center gap-4 p-3 rounded-lg ${isCompleted
                                            ? "bg-emerald-50"
                                            : isNext
                                                ? "bg-burgundy-50 ring-2 ring-burgundy-400"
                                                : isLocked
                                                    ? "bg-gray-50 opacity-60"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted
                                                ? "bg-emerald-500 text-white"
                                                : isNext
                                                    ? "bg-burgundy-600 text-white"
                                                    : isLocked
                                                        ? "bg-gray-200 text-gray-400"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : lessonNum}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-medium ${isCompleted ? "text-emerald-700" : isLocked ? "text-gray-400" : "text-gray-900"}`}>
                                                {lessonTitle}
                                            </h4>
                                            {isNext && <p className="text-xs text-burgundy-600 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Up next</p>}
                                        </div>
                                        <div>
                                            {isCompleted ? (
                                                <Link href={`/womens-health-diploma/lesson/${lessonNum}`}>
                                                    <Button size="sm" variant="ghost" className="text-emerald-600">
                                                        <Star className="w-4 h-4 mr-1" /> Review
                                                    </Button>
                                                </Link>
                                            ) : isNext ? (
                                                <Link href={`/womens-health-diploma/lesson/${lessonNum}`}>
                                                    <Button size="sm" className="bg-burgundy-600 text-white">
                                                        <Play className="w-4 h-4 mr-1" /> Start
                                                    </Button>
                                                </Link>
                                            ) : isLocked ? (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Lock className="w-3 h-3" /> Locked
                                                </span>
                                            ) : (
                                                <Link href={`/womens-health-diploma/lesson/${lessonNum}`}>
                                                    <Button size="sm" variant="outline">Start</Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    // Test user buttons
    const handleCompleteAll = async () => {
        const res = await fetch("/api/lead-onboarding/test-complete", { method: "POST" });
        if (res.ok) window.location.reload();
    };

    const handleReset = async () => {
        const res = await fetch("/api/lead-onboarding/test-complete", { method: "DELETE" });
        if (res.ok) window.location.reload();
    };

    return (
        <div className="p-4 md:p-6">
            {/* Hero Header with Sarah */}
            <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-burgundy-400/20 rounded-full blur-2xl" />

                <div className="relative flex items-start gap-4">
                    {/* Sarah Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                            <img
                                src="/coaches/sarah-coach.webp"
                                alt="Sarah"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="flex-1">
                        <p className="text-burgundy-200 text-sm mb-1">Coach Sarah</p>
                        <h1 className="text-xl font-bold mb-2">
                            Hey {firstName}! 👋 Welcome back!
                        </h1>
                        <p className="text-burgundy-100 text-sm mb-4">
                            {progress === 0
                                ? "Ready to take your first step towards becoming a certified women's health practitioner?"
                                : progress < 50
                                    ? "You're making great progress! Keep going - your first client could be weeks away."
                                    : progress < 100
                                        ? "You're almost there! Complete your diploma to start earning $3-5K/month."
                                        : "Amazing! You've completed your journey. Time to claim your certificate!"}
                        </p>

                        {/* Income Badge */}
                        <div className="flex items-center gap-3">
                            <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Path to $3-5K/month
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20">
                                <Trophy className="w-3 h-3 mr-1" />
                                {stepsCompleted}/12 Steps
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-burgundy-200">Your Mini Diploma Journey</span>
                        <span className="text-sm font-bold text-gold-300">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/20" />
                </div>
            </div>

            {/* Step Progress - Motivating Milestones */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900">Your Journey to $3-5K/month</h2>
                    <span className="text-sm font-bold text-burgundy-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${watchedVideo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {watchedVideo ? "✓" : "○"} Meet Sarah
                    </span>
                    <span className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${completedQuestions ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {completedQuestions ? "✓" : "○"} Your Why
                    </span>
                    <span className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${completedLessons.length >= 3 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {completedLessons.length >= 3 ? "✓" : "○"} $1K Foundation
                    </span>
                    <span className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${completedLessons.length >= 6 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                        {completedLessons.length >= 6 ? "✓" : "○"} $3K Skills
                    </span>
                    <span className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${completedLessons.length >= 9 ? "bg-gold-100 text-gold-700 font-bold" : "bg-gray-100 text-gray-400"}`}>
                        {completedLessons.length >= 9 ? "🎉" : "○"} $5K Ready!
                    </span>
                </div>
            </div>

            {/* Main Content */}
            {renderStepContent()}
        </div>
    );
}
