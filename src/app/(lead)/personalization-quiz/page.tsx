"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Heart, Target, Briefcase, GraduationCap, Users, Clock, DollarSign, Stethoscope, Leaf, Scale, Shield, Activity } from "lucide-react";

const QUIZ_STEPS = [
    {
        id: "healthInterest",
        question: "What area of health interests you most?",
        subtitle: "This helps us personalize your learning journey",
        options: [
            { value: "gut-health", label: "Gut Health", icon: Activity, description: "Digestive wellness & microbiome" },
            { value: "womens-health", label: "Women's Health", icon: Heart, description: "Hormones, fertility & menopause" },
            { value: "weight-management", label: "Weight Management", icon: Scale, description: "Metabolism & body composition" },
            { value: "autoimmune", label: "Autoimmune", icon: Shield, description: "Immune system & inflammation" },
            { value: "general-wellness", label: "General Wellness", icon: Leaf, description: "Holistic health approach" },
        ],
    },
    {
        id: "goal",
        question: "What's your goal?",
        subtitle: "Everyone's path is different - we want to support yours",
        options: [
            { value: "start-practice", label: "Start a Practice", icon: Briefcase, description: "Build a new health coaching career" },
            { value: "add-to-practice", label: "Add to Existing Practice", icon: Stethoscope, description: "Expand your current services" },
            { value: "personal-knowledge", label: "Personal Knowledge", icon: GraduationCap, description: "Learn for yourself & family" },
        ],
    },
    {
        id: "motivation",
        question: "What's driving you?",
        subtitle: "Understanding your 'why' helps us keep you motivated",
        options: [
            { value: "time-with-family", label: "More Time with Family", icon: Users, description: "Flexible schedule & work-life balance" },
            { value: "help-others", label: "Help Others Heal", icon: Heart, description: "Make a real difference in people's lives" },
            { value: "financial-freedom", label: "Financial Freedom", icon: DollarSign, description: "Build sustainable income" },
            { value: "career-change", label: "Career Change", icon: Target, description: "Transition to meaningful work" },
        ],
    },
    {
        id: "experience",
        question: "What's your background?",
        subtitle: "We'll adjust the content to match your experience level",
        options: [
            { value: "beginner", label: "Complete Beginner", icon: Sparkles, description: "New to health & wellness" },
            { value: "some-background", label: "Some Health Background", icon: GraduationCap, description: "Self-taught or personal interest" },
            { value: "healthcare-professional", label: "Healthcare Professional", icon: Stethoscope, description: "RN, MD, therapist, etc." },
        ],
    },
];

export default function PersonalizationQuizPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = QUIZ_STEPS[currentStep];
    const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

        // Auto-advance after selection (with delay for animation)
        setTimeout(() => {
            if (currentStep < QUIZ_STEPS.length - 1) {
                setCurrentStep(prev => prev + 1);
            }
        }, 300);
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== QUIZ_STEPS.length) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/mini-diploma/save-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(answers),
            });

            if (response.ok) {
                // Redirect to dashboard with success message
                router.push("/functional-medicine-diploma?quiz=complete");
            } else {
                console.error("Failed to save quiz");
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLastStep = currentStep === QUIZ_STEPS.length - 1;
    const hasCurrentAnswer = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="h-1 bg-amber-100">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="pt-8 pb-4 px-4 text-center">
                <p className="text-amber-600 font-medium text-sm mb-1">
                    Step {currentStep + 1} of {QUIZ_STEPS.length}
                </p>
                <h1 className="text-2xl font-bold text-gray-900">
                    Let&apos;s Get to Know You
                </h1>
            </div>

            {/* Question Area */}
            <div className="flex-1 flex items-center justify-center px-4 pb-24">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {currentQuestion.question}
                            </h2>
                            <p className="text-gray-500 mb-8">
                                {currentQuestion.subtitle}
                            </p>

                            <div className="grid gap-3">
                                {currentQuestion.options.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = answers[currentQuestion.id] === option.value;

                                    return (
                                        <motion.button
                                            key={option.value}
                                            onClick={() => handleSelect(option.value)}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`
                                                relative p-5 rounded-xl border-2 text-left transition-all
                                                flex items-center gap-4
                                                ${isSelected
                                                    ? "border-amber-500 bg-amber-50 shadow-lg shadow-amber-100"
                                                    : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-md"
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                                                ${isSelected ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"}
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">
                                                    {option.label}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {option.description}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
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

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                            ${currentStep === 0
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-100"
                            }
                        `}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {isLastStep && hasCurrentAnswer && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-200 hover:shadow-xl transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Start My Journey
                                    <Sparkles className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    )}

                    {!isLastStep && hasCurrentAnswer && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            className="flex items-center gap-2 px-4 py-2 text-amber-600 font-medium hover:bg-amber-50 rounded-lg"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    );
}
