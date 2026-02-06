"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Activity,
    Heart,
    Scale,
    Shield,
    Leaf,
    Briefcase,
    Stethoscope,
    GraduationCap,
    Users,
    DollarSign,
    Target,
    Sparkles,
    LucideIcon,
    CheckCircle2,
    // New icons for Hormozi 11-question quiz
    Zap,
    Compass,
    UserCheck,
    Brain,
    Dumbbell,
    BookOpen,
    Home,
    Flame,
    LogOut,
    Plus,
    Clock,
    HelpCircle,
    Star,
    AlertTriangle,
    Award,
    Calendar,
    Search,
    TrendingUp,
    Rocket,
    Hourglass,
    AlertCircle,
    TrendingDown,
    Minus,
    Wallet,
    Unlock,
    CheckCircle,
} from "lucide-react";
import { QuizConfig, QuizOption } from "@/lib/quiz-configs";

// Icon name to component mapping (expanded for Hormozi quiz)
const ICON_MAP: Record<string, LucideIcon> = {
    // Original icons
    Activity, Heart, Scale, Shield, Leaf, Briefcase,
    Stethoscope, GraduationCap, Users, DollarSign, Target, Sparkles,
    // New icons for Hormozi quiz
    Zap, Compass, UserCheck, Brain, Dumbbell, BookOpen, Home, Flame,
    LogOut, Plus, Clock, HelpCircle, Star, AlertTriangle, Award,
    Calendar, Search, TrendingUp, Rocket, Hourglass, AlertCircle,
    TrendingDown, Minus, Wallet, Unlock, CheckCircle,
};

// ============================================
// GOLD METAL BRANDING - AccrediPro Standard
// ============================================
const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";
const WARM_BG = "linear-gradient(180deg, #FDF8F3 0%, #FEF7EC 50%, #FFFBF5 100%)";
const BURGUNDY = "#722f37";
const BURGUNDY_DARK = "#4e1f24";
const GOLD = "#D4AF37";
const GOLD_DARK = "#B8860B";

// Sarah's warm question intros - aligned with Hormozi emotional arc
const SARAH_INTROS: Record<string, string> = {
    // Phase 1: EXCITEMENT (Q1-Q4)
    specialization: "Let's start with something fun — what excites you most?",
    background: "Tell me a bit about yourself...",
    experience: "No judgment here — where are you starting from?",
    motivation: "Understanding your 'why' helps me support you better...",
    // Phase 2: PAIN (Q5)
    pain_point: "This one's important — be honest with yourself...",
    // Phase 3: DESIRE (Q6-Q7)
    start_timeline: "When do you see yourself starting this journey?",
    income_goal: "Dream big here — what would change everything for you?",
    // Phase 4: URGENCY (Q8)
    time_stuck: "This is a reality check moment...",
    // Phase 5: REALITY (Q9-Q10)
    current_income: "Just so I can understand where you're at right now...",
    dream_life: "Close your eyes for a second and picture it...",
    // Phase 6: COMMITMENT (Q11)
    commitment: "Last question — and this one matters...",
};

interface NicheQuizClientProps {
    config: QuizConfig;
    firstName: string;
}

export function NicheQuizClient({ config, firstName }: NicheQuizClientProps) {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = config.questions[currentStep];
    const progress = ((currentStep + 1) / config.questions.length) * 100;

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
        setTimeout(() => {
            if (currentStep < config.questions.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }, 350);
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== config.questions.length) return;
        setIsSubmitting(true);
        try {
            // Calculate qualification score (82-94 per Hormozi spec)
            let score = 85;
            if (answers.commitment === '100-percent') score += 6;
            else if (answers.commitment === 'very-committed') score += 4;
            else if (answers.commitment === 'interested') score += 1;
            if (answers.start_timeline === 'immediately') score += 3;
            else if (answers.start_timeline === '30-days') score += 2;
            score = Math.min(94, Math.max(82, score));

            // Save all quiz answers
            const response = await fetch("/api/mini-diploma/save-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Original fields (for backwards compatibility)
                    healthInterest: answers.specialization,
                    goal: answers.motivation,
                    motivation: answers.motivation,
                    experience: answers.experience,
                    nicheSlug: slug,
                    // New Hormozi fields
                    specialization: answers.specialization,
                    background: answers.background,
                    pain_point: answers.pain_point,
                    start_timeline: answers.start_timeline,
                    income_goal: answers.income_goal,
                    time_stuck: answers.time_stuck,
                    current_income: answers.current_income,
                    dream_life: answers.dream_life,
                    commitment: answers.commitment,
                    qualification_score: score,
                }),
            });
            if (response.ok) {
                // Redirect to results page with all variables for RetellAI
                const params = new URLSearchParams({
                    quiz: 'complete',
                    score: score.toString(),
                    ...answers,
                });
                router.push(`/portal/${slug}/profile?${params.toString()}`);
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastStep = currentStep === config.questions.length - 1;
    const hasCurrentAnswer = answers[currentQuestion.id];
    const sarahIntro = SARAH_INTROS[currentQuestion.id] || "";

    return (
        <div className="min-h-screen flex flex-col" style={{ background: WARM_BG }}>
            {/* Gold Metal Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1.5" style={{ background: "#fef3c7" }}>
                <motion.div
                    className="h-full"
                    style={{ background: GOLD_GRADIENT }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 pt-8">
                <div className="w-full max-w-md">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Sarah's Warm Intro */}
                            {sarahIntro && (
                                <p className="text-sm text-amber-700/80 italic text-center mb-2 px-4">
                                    "{sarahIntro}"
                                </p>
                            )}

                            {/* Question */}
                            <div className="text-center mb-5">
                                <h2
                                    className="text-xl md:text-2xl font-bold mb-1"
                                    style={{ color: BURGUNDY }}
                                >
                                    {currentQuestion.question}
                                </h2>
                                <p className="text-xs text-stone-500">
                                    {currentQuestion.subtitle}
                                </p>
                            </div>

                            {/* Options - Gold Metal Cards */}
                            <div className="flex flex-col gap-2.5">
                                {currentQuestion.options.map((option: QuizOption) => {
                                    const Icon = ICON_MAP[option.iconName] || Activity;
                                    const isSelected = answers[currentQuestion.id] === option.value;

                                    return (
                                        <motion.button
                                            key={option.value}
                                            onClick={() => handleSelect(option.value)}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3"
                                            style={{
                                                background: isSelected
                                                    ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
                                                    : "white",
                                                borderColor: isSelected ? GOLD : "#f5f0e8",
                                                boxShadow: isSelected
                                                    ? `0 4px 16px ${GOLD}25`
                                                    : "0 1px 3px rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: isSelected ? GOLD_GRADIENT : "#fef7e8",
                                                    border: isSelected ? "none" : `1px solid ${GOLD}20`,
                                                }}
                                            >
                                                <Icon
                                                    className="w-5 h-5"
                                                    style={{ color: isSelected ? BURGUNDY : GOLD_DARK }}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="font-semibold text-sm"
                                                    style={{ color: isSelected ? BURGUNDY : "#374151" }}
                                                >
                                                    {option.label}
                                                </div>
                                                <div className="text-xs text-stone-400 mt-0.5">
                                                    {option.description}
                                                </div>
                                            </div>

                                            {/* Check */}
                                            {isSelected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Navigation - Premium */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
                <div
                    className="max-w-md mx-auto flex items-center justify-between p-3 rounded-xl bg-white"
                    style={{
                        border: `1px solid ${GOLD}30`,
                        boxShadow: "0 -2px 16px rgba(0,0,0,0.04)",
                    }}
                >
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentStep === 0 ? "text-stone-300" : "text-stone-600 hover:bg-amber-50"
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {isLastStep && hasCurrentAnswer ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            style={{ background: GOLD_GRADIENT, color: BURGUNDY_DARK }}
                        >
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="w-4 h-4 border-2 border-burgundy-800 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Complete
                                    <Sparkles className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 px-3 py-2 text-sm" style={{ color: hasCurrentAnswer ? GOLD_DARK : "#9ca3af" }}>
                            {hasCurrentAnswer ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Selected
                                </>
                            ) : (
                                <>
                                    Select an option
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
