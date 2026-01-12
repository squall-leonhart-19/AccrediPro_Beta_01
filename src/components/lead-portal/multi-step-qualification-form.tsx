"use client";

import { useState } from "react";
import {
    ArrowRight, CheckCircle2, Loader2,
    User, Mail, Phone, Lock, ChevronRight,
    HeartPulse, Baby, Briefcase, DollarSign,
    Users, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Types for form data
export type QualificationData = {
    // Step 1: Qualification
    lifeStage: string;
    motivation: string;
    investment: string;

    // Step 2: Contact
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
        lifeStage: "",
        motivation: "",
        investment: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    const updateField = (field: keyof QualificationData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (formData.lifeStage && formData.motivation && formData.investment) {
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

    // Validation for Step 1
    const isStep1Valid = formData.lifeStage && formData.motivation && formData.investment;

    // Validation for Step 2
    const isStep2Valid = formData.firstName && formData.lastName && formData.email && formData.phone.length > 9;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 border-b border-gray-100 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                    <span className={cn(step >= 1 ? "text-burgundy-700" : "")}>Step 1: Qualification</span>
                    <span className={cn(step >= 2 ? "text-burgundy-700" : "")}>Step 2: Access</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-burgundy-600 h-full transition-all duration-500 ease-out"
                        style={{ width: step === 1 ? "50%" : "100%" }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Tell Us About You</h3>
                            <p className="text-gray-500 text-sm mt-1">We customize your roadmap based on your answers.</p>
                        </div>

                        {/* Question 1: Life Stage */}
                        <div className="space-y-3">
                            <Label className="text-base text-gray-800 font-semibold flex items-center gap-2">
                                <Baby className="w-4 h-4 text-burgundy-600" />
                                What stage of life are you in?
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: "parents", label: "Kids still at home", icon: "🏡" },
                                    { id: "empty-nest", label: "Empty nest approaching", icon: "🕊️" },
                                    { id: "caregiver", label: "Caring for aging parents", icon: "🤝" },
                                    { id: "rebuilding", label: "Rebuilding after change", icon: "🌱" },
                                    { id: "ready-now", label: "Ready for next chapter", icon: "🚀" }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => updateField("lifeStage", option.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:bg-burgundy-50",
                                            formData.lifeStage === option.id
                                                ? "border-burgundy-600 bg-burgundy-50 text-burgundy-900 ring-1 ring-burgundy-600"
                                                : "border-gray-200 text-gray-600 hover:border-burgundy-200"
                                        )}
                                    >
                                        <span className="text-lg">{option.icon}</span>
                                        <span className="text-sm font-medium">{option.label}</span>
                                        {formData.lifeStage === option.id && (
                                            <CheckCircle2 className="w-4 h-4 text-burgundy-600 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2: Motivation */}
                        <div className="space-y-3">
                            <Label className="text-base text-gray-800 font-semibold flex items-center gap-2">
                                <Target className="w-4 h-4 text-burgundy-600" />
                                What's pulling you toward this?
                            </Label>
                            <div className="relative">
                                <select
                                    value={formData.motivation}
                                    onChange={(e) => updateField("motivation", e.target.value)}
                                    className="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl appearance-none bg-white text-gray-700 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="" disabled>Select your primary motivation...</option>
                                    <option value="burnout">Burned out from current career</option>
                                    <option value="health-journey">My health journey changed me</option>
                                    <option value="flexibility">Want flexibility around family</option>
                                    <option value="purpose">Looking for purpose and meaning</option>
                                    <option value="income">Need additional/new income source</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Question 3: Investment */}
                        <div className="space-y-3">
                            <Label className="text-base text-gray-800 font-semibold flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-burgundy-600" />
                                If this felt right, could you invest in yourself?
                            </Label>
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
                                            "w-full text-left p-3 rounded-xl border transition-all text-sm hover:bg-burgundy-50",
                                            formData.investment === option.id
                                                ? "border-burgundy-600 bg-burgundy-50 text-burgundy-900"
                                                : "border-gray-200 text-gray-600 hover:border-burgundy-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                formData.investment === option.id ? "border-burgundy-600" : "border-gray-300"
                                            )}>
                                                {formData.investment === option.id && <div className="w-2 h-2 rounded-full bg-burgundy-600" />}
                                            </div>
                                            {option.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                            className="w-full h-14 text-lg font-bold bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-xl"
                        >
                            Continue to Step 2
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Where should we send your diploma?</h3>
                            <p className="text-gray-500 text-sm mt-1">Instant access granted upon submission.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)}
                                        className="pl-9 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => updateField("lastName", e.target.value)}
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className="pl-9 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone for Coach Support</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                <div className="absolute left-9 top-3.5 text-gray-500 font-medium border-r border-gray-300 pr-2 mr-2 text-sm leading-none h-5 flex items-center">
                                    🇺🇸 +1
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        // Only allow numbers and dashes
                                        const clean = e.target.value.replace(/[^0-9-]/g, '');
                                        updateField("phone", clean);
                                    }}
                                    className="pl-24 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    placeholder="555-0123"
                                />
                            </div>
                            <p className="text-xs text-gray-400">Sarah will text you directly with your access link</p>
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
                            className="w-full h-14 text-lg font-bold bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-xl shadow-lg shadow-burgundy-100 hover:shadow-xl transition-all"
                        >
                            {isVerifying ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying Credentials...
                                </span>
                            ) : isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Student Portal...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Unlock Access Now
                                    <Lock className="w-4 h-4" />
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-4 pt-2">
                            <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">
                                ← Back
                            </button>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                256-bit Secure Encryption
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
