"use client";

import { useState } from "react";
import { Target, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

interface NicheScorecardProps {
    portalSlug: string;
}

interface Question {
    id: string;
    question: string;
    options: {
        label: string;
        scores: Record<string, number>;
    }[];
}

// Premium ASI Color Palette
const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const NICHES = {
    gut: { name: "Gut Health & Digestion", icon: "🌿", description: "Help clients heal their digestive systems" },
    hormones: { name: "Women's Hormones & Balance", icon: "🌸", description: "Support women through hormonal transitions" },
    stress: { name: "Stress & Adrenal Recovery", icon: "⚡", description: "Guide clients to calm and resilience" },
    autoimmune: { name: "Autoimmune & Inflammation", icon: "🛡️", description: "Address root causes of chronic conditions" },
    metabolic: { name: "Metabolic Health & Energy", icon: "🔥", description: "Optimize energy, weight, and vitality" },
};

const QUESTIONS: Question[] = [
    {
        id: "interest",
        question: "Which health topic excites you the most?",
        options: [
            { label: "Digestive issues, bloating, food sensitivities", scores: { gut: 3, autoimmune: 1 } },
            { label: "Menopause, PMS, thyroid, fertility", scores: { hormones: 3, stress: 1 } },
            { label: "Burnout, anxiety, sleep problems", scores: { stress: 3, metabolic: 1 } },
            { label: "Chronic pain, fatigue, inflammation", scores: { autoimmune: 3, gut: 1 } },
            { label: "Weight, energy, blood sugar", scores: { metabolic: 3, hormones: 1 } },
        ],
    },
    {
        id: "audience",
        question: "Who do you most want to help?",
        options: [
            { label: "Busy professionals and executives", scores: { stress: 2, metabolic: 2 } },
            { label: "Women 35-55 going through life changes", scores: { hormones: 3, stress: 1 } },
            { label: "People struggling with unexplained symptoms", scores: { autoimmune: 2, gut: 2 } },
            { label: "Health-conscious individuals wanting optimization", scores: { metabolic: 2, gut: 2 } },
            { label: "Anyone suffering from chronic conditions", scores: { autoimmune: 2, hormones: 1, gut: 1 } },
        ],
    },
    {
        id: "experience",
        question: "What's your background or experience?",
        options: [
            { label: "Healthcare professional (nurse, therapist, etc.)", scores: { autoimmune: 2, hormones: 2 } },
            { label: "Wellness coach or fitness trainer", scores: { metabolic: 3, stress: 1 } },
            { label: "Personal healing journey survivor", scores: { gut: 2, autoimmune: 2 } },
            { label: "Corporate/business background", scores: { stress: 3, metabolic: 1 } },
            { label: "Complete career change - fresh start", scores: { hormones: 1, gut: 1, stress: 1, metabolic: 1 } },
        ],
    },
    {
        id: "style",
        question: "How would you describe your coaching style?",
        options: [
            { label: "Deep listener, patient, empathetic", scores: { hormones: 2, autoimmune: 2 } },
            { label: "Action-oriented, results-focused", scores: { metabolic: 3, stress: 1 } },
            { label: "Educational, love explaining the science", scores: { gut: 2, autoimmune: 2 } },
            { label: "Calming presence, stress-reducer", scores: { stress: 3, hormones: 1 } },
            { label: "Holistic, big-picture thinker", scores: { gut: 2, hormones: 1, autoimmune: 1 } },
        ],
    },
    {
        id: "passion",
        question: "What drives you to help others?",
        options: [
            { label: "I overcame my own health struggles", scores: { gut: 2, autoimmune: 2 } },
            { label: "I want to empower women specifically", scores: { hormones: 3, stress: 1 } },
            { label: "I believe modern life needs a reset", scores: { stress: 2, metabolic: 2 } },
            { label: "I'm fascinated by root-cause medicine", scores: { autoimmune: 2, gut: 2 } },
            { label: "I want to help people feel alive again", scores: { metabolic: 2, stress: 2 } },
        ],
    },
];

export function NicheScorecard({ portalSlug }: NicheScorecardProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [scores, setScores] = useState<Record<string, number>>({ gut: 0, hormones: 0, stress: 0, autoimmune: 0, metabolic: 0 });
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (optionScores: Record<string, number>) => {
        // Update scores
        const newScores = { ...scores };
        Object.entries(optionScores).forEach(([niche, score]) => {
            newScores[niche] = (newScores[niche] || 0) + score;
        });
        setScores(newScores);
        setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: currentQuestion });

        // Move to next question or show result
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
        }
    };

    const getTopNiche = () => {
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted[0][0] as keyof typeof NICHES;
    };

    const getSecondNiche = () => {
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted[1][0] as keyof typeof NICHES;
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setScores({ gut: 0, hormones: 0, stress: 0, autoimmune: 0, metabolic: 0 });
        setShowResult(false);
    };

    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    if (showResult) {
        const topNiche = getTopNiche();
        const secondNiche = getSecondNiche();
        const nicheData = NICHES[topNiche];
        const secondNicheData = NICHES[secondNiche];

        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Result Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-300">
                        {/* Gold Header */}
                        <div
                            className="p-10 text-center"
                            style={{ background: GOLD_GRADIENT }}
                        >
                            <div className="text-7xl mb-4">{nicheData.icon}</div>
                            <h1 className="text-2xl font-bold text-amber-900 mb-2">Your Perfect Niche</h1>
                            <p className="text-3xl font-bold text-amber-900">{nicheData.name}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Primary Niche */}
                            <div
                                className="rounded-xl p-6 border-2 border-amber-300"
                                style={{ background: 'linear-gradient(135deg, #FEF9E7 0%, #FFF8DC 50%, #FEF9E7 100%)' }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-amber-600" />
                                    <h3 className="font-bold text-amber-900 text-lg">Your #1 Match</h3>
                                </div>
                                <p className="text-gray-700 text-lg">{nicheData.description}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    This niche aligns perfectly with your interests, experience, and coaching style.
                                </p>
                            </div>

                            {/* Secondary Niche */}
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{secondNicheData.icon}</span>
                                    <div>
                                        <p className="text-sm text-gray-500">Also a great fit</p>
                                        <h3 className="font-semibold text-gray-900 text-lg">{secondNicheData.name}</h3>
                                    </div>
                                </div>
                                <p className="text-gray-600">{secondNicheData.description}</p>
                            </div>

                            {/* Why This Matters - Gold Themed */}
                            <div
                                className="rounded-xl p-6 border-2 border-amber-300"
                                style={{ background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%)' }}
                            >
                                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 text-lg">
                                    <Sparkles className="w-5 h-5" />
                                    Why Niche Matters
                                </h3>
                                <ul className="text-base text-amber-800 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span><strong>Stand out:</strong> Generalists compete on price, specialists command premium rates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span><strong>Attract ideal clients:</strong> People seek experts for their specific problem</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600">•</span>
                                        <span><strong>Build authority:</strong> Deep expertise leads to referrals and recognition</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Retake */}
                            <button
                                onClick={resetQuiz}
                                className="w-full text-center text-base text-gray-500 hover:text-gray-700 transition-colors py-2"
                            >
                                ← Retake the quiz
                            </button>
                        </div>

                        {/* CTA Footer - Commented out for later use
                        <div 
                            className="p-6"
                            style={{ background: 'linear-gradient(135deg, #722F37 0%, #5C1F2A 100%)' }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-white">
                                    <p className="font-bold text-lg flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-300" />
                                        Ready to dominate your niche?
                                    </p>
                                    <p className="text-burgundy-200 text-sm">Get certified as a {nicheData.name} specialist</p>
                                </div>
                                <Link
                                    href="/fm-certification"
                                    className="font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    style={{ background: GOLD_GRADIENT, color: '#5C1F2A' }}
                                >
                                    Get Certified
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        */}
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href={`/portal/${portalSlug}/lesson/3`}
                            className="text-base text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Back to Lesson 3
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const question = QUESTIONS[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
                        style={{ background: GOLD_GRADIENT, color: '#5C1F2A' }}
                    >
                        <Target className="w-4 h-4" />
                        Interactive Quiz
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        🎯 Find Your Perfect Niche
                    </h1>
                    <p className="text-lg text-gray-600">
                        Answer 5 quick questions to discover your ideal specialty
                    </p>
                </div>

                {/* Quiz Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-300">
                    {/* Progress Bar - Gold Themed */}
                    <div
                        className="p-6"
                        style={{ background: 'linear-gradient(135deg, #FEF9E7 0%, #FFF8DC 50%, #FEF9E7 100%)' }}
                    >
                        <div className="flex items-center justify-between text-base mb-3">
                            <span className="text-amber-800 font-medium">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                            <span
                                className="font-bold"
                                style={{
                                    background: GOLD_GRADIENT,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                {Math.round(progress)}% complete
                            </span>
                        </div>
                        <div className="h-4 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
                            <div
                                className="h-full transition-all duration-300 rounded-full"
                                style={{
                                    width: `${progress}%`,
                                    background: GOLD_GRADIENT,
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Question */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">{question.question}</h2>

                        {/* Options */}
                        <div className="space-y-4">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(option.scores)}
                                    className="w-full text-left p-5 rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full border-2 border-amber-300 group-hover:border-amber-500 flex items-center justify-center transition-all"
                                            style={{
                                                background: 'linear-gradient(135deg, #FEF9E7 0%, #FFF8DC 100%)',
                                            }}
                                        >
                                            <span className="text-amber-700 group-hover:text-amber-900 font-bold text-lg">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 group-hover:text-amber-900 font-medium text-lg">
                                            {option.label}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Navigation */}
                        {currentQuestion > 0 && (
                            <button
                                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                className="mt-8 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-base"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous question
                            </button>
                        )}
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        href={`/portal/${portalSlug}/lesson/3`}
                        className="text-base text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← Back to Lesson 3
                    </Link>
                </div>
            </div>
        </div>
    );
}
