"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    ChevronLeft,
    X,
    BookOpen,
    Trophy,
    MessageSquare,
    Users,
    Briefcase,
    Map,
    Sparkles,
    CheckCircle,
} from "lucide-react";

interface TourStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    emoji: string;
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to AccrediPro! 🎉",
        description: "Let me show you around. This quick tour will help you get the most out of your learning experience.",
        icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
        emoji: "✨",
    },
    {
        id: "courses",
        title: "Your Courses",
        description: "Access your enrolled courses and continue learning. Track your progress and earn certificates as you complete each course.",
        icon: <BookOpen className="w-6 h-6 text-blue-500" />,
        emoji: "📚",
    },
    {
        id: "roadmap",
        title: "Your Roadmap",
        description: "See your personalized learning path based on your goals. We'll guide you step-by-step to certification.",
        icon: <Map className="w-6 h-6 text-purple-500" />,
        emoji: "🗺️",
    },
    {
        id: "xp",
        title: "XP & Levels",
        description: "Earn XP points as you learn! Complete lessons, read e-books, and engage with the community to level up.",
        icon: <Trophy className="w-6 h-6 text-amber-500" />,
        emoji: "🏆",
    },
    {
        id: "messages",
        title: "Private Mentors Chat",
        description: "Message your personal coach anytime. Get guidance, ask questions, and receive feedback on your journey.",
        icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
        emoji: "💬",
    },
    {
        id: "community",
        title: "Community",
        description: "Connect with fellow coaches and students. Share insights, ask questions, and grow together.",
        icon: <Users className="w-6 h-6 text-pink-500" />,
        emoji: "👥",
    },
    {
        id: "coach-workspace",
        title: "Coach Workspace",
        description: "When you're ready to start coaching, build your practice here. Create your profile, manage clients, and grow your business!",
        icon: <Briefcase className="w-6 h-6 text-burgundy-500" />,
        emoji: "💼",
    },
    {
        id: "done",
        title: "You're All Set!",
        description: "That's the basics! Remember, we're here to support your journey. Let's get started!",
        icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
        emoji: "🚀",
    },
];

interface InteractiveTourProps {
    onComplete: () => void;
    onSkip: () => void;
}

export function InteractiveTour({ onComplete, onSkip }: InteractiveTourProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const step = TOUR_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TOUR_STEPS.length - 1;
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

    const handleNext = () => {
        if (isLast) {
            onComplete();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirst) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <>
            {/* NO blur - just floating card at bottom right */}
            <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1 bg-gray-100">
                        <div
                            className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{step.emoji}</span>
                                <div>
                                    <p className="text-xs text-burgundy-200">Quick Tour</p>
                                    <p className="font-semibold">{step.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={onSkip}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {TOUR_STEPS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentStep(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentStep
                                            ? "bg-burgundy-600 w-4"
                                            : i < currentStep
                                                ? "bg-burgundy-300"
                                                : "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {!isFirst && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleNext}
                                className="bg-burgundy-600 hover:bg-burgundy-700"
                            >
                                {isLast ? (
                                    <>
                                        Start <Sparkles className="w-4 h-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for animation */}
            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </>
    );
}

export default InteractiveTour;
