"use client";

import { useState, useEffect } from "react";
import {
    ArrowRight, CheckCircle2, Loader2,
    User, Mail, Phone, Lock, ChevronRight,
    Heart, Clock, DollarSign, Sparkles, Gift,
    Stethoscope, Users, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Types for form data
export type EnhancedQualificationData = {
    // Step 1: Contact Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // Step 2: Healthcare Background (NEW)
    healthcareBackground: string;
    // Step 3: Qualification (Sarah's questions)
    incomeGoal: string;
    timeCommitment: string;
    motivation: string;
    investmentLevel: string;
    readiness: string;
    // Commitment checkbox
    hasCommitted: boolean;
    // Legacy fields (mapped from new ones)
    lifeStage: string;
    investment: string;
};

interface EnhancedQualificationFormProps {
    onSubmit: (data: EnhancedQualificationData) => Promise<void>;
    isSubmitting: boolean;
    isVerifying?: boolean;
    error?: string;
}

// Real-time stats component
function LiveStats() {
    const [stats, setStats] = useState({
        enrolledToday: 47,
        enrolledThisWeek: 312,
        inModule3: 23,
    });

    // Simulate slight fluctuation for realism
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                enrolledToday: prev.enrolledToday + (Math.random() > 0.7 ? 1 : 0),
                enrolledThisWeek: prev.enrolledThisWeek + (Math.random() > 0.8 ? 1 : 0),
                inModule3: Math.max(15, Math.min(35, prev.inModule3 + Math.floor(Math.random() * 3) - 1)),
            }));
        }, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stats.enrolledThisWeek} enrolled this week
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {stats.inModule3} in Module 3 right now
            </span>
        </div>
    );
}

export function EnhancedQualificationForm({
    onSubmit,
    isSubmitting,
    isVerifying = false,
    error,
}: EnhancedQualificationFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<EnhancedQualificationData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        healthcareBackground: "",
        incomeGoal: "",
        timeCommitment: "",
        motivation: "",
        investmentLevel: "",
        readiness: "",
        hasCommitted: false,
        lifeStage: "",
        investment: "",
    });

    const updateField = (field: keyof EnhancedQualificationData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1 && formData.firstName && formData.email && formData.phone.length > 9) {
            setStep(2);
        } else if (step === 2 && formData.healthcareBackground) {
            setStep(3);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 3 && formData.hasCommitted) {
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
    const isStep2Valid = formData.healthcareBackground !== "";
    const isStep3Valid = formData.incomeGoal && formData.timeCommitment && formData.motivation && formData.investmentLevel && formData.readiness && formData.hasCommitted;

    const healthcareOptions = [
        { id: "rn-lpn-np", label: "RN / LPN / NP", emoji: "🩺" },
        { id: "pt-ot-pta", label: "PT / OT / PTA / OTA", emoji: "🦴" },
        { id: "ma-cna-allied", label: "MA / CNA / Allied Health", emoji: "⚕️" },
        { id: "other-clinical", label: "Other clinical role", emoji: "🏥" },
        { id: "no-healthcare", label: "I don't have a healthcare background", emoji: "📚" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Stats Banner - REAL enrollment data */}
            <div
                className="text-center py-2.5 px-4"
                style={{ background: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)" }}
            >
                <LiveStats />
            </div>

            {/* Progress Bar - 3 Steps */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                    <span className={cn(step >= 1 ? "text-[#722f37]" : "")}>1. Get Access</span>
                    <span className={cn(step >= 2 ? "text-[#722f37]" : "")}>2. Background</span>
                    <span className={cn(step >= 3 ? "text-[#722f37]" : "")}>3. Quick Qs</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                            background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)",
                        }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {/* STEP 1: Contact Info */}
                {step === 1 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: "#722f3720", color: "#722f37" }}
                            >
                                <Sparkles className="w-3 h-3" />
                                COMPLETE IN ONE FOCUSED SESSION
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Hey! I'm Sarah 👋</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Average: 67 minutes • 89% finish same day
                            </p>
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
                                        const clean = e.target.value.replace(/[^0-9-]/g, "");
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
                            Continue to Qualification →
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Lock className="w-3 h-3" />
                            <span>256-bit SSL • Your info is secure</span>
                        </div>
                    </div>
                )}

                {/* STEP 2: Healthcare Background Filter (NEW) */}
                {step === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: "#d4af3730", color: "#8b6914" }}
                            >
                                <Stethoscope className="w-3 h-3" />
                                QUICK QUALIFICATION
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                What's your healthcare background, {formData.firstName}?
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                This helps me personalize your experience
                            </p>
                        </div>

                        <div className="space-y-2">
                            {healthcareOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => updateField("healthcareBackground", option.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                                        formData.healthcareBackground === option.id
                                            ? "border-[#722f37] bg-[#722f3710]"
                                            : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                    )}
                                >
                                    <span className="text-xl">{option.emoji}</span>
                                    <span className="text-sm font-medium text-gray-700 flex-1">{option.label}</span>
                                    {formData.healthcareBackground === option.id && (
                                        <CheckCircle2 className="w-5 h-5 text-[#722f37]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Special message for non-healthcare */}
                        {formData.healthcareBackground === "no-healthcare" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-medium mb-1">No problem! 🙌</p>
                                <p>Many of our successful practitioners come from non-clinical backgrounds. This training will give you the foundation you need.</p>
                            </div>
                        )}

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep2Valid}
                            className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg"
                            style={{ background: "linear-gradient(135deg, #722f37 0%, #9a4a54 50%, #722f37 100%)" }}
                        >
                            Almost Done — 5 Quick Questions →
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← Back
                        </button>
                    </div>
                )}

                {/* STEP 3: Qualification Questions + Commitment Checkbox */}
                {step === 3 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ backgroundColor: "#d4af3730", color: "#8b6914" }}
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                Final step, {formData.firstName}!
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">So I can help you better...</h3>
                            <p className="text-gray-500 text-sm mt-1">5 quick questions from me 💕</p>
                        </div>

                        {/* Q1: Income Goal */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-[#722f37]" />
                                What's your income goal from this?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "starter-3-5k", label: "Getting started ($3-5K/mo)", emoji: "💰" },
                                    { id: "replace-job-5-10k", label: "Replace my income ($5-10K/mo)", emoji: "🎯" },
                                    { id: "scale-business-10k-plus", label: "Build a real practice ($10K+/mo)", emoji: "🚀" },
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
                                    { id: "few-hours-flexible", label: "A few hours (fitting around life)", emoji: "⏰" },
                                    { id: "part-time-10-15h", label: "Part-time (10-15 hours/week)", emoji: "📅" },
                                    { id: "all-in-full-commitment", label: "Ready to go all-in", emoji: "💪" },
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

                        {/* Q3: Motivation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Heart className="w-4 h-4 text-[#722f37]" />
                                What's driving you to make a change?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "time-with-family", label: "I want more time with my kids/family", emoji: "👨‍👩‍👧‍👦" },
                                    { id: "burned-out-need-change", label: "I'm burned out and need something new", emoji: "😮‍💨" },
                                    { id: "meaningful-work-matters", label: "I want work that actually matters", emoji: "✨" },
                                    { id: "ready-to-bet-on-myself", label: "I'm finally ready to bet on myself", emoji: "🦋" },
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

                        {/* Q4: Investment Level */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-start gap-2">
                                <DollarSign className="w-4 h-4 text-[#722f37] mt-0.5 flex-shrink-0" />
                                <span>If this is the right fit, what investment feels realistic?</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "under-1k", label: "Under $1,000", emoji: "🌱" },
                                    { id: "1k-3k", label: "$1,000 - $3,000", emoji: "💫" },
                                    { id: "3k-5k", label: "$3,000 - $5,000", emoji: "⭐" },
                                    { id: "5k-plus", label: "$5,000+ for the right program", emoji: "🚀" },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("investmentLevel", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.investmentLevel === option.id
                                                ? "border-[#722f37] bg-[#722f3710]"
                                                : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                        )}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                        {formData.investmentLevel === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-[#722f37] ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Q5: Readiness */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-[#722f37] mt-0.5 flex-shrink-0" />
                                <span>If everything aligns, how quickly would you want to move forward?</span>
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "yes-ready", label: "I'm ready to take action immediately", emoji: "✅" },
                                    { id: "need-time", label: "I'd need a few days to think", emoji: "🤔" },
                                    { id: "talk-partner", label: "I'd want to discuss with my partner", emoji: "👫" },
                                    { id: "just-learning", label: "Just gathering information right now", emoji: "📚" },
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("readiness", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.readiness === option.id
                                                ? "border-[#722f37] bg-[#722f3710]"
                                                : "border-gray-200 hover:border-[#722f3750] hover:bg-[#722f3708]"
                                        )}
                                    >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                        {formData.readiness === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-[#722f37] ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* COMMITMENT CHECKBOX (NEW - from audit) */}
                        <div className="border-t border-gray-200 pt-5">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.hasCommitted}
                                    onChange={(e) => updateField("hasCommitted", e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#722f37] focus:ring-[#722f37] cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                                    I understand this training takes <strong>60-90 minutes of focused time</strong> and I'm committing to complete it within <strong>48 hours</strong>.
                                </span>
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
                                <div className="mt-0.5">⚠️</div>
                                <div>{error}</div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={!isStep3Valid || isSubmitting || isVerifying}
                            className="w-full h-14 text-lg font-bold text-white rounded-xl shadow-lg disabled:opacity-50"
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
                                    Complete My Application →
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
