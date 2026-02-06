"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight, ArrowLeft,
    GraduationCap, BookOpen, Target, Lightbulb,
    Award, Quote, DollarSign, Sparkles,
    MessageCircle, X, AlertCircle, Check,
    Search, Zap, Activity, TrendingUp, HelpCircle,
    Download, Loader2, FileText, Calculator
} from "lucide-react";
import { SarahChatPanel } from "@/components/mini-diploma/sarah-chat-panel";
import { GamificationBar } from "@/components/mini-diploma/gamification-bar";
import { WelcomeAudio } from "@/components/mini-diploma/welcome-audio";
import { CommitmentCheckpoint } from "@/components/mini-diploma/commitment-checkpoint";
import { CertificatePreview } from "@/components/mini-diploma/certificate-preview";
// Resources removed — simplified to 3-lesson structure

// Premium ASI Color Palette
const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";
const BURGUNDY_GRADIENT = "linear-gradient(180deg, #722F37 0%, #5C1F2A 100%)";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface LessonSection {
    type: 'intro' | 'heading' | 'text' | 'list' | 'quote' | 'callout' | 'key-point' | 'example' | 'definition' | 'framework' | 'quiz' | 'before-after';
    content: string;
    items?: string[];
    style?: 'info' | 'warning' | 'success' | 'tip';
    // For definition type
    term?: string;
    // For framework type - D.E.P.T.H. Method steps
    framework?: {
        name: string;
        steps: { letter: string; title: string; description: string }[];
    };
    // For quiz type
    questions?: QuizQuestion[];
    // For before-after type
    before?: { title: string; items: string[] };
    after?: { title: string; items: string[] };
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
 * Check Your Knowledge Quiz Section Component
 */
function QuizSection({ questions }: { questions: QuizQuestion[] }) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [revealed, setRevealed] = useState<Record<number, boolean>>({});

    const handleAnswer = (qIndex: number, optionIndex: number) => {
        if (revealed[qIndex]) return; // Already answered
        setAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
        setRevealed(prev => ({ ...prev, [qIndex]: true }));
    };

    if (questions.length === 0) return null;

    return (
        <div className="rounded-2xl border-3 my-8 overflow-hidden shadow-lg" style={{ borderColor: '#D4AF37', borderWidth: '3px' }}>
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: GOLD_GRADIENT }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: BURGUNDY_GRADIENT }}>
                    <HelpCircle className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                    <span className="font-bold text-burgundy-900 text-xl">Check Your Knowledge</span>
                    <p className="text-burgundy-800/70 text-sm">Test what you've learned</p>
                </div>
            </div>

            {/* Questions */}
            <div className="p-5 bg-white space-y-6">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="border border-amber-200 rounded-xl p-4">
                        <p className="font-semibold text-slate-800 mb-4">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option, optIndex) => {
                                const isSelected = answers[qIndex] === optIndex;
                                const isCorrect = q.correctIndex === optIndex;
                                const isRevealed = revealed[qIndex];

                                let bgColor = 'bg-white hover:bg-amber-50';
                                let borderColor = 'border-gray-200';
                                let textColor = 'text-slate-700';

                                if (isRevealed) {
                                    if (isCorrect) {
                                        bgColor = 'bg-emerald-50';
                                        borderColor = 'border-emerald-400';
                                        textColor = 'text-emerald-800';
                                    } else if (isSelected && !isCorrect) {
                                        bgColor = 'bg-red-50';
                                        borderColor = 'border-red-300';
                                        textColor = 'text-red-700';
                                    }
                                }

                                return (
                                    <button
                                        key={optIndex}
                                        onClick={() => handleAnswer(qIndex, optIndex)}
                                        disabled={isRevealed}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${bgColor} ${borderColor} ${textColor} ${!isRevealed ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isRevealed && isCorrect ? 'bg-emerald-500 border-emerald-500' : isSelected && !isCorrect && isRevealed ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
                                                {isRevealed && isCorrect && <Check className="w-4 h-4 text-white" />}
                                                {isSelected && !isCorrect && isRevealed && <X className="w-4 h-4 text-white" />}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {revealed[qIndex] && q.explanation && (
                            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-start gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-700">{q.explanation}</p>
                                </div>
                            </div>
                        )}

                        {/* Result indicator */}
                        {revealed[qIndex] && (
                            <div className={`mt-3 flex items-center gap-2 ${answers[qIndex] === q.correctIndex ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {answers[qIndex] === q.correctIndex ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-medium">Correct! Great job! 🎉</span>
                                    </>
                                ) : (
                                    <>
                                        <Lightbulb className="w-5 h-5" />
                                        <span className="font-medium">Not quite - see the correct answer above</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Resource Download Button Component
 * Uses URL with filename in path so Safari/all browsers show correct filename
 * Safari ignores Content-Disposition header, but uses URL path as filename
 */
function ResourceDownloadButton({ resource }: { resource: { id: string; title: string; url: string; description?: string; pdfDownloadId?: string; pdfFilename?: string } }) {
    // Build URL with filename in path for Safari compatibility
    // Format: /api/mini-diploma/resources/pdf/{downloadId}/{filename}.pdf
    const downloadId = resource.pdfDownloadId || resource.id;
    const filename = resource.pdfFilename || `${resource.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')}.pdf`;
    const downloadUrl = `/api/mini-diploma/resources/pdf/${downloadId}/${filename}`;

    return (
        <a
            href={downloadUrl}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100 hover:border-emerald-400 hover:shadow-md transition-all group w-full text-left"
        >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-700 block truncate">
                    {resource.title}
                </span>
                {resource.description && (
                    <span className="text-xs text-slate-500 block truncate">
                        {resource.description}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">PDF</span>
                <Download className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
        </a>
    );
}

/**
 * Classic text-based lesson component for mini diplomas
 * Similar to main course lessons - shows all content at once
 */
export function ClassicLessonBase({
    lessonNumber,
    lessonTitle,
    lessonSubtitle,
    totalLessons = 3,
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
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const [showCommitmentModal, setShowCommitmentModal] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Check if should show commitment checkpoint (after completing L2)
    useEffect(() => {
        if (lessonNumber === 2 && justCompleted) {
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
        'D.E.P.T.H.', 'DEPTH', 'Discover', 'Evaluate', 'Pinpoint', 'Transform', 'Heal',
        '$', 'income', 'clients', 'results', 'protocol', 'gut health',
        'inflammation', 'toxins', 'stress', 'hormones', 'practitioner', 'waitlist',
        'HPA axis', 'cortisol', 'microbiome'
    ];

    // Highlight important keywords and parse markdown bold **text** in content
    const highlightText = (text: string): React.ReactNode => {
        if (!text) return text;
        // Replace {name} with firstName
        let processed = text.replace(/{name}/g, firstName);

        // Parse the text for special patterns
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Combined regex: money amounts OR **bold** text
        const combinedRegex = /(\$[\d,]+(?:\/\w+)?(?:\s*[-–]\s*\$[\d,]+(?:\/\w+)?)?)|(\*\*([^*]+)\*\*)/g;
        let match;

        while ((match = combinedRegex.exec(processed)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(processed.slice(lastIndex, match.index));
            }

            if (match[1]) {
                // Money amount match
                parts.push(
                    <span key={`money-${match.index}`} className="text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">
                        {match[0]}
                    </span>
                );
            } else if (match[2]) {
                // Bold text match - match[3] is the content inside **
                parts.push(
                    <strong key={`bold-${match.index}`} className="font-bold text-amber-700">
                        {match[3]}
                    </strong>
                );
            }

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
                    <div key={index} className="flex items-start gap-4 rounded-2xl p-5 border-2 border-amber-200 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FDF6E3 50%, #FEF3C7 100%)' }}>
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover shadow-lg flex-shrink-0 ring-3 ring-amber-300"
                        />
                        <div>
                            <p className="text-sm text-burgundy-700 font-semibold mb-1">From Sarah, Your Health Coach</p>
                            <p className="text-slate-700 leading-relaxed">{highlightText(section.content)}</p>
                        </div>
                    </div>
                );

            case 'heading':
                return (
                    <h2 key={index} className="text-xl font-bold text-slate-900 mt-8 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: BURGUNDY_GRADIENT }}>
                            <Target className="w-4 h-4 text-amber-300" />
                        </span>
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
                                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: GOLD_GRADIENT }}>
                                    <CheckCircle2 className="w-3 h-3 text-burgundy-800" />
                                </span>
                                <span className="text-slate-700">{highlightText(item)}</span>
                            </li>
                        ))}
                    </ul>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 border-amber-400 pl-4 py-3 my-6 rounded-r-lg" style={{ background: 'linear-gradient(90deg, #FFFBEB 0%, transparent 100%)' }}>
                        <div className="flex items-start gap-2">
                            <Quote className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
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
                            <p className="text-sm font-medium">{highlightText(section.content)}</p>
                        </div>
                    </div>
                );

            case 'key-point':
                return (
                    <div key={index} className="rounded-xl p-5 border-2 border-amber-300 my-6 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' }}>
                        <h4 className="font-bold text-burgundy-800 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: GOLD_GRADIENT }}>
                                <Sparkles className="w-3 h-3 text-burgundy-800" />
                            </span>
                            Key Insight
                        </h4>
                        <p className="text-slate-700">{highlightText(section.content)}</p>
                    </div>
                );

            case 'example':
                return (
                    <div key={index} className="rounded-xl p-5 border-2 my-6" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDF6E3 100%)', borderColor: '#D4AF37' }}>
                        <h4 className="font-bold text-burgundy-800 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            Real-World Example
                        </h4>
                        <p className="text-slate-700">{highlightText(section.content)}</p>
                    </div>
                );

            case 'definition':
                return (
                    <div key={index} className="rounded-2xl border-3 my-8 overflow-hidden shadow-lg" style={{ borderColor: '#D4AF37', borderWidth: '3px' }}>
                        {/* Header */}
                        <div className="px-5 py-3 flex items-center gap-3" style={{ background: GOLD_GRADIENT }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ background: BURGUNDY_GRADIENT }}>
                                <BookOpen className="w-4 h-4 text-amber-300" />
                            </div>
                            <span className="font-bold text-burgundy-900 text-lg">{section.term || 'Definition'}</span>
                        </div>
                        {/* Content */}
                        <div className="p-5 bg-white">
                            <p className="text-slate-700 text-lg leading-relaxed">{highlightText(section.content)}</p>
                        </div>
                    </div>
                );

            case 'framework':
                if (!section.framework) return null;
                const frameworkIcons: Record<string, React.ReactNode> = {
                    'R': <Search className="w-4 h-4" />,
                    'O': <Zap className="w-4 h-4" />,
                    'T': <Activity className="w-4 h-4" />,
                };
                return (
                    <div key={index} className="rounded-2xl border-3 my-8 overflow-hidden shadow-lg" style={{ borderColor: '#D4AF37', borderWidth: '3px' }}>
                        {/* Header */}
                        <div className="px-5 py-4 flex items-center gap-3" style={{ background: BURGUNDY_GRADIENT }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: GOLD_GRADIENT }}>
                                <Target className="w-5 h-5 text-burgundy-800" />
                            </div>
                            <div>
                                <span className="font-bold text-amber-300 text-xl">{section.framework.name}</span>
                                <p className="text-amber-100/80 text-sm">Your step-by-step framework</p>
                            </div>
                        </div>
                        {/* Steps */}
                        <div className="p-5 bg-white space-y-4">
                            {section.framework.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-200">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md font-bold text-xl"
                                        style={{ background: GOLD_GRADIENT, color: '#4E1F24' }}
                                    >
                                        {step.letter}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-burgundy-800 text-lg">{step.title}</h5>
                                        <p className="text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'quiz':
                return (
                    <QuizSection key={index} questions={section.questions || []} />
                );

            case 'before-after':
                return (
                    <div key={index} className="grid md:grid-cols-2 gap-4 my-8">
                        {/* Before */}
                        <div className="rounded-xl border-2 border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="font-bold text-red-700">{section.before?.title || 'Before'}</span>
                            </div>
                            <ul className="p-4 space-y-2 bg-white">
                                {section.before?.items?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-600">
                                        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* After */}
                        <div className="rounded-xl border-2 border-emerald-200 overflow-hidden">
                            <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold text-emerald-700">{section.after?.title || 'After'}</span>
                            </div>
                            <ul className="p-4 space-y-2 bg-white">
                                {section.after?.items?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(180deg, #FFFCF5 0%, #F7F5F0 100%)' }}>
            {/* MAIN CONTENT - scrollable */}
            <div className="flex-1 min-w-0 overflow-auto">
                {/* Gamification Bar - Collapsible */}
                {!sidebarHidden && (
                    <GamificationBar
                        lessonNumber={lessonNumber}
                        totalLessons={totalLessons}
                        firstName={firstName}
                        justCompleted={justCompleted}
                    />
                )}

                {/* Reading Progress Bar - Sticky */}
                <div className="sticky top-0 z-30 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
                    <div className="mx-auto px-6 lg:px-12 xl:px-16 py-2.5">
                        <div className="flex items-center gap-3">
                            {/* Focus Mode Toggle */}
                            <button
                                onClick={() => setSidebarHidden(!sidebarHidden)}
                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                                style={{
                                    background: sidebarHidden ? GOLD_GRADIENT : 'rgba(255,255,255,0.7)',
                                    color: sidebarHidden ? '#4E1F24' : '#6B7280'
                                }}
                            >
                                {sidebarHidden ? (
                                    <>
                                        <BookOpen className="w-3.5 h-3.5" />
                                        Show Progress
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-3.5 h-3.5" />
                                        Focus Mode
                                    </>
                                )}
                            </button>

                            <div className="flex-1 h-2 bg-amber-200/50 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${readingProgress}%`,
                                        background: GOLD_GRADIENT
                                    }}
                                />
                            </div>
                            <span className="text-xs font-bold text-burgundy-700 min-w-[4rem]">
                                {Math.round(readingProgress)}% read
                            </span>
                        </div>
                    </div>
                </div>

                {/* Premium ASI Header - Gold Metallic */}
                <div className="relative overflow-hidden" style={{ background: GOLD_GRADIENT }}>
                    {/* Decorative elements */}
                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-300/50 rounded-tl-lg pointer-events-none" />
                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-300/50 rounded-tr-lg pointer-events-none" />

                    <div className="mx-auto px-6 lg:px-12 xl:px-16 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-300" style={{ background: BURGUNDY_GRADIENT }}>
                                    <GraduationCap className="w-7 h-7 text-amber-300" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl text-burgundy-900 drop-shadow-sm">{nicheLabel || "Certification"}</h1>
                                    <p className="text-burgundy-800/80 text-sm font-medium">Mini Diploma</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-2 rounded-lg text-sm shadow-inner" style={{ background: 'rgba(78, 31, 36, 0.9)' }}>
                                    <div className="flex items-center gap-2 text-amber-100">
                                        <BookOpen className="w-4 h-4" />
                                        <span>Lesson <span className="text-white font-bold">{lessonNumber}</span> of {totalLessons}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-100/70 text-xs mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{readingTime} read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gold accent */}
                    <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
                </div>

                {/* Main Content */}
                <div ref={contentRef} className="mx-auto px-6 lg:px-12 xl:px-16 py-8">
                    {/* Lesson Title Card */}
                    <div className="mb-8 bg-white rounded-2xl border-2 border-amber-200 shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: GOLD_GRADIENT, color: '#4E1F24' }}>
                                    LESSON {lessonNumber}
                                </span>
                                <Link
                                    href={baseUrl}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-burgundy-600 transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back to {nicheLabel}
                                </Link>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{lessonTitle}</h1>
                            <p className="text-lg text-slate-600">{lessonSubtitle}</p>
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

                    {/* Key Takeaways - Premium Gold */}
                    <div className="rounded-2xl border-2 p-6 mb-6 shadow-sm" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderColor: '#D4AF37' }}>
                        <h3 className="font-bold text-burgundy-800 mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm" style={{ background: GOLD_GRADIENT }}>
                                <Award className="w-4 h-4 text-burgundy-800" />
                            </span>
                            Key Takeaways from Lesson {lessonNumber}
                        </h3>
                        <ul className="space-y-3">
                            {keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-3 bg-white/60 rounded-lg p-3 border border-amber-200">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{highlightText(takeaway)}</span>
                                </li>
                            ))}
                        </ul>
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

                    {/* Completion Card - Premium Gold Design */}
                    <div className="rounded-2xl shadow-xl overflow-hidden" style={{ border: '3px solid #D4AF37' }}>
                        {/* Gold Header */}
                        <div className="relative px-6 py-4" style={{ background: GOLD_GRADIENT }}>
                            {/* Decorative corners */}
                            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-300/40 rounded-tl-lg pointer-events-none" />
                            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-300/40 rounded-tr-lg pointer-events-none" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-300" style={{ background: BURGUNDY_GRADIENT }}>
                                        <GraduationCap className="w-7 h-7 text-amber-300" />
                                    </div>
                                    <div>
                                        <p className="text-burgundy-800/80 text-sm font-medium">Lesson {lessonNumber} of {totalLessons}</p>
                                        <p className="text-burgundy-900 font-bold text-lg drop-shadow-sm">{lessonTitle}</p>
                                    </div>
                                </div>
                                {completed && (
                                    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm" style={{ background: BURGUNDY_GRADIENT }}>
                                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                                        <span className="text-sm font-bold text-amber-300">Completed</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6">
                            {/* Progress Bar */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercent}%`, background: GOLD_GRADIENT }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-burgundy-700">{Math.round(progressPercent)}%</span>
                            </div>


                            {lessonNumber < totalLessons ? (
                                <button
                                    onClick={handleComplete}
                                    className="w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-burgundy-900"
                                    style={{
                                        background: GOLD_GRADIENT,
                                        boxShadow: '0 6px 20px -5px rgba(212, 175, 55, 0.5)'
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {completed ? 'Continue to Lesson ' : 'Complete & Continue to Lesson '}
                                        {lessonNumber + 1}
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    className="w-full font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-burgundy-900"
                                    style={{
                                        background: GOLD_GRADIENT,
                                        boxShadow: '0 6px 20px -5px rgba(212, 175, 55, 0.5)'
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <GraduationCap className="w-5 h-5" />
                                        {completed ? 'Proceed to Final Exam' : 'Complete & Proceed to Final Exam'}
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                </button>
                            )}

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                {lessonNumber > 1 ? (
                                    <Link
                                        href={`${baseUrl}/lesson/${lessonNumber - 1}`}
                                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-burgundy-700 hover:bg-burgundy-50 transition-colors border border-burgundy-200"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Previous
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {lessonNumber < totalLessons && (
                                    <Link
                                        href={`${baseUrl}/lesson/${lessonNumber + 1}`}
                                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-burgundy-700 hover:bg-burgundy-50 transition-colors border border-burgundy-200"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Copyright Footer - Premium */}
                    <div className="text-center mt-8 py-6 border-t-2 border-amber-200" style={{ background: 'linear-gradient(to right, #FFFBEB, #FDF6E3, #FFFBEB)' }}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-semibold text-burgundy-700">AccrediPro International Standards Institute</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} All rights reserved.
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
