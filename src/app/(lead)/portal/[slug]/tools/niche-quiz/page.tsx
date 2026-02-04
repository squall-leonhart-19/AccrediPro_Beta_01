"use client";

import { useState } from "react";
import { Target, ChevronRight, Sparkles, CheckCircle } from "lucide-react";

const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "What draws you most to functional medicine?",
        options: [
            { id: "a", text: "Helping people find root causes of health issues", niche: "root-cause" },
            { id: "b", text: "Working with women on hormonal balance", niche: "womens-health" },
            { id: "c", text: "Digestive health and gut healing", niche: "gut-health" },
            { id: "d", text: "Overall wellness and prevention", niche: "wellness" },
        ],
    },
    {
        id: 2,
        question: "Which clients excite you most?",
        options: [
            { id: "a", text: "Busy professionals who need energy", niche: "executive-wellness" },
            { id: "b", text: "Women in perimenopause/menopause", niche: "womens-health" },
            { id: "c", text: "People with chronic fatigue or autoimmune", niche: "root-cause" },
            { id: "d", text: "Health-conscious moms and families", niche: "family-wellness" },
        ],
    },
    {
        id: 3,
        question: "Your ideal work style?",
        options: [
            { id: "a", text: "Deep 1:1 consultations", niche: "high-ticket" },
            { id: "b", text: "Group programs with community", niche: "group-programs" },
            { id: "c", text: "Mix of both", niche: "hybrid" },
            { id: "d", text: "Online courses and passive income", niche: "digital" },
        ],
    },
    {
        id: 4,
        question: "What's your background?",
        options: [
            { id: "a", text: "Healthcare professional (nurse, PA, etc.)", niche: "clinical" },
            { id: "b", text: "Wellness/fitness background", niche: "wellness" },
            { id: "c", text: "Personal health journey motivated me", niche: "personal-story" },
            { id: "d", text: "Career changer - totally new field", niche: "career-change" },
        ],
    },
];

const NICHE_RESULTS: Record<string, { title: string; description: string; earnings: string }> = {
    "womens-health": {
        title: "Women's Hormonal Health Coach",
        description: "You're perfectly positioned to help women navigate perimenopause, menopause, and hormonal balance. This is one of the highest-demand niches!",
        earnings: "$6,000 - $12,000/month",
    },
    "root-cause": {
        title: "Root Cause Health Detective",
        description: "Your analytical mind is perfect for helping clients uncover the underlying causes of their symptoms. Deep consultation work awaits!",
        earnings: "$8,000 - $15,000/month",
    },
    "gut-health": {
        title: "Gut Health Specialist",
        description: "The gut-health market is booming! Your focus on digestive wellness positions you for a highly specialized, in-demand practice.",
        earnings: "$5,000 - $10,000/month",
    },
    "executive-wellness": {
        title: "Executive Wellness Coach",
        description: "Busy professionals will pay premium prices for your expertise. This high-ticket niche is perfect for your business-minded approach!",
        earnings: "$10,000 - $20,000/month",
    },
    default: {
        title: "Holistic Health Coach",
        description: "Your diverse interests position you for a flexible practice serving clients across multiple health areas. Start broad, then specialize!",
        earnings: "$4,000 - $8,000/month",
    },
};

export default function NicheQuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (niche: string) => {
        const newAnswers = [...answers, niche];
        setAnswers(newAnswers);

        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const getResult = () => {
        // Find most common answer
        const counts: Record<string, number> = {};
        answers.forEach(a => {
            counts[a] = (counts[a] || 0) + 1;
        });
        const topNiche = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
        return NICHE_RESULTS[topNiche] || NICHE_RESULTS.default;
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowResult(false);
    };

    if (showResult) {
        const result = getResult();
        return (
            <div className="min-h-screen py-8 px-4 md:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Result Card */}
                    <div className="bg-gradient-to-br from-[#722f37] to-[#4e1f24] rounded-2xl p-8 text-white text-center shadow-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Your Ideal Niche:</h1>
                        <h2 className="text-3xl font-bold text-[#d4af37] mb-4">{result.title}</h2>
                        <p className="text-white/80 mb-6">{result.description}</p>

                        <div className="bg-white/10 rounded-xl p-4 mb-6">
                            <p className="text-sm text-white/60 mb-1">Earning Potential</p>
                            <p className="text-2xl font-bold text-[#d4af37]">{result.earnings}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Based on your answers to {QUIZ_QUESTIONS.length} questions</span>
                        </div>

                        <button
                            onClick={resetQuiz}
                            className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors font-medium"
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = QUIZ_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#722f37]/10 text-[#722f37] text-sm font-medium mb-4">
                        <Target className="w-4 h-4" />
                        Niche Clarity Quiz
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Find Your Perfect Specialty
                    </h1>
                    <p className="text-gray-600">
                        Answer 4 quick questions to discover your ideal niche
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                            }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {question.question}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.niche)}
                                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all group flex items-center justify-between"
                            >
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                    {option.text}
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37] transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
