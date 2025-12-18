"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, ArrowRight,
    Lightbulb, TrendingUp, Heart, Stethoscope,
    Activity, Leaf, Users, Target, Zap, Sparkles,
    ArrowDown, CircleDot, Globe, DollarSign,
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
 * VARIANT 3: Visual Timeline + Infographic Style
 *
 * Design Philosophy:
 * - Beautiful visual timeline showing FM evolution
 * - Infographic-heavy with compelling data visualizations
 * - Pinterest-worthy design that appeals to visual learners
 * - Clean, modern aesthetic with strong visual hierarchy
 * - Perfect for screenshots and sharing
 */
export function LessonWhatIsFMV3({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "Health Coach",
}: LessonProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [visibleSections, setVisibleSections] = useState<number[]>([1]);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = parseInt(entry.target.getAttribute('data-section') || '0');
                        if (sectionId && !visibleSections.includes(sectionId)) {
                            setVisibleSections(prev => [...prev, sectionId]);
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [visibleSections]);

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Clean Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Badge className="bg-burgundy-100 text-burgundy-700 border-0 font-semibold">
                            Module 1
                        </Badge>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-600 font-medium">Lesson {lessonNumber} of {totalLessons}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>6 min read</span>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto mt-3">
                    <Progress value={(lessonNumber / totalLessons) * 100} className="h-1" />
                </div>
            </div>

            {/* Hero Section - Full Width */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-burgundy-900 text-white">
                <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                    <div className="text-center">
                        <Badge className="bg-white/10 text-white/90 border-0 mb-6 text-sm px-4 py-1.5">
                            Functional Medicine Foundations
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            What is<br />
                            <span className="bg-gradient-to-r from-amber-400 to-gold-400 bg-clip-text text-transparent">
                                Functional Medicine?
                            </span>
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            The revolutionary approach that asks <span className="text-amber-400 font-semibold">"WHY"</span> instead of just treating symptoms.
                        </p>

                        <div className="mt-12 flex items-center justify-center">
                            <ArrowDown className="h-6 w-6 text-white/40 animate-bounce" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                {/* Section 1: The Core Difference - Visual Comparison */}
                <section
                    ref={(el) => { sectionRefs.current[0] = el; }}
                    data-section="1"
                    className={`mb-20 transition-all duration-700 ${visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            The Core Difference
                        </h2>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto">
                            Two approaches. One fundamental question that changes everything.
                        </p>
                    </div>

                    {/* Visual Comparison Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* Conventional */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl transform rotate-1" />
                            <div className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
                                <div className="absolute -top-4 left-6 bg-slate-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                    Conventional
                                </div>
                                <div className="pt-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Stethoscope className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                        "What do you have?"
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Diagnose the disease. Prescribe the matching treatment.
                                    </p>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-slate-500 text-sm italic">
                                            "You have high blood pressure. Here's medication."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Functional */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-3xl transform -rotate-1" />
                            <div className="relative bg-white rounded-3xl p-8 border border-emerald-200 shadow-lg">
                                <div className="absolute -top-4 left-6 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                    Functional
                                </div>
                                <div className="pt-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                        "Why do you have it?"
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        Find the root cause. Address what's actually wrong.
                                    </p>
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <p className="text-emerald-700 text-sm italic">
                                            "Let's understand why—stress? Diet? Inflammation?"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Insight Banner */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 text-center">
                        <p className="text-xl font-semibold text-slate-800">
                            <span className="text-amber-600">Functional Medicine</span> treats
                            <span className="bg-amber-200 px-2 mx-1 rounded">you</span>, not just your diagnosis.
                        </p>
                    </div>
                </section>

                {/* Section 2: Timeline */}
                <section
                    ref={(el) => { sectionRefs.current[1] = el; }}
                    data-section="2"
                    className={`mb-20 transition-all duration-700 delay-100 ${visibleSections.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            The Timeline
                        </h2>
                        <p className="text-lg text-slate-600">
                            How Functional Medicine emerged and grew
                        </p>
                    </div>

                    {/* Visual Timeline */}
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-burgundy-500 via-amber-400 to-emerald-500 rounded-full transform md:-translate-x-1/2" />

                        {/* Timeline Items */}
                        <div className="space-y-12">
                            {/* 1991 */}
                            <div className="relative flex items-center md:justify-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right pl-20 md:pl-0">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                        <Badge className="bg-burgundy-100 text-burgundy-700 border-0 mb-3">1991</Badge>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">The Birth</h3>
                                        <p className="text-slate-600">
                                            <span className="font-semibold">Dr. Jeffrey Bland</span> coins the term "Functional Medicine"
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute left-6 md:left-1/2 w-5 h-5 bg-burgundy-500 rounded-full border-4 border-white shadow transform md:-translate-x-1/2" />
                            </div>

                            {/* 2000s */}
                            <div className="relative flex items-center md:justify-center">
                                <div className="md:w-1/2 md:pl-12 md:ml-auto pl-20">
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                        <Badge className="bg-amber-100 text-amber-700 border-0 mb-3">2000s</Badge>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">The Growth</h3>
                                        <p className="text-slate-600">
                                            IFM (Institute for Functional Medicine) trains thousands of practitioners worldwide
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute left-6 md:left-1/2 w-5 h-5 bg-amber-500 rounded-full border-4 border-white shadow transform md:-translate-x-1/2" />
                            </div>

                            {/* Today */}
                            <div className="relative flex items-center md:justify-center">
                                <div className="md:w-1/2 md:pr-12 md:text-right pl-20 md:pl-0">
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-200">
                                        <Badge className="bg-emerald-100 text-emerald-700 border-0 mb-3">Today</Badge>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">The Movement</h3>
                                        <p className="text-slate-600">
                                            Mainstream adoption. Cleveland Clinic, major hospitals embrace FM principles.
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute left-6 md:left-1/2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white shadow transform md:-translate-x-1/2" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Stats Infographic */}
                <section
                    ref={(el) => { sectionRefs.current[2] = el; }}
                    data-section="3"
                    className={`mb-20 transition-all duration-700 delay-200 ${visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Why It's Growing Fast
                        </h2>
                        <p className="text-lg text-slate-600">
                            The numbers tell the story
                        </p>
                    </div>

                    {/* Big Stats Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <Globe className="h-10 w-10 text-white/80 mb-4" />
                            <p className="text-5xl md:text-6xl font-bold mb-2">$5.6T</p>
                            <p className="text-white/80 text-lg">Global Wellness Industry</p>
                        </div>

                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <Heart className="h-10 w-10 text-white/80 mb-4" />
                            <p className="text-5xl md:text-6xl font-bold mb-2">79%</p>
                            <p className="text-white/80 text-lg">Want Holistic Health Solutions</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center">
                            <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                            <p className="text-3xl font-bold text-emerald-600 mb-1">15%+</p>
                            <p className="text-slate-500 text-sm">Annual FM Market Growth</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center">
                            <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                            <p className="text-3xl font-bold text-blue-600 mb-1">60%</p>
                            <p className="text-slate-500 text-sm">Adults with Chronic Conditions</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center">
                            <DollarSign className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                            <p className="text-3xl font-bold text-amber-600 mb-1">90%</p>
                            <p className="text-slate-500 text-sm">Healthcare Spending on Chronic Disease</p>
                        </div>
                    </div>
                </section>

                {/* Section 4: The FM Pillars */}
                <section
                    ref={(el) => { sectionRefs.current[3] = el; }}
                    data-section="4"
                    className={`mb-16 transition-all duration-700 delay-300 ${visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            The FM Pillars
                        </h2>
                        <p className="text-lg text-slate-600">
                            What makes Functional Medicine unique
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Target, title: "Root Cause", desc: "Find what's actually causing the problem", color: "from-red-500 to-rose-600" },
                            { icon: Activity, title: "Systems Thinking", desc: "See how everything in the body connects", color: "from-blue-500 to-indigo-600" },
                            { icon: Leaf, title: "Personalized", desc: "Treatment designed for each unique person", color: "from-emerald-500 to-teal-600" },
                        ].map((pillar, i) => (
                            <div key={i} className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} rounded-2xl transform group-hover:scale-105 transition-transform duration-300 opacity-10`} />
                                <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center h-full">
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-5`}>
                                        <pillar.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{pillar.title}</h3>
                                    <p className="text-slate-600">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key Takeaway - Clean Design */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-burgundy-900/20 to-transparent" />
                    <Lightbulb className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Your Key Takeaway
                    </h3>
                    <p className="text-xl text-white/90 max-w-xl mx-auto">
                        Functional Medicine asks
                        <span className="bg-amber-400/20 px-2 py-1 mx-1 rounded text-amber-300 font-semibold">"WHY?"</span>
                        not just
                        <span className="text-slate-400">"WHAT?"</span>
                    </p>
                    <p className="text-white/60 mt-4">
                        Person-centered. Root cause focused. Systems-based.
                    </p>
                </div>

                {/* Completion */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {!completed ? (
                        <Button
                            onClick={handleMarkComplete}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                        >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Mark Complete
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <CheckCircle2 className="h-5 w-5" />
                            Lesson Complete
                        </div>
                    )}

                    <Button
                        onClick={onNext}
                        className="w-full sm:w-auto bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                    >
                        Next: 7 Body Systems
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>

                {/* Up Next */}
                <div className="mt-10 bg-slate-50 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Up Next</p>
                        <p className="font-semibold text-slate-800">Lesson 2: The 7 Body Systems Model</p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-slate-400" />
                </div>
            </div>
        </div>
    );
}
