"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, BookOpen,
    Lightbulb, TrendingUp, Heart, ArrowRight,
    Quote, Sparkles, Play, Users, Star,
    MessageCircle, Coffee, Leaf,
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
 * VARIANT 1: Story-Driven Emotional Journey
 *
 * Design Philosophy:
 * - Opens with a relatable patient story (Sarah, 47)
 * - Uses emotional hooks that resonate with 40+ women
 * - Empathy-first approach inspired by NBHWC coaching principles
 * - Warm, supportive tone throughout
 * - Focus on transformation and hope
 */
export function LessonWhatIsFMV1({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [activeSection, setActiveSection] = useState(0);
    const [showAha, setShowAha] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowAha(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
            {/* Warm Welcome Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-rose-100 px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-burgundy-600 font-medium uppercase tracking-wide">Module 1</p>
                            <p className="text-sm font-semibold text-slate-800">Your FM Journey Begins</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">6 min</span>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                            Lesson {lessonNumber}/{totalLessons}
                        </Badge>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto mt-3">
                    <Progress value={(lessonNumber / totalLessons) * 100} className="h-2 bg-rose-100" />
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
                {/* Personal Welcome */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Coffee className="h-4 w-4" />
                        Welcome, {firstName}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                        What is Functional Medicine?
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto">
                        Let me share a story that might sound familiar...
                    </p>
                </div>

                {/* Sarah's Story - The Emotional Hook */}
                <div className="bg-white rounded-3xl shadow-xl border border-rose-100 overflow-hidden mb-10 animate-slide-up">
                    <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                        <div className="relative flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <Badge className="bg-white/20 text-white border-0 mb-2">
                                    Real Patient Story
                                </Badge>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                                    Meet Sarah, 47
                                </h2>
                                <p className="text-white/90 text-lg">
                                    Her story might remind you of someone you know...
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Story Paragraphs with Visual Breaks */}
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-rose-300 to-rose-100 rounded-full shrink-0" />
                                <div>
                                    <p className="text-slate-700 text-lg leading-relaxed">
                                        Sarah had been feeling exhausted for years. Not just tired—the kind of bone-deep
                                        fatigue that no amount of coffee or sleep seemed to fix. Her doctor ran tests.
                                        <span className="font-semibold text-slate-900">"Everything looks normal,"</span> he said.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-rose-100 to-amber-200 rounded-full shrink-0" />
                                <div>
                                    <p className="text-slate-700 text-lg leading-relaxed">
                                        But Sarah didn't feel normal. She felt like she was watching her life through
                                        foggy glass—brain fog, mood swings, weight that wouldn't budge no matter what
                                        she tried. She started wondering: <span className="italic text-burgundy-700">"Is this just what 47 feels like?"</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                                        <Quote className="h-5 w-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="text-slate-800 text-lg italic mb-2">
                                            "I kept being told I was fine. But I knew something was wrong.
                                            I just needed someone to <span className="font-bold not-italic text-burgundy-700">actually listen</span>."
                                        </p>
                                        <p className="text-amber-700 font-medium">— Sarah's words</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Turning Point */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4">
                                <Sparkles className="h-5 w-5" />
                                <span>The Turning Point</span>
                            </div>
                            <p className="text-slate-700 text-lg leading-relaxed mb-4">
                                Then Sarah found a Functional Medicine practitioner. For the first time,
                                someone asked her: <span className="bg-yellow-200 px-1 font-semibold">"Tell me your whole story."</span>
                            </p>
                            <p className="text-slate-700 text-lg leading-relaxed">
                                Instead of just treating her symptoms, they looked at the
                                <span className="font-semibold text-burgundy-700"> root causes</span>—her
                                gut health, stress levels, hormones, sleep patterns, and nutrition.
                                Six months later, Sarah felt like herself again.
                            </p>
                        </div>
                    </div>
                </div>

                {/* So What IS Functional Medicine? */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
                            <Lightbulb className="h-6 w-6 text-burgundy-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            So... What <span className="text-burgundy-600">IS</span> Functional Medicine?
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6">
                            Functional Medicine is a <span className="bg-yellow-200 px-1">patient-centered, science-based approach</span> that
                            addresses the <span className="bg-yellow-200 px-1">root causes</span> of disease,
                            rather than just suppressing symptoms.
                        </p>

                        {/* Simple Comparison */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-slate-100 rounded-xl p-5 border-2 border-slate-200">
                                <p className="font-semibold text-slate-500 text-sm uppercase tracking-wide mb-3">
                                    Conventional Approach
                                </p>
                                <p className="text-slate-700 mb-2">
                                    "You have high blood pressure."
                                </p>
                                <p className="text-slate-500 text-sm">
                                    → Here's a pill to lower it
                                </p>
                                <div className="mt-4 text-center">
                                    <span className="text-4xl">💊</span>
                                </div>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-5 border-2 border-emerald-200">
                                <p className="font-semibold text-emerald-600 text-sm uppercase tracking-wide mb-3">
                                    Functional Medicine
                                </p>
                                <p className="text-slate-700 mb-2">
                                    "WHY is your blood pressure high?"
                                </p>
                                <p className="text-emerald-600 text-sm">
                                    → Let's find and fix the cause
                                </p>
                                <div className="mt-4 text-center">
                                    <span className="text-4xl">🔍❤️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Big Quote */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-burgundy-900/20 to-transparent" />
                    <Quote className="absolute top-6 left-6 h-16 w-16 text-white/10" />
                    <div className="relative text-center">
                        <blockquote className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6">
                            "Functional Medicine doesn't ask
                            <span className="text-rose-300"> 'What pill matches this symptom?'</span>
                            <br className="hidden md:block" />
                            It asks <span className="text-emerald-300">'Why is THIS person experiencing THIS problem?'</span>"
                        </blockquote>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Leaf className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">The Core Philosophy</p>
                                <p className="text-white/60 text-sm">Person-centered, not disease-centered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why This Matters To YOU */}
                <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-rose-200 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-rose-200 flex items-center justify-center shrink-0">
                            <Heart className="h-7 w-7 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                Why This Matters to YOU, {firstName}
                            </h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                As a health coach trained in Functional Medicine principles, you'll be equipped
                                to help women like Sarah—women who have been told they're "fine" when they
                                know something is wrong.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                You'll learn to see the <span className="font-semibold text-burgundy-700">whole person</span>,
                                not just symptoms. And that changes everything.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-white rounded-xl p-4 text-center shadow-md border border-slate-100">
                        <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-700">60%</p>
                        <p className="text-xs text-slate-500">Adults with chronic conditions</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-md border border-slate-100">
                        <Star className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-700">79%</p>
                        <p className="text-xs text-slate-500">Want holistic solutions</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-md border border-slate-100">
                        <Users className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-emerald-700">15%+</p>
                        <p className="text-xs text-slate-500">FM market growth/year</p>
                    </div>
                </div>

                {/* Key Takeaway */}
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-6 border-2 border-amber-300 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <Lightbulb className="h-6 w-6 text-amber-900" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-lg mb-2">
                                Your Key Takeaway
                            </p>
                            <p className="text-slate-800 text-lg">
                                Functional Medicine asks <span className="bg-amber-300 px-2 py-0.5 rounded font-bold">"WHY?"</span> instead
                                of just <span className="bg-slate-200 px-2 py-0.5 rounded">"WHAT?"</span>
                            </p>
                            <p className="text-slate-600 mt-2">
                                It treats the person, not just the diagnosis. And that's exactly
                                what your future clients need.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completion Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                    {!completed ? (
                        <Button
                            onClick={handleMarkComplete}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                        >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            I Understand This!
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-full">
                            <CheckCircle2 className="h-5 w-5" />
                            Great job, {firstName}!
                        </div>
                    )}

                    <Button
                        onClick={onNext}
                        className="w-full sm:w-auto bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                    >
                        Continue Your Journey
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>

                {/* Next Lesson Preview */}
                <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Coming Up Next
                    </p>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-slate-900 text-lg">The 7 Body Systems Model</h4>
                            <p className="text-slate-500">Discover how everything in your body connects</p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-burgundy-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
