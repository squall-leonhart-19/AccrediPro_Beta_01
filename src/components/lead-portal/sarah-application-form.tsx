"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    ArrowRight, ArrowLeft, Loader2,
    User, Mail, Phone, Heart, Sparkles, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types for form data
export interface SarahApplicationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    background: string;
    motivation: string;
    workCost: string;
    holdingBack: string;
    successGoal: string;
    timeAvailable: string;
    investmentRange: string;
    readiness: string;
}

interface SarahApplicationFormProps {
    onSubmit: (data: SarahApplicationData) => Promise<void>;
    onAccepted?: () => void; // Called when user clicks "Start Learning" after acceptance
    isSubmitting: boolean;
    isVerifying?: boolean;
}

// Brand colors - Premium professional palette
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdfbf7",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    goldBorder: "linear-gradient(135deg, #d4af37, #f7e7a0, #d4af37, #b8860b)",
    // Professional medical palette
    navy: "#1e3a5f",
    navyLight: "#2d4a6f",
    teal: "#0d6e6e",
    tealLight: "#0f8585",
    goldSubtle: "#f8f4e8",
};

// Testimonials matched to Q3 (workCost) answers
const COST_TESTIMONIALS: Record<string, { quote: string; name: string; location: string }> = {
    "missing-family": {
        quote: "I missed my son's first steps because I was on shift. That was the moment I knew something had to change.",
        name: "Maria, 52",
        location: "Texas"
    },
    "exhausted": {
        quote: "I came home every night with nothing left to give. My kids got the worst of me. Not anymore.",
        name: "Christine, 49",
        location: "Michigan"
    },
    "working-holidays": {
        quote: "I worked Christmas for 11 years straight. Last year I was home. That's what this gave me.",
        name: "Jennifer, 51",
        location: "North Carolina"
    },
    "feeling-stuck": {
        quote: "I kept waiting for the 'right time.' Turns out the right time was when I finally decided I deserved more.",
        name: "Linda, 54",
        location: "Arizona"
    },
    "lost-myself": {
        quote: "I didn't recognize myself anymore. This helped me find her again.",
        name: "Susan, 48",
        location: "California"
    },
    "health-suffering": {
        quote: "My body was telling me to stop. I finally listened.",
        name: "Donna, 50",
        location: "Pennsylvania"
    },
};

// Questions data
const QUESTIONS = [
    // INTRO
    {
        id: "intro",
        type: "intro",
        step: 1,
    },
    // Q1 - Background
    {
        id: "background",
        type: "radio",
        step: 2,
        field: "background",
        title: "Q1 — Your Background",
        subtitle: "Tell me a little about where you're coming from.\nThere's no \"right\" answer — I just want to understand your starting point.",
        options: [
            { value: "healthcare", label: "Healthcare professional (RN, LPN, NP, therapist)", icon: "🩺" },
            { value: "wellness", label: "Wellness practitioner or coach", icon: "🧘" },
            { value: "educator", label: "Educator or support professional", icon: "📚" },
            { value: "transition", label: "Career transition or returning to work", icon: "🦋" },
            { value: "other", label: "Other professional background", icon: "💼" },
        ],
    },
    // Q2 - Motivation
    {
        id: "motivation",
        type: "radio",
        step: 3,
        field: "motivation",
        title: "Q2 — Why Functional Medicine",
        subtitle: "What's drawing you toward this work?\nBe honest — it helps me understand if we're right for each other.",
        options: [
            { value: "help-heal", label: "I want to help people heal in ways traditional medicine can't", icon: "💚" },
            { value: "own-journey", label: "I've been through my own health journey and want to help others", icon: "🌱" },
            { value: "burnout", label: "I'm burned out and need more meaningful work", icon: "🔥" },
            { value: "flexibility", label: "I want flexible work I can build around my life", icon: "⏰" },
            { value: "new-chapter", label: "I'm ready for a new chapter and this feels right", icon: "✨" },
        ],
    },
    // Q3 - Work Costs (with testimonial)
    {
        id: "workCost",
        type: "radio-testimonial",
        step: 4,
        field: "workCost",
        title: "Q3 — What This Has Been Costing You",
        subtitle: "When you think about staying where you are, what's it really costing you?\nThis one matters. Take a moment.",
        options: [
            { value: "missing-family", label: "Missing time with my kids or family", icon: "👨‍👩‍👧" },
            { value: "exhausted", label: "Being too exhausted to show up for the people I love", icon: "😰" },
            { value: "working-holidays", label: "Working nights, weekends, or holidays while life passes by", icon: "📅" },
            { value: "feeling-stuck", label: "Feeling stuck without knowing what the next chapter looks like", icon: "🤷" },
            { value: "lost-myself", label: "Losing touch with who I used to be", icon: "🪞" },
            { value: "health-suffering", label: "My health or wellbeing is suffering", icon: "💔" },
        ],
    },
    // Q4 - Holding Back
    {
        id: "holdingBack",
        type: "radio",
        step: 5,
        field: "holdingBack",
        title: "Q4 — What's Been in the Way",
        subtitle: "What's stopped you from making a move until now?\nWhatever it is — you're not alone.",
        options: [
            { value: "unsure-where", label: "Unsure where to start or what's legitimate", icon: "🤔" },
            { value: "tried-before", label: "I've tried programs before that didn't deliver", icon: "😞" },
            { value: "self-doubt", label: "Wondering if I have what it takes", icon: "💭" },
            { value: "investment-concern", label: "Concerned about making the wrong investment", icon: "💰" },
            { value: "ready", label: "Nothing specific — I feel ready to move forward", icon: "✅" },
        ],
    },
    // Q5 - Success Goal
    {
        id: "successGoal",
        type: "radio",
        step: 6,
        field: "successGoal",
        title: "Q5 — Where You Want to Take This",
        subtitle: "If we work together and it works out, what does success look like for you?\nDream a little. I want to know what you're building toward.",
        options: [
            { value: "side-income", label: "Building something meaningful on the side ($3–5K/month)", icon: "🌱" },
            { value: "replace-income", label: "Replacing my income over time ($5–10K/month)", icon: "📈" },
            { value: "full-practice", label: "Creating a full, sustainable practice ($10K+/month)", icon: "🚀" },
        ],
    },
    // Q6 - Time Available
    {
        id: "timeAvailable",
        type: "radio",
        step: 7,
        field: "timeAvailable",
        title: "Q6 — Time You Can Give This",
        subtitle: "How much time could you realistically dedicate each week?\nBe honest with yourself — I'd rather know now so I can guide you properly.",
        options: [
            { value: "few-hours", label: "⏰ A few hours, fitting it around life", icon: "" },
            { value: "part-time", label: "📅 Part-time focus (10–15 hours/week)", icon: "" },
            { value: "priority", label: "💪 Ready to make this a real priority", icon: "" },
        ],
    },
    // Q7 - Investment Range
    {
        id: "investmentRange",
        type: "radio",
        step: 8,
        field: "investmentRange",
        title: "Q7 — Investment Readiness",
        subtitle: "The Foundation Diploma is your starting point — it gives you the fundamentals.\n\nFor women who want to become certified practitioners — earning $5–10K+ part-time — AccrediPro offers structured pathways.\n\nIf you decided to continue beyond foundations, which investment range would you be prepared to make?",
        options: [
            { value: "1k-3k", label: "$1,000 – $3,000 — Structured guidance with steady progress", icon: "📘" },
            { value: "3k-5k", label: "$3,000 – $5,000 — Comprehensive support for serious commitment", icon: "📗" },
            { value: "5k-plus", label: "$5,000+ — Full investment in building a sustainable practice", icon: "📕" },
        ],
        footer: "This isn't a commitment — it helps me understand what guidance is most relevant for you.",
    },
    // Q8 - Readiness
    {
        id: "readiness",
        type: "radio",
        step: 9,
        field: "readiness",
        title: "Q8 — Last One",
        subtitle: "Imagine 8 weeks from now — certified, working from home, present for the moments that matter.\nIf everything I share feels right, are you ready to start?",
        options: [
            { value: "ready", label: "✅ Yes — I'm ready to do this for myself (and my family)", icon: "" },
            { value: "need-time", label: "🤔 I'll need a little time to think", icon: "" },
            { value: "talk-partner", label: "👫 I'd want to talk it over with my partner first", icon: "" },
        ],
    },
    // CONTACT FORM
    {
        id: "contact",
        type: "contact",
        step: 10,
        title: "Almost There!",
        subtitle: "You're almost there, {name}! 💕\nWhere should I send your results?",
    },
];

export function SarahApplicationForm({ onSubmit, onAccepted, isSubmitting, isVerifying }: SarahApplicationFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<SarahApplicationData>>({});
    const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
    const [applicationState, setApplicationState] = useState<"form" | "reviewing" | "accepted">("form");
    const [reviewPhase, setReviewPhase] = useState(0); // For animated review messages

    const totalSteps = QUESTIONS.length;
    const currentQuestion = QUESTIONS[step - 1];
    const progress = applicationState === "form" ? (step / totalSteps) * 100 : 100;

    const handleOptionSelect = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Show testimonial if Q3
        if (field === "workCost") {
            setSelectedTestimonial(value);
        }
    }, []);

    const handleNext = useCallback(() => {
        if (step < totalSteps) {
            setStep(step + 1);
            setSelectedTestimonial(null);
        }
    }, [step, totalSteps]);

    const handleBack = useCallback(() => {
        if (step > 1) {
            setStep(step - 1);
            setSelectedTestimonial(null);
        }
    }, [step]);

    const handleSubmit = async () => {
        await onSubmit(formData as SarahApplicationData);
        // Parent will handle redirect to portal (which shows welcome/review screen)
    };

    // Review messages
    const reviewMessages = [
        "Reading your application...",
        "Checking your background...",
        "Reviewing your goals...",
        "Making my decision..."
    ];

    const renderReviewing = () => (
        <motion.div
            key="reviewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
        >
            <div className="mb-8">
                <Image
                    src="/coach-sarah.webp"
                    alt="Sarah"
                    width={100}
                    height={100}
                    className="rounded-full mx-auto border-4 shadow-lg animate-pulse"
                    style={{ borderColor: BRAND.gold }}
                />
            </div>

            <div className="mb-6">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: BRAND.burgundy }} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    One moment, {formData.firstName}...
                </h3>
                <motion.p
                    key={reviewPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-600"
                >
                    {reviewMessages[reviewPhase]}
                </motion.p>
            </div>

            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                I personally review every application to make sure we're a fit.
            </p>
        </motion.div>
    );

    const renderAccepted = () => (
        <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
        >
            {/* Celebration animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mb-6"
            >
                <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}>
                    <Check className="w-10 h-10 text-white" />
                </div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-black text-gray-900 mb-3"
            >
                🎉 Congratulations, {formData.firstName}!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-medium mb-6"
                style={{ color: BRAND.burgundy }}
            >
                AccrediPro Institute just accepted your application.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 max-w-md mx-auto text-left"
            >
                <p className="text-gray-700 italic mb-4">
                    "{formData.firstName}, based on your background and goals, I can already tell you're exactly the kind of woman I love working with. You're going to do amazing things."
                </p>
                <div className="flex items-center gap-3">
                    <Image
                        src="/coach-sarah.webp"
                        alt="Sarah"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-medium text-gray-900">Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">Founder, AccrediPro Institute</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
            >
                <Button
                    onClick={onAccepted}
                    className="w-full h-14 text-lg font-bold"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Your First Lesson
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-gray-500">
                    ✨ Your spot is reserved for <span className="font-bold">48 hours</span>
                </p>
            </motion.div>
        </motion.div>
    );

    const renderIntro = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
        >
            <div className="mb-6">
                <Image
                    src="/coach-sarah.webp"
                    alt="Sarah"
                    width={80}
                    height={80}
                    className="rounded-full mx-auto border-3 shadow-lg"
                    style={{ borderColor: BRAND.gold }}
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hi{formData.firstName ? ` ${formData.firstName}` : ""}, it's Sarah.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
                I personally review every application to make sure AccrediPro Institute is the right fit — for you and for us.
                Not everyone is accepted, and that's intentional.
            </p>
            <p className="text-gray-500 text-sm mb-8">
                Just a few honest questions. Takes about 90 seconds.
            </p>
            <Button
                onClick={handleNext}
                className="h-14 px-10 text-lg font-bold"
                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
            >
                Let's Begin
                <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
        </motion.div>
    );

    const renderRadio = (showTestimonial = false) => {
        const q = currentQuestion as any;
        const isSelected = (value: string) => formData[q.field as keyof SarahApplicationData] === value;
        return (
            <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-4"
            >
                {/* Premium Question Header */}
                <div className="mb-6">
                    <h3
                        className="text-2xl font-black mb-2"
                        style={{
                            background: BRAND.goldMetallic,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {q.title}
                    </h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{q.subtitle}</p>
                </div>

                <div className="space-y-3 mb-6">
                    {q.options?.map((opt: any) => (
                        <button
                            key={opt.value}
                            onClick={() => handleOptionSelect(q.field, opt.value)}
                            className={cn(
                                "w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 relative",
                                isSelected(opt.value)
                                    ? "bg-gradient-to-r from-[#722f37]/10 to-[#d4af37]/10 shadow-lg"
                                    : "bg-white hover:bg-gray-50"
                            )}
                            style={{
                                border: isSelected(opt.value)
                                    ? "2px solid transparent"
                                    : "2px solid #e5e7eb",
                                backgroundImage: isSelected(opt.value)
                                    ? `linear-gradient(white, white), ${BRAND.goldBorder}`
                                    : undefined,
                                backgroundOrigin: "border-box",
                                backgroundClip: isSelected(opt.value) ? "padding-box, border-box" : undefined,
                            }}
                        >
                            {opt.icon && <span className="text-xl">{opt.icon}</span>}
                            <span className={cn(
                                "font-medium",
                                isSelected(opt.value) ? "text-[#722f37]" : "text-gray-800"
                            )}>{opt.label}</span>
                            {isSelected(opt.value) && (
                                <div
                                    className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{ background: BRAND.goldMetallic }}
                                >
                                    <Check className="w-4 h-4" style={{ color: BRAND.burgundyDark }} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Testimonial for Q3 */}
                {showTestimonial && selectedTestimonial && COST_TESTIMONIALS[selectedTestimonial] && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6"
                    >
                        <p className="text-gray-700 italic mb-2">
                            "{COST_TESTIMONIALS[selectedTestimonial].quote}"
                        </p>
                        <p className="text-sm text-gray-500">
                            — {COST_TESTIMONIALS[selectedTestimonial].name}, {COST_TESTIMONIALS[selectedTestimonial].location}
                        </p>
                    </motion.div>
                )}

                {q.footer && (
                    <p className="text-xs text-gray-500 mb-6">{q.footer}</p>
                )}

                <div className="flex gap-3">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} className="h-12 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        disabled={!formData[q.field as keyof SarahApplicationData]}
                        className="flex-1 h-12 font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Continue
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </motion.div>
        );
    };

    const renderContact = () => (
        <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-4"
        >
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                    <Sparkles className="w-4 h-4" />
                    Almost There!
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    You're almost there, {formData.firstName || "friend"}! 💕
                </h3>
                <p className="text-gray-600 text-sm mt-2">Where should I send your results?</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">First Name *</label>
                        <Input
                            value={formData.firstName || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="First"
                            className="h-12"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Last Name</label>
                        <Input
                            value={formData.lastName || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Last"
                            className="h-12"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                    <Input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="h-12"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone (For access link + support) *</label>
                    <div className="flex">
                        <div className="flex items-center gap-1.5 px-3 h-12 bg-gray-100 border border-r-0 border-gray-200 rounded-l-md text-sm font-medium text-gray-700">
                            <span>🇺🇸</span>
                            <span>+1</span>
                        </div>
                        <Input
                            type="tel"
                            value={formData.phone || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                            className="h-12 rounded-l-none"
                        />
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6 mb-6">
                I personally read every single application. This goes directly to me — not a bot, not a VA. Just me, with a cup of tea, genuinely wanting to know if we're a fit. 💕
            </p>

            <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="h-12 px-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!formData.firstName || !formData.email || !formData.phone || isSubmitting || isVerifying}
                    className="flex-1 h-14 font-bold text-lg"
                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                >
                    {isVerifying ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                            Verifying...
                        </>
                    ) : isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2 w-5 h-5" />
                            Creating Access...
                        </>
                    ) : (
                        <>
                            See If I Qualify
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );

    // Step progress for question steps (not intro or contact)
    const questionStep = currentQuestion.type === "intro" ? 0 :
        currentQuestion.type === "contact" ? 8 :
            (currentQuestion.step || step) - 1;
    const totalQuestionSteps = 8;
    const showStepProgress = applicationState === "form" && currentQuestion.type !== "intro";

    return (
        <div
            className="rounded-2xl shadow-2xl overflow-hidden"
            style={{
                background: "white",
                border: "3px solid transparent",
                backgroundImage: `linear-gradient(white, white), ${BRAND.goldBorder}`,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
            }}
        >
            {/* ═══════════════════════════════════════════════════════════════
                AUTHORITY HEADER — Logo + ASI Badge + Sarah Credentials
            ═══════════════════════════════════════════════════════════════ */}
            <div className="px-4 md:px-6 pt-4 pb-3" style={{ background: BRAND.goldSubtle, borderBottom: `1px solid ${BRAND.gold}30` }}>
                {/* Top Row: Logo + ASI Badge */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/ASI_LOGO-removebg-preview.png"
                            alt="AccrediPro Institute"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="font-bold text-sm" style={{ color: BRAND.burgundy }}>AccrediPro Institute</span>
                    </div>
                    {/* ASI Accreditation Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyLight})`,
                            color: "white"
                        }}
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4" />
                            <path d="M12 2L3 7v7c0 5.25 3.75 10.74 9 12 5.25-1.26 9-6.75 9-12V7l-9-5z" />
                        </svg>
                        ASI Accredited
                    </div>
                </div>

                {/* Sarah Credentials Row */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/coach-sarah.webp"
                        alt="Sarah Mitchell"
                        width={44}
                        height={44}
                        className="rounded-full shadow-md flex-shrink-0"
                        style={{ border: `2px solid ${BRAND.gold}` }}
                    />
                    <div>
                        <p className="font-semibold text-sm" style={{ color: BRAND.burgundy }}>Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">Clinical Director · 20+ Years in Functional Medicine</p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP PROGRESS — Reduces anxiety, shows commitment
            ═══════════════════════════════════════════════════════════════ */}
            {showStepProgress && (
                <div className="px-4 md:px-6 py-3" style={{ background: "linear-gradient(to right, #fafafa, #f5f5f5)" }}>
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium text-gray-600">
                            Step {Math.min(questionStep, totalQuestionSteps)} of {totalQuestionSteps}
                        </span>
                        <span className="text-gray-400">
                            {questionStep >= totalQuestionSteps ? "Final step!" : "Almost there — just a few more questions"}
                        </span>
                    </div>
                    {/* Dot Progress Indicator */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalQuestionSteps }).map((_, i) => (
                            <div
                                key={i}
                                className="h-2 flex-1 rounded-full transition-all duration-300"
                                style={{
                                    background: i < questionStep ? BRAND.goldMetallic :
                                        i === questionStep - 1 ? BRAND.gold : "#e5e7eb"
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                SOCIAL PROOF — Subtle, not salesy
            ═══════════════════════════════════════════════════════════════ */}
            {applicationState === "form" && step === 1 && (
                <div className="px-4 md:px-6 py-2 text-center" style={{ background: "#fefefe", borderBottom: "1px solid #f0f0f0" }}>
                    <p className="text-xs text-gray-500">
                        <span className="text-amber-600">★★★★★</span>
                        {" "}4.9 on Trustpilot · <span className="font-medium text-gray-700">2,400+ women</span> have transformed their careers
                    </p>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                MAIN CONTENT AREA
            ═══════════════════════════════════════════════════════════════ */}
            <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {applicationState === "reviewing" && renderReviewing()}
                    {applicationState === "accepted" && renderAccepted()}
                    {applicationState === "form" && currentQuestion.type === "intro" && renderIntro()}
                    {applicationState === "form" && currentQuestion.type === "radio" && renderRadio(false)}
                    {applicationState === "form" && currentQuestion.type === "radio-testimonial" && renderRadio(true)}
                    {applicationState === "form" && currentQuestion.type === "contact" && renderContact()}
                </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                TRUST FOOTER — Security + Legitimacy
            ═══════════════════════════════════════════════════════════════ */}
            <div className="px-4 md:px-6 py-4" style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0" }}>
                {/* Security Message */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
                    <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Your information is secure and never shared</span>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 mb-3">
                    {/* ASI Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L3 7v7c0 5.25 3.75 10.74 9 12 5.25-1.26 9-6.75 9-12V7l-9-5z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-[10px] font-medium text-gray-600">ASI</span>
                    </div>
                    {/* SSL Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <circle cx="12" cy="16" r="1" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <span className="text-[10px] font-medium text-gray-600">SSL</span>
                    </div>
                    {/* Trustpilot */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white">
                        <span className="text-[10px] text-amber-500">★</span>
                        <span className="text-[10px] font-medium text-gray-600">4.9</span>
                    </div>
                </div>

                {/* Company Details */}
                <p className="text-center text-[10px] text-gray-400">
                    AccrediPro Institute · Tampa, FL · Est. 2019
                </p>
            </div>
        </div>
    );
}
