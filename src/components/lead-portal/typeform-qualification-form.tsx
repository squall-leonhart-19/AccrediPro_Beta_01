"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    ArrowRight, ArrowLeft, Loader2,
    User, Mail, Phone, Heart, Sparkles, Check, Star, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types for form data
export interface TypeformQualificationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    background: string[];
    motivation: string;
    healthJourney: string;
    previousAttempts: string[];
    holdingBack: string[];
    workCosts: string[];
    valuesAlignment: string;
    timeAvailability: string;
    dreamOutcome: string;
    programNeeds: string[];
    decisionStyle: string;
    timing: string;
    commitCohort: boolean;
    commitSerious: boolean;
    commitHonest: boolean;
}

interface TypeformQualificationFormProps {
    onSubmit: (data: TypeformQualificationData) => Promise<void>;
    isSubmitting: boolean;
    isVerifying?: boolean;
}

// Brand colors with metallic gold
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    burgundyLight: "#9a4a54",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdfbf7",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyGold: "linear-gradient(135deg, #722f37 0%, #d4af37 100%)",
};

// Button text varies by step to create momentum
const getButtonText = (step: number, totalSteps: number): string => {
    if (step === 0) return "See If I Qualify...";
    if (step === 1 || step === 2) return "Continue";
    if (step === 3 || step === 4) return "Keep Going";
    if (step === 5) return "Almost There";
    if (step === 6) return "Just One More";
    if (step === 7) return "Last Step";
    return "Continue";
};

// Questions - Sarah's warm intro first, then 15 steps, contact near end
const QUESTIONS = [
    // STEP 1: INTRO
    {
        id: "intro",
        type: "intro",
        step: 1,
    },
    // STEP 2: FIRST NAME
    {
        id: "firstName",
        type: "name",
        step: 2,
        field: "firstName",
        title: "First — What Should I Call You? (I love knowing you personally!)",
        subtitle: "",
        placeholder: "Your first name",
        required: true,
        buttonText: "Let's Begin",
    },
    // STEP 3: BACKGROUND
    {
        id: "background",
        type: "checkbox",
        step: 3,
        field: "background",
        title: "What's your background, {name}?",
        subtitle: "Check everything that applies",
        sarahText: "There's no \"right\" background for this. I've worked with women from every path imaginable. 💕",
        options: [
            { value: "nurse", label: "Nurse (RN, LPN, NP) or nursing background", icon: "🩺" },
            { value: "healthcare", label: "Other healthcare (PT, OT, MA, CNA, allied health)", icon: "⚕️" },
            { value: "wellness", label: "Wellness professional (nutrition, yoga, massage, fitness)", icon: "🧘" },
            { value: "different-field", label: "I work in a completely different field right now", icon: "💼" },
            { value: "home", label: "I'm home with my family (which is absolutely real work)", icon: "🏠" },
            { value: "transition", label: "I'm in a transition — figuring out what's next", icon: "🦋" },
        ],
        required: true,
    },
    // STEP 4: MOTIVATION
    {
        id: "motivation",
        type: "radio",
        step: 4,
        field: "motivation",
        title: "What actually brought you here today?",
        subtitle: "Be real with me. I've heard it all — and lived most of it myself.",
        options: [
            { value: "health-struggle", label: "I've struggled with my own health and traditional medicine let me down", icon: "💔" },
            { value: "burnout", label: "I'm burned out in my current work and craving something meaningful", icon: "🔥" },
            { value: "researching", label: "I've been quietly researching this for a while... finally ready to explore", icon: "🔍" },
            { value: "help-others", label: "I want to help other women the way I wish someone had helped me", icon: "💕" },
            { value: "trusted-referral", label: "Someone I trust mentioned this and it sparked something in me", icon: "👋" },
            { value: "not-sure", label: "Honestly? I'm not entirely sure yet — something just felt right", icon: "✨" },
        ],
        required: true,
    },
    // STEP 5: HEALTH JOURNEY
    {
        id: "healthJourney",
        type: "radio",
        step: 5,
        field: "healthJourney",
        title: "Have you dealt with health challenges that traditional medicine couldn't fully solve?",
        subtitle: "",
        sarahText: "So many of us came to functional medicine because we had to. Our bodies forced us to find another way. 🌿",
        options: [
            { value: "yes-major", label: "Yes — hormones, thyroid, gut issues, fatigue, autoimmune... I've been through it", icon: "😔" },
            { value: "somewhat", label: "Somewhat — I've had some struggles but managed okay", icon: "😐" },
            { value: "loved-one", label: "Not personally, but I've watched someone I love struggle", icon: "💔" },
            { value: "no", label: "Not really — I'm drawn to this for other reasons", icon: "🌟" },
        ],
        required: true,
    },
    // STEP 6: WHAT YOU'VE TRIED (NEW)
    {
        id: "previousAttempts",
        type: "checkbox",
        step: 6,
        field: "previousAttempts",
        title: "When it comes to becoming a coach or getting certified, what's your history?",
        subtitle: "Check anything that sounds familiar",
        sarahText: "No judgment here. I've talked with hundreds of women who checked every single one of these boxes. 💕",
        options: [
            { value: "overwhelmed", label: "I've researched certifications but got overwhelmed or couldn't tell what's legit", icon: "🔍" },
            { value: "price-shocked", label: "I looked into programs but the prices made my heart sink ($5K, $10K, $15K...)", icon: "💸" },
            { value: "didnt-finish", label: "I started something before but couldn't finish (life happened)", icon: "⏸️" },
            { value: "burned", label: "I've been burned by a program that promised everything and delivered nothing", icon: "💔" },
            { value: "long-time", label: "I've thought about this for months — maybe years — but never pulled the trigger", icon: "⏰" },
            { value: "first-time", label: "This is genuinely my first time seriously looking", icon: "🌱" },
        ],
        required: false,
        buttonText: "Keep Going",
    },
    // STEP 7: WHAT'S HOLDING YOU BACK (NEW)
    {
        id: "holdingBack",
        type: "checkbox",
        step: 7,
        field: "holdingBack",
        title: "If you're honest with yourself... what's really been stopping you?",
        subtitle: "Check what resonates",
        sarahText: "I hear these fears every single day. And I've felt most of them myself. 💕",
        options: [
            { value: "imposter", label: "I don't know if I'm smart enough or qualified enough", icon: "🤔" },
            { value: "investment", label: "I'm scared of investing in something that won't actually work", icon: "😰" },
            { value: "credentials", label: "I don't have a medical degree — can I really do this?", icon: "🩺" },
            { value: "income", label: "I'm not sure anyone would actually pay me as a coach", icon: "💰" },
            { value: "time", label: "I don't have hours and hours every week to dedicate to this", icon: "⏰" },
            { value: "burned", label: "I've been let down before and I'm protecting myself", icon: "🛡️" },
            { value: "trust", label: "Honestly, I just haven't found something that felt trustworthy", icon: "❓" },
        ],
        required: false,
        buttonText: "Keep Going",
    },
    // STEP 8: EMOTIONAL PAIN TRIGGER (NEW)
    {
        id: "workCosts",
        type: "checkbox",
        step: 8,
        field: "workCosts",
        title: "Real talk, {name}...",
        subtitle: "What is your current work situation costing you?",
        sarahText: "I know these are heavy. But I need to understand what's really at stake for you. 💕",
        options: [
            { value: "missing-kids-events", label: "Missing my kids' games, recitals, school events", icon: "💔" },
            { value: "too-exhausted", label: "Coming home too exhausted to be present with family", icon: "😴" },
            { value: "missing-dinners", label: "Missing family dinners more than I'm there", icon: "🍽️" },
            { value: "working-holidays", label: "Working holidays, weekends, nights — while life passes by", icon: "📅" },
            { value: "aging-parents", label: "Not able to be there for aging parents who need me", icon: "👵" },
            { value: "guilt", label: "Feeling guilty that I'm not the mom/wife/daughter I want to be", icon: "😢" },
            { value: "relationships-suffering", label: "My relationships are suffering because I have nothing left to give", icon: "💑" },
            { value: "lost-myself", label: "I don't even recognize myself anymore", icon: "🪞" },
        ],
        required: false,
        buttonText: "Keep Going",
    },
    // STEP 9: VALUES ALIGNMENT
    {
        id: "valuesAlignment",
        type: "radio",
        step: 9,
        field: "valuesAlignment",
        title: "Quick check — which statement feels more true to you?",
        subtitle: "",
        sarahText: "This matters. Our entire approach is built on root cause thinking. If that doesn't resonate, we might not be the right fit — and that's okay. 💕",
        options: [
            { value: "root-cause", label: "\"Most chronic health issues have root causes that can be addressed through lifestyle, not just medication\"", icon: "🌿" },
            { value: "doctors-know-best", label: "\"Doctors know best — people should mostly just follow their prescriptions\"", icon: "💊" },
        ],
        required: true,
        disqualifyValue: "doctors-know-best",
    },
    // STEP 10: TIME AVAILABILITY
    {
        id: "timeAvailability",
        type: "radio",
        step: 10,
        field: "timeAvailability",
        title: "What's realistic for you in terms of time?",
        subtitle: "",
        sarahText: "Our program is designed for real women with real lives. Not people with unlimited free time. 💕",
        options: [
            { value: "few-hours", label: "I could carve out a few hours a week if this is the right thing", icon: "⏰" },
            { value: "5-10-hours", label: "I have 5-10 hours a week I could dedicate", icon: "📅" },
            { value: "more-time", label: "I have more time right now — I could really commit to this", icon: "💪" },
            { value: "unpredictable", label: "My life is unpredictable — I need something flexible", icon: "🔄" },
        ],
        required: true,
        buttonText: "Almost There",
    },
    // STEP 11: THE DREAM
    {
        id: "dreamOutcome",
        type: "textarea",
        step: 11,
        field: "dreamOutcome",
        title: "Close your eyes for a second, {name}.",
        subtitle: "If you were certified and actually helping women heal — 90 days from now — what would that change for you?",
        sarahText: "Take your time with this one. It matters. ✨",
        placeholder: "What would your days look like? How would you feel waking up? What would be different? Even a few words helps me understand you better...",
        required: true,
        buttonText: "Just a Few More",
    },
    // STEP 12: WHAT MATTERS IN A PROGRAM
    {
        id: "programNeeds",
        type: "checkbox",
        step: 12,
        field: "programNeeds",
        title: "What would help you actually succeed, {name}?",
        subtitle: "Check what's important to you",
        sarahText: "I built this program around these exact needs. Because I needed them too when I started. 💕",
        options: [
            { value: "self-paced", label: "Learn at my own pace — not a rigid schedule I'll fall behind on", icon: "🐢" },
            { value: "mentorship", label: "Real mentorship — not just videos I watch alone", icon: "👩‍🏫" },
            { value: "community", label: "A community of women who actually get it", icon: "👯" },
            { value: "lifetime", label: "Lifetime access — so I can revisit things when I need to", icon: "♾️" },
            { value: "practical", label: "Practical skills I can actually use with real clients", icon: "🛠️" },
            { value: "support", label: "Someone who answers my questions and doesn't disappear", icon: "💬" },
            { value: "credibility", label: "Certification that's actually recognized and credible", icon: "🏆" },
        ],
        required: false,
    },
    // STEP 13: DECISION MAKING
    {
        id: "decisionStyle",
        type: "radio",
        step: 13,
        field: "decisionStyle",
        title: "When it comes to something like this, what's your process?",
        subtitle: "",
        sarahText: "No wrong answer here — just helps me understand you better. 💕",
        options: [
            { value: "independent", label: "I research thoroughly, sit with it, then make my own decision", icon: "🔍" },
            { value: "processor", label: "I like to talk it through with someone I trust, but the choice is mine", icon: "💬" },
            { value: "spouse", label: "My spouse/partner and I make bigger decisions together", icon: "👫" },
            { value: "overthink", label: "I tend to overthink and sometimes need time to feel ready", icon: "🤯" },
        ],
        required: true,
    },
    // STEP 14: TIMING
    {
        id: "timing",
        type: "radio",
        step: 14,
        field: "timing",
        title: "If everything felt right, when would you want to begin?",
        subtitle: "",
        sarahText: "",
        options: [
            { value: "ready-now", label: "Honestly? I've been waiting for this. I'm ready now.", icon: "🚀", highlight: true },
            { value: "soon", label: "Soon — within the next few weeks", icon: "📆" },
            { value: "need-time", label: "I'd need a little time to prepare myself", icon: "🤔" },
            { value: "not-sure", label: "I'm not sure yet — depends on what I learn", icon: "❓" },
        ],
        required: true,
        buttonText: "Last Step",
    },
    // STEP 15: CONTACT INFO
    {
        id: "contact",
        type: "contact",
        step: 15,
        title: "You're almost there, {name}! 💕",
        subtitle: "Where should I send your results?",
        sarahText: "I personally read every single application. This goes directly to me — not a bot, not a VA. Just me, with a cup of tea, genuinely wanting to know if we're a fit. 💕",
    },
    // STEP 16: COMMITMENTS
    {
        id: "commit",
        type: "commit",
        step: 16,
        title: "One more thing, {name}...",
        sarahText: `I keep our certification groups small. Intentionally. Because I personally follow every single student through this journey. I learn your name. I read your wins. I'm there when things get hard.

That only works if I protect the intimacy of each cohort.

So when a cohort fills, it fills. And when you join, you're making a real commitment — this isn't something you sign up for, drop, and restart over and over.

I'm telling you this because I want you to have real information and know exactly what you're stepping into. 💕`,
        commitments: [
            { field: "commitCohort", label: "I understand the cohort size is limited and I can only register one time. If I'm accepted and don't join this cohort, I would need to reapply for a future one." },
            { field: "commitSerious", label: "I'm serious about this. I want to help women heal — and create professional sustainability (flexibility, autonomy, meaningful work)." },
            { field: "commitHonest", label: "I answered honestly because I want Sarah to actually understand where I'm at." },
        ],
        buttonText: "See If I Qualify To Start Earning as a Coach",
    },
];

export function TypeformQualificationForm({
    onSubmit,
    isSubmitting,
    isVerifying = false,
}: TypeformQualificationFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<TypeformQualificationData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        background: [],
        motivation: "",
        healthJourney: "",
        previousAttempts: [],
        holdingBack: [],
        workCosts: [],
        valuesAlignment: "",
        timeAvailability: "",
        dreamOutcome: "",
        programNeeds: [],
        decisionStyle: "",
        timing: "",
        commitCohort: false,
        commitSerious: false,
        commitHonest: false,
    });
    const [direction, setDirection] = useState(1);

    const currentQuestion = QUESTIONS[currentStep];
    const totalSteps = QUESTIONS.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const updateField = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const toggleArrayField = useCallback((field: string, value: string) => {
        setFormData(prev => {
            const arr = (prev as any)[field] as string[];
            if (arr.includes(value)) {
                return { ...prev, [field]: arr.filter(v => v !== value) };
            } else {
                return { ...prev, [field]: [...arr, value] };
            }
        });
    }, []);

    const canProceed = () => {
        const q = currentQuestion;
        if (q.type === "intro") return true;
        if (q.type === "name" && q.required) {
            return formData.firstName.trim().length >= 2;
        }
        if (q.type === "checkbox" && q.required) {
            return (formData as any)[q.field]?.length > 0;
        }
        if (q.type === "checkbox" && !q.required) {
            return true; // Optional checkboxes can proceed
        }
        if (q.type === "radio" && q.required) {
            return !!(formData as any)[q.field];
        }
        if (q.type === "textarea" && q.required) {
            return (formData as any)[q.field]?.trim().length > 5;
        }
        if (q.type === "contact") {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            return formData.firstName.trim() && formData.email.trim() && formData.email.includes("@") && phoneDigits.length >= 10;
        }
        if (q.type === "commit") {
            return formData.commitCohort && formData.commitSerious && formData.commitHonest;
        }
        return true;
    };

    // Track step changes for analytics
    const trackStep = useCallback(async (stepNum: number, action: "view" | "complete" | "abandon") => {
        const question = QUESTIONS[stepNum];
        try {
            await fetch("/api/track/mini-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: `qualification_step_${action}`,
                    properties: {
                        step: stepNum + 1,
                        stepId: question.id,
                        stepType: question.type,
                        totalSteps,
                        progress: Math.round(((stepNum + 1) / totalSteps) * 100)
                    }
                })
            });
        } catch (e) {
            // Silent fail for tracking
        }
    }, [totalSteps]);

    // Track step views
    useEffect(() => {
        trackStep(currentStep, "view");

        // Track form start on first step
        if (currentStep === 0) {
            fetch("/api/track/mini-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "qualification_form_started",
                    properties: { totalSteps }
                })
            }).catch(() => { });
        }
    }, [currentStep, trackStep, totalSteps]);

    // Track abandonment on page unload
    useEffect(() => {
        const handleUnload = () => {
            if (currentStep > 0 && currentStep < totalSteps - 1) {
                // Use sendBeacon for reliability during page unload
                navigator.sendBeacon("/api/track/mini-diploma", JSON.stringify({
                    event: "qualification_form_abandoned",
                    properties: {
                        lastStep: currentStep + 1,
                        stepId: QUESTIONS[currentStep].id,
                        progress: Math.round(((currentStep + 1) / totalSteps) * 100)
                    }
                }));
            }
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [currentStep, totalSteps]);

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            trackStep(currentStep, "complete");
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!canProceed()) return;
        trackStep(currentStep, "complete");

        // Track form completion
        await fetch("/api/track/mini-diploma", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "qualification_form_completed",
                properties: { totalSteps }
            })
        }).catch(() => { });

        await onSubmit(formData);
    };

    // Keyboard support - Enter triggers continue
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey && currentQuestion.type !== "textarea") {
                if (canProceed()) {
                    e.preventDefault();
                    if (currentStep === totalSteps - 1) {
                        handleSubmit();
                    } else {
                        handleNext();
                    }
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentStep, formData]);

    // Navigation Footer Component - Back left, Continue right
    const NavigationFooter = ({ showBack = true }: { showBack?: boolean }) => {
        // Use custom buttonText from question if available
        const buttonText = (currentQuestion as any).buttonText || getButtonText(currentStep, totalSteps);

        return (
            <div className="flex items-center justify-between gap-4 pt-2">
                {showBack && currentStep > 0 ? (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors py-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        ← Back
                    </button>
                ) : (
                    <div />
                )}
                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    size="lg"
                    className="h-12 px-8 text-base font-bold rounded-xl shadow-lg transition-all min-w-[160px]"
                    style={{
                        background: canProceed() ? BRAND.goldMetallic : "#ddd",
                        color: canProceed() ? BRAND.burgundyDark : "#999"
                    }}
                >
                    {buttonText} <ArrowRight className="ml-1 w-5 h-5" />
                </Button>
            </div>
        );
    };

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
                background: "#fff",
                border: `3px solid transparent`,
                backgroundClip: "padding-box",
                boxShadow: `0 0 0 3px ${BRAND.gold}40, 0 25px 50px -12px rgba(114, 47, 55, 0.25)`,
            }}
        >
            {/* Gold Metallic Header */}
            <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ background: BRAND.goldMetallic }}
            >
                <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">Application</span>
                </div>
                <span className="text-sm font-bold text-white">
                    {currentStep + 1} / {totalSteps}
                </span>
            </div>

            {/* Progress Bar with percentage */}
            <div className="relative">
                <div className="h-1.5 bg-gray-100">
                    <motion.div
                        className="h-full"
                        style={{ background: BRAND.burgundyGold }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>
                <div className="absolute right-2 -bottom-5 text-xs text-gray-400 font-medium">
                    {Math.round(progress)}% complete
                </div>
            </div>

            {/* Question Content */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction < 0 ? 40 : -40 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="p-6 md:p-8 pt-8"
                >
                    {/* Intro Screen */}
                    {currentQuestion.type === "intro" && (
                        <div className="space-y-5">
                            {/* Urgency Banner */}
                            <div className="text-center">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                                    🔥 47 Spots Left This Week • Free for Accepted Applicants
                                </span>
                            </div>

                            {/* Steps */}
                            <div className="flex items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: BRAND.burgundy }}>1</div>
                                    <span className="text-gray-600">Get Access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-500">2</div>
                                    <span className="text-gray-400">Quick Questions</span>
                                </div>
                            </div>

                            {/* Sarah Card */}
                            <div className="bg-gray-50 rounded-xl p-5">
                                <div className="flex items-start gap-4">
                                    <Image
                                        src="/coach-sarah.webp"
                                        alt="Sarah Mitchell"
                                        width={56}
                                        height={56}
                                        className="rounded-full border-2 object-cover flex-shrink-0"
                                        style={{ borderColor: BRAND.gold }}
                                    />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: BRAND.burgundy }}>
                                            FROM SARAH, YOUR COACH
                                        </p>
                                        <p className="text-gray-900 font-semibold">Hey! I'm Sarah 👋</p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            I'll personally guide you through your mini diploma journey.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={handleNext}
                                size="lg"
                                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                See If You Qualify <ArrowRight className="ml-1 w-5 h-5" />
                            </Button>

                            {/* Trust Signals */}
                            <div className="space-y-3">
                                {/* Trustpilot */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#00b67a' }} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">4.9/5</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs font-bold" style={{ color: '#00b67a' }}>★ Trustpilot</span>
                                </div>

                                {/* Security & Stats */}
                                <div className="text-center text-xs text-gray-400">
                                    <span className="inline-flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        256-bit SSL
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>Free for accepted healthcare professionals</span>
                                </div>
                                <p className="text-center text-xs text-gray-400">
                                    312 applied this week • 47 spots left
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Name Input Step */}
                    {currentQuestion.type === "name" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentQuestion.title}
                                </h3>
                            </div>

                            <div className="max-w-sm mx-auto">
                                <Input
                                    type="text"
                                    placeholder={currentQuestion.placeholder}
                                    value={formData.firstName}
                                    onChange={(e) => updateField("firstName", e.target.value)}
                                    className="h-14 text-lg text-center border-2 rounded-xl"
                                    style={{ borderColor: formData.firstName ? BRAND.burgundy : "#e5e7eb" }}
                                    autoFocus
                                />
                            </div>

                            <NavigationFooter showBack={currentStep > 0} />
                        </div>
                    )}

                    {/* Checkbox Questions */}
                    {currentQuestion.type === "checkbox" && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentQuestion.title?.replace("{name}", formData.firstName || "sweet friend")}
                                </h3>
                                <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
                            </div>

                            <div className="grid gap-2.5">
                                {currentQuestion.options?.map((opt) => {
                                    const isSelected = (formData as any)[currentQuestion.field!]?.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => toggleArrayField(currentQuestion.field!, opt.value)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                                                isSelected ? "shadow-md" : "hover:border-gray-300 hover:shadow-sm"
                                            )}
                                            style={{
                                                borderColor: isSelected ? BRAND.burgundy : "#e5e7eb",
                                                backgroundColor: isSelected ? `${BRAND.burgundy}08` : "#fff",
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{opt.icon}</span>
                                                <span className="flex-1 font-medium text-gray-800">{opt.label}</span>
                                                <div
                                                    className="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all"
                                                    style={{
                                                        borderColor: isSelected ? BRAND.burgundy : "#d1d5db",
                                                        backgroundColor: isSelected ? BRAND.burgundy : "transparent",
                                                    }}
                                                >
                                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {currentQuestion.sarahText && (
                                <p className="text-center text-sm text-gray-500 italic">{currentQuestion.sarahText}</p>
                            )}

                            <NavigationFooter />
                        </div>
                    )}

                    {/* Radio Questions - NO auto-advance, manual button only */}
                    {currentQuestion.type === "radio" && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentQuestion.title?.replace("{name}", formData.firstName || "sweet friend")}
                                </h3>
                                {currentQuestion.subtitle && (
                                    <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
                                )}
                            </div>

                            <div className="grid gap-2.5">
                                {currentQuestion.options?.map((opt) => {
                                    const isSelected = (formData as any)[currentQuestion.field!] === opt.value;
                                    const isHighlight = (opt as any).highlight;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => updateField(currentQuestion.field!, opt.value)}
                                            className={cn(
                                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                                                isSelected ? "shadow-md" : "hover:border-gray-300 hover:shadow-sm"
                                            )}
                                            style={{
                                                borderColor: isSelected ? BRAND.burgundy : isHighlight ? BRAND.gold : "#e5e7eb",
                                                backgroundColor: isSelected ? `${BRAND.burgundy}08` : isHighlight ? `${BRAND.gold}08` : "#fff",
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{opt.icon}</span>
                                                <span className="flex-1 font-medium text-gray-800">{opt.label}</span>
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                                                    style={{
                                                        borderColor: isSelected ? BRAND.burgundy : "#d1d5db",
                                                        backgroundColor: isSelected ? BRAND.burgundy : "transparent",
                                                    }}
                                                >
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {currentQuestion.sarahText && (
                                <p className="text-center text-sm text-gray-500 italic">{currentQuestion.sarahText}</p>
                            )}

                            <NavigationFooter />
                        </div>
                    )}

                    {/* Textarea Question */}
                    {currentQuestion.type === "textarea" && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentQuestion.title?.replace("{name}", formData.firstName || "sweet friend")}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">{currentQuestion.subtitle?.replace("{name}", formData.firstName || "sweet friend")}</p>
                            </div>

                            {currentQuestion.sarahText && (
                                <p className="text-center text-sm text-gray-500 italic whitespace-pre-line">{currentQuestion.sarahText}</p>
                            )}

                            <textarea
                                value={(formData as any)[currentQuestion.field!] || ""}
                                onChange={(e) => updateField(currentQuestion.field!, e.target.value)}
                                placeholder={currentQuestion.placeholder}
                                rows={4}
                                className="w-full p-4 border-2 rounded-xl focus:outline-none resize-none text-base transition-colors"
                                style={{
                                    borderColor: (formData as any)[currentQuestion.field!]?.length > 5 ? BRAND.burgundy : "#e5e7eb"
                                }}
                            />

                            <NavigationFooter />
                        </div>
                    )}

                    {/* Contact Info */}
                    {currentQuestion.type === "contact" && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-3"
                                    style={{ background: `${BRAND.gold}20`, color: BRAND.burgundy }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Almost There!
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentQuestion.title?.replace("{name}", formData.firstName || "sweet friend")}
                                </h3>
                                <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
                            </div>

                            <div className="space-y-4 max-w-sm mx-auto">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">First Name *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => updateField("firstName", e.target.value)}
                                                placeholder="First"
                                                className="pl-10 h-12 rounded-xl border-2 text-base"
                                                style={{ borderColor: formData.firstName ? BRAND.burgundy : "#e5e7eb" }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Last Name</label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => updateField("lastName", e.target.value)}
                                            placeholder="Last"
                                            className="h-12 rounded-xl border-2 text-base"
                                            style={{ borderColor: formData.lastName ? BRAND.burgundy : "#e5e7eb" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            placeholder="your@email.com"
                                            className="pl-10 h-12 rounded-xl border-2 text-base"
                                            style={{ borderColor: formData.email.includes("@") ? BRAND.burgundy : "#e5e7eb" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Phone (For access link + support) *</label>
                                    <div className="relative flex">
                                        <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-2 border-r-0 rounded-l-xl text-sm text-gray-600 font-medium" style={{ borderColor: formData.phone.replace(/\D/g, '').length >= 10 ? BRAND.burgundy : "#e5e7eb" }}>
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>🇺🇸 +1</span>
                                        </div>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                            placeholder="(555) 123-4567"
                                            className="h-12 rounded-l-none rounded-r-xl border-2 text-base flex-1"
                                            style={{ borderColor: formData.phone.replace(/\D/g, '').length >= 10 ? BRAND.burgundy : "#e5e7eb" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-500 italic">
                                {currentQuestion.sarahText}
                            </p>

                            <NavigationFooter />
                        </div>
                    )}

                    {/* Commit Screen */}
                    {currentQuestion.type === "commit" && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <h3 className="text-xl md:text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                                    {currentQuestion.title?.replace("{name}", formData.firstName || "sweet friend")}
                                </h3>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                                    {currentQuestion.sarahText}
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                {currentQuestion.commitments?.map((commit) => {
                                    const isChecked = (formData as any)[commit.field];
                                    return (
                                        <button
                                            key={commit.field}
                                            onClick={() => updateField(commit.field, !isChecked)}
                                            className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200"
                                            style={{
                                                borderColor: isChecked ? "#22c55e" : "#e5e7eb",
                                                backgroundColor: isChecked ? "#f0fdf4" : "#fff",
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                                    style={{
                                                        borderColor: isChecked ? "#22c55e" : "#d1d5db",
                                                        backgroundColor: isChecked ? "#22c55e" : "transparent",
                                                    }}
                                                >
                                                    {isChecked && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className="text-gray-700 text-sm leading-relaxed">{commit.label}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Final Submit - Back left, Submit right */}
                            <div className="flex items-center justify-between gap-4 pt-2">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors py-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isSubmitting || isVerifying}
                                    size="lg"
                                    className="h-12 px-6 text-base font-bold rounded-xl shadow-xl transition-all"
                                    style={{
                                        background: canProceed() && !isSubmitting ? BRAND.goldMetallic : "#ddd",
                                        color: canProceed() && !isSubmitting ? BRAND.burgundyDark : "#999"
                                    }}
                                >
                                    {isVerifying ? (
                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying...</>
                                    ) : isSubmitting ? (
                                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</>
                                    ) : (
                                        currentQuestion.buttonText
                                    )}
                                </Button>
                            </div>

                            <p className="text-center text-xs text-gray-400">
                                🔒 Your information is secure and never shared
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
