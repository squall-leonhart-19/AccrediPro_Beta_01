"use client";

import { useState } from "react";
import {
    ArrowRight, CheckCircle2, Loader2,
    User, Mail, Phone, Lock, ChevronRight,
    Heart, Clock, DollarSign, Sparkles, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Types for form data
export type QualificationData = {
    // Step 1: Contact Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // Step 2: Qualification (Sarah's questions)
    incomeGoal: string;
    timeCommitment: string;
    motivation: string;
    // Legacy fields (mapped from new ones)
    lifeStage: string;
    investment: string;
};

interface MultiStepQualificationFormProps {
    onSubmit: (data: QualificationData) => Promise<void>;
    isSubmitting: boolean;
    isVerifying?: boolean;
    error?: string;
}

export function MultiStepQualificationForm({
    onSubmit,
    isSubmitting,
    isVerifying = false,
    error
}: MultiStepQualificationFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<QualificationData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        incomeGoal: "",
        timeCommitment: "",
        motivation: "",
        lifeStage: "",
        investment: ""
    });

    const updateField = (field: keyof QualificationData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (formData.firstName && formData.email && formData.phone.length > 9) {
                setStep(2);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 2) {
            // Map new fields to legacy fields for API compatibility
            const submissionData = {
                ...formData,
                lifeStage: formData.timeCommitment,
                investment: formData.incomeGoal,
            };
            onSubmit(submissionData);
        }
    };

    // Validation
    const isStep1Valid = formData.firstName && formData.email && formData.phone.length > 9;
    const isStep2Valid = formData.incomeGoal && formData.timeCommitment && formData.motivation;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Urgency Banner - Gold Metallic */}
            <div
                className="text-center py-2.5 px-4"
                style={{ background: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)" }}
            >
                <p className="text-sm font-bold text-[#4e1f24] flex items-center justify-center gap-2">
                    <Gift className="w-4 h-4" />
                    <span>FREE Today Only • Normally $97</span>
                </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                    <span className={cn(step >= 1 ? "text-[#722f37]" : "")}>Step 1: Get Access</span>
                    <span className={cn(step >= 2 ? "text-[#722f37]" : "")}>Step 2: Quick Questions</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                            width: step === 1 ? "50%" : "100%",
                            background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)"
                        }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {step === 1 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: "#722f3720", color: "#722f37" }}
                            >
                                <Sparkles className="w-3 h-3" />
                                FROM SARAH, YOUR COACH
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Hey! I'm Sarah 👋</h3>
                            <p className="text-gray-500 text-sm mt-1">I'll personally guide you through your mini diploma</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)}
                                        className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                                        placeholder="Jane"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => updateField("lastName", e.target.value)}
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone (I'll text your access link) *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <div className="absolute left-9 top-3 text-gray-500 font-medium border-r border-gray-300 pr-2 mr-2 text-sm leading-none h-5 flex items-center">
                                    🇺🇸 +1
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/[^0-9-]/g, '');
                                        updateField("phone", clean);
                                    }}
                                    className="pl-24 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#722f37] focus:border-transparent"
                                    placeholder="555-0123"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                            className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                            style={{ background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)" }}
                        >
                            Continue — It's Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
                            <span>•</span>
                            <span>No credit card required</span>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: "#d4af3730", color: "#8b6914" }}
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                Almost there, {formData.firstName}!
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">So I can help you better...</h3>
                            <p className="text-gray-500 text-sm mt-1">Just 3 quick questions from me 💕</p>
                        </div>

                        {/* Q1: Income Goal */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#722f37]" />
                                What's your income goal from this?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "side-income", label: "Just a side income ($500-1K/mo)", emoji: "💰" },
                                    { id: "replace-job", label: "Replace my job ($3-5K/mo)", emoji: "🎯" },
                                    { id: "build-business", label: "Build a real business ($5K+/mo)", emoji: "🚀" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("incomeGoal", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.incomeGoal === option.id
                                                ? "border-[#722f37] bg-[#722f3710]"
                                                : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                        )}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                        {formData.incomeGoal === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-[#722f37] ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Q2: Time Commitment */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#722f37]" />
                                How much time can you dedicate weekly?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "few-hours", label: "A few hours (fitting around life)", emoji: "⏰" },
                                    { id: "part-time", label: "Part-time (10-15 hours/week)", emoji: "📅" },
                                    { id: "all-in", label: "Ready to go all-in", emoji: "💪" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("timeCommitment", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.timeCommitment === option.id
                                                ? "border-[#722f37] bg-[#722f3710]"
                                                : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                        )}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                        {formData.timeCommitment === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-[#722f37] ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Q3: Motivation (The emotional one) */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-[#722f37]" />
                                What's really driving you to make a change?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "more-time-family", label: "I want more time with my kids/family", emoji: "👨‍👩‍👧‍👦" },
                                    { id: "burned-out", label: "I'm burned out and need something new", emoji: "😮‍💨" },
                                    { id: "meaningful-work", label: "I want work that actually matters", emoji: "✨" },
                                    { id: "bet-on-myself", label: "I'm finally ready to bet on myself", emoji: "🦋" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("motivation", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.motivation === option.id
                                                ? "border-[#722f37] bg-[#722f3710]"
                                                : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                        )}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                        {formData.motivation === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-[#722f37] ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
                                <div className="mt-0.5">⚠️</div>
                                <div>{error}</div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={!isStep2Valid || isSubmitting || isVerifying}
                            className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                            style={{ background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)" }}
                        >
                            {isVerifying ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </span>
                            ) : isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Your Portal...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Start My Free Diploma
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>

                        <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-400 hover:text-gray-600">
                            ← Back to edit info
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
