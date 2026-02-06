"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Play,
    CheckCircle,
    Lock,
    ArrowRight,
    Clock,
    BookOpen,
    Award,
    GraduationCap,
    Timer,
    MessageCircle,
    Users,
    X,
} from "lucide-react";

// Countdown component for cohort expiry
function CohortCountdown({ enrolledAt }: { enrolledAt?: Date | string | null }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const startDate = enrolledAt ? new Date(enrolledAt) : new Date();
        const expiryDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);

        const updateTimer = () => {
            const now = new Date();
            const diff = expiryDate.getTime() - now.getTime();

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
                setIsExpired(false);
            } else {
                setIsExpired(true);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [enrolledAt]);

    if (isExpired) {
        return <span className="font-mono font-bold text-red-200">Expired</span>;
    }

    return (
        <span className="font-mono font-bold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
    );
}

// Module structure type
interface ModuleConfig {
    id: number;
    title: string;
    description: string;
    icon: "BookOpen" | "Target" | "Award";
    lessons: { id: number; title: string; duration: string }[];
}

// Diploma configuration type
export interface DiplomaConfig {
    slug: string;
    portalSlug: string;
    name: string;
    shortName: string;
    modules: ModuleConfig[];
    coachName: string;
    coachImage: string;
    resources?: never[];
}

interface LeadPortalDashboardProps {
    firstName: string;
    completedLessons: number[];
    config: DiplomaConfig;
    enrolledAt?: Date | string | null;
    hasCompletedQuiz?: boolean;
}

// Welcome Review Overlay — FULL PAGE with approval animation
function WelcomeReviewOverlay({
    firstName,
    coachImage,
    onComplete,
    portalSlug,
}: {
    firstName: string;
    coachImage: string;
    onComplete: () => void;
    portalSlug: string;
}) {
    const [phase, setPhase] = useState<"reviewing" | "accepted">("reviewing");
    const [reviewStep, setReviewStep] = useState(0);

    const cohortNumber = 110;

    const reviewMessages = [
        "Reading your application...",
        "Checking your background...",
        "Reviewing your goals...",
        "Assessing your commitment...",
        "Making my decision..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setReviewStep(prev => {
                if (prev < reviewMessages.length - 1) return prev + 1;
                return prev;
            });
        }, 2000);

        const acceptedTimer = setTimeout(() => {
            setPhase("accepted");
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(acceptedTimer);
        };
    }, [reviewMessages.length]);

    // After acceptance, redirect directly to Lesson 1
    const handleStartLesson = () => {
        window.location.href = `/portal/${portalSlug}/lesson/1`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)' }}>
            <div className="w-full max-w-lg mx-4">
                {phase === "reviewing" ? (
                    <div className="text-center">
                        <div className="relative mb-8">
                            <Image
                                src={coachImage}
                                alt="Coach Sarah"
                                width={140}
                                height={140}
                                className="rounded-full mx-auto shadow-2xl animate-pulse"
                                style={{
                                    border: '5px solid #d4af37',
                                    boxShadow: '0 0 50px rgba(212, 175, 55, 0.4)'
                                }}
                            />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4">
                            One moment, {firstName}...
                        </h2>
                        <p className="text-xl text-gray-300 mb-8" key={reviewStep}>
                            {reviewMessages[reviewStep]}
                        </p>

                        <div className="flex items-center justify-center gap-3 mb-8">
                            {reviewMessages.map((_, i) => (
                                <div
                                    key={i}
                                    className="w-4 h-4 rounded-full transition-all duration-500"
                                    style={{
                                        background: i <= reviewStep
                                            ? 'linear-gradient(135deg, #d4af37, #f7e7a0, #d4af37)'
                                            : 'rgba(255,255,255,0.2)',
                                        transform: i === reviewStep ? 'scale(1.4)' : 'scale(1)',
                                        boxShadow: i <= reviewStep ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none'
                                    }}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-500">
                            I personally review every application to ensure we&apos;re a perfect fit.
                        </p>
                    </div>
                ) : (
                    <div
                        className="rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                            background: 'white',
                            border: '4px solid transparent',
                            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #d4af37, #f7e7a0, #d4af37, #b8860b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        <div
                            className="px-6 py-5"
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image src="/newlogo.webp" alt="ASI" width={44} height={44} className="rounded-lg shadow-md" />
                                    <div>
                                        <p className="font-black text-[#4e1f24]">AccrediPro Institute</p>
                                        <p className="text-xs font-medium text-[#722f37]">ASI-Accredited Certification</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-full font-black text-sm" style={{ background: '#4e1f24', color: '#d4af37' }}>
                                    Cohort #{cohortNumber}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 text-center">
                            <div
                                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)' }}
                            >
                                <CheckCircle className="w-14 h-14 text-white" />
                            </div>

                            <h3
                                className="text-3xl font-black mb-2"
                                style={{ background: 'linear-gradient(135deg, #722f37 0%, #4e1f24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                            >
                                Congratulations, {firstName}!
                            </h3>

                            <p className="text-xl font-bold mb-2" style={{ color: '#22c55e' }}>
                                You Qualify!
                            </p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-gray-700 mb-2">
                                    Your spot in <span className="font-bold" style={{ color: '#722f37' }}>Cohort #{cohortNumber}</span> is confirmed.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Complete 3 lessons + exam to earn your certificate
                                </p>
                            </div>

                            <Button
                                onClick={handleStartLesson}
                                className="w-full h-16 text-xl font-black shadow-lg hover:scale-[1.02] transition-transform"
                                style={{
                                    background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                                    color: '#4e1f24',
                                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
                                }}
                            >
                                <Play className="w-6 h-6 mr-2" />
                                Start Your First Lesson
                                <ArrowRight className="w-6 h-6 ml-2" />
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Free Certification
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    2,400+ Graduates
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4 text-amber-500" />
                                    ASI-Verified
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function LeadPortalDashboard({
    firstName,
    completedLessons,
    config,
    enrolledAt,
}: LeadPortalDashboardProps) {
    const searchParams = useSearchParams();
    const isFirstVisit = searchParams.get("name") !== null;
    const [showWelcome, setShowWelcome] = useState(isFirstVisit);

    // Calculate progress
    const totalLessons = config.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const lessonsCompleted = completedLessons.length;
    const isAllComplete = lessonsCompleted === totalLessons;

    // All lessons flat
    const allLessons = config.modules.flatMap(m => m.lessons);
    const nextLessonId = completedLessons.length > 0
        ? Math.max(...completedLessons) + 1
        : 1;

    const basePath = `/${config.slug}`;
    const portalPath = `/portal/${config.portalSlug}`;

    // Handle welcome complete — clean URL
    const handleWelcomeComplete = () => {
        setShowWelcome(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("name");
        window.history.replaceState({}, "", url.toString());
    };

    // Steps for 4-step progress: L1, L2, L3, Exam
    const steps = [
        ...allLessons.map(l => ({ label: `L${l.id}`, completed: completedLessons.includes(l.id), isCurrent: l.id === nextLessonId && !isAllComplete })),
        { label: "Exam", completed: isAllComplete, isCurrent: lessonsCompleted === totalLessons && !isAllComplete },
    ];

    return (
        <>
            {/* Welcome Review Overlay → redirects to Lesson 1 */}
            {showWelcome && (
                <WelcomeReviewOverlay
                    firstName={firstName}
                    coachImage={config.coachImage}
                    onComplete={handleWelcomeComplete}
                    portalSlug={config.portalSlug}
                />
            )}

            <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #f5efe6 100%)' }}>
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

                    {/* Welcome Card — Coach Sarah + Countdown + Giant CTA */}
                    <Card
                        className="border-0 shadow-xl overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)' }}
                    >
                        <CardContent className="p-5 sm:p-6 relative">
                            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#d4af37' }} />

                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                                    style={{ border: '3px solid #d4af37', boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}
                                >
                                    <Image src={config.coachImage} alt={config.coachName} width={64} height={64} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: '#d4af37' }}>Coach {config.coachName}</p>
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
                                        {lessonsCompleted === 0
                                            ? `Welcome, ${firstName}!`
                                            : isAllComplete
                                                ? `Congratulations, ${firstName}!`
                                                : `Keep going, ${firstName}!`
                                        }
                                    </h2>
                                    {!isAllComplete && (
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <Timer className="w-4 h-4" style={{ color: '#d4af37' }} />
                                            <span>Access expires in </span>
                                            <CohortCountdown enrolledAt={enrolledAt} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Giant CTA */}
                            {!isAllComplete && nextLessonId <= totalLessons ? (
                                <Link href={`${basePath}/lesson/${nextLessonId}`} className="block">
                                    <div
                                        className="rounded-xl px-5 py-4 flex items-center justify-between group hover:brightness-105 transition-all hover:scale-[1.01]"
                                        style={{
                                            background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                                            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(78, 31, 36, 0.2)' }}>
                                                <Play className="w-5 h-5" style={{ color: '#4e1f24' }} />
                                            </div>
                                            <div>
                                                <p className="font-black text-base sm:text-lg" style={{ color: '#4e1f24' }}>
                                                    {lessonsCompleted === 0 ? 'Start Lesson 1' : `Continue — Lesson ${nextLessonId}`}
                                                </p>
                                                <p className="text-sm font-medium" style={{ color: '#722f37' }}>
                                                    {allLessons.find(l => l.id === nextLessonId)?.title} — {allLessons.find(l => l.id === nextLessonId)?.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={{ color: '#4e1f24' }} />
                                    </div>
                                </Link>
                            ) : isAllComplete ? (
                                <Link href={`${basePath}/complete`} className="block">
                                    <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-4 flex items-center justify-between group hover:from-emerald-600 hover:to-emerald-700 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-base sm:text-lg">Take Your Final Exam</p>
                                                <p className="text-emerald-100 text-sm">Earn your ASI-verified certificate</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* 4-Step Progress Bar: L1, L2, L3, Exam */}
                    <Card className="border-0 shadow-lg bg-white">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-slate-700">Your Progress</span>
                                <span className="text-sm font-bold" style={{ color: '#722f37' }}>
                                    {lessonsCompleted}/{totalLessons} Lessons
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex-1 text-center">
                                        <div
                                            className="h-3 rounded-full mb-1.5 transition-all"
                                            style={{
                                                background: step.completed
                                                    ? 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)'
                                                    : step.isCurrent
                                                        ? '#722f37'
                                                        : '#e2e8f0'
                                            }}
                                        />
                                        <span className={`text-xs font-medium ${step.completed ? 'text-amber-700' : step.isCurrent ? 'text-burgundy-700 font-bold' : 'text-slate-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Study Circle Card — Gold Metal */}
                    <Link href={`${portalPath}/circle`} className="block">
                        <Card
                            className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)' }}
                        >
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(78, 31, 36, 0.15)' }}>
                                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#4e1f24' }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-base sm:text-lg" style={{ color: '#4e1f24' }}>Your Private Study Circle</h3>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                            <p className="text-xs sm:text-sm" style={{ color: '#722f37' }}>
                                                Coach Sarah & your study buddy
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2" style={{ background: '#4e1f24', color: '#d4af37' }}>
                                        <span className="hidden sm:inline">Enter</span> Circle
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Lesson List — Flat, no modules */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#4e1f24' }}>
                            <BookOpen className="w-5 h-5" style={{ color: '#d4af37' }} />
                            Your Lessons
                        </h2>

                        <Card className="border-0 shadow-xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {allLessons.map((lesson) => {
                                        const isCompleted = completedLessons.includes(lesson.id);
                                        const isNext = lesson.id === nextLessonId && !isAllComplete;
                                        const prevCompleted = lesson.id === 1 || completedLessons.includes(lesson.id - 1);
                                        const isLocked = !isCompleted && !isNext && !prevCompleted;

                                        return (
                                            <div
                                                key={lesson.id}
                                                className={`flex items-center gap-4 px-4 sm:px-5 py-4 transition-colors ${
                                                    isCompleted ? 'bg-white' : isNext ? 'bg-amber-50/50' : isLocked ? 'bg-slate-50/50 opacity-60' : 'bg-white hover:bg-slate-50'
                                                }`}
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                                        isCompleted ? 'text-white' : isNext ? 'text-white' : isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-200 text-slate-600'
                                                    }`}
                                                    style={
                                                        isCompleted ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)' }
                                                        : isNext ? { background: 'linear-gradient(135deg, #722f37, #4e1f24)' }
                                                        : {}
                                                    }
                                                >
                                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : lesson.id}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-medium truncate ${isCompleted ? 'text-slate-700' : isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                                        {lesson.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {lesson.duration}
                                                    </p>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    {isCompleted ? (
                                                        <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                            <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                <span className="hidden sm:inline">Review</span>
                                                            </Button>
                                                        </Link>
                                                    ) : isNext ? (
                                                        <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                            <Button
                                                                size="sm"
                                                                className="font-bold text-white"
                                                                style={{ background: 'linear-gradient(135deg, #722f37, #4e1f24)' }}
                                                            >
                                                                <Play className="w-4 h-4 sm:mr-1" />
                                                                <span className="hidden sm:inline">Start</span>
                                                            </Button>
                                                        </Link>
                                                    ) : isLocked ? (
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Lock className="w-3 h-3" />
                                                            <span className="hidden sm:inline">Locked</span>
                                                        </span>
                                                    ) : (
                                                        <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                            <Button size="sm" variant="outline" className="border-slate-300">Start</Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Final Exam Row */}
                                    <div
                                        className={`flex items-center gap-4 px-4 sm:px-5 py-4 transition-colors ${
                                            isAllComplete ? 'bg-amber-50/50' : 'bg-slate-50/50 opacity-60'
                                        }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                                            style={
                                                isAllComplete
                                                    ? { background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)', color: '#4e1f24' }
                                                    : { background: '#e2e8f0', color: '#94a3b8' }
                                            }
                                        >
                                            {isAllComplete ? <GraduationCap className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium ${isAllComplete ? 'text-slate-900' : 'text-slate-400'}`}>
                                                Final Certification Exam
                                            </h4>
                                            <p className="text-xs text-slate-400">Complete all lessons to unlock</p>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {isAllComplete ? (
                                                <Link href={`${basePath}/complete`}>
                                                    <Button
                                                        size="sm"
                                                        className="font-bold"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)',
                                                            color: '#4e1f24'
                                                        }}
                                                    >
                                                        <GraduationCap className="w-4 h-4 sm:mr-1" />
                                                        <span className="hidden sm:inline">Take Exam</span>
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Lock className="w-3 h-3" />
                                                    <span className="hidden sm:inline">Locked</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Certificate Preview — Locked until exam passed */}
                    {!isAllComplete && (
                        <Card className="border-0 shadow-lg overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 z-10 flex items-center justify-center">
                                <div className="text-center px-4">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border-2 border-white/20">
                                        <Lock className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-white font-bold text-base sm:text-lg mb-1">Complete {totalLessons - lessonsCompleted} more lesson{totalLessons - lessonsCompleted !== 1 ? 's' : ''} + exam</p>
                                    <p className="text-white/70 text-sm">to unlock your certificate</p>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200/50">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <Award className="w-5 h-5 text-amber-600" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">ASI Foundation Certificate</span>
                                        </div>
                                        <p className="text-3xl font-serif font-bold text-slate-800 mb-2">{firstName}</p>
                                        <p className="text-sm text-slate-600">has successfully completed the</p>
                                        <p className="text-lg font-bold mt-1" style={{ color: '#722f37' }}>{config.name}</p>
                                        <div className="mt-4 pt-4 border-t border-amber-200/50">
                                            <p className="text-xs text-slate-500">AccrediPro Standards Institute</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completed State — Certificate Ready */}
                    {isAllComplete && (
                        <Card className="border-0 shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Your Certificate is Ready!</h3>
                                        <p className="text-emerald-100 text-sm">Download your ASI-verified foundation certificate</p>
                                    </div>
                                </div>
                                <Link href={`${basePath}/complete`}>
                                    <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold w-full sm:w-auto">
                                        Claim Certificate
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
