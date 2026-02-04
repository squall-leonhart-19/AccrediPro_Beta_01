"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Play,
    CheckCircle,
    Lock,
    Trophy,
    Sparkles,
    ArrowRight,
    Clock,
    BookOpen,
    Target,
    Award,
    GraduationCap,
    Timer,
    MessageCircle,
    X,
    Users,
    FileText,
    Compass,
    Heart,
    Map,
    MessageSquare,
    Lightbulb,
    Download,
    ExternalLink,
} from "lucide-react";
import { LiveChatPanel } from "@/components/courses/live-chat-panel";
import { GraduatesChannel } from "@/components/mini-diploma/graduates-channel";

// Countdown component for cohort expiry
function CohortCountdown({ enrolledAt }: { enrolledAt?: Date | string | null }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // Calculate expiry date (48 hours from enrollment)
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

// Resource configuration type
interface ResourceConfig {
    id: string;
    title: string;
    description: string;
    url: string;
    type: "core" | "client" | "toolkit";
    icon: "FileText" | "Users" | "Compass" | "Target" | "Heart" | "Map" | "CheckCircle" | "MessageSquare" | "Lightbulb";
}

// Diploma configuration type
export interface DiplomaConfig {
    slug: string;
    portalSlug: string; // URL slug for portal routes (e.g., "functional-medicine")
    name: string;
    shortName: string;
    modules: ModuleConfig[];
    coachName: string;
    coachImage: string;
    resources?: ResourceConfig[];
}

interface LeadPortalDashboardProps {
    firstName: string;
    completedLessons: number[];
    config: DiplomaConfig;
    enrolledAt?: Date | string | null;
    hasCompletedQuiz?: boolean;
}

// Personalization Quiz Card - shows until quiz completed
function PersonalizationQuizCard({ firstName, portalSlug }: { firstName: string; portalSlug: string }) {
    return (
        <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-5">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)' }}
                    >
                        <Sparkles className="w-8 h-8" style={{ color: '#4e1f24' }} />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            👋 {firstName}, let&apos;s personalize your journey!
                        </h3>
                        <p className="text-sm text-slate-600">
                            Take a 30-second quiz so we can customize your learning path
                        </p>
                    </div>
                    <Link href={`/portal/${portalSlug}/quiz`}>
                        <Button
                            className="font-bold text-white w-full sm:w-auto"
                            style={{ background: 'linear-gradient(135deg, #722f37 0%, #4e1f24 100%)' }}
                        >
                            Take Quiz
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

// Sarah AI Floating Mentor Component
function SarahFloatingMentor({
    firstName,
    lessonsCompleted,
    totalLessons,
    coachImage
}: {
    firstName: string;
    lessonsCompleted: number;
    totalLessons: number;
    coachImage: string;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [showBubble, setShowBubble] = useState(true);

    // Progress-based messages
    const messages = lessonsCompleted === 0
        ? [`Hey ${firstName}! Ready to start? Your first lesson is just 7 minutes! 🚀`, `Welcome ${firstName}! I'm here to help you every step of the way 💪`]
        : lessonsCompleted < totalLessons / 2
            ? [`Great start ${firstName}! You're making progress! 🌟`, `Keep going ${firstName}! You've got this! 💪`]
            : lessonsCompleted < totalLessons
                ? [`Almost there ${firstName}! Just ${totalLessons - lessonsCompleted} lessons to go! 🔥`, `So close to your certificate ${firstName}! Finish strong! 🎯`]
                : [`Congratulations ${firstName}! You did it! 🎉`, `Time to claim your certificate ${firstName}! 🎓`];

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        // Show after 3 seconds
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Rotate messages every 10 seconds
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [messages.length]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
            {/* Speech Bubble - hidden on very small screens, shown on tap */}
            {showBubble && (
                <div className="relative bg-white rounded-2xl shadow-lg p-3 max-w-[180px] sm:max-w-[220px] animate-in slide-in-from-right duration-300">
                    <button
                        onClick={() => setShowBubble(false)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-300 text-xs"
                    >
                        ×
                    </button>
                    <p className="text-xs sm:text-sm text-slate-700">{messages[messageIndex]}</p>
                    <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45" />
                </div>
            )}

            {/* Sarah Avatar - smaller on mobile */}
            <button
                onClick={() => setShowBubble(!showBubble)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-burgundy-600 border-3 sm:border-4 border-white shadow-lg overflow-hidden hover:scale-105 transition-transform flex-shrink-0"
            >
                <Image
                    src={coachImage}
                    alt="Coach Sarah"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                />
            </button>
        </div>
    );
}

const ICONS = {
    BookOpen,
    Target,
    Award,
};

const RESOURCE_ICONS = {
    FileText,
    Users,
    Compass,
    Target,
    Heart,
    Map,
    CheckCircle,
    MessageSquare,
    Lightbulb,
};

// Welcome Review Overlay - FULL PAGE with sidebar, income potential, success feed
function WelcomeReviewOverlay({
    firstName,
    coachImage,
    onComplete,
    diplomaName
}: {
    firstName: string;
    coachImage: string;
    onComplete: () => void;
    diplomaName?: string;
}) {
    const [phase, setPhase] = useState<"reviewing" | "accepted">("reviewing");
    const [reviewStep, setReviewStep] = useState(0);
    const [successIndex, setSuccessIndex] = useState(0);

    // Dynamic cohort number
    const cohortNumber = 110;

    const reviewMessages = [
        "Reading your application...",
        "Checking your background...",
        "Reviewing your goals...",
        "Assessing your commitment...",
        "Making my decision..."
    ];

    // Live success stories
    const successStories = [
        { name: "Lisa K.", action: "earned $1,200", time: "2 min ago" },
        { name: "Maria T.", action: "just certified!", time: "5 min ago" },
        { name: "Jennifer M.", action: "$150 consult booked", time: "8 min ago" },
        { name: "Susan R.", action: "first client signed!", time: "12 min ago" },
        { name: "Patricia L.", action: "earned $800", time: "15 min ago" },
    ];

    useEffect(() => {
        // Animate through review phases - 2 seconds per step
        const timer = setInterval(() => {
            setReviewStep(prev => {
                if (prev < reviewMessages.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2000);

        // After all review messages (5 steps * 2 seconds = 10 seconds), switch to accepted
        const acceptedTimer = setTimeout(() => {
            setPhase("accepted");
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(acceptedTimer);
        };
    }, [reviewMessages.length]);

    // Rotate success stories
    useEffect(() => {
        const successTimer = setInterval(() => {
            setSuccessIndex(prev => (prev + 1) % successStories.length);
        }, 3000);
        return () => clearInterval(successTimer);
    }, [successStories.length]);

    return (
        <div className="fixed inset-0 z-[100] flex" style={{ background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)' }}>
            {/* LEFT SIDEBAR */}
            <div
                className="w-72 flex-shrink-0 flex flex-col border-r"
                style={{
                    background: 'linear-gradient(180deg, #3a171b 0%, #4e1f24 100%)',
                    borderColor: 'rgba(212, 175, 55, 0.3)'
                }}
            >
                {/* Logo */}
                <div className="p-5 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <div className="flex items-center gap-3">
                        <Image
                            src="/asi-logo.png"
                            alt="AccrediPro"
                            width={44}
                            height={44}
                            className="rounded-lg"
                        />
                        <div>
                            <p className="font-black text-white">AccrediPro</p>
                            <p className="text-xs font-medium" style={{ color: '#d4af37' }}>STANDARDS INSTITUTE</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-5 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                            style={{ background: 'linear-gradient(135deg, #d4af37, #f7e7a0)', color: '#4e1f24' }}
                        >
                            {firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{firstName}</p>
                            <p className="text-xs text-gray-400">New Applicant</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Certification Progress</span>
                        <span style={{ color: '#d4af37' }}>0%</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">YOUR JOURNEY</p>
                    <div className="space-y-1">
                        {[
                            { icon: Target, label: "My Progress", active: false },
                            { icon: Play, label: "Start Lessons", active: false },
                            { icon: Users, label: "Student Lounge", active: false },
                            { icon: MessageCircle, label: "Get Help from Sarah", active: false, badge: "🟢" },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 opacity-50"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                                {item.badge && <span className="ml-auto text-xs">{item.badge}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Income Potential Widget */}
                <div className="p-4">
                    <div
                        className="rounded-xl p-4"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ background: '#d4af37' }}
                            >
                                <span className="text-xs font-bold text-[#4e1f24]">$</span>
                            </div>
                            <span className="text-xs font-bold uppercase" style={{ color: '#d4af37' }}>Income Potential</span>
                        </div>
                        <p className="text-2xl font-black text-white mb-1">$4K-$8K<span className="text-sm font-normal text-gray-400">/mo</span></p>
                        <p className="text-xs text-gray-400">Average certified practitioner income</p>
                    </div>
                </div>

                {/* Live Success Feed */}
                <div className="p-4 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase text-emerald-400">LIVE SUCCESS</span>
                    </div>
                    <div className="space-y-2">
                        {successStories.slice(0, 3).map((story, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <span className="text-amber-400">👤</span>
                                <span className="text-white font-medium">{story.name}</span>
                                <span className="text-gray-400">{story.action}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>47 students learning now</span>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="p-4 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                {phase === "reviewing" ? (
                    <div className="text-center max-w-lg">
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

                        {/* Progress dots */}
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
                            I personally review every application to ensure we're a perfect fit.
                        </p>
                    </div>
                ) : (
                    <div
                        className="rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full mx-4"
                        style={{
                            background: 'white',
                            border: '4px solid transparent',
                            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #d4af37, #f7e7a0, #d4af37, #b8860b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                        }}
                    >
                        {/* Gold Metal Header */}
                        <div
                            className="px-6 py-5"
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/asi-logo.png"
                                        alt="ASI"
                                        width={44}
                                        height={44}
                                        className="rounded-lg shadow-md"
                                    />
                                    <div>
                                        <p className="font-black text-[#4e1f24]">AccrediPro Institute</p>
                                        <p className="text-xs font-medium text-[#722f37]">ASI-Accredited Certification</p>
                                    </div>
                                </div>
                                <div
                                    className="px-3 py-1.5 rounded-full font-black text-sm"
                                    style={{ background: '#4e1f24', color: '#d4af37' }}
                                >
                                    Cohort #{cohortNumber}
                                </div>
                            </div>
                        </div>

                        {/* Accepted Content */}
                        <div className="p-8 text-center">
                            {/* Big Checkmark */}
                            <div
                                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                    boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)'
                                }}
                            >
                                <CheckCircle className="w-14 h-14 text-white" />
                            </div>

                            {/* Congratulations */}
                            <h3
                                className="text-3xl font-black mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #722f37 0%, #4e1f24 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                🎉 Congratulations, {firstName}!
                            </h3>

                            <p
                                className="text-xl font-bold mb-2"
                                style={{ color: '#22c55e' }}
                            >
                                You Qualify!
                            </p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <p className="text-gray-700 mb-2">
                                    Your spot in <span className="font-bold" style={{ color: '#722f37' }}>Cohort #{cohortNumber}</span> is confirmed.
                                </p>
                                <p className="text-sm text-gray-500">
                                    ⏰ You have <span className="font-bold text-amber-600">48 hours</span> to complete your certification
                                </p>
                            </div>

                            <Button
                                onClick={onComplete}
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
    hasCompletedQuiz = false,
}: LeadPortalDashboardProps) {
    const searchParams = useSearchParams();
    const isFirstVisit = searchParams.get("name") !== null;
    const [showWelcome, setShowWelcome] = useState(isFirstVisit);

    // Calculate progress
    const totalLessons = config.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const lessonsCompleted = completedLessons.length;
    const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);
    const isAllComplete = lessonsCompleted === totalLessons;

    // Calculate time remaining (estimate 7 min per lesson)
    const lessonsRemaining = totalLessons - lessonsCompleted;
    const timeRemaining = lessonsRemaining * 7;

    // Find next lesson
    const allLessons = config.modules.flatMap(m => m.lessons);
    const nextLessonId = completedLessons.length > 0
        ? Math.max(...completedLessons) + 1
        : 1;

    const basePath = `/${config.slug}`;

    // Live Chat state
    const [showChat, setShowChat] = useState(false);
    // Graduates Channel state
    const [showGraduates, setShowGraduates] = useState(false);

    // Handle welcome complete - remove ?name param from URL
    const handleWelcomeComplete = () => {
        setShowWelcome(false);
        // Clean up URL by removing ?name param
        const url = new URL(window.location.href);
        url.searchParams.delete("name");
        window.history.replaceState({}, "", url.toString());
    };

    return (
        <>
            {/* Welcome Review Overlay */}
            {showWelcome && (
                <WelcomeReviewOverlay
                    firstName={firstName}
                    coachImage={config.coachImage}
                    onComplete={handleWelcomeComplete}
                />
            )}

            <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #f5efe6 100%)' }}>
                {/* Top Header - Premium Gold/Burgundy */}
                <div
                    className="px-6 py-4 border-b"
                    style={{
                        background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)',
                        borderColor: 'rgba(212, 175, 55, 0.3)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
                                    src="/asi-logo.png"
                                    alt="ASI"
                                    width={52}
                                    height={52}
                                    className="rounded-lg"
                                />
                                <div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)' }}
                                >
                                    <CheckCircle className="w-2.5 h-2.5 text-[#4e1f24]" />
                                </div>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white tracking-tight">{config.shortName} Foundation</h1>
                                <p className="text-sm flex items-center gap-2" style={{ color: '#d4af37' }}>
                                    <span>ASI-Verified Mini Diploma</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>ACCREDITED</span>
                                </p>
                            </div>
                        </div>
                        {!isAllComplete && (
                            <Badge
                                className="border-0 font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)',
                                    color: '#4e1f24'
                                }}
                            >
                                <Timer className="w-3 h-3 mr-1" />
                                48h Access
                            </Badge>
                        )}
                    </div>
                </div>

                {/* FOMO Cohort Banner - Premium Gold */}
                {!isAllComplete && (
                    <div
                        className="px-4 py-3"
                        style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)' }}
                    >
                        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                            <div className="flex items-center gap-2" style={{ color: '#4e1f24' }}>
                                <GraduationCap className="w-5 h-5" />
                                <span className="font-black">COHORT #{Math.floor((Date.now() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}</span>
                                <span className="opacity-60">•</span>
                                <span className="text-sm font-medium">Your access expires in <CohortCountdown enrolledAt={enrolledAt} /></span>
                            </div>
                            <div className="text-sm font-bold" style={{ color: '#4e1f24' }}>
                                Complete all {totalLessons} lessons to claim your certificate 🎓
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                    {/* Welcome + Progress Section */}
                    <div className="grid lg:grid-cols-3 gap-4">
                        {/* Welcome Card - Premium Gold Border */}
                        <Card
                            className="lg:col-span-2 border-0 shadow-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, #4e1f24 0%, #722f37 50%, #4e1f24 100%)',
                            }}
                        >
                            <CardContent className="p-6 relative">
                                {/* Gold glow effect */}
                                <div
                                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                                    style={{ backgroundColor: '#d4af37' }}
                                />
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                                        style={{
                                            border: '3px solid #d4af37',
                                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                                        }}
                                    >
                                        <Image
                                            src={config.coachImage}
                                            alt={config.coachName}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium" style={{ color: '#d4af37' }}>Coach {config.coachName}</p>
                                        <h2 className="text-2xl font-black text-white mb-2">
                                            {lessonsCompleted === 0
                                                ? `Welcome, ${firstName}! 👋`
                                                : lessonsCompleted < 5
                                                    ? `Great progress, ${firstName}! 💪`
                                                    : isAllComplete
                                                        ? `Congratulations, ${firstName}! 🎉`
                                                        : `Almost there, ${firstName}! 🔥`
                                            }
                                        </h2>
                                        <p className="text-white/80 text-sm">
                                            {lessonsCompleted === 0
                                                ? `Ready to start your ${config.shortName} certification journey?`
                                                : isAllComplete
                                                    ? "You've completed all lessons! Time to claim your certificate."
                                                    : `You've completed ${lessonsCompleted} of ${totalLessons} lessons. Keep going!`
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Enhanced Progress Card - Premium */}
                        <Card className="border-0 shadow-xl bg-white overflow-hidden">
                            <CardContent className="p-0">
                                {/* Progress Header */}
                                <div className="p-4 pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-slate-700">Your Progress</span>
                                        <div className="flex items-center gap-1.5">
                                            <Trophy className="w-4 h-4" style={{ color: '#d4af37' }} />
                                            <span className="text-xl font-black" style={{ color: '#722f37' }}>{progressPercent}%</span>
                                        </div>
                                    </div>

                                    {/* Segmented Progress Bar - Gold */}
                                    <div className="flex gap-1 mb-3">
                                        {Array.from({ length: totalLessons }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`h-2.5 flex-1 rounded-full transition-all`}
                                                style={{
                                                    background: completedLessons.includes(i + 1)
                                                        ? 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)'
                                                        : i + 1 === nextLessonId
                                                            ? '#722f37'
                                                            : '#e2e8f0'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" style={{ color: '#d4af37' }} />
                                            {lessonsCompleted} of {totalLessons} complete
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" style={{ color: '#722f37' }} />
                                            ~{timeRemaining} min left
                                        </span>
                                    </div>
                                </div>

                                {/* Continue CTA - Gold Metallic */}
                                {!isAllComplete && nextLessonId <= totalLessons && (
                                    <Link href={`${basePath}/lesson/${nextLessonId}`} className="block">
                                        <div
                                            className="px-4 py-3 flex items-center justify-between group transition-all hover:brightness-105"
                                            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)' }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: 'rgba(78, 31, 36, 0.2)' }}
                                                >
                                                    <Play className="w-4 h-4" style={{ color: '#4e1f24' }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: '#4e1f24' }}>✨ Continue Learning</p>
                                                    <p className="text-xs" style={{ color: '#722f37' }}>Lesson {nextLessonId} • {allLessons.find(l => l.id === nextLessonId)?.duration || "8 min"}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: '#4e1f24' }} />
                                        </div>
                                    </Link>
                                )}

                                {/* Completed State */}
                                {isAllComplete && (
                                    <Link href={`${basePath}/complete`} className="block">
                                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 flex items-center justify-between group hover:from-emerald-600 hover:to-emerald-700 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                    <Award className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-sm">All Lessons Complete!</p>
                                                    <p className="text-emerald-100 text-xs">Claim your certificate now</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Study Circle Card - Gold Metal */}
                    <Link href={`/portal/${config.portalSlug}/circle`} className="block">
                        <Card
                            className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                            }}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ background: 'rgba(78, 31, 36, 0.15)' }}
                                        >
                                            <MessageCircle className="w-6 h-6" style={{ color: '#4e1f24' }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-lg" style={{ color: '#4e1f24' }}>Your Private Study Circle</h3>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                            <p className="text-sm" style={{ color: '#722f37' }}>
                                                You, Coach Sarah & your study buddy — learning together
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                                            style={{ background: '#4e1f24', color: '#d4af37' }}
                                        >
                                            Enter Circle
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Personalization Quiz CTA - shows until complete */}
                    {!hasCompletedQuiz && (
                        <PersonalizationQuizCard firstName={firstName} portalSlug={config.portalSlug} />
                    )}

                    {/* Certificate Preview (Locked) - Shows their name! */}
                    {!isAllComplete && (
                        <Card className="border-0 shadow-lg overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 z-10 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border-2 border-white/20">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-white font-bold text-lg mb-1">Complete {totalLessons - lessonsCompleted} more lessons</p>
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
                                        <p className="text-lg font-bold text-burgundy-700 mt-1">{config.name}</p>
                                        <div className="mt-4 pt-4 border-t border-amber-200/50">
                                            <p className="text-xs text-slate-500">AccrediPro Standards Institute</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Completion CTA */}
                    {isAllComplete && (
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                        <GraduationCap className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Your Certificate is Ready! 🎓</h3>
                                        <p className="text-gold-100">Download your ASI-verified foundation certificate</p>
                                    </div>
                                </div>
                                <Link href={`${basePath}/complete`}>
                                    <Button size="lg" className="bg-white text-gold-700 hover:bg-gold-50 font-bold w-full sm:w-auto">
                                        Claim Certificate
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Next Lesson CTA (if not complete) */}
                    {!isAllComplete && nextLessonId <= totalLessons && (
                        <Card className="border-2 border-burgundy-200 shadow-md bg-burgundy-50">
                            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-burgundy-600 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-burgundy-600 font-medium flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Continue Learning
                                        </p>
                                        <h3 className="font-bold text-slate-900">
                                            Lesson {nextLessonId}: {allLessons.find(l => l.id === nextLessonId)?.title}
                                        </h3>
                                    </div>
                                </div>
                                <Link href={`${basePath}/lesson/${nextLessonId}`}>
                                    <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold w-full sm:w-auto">
                                        Start Lesson
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Modules Grid */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#4e1f24' }}>
                            <BookOpen className="w-5 h-5" style={{ color: '#d4af37' }} />
                            Course Curriculum
                        </h2>

                        {config.modules.map((module) => {
                            const moduleLessonsComplete = module.lessons.filter(l =>
                                completedLessons.includes(l.id)
                            ).length;
                            const moduleComplete = moduleLessonsComplete === module.lessons.length;
                            const ModuleIcon = ICONS[module.icon];

                            return (
                                <Card key={module.id} className="border-0 shadow-xl overflow-hidden">
                                    {/* Module Header */}
                                    <div
                                        className="px-5 py-4 border-b"
                                        style={{
                                            background: moduleComplete
                                                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)'
                                                : '#fafafa',
                                            borderColor: moduleComplete ? 'rgba(212, 175, 55, 0.3)' : '#f0f0f0'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                    style={{
                                                        background: moduleComplete
                                                            ? 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)'
                                                            : '#722f37',
                                                        color: moduleComplete ? '#4e1f24' : 'white'
                                                    }}
                                                >
                                                    {moduleComplete ? <CheckCircle className="w-5 h-5" /> : <ModuleIcon className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold" style={{ color: '#1e293b' }}>Module {module.id}: {module.title}</h3>
                                                    <p className="text-sm text-slate-500">{module.description}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                className="border-0 font-bold"
                                                style={{
                                                    background: moduleComplete
                                                        ? 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)'
                                                        : '#f1f5f9',
                                                    color: moduleComplete ? '#4e1f24' : '#64748b'
                                                }}
                                            >
                                                {moduleLessonsComplete}/{module.lessons.length} Complete
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Lessons */}
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-slate-100">
                                            {module.lessons.map((lesson) => {
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                const isNext = lesson.id === nextLessonId;
                                                const prevCompleted = lesson.id === 1 || completedLessons.includes(lesson.id - 1);
                                                const isLocked = !isCompleted && !prevCompleted;

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        className={`flex items-center gap-4 px-5 py-4 transition-colors ${isCompleted
                                                            ? 'bg-white'
                                                            : isNext
                                                                ? 'bg-burgundy-50/50'
                                                                : isLocked
                                                                    ? 'bg-slate-50/50 opacity-60'
                                                                    : 'bg-white hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {/* Lesson Number/Icon */}
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted
                                                                ? 'bg-emerald-500 text-white'
                                                                : isNext
                                                                    ? 'bg-burgundy-600 text-white'
                                                                    : isLocked
                                                                        ? 'bg-slate-200 text-slate-400'
                                                                        : 'bg-slate-200 text-slate-600'
                                                                }`}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-5 h-5" />
                                                            ) : isLocked ? (
                                                                <Lock className="w-4 h-4" />
                                                            ) : (
                                                                lesson.id
                                                            )}
                                                        </div>

                                                        {/* Lesson Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`font-medium truncate ${isCompleted ? 'text-slate-700' : isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                                                {lesson.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {lesson.duration}
                                                            </p>
                                                        </div>

                                                        {/* Action */}
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
                                                                    <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
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
                                                                    <Button size="sm" variant="outline" className="border-slate-300">
                                                                        Start
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* ASI Professional Resources */}
                    {config.resources && config.resources.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: '#4e1f24' }}>
                                <FileText className="w-5 h-5" style={{ color: '#d4af37' }} />
                                ASI Level 0 Resource Bundle
                                <Badge
                                    className="border-0 text-[10px] font-bold ml-2"
                                    style={{
                                        background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)',
                                        color: '#4e1f24'
                                    }}
                                >
                                    INCLUDED
                                </Badge>
                            </h2>

                            <Card className="border-0 shadow-xl overflow-hidden">
                                <div
                                    className="px-5 py-3 border-b"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
                                        borderColor: 'rgba(212, 175, 55, 0.3)'
                                    }}
                                >
                                    <p className="text-sm text-slate-600">
                                        Professional resources to support your practice journey. Download and print these
                                        ASI-verified documents.
                                    </p>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {config.resources.map((resource) => {
                                            const ResourceIcon = RESOURCE_ICONS[resource.icon] || FileText;
                                            const typeColors = {
                                                core: { bg: '#722f37', text: 'white' },
                                                client: { bg: '#0891b2', text: 'white' },
                                                toolkit: { bg: '#059669', text: 'white' },
                                            };
                                            const typeLabels = {
                                                core: 'Core Document',
                                                client: 'Client Resource',
                                                toolkit: 'Toolkit',
                                            };

                                            return (
                                                <a
                                                    key={resource.id}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${typeColors[resource.type].bg} 0%, ${typeColors[resource.type].bg}dd 100%)`
                                                        }}
                                                    >
                                                        <ResourceIcon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h4 className="font-medium text-slate-900 truncate">
                                                                {resource.title}
                                                            </h4>
                                                            <Badge
                                                                className="border-0 text-[10px] font-bold flex-shrink-0"
                                                                style={{
                                                                    backgroundColor: `${typeColors[resource.type].bg}20`,
                                                                    color: typeColors[resource.type].bg
                                                                }}
                                                            >
                                                                {typeLabels[resource.type]}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-slate-500 truncate">
                                                            {resource.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ExternalLink className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Certificate Preview */}
                    {!isAllComplete && (
                        <Card className="border-0 shadow-md overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative w-32 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center opacity-50 flex-shrink-0">
                                        <GraduationCap className="w-12 h-12 text-slate-400" />
                                        <Lock className="w-6 h-6 text-slate-500 absolute bottom-2 right-2" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-bold text-slate-900 mb-1">Your Certificate Awaits</h3>
                                        <p className="text-sm text-slate-500 mb-2">
                                            Complete all {totalLessons} lessons to unlock your ASI-Verified Foundation Certificate
                                        </p>
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <Progress value={progressPercent} className="w-32 h-2" />
                                            <span className="text-xs text-slate-500">{lessonsRemaining} lessons to go</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Study Circle accessible via sidebar navigation */}

                {/* Graduates Channel Slide-out Panel */}
                {showGraduates && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/40 z-40"
                            onClick={() => setShowGraduates(false)}
                        />
                        {/* Panel */}
                        <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                            {/* Close button */}
                            <button
                                onClick={() => setShowGraduates(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                            <GraduatesChannel
                                isGraduate={isAllComplete}
                                diplomaSlug={config.slug}
                                className="flex-1"
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
