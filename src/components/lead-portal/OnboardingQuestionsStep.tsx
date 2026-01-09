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
    Users,
    Home,
    Building,
    GraduationCap,
    DollarSign,
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
    { id: "help_self", label: "I want to help myself/my family with health issues", icon: Heart },
    { id: "career_change", label: "I'm looking for a career change", icon: Briefcase },
    { id: "add_practice", label: "I want to add this to my existing practice", icon: Stethoscope },
    { id: "curious", label: "I'm just curious about women's health", icon: Sparkles },
];

const SITUATIONS = [
    { id: "stay_at_home_mom", label: "Stay-at-home mom looking for flexible income", icon: Home },
    { id: "corporate", label: "Corporate professional burnt out from 9-5", icon: Building },
    { id: "healthcare", label: "Healthcare worker wanting something more meaningful", icon: Stethoscope },
    { id: "retiree", label: "Retiree looking for purpose and extra income", icon: Clock },
    { id: "practitioner", label: "Already a coach/practitioner wanting to expand", icon: GraduationCap },
];

const INCOME_GOALS = [
    { id: "2-4k", label: "$2,000-$4,000/month", subtext: "Nice side income", icon: DollarSign },
    { id: "5-8k", label: "$5,000-$8,000/month", subtext: "Replace my current job", icon: DollarSign },
    { id: "10k+", label: "$10,000+/month", subtext: "Build a real business", icon: DollarSign },
];

const DOING_IT_FOR = [
    { id: "myself", label: "Myself" },
    { id: "family", label: "My family/kids" },
    { id: "others_health", label: "Women in my life who struggle with health" },
    { id: "help_others", label: "Others like me who need help" },
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

    if (isCompleted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    Profile Complete ✓
                </h3>
                <p className="text-emerald-600">
                    Great! Sarah now knows how to personalize your experience.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Tell Us About You</h2>
                <p className="text-burgundy-200 text-sm">
                    This helps Sarah personalize your experience (Step {step} of {totalSteps})
                </p>
                {/* Progress dots */}
                <div className="flex gap-2 mt-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full transition-colors ${s < step
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
            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">
                            What brought you here today, {firstName}?
                        </Label>
                        <div className="grid gap-3">
                            {BRING_REASONS.map((reason) => {
                                const Icon = reason.icon;
                                return (
                                    <button
                                        key={reason.id}
                                        onClick={() => setBringReason(reason.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${bringReason === reason.id
                                                ? "border-burgundy-500 bg-burgundy-50"
                                                : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bringReason === reason.id ? "bg-burgundy-500 text-white" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`font-medium ${bringReason === reason.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {reason.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">
                            What describes you best right now?
                        </Label>
                        <div className="grid gap-3">
                            {SITUATIONS.map((situation) => {
                                const Icon = situation.icon;
                                return (
                                    <button
                                        key={situation.id}
                                        onClick={() => setCurrentSituation(situation.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${currentSituation === situation.id
                                                ? "border-burgundy-500 bg-burgundy-50"
                                                : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentSituation === situation.id ? "bg-burgundy-500 text-white" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`font-medium ${currentSituation === situation.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {situation.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">
                            If you could earn extra income, how much would feel life-changing?
                        </Label>
                        <div className="grid gap-3">
                            {INCOME_GOALS.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => setIncomeGoal(goal.id)}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${incomeGoal === goal.id
                                            ? "border-burgundy-500 bg-burgundy-50"
                                            : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${incomeGoal === goal.id ? "bg-burgundy-500 text-white" : "bg-emerald-100 text-emerald-600"
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
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">
                            What would change in your life if you achieved this?
                        </Label>
                        <p className="text-gray-500 text-sm">
                            Be specific! This helps Sarah understand your goals.
                        </p>
                        <Textarea
                            value={lifeChangeGoal}
                            onChange={(e) => setLifeChangeGoal(e.target.value)}
                            placeholder="I could finally quit my stressful job and have more time with my kids while doing something I love..."
                            className="min-h-[150px] text-base"
                        />
                        <p className="text-sm text-gray-400">
                            {lifeChangeGoal.length} characters
                            {lifeChangeGoal.length < 10 && " (minimum 10)"}
                        </p>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold text-gray-900">
                                Who are you doing this for?
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {DOING_IT_FOR.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setDoingItFor(option.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${doingItFor === option.id
                                                ? "border-burgundy-500 bg-burgundy-50"
                                                : "border-gray-200 hover:border-burgundy-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className={`font-medium ${doingItFor === option.id ? "text-burgundy-700" : "text-gray-700"}`}>
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional Photo Upload */}
                        <div className="border-t pt-6">
                            <Label className="text-base font-semibold text-gray-900 mb-3 block">
                                Upload your photo (optional)
                            </Label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {userAvatar ? (
                                        <Image
                                            src={userAvatar}
                                            alt="Your photo"
                                            width={64}
                                            height={64}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Camera className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Makes your experience more personal! 📸
                                    </p>
                                    <button
                                        className="text-sm text-burgundy-600 hover:underline mt-1"
                                        onClick={() => setPhotoUploaded(true)}
                                    >
                                        {photoUploaded ? "Photo added ✓" : "Add photo later in settings"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
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
                        Continue
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
                                Start Learning
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
