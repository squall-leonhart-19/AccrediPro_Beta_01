"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowRight,
    Loader2,
    Camera,
    Heart,
    Briefcase,
    Stethoscope,
    Clock,
    Home,
    Building,
    GraduationCap,
    Sparkles,
    CheckCircle
} from "lucide-react";
import Image from "next/image";

interface OnboardingQuestionsStepProps {
    onComplete: () => void;
    isCompleted: boolean;
    firstName?: string;
    userAvatar?: string | null;
}

const BRING_REASONS = [
    { id: "help_self", label: "I want to understand my own body better", icon: Heart },
    { id: "career_change", label: "I'm ready for a fresh start and new career", icon: Briefcase },
    { id: "add_practice", label: "I already work in health and want to expand", icon: Stethoscope },
    { id: "curious", label: "I'm curious and love learning new things!", icon: Sparkles },
];

const SITUATIONS = [
    { id: "stay_at_home_mom", label: "I'm a mom looking for something flexible", icon: Home },
    { id: "corporate", label: "I'm burnt out from the corporate grind", icon: Building },
    { id: "healthcare", label: "I work in healthcare but want more meaning", icon: Stethoscope },
    { id: "retiree", label: "I'm in a new life chapter and want purpose", icon: Clock },
    { id: "practitioner", label: "I'm already a coach and want to grow", icon: GraduationCap },
];

const INCOME_GOALS = [
    { id: "2-4k", label: "$2,000-$4,000/month", subtext: "A nice boost for my family" },
    { id: "5-8k", label: "$5,000-$8,000/month", subtext: "Freedom from my current job" },
    { id: "10k+", label: "$10,000+/month", subtext: "A thriving business of my own" },
];

const DOING_IT_FOR = [
    { id: "myself", label: "Myself - it's my time now 💪" },
    { id: "family", label: "My family and kids 👨‍👩‍👧" },
    { id: "others_health", label: "Women who struggle like I did 💕" },
    { id: "help_others", label: "People who need guidance 🌟" },
];

export function OnboardingQuestionsStep({
    onComplete,
    isCompleted,
    firstName = "there",
    userAvatar
}: OnboardingQuestionsStepProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Answers
    const [bringReason, setBringReason] = useState("");
    const [currentSituation, setCurrentSituation] = useState("");
    const [incomeGoal, setIncomeGoal] = useState("");
    const [lifeChangeGoal, setLifeChangeGoal] = useState("");
    const [doingItFor, setDoingItFor] = useState("");
    const [photoUploaded, setPhotoUploaded] = useState(!!userAvatar);

    const totalSteps = 5;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/lead-onboarding/save-answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bringReason,
                    currentSituation,
                    incomeGoal,
                    lifeChangeGoal,
                    doingItFor,
                    uploadedPhoto: photoUploaded,
                }),
            });

            if (res.ok) {
                onComplete();
            }
        } catch (error) {
            console.error("Error saving answers:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!bringReason;
            case 2: return !!currentSituation;
            case 3: return !!incomeGoal;
            case 4: return lifeChangeGoal.trim().length > 10;
            case 5: return !!doingItFor;
            default: return false;
        }
    };

    // Sarah's warm messages for each step
    const sarahMessages = {
        1: `I'd love to know what brought you here today, ${firstName}! 💕`,
        2: `Tell me a bit about where you are in life right now...`,
        3: `Here's a fun one! If you could earn extra income doing something you love, what would feel amazing?`,
        4: `I love this question! Dream with me for a second...`,
        5: `Last one! Who inspires you to keep going?`,
    };

    if (isCompleted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    I know you so much better now! ✨
                </h3>
                <p className="text-emerald-600">
                    Let's start your learning journey together!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Sarah Header - Warm and Personal */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-5 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold">S</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-burgundy-200 text-xs mb-1">Sarah says...</p>
                        <p className="text-lg font-medium leading-relaxed">
                            {sarahMessages[step as keyof typeof sarahMessages]}
                        </p>
                    </div>
                </div>
                {/* Progress dots */}
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${s < step
                                ? "bg-emerald-400"
                                : s === step
                                    ? "bg-white"
                                    : "bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Questions */}
            <div className="p-5">
                {step === 1 && (
                    <div className="space-y-3">
                        <div className="grid gap-2.5">
                            {BRING_REASONS.map((reason) => {
                                const Icon = reason.icon;
                                return (
                                    <button
                                        key={reason.id}
                                        onClick={() => setBringReason(reason.id)}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${bringReason === reason.id
                                            ? "border-burgundy-500 bg-burgundy-50"
                                            : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bringReason === reason.id ? "bg-burgundy-500 text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={`font-medium text-sm ${bringReason === reason.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {reason.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <div className="grid gap-2.5">
                            {SITUATIONS.map((situation) => {
                                const Icon = situation.icon;
                                return (
                                    <button
                                        key={situation.id}
                                        onClick={() => setCurrentSituation(situation.id)}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${currentSituation === situation.id
                                            ? "border-burgundy-500 bg-burgundy-50"
                                            : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${currentSituation === situation.id ? "bg-burgundy-500 text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={`font-medium text-sm ${currentSituation === situation.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {situation.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-3">
                        <div className="grid gap-2.5">
                            {INCOME_GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setIncomeGoal(goal.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${incomeGoal === goal.id
                                        ? "border-burgundy-500 bg-burgundy-50"
                                        : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg font-bold ${incomeGoal === goal.id ? "bg-burgundy-500 text-white" : "bg-emerald-100 text-emerald-600"
                                        }`}>
                                        $
                                    </div>
                                    <div>
                                        <span className={`font-bold block ${incomeGoal === goal.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {goal.label}
                                        </span>
                                        <span className="text-sm text-gray-500">{goal.subtext}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-3">
                        <p className="text-gray-600 text-sm">
                            If you hit that income goal, what would change for you? Paint me a picture! 🎨
                        </p>
                        <Textarea
                            value={lifeChangeGoal}
                            onChange={(e) => setLifeChangeGoal(e.target.value)}
                            placeholder="I could finally take that vacation, pay off those bills, spend mornings with my kids instead of rushing to work..."
                            className="min-h-[130px] text-base"
                        />
                        <p className="text-xs text-gray-400">
                            {lifeChangeGoal.length < 10 && "Just a few more words..."}
                        </p>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2.5">
                            {DOING_IT_FOR.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setDoingItFor(option.id)}
                                    className={`p-3.5 rounded-xl border-2 transition-all text-center ${doingItFor === option.id
                                        ? "border-burgundy-500 bg-burgundy-50"
                                        : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className={`font-medium text-sm ${doingItFor === option.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Optional Photo Upload */}
                        <div className="border-t pt-4 mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Add your photo so I can put a face to the name! 📸
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {userAvatar ? (
                                        <Image
                                            src={userAvatar}
                                            alt="Your photo"
                                            width={56}
                                            height={56}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Camera className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="text-sm text-burgundy-600 hover:underline"
                                    onClick={() => setPhotoUploaded(true)}
                                >
                                    {photoUploaded ? "Photo added ✓" : "I'll add one later"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                {step > 1 ? (
                    <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        className="text-gray-600"
                    >
                        ← Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < 5 ? (
                    <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                    >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isSubmitting}
                        className="bg-burgundy-600 hover:bg-burgundy-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Let's Go! 🚀
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
