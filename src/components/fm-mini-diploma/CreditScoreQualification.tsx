"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Target,
    BadgeDollarSign,
    UserCircle2,
    Calendar,
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CreditTier = "UNKNOWN" | "UNDER_620" | "TIER_620_679" | "TIER_680_PLUS";

interface LeadData {
    motivation: string;
    creditTier: CreditTier;
    incomeRange: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function CreditScoreQualification() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<LeadData>({
        motivation: "",
        creditTier: "UNKNOWN",
        incomeRange: "",
        firstName: "",
        lastName: "",
        email: "",
    });

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const steps = [
        {
            title: "Tell Us Your Story",
            description: "Why does helping others heal feel like your calling?",
            icon: Target,
        },
        {
            title: "Financial Profile",
            description: "This helps us match you with the right funding or enrollment path.",
            icon: BadgeDollarSign,
        },
        {
            title: "Final Step",
            description: "Where should we send your qualification results?",
            icon: UserCircle2,
        },
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                const suggestions = [
                    "I want to help people heal their root causes.",
                    "I'm a burnt-out nurse looking for independence.",
                    "I want to fix my own health and then help my family.",
                ];
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="motivation" className="text-lg font-bold">
                                What brought you here today? Why does this feel right in your heart?
                            </Label>
                            <textarea
                                id="motivation"
                                className="w-full min-h-[120px] p-4 rounded-xl border-2 border-gray-100 focus:border-burgundy-500 transition-colors bg-white text-gray-900 placeholder:text-gray-400"
                                placeholder="Share your story briefly..."
                                value={data.motivation}
                                onChange={(e) => setData({ ...data, motivation: e.target.value })}
                            />
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setData({ ...data, motivation: s })}
                                        className="text-xs bg-burgundy-50 text-burgundy-700 px-3 py-1.5 rounded-full hover:bg-burgundy-100 transition whitespace-nowrap"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Label className="text-lg font-bold block">Estimated Credit Score</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { id: "TIER_680_PLUS", label: "680+ (Excellent/Good)", hint: "Qualifies for 0% Interest Financing" },
                                    { id: "TIER_620_679", label: "620 - 679 (Fair)", hint: "Standard Funding Options Available" },
                                    { id: "UNDER_620", label: "Under 620 (Challenged)", hint: "Ask about our Private Scholarships" },
                                    { id: "UNKNOWN", label: "I'm not sure", hint: "We can help you check" },
                                ].map((tier) => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setData({ ...data, creditTier: tier.id as CreditTier })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${data.creditTier === tier.id
                                            ? "border-burgundy-600 bg-burgundy-50 ring-2 ring-burgundy-500/20"
                                            : "border-gray-100 hover:border-burgundy-200"
                                            }`}
                                    >
                                        <div className="font-bold text-gray-900">{tier.label}</div>
                                        <div className="text-xs text-gray-500 mt-1">{tier.hint}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-bold block">Annual Household Income</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {["Under $50k", "$50k - $75k", "$75k - $100k", "$100k - $150k", "$150k+"].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setData({ ...data, incomeRange: range })}
                                        className={`p-3 rounded-xl border-2 text-center transition-all text-sm font-medium ${data.incomeRange === range
                                            ? "border-burgundy-600 bg-burgundy-50"
                                            : "border-gray-100 hover:border-burgundy-200"
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Sarah"
                                    value={data.firstName}
                                    onChange={(e) => setData({ ...data, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Mitchell"
                                    value={data.lastName}
                                    onChange={(e) => setData({ ...data, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Work or Personal Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl flex gap-3 items-start">
                            <Lock className="w-4 h-4 text-gray-400 mt-1" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Your information is encrypted and only used for program qualification. We will never share your data.
                            </p>
                        </div>
                    </div>
                );

            case 4:
                const isHighTier = data.creditTier === "TIER_680_PLUS";
                return (
                    <div className="text-center space-y-6 py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Initial Qualification Complete!</h3>
                            <p className="text-gray-600 max-w-sm mx-auto">
                                Based on your profile, we have identified a specific pathway for you.
                            </p>
                        </div>

                        <Card className="p-6 border-2 border-burgundy-100 bg-burgundy-50/50">
                            {isHighTier ? (
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Tier 1 Qualified
                                    </div>
                                    <h4 className="text-xl font-bold text-burgundy-900">0% Interest Financing Available</h4>
                                    <p className="text-sm text-burgundy-800">
                                        You qualify for our VIP enrollment path. You can start the full $997 certification today for $0 down.
                                    </p>
                                    <Button className="w-full h-12 text-lg bg-burgundy-600 hover:bg-burgundy-700">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Book Qualification Call
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Action Required
                                    </div>
                                    <h4 className="text-xl font-bold text-burgundy-900">Start with the Mini-Diploma</h4>
                                    <p className="text-sm text-burgundy-800">
                                        The best path forward is to complete your Functional Medicine Mini-Diploma first to build your baseline score.
                                    </p>
                                    <Button className="w-full h-12 text-lg bg-burgundy-600 hover:bg-burgundy-700">
                                        Enroll for $27 Now
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return data.motivation.length > 10;
            case 2: return data.creditTier !== "UNKNOWN" || data.incomeRange !== "";
            case 3: return data.firstName !== "" && data.lastName !== "" && data.email.includes("@");
            default: return true;
        }
    };

    return (
        <Card className="max-w-xl mx-auto overflow-hidden shadow-2xl border-0">
            {/* Header / Progress */}
            <div className="bg-gray-900 p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-burgundy-600 rounded-lg flex items-center justify-center font-bold text-sm">
                            AP
                        </div>
                        <span className="font-bold tracking-tight">AccrediPro Qualification</span>
                    </div>
                    <div className="text-xs font-medium text-gray-400 capitalize">
                        Step {step} of 3
                    </div>
                </div>

                {step < 4 && (
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-burgundy-500" : "bg-gray-800"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-8 bg-white min-h-[480px] flex flex-col">
                {step < 4 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-burgundy-50 rounded-xl flex items-center justify-center text-burgundy-600">
                                {steps[step - 1] && (() => {
                                    const StepIcon = steps[step - 1].icon;
                                    return <StepIcon className="w-5 h-5" />;
                                })()}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {steps[step - 1]?.title}
                            </h2>
                        </div>
                        <p className="text-gray-500">{steps[step - 1]?.description}</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>

                {step < 4 && (
                    <div className="mt-10 flex gap-4">
                        {step > 1 && (
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                className="h-12 px-6"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="flex-1 h-12 bg-burgundy-600 hover:bg-burgundy-700 text-lg font-bold"
                        >
                            {step === 3 ? "Complete Qualification" : "Continue"}
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Trust Bar */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                    <div className="flex items-center ml-4 text-[10px] text-gray-500 font-medium">
                        +4,800 Students Qualified This Month
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Verified Secure
                </div>
            </div>
        </Card>
    );
}
