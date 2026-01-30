"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight, ArrowLeft,
    GraduationCap, BookOpen, Target, Lightbulb,
    Award, ChevronRight, Quote, DollarSign, Sparkles,
    MessageCircle, X, Volume2, VolumeX, Keyboard
} from "lucide-react";
import { SarahChatPanel } from "@/components/mini-diploma/sarah-chat-panel";
import { GamificationBar } from "@/components/mini-diploma/gamification-bar";
import { WelcomeAudio } from "@/components/mini-diploma/welcome-audio";
import { CommitmentCheckpoint } from "@/components/mini-diploma/commitment-checkpoint";
import { CertificatePreview } from "@/components/mini-diploma/certificate-preview";
import { DarkModeToggle } from "@/components/mini-diploma/dark-mode-toggle";
import { TextToSpeech } from "@/components/mini-diploma/text-to-speech";
import { LessonNotes } from "@/components/mini-diploma/lesson-notes";


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
    courseSlug?: string; // For Live Chat - uses course slug instead of ID
    showChat?: boolean; // Whether to show Sarah chat panel (default: true)
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
    courseSlug,
    showChat = false, // Disabled by default - no mentor chat in mini diploma
}: ClassicLessonBaseProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [chatOpen, setChatOpen] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [showCommitmentModal, setShowCommitmentModal] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Check if should show commitment checkpoint (after completing L3)
    useEffect(() => {
        if (lessonNumber === 3 && justCompleted) {
            const hasCommitted = localStorage.getItem("mini_diploma_committed");
            if (!hasCommitted) {
                setTimeout(() => setShowCommitmentModal(true), 1500);
            }
        }
    }, [lessonNumber, justCompleted]);

    // Track scroll/reading progress
    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            const element = contentRef.current;
            const scrollTop = window.scrollY;
            const elementTop = element.offsetTop;
            const elementHeight = element.scrollHeight;
            const windowHeight = window.innerHeight;

            const scrolled = scrollTop - elementTop + windowHeight;
            const progress = Math.min(100, Math.max(0, (scrolled / elementHeight) * 100));
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'ArrowRight' && lessonNumber < totalLessons) {
                window.location.href = `${baseUrl}/lesson/${lessonNumber + 1}`;
            } else if (e.key === 'ArrowLeft' && lessonNumber > 1) {
                window.location.href = `${baseUrl}/lesson/${lessonNumber - 1}`;
            } else if (e.key === ' ' && !completed) {
                e.preventDefault();
                handleComplete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lessonNumber, totalLessons, baseUrl, completed]);

    // Keywords to highlight throughout lessons
    const HIGHLIGHT_KEYWORDS = [
        'root cause', 'ROOT CAUSE', 'functional medicine', 'certified', 'certification',
        '$', 'income', 'clients', 'transform', 'results', 'protocol', 'gut health',
        'inflammation', 'toxins', 'stress', 'hormones', 'practitioner', 'waitlist',
        '5R Protocol', 'HPA axis', 'cortisol', 'microbiome'
    ];

    // Highlight important keywords in text
    const highlightText = (text: string): React.ReactNode => {
        if (!text) return text;
        // Replace {name} with firstName
        let processed = text.replace(/{name}/g, firstName);

        // Create regex for keywords (case insensitive for some, exact for others)
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Find money amounts like $150, $6,200/month, etc.
        const moneyRegex = /\$[\d,]+(?:\/\w+)?(?:\s*[-–]\s*\$[\d,]+(?:\/\w+)?)?/g;
        let match;

        while ((match = moneyRegex.exec(processed)) !== null) {
            if (match.index > lastIndex) {
                parts.push(processed.slice(lastIndex, match.index));
            }
            parts.push(
                <span key={match.index} className="text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">
                    {match[0]}
                </span>
            );
            lastIndex = match.index + match[0].length;
        }

        if (parts.length === 0) return processed;
        if (lastIndex < processed.length) {
            parts.push(processed.slice(lastIndex));
        }
        return parts;
    };

    const handleComplete = async () => {
        if (!completed) {
            await onComplete?.();
            setCompleted(true);
            setJustCompleted(true);
            // Reset after animation
            setTimeout(() => setJustCompleted(false), 4500);
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
                            <p className="text-slate-700 leading-relaxed">{highlightText(section.content)}</p>
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
                        {highlightText(section.content)}
                    </p>
                );

            case 'list':
                return (
                    <ul key={index} className="space-y-3 mb-6">
                        {section.items?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{highlightText(item)}</span>
                            </li>
                        ))}
                    </ul>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 border-burgundy-400 pl-4 py-2 my-6 bg-burgundy-50/50 rounded-r-lg">
                        <div className="flex items-start gap-2">
                            <Quote className="w-5 h-5 text-burgundy-400 flex-shrink-0 mt-1" />
                            <p className="text-slate-700 italic">{highlightText(section.content)}</p>
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* MAIN CONTENT - scrollable */}
            <div className="flex-1 min-w-0 overflow-auto">
                {/* Gamification Bar */}
                <GamificationBar
                    lessonNumber={lessonNumber}
                    totalLessons={totalLessons}
                    firstName={firstName}
                    justCompleted={justCompleted}
                />

                {/* Reading Progress Bar - Sticky */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${readingProgress}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-gray-500 min-w-[3rem]">
                                {Math.round(readingProgress)}% read
                            </span>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/ASI_LOGO-removebg-preview.png"
                                    alt="AccrediPro"
                                    width={36}
                                    height={36}
                                    className="rounded-lg"
                                />
                                <Link
                                    href={baseUrl}
                                    className="flex items-center gap-2 text-gray-600 hover:text-burgundy-600 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-sm font-medium">Back to {nicheLabel}</span>
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span>{readingTime} read</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div ref={contentRef} className="max-w-4xl mx-auto px-4 py-8">
                    {/* Lesson Title */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-burgundy-600 font-medium mb-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Lesson {lessonNumber}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{lessonTitle}</h1>
                        <p className="text-lg text-slate-600">{lessonSubtitle}</p>

                        {/* Tools bar */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <TextToSpeech
                                textContent={sections.map(s => s.content + (s.items?.join(' ') || '')).join(' ')}
                            />
                            <LessonNotes lessonNumber={lessonNumber} niche={niche} />
                            <DarkModeToggle />
                            <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                <Keyboard className="w-3 h-3" />
                                <span>←  →  Space</span>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Audio - Only on Lesson 1 */}
                    {lessonNumber === 1 && (
                        <WelcomeAudio firstName={firstName} nicheLabel={nicheLabel} />
                    )}

                    {/* Certificate Preview - Only on Lesson 1 (creates goal visualization) */}
                    {lessonNumber === 1 && (
                        <div className="mb-8">
                            <h3 className="text-center text-sm font-medium text-gray-500 mb-4">
                                🎯 This is what you're working toward...
                            </h3>
                            <CertificatePreview
                                firstName={firstName}
                                nicheLabel={nicheLabel}
                                lessonNumber={lessonNumber}
                                totalLessons={totalLessons}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 mb-8">
                        {sections.map((section, index) => renderSection(section, index))}
                    </div>

                    {/* Key Takeaways */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 mb-6">
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

                    {/* Earning Potential Callout */}
                    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 p-5 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Why This Matters For Your Income
                                </h4>
                                <p className="text-amber-800 text-sm leading-relaxed">
                                    Practitioners who master {lessonTitle.toLowerCase()} can charge
                                    <strong className="text-amber-900"> $150-$300 per consultation</strong>.
                                    With just 5-10 clients per week, that's
                                    <strong className="text-amber-900"> $3,000-$8,000/month</strong> working from home.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Certificate Progress Reminder */}
                    {lessonNumber < totalLessons && (
                        <div className="bg-burgundy-50 rounded-xl p-4 mb-8 border border-burgundy-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-5 h-5 text-burgundy-600" />
                                    <span className="text-sm text-burgundy-700">
                                        <strong>{totalLessons - lessonNumber} more lesson{totalLessons - lessonNumber > 1 ? 's' : ''}</strong> until your certificate is ready!
                                    </span>
                                </div>
                                <Progress value={progressPercent} className="w-24 h-2" />
                            </div>
                        </div>
                    )}

                    {/* Completion Card - Gold/Burgundy Branded */}
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-300 overflow-hidden">
                        <div className="px-6 py-4" style={{ backgroundColor: '#722F37' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/ASI_LOGO-removebg-preview.png"
                                        alt="AccrediPro"
                                        width={44}
                                        height={44}
                                        className="rounded-lg bg-white p-1"
                                    />
                                    <div>
                                        <p className="text-amber-300 text-sm font-medium">Lesson {lessonNumber} of {totalLessons}</p>
                                        <p className="text-white font-bold text-lg">{lessonTitle}</p>
                                    </div>
                                </div>
                                {completed && (
                                    <div className="flex items-center gap-2 bg-amber-400 text-amber-900 rounded-full px-3 py-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm font-bold">Completed</span>
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
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-burgundy-900 font-bold py-4 rounded-xl shadow-md"
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
                                        {completed ? 'Take Final Exam →' : 'Complete & Take Final Exam! →'}
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

                    {/* Copyright Footer */}
                    <div className="text-center mt-8 py-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} AccrediPro International Standards Institute. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR - Sarah Chat - Desktop LG+ */}
            {showChat && (
                <aside className="hidden lg:flex w-[340px] flex-shrink-0 border-l border-gray-200 flex-col h-screen sticky top-0">
                    <SarahChatPanel userName={firstName} />
                </aside>
            )}

            {/* MOBILE: Floating Chat Button - Only on smaller screens */}
            {showChat && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-40 bg-gradient-to-r from-burgundy-600 to-rose-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    style={{ display: chatOpen ? "none" : "flex" }}
                >
                    <MessageCircle className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                        💬
                    </span>
                </button>
            )}

            {/* MOBILE: Chat Overlay */}
            {showChat && chatOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50"
                    onClick={() => setChatOpen(false)}
                >
                    <div
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-burgundy-600 to-rose-600 text-white">
                            <span className="font-semibold flex items-center gap-2">
                                💬 Chat with Sarah
                            </span>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Chat Panel */}
                        <div className="flex-1 overflow-hidden">
                            <SarahChatPanel userName={firstName} onClose={() => setChatOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Commitment Checkpoint Modal - After L3 */}
            {showCommitmentModal && (
                <CommitmentCheckpoint
                    firstName={firstName}
                    lessonNumber={lessonNumber}
                    totalLessons={totalLessons}
                    onCommit={() => {
                        setShowCommitmentModal(false);
                        // Navigate to next lesson
                        window.location.href = `${baseUrl}/lesson/${lessonNumber + 1}`;
                    }}
                    onDismiss={() => setShowCommitmentModal(false)}
                />
            )}
        </div>
    );
}
