"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
    ChevronRight,
    ChevronLeft,
    Target,
    Heart,
    Briefcase,
    Users,
    BookOpen,
    Sparkles,
    Check,
    ArrowRight,
    Clock,
    Globe,
    MapPin,
    Phone,
} from "lucide-react";

// Goal options
const GOALS = [
    { id: "learn", label: "Learn coaching skills", icon: BookOpen, color: "blue" },
    { id: "career", label: "Explore a new career", icon: Briefcase, color: "purple" },
    { id: "health", label: "Improve my own health", icon: Heart, color: "emerald" },
    { id: "family", label: "Support my family", icon: Users, color: "pink" },
    { id: "business", label: "Build a coaching business", icon: Target, color: "amber" },
];

// Niche options
const NICHES = [
    "Gut Health", "Hormone Health", "Women's Health", "Weight Management",
    "Functional Medicine", "Nutrition", "Mental Wellness", "Stress Management",
    "Sleep Optimization", "Autoimmune Support", "Sports Nutrition", "Holistic Health",
];

// Experience levels
const EXPERIENCE_LEVELS = [
    { id: "beginner", label: "Beginner", description: "I'm just starting my journey", emoji: "🌱" },
    { id: "intermediate", label: "Intermediate", description: "I have some knowledge or training", emoji: "🌿" },
    { id: "advanced", label: "Advanced / Already a coach", description: "I'm practicing or certified", emoji: "🌳" },
];

// Weekly hours commitment
const WEEKLY_HOURS = [
    { id: "1-3", label: "1-3 hours/week", description: "Light pace", emoji: "🐢" },
    { id: "4-7", label: "4-7 hours/week", description: "Moderate pace", emoji: "🚶" },
    { id: "8-15", label: "8-15 hours/week", description: "Intensive pace", emoji: "🏃" },
    { id: "15+", label: "15+ hours/week", description: "Full commitment", emoji: "🚀" },
];

// How they heard about us
const REFERRAL_SOURCES = [
    "Google Search",
    "Facebook/Instagram",
    "YouTube",
    "Friend or Family",
    "Another Coach",
    "Podcast",
    "Blog Article",
    "Other",
];

interface OnboardingData {
    goal: string;
    niches: string[];
    experience: string;
    weeklyHours: string;
    referralSource: string;
    phone: string;
    location: string;
    biggestChallenge: string;
}

interface OnboardingWizardProps {
    onComplete: (data: OnboardingData) => void;
    userName?: string;
    userId?: string;
}

export function OnboardingWizard({ onComplete, userName, userId }: OnboardingWizardProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        goal: "",
        niches: [],
        experience: "",
        weeklyHours: "",
        referralSource: "",
        phone: "",
        location: "",
        biggestChallenge: "",
    });

    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const canProceed = () => {
        switch (step) {
            case 1: return data.goal !== "";
            case 2: return data.niches.length > 0;
            case 3: return data.experience !== "";
            case 4: return data.weeklyHours !== "";
            case 5: return true; // Contact info is optional
            case 6: return true; // Challenge is optional
            default: return true;
        }
    };

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        // Save to localStorage for immediate UI (user-specific)
        if (userId) {
            localStorage.setItem(`onboarding-complete-${userId}`, "true");
            localStorage.setItem(`user-onboarding-data-${userId}`, JSON.stringify(data));
        }

        // Save to database via API
        try {
            await fetch("/api/user/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    learningGoal: data.goal,
                    focusAreas: data.niches,
                    experienceLevel: data.experience,
                    weeklyHours: parseInt(data.weeklyHours.split("-")[0]) || 5,
                    phone: data.phone || undefined,
                    location: data.location || undefined,
                    healthBackground: data.biggestChallenge || undefined,
                }),
            });
        } catch (error) {
            console.error("Error saving onboarding data:", error);
        }

        onComplete(data);
    };

    const stepTitles = [
        "What brings you here?",
        "What topics interest you most?",
        "How experienced are you?",
        "How much time can you commit?",
        "Let's stay connected",
        "What's your biggest challenge?",
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-700 p-6 text-white flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-sm font-medium text-white/80">Tell Us About You</span>
                        </div>
                        <span className="text-sm text-white/60">Step {step} of {totalSteps}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{stepTitles[step - 1]}</h2>
                    <Progress value={progress} className="h-2 bg-white/20" />
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    {/* Step 1: Goal */}
                    {step === 1 && (
                        <div className="space-y-3">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setData({ ...data, goal: goal.id })}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${data.goal === goal.id
                                        ? "border-burgundy-500 bg-burgundy-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-${goal.color}-100 flex items-center justify-center`}>
                                        <goal.icon className={`w-6 h-6 text-${goal.color}-600`} />
                                    </div>
                                    <span className="text-lg font-medium text-gray-900">{goal.label}</span>
                                    {data.goal === goal.id && (
                                        <Check className="w-5 h-5 text-burgundy-600 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Niche */}
                    {step === 2 && (
                        <div>
                            <p className="text-gray-500 mb-4">Select all that interest you (choose up to 3)</p>
                            <div className="flex flex-wrap gap-3">
                                {NICHES.map((niche) => (
                                    <button
                                        key={niche}
                                        onClick={() => {
                                            if (data.niches.includes(niche)) {
                                                setData({ ...data, niches: data.niches.filter(n => n !== niche) });
                                            } else if (data.niches.length < 3) {
                                                setData({ ...data, niches: [...data.niches, niche] });
                                            }
                                        }}
                                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${data.niches.includes(niche)
                                            ? "bg-burgundy-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                            {data.niches.length > 0 && (
                                <p className="text-sm text-burgundy-600 mt-4">
                                    Selected: {data.niches.join(", ")}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Experience */}
                    {step === 3 && (
                        <div className="space-y-3">
                            {EXPERIENCE_LEVELS.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setData({ ...data, experience: level.id })}
                                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.experience === level.id
                                        ? "border-burgundy-500 bg-burgundy-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="text-3xl">{level.emoji}</span>
                                    <div className="text-left">
                                        <p className="text-lg font-medium text-gray-900">{level.label}</p>
                                        <p className="text-sm text-gray-500">{level.description}</p>
                                    </div>
                                    {data.experience === level.id && (
                                        <Check className="w-5 h-5 text-burgundy-600 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 4: Weekly Hours */}
                    {step === 4 && (
                        <div className="space-y-3">
                            <p className="text-gray-500 mb-4">How much time can you dedicate to learning each week?</p>
                            {WEEKLY_HOURS.map((hours) => (
                                <button
                                    key={hours.id}
                                    onClick={() => setData({ ...data, weeklyHours: hours.id })}
                                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.weeklyHours === hours.id
                                        ? "border-burgundy-500 bg-burgundy-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <span className="text-3xl">{hours.emoji}</span>
                                    <div className="text-left">
                                        <p className="text-lg font-medium text-gray-900">{hours.label}</p>
                                        <p className="text-sm text-gray-500">{hours.description}</p>
                                    </div>
                                    {data.weeklyHours === hours.id && (
                                        <Check className="w-5 h-5 text-burgundy-600 ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 5: Contact Info */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <p className="text-gray-500">We'd love to personalize your experience (optional)</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={data.phone}
                                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        Where are you based?
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="City, Country"
                                        value={data.location}
                                        onChange={(e) => setData({ ...data, location: e.target.value })}
                                        className="h-12"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Globe className="w-4 h-4" />
                                        How did you hear about us?
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {REFERRAL_SOURCES.map((source) => (
                                            <button
                                                key={source}
                                                onClick={() => setData({ ...data, referralSource: source })}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${data.referralSource === source
                                                    ? "bg-burgundy-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {source}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Biggest Challenge */}
                    {step === 6 && (
                        <div className="space-y-6">
                            <div>
                                <p className="text-gray-500 mb-4">
                                    This helps us personalize your learning experience
                                </p>
                                <Textarea
                                    placeholder="e.g., I want to help clients with gut health but don't know where to start..."
                                    value={data.biggestChallenge}
                                    onChange={(e) => setData({ ...data, biggestChallenge: e.target.value })}
                                    rows={5}
                                    className="resize-none text-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex items-center justify-between flex-shrink-0 bg-white border-t border-gray-100 pt-4">
                    <div>
                        {step > 1 && (
                            <Button
                                variant="ghost"
                                onClick={() => setStep(step - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {step >= 5 && (
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                            >
                                Skip for now
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-burgundy-600 hover:bg-burgundy-700 px-6"
                        >
                            {step === totalSteps ? (
                                <>
                                    Done <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OnboardingWizard;
