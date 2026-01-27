"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ISIHeader } from "@/components/layout/isi-header";
import { ISIFooter } from "@/components/layout/isi-footer";
import {
    ArrowRight,
    Heart,
    Users,
    Brain,
    Sparkles,
    Baby,
    Home,
    FlaskConical,
    Dog,
    CheckCircle,
} from "lucide-react";

const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
};

const questions = [
    {
        id: 1,
        question: "What area of health are you most passionate about?",
        options: [
            { label: "Women's Health & Hormones", value: "womens-health", icon: Heart },
            { label: "Gut Health & Digestion", value: "gut-health", icon: FlaskConical },
            { label: "Mind-Body & Mental Wellness", value: "mind-body", icon: Brain },
            { label: "Nutrition & Weight Management", value: "nutrition", icon: Sparkles },
            { label: "Family & Parenting", value: "parenting", icon: Baby },
            { label: "Pet & Animal Wellness", value: "pet-wellness", icon: Dog },
        ],
    },
    {
        id: 2,
        question: "What's your current professional background?",
        options: [
            { label: "Healthcare Professional (Nurse, PT, Doctor)", value: "healthcare", icon: Heart },
            { label: "Wellness/Fitness Industry", value: "wellness", icon: Users },
            { label: "Complete Career Changer", value: "career-change", icon: Sparkles },
            { label: "Already a Coach/Practitioner", value: "coach", icon: CheckCircle },
            { label: "Stay-at-Home Parent", value: "parent", icon: Home },
        ],
    },
    {
        id: 3,
        question: "What's your main goal with certification?",
        options: [
            { label: "Start my own practice", value: "practice", icon: Home },
            { label: "Add to my existing services", value: "add-services", icon: Sparkles },
            { label: "Career change to wellness", value: "career-change", icon: ArrowRight },
            { label: "Personal knowledge first", value: "personal", icon: Brain },
            { label: "Help family & friends", value: "family", icon: Heart },
        ],
    },
    {
        id: 4,
        question: "How much time can you dedicate weekly?",
        options: [
            { label: "5-10 hours (self-paced)", value: "5-10", icon: Sparkles },
            { label: "10-15 hours (moderate pace)", value: "10-15", icon: Users },
            { label: "15-20+ hours (accelerated)", value: "15-20", icon: ArrowRight },
        ],
    },
];

const recommendations: Record<string, { title: string; slug: string; description: string }> = {
    "womens-health": {
        title: "Women's Health Specialist",
        slug: "/womens-health-mini-diploma",
        description: "Help women optimize hormones, navigate menopause, and thrive at every life stage.",
    },
    "gut-health": {
        title: "Gut Health Specialist",
        slug: "/gut-health-mini-diploma",
        description: "Master the gut-body connection and help clients restore digestive wellness.",
    },
    "mind-body": {
        title: "Mind-Body Medicine Coach",
        slug: "/certifications/mind-body",
        description: "Integrate mental and physical wellness for whole-person healing.",
    },
    "nutrition": {
        title: "Holistic Nutrition Coach",
        slug: "/holistic-nutrition-mini-diploma",
        description: "Transform lives through evidence-based nutrition and behavior change.",
    },
    "parenting": {
        title: "Conscious Parenting Coach",
        slug: "/certifications",
        description: "Support families with gentle, evidence-based parenting approaches.",
    },
    "pet-wellness": {
        title: "Pet Wellness Specialist",
        slug: "/certifications",
        description: "Help pet owners optimize their companion animals' health naturally.",
    },
};

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (value: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const getRecommendation = () => {
        const primaryInterest = answers[0] || "womens-health";
        return recommendations[primaryInterest] || recommendations["womens-health"];
    };

    const recommendation = getRecommendation();
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-white">
            <ISIHeader />

            {/* Quiz Section */}
            <section className="py-12 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    {!showResults ? (
                        <>
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-2" style={{ color: BRAND.burgundy }}>
                                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                                    <span>{Math.round(progress)}% complete</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%`, background: BRAND.goldMetallic }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: BRAND.burgundy }}>
                                    {questions[currentQuestion].question}
                                </h2>

                                <div className="space-y-4">
                                    {questions[currentQuestion].options.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleAnswer(option.value)}
                                                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center gap-4 text-left group"
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: `${BRAND.gold}20` }}
                                                >
                                                    <Icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                                                </div>
                                                <span className="font-medium text-lg" style={{ color: BRAND.burgundy }}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {currentQuestion > 0 && (
                                    <button
                                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                        className="mt-6 text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        ← Go back
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Results */
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                            <div
                                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: BRAND.goldMetallic }}
                            >
                                <CheckCircle className="w-10 h-10" style={{ color: BRAND.burgundyDark }} />
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                                Your Perfect Match
                            </h2>

                            <p className="text-gray-600 mb-8">
                                Based on your answers, we recommend:
                            </p>

                            <div
                                className="p-6 rounded-2xl mb-8"
                                style={{ backgroundColor: `${BRAND.gold}10`, border: `2px solid ${BRAND.gold}` }}
                            >
                                <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND.burgundy }}>
                                    {recommendation.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{recommendation.description}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={recommendation.slug}>
                                    <Button
                                        size="lg"
                                        className="font-bold text-lg px-8 py-6 h-auto shadow-xl hover:opacity-90"
                                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                                    >
                                        Start Free Mini-Diploma
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/certifications">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="font-bold text-lg px-8 py-6 h-auto"
                                        style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}
                                    >
                                        Browse All Certifications
                                    </Button>
                                </Link>
                            </div>

                            <button
                                onClick={() => {
                                    setCurrentQuestion(0);
                                    setAnswers({});
                                    setShowResults(false);
                                }}
                                className="mt-6 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <ISIFooter />
        </div>
    );
}
