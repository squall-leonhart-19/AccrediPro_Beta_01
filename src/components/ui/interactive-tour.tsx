"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
    GraduationCap,
    Target,
    Library,
    Award,
    Flame,
    MousePointerClick,
    Home,
} from "lucide-react";

interface TourStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    emoji: string;
    targetSelector?: string; // CSS selector for the element to highlight
    position: "center" | "bottom-right" | "top-left" | "top-right" | "bottom-left";
    action?: "click" | "hover" | "none";
    actionText?: string;
    navigateTo?: string; // Optional navigation after step
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to AccrediPro Academy! 🎉",
        description: "Let me give you a quick interactive tour of your new learning platform. I'll show you exactly where everything is!",
        icon: <Sparkles className="w-6 h-6 text-gold-500" />,
        emoji: "✨",
        position: "center",
        action: "none",
    },
    {
        id: "dashboard",
        title: "Your Dashboard",
        description: "This is your home base! You'll see your courses, progress, and personalized next steps here. Click 'Dashboard' in the sidebar anytime to return here.",
        icon: <Home className="w-6 h-6 text-blue-500" />,
        emoji: "🏠",
        targetSelector: "[data-tour='dashboard']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Dashboard in the sidebar",
    },
    {
        id: "courses",
        title: "My Courses",
        description: "Access all your enrolled courses here. Track your progress, continue lessons, and earn certificates as you complete each course.",
        icon: <BookOpen className="w-6 h-6 text-burgundy-500" />,
        emoji: "📚",
        targetSelector: "[data-tour='my-courses']",
        position: "bottom-right",
        action: "click",
        actionText: "Click My Courses",
    },
    {
        id: "roadmap",
        title: "Your Career Roadmap",
        description: "See your personalized learning path from beginner to certified practitioner. We'll guide you step-by-step to your goals!",
        icon: <Map className="w-6 h-6 text-purple-500" />,
        emoji: "🗺️",
        targetSelector: "[data-tour='roadmap']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Roadmap",
    },
    {
        id: "challenges",
        title: "7-Day Challenge",
        description: "Start your journey with our FREE 7-day activation challenge! It's the perfect way to experience the platform and kickstart your learning.",
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        emoji: "🔥",
        targetSelector: "[data-tour='challenges']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Challenges",
    },
    {
        id: "library",
        title: "My Library",
        description: "Access FREE e-books, guides, and resources here. Unlock more content as you progress through your courses!",
        icon: <Library className="w-6 h-6 text-emerald-500" />,
        emoji: "📖",
        targetSelector: "[data-tour='my-library']",
        position: "bottom-right",
        action: "click",
        actionText: "Click My Library",
    },
    {
        id: "messages",
        title: "Coach Mentorship",
        description: "Your personal coach is just a message away! Ask questions, get feedback, and receive guidance on your journey.",
        icon: <MessageSquare className="w-6 h-6 text-teal-500" />,
        emoji: "💬",
        targetSelector: "[data-tour='messages']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Messages",
    },
    {
        id: "community",
        title: "Student Community",
        description: "Connect with 500+ fellow students! Share wins, ask questions, and learn together in our supportive community.",
        icon: <Users className="w-6 h-6 text-pink-500" />,
        emoji: "👥",
        targetSelector: "[data-tour='community']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Community",
    },
    {
        id: "gamification",
        title: "XP & Achievements",
        description: "Earn XP points, unlock badges, and level up as you learn! See how you rank on the leaderboard.",
        icon: <Trophy className="w-6 h-6 text-amber-500" />,
        emoji: "🏆",
        targetSelector: "[data-tour='gamification']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Gamification",
    },
    {
        id: "certificates",
        title: "Your Certificates",
        description: "View and download your earned certificates here. Share your achievements with the world!",
        icon: <Award className="w-6 h-6 text-gold-500" />,
        emoji: "🎓",
        targetSelector: "[data-tour='certificates']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Certificates",
    },
    {
        id: "career-center",
        title: "Career Center",
        description: "Ready to start your practice? Find tools, templates, and resources to launch your coaching career!",
        icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
        emoji: "💼",
        targetSelector: "[data-tour='career-center']",
        position: "bottom-right",
        action: "click",
        actionText: "Click Career Center",
    },
    {
        id: "done",
        title: "You're All Set! 🚀",
        description: "That's the tour! You're ready to start your journey to becoming a certified health practitioner. Let's begin!",
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        emoji: "🎉",
        position: "center",
        action: "none",
    },
];

interface InteractiveTourProps {
    onComplete: () => void;
    onSkip: () => void;
    userId?: string;
}

export function InteractiveTour({ onComplete, onSkip, userId }: InteractiveTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
    const router = useRouter();

    const step = TOUR_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TOUR_STEPS.length - 1;
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

    // Find and highlight the target element
    const updateHighlight = useCallback(() => {
        if (step.targetSelector) {
            const element = document.querySelector(step.targetSelector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setHighlightRect(rect);
                // Add highlight class to element
                element.classList.add("tour-highlight");
                // Scroll element into view if needed
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                setHighlightRect(null);
            }
        } else {
            setHighlightRect(null);
        }

        // Cleanup previous highlights
        return () => {
            document.querySelectorAll(".tour-highlight").forEach(el => {
                el.classList.remove("tour-highlight");
            });
        };
    }, [step.targetSelector]);

    useEffect(() => {
        const cleanup = updateHighlight();

        // Update on resize
        window.addEventListener("resize", updateHighlight);

        return () => {
            cleanup();
            window.removeEventListener("resize", updateHighlight);
        };
    }, [currentStep, updateHighlight]);

    const handleNext = () => {
        // Remove highlight from current element
        document.querySelectorAll(".tour-highlight").forEach(el => {
            el.classList.remove("tour-highlight");
        });

        if (isLast) {
            // Save completion to localStorage
            if (userId) {
                localStorage.setItem(`tour-complete-${userId}`, "true");
            }
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

    const handleSkip = () => {
        // Save completion to localStorage even on skip
        if (userId) {
            localStorage.setItem(`tour-complete-${userId}`, "true");
        }
        // Remove all highlights
        document.querySelectorAll(".tour-highlight").forEach(el => {
            el.classList.remove("tour-highlight");
        });
        onSkip();
    };

    const handleElementClick = () => {
        if (step.targetSelector && step.action === "click") {
            // Proceed to next step when they click the highlighted element
            handleNext();
        }
    };

    // Calculate tooltip position based on highlighted element
    const getTooltipPosition = () => {
        if (step.position === "center" || !highlightRect) {
            return {
                position: "fixed" as const,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            };
        }

        const padding = 20;
        const tooltipWidth = 380;
        const tooltipHeight = 280;

        // Position tooltip to the right of the element by default
        let top = highlightRect.top;
        let left = highlightRect.right + padding;

        // If tooltip would go off right edge, position to the left
        if (left + tooltipWidth > window.innerWidth) {
            left = highlightRect.left - tooltipWidth - padding;
        }

        // If tooltip would go off left edge, position below
        if (left < 0) {
            left = Math.max(padding, highlightRect.left);
            top = highlightRect.bottom + padding;
        }

        // If tooltip would go off bottom, position above
        if (top + tooltipHeight > window.innerHeight) {
            top = Math.max(padding, highlightRect.top - tooltipHeight);
        }

        return {
            position: "fixed" as const,
            top: `${top}px`,
            left: `${left}px`,
        };
    };

    return (
        <>
            {/* Overlay with spotlight cutout */}
            <div className="fixed inset-0 z-[9998]" onClick={handleElementClick}>
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 transition-opacity duration-300" />

                {/* Spotlight cutout for highlighted element */}
                {highlightRect && (
                    <div
                        className="absolute bg-transparent rounded-xl ring-4 ring-gold-400 ring-offset-4 ring-offset-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-300"
                        style={{
                            top: highlightRect.top - 8,
                            left: highlightRect.left - 8,
                            width: highlightRect.width + 16,
                            height: highlightRect.height + 16,
                        }}
                    >
                        {/* Pulsing animation */}
                        <div className="absolute inset-0 rounded-xl animate-pulse-ring" />
                    </div>
                )}
            </div>

            {/* Tour Card */}
            <div
                className="fixed z-[9999] animate-slide-up"
                style={getTooltipPosition()}
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[380px] overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-100">
                        <div
                            className="h-full bg-gradient-to-r from-burgundy-500 via-burgundy-600 to-purple-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Header */}
                    <div className="p-5 bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-700 text-white">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">{step.emoji}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-burgundy-200 font-medium">Interactive Tour</p>
                                    <p className="text-xs text-white/60">Step {currentStep + 1} of {TOUR_STEPS.length}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="text-white/60 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {step.description}
                        </p>

                        {/* Action hint */}
                        {step.action === "click" && step.actionText && (
                            <div className="flex items-center gap-2 p-3 bg-gold-50 border border-gold-200 rounded-xl text-sm">
                                <MousePointerClick className="w-5 h-5 text-gold-600 flex-shrink-0" />
                                <span className="text-gold-800 font-medium">{step.actionText}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 flex items-center justify-between">
                        {/* Step indicators */}
                        <div className="flex items-center gap-1">
                            {TOUR_STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        i === currentStep
                                            ? "bg-burgundy-600 w-6"
                                            : i < currentStep
                                                ? "bg-burgundy-300 w-2"
                                                : "bg-gray-200 w-2"
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex gap-2">
                            {!isFirst && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePrev}
                                    className="text-gray-600"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back
                                </Button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleNext}
                                className="bg-burgundy-600 hover:bg-burgundy-700 px-4"
                            >
                                {isLast ? (
                                    <>
                                        Start Learning <Sparkles className="w-4 h-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        {step.action === "click" ? "Skip" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS for animations */}
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

                @keyframes pulse-ring {
                    0% {
                        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }

                .animate-pulse-ring {
                    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .tour-highlight {
                    position: relative;
                    z-index: 9997 !important;
                }
            `}</style>
        </>
    );
}

export default InteractiveTour;
