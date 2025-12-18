"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, BookOpen,
    Lightbulb, TrendingUp, Stethoscope, ArrowRight,
    Quote, AlertCircle, Sparkles,
} from "lucide-react";

interface LessonWhatIsFMProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
}

export function LessonWhatIsFM({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "there",
}: LessonWhatIsFMProps) {
    const [completed, setCompleted] = useState(isCompleted);

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Top Progress Bar */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-burgundy-50 text-burgundy-700 border-burgundy-200">
                            Module 1
                        </Badge>
                        <span className="text-sm text-slate-500">Lesson {lessonNumber} of {totalLessons}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">6 min read</span>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto mt-2">
                    <Progress value={(lessonNumber / totalLessons) * 100} className="h-1.5" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Module Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-burgundy-600 mb-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium uppercase tracking-wide text-sm">
                            Module 1: Functional Medicine Foundations
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        What is Functional Medicine?
                    </h1>
                    <p className="text-lg text-slate-600 italic">
                        "What is this, and why does it matter to <span className="text-burgundy-600">{firstName}</span>?"
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <Stethoscope className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-2">
                                    The Medicine That Asks "WHY?"
                                </h2>
                                <p className="text-white/90">
                                    Discover the revolutionary approach that's transforming healthcare by treating
                                    causes, not just symptoms.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Section 1: Definition */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-600 flex items-center justify-center text-sm font-bold">1</span>
                                Root Cause vs. Symptom Management
                            </h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Traditional medicine often works like this: you have a headache, you take a painkiller.
                                But what <em>caused</em> the headache in the first place?
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                <span className="bg-yellow-200 px-1">Functional Medicine</span> is a
                                <span className="bg-yellow-200 px-1 mx-1">systems-based approach</span>
                                that focuses on identifying and addressing the
                                <span className="bg-yellow-200 px-1 mx-1">root cause</span>
                                of disease, rather than just suppressing symptoms.
                            </p>

                            {/* Comparison Box */}
                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                                        <AlertCircle className="h-5 w-5" />
                                        Traditional Approach
                                    </div>
                                    <p className="text-red-800 text-sm">
                                        "You have high blood pressure. Here's medication to lower it."
                                    </p>
                                    <p className="text-red-600 text-sm mt-2 font-medium">
                                        → Treats the WHAT
                                    </p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                                    <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-3">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Functional Medicine
                                    </div>
                                    <p className="text-emerald-800 text-sm">
                                        "Let's find out WHY your blood pressure is high—is it stress, diet, inflammation, or hormones?"
                                    </p>
                                    <p className="text-emerald-600 text-sm mt-2 font-medium">
                                        → Asks the WHY
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: One Sentence Difference */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-600 flex items-center justify-center text-sm font-bold">2</span>
                                The Difference in ONE Sentence
                            </h3>

                            {/* Pull Quote */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 my-6 relative overflow-hidden">
                                <Quote className="absolute top-4 left-4 h-12 w-12 text-white/10" />
                                <blockquote className="text-xl md:text-2xl font-medium text-center relative z-10">
                                    "Functional Medicine is the difference between
                                    <span className="text-yellow-400"> asking 'What drug matches this symptom?'</span>
                                    and
                                    <span className="text-emerald-400"> 'What is causing this symptom in THIS person?'"</span>
                                </blockquote>
                            </div>
                        </section>

                        {/* Section 3: History */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-600 flex items-center justify-center text-sm font-bold">3</span>
                                Quick History: How FM Emerged
                            </h3>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                The term "Functional Medicine" was coined by
                                <span className="bg-yellow-200 px-1 mx-1">Dr. Jeffrey Bland in 1991</span>.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                It emerged from a growing recognition that modern medicine, while excellent for
                                acute conditions and emergencies, was struggling with
                                <span className="bg-yellow-200 px-1 mx-1">chronic diseases</span>—conditions like:
                            </p>
                            <ul className="grid grid-cols-2 gap-2 mb-4">
                                {["Diabetes", "Heart disease", "Autoimmune disorders", "Chronic fatigue", "Depression", "Obesity"].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-slate-700">
                                        <ChevronRight className="h-4 w-4 text-burgundy-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-slate-700 leading-relaxed">
                                These conditions now affect <span className="bg-yellow-200 px-1">over 60% of adults</span>
                                and are responsible for <span className="bg-yellow-200 px-1">90% of healthcare spending</span>.
                            </p>
                        </section>

                        {/* Section 4: Why It's Growing */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-600 flex items-center justify-center text-sm font-bold">4</span>
                                Why It's Growing Rapidly
                            </h3>

                            {/* Stats Grid */}
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 text-center">
                                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-purple-700">$5.6T</div>
                                    <p className="text-purple-600 text-sm">Global Wellness Industry</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 text-center">
                                    <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-blue-700">79%</div>
                                    <p className="text-blue-600 text-sm">Want Holistic Health Solutions</p>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200 text-center">
                                    <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-emerald-700">15%+</div>
                                    <p className="text-emerald-600 text-sm">Annual FM Market Growth</p>
                                </div>
                            </div>

                            <p className="text-slate-700 leading-relaxed">
                                People are tired of the "pill for every ill" approach. They want practitioners
                                who will <span className="bg-yellow-200 px-1">listen to their story</span>,
                                understand their <span className="bg-yellow-200 px-1">unique biology</span>, and
                                create <span className="bg-yellow-200 px-1">personalized healing plans</span>.
                            </p>
                        </section>

                        {/* Key Takeaway */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-yellow-300 mt-8">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-yellow-400 rounded-xl shrink-0">
                                    <Lightbulb className="h-6 w-6 text-yellow-900" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">
                                        🎯 Key Takeaway
                                    </h4>
                                    <p className="text-slate-800 text-lg font-medium">
                                        Functional Medicine asks <span className="bg-yellow-300 px-1 font-bold">"WHY"</span>, not just <span className="bg-gray-200 px-1">"WHAT"</span>.
                                    </p>
                                    <p className="text-slate-600 mt-2">
                                        It's person-centered, not disease-centered. It treats you, not just your diagnosis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {!completed ? (
                        <Button
                            onClick={handleMarkComplete}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl"
                        >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Mark as Complete
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-medium">
                            <CheckCircle2 className="h-5 w-5" />
                            Lesson Completed!
                        </div>
                    )}

                    <Button
                        onClick={onNext}
                        className="w-full sm:w-auto bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-6 text-lg rounded-xl"
                    >
                        Continue to Next Lesson
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>

                {/* Lesson Navigation Preview */}
                <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500 uppercase tracking-wide mb-3">Up Next in Module 1</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-slate-900">Lesson 2: The 7 Body Systems Model</h4>
                            <p className="text-slate-500 text-sm">Understanding how everything connects</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
