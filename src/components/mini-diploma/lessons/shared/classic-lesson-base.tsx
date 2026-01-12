"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight, ArrowLeft,
    GraduationCap, BookOpen, Target, Lightbulb,
    Award, ChevronRight, Quote,
} from "lucide-react";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

export interface LessonSection {
    type: 'intro' | 'heading' | 'text' | 'list' | 'quote' | 'callout' | 'key-point' | 'example';
    content: string;
    items?: string[];
    style?: 'info' | 'warning' | 'success' | 'tip';
}

interface ClassicLessonBaseProps {
    lessonNumber: number;
    lessonTitle: string;
    lessonSubtitle: string;
    totalLessons?: number;
    readingTime?: string;
    sections: LessonSection[];
    keyTakeaways: string[];
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    firstName?: string;
    niche: string;
    nicheLabel: string;
    baseUrl: string;
}

/**
 * Classic text-based lesson component for mini diplomas
 * Similar to main course lessons - shows all content at once
 */
export function ClassicLessonBase({
    lessonNumber,
    lessonTitle,
    lessonSubtitle,
    totalLessons = 9,
    readingTime = "5-7 min",
    sections,
    keyTakeaways,
    onComplete,
    onNext,
    isCompleted = false,
    firstName = "friend",
    niche,
    nicheLabel,
    baseUrl,
}: ClassicLessonBaseProps) {
    const [completed, setCompleted] = useState(isCompleted);

    const handleComplete = async () => {
        if (!completed) {
            await onComplete?.();
            setCompleted(true);
        }
        onNext?.();
    };

    const progressPercent = (lessonNumber / totalLessons) * 100;

    const renderSection = (section: LessonSection, index: number) => {
        switch (section.type) {
            case 'intro':
                return (
                    <div key={index} className="flex items-start gap-4 bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl p-5 border border-burgundy-100">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover shadow-md flex-shrink-0"
                        />
                        <div>
                            <p className="text-sm text-burgundy-600 font-medium mb-1">From Sarah, Your Health Coach</p>
                            <p className="text-slate-700 leading-relaxed">{section.content.replace('{name}', firstName)}</p>
                        </div>
                    </div>
                );

            case 'heading':
                return (
                    <h2 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-burgundy-600" />
                        {section.content}
                    </h2>
                );

            case 'text':
                return (
                    <p key={index} className="text-slate-700 leading-relaxed mb-4">
                        {section.content.replace('{name}', firstName)}
                    </p>
                );

            case 'list':
                return (
                    <ul key={index} className="space-y-3 mb-6">
                        {section.items?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 border-burgundy-400 pl-4 py-2 my-6 bg-burgundy-50/50 rounded-r-lg">
                        <div className="flex items-start gap-2">
                            <Quote className="w-5 h-5 text-burgundy-400 flex-shrink-0 mt-1" />
                            <p className="text-slate-700 italic">{section.content}</p>
                        </div>
                    </blockquote>
                );

            case 'callout':
                const calloutStyles = {
                    info: 'bg-blue-50 border-blue-200 text-blue-800',
                    warning: 'bg-amber-50 border-amber-200 text-amber-800',
                    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                    tip: 'bg-purple-50 border-purple-200 text-purple-800',
                };
                const style = section.style || 'info';
                return (
                    <div key={index} className={`rounded-xl p-4 border-2 my-6 ${calloutStyles[style]}`}>
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{section.content}</p>
                        </div>
                    </div>
                );

            case 'key-point':
                return (
                    <div key={index} className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5 border border-slate-200 my-6">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-burgundy-600" />
                            Key Point
                        </h4>
                        <p className="text-slate-700">{section.content}</p>
                    </div>
                );

            case 'example':
                return (
                    <div key={index} className="bg-amber-50/50 rounded-xl p-5 border border-amber-200 my-6">
                        <h4 className="font-bold text-amber-800 mb-2">Example</h4>
                        <p className="text-slate-700">{section.content}</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <Link
                            href={baseUrl}
                            className="flex items-center gap-2 text-gray-600 hover:text-burgundy-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to {nicheLabel}</span>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} read</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Progress value={progressPercent} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-slate-600">{lessonNumber}/{totalLessons}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Lesson Title */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-burgundy-600 font-medium mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Lesson {lessonNumber}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{lessonTitle}</h1>
                    <p className="text-lg text-slate-600">{lessonSubtitle}</p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
                    {sections.map((section, index) => renderSection(section, index))}
                </div>

                {/* Key Takeaways */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 mb-8">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Key Takeaways from Lesson {lessonNumber}
                    </h3>
                    <ul className="space-y-3">
                        {keyTakeaways.map((takeaway, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{takeaway}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Completion Card */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="bg-gradient-to-r from-burgundy-600 to-rose-600 px-6 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-burgundy-100 text-sm">Lesson {lessonNumber} of {totalLessons}</p>
                                <p className="font-semibold">{lessonTitle}</p>
                            </div>
                            {completed && (
                                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Completed</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Progress value={progressPercent} className="flex-1 h-3" />
                            <span className="text-sm font-medium text-slate-600">{Math.round(progressPercent)}%</span>
                        </div>

                        {lessonNumber < totalLessons ? (
                            <Button
                                onClick={handleComplete}
                                className="w-full bg-gradient-to-r from-burgundy-600 to-rose-600 hover:from-burgundy-700 hover:to-rose-700 text-white font-semibold py-4 rounded-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {completed ? 'Continue to Lesson ' : 'Complete & Continue to Lesson '}
                                    {lessonNumber + 1}
                                    <ChevronRight className="w-5 h-5" />
                                </span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleComplete}
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-4 rounded-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <GraduationCap className="w-5 h-5" />
                                    {completed ? 'View Your Certificate' : 'Complete & Get Your Certificate!'}
                                </span>
                            </Button>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            {lessonNumber > 1 ? (
                                <Link
                                    href={`${baseUrl}/lesson/${lessonNumber - 1}`}
                                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-burgundy-600 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous Lesson
                                </Link>
                            ) : (
                                <div />
                            )}
                            {lessonNumber < totalLessons && (
                                <Link
                                    href={`${baseUrl}/lesson/${lessonNumber + 1}`}
                                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-burgundy-600 transition-colors"
                                >
                                    Next Lesson
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
