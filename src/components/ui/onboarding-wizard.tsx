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
    DollarSign,
    Rocket,
    Calendar,
    Star,
    Zap,
    TrendingUp,
    Award,
    AlertCircle,
} from "lucide-react";

// Step 1: Primary Goal (Segmentation)
const PRIMARY_GOALS = [
    {
        id: "career_change",
        label: "Start a new career as a health coach",
        icon: Rocket,
        color: "purple",
        description: "Leave my current job and become a full-time coach",
        segment: "career_changer"
    },
    {
        id: "side_income",
        label: "Build a profitable side business",
        icon: DollarSign,
        color: "emerald",
        description: "Add $2K-$5K/month while keeping my current job",
        segment: "side_hustle"
    },
    {
        id: "existing_practice",
        label: "Add certifications to my existing practice",
        icon: Award,
        color: "blue",
        description: "I'm already a practitioner and want to expand",
        segment: "existing_practitioner"
    },
    {
        id: "personal_growth",
        label: "Learn for personal development",
        icon: Heart,
        color: "pink",
        description: "Help myself and family with health knowledge",
        segment: "personal"
    },
];

// Step 2: Current Field/Profession (for upsell targeting)
const CURRENT_FIELDS = [
    {
        id: "healthcare",
        label: "Healthcare Professional",
        emoji: "🩺",
        description: "Nurse, doctor, therapist, allied health",
    },
    {
        id: "teacher",
        label: "Teacher / Educator",
        emoji: "👩‍🏫",
        description: "K-12, college, corporate training",
    },
    {
        id: "corporate",
        label: "Corporate Employee",
        emoji: "💼",
        description: "Office job, 9-5 position",
    },
    {
        id: "stay_at_home",
        label: "Stay-at-Home Parent",
        emoji: "🏠",
        description: "Caring for family at home",
    },
    {
        id: "entrepreneur",
        label: "Business Owner / Entrepreneur",
        emoji: "🚀",
        description: "Running my own business",
    },
    {
        id: "fitness",
        label: "Fitness Professional",
        emoji: "🏋️",
        description: "Personal trainer, gym owner, instructor",
    },
    {
        id: "wellness",
        label: "Wellness Professional",
        emoji: "🧘",
        description: "Yoga, massage, acupuncture, etc.",
    },
    {
        id: "student",
        label: "Student",
        emoji: "🎓",
        description: "Currently in school or training",
    },
    {
        id: "transition",
        label: "In Career Transition",
        emoji: "🔄",
        description: "Between jobs or changing careers",
    },
    {
        id: "other",
        label: "Other",
        emoji: "✨",
        description: "Something else entirely",
    },
];

// Step 3: Income Goals (AOV indicator)
const INCOME_GOALS = [
    {
        id: "under_2k",
        label: "Under $2,000/month",
        emoji: "🌱",
        description: "Starting small and building up",
        aov_tier: "starter"
    },
    {
        id: "2k_5k",
        label: "$2,000 - $5,000/month",
        emoji: "🌿",
        description: "Comfortable part-time income",
        aov_tier: "growth"
    },
    {
        id: "5k_10k",
        label: "$5,000 - $10,000/month",
        emoji: "🌳",
        description: "Full-time coaching income",
        aov_tier: "professional"
    },
    {
        id: "10k_plus",
        label: "$10,000+/month",
        emoji: "🚀",
        description: "Building a thriving practice",
        aov_tier: "premium"
    },
];

// Step 3: Timeline/Urgency (CRO indicator)
const TIMELINE_OPTIONS = [
    {
        id: "asap",
        label: "As soon as possible!",
        emoji: "🔥",
        description: "I'm ready to start today",
        urgency: "hot"
    },
    {
        id: "1_3_months",
        label: "Within 1-3 months",
        emoji: "⏰",
        description: "I have a clear timeline",
        urgency: "warm"
    },
    {
        id: "3_6_months",
        label: "Within 3-6 months",
        emoji: "📅",
        description: "Planning ahead",
        urgency: "nurture"
    },
    {
        id: "exploring",
        label: "Just exploring for now",
        emoji: "👀",
        description: "Researching my options",
        urgency: "cold"
    },
];

// Step 4: Current Situation (Segmentation for messaging)
const CURRENT_SITUATIONS = [
    {
        id: "employed_unhappy",
        label: "Employed but unfulfilled",
        emoji: "😔",
        description: "Ready for a meaningful change",
    },
    {
        id: "employed_stable",
        label: "Employed and want a side income",
        emoji: "💼",
        description: "Looking for additional revenue streams",
    },
    {
        id: "stay_at_home",
        label: "Stay-at-home parent/caregiver",
        emoji: "🏠",
        description: "Want flexible work from home",
    },
    {
        id: "already_coach",
        label: "Already a coach/practitioner",
        emoji: "⭐",
        description: "Want to add new certifications",
    },
    {
        id: "health_professional",
        label: "Healthcare professional",
        emoji: "🩺",
        description: "Nurse, dietitian, therapist, etc.",
    },
    {
        id: "other",
        label: "Other",
        emoji: "✨",
        description: "My situation is unique",
    },
];

// Step 5: Investment Readiness (Critical for AOV/Sales)
const INVESTMENT_READINESS = [
    {
        id: "ready_now",
        label: "I'm ready to invest in my future now",
        emoji: "💎",
        description: "I understand education is an investment",
        ready: "hot"
    },
    {
        id: "need_details",
        label: "I need to see pricing and options first",
        emoji: "📋",
        description: "Show me what's available",
        ready: "warm"
    },
    {
        id: "saving_up",
        label: "I'm saving up for this",
        emoji: "🐷",
        description: "Will be ready in a few months",
        ready: "nurture"
    },
    {
        id: "free_only",
        label: "I'm only interested in free resources",
        emoji: "🆓",
        description: "Not ready to invest yet",
        ready: "cold"
    },
];

// Step 6: Biggest Obstacle (Pain points for marketing)
const OBSTACLES = [
    { id: "time", label: "Not enough time", emoji: "⏰" },
    { id: "money", label: "Financial constraints", emoji: "💰" },
    { id: "confidence", label: "Lack of confidence", emoji: "🤔" },
    { id: "knowledge", label: "Not sure where to start", emoji: "📚" },
    { id: "support", label: "Need more support/guidance", emoji: "🤝" },
    { id: "credentials", label: "Need proper certifications", emoji: "📜" },
];

// Step 7: Health Niche Interest
const HEALTH_NICHES = [
    "Gut Health & Digestion",
    "Hormone Balance",
    "Women's Health",
    "Weight Management",
    "Functional Nutrition",
    "Mental Wellness & Anxiety",
    "Stress & Burnout",
    "Sleep Optimization",
    "Autoimmune Conditions",
    "Sports & Fitness Nutrition",
    "Anti-Aging & Longevity",
    "Holistic Wellness",
];

// Country codes for phone input
const COUNTRY_CODES = [
    { code: "+1", country: "US", flag: "🇺🇸", label: "United States" },
    { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada" },
    { code: "+44", country: "UK", flag: "🇬🇧", label: "United Kingdom" },
    { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia" },
    { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand" },
];

// Step-specific Sarah audio context (for voice messages)
const STEP_AUDIO_CONTEXT: Record<number, {
    message: string;
    audioUrl?: string; // For pre-recorded audio when available
}> = {
    1: {
        message: "This helps me understand what's driving you. Whether you want a career change or to help your family — I'll personalize everything for you.",
    },
    2: {
        message: "Knowing your background helps me show you success stories from people just like you. Nurses, teachers, moms — they've all built thriving practices!",
    },
    3: {
        message: "Don't be shy with your income goal! Our graduates average $9,200/month in their first year. Dream big — I'll show you how to get there.",
    },
    4: {
        message: "Your timeline helps me create a realistic action plan. Whether you're in a hurry or taking it slow — we'll match your pace.",
    },
    5: {
        message: "I've helped thousands of people in situations just like yours. This helps me tailor my guidance specifically for you.",
    },
    6: {
        message: "Be honest here! Understanding your approach to investing in yourself helps me recommend the right options and payment plans.",
    },
    7: {
        message: "These obstacles are more common than you think! We have specific solutions for each one. You're not alone.",
    },
    8: {
        message: "Pick what excites you most! These niches will help me recommend the perfect specializations for your practice.",
    },
    9: {
        message: "Almost done! Your personalized dashboard is ready — just one more click to see your custom learning path!",
    },
};

interface OnboardingData {
    primaryGoal: string;
    currentField: string; // NEW: for upsell targeting
    incomeGoal: string;
    timeline: string;
    currentSituation: string;
    investmentReadiness: string;
    obstacles: string[];
    niches: string[];
    phone: string;
    countryCode: string;
    location: string;
    referralSource: string;
    personalMessage: string;
}

interface OnboardingWizardProps {
    onComplete: (data: OnboardingData) => void;
    userName?: string;
    userId?: string;
}

export function OnboardingWizard({ onComplete, userName, userId }: OnboardingWizardProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>({
        primaryGoal: "",
        currentField: "", // NEW
        incomeGoal: "",
        timeline: "",
        currentSituation: "",
        investmentReadiness: "",
        obstacles: [],
        niches: [],
        phone: "",
        countryCode: "+1",
        location: "",
        referralSource: "",
        personalMessage: "",
    });

    const totalSteps = 9; // Added Current Field question
    const progress = (step / totalSteps) * 100;

    const canProceed = () => {
        switch (step) {
            case 1: return data.primaryGoal !== "";
            case 2: return data.currentField !== ""; // NEW
            case 3: return data.incomeGoal !== "";
            case 4: return data.timeline !== "";
            case 5: return data.currentSituation !== "";
            case 6: return data.investmentReadiness !== "";
            case 7: return data.obstacles.length > 0;
            case 8: return data.niches.length > 0;
            case 9: return true; // Contact info optional
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
        // Save to localStorage for immediate UI
        if (userId) {
            localStorage.setItem(`onboarding-complete-${userId}`, "true");
            localStorage.setItem(`user-onboarding-data-${userId}`, JSON.stringify(data));
        }

        // Determine lead score based on responses
        let leadScore = 0;

        // Income goal scoring
        if (data.incomeGoal === "10k_plus") leadScore += 30;
        else if (data.incomeGoal === "5k_10k") leadScore += 25;
        else if (data.incomeGoal === "2k_5k") leadScore += 15;
        else leadScore += 5;

        // Timeline scoring
        if (data.timeline === "asap") leadScore += 30;
        else if (data.timeline === "1_3_months") leadScore += 20;
        else if (data.timeline === "3_6_months") leadScore += 10;
        else leadScore += 0;

        // Investment readiness scoring
        if (data.investmentReadiness === "ready_now") leadScore += 40;
        else if (data.investmentReadiness === "need_details") leadScore += 25;
        else if (data.investmentReadiness === "saving_up") leadScore += 10;
        else leadScore += 0;

        // Build phone number with country code
        const fullPhone = data.phone && data.phone.trim()
            ? `${data.countryCode} ${data.phone.trim()}`
            : undefined;

        // Save to database via API
        try {
            const response = await fetch("/api/user/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    learningGoal: data.primaryGoal,
                    currentField: data.currentField, // NEW: for upsell targeting
                    focusAreas: data.niches,
                    incomeGoal: data.incomeGoal,
                    timeline: data.timeline,
                    currentSituation: data.currentSituation,
                    investmentReadiness: data.investmentReadiness,
                    obstacles: data.obstacles,
                    phone: fullPhone,
                    location: data.location || undefined,
                    referralSource: data.referralSource || undefined,
                    personalMessage: data.personalMessage || undefined,
                    leadScore: leadScore,
                }),
            });

            if (!response.ok) {
                console.error("Onboarding API error:", await response.text());
            }
        } catch (error) {
            console.error("Error saving onboarding data:", error);
        }

        onComplete(data);
    };

    const stepContent = [
        {
            title: `Hey ${userName || "there"}! What's your #1 goal?`,
            subtitle: "This helps us personalize your learning path"
        },
        {
            title: "What do you currently do for work?",
            subtitle: "This helps us show you relevant success stories"
        },
        {
            title: "What's your income goal?",
            subtitle: "Be ambitious! We'll show you exactly how to get there"
        },
        {
            title: "When do you want to get started?",
            subtitle: "We'll help you create a realistic action plan"
        },
        {
            title: "Tell us about your current situation",
            subtitle: "We've helped thousands of people just like you"
        },
        {
            title: "How do you feel about investing in your education?",
            subtitle: "Your honest answer helps us serve you better"
        },
        {
            title: "What's been holding you back?",
            subtitle: "Select all that apply - we have solutions for each"
        },
        {
            title: "What health topics interest you most?",
            subtitle: "Pick up to 3 - we'll recommend the perfect courses"
        },
        {
            title: "Almost done! A few quick details...",
            subtitle: "Optional but helps us support you better"
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-700 p-6 text-white flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-sm font-medium text-white/80">Personalization Quiz</span>
                        </div>
                        <span className="text-sm text-white/60">Step {step} of {totalSteps}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{stepContent[step - 1].title}</h2>
                    <p className="text-white/70 text-sm">{stepContent[step - 1].subtitle}</p>
                    <Progress value={progress} className="h-2 bg-white/20 mt-4" />
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Sarah Voice Message Bubble */}
                    {STEP_AUDIO_CONTEXT[step] && (
                        <div className="mb-5 flex items-start gap-3 bg-gradient-to-r from-burgundy-50 to-purple-50 p-4 rounded-xl border border-burgundy-100">
                            {/* Sarah Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-burgundy-200">
                                    <img
                                        src="/coaches/sarah-coach.webp"
                                        alt="Coach Sarah"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Audio bars indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-burgundy-500 rounded-full flex items-center justify-center">
                                    <div className="flex gap-0.5 items-end">
                                        <div className="w-0.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                                        <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                        <div className="w-0.5 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                            {/* Message content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-burgundy-600 mb-1">Coach Sarah says:</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {STEP_AUDIO_CONTEXT[step].message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Primary Goal */}
                    {step === 1 && (
                        <div className="space-y-3">
                            {PRIMARY_GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setData({ ...data, primaryGoal: goal.id })}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${data.primaryGoal === goal.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-${goal.color}-100 flex items-center justify-center flex-shrink-0`}>
                                        <goal.icon className={`w-6 h-6 text-${goal.color}-600`} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold text-gray-900">{goal.label}</p>
                                        <p className="text-sm text-gray-500">{goal.description}</p>
                                    </div>
                                    {data.primaryGoal === goal.id && (
                                        <Check className="w-6 h-6 text-burgundy-600 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Current Field (NEW) */}
                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                            {CURRENT_FIELDS.map((field) => (
                                <button
                                    key={field.id}
                                    onClick={() => setData({ ...data, currentField: field.id })}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${data.currentField === field.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-3xl">{field.emoji}</span>
                                    <p className="font-medium text-gray-900 text-sm">{field.label}</p>
                                    <p className="text-xs text-gray-500">{field.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Income Goal */}
                    {step === 3 && (
                        <div className="space-y-3">
                            {INCOME_GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setData({ ...data, incomeGoal: goal.id })}
                                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.incomeGoal === goal.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-3xl">{goal.emoji}</span>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">{goal.label}</p>
                                        <p className="text-sm text-gray-500">{goal.description}</p>
                                    </div>
                                    {data.incomeGoal === goal.id && (
                                        <Check className="w-6 h-6 text-burgundy-600 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                            <p className="text-center text-sm text-gray-500 mt-4 bg-gold-50 p-3 rounded-lg border border-gold-200">
                                <TrendingUp className="w-4 h-4 inline mr-1 text-gold-600" />
                                Our graduates average <span className="font-bold text-burgundy-700">$9,200/month</span> within their first year!
                            </p>
                        </div>
                    )}

                    {/* Step 4: Timeline */}
                    {step === 4 && (
                        <div className="space-y-3">
                            {TIMELINE_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setData({ ...data, timeline: option.id })}
                                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.timeline === option.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-3xl">{option.emoji}</span>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold text-gray-900 text-lg">{option.label}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    {data.timeline === option.id && (
                                        <Check className="w-6 h-6 text-burgundy-600 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 5: Current Situation */}
                    {step === 5 && (
                        <div className="grid grid-cols-2 gap-3">
                            {CURRENT_SITUATIONS.map((situation) => (
                                <button
                                    key={situation.id}
                                    onClick={() => setData({ ...data, currentSituation: situation.id })}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${data.currentSituation === situation.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-3xl">{situation.emoji}</span>
                                    <p className="font-medium text-gray-900 text-sm">{situation.label}</p>
                                    <p className="text-xs text-gray-500">{situation.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 6: Investment Readiness */}
                    {step === 6 && (
                        <div className="space-y-3">
                            {INVESTMENT_READINESS.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setData({ ...data, investmentReadiness: option.id })}
                                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${data.investmentReadiness === option.id
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-3xl">{option.emoji}</span>
                                    <div className="text-left flex-1">
                                        <p className="font-semibold text-gray-900">{option.label}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                    {data.investmentReadiness === option.id && (
                                        <Check className="w-6 h-6 text-burgundy-600 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                            <p className="text-center text-sm text-gray-500 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <Star className="w-4 h-4 inline mr-1 text-blue-600" />
                                We offer flexible payment plans and scholarships for qualified students!
                            </p>
                        </div>
                    )}

                    {/* Step 7: Obstacles */}
                    {step === 7 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {OBSTACLES.map((obstacle) => (
                                    <button
                                        key={obstacle.id}
                                        onClick={() => {
                                            if (data.obstacles.includes(obstacle.id)) {
                                                setData({ ...data, obstacles: data.obstacles.filter(o => o !== obstacle.id) });
                                            } else {
                                                setData({ ...data, obstacles: [...data.obstacles, obstacle.id] });
                                            }
                                        }}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${data.obstacles.includes(obstacle.id)
                                            ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-2xl">{obstacle.emoji}</span>
                                        <span className="font-medium text-gray-900 text-sm">{obstacle.label}</span>
                                        {data.obstacles.includes(obstacle.id) && (
                                            <Check className="w-5 h-5 text-burgundy-600 ml-auto flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            {data.obstacles.length > 0 && (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <p className="text-sm text-green-800 flex items-start gap-2">
                                        <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong>Good news!</strong> We've helped over 2,500+ students overcome these exact challenges with our proven system.
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 8: Health Niches */}
                    {step === 8 && (
                        <div>
                            <p className="text-gray-500 mb-4">Select up to 3 topics that excite you most</p>
                            <div className="flex flex-wrap gap-3">
                                {HEALTH_NICHES.map((niche) => (
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
                                            ? "bg-burgundy-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {niche}
                                    </button>
                                ))}
                            </div>
                            {data.niches.length > 0 && (
                                <div className="mt-4 p-3 bg-burgundy-50 border border-burgundy-200 rounded-xl">
                                    <p className="text-sm text-burgundy-700">
                                        <strong>Your focus areas:</strong> {data.niches.join(", ")}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 9: Contact & Final */}
                    {step === 9 && (
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    WhatsApp / Phone (for support & updates)
                                </label>
                                <div className="flex gap-2">
                                    {/* Country Code Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={`${data.countryCode}-${COUNTRY_CODES.find(c => c.code === data.countryCode)?.country || 'US'}`}
                                            onChange={(e) => {
                                                const [code] = e.target.value.split('-');
                                                setData({ ...data, countryCode: code });
                                            }}
                                            className="h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 appearance-none cursor-pointer"
                                        >
                                            {COUNTRY_CODES.map((country) => (
                                                <option key={`${country.code}-${country.country}`} value={`${country.code}-${country.country}`}>
                                                    {country.flag} {country.code}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Phone Number Input */}
                                    <Input
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        value={data.phone}
                                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                                        className="h-12 flex-1 rounded-xl"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    We&apos;ll only use this to send you important updates and support messages
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-gold-50 to-amber-50 p-4 rounded-xl border border-gold-200">
                                <p className="text-sm text-amber-800 flex items-start gap-2">
                                    <Award className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                                    <span>
                                        <strong>Your personalized dashboard is almost ready!</strong> Click finish to see your custom learning path and exclusive offers.
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center justify-between flex-shrink-0 bg-white border-t border-gray-100 pt-4">
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
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="bg-burgundy-600 hover:bg-burgundy-700 px-6 py-5 text-base"
                        >
                            {step === totalSteps ? (
                                <>
                                    Finish & See My Dashboard <Sparkles className="w-4 h-4 ml-2" />
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
