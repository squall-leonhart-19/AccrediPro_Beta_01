"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    CheckCircle2, ArrowRight, ArrowLeft,
    GraduationCap, Lightbulb, X, AlertCircle, Check
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { GamificationBar } from "@/components/mini-diploma/gamification-bar";
import { WelcomeAudio } from "@/components/mini-diploma/welcome-audio";
import { CommitmentCheckpoint } from "@/components/mini-diploma/commitment-checkpoint";
import { CertificatePreview } from "@/components/mini-diploma/certificate-preview";
import confetti from "canvas-confetti";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// --- Types ---

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface LessonSection {
    type: 'intro' | 'heading' | 'text' | 'list' | 'quote' | 'callout' | 'key-point'
        | 'example' | 'definition' | 'framework' | 'quiz' | 'before-after'
        | 'checkpoint' | 'reveal-card' | 'micro-commitment' | 'income-calculator';
    content: string;
    items?: string[];
    style?: 'info' | 'warning' | 'success' | 'tip';
    term?: string;
    framework?: { name: string; steps: { letter: string; title: string; description: string }[] };
    questions?: QuizQuestion[];
    before?: { title: string; items: string[] };
    after?: { title: string; items: string[] };
    // New interactive types
    checkpoint?: {
        question: string;
        options: { label: string; isCorrect: boolean }[];
        successMessage?: string;
    };
    revealCard?: { teaser: string; content: string };
    commitmentOptions?: { positive: string; neutral: string };
    calculator?: { avgPackagePrice: number; maxClients: number };
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
    courseSlug?: string;
    showChat?: boolean;
}

// --- Sub-Components ---

function StepIndicator({ totalSteps, currentStep, unlockedSteps }: {
    totalSteps: number; currentStep: number; unlockedSteps: Set<number>;
}) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === currentStep
                            ? "w-6 bg-amber-600"
                            : unlockedSteps.has(i)
                                ? "w-2 bg-amber-400"
                                : "w-2 bg-gray-300"
                    )}
                />
            ))}
        </div>
    );
}

function InlineCheckpoint({
    checkpoint, onCorrect
}: {
    checkpoint: NonNullable<LessonSection['checkpoint']>;
    onCorrect: () => void;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [shaking, setShaking] = useState(false);

    const handleSelect = (index: number) => {
        if (answered) return;
        setSelected(index);
        const isCorrect = checkpoint.options[index].isCorrect;

        if (isCorrect) {
            setAnswered(true);
            confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
            setTimeout(onCorrect, 1500);
        } else {
            setShaking(true);
            setTimeout(() => { setSelected(null); setShaking(false); }, 800);
        }
    };

    return (
        <div className="my-8 p-5 rounded-xl border border-amber-200" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700/70 mb-2">Quick Check</p>
            <p className="font-semibold text-gray-900 mb-4 text-lg">{checkpoint.question}</p>
            <div className="space-y-2.5">
                {checkpoint.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={answered}
                        className={cn(
                            "w-full text-left p-3.5 rounded-lg border-2 transition-all font-medium",
                            selected === i && answered && opt.isCorrect
                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                : selected === i && shaking
                                    ? "border-red-300 bg-red-50 animate-shake"
                                    : "border-amber-200/80 bg-white hover:border-amber-400 hover:shadow-sm"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            {answered && (
                <div className="mt-4 flex items-start gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">{checkpoint.successMessage || "That's right!"}</p>
                </div>
            )}
            {shaking && (
                <p className="mt-3 text-sm text-red-500 font-medium">Not quite — try again!</p>
            )}
        </div>
    );
}

function RevealCard({ revealCard, highlightText }: {
    revealCard: NonNullable<LessonSection['revealCard']>;
    highlightText: (text: string) => React.ReactNode;
}) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="my-6">
            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-left hover:bg-amber-100 transition-colors group"
                >
                    <span className="text-amber-800 font-medium flex items-center gap-2">
                        {revealCard.teaser}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            ) : (
                <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-xl animate-fade-in">
                    <p className="text-gray-700 leading-relaxed">{highlightText(revealCard.content)}</p>
                </div>
            )}
        </div>
    );
}

function MicroCommitment({ content, options }: {
    content: string;
    options: NonNullable<LessonSection['commitmentOptions']>;
}) {
    const [responded, setResponded] = useState(false);

    return (
        <div className="my-8 p-5 bg-amber-50/60 rounded-xl border border-amber-200">
            <p className="text-gray-800 font-medium mb-4">{content}</p>
            {!responded ? (
                <div className="flex gap-3">
                    <button
                        onClick={() => setResponded(true)}
                        className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                    >
                        {options.positive}
                    </button>
                    <button
                        onClick={() => setResponded(true)}
                        className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        {options.neutral}
                    </button>
                </div>
            ) : (
                <p className="text-amber-700 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    That&apos;s the spirit! Keep going...
                </p>
            )}
        </div>
    );
}

function InlineIncomeCalculator({ calculator }: {
    calculator?: LessonSection['calculator'];
}) {
    const [clients, setClients] = useState(5);
    const avgPrice = calculator?.avgPackagePrice || 300;
    const maxClients = calculator?.maxClients || 30;
    const monthlyIncome = clients * avgPrice;

    return (
        <div className="my-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-5">
                Your Potential Monthly Income
            </h4>
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>Clients per month</span>
                    <span className="font-semibold text-gray-900 text-lg">{clients}</span>
                </div>
                <Slider
                    value={[clients]}
                    onValueChange={(v) => setClients(v[0])}
                    min={1}
                    max={maxClients}
                    step={1}
                    className="py-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1 client</span>
                    <span>{maxClients} clients</span>
                </div>
            </div>
            <div className="text-center p-5 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-gray-600 mb-1">Estimated monthly income</p>
                <p className="text-4xl font-bold text-emerald-600">
                    ${monthlyIncome.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    at ${avgPrice}/client average package
                </p>
            </div>
        </div>
    );
}

// --- Main Component ---

export function ClassicLessonBase({
    lessonNumber,
    lessonTitle,
    lessonSubtitle,
    totalLessons = 3,
    sections,
    keyTakeaways,
    onComplete,
    onNext,
    isCompleted = false,
    firstName = "friend",
    niche,
    nicheLabel,
    baseUrl,
    showChat = false,
}: ClassicLessonBaseProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [justCompleted, setJustCompleted] = useState(false);
    const [showCommitmentModal, setShowCommitmentModal] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Progressive reveal: group sections into steps (split at 'heading')
    const steps = useMemo(() => {
        const result: LessonSection[][] = [];
        let current: LessonSection[] = [];

        sections.forEach((section) => {
            if (section.type === 'heading' && current.length > 0) {
                result.push(current);
                current = [section];
            } else {
                current.push(section);
            }
        });
        if (current.length > 0) result.push(current);
        return result;
    }, [sections]);

    // Restore step progress from localStorage
    const storageKey = `lesson_${niche}_${lessonNumber}_step`;
    const [currentStep, setCurrentStep] = useState(() => {
        if (typeof window === 'undefined') return 0;
        const saved = localStorage.getItem(storageKey);
        return saved ? Math.min(parseInt(saved, 10), steps.length - 1) : 0;
    });
    const [unlockedSteps, setUnlockedSteps] = useState<Set<number>>(() => {
        if (typeof window === 'undefined') return new Set([0]);
        const saved = localStorage.getItem(storageKey);
        const savedStep = saved ? parseInt(saved, 10) : 0;
        return new Set(Array.from({ length: savedStep + 1 }, (_, i) => i));
    });

    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Persist step progress
    useEffect(() => {
        localStorage.setItem(storageKey, String(currentStep));
    }, [currentStep, storageKey]);

    // Estimated time remaining
    const estimatedTotalMinutes = Math.max(3, Math.round(sections.length * 0.35));
    const minutesRemaining = Math.max(1, Math.round(
        estimatedTotalMinutes * (1 - (currentStep + 1) / steps.length)
    ));

    // Commitment checkpoint after L2
    useEffect(() => {
        if (lessonNumber === 2 && justCompleted) {
            const hasCommitted = localStorage.getItem("mini_diploma_committed");
            if (!hasCommitted) {
                setTimeout(() => setShowCommitmentModal(true), 1500);
            }
        }
    }, [lessonNumber, justCompleted]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === 'ArrowRight' && lessonNumber < totalLessons) {
                window.location.href = `${baseUrl}/lesson/${lessonNumber + 1}`;
            } else if (e.key === 'ArrowLeft' && lessonNumber > 1) {
                window.location.href = `${baseUrl}/lesson/${lessonNumber - 1}`;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lessonNumber, totalLessons, baseUrl]);

    const handleAdvanceStep = useCallback(() => {
        const nextStep = currentStep + 1;
        if (nextStep < steps.length) {
            setUnlockedSteps(prev => new Set([...prev, nextStep]));
            setCurrentStep(nextStep);
            setTimeout(() => {
                stepRefs.current[nextStep]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [currentStep, steps.length]);

    const handleComplete = async () => {
        if (!completed) {
            await onComplete?.();
            setCompleted(true);
            setJustCompleted(true);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            setTimeout(() => setJustCompleted(false), 4500);
        }
        onNext?.();
    };

    // Highlight **bold** (yellow bg), $money (green), and {name} in text
    const highlightText = (text: string): React.ReactNode => {
        if (!text) return text;
        let processed = text.replace(/{name}/g, firstName);

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        const regex = /(\$[\d,]+(?:\+)?(?:\/\w+)?(?:\s*[-–]\s*\$[\d,]+(?:\+)?(?:\/\w+)?)?)|(\*\*([^*]+)\*\*)/g;
        let match;

        while ((match = regex.exec(processed)) !== null) {
            if (match.index > lastIndex) parts.push(processed.slice(lastIndex, match.index));
            if (match[1]) {
                parts.push(
                    <span key={`m-${match.index}`} className="text-emerald-600 font-semibold">{match[0]}</span>
                );
            } else if (match[2]) {
                parts.push(
                    <mark key={`b-${match.index}`} className="bg-amber-100/80 text-gray-900 font-semibold px-0.5 rounded-sm" style={{ textDecoration: 'none' }}>{match[3]}</mark>
                );
            }
            lastIndex = match.index + match[0].length;
        }

        if (parts.length === 0) return processed;
        if (lastIndex < processed.length) parts.push(processed.slice(lastIndex));
        return parts;
    };

    // Section renderer
    const renderSection = (section: LessonSection, index: number) => {
        switch (section.type) {
            case 'intro':
                return (
                    <div key={index} className="flex items-start gap-4 rounded-xl p-5 bg-gray-50 border border-gray-200">
                        <Image src={SARAH_AVATAR} alt="Sarah" width={48} height={48}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Sarah, Your Coach</p>
                            <p className="text-gray-700 leading-relaxed">{highlightText(section.content)}</p>
                        </div>
                    </div>
                );

            case 'heading':
                return (
                    <h2 key={index} className="text-xl font-semibold text-gray-800 mt-8 mb-4">
                        {highlightText(section.content)}
                    </h2>
                );

            case 'text':
                return (
                    <p key={index} className="text-gray-700 leading-relaxed text-[17px] mb-4">
                        {highlightText(section.content)}
                    </p>
                );

            case 'list':
                return (
                    <ul key={index} className="space-y-3 mb-6 pl-1">
                        {section.items?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="flex-shrink-0 mt-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-700"
                                    style={{ background: 'linear-gradient(135deg, #fde68a, #fbbf24)' }}>
                                    {i + 1}
                                </span>
                                <span className="text-gray-700 leading-relaxed">{highlightText(item)}</span>
                            </li>
                        ))}
                    </ul>
                );

            case 'quote':
                return (
                    <blockquote key={index} className="border-l-4 border-amber-400 pl-4 py-3 my-6 bg-amber-50/30 rounded-r-lg">
                        <p className="text-gray-700 italic leading-relaxed">{highlightText(section.content)}</p>
                    </blockquote>
                );

            case 'callout': {
                const calloutStyles = {
                    info: 'bg-blue-50/70 border-blue-200 text-blue-800',
                    warning: 'bg-amber-50/70 border-amber-200 text-amber-800',
                    success: 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
                    tip: 'bg-purple-50/70 border-purple-200 text-purple-800',
                };
                const s = section.style || 'info';
                return (
                    <div key={index} className={`rounded-xl p-4 border my-6 ${calloutStyles[s]}`}>
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-70" />
                            <p className="text-sm leading-relaxed">{highlightText(section.content)}</p>
                        </div>
                    </div>
                );
            }

            case 'key-point':
                return (
                    <div key={index} className="border-l-4 border-amber-500 pl-4 py-3 my-6 bg-amber-50/40 rounded-r-lg">
                        <p className="text-gray-700 font-medium leading-relaxed">{highlightText(section.content)}</p>
                    </div>
                );

            case 'example':
                return (
                    <div key={index} className="rounded-xl p-5 border border-gray-200 bg-gray-50 my-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Real-World Example</p>
                        <p className="text-gray-700 leading-relaxed">{highlightText(section.content)}</p>
                    </div>
                );

            case 'definition':
                return (
                    <div key={index} className="my-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                            {section.term || 'Definition'}
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed">{highlightText(section.content)}</p>
                    </div>
                );

            case 'framework':
                if (!section.framework) return null;
                return (
                    <div key={index} className="my-8 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 bg-gray-900">
                            <h3 className="font-bold text-white text-lg">{section.framework.name}</h3>
                            <p className="text-gray-400 text-sm">Your step-by-step framework</p>
                        </div>
                        <div className="p-4 space-y-3 bg-white">
                            {section.framework.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                                        {step.letter}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900">{step.title}</h5>
                                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'quiz':
                // Legacy quiz type — render nothing (quizzes removed)
                return null;

            case 'before-after':
                return (
                    <div key={index} className="grid md:grid-cols-2 gap-4 my-8">
                        <div className="rounded-xl border border-red-200 overflow-hidden">
                            <div className="px-4 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span className="font-semibold text-red-700 text-sm">{section.before?.title || 'Before'}</span>
                            </div>
                            <ul className="p-4 space-y-2 bg-white">
                                {section.before?.items?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-xl border border-emerald-200 overflow-hidden">
                            <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="font-semibold text-emerald-700 text-sm">{section.after?.title || 'After'}</span>
                            </div>
                            <ul className="p-4 space-y-2 bg-white">
                                {section.after?.items?.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            // --- New Interactive Types ---

            case 'checkpoint':
                if (!section.checkpoint) return null;
                return (
                    <InlineCheckpoint
                        key={index}
                        checkpoint={section.checkpoint}
                        onCorrect={handleAdvanceStep}
                    />
                );

            case 'reveal-card':
                if (!section.revealCard) return null;
                return <RevealCard key={index} revealCard={section.revealCard} highlightText={highlightText} />;

            case 'micro-commitment':
                if (!section.commitmentOptions) return null;
                return <MicroCommitment key={index} content={section.content} options={section.commitmentOptions} />;

            case 'income-calculator':
                return <InlineIncomeCalculator key={index} calculator={section.calculator} />;

            default:
                return null;
        }
    };

    const isOnLastStep = currentStep >= steps.length - 1;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Confetti-only gamification bar (no visible UI) */}
            <GamificationBar
                lessonNumber={lessonNumber}
                totalLessons={totalLessons}
                firstName={firstName}
                justCompleted={justCompleted}
            />

            {/* Sticky Progress Bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-6 py-2.5">
                    <div className="flex items-center gap-3">
                        <StepIndicator
                            totalSteps={steps.length}
                            currentStep={currentStep}
                            unlockedSteps={unlockedSteps}
                        />
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {isOnLastStep ? 'Almost done' : `~${minutesRemaining} min left`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Clean Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-6 py-5">
                    <Link href={baseUrl} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
                        <ArrowLeft className="w-3 h-3" /> Back to {nicheLabel}
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lessonTitle}</h1>
                    <p className="text-gray-600 mt-1">{lessonSubtitle}</p>
                    <p className="text-sm text-gray-400 mt-2">Lesson {lessonNumber} of {totalLessons}</p>
                </div>
            </div>

            {/* Main Content */}
            <div ref={contentRef} className="max-w-3xl mx-auto px-6 py-8">
                {/* Welcome Audio - Only on Lesson 1 */}
                {lessonNumber === 1 && (
                    <WelcomeAudio firstName={firstName} nicheLabel={nicheLabel} />
                )}

                {/* Certificate Preview - Only on Lesson 1 */}
                {lessonNumber === 1 && (
                    <CertificatePreview
                        firstName={firstName}
                        nicheLabel={nicheLabel}
                        lessonNumber={lessonNumber}
                        totalLessons={totalLessons}
                    />
                )}

                {/* Progressive Reveal: Steps */}
                <div className="space-y-2">
                    {steps.map((stepSections, stepIndex) => {
                        const isUnlocked = unlockedSteps.has(stepIndex);
                        const isCurrent = stepIndex === currentStep;
                        const isLast = stepIndex === steps.length - 1;

                        if (!isUnlocked) return null;

                        return (
                            <div
                                key={stepIndex}
                                ref={(el) => { stepRefs.current[stepIndex] = el; }}
                                className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 animate-fade-in"
                            >
                                <div className="space-y-1">
                                    {stepSections.map((section, i) => renderSection(section, stepIndex * 100 + i))}
                                </div>

                                {/* Continue button at bottom of each step (except last) */}
                                {isCurrent && !isLast && (
                                    <button
                                        onClick={handleAdvanceStep}
                                        className="w-full mt-8 py-3.5 px-6 text-white font-semibold rounded-xl transition-all hover:brightness-110 hover:shadow-lg flex items-center justify-center gap-2 text-base"
                                        style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8963c 50%, #d4af37 100%)' }}
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Key Takeaways — shown only after all steps are unlocked */}
                {isOnLastStep && (
                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 mt-6 animate-fade-in">
                        <h3 className="font-semibold text-gray-900 mb-4">Key Takeaways</h3>
                        <ul className="space-y-2.5">
                            {keyTakeaways.map((takeaway, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                                    <span className="text-gray-700">{highlightText(takeaway)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Certificate Progress Reminder */}
                {isOnLastStep && lessonNumber < totalLessons && (
                    <div className="bg-amber-50 rounded-xl p-4 mt-6 border border-amber-200">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-gray-700">
                                <strong>{totalLessons - lessonNumber} more lesson{totalLessons - lessonNumber > 1 ? 's' : ''}</strong> until your certificate is ready!
                            </span>
                        </div>
                    </div>
                )}

                {/* Completion Card — shown only after all steps */}
                {isOnLastStep && (
                    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 mt-6 animate-fade-in">
                        {lessonNumber < totalLessons ? (
                            <button
                                onClick={handleComplete}
                                className="w-full font-bold py-4 rounded-xl text-white transition-all hover:brightness-110 hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                                style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8963c 50%, #d4af37 100%)' }}
                            >
                                Continue to Lesson {lessonNumber + 1}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="w-full font-bold py-4 rounded-xl text-white transition-all hover:brightness-110 hover:shadow-lg flex items-center justify-center gap-2 text-lg"
                                style={{ background: 'linear-gradient(135deg, #d4af37 0%, #a07c28 50%, #d4af37 100%)' }}
                            >
                                <GraduationCap className="w-5 h-5" />
                                Complete & Proceed to Final Exam
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}

                        {/* Navigation */}
                        {lessonNumber > 1 && (
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                <Link
                                    href={`${baseUrl}/lesson/${lessonNumber - 1}`}
                                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </Link>
                                {lessonNumber < totalLessons && (
                                    <Link
                                        href={`${baseUrl}/lesson/${lessonNumber + 1}`}
                                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Next <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-10 py-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} AccrediPro International Standards Institute
                    </p>
                </div>
            </div>

            {/* Commitment Checkpoint Modal */}
            {showCommitmentModal && (
                <CommitmentCheckpoint
                    firstName={firstName}
                    lessonNumber={lessonNumber}
                    totalLessons={totalLessons}
                    onCommit={() => {
                        setShowCommitmentModal(false);
                        window.location.href = `${baseUrl}/lesson/${lessonNumber + 1}`;
                    }}
                    onDismiss={() => setShowCommitmentModal(false)}
                />
            )}
        </div>
    );
}
