"use client";

import { useState } from "react";
import {
    ArrowRight, CheckCircle2, Loader2,
    User, Mail, Phone, Lock, ChevronRight,
    HeartPulse, Baby, Briefcase, DollarSign,
    Users, Target, Gift, Zap
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
    // Step 2: Qualification
    lifeStage: string;
    motivation: string;
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
        lifeStage: "",
        motivation: "",
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
            onSubmit(formData);
        }
    };

    // Validation for Step 1 (Contact Info)
    const isStep1Valid = formData.firstName && formData.email && formData.phone.length > 9;

    // Validation for Step 2 (Questions)
    const isStep2Valid = formData.lifeStage && formData.motivation && formData.investment;

    return (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-2 px-4">
                <p className="text-sm font-bold flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>FREE Today Only • Normally $97</span>
                </p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                    <span className={cn(step >= 1 ? "text-emerald-600" : "")}>Step 1: Get Access</span>
                    <span className={cn(step >= 2 ? "text-emerald-600" : "")}>Step 2: Personalize</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full transition-all duration-500 ease-out"
                        style={{ width: step === 1 ? "50%" : "100%" }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {step === 1 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                                <Gift className="w-3 h-3" />
                                FREE MINI DIPLOMA ACCESS
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Claim Your Free Certification</h3>
                            <p className="text-gray-500 text-sm mt-1">Instant access • 9 lessons • Certificate included</p>
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
                                        className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                                    className="pl-9 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone (for access link) *</Label>
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
                                    className="pl-24 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="555-0123"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400">We'll text your login link instantly</p>
                        </div>

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                            className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg"
                        >
                            Get Free Access Now
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
                            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                                <CheckCircle2 className="w-3 h-3" />
                                Almost there, {formData.firstName}!
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Quick Questions to Personalize</h3>
                            <p className="text-gray-500 text-sm mt-1">So Sarah knows how to help you best</p>
                        </div>

                        {/* Question 1: Life Stage */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Where are you in life right now?</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "parents", label: "Kids still at home", icon: "🏡" },
                                    { id: "empty-nest", label: "Empty nest / grown kids", icon: "🕊️" },
                                    { id: "rebuilding", label: "Starting over or rebuilding", icon: "🌱" },
                                    { id: "ready-now", label: "Ready for my next chapter", icon: "🚀" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("lifeStage", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                                            formData.lifeStage === option.id
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                                : "border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                                        )}
                                    >
                                        <span className="text-lg">{option.icon}</span>
                                        <span className="text-sm font-medium">{option.label}</span>
                                        {formData.lifeStage === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2: Motivation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">What's driving you to explore this?</Label>
                            <div className="relative">
                                <select
                                    value={formData.motivation}
                                    onChange={(e) => updateField("motivation", e.target.value)}
                                    className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl appearance-none bg-white text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="" disabled>Select one...</option>
                                    <option value="burnout">Burned out from my current career</option>
                                    <option value="health-journey">My health journey changed everything</option>
                                    <option value="flexibility">Want flexibility and freedom</option>
                                    <option value="purpose">Looking for purpose and meaning</option>
                                    <option value="income">Need a new income source</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Question 3: Investment */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">If this felt right, could you invest in yourself?</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "budgeted", label: "Yes, I've budgeted for my growth" },
                                    { id: "discuss", label: "I'd want to discuss with spouse first" },
                                    { id: "exploring", label: "Just exploring right now" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("investment", option.id)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-xl border transition-all text-sm",
                                            formData.investment === option.id
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                                : "border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                formData.investment === option.id ? "border-emerald-500" : "border-gray-300"
                                            )}>
                                                {formData.investment === option.id && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                            </div>
                                            {option.label}
                                        </div>
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
                            className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg"
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
