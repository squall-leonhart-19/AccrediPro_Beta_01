"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, ArrowRight,
    Lightbulb, Quote, BookOpen, Bookmark,
    Share2, Heart, TrendingUp, Sparkles,
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
 * VARIANT 5: Premium Magazine Editorial Style
 *
 * Design Philosophy:
 * - Elegant typography with serif headlines
 * - Drop caps and pull quotes like premium magazines
 * - Clean, sophisticated aesthetic
 * - Feels like reading a well-crafted article
 * - Appeals to educated, professional women 40+
 * - Similar to Goop, Well+Good, or The Atlantic style
 */
export function LessonWhatIsFMV5({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "Reader",
}: LessonProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [bookmarked, setBookmarked] = useState(false);

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Elegant Minimal Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-stone-200">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-burgundy-700 font-serif text-lg">AccrediPro</span>
                            <span className="text-stone-300">|</span>
                            <span className="text-stone-500 text-sm">Module 1</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setBookmarked(!bookmarked)}
                                className={`p-2 rounded-full transition-colors ${bookmarked ? 'text-burgundy-600 bg-burgundy-50' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <Progress value={(lessonNumber / totalLessons) * 100} className="h-0.5" />
            </div>

            {/* Hero Article Header */}
            <header className="bg-white border-b border-stone-100">
                <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-center">
                    <Badge className="bg-burgundy-100 text-burgundy-700 border-0 mb-6 text-xs uppercase tracking-widest font-medium">
                        Lesson {lessonNumber} of {totalLessons}
                    </Badge>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight mb-6">
                        What is<br />
                        <em className="text-burgundy-700">Functional Medicine?</em>
                    </h1>

                    <p className="text-xl text-stone-600 max-w-xl mx-auto leading-relaxed mb-8">
                        The revolutionary approach that asks "why" you're sick—and treats the whole person, not just the diagnosis.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-stone-500">
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            6 min read
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            Foundational
                        </span>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <article className="bg-white">
                <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
                    {/* Opening Paragraph with Drop Cap */}
                    <p className="text-lg text-stone-700 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:text-burgundy-700 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                        Imagine visiting your doctor with persistent fatigue, brain fog, and unexplained weight gain.
                        After running standard tests, you're told: "Everything looks normal." But you don't feel normal.
                        You know something is off. This disconnect—between how you feel and what conventional medicine
                        can see—is exactly why Functional Medicine exists.
                    </p>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        Functional Medicine represents a fundamental shift in how we approach health and disease.
                        Rather than asking <em>"What disease do you have?"</em> and prescribing a matching medication,
                        it asks a more profound question: <em>"Why is your body creating these symptoms in the first place?"</em>
                    </p>

                    {/* Section Heading */}
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mt-12 mb-6 pb-3 border-b border-stone-200">
                        The Paradigm Shift
                    </h2>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        In 1991, biochemist Dr. Jeffrey Bland introduced the term "Functional Medicine" to describe
                        a systems-based approach to health. His insight was revolutionary yet simple: chronic diseases
                        don't appear randomly. They develop over time as the body's systems become imbalanced through
                        the complex interplay of genetics, environment, and lifestyle.
                    </p>

                    {/* Pull Quote */}
                    <blockquote className="my-12 py-8 px-6 border-l-4 border-burgundy-500 bg-stone-50">
                        <Quote className="h-8 w-8 text-burgundy-300 mb-4" />
                        <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed mb-4">
                            "Functional Medicine is the difference between asking 'What drug matches this symptom?'
                            and 'What is causing this symptom in this particular person?'"
                        </p>
                        <footer className="text-stone-500 text-sm uppercase tracking-wide">
                            — The Institute for Functional Medicine
                        </footer>
                    </blockquote>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        Consider two women presenting with high blood pressure. Conventional medicine typically
                        prescribes the same class of medications for both. Functional Medicine, however, investigates
                        the unique factors contributing to each woman's condition—perhaps one has chronic inflammation
                        from gut dysfunction, while the other's blood pressure stems from unmanaged stress and
                        magnesium deficiency.
                    </p>

                    {/* Section Heading */}
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mt-12 mb-6 pb-3 border-b border-stone-200">
                        Why Now? The Chronic Disease Crisis
                    </h2>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        The emergence of Functional Medicine coincides with an unprecedented health crisis.
                        Today, more than 60% of American adults live with at least one chronic condition—diabetes,
                        heart disease, autoimmune disorders, anxiety, chronic fatigue. These conditions now
                        account for 90% of our $4 trillion annual healthcare expenditure.
                    </p>

                    {/* Stats Card */}
                    <div className="my-10 grid grid-cols-3 gap-4">
                        <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                            <p className="text-3xl md:text-4xl font-serif text-burgundy-700 mb-1">60%+</p>
                            <p className="text-xs text-stone-500 uppercase tracking-wide">Adults with chronic disease</p>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                            <p className="text-3xl md:text-4xl font-serif text-burgundy-700 mb-1">79%</p>
                            <p className="text-xs text-stone-500 uppercase tracking-wide">Want holistic care</p>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                            <p className="text-3xl md:text-4xl font-serif text-burgundy-700 mb-1">$5.6T</p>
                            <p className="text-xs text-stone-500 uppercase tracking-wide">Global wellness market</p>
                        </div>
                    </div>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        Conventional medicine excels at acute care—emergencies, infections, surgeries. But it was never
                        designed to address the slow, cumulative nature of chronic disease. Functional Medicine fills
                        this gap by examining how our genes, environment, diet, sleep, stress, relationships, and
                        movement patterns interact to create either health or disease.
                    </p>

                    {/* Section Heading */}
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900 mt-12 mb-6 pb-3 border-b border-stone-200">
                        What This Means for You
                    </h2>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        As a health coach trained in Functional Medicine principles, you'll develop a unique ability
                        to see the whole picture. You'll learn to recognize patterns, ask deeper questions, and guide
                        clients toward understanding the root causes of their health challenges—not just managing symptoms.
                    </p>

                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        In a healthcare system that often leaves women feeling unheard and dismissed, you'll become
                        the practitioner who finally <em>listens</em>. The one who sees them as a whole person with
                        a unique story, not just a diagnosis code.
                    </p>

                    {/* Key Insight Box */}
                    <div className="my-12 bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-8 border border-amber-200">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                                <Lightbulb className="h-6 w-6 text-amber-700" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-stone-900 mb-3">The Essential Insight</h3>
                                <p className="text-lg text-stone-700 leading-relaxed">
                                    Functional Medicine asks <strong className="text-burgundy-700">"WHY?"</strong> instead of
                                    just <span className="text-stone-500">"WHAT?"</span>
                                </p>
                                <p className="text-stone-600 mt-2">
                                    It's person-centered, not disease-centered. It treats you, not just your diagnosis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Closing */}
                    <p className="text-lg text-stone-700 leading-relaxed mb-8">
                        This is just the beginning. In the lessons ahead, you'll explore the body systems,
                        understand how imbalances cascade through interconnected pathways, and learn practical
                        frameworks for supporting your clients' health journeys.
                    </p>

                    <p className="text-lg text-stone-700 leading-relaxed font-medium">
                        Welcome to the future of healthcare. Welcome to Functional Medicine.
                    </p>
                </div>
            </article>

            {/* Article Footer */}
            <div className="bg-stone-100 border-t border-stone-200">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    {/* Author/Source */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-stone-200">
                        <div className="w-14 h-14 rounded-full bg-burgundy-600 flex items-center justify-center">
                            <BookOpen className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-stone-900">AccrediPro Functional Medicine Program</p>
                            <p className="text-stone-500 text-sm">Certified NBHWC-aligned curriculum</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {!completed ? (
                            <Button
                                onClick={handleMarkComplete}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-lg"
                            >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                Mark as Read
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                <CheckCircle2 className="h-5 w-5" />
                                Article Completed
                            </div>
                        )}

                        <Button
                            onClick={onNext}
                            className="w-full sm:w-auto bg-burgundy-700 hover:bg-burgundy-800 text-white px-8 py-6 text-lg rounded-lg"
                        >
                            Continue to Lesson 2
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </div>

                    {/* Next Preview */}
                    <div className="mt-10 bg-white rounded-xl p-6 border border-stone-200">
                        <p className="text-xs text-stone-500 uppercase tracking-widest mb-3">Next in Module 1</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-serif text-xl text-stone-900">The 7 Body Systems Model</h4>
                                <p className="text-stone-500">Understanding the interconnected web of health</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-stone-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
