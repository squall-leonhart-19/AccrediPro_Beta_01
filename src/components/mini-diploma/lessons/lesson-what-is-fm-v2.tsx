"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, ChevronDown,
    Lightbulb, TrendingUp, ArrowRight, Sparkles,
    Target, Zap, BookOpen, Award, RotateCcw,
    ThumbsUp, HelpCircle, Brain,
} from "lucide-react";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
}

/**
 * VARIANT 2: Interactive Discovery (Coursera-Style)
 *
 * Design Philosophy:
 * - Gamified micro-interactions (reveal cards, quick checks)
 * - Progress celebration moments
 * - Active learning with "Click to reveal" elements
 * - Coursera/Duolingo-inspired engagement patterns
 * - Bite-sized content chunks
 */
export function LessonWhatIsFMV2({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "Learner",
}: LessonProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [sectionsCompleted, setSectionsCompleted] = useState<number[]>([]);
    const [revealedCards, setRevealedCards] = useState<string[]>([]);
    const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
    const [showQuizFeedback, setShowQuizFeedback] = useState(false);

    const totalSections = 4;
    const progressPercent = (sectionsCompleted.length / totalSections) * 100;

    const handleRevealCard = (cardId: string) => {
        if (!revealedCards.includes(cardId)) {
            setRevealedCards([...revealedCards, cardId]);
        }
    };

    const handleSectionComplete = (sectionNum: number) => {
        if (!sectionsCompleted.includes(sectionNum)) {
            setSectionsCompleted([...sectionsCompleted, sectionNum]);
        }
    };

    const handleQuizAnswer = (answer: string) => {
        setQuizAnswer(answer);
        setShowQuizFeedback(true);
        if (answer === "why") {
            handleSectionComplete(4);
        }
    };

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/30">
            {/* Gamified Progress Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-indigo-100 px-4 py-3 shadow-sm">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900">
                                    {lessonNumber}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Module 1: Foundations</p>
                                <p className="text-xs text-slate-500">What is Functional Medicine?</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">6 min</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-full">
                                <Award className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-semibold text-amber-700">+50 XP</span>
                            </div>
                        </div>
                    </div>

                    {/* Section Progress */}
                    <div className="flex items-center gap-2">
                        <Progress value={progressPercent} className="h-2 flex-1 bg-indigo-100" />
                        <span className="text-xs font-medium text-indigo-600">
                            {sectionsCompleted.length}/{totalSections}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />
                    <div className="relative">
                        <Badge className="bg-white/20 text-white border-0 mb-4">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Lesson {lessonNumber} of {totalLessons}
                        </Badge>
                        <h1 className="text-2xl md:text-3xl font-bold mb-3">
                            Welcome, {firstName}!
                        </h1>
                        <p className="text-white/90 text-lg">
                            Ready to discover the revolutionary approach that's changing healthcare?
                            Let's learn together.
                        </p>
                    </div>
                </div>

                {/* SECTION 1: The Big Question */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${sectionsCompleted.includes(1) ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {sectionsCompleted.includes(1) ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">The Big Question</h2>
                        </div>
                        {sectionsCompleted.includes(1) && (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Complete
                            </Badge>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <p className="text-slate-700 text-lg leading-relaxed mb-6">
                            Imagine you have a persistent headache. What does traditional medicine typically do?
                        </p>

                        {/* Reveal Cards */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleRevealCard('traditional')}
                                className={`text-left transition-all duration-300 ${revealedCards.includes('traditional')
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                    } rounded-xl p-5 border-2`}
                            >
                                {!revealedCards.includes('traditional') ? (
                                    <div className="flex items-center justify-center gap-2 text-slate-500 py-4">
                                        <HelpCircle className="h-5 w-5" />
                                        <span className="font-medium">Tap to reveal</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-red-700 font-semibold text-sm uppercase tracking-wide mb-2">
                                            Traditional Approach
                                        </p>
                                        <p className="text-slate-700">
                                            "Take this painkiller for your headache."
                                        </p>
                                        <p className="text-red-600 text-sm mt-2 font-medium">
                                            → Treats the SYMPTOM
                                        </p>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => handleRevealCard('functional')}
                                className={`text-left transition-all duration-300 ${revealedCards.includes('functional')
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                    } rounded-xl p-5 border-2`}
                            >
                                {!revealedCards.includes('functional') ? (
                                    <div className="flex items-center justify-center gap-2 text-slate-500 py-4">
                                        <HelpCircle className="h-5 w-5" />
                                        <span className="font-medium">Tap to reveal</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-emerald-700 font-semibold text-sm uppercase tracking-wide mb-2">
                                            Functional Medicine
                                        </p>
                                        <p className="text-slate-700">
                                            "What's causing your headaches? Let's find out."
                                        </p>
                                        <p className="text-emerald-600 text-sm mt-2 font-medium">
                                            → Asks WHY
                                        </p>
                                    </>
                                )}
                            </button>
                        </div>

                        {revealedCards.includes('traditional') && revealedCards.includes('functional') && (
                            <div className="animate-fade-in">
                                <Button
                                    onClick={() => handleSectionComplete(1)}
                                    disabled={sectionsCompleted.includes(1)}
                                    className={`w-full ${sectionsCompleted.includes(1)
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {sectionsCompleted.includes(1) ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Section Complete!
                                        </>
                                    ) : (
                                        <>
                                            <ThumbsUp className="h-4 w-4 mr-2" />
                                            Got it! Continue
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 2: The Definition */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${sectionsCompleted.includes(2) ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {sectionsCompleted.includes(2) ? <CheckCircle2 className="h-5 w-5" /> : '2'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">The Definition</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="bg-indigo-50 rounded-xl p-6 mb-6 border border-indigo-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
                                    <Brain className="h-6 w-6 text-indigo-700" />
                                </div>
                                <div>
                                    <p className="font-bold text-indigo-900 text-lg mb-2">Remember This</p>
                                    <p className="text-slate-700 leading-relaxed">
                                        <span className="bg-yellow-200 px-1">Functional Medicine</span> is a
                                        <span className="bg-yellow-200 px-1 mx-1">systems-based approach</span>
                                        that focuses on identifying the
                                        <span className="bg-yellow-200 px-1 mx-1">root cause</span>
                                        of disease.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { icon: Target, label: "Root Cause", desc: "Not symptoms" },
                                { icon: Sparkles, label: "Personalized", desc: "To each person" },
                                { icon: Zap, label: "Systems-Based", desc: "Whole body view" },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                                        <item.icon className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => handleSectionComplete(2)}
                            disabled={sectionsCompleted.includes(2)}
                            className={`w-full ${sectionsCompleted.includes(2)
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                        >
                            {sectionsCompleted.includes(2) ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Section Complete!
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    I understand! Continue
                                </>
                            )}
                        </Button>
                    </div>
                </section>

                {/* SECTION 3: Quick History */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${sectionsCompleted.includes(3) ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {sectionsCompleted.includes(3) ? <CheckCircle2 className="h-5 w-5" /> : '3'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Quick History</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                                <span className="text-2xl font-bold text-indigo-700">1991</span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Dr. Jeffrey Bland</p>
                                <p className="text-slate-500 text-sm">Coined "Functional Medicine"</p>
                            </div>
                        </div>

                        <p className="text-slate-700 mb-4">
                            FM emerged because conventional medicine struggled with <span className="font-semibold">chronic diseases</span>:
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                            {["Diabetes", "Heart disease", "Autoimmune", "Chronic fatigue", "Depression", "Obesity"].map((item) => (
                                <div key={item} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                                    <ChevronRight className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-amber-600" />
                                <p className="text-slate-700">
                                    These conditions affect <span className="font-bold text-amber-700">60%+ adults</span> and
                                    cause <span className="font-bold text-amber-700">90%</span> of healthcare spending.
                                </p>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSectionComplete(3)}
                            disabled={sectionsCompleted.includes(3)}
                            className={`w-full ${sectionsCompleted.includes(3)
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                        >
                            {sectionsCompleted.includes(3) ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Section Complete!
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Got it! Final section
                                </>
                            )}
                        </Button>
                    </div>
                </section>

                {/* SECTION 4: Quick Quiz */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                ${sectionsCompleted.includes(4) ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                                {sectionsCompleted.includes(4) ? <CheckCircle2 className="h-5 w-5" /> : '?'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Quick Check</h2>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700 border-0">
                            <Award className="h-3 w-3 mr-1" />
                            +20 XP
                        </Badge>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 shadow-sm">
                        <p className="text-lg font-semibold text-slate-800 mb-4">
                            Functional Medicine primarily asks which question?
                        </p>

                        <div className="space-y-3 mb-4">
                            {[
                                { id: 'what', text: '"What pill can fix this symptom?"' },
                                { id: 'why', text: '"Why is this happening to THIS person?"' },
                                { id: 'when', text: '"When did this start?"' },
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleQuizAnswer(option.id)}
                                    disabled={showQuizFeedback}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all
                                        ${quizAnswer === option.id
                                            ? option.id === 'why'
                                                ? 'bg-emerald-100 border-emerald-400'
                                                : 'bg-red-100 border-red-400'
                                            : 'bg-white border-slate-200 hover:border-amber-300'
                                        }
                                        ${showQuizFeedback ? 'cursor-default' : 'cursor-pointer'}
                                    `}
                                >
                                    <span className="text-slate-700">{option.text}</span>
                                </button>
                            ))}
                        </div>

                        {showQuizFeedback && (
                            <div className={`p-4 rounded-xl animate-fade-in ${quizAnswer === 'why' ? 'bg-emerald-100' : 'bg-amber-100'
                                }`}>
                                {quizAnswer === 'why' ? (
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-800">Correct!</p>
                                            <p className="text-emerald-700 text-sm">
                                                FM asks "WHY" to find root causes—not just treat symptoms.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <RotateCcw className="h-6 w-6 text-amber-600 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-amber-800">Not quite!</p>
                                            <p className="text-amber-700 text-sm">
                                                The answer is "WHY"—FM focuses on root causes, not just symptoms.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Key Takeaway */}
                <div className="bg-slate-900 rounded-2xl p-6 md:p-8 mb-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <Lightbulb className="h-6 w-6 text-amber-900" />
                        </div>
                        <div>
                            <p className="font-bold text-xl mb-2">Key Takeaway</p>
                            <p className="text-lg text-white/90">
                                Functional Medicine asks <span className="bg-amber-400/30 px-2 py-0.5 rounded text-amber-300 font-semibold">"WHY?"</span> not
                                just <span className="text-slate-400">"WHAT?"</span>
                            </p>
                            <p className="text-white/70 mt-2">
                                It's person-centered, not disease-centered.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completion & Navigation */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-500" />
                            <span className="font-semibold text-slate-800">Lesson Progress</span>
                        </div>
                        <span className="text-indigo-600 font-bold">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 mb-6 bg-indigo-100" />

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {!completed ? (
                            <Button
                                onClick={handleMarkComplete}
                                disabled={sectionsCompleted.length < totalSections}
                                className={`w-full sm:w-auto px-8 py-6 text-lg rounded-xl ${sectionsCompleted.length >= totalSections
                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                    : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                {sectionsCompleted.length >= totalSections ? 'Complete Lesson' : `Complete all ${totalSections} sections`}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-3 rounded-xl">
                                <CheckCircle2 className="h-5 w-5" />
                                Lesson Complete! +50 XP
                            </div>
                        )}

                        <Button
                            onClick={onNext}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl"
                        >
                            Next Lesson
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Up Next Preview */}
                <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                    <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide mb-2">
                        Up Next
                    </p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-800">The 7 Body Systems Model</p>
                            <p className="text-slate-500 text-sm">How everything connects</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-indigo-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
