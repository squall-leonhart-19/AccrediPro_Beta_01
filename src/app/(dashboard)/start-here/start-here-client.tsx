"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OnboardingWizard } from "@/components/ui/onboarding-wizard";

import {
    Sparkles,
    CheckCircle,
    BookOpen,
    GraduationCap,
    MessageSquare,
    Award,
    Play,
    ArrowRight,
    Rocket,
    Target,
    Heart,
    Map,
    RotateCcw,
    Lock,
    Camera,
    Users,
    UserCheck,
    Wand2,
    Library,
    Star,
    Gift,
    DollarSign,
    Clock,
    Briefcase,
    TrendingUp,
    Zap,
    MapPin,
    Flame,
    type LucideIcon,
} from "lucide-react";

// Wistia Player Component - properly loads scripts via useEffect
function WistiaPlayer({ mediaId }: { mediaId: string }) {
    useEffect(() => {
        // Load Wistia player script
        const playerScript = document.createElement("script");
        playerScript.src = "https://fast.wistia.com/player.js";
        playerScript.async = true;
        document.head.appendChild(playerScript);

        // Load media-specific script
        const mediaScript = document.createElement("script");
        mediaScript.src = `https://fast.wistia.com/embed/${mediaId}.js`;
        mediaScript.async = true;
        mediaScript.type = "module";
        document.head.appendChild(mediaScript);

        return () => {
            // Cleanup if needed
            try {
                document.head.removeChild(playerScript);
                document.head.removeChild(mediaScript);
            } catch (e) {
                // Scripts may have already been removed
            }
        };
    }, [mediaId]);

    return (
        <div className="aspect-video relative">
            <style>{`
                wistia-player[media-id='${mediaId}']:not(:defined) { 
                    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch'); 
                    display: block; 
                    filter: blur(5px); 
                    padding-top: 56.25%; 
                }
            `}</style>
            {/* @ts-ignore - Wistia web component */}
            <wistia-player media-id={mediaId} aspect="1.7777777777777777"></wistia-player>
        </div>
    );
}

interface OnboardingData {
    incomeGoal: string | null;
    timeline: string | null;
    situation: string | null;
    investmentReadiness: string | null;
    obstacles: string[];
    interests: string[];
}

// Helper functions for formatting onboarding data - Matches Career Ladder
function formatIncomeGoal(goal: string): string {
    const goalMap: Record<string, string> = {
        '50k_plus': '$50K+/month (Empire Builder)',
        '30k_50k': '$30K – $50K/month (Step 4)',
        '10k_30k': '$10K – $30K/month (Step 3)',
        '5k_10k': '$5K – $10K/month (Step 2)',
        '3k_5k': '$3K – $5K/month (Step 1)',
        // Legacy mappings for existing users
        '30k_plus': '$30K+/month',
        '20k_30k': '$20K – $30K/month',
        '10k_20k': '$10K – $20K/month',
        '10k_plus': '$10K+/month',
        '2k_5k': '$2K – $5K/month',
        '1k_2k': '$1K – $2K/month',
        'under_1k': 'Starting out',
    };
    return goalMap[goal] || goal.replace(/_/g, ' ');
}

function formatTimeline(timeline: string): string {
    const timelineMap: Record<string, string> = {
        'asap': 'As soon as possible',
        '1_3_months': '1-3 months',
        '3_6_months': '3-6 months',
        '6_12_months': '6-12 months',
        'no_rush': 'Taking my time',
    };
    return timelineMap[timeline] || timeline.replace(/_/g, ' ');
}

function getMotivationalMessage(timeline: string | null, investmentReadiness: string | null): string {
    if (timeline === 'asap' || investmentReadiness === 'ready_now') {
        return "You're ready to accelerate! Let's make it happen.";
    }
    if (timeline === '1_3_months' || investmentReadiness === 'need_details') {
        return "Great momentum! You're on track for success.";
    }
    if (timeline === '3_6_months') {
        return "Solid plan! Building your foundation for growth.";
    }
    return "Every expert was once a beginner. You've got this!";
}

interface StartHereClientProps {
    user: {
        firstName: string | null;
        hasCompletedOnboarding: boolean;
        hasProfilePhoto: boolean;
        learningGoal: string | null;
        focusAreas: string[];
        location: string | null;
        createdAt: string | null;
    } | null;
    userId: string;
    enrollments: number;
    onboardingData: OnboardingData;
    hasMessagedCoach?: boolean;
    hasIntroPost?: boolean;
    firstLessonUrl?: string | null;
    courseName?: string | null;
}

export function StartHereClient({ user, userId, enrollments, onboardingData, hasMessagedCoach = false, hasIntroPost = false, firstLessonUrl = null, courseName = null }: StartHereClientProps) {
    const [showQuestionsWizard, setShowQuestionsWizard] = useState(false);
    const [questionsCompleted, setQuestionsCompleted] = useState(user?.hasCompletedOnboarding || false);
    const [videoWatched, setVideoWatched] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; expired: boolean } | null>(null);

    // Check localStorage for completion statuses
    useEffect(() => {
        const localQuestionsComplete = localStorage.getItem(`onboarding-complete-${userId}`) === "true";
        const localVideoWatched = localStorage.getItem(`welcome-video-watched-${userId}`) === "true";

        if (localQuestionsComplete) {
            setQuestionsCompleted(true);
        }
        if (localVideoWatched) {
            setVideoWatched(true);
        }
    }, [userId]);

    // 24-hour bonus timer
    useEffect(() => {
        if (!user?.createdAt) return;

        const calculateTimeRemaining = () => {
            const createdAt = new Date(user.createdAt!);
            const bonusDeadline = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // +24 hours
            const now = new Date();
            const diff = bonusDeadline.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeRemaining({ hours: 0, minutes: 0, expired: true });
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining({ hours, minutes, expired: false });
            }
        };

        calculateTimeRemaining();
        const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [user?.createdAt]);

    const handleQuestionsComplete = (data: any) => {
        setShowQuestionsWizard(false);
        setQuestionsCompleted(true);
    };

    const handleVideoWatched = () => {
        setVideoWatched(true);
        localStorage.setItem(`welcome-video-watched-${userId}`, "true");
    };

    // SIMPLIFIED 3-Step Checklist
    const checklist: {
        id: string;
        label: string;
        description: string;
        completed: boolean;
        link: string | null;
        action: (() => void) | null;
        icon: LucideIcon;
        color: string;
        emoji: string;
        reward: string;
        locked?: boolean;
    }[] = [
            {
                id: "video",
                label: "Watch Welcome Video",
                description: "Meet Coach Sarah and learn how to succeed",
                completed: videoWatched,
                link: null,
                action: handleVideoWatched,
                icon: Play,
                color: "burgundy",
                emoji: "🎬",
                reward: "+25 XP",
            },
            {
                id: "coach",
                label: "Say Hi to Coach Sarah",
                description: hasMessagedCoach
                    ? "Great job connecting with your coach!"
                    : "Send a quick message to your dedicated mentor",
                completed: hasMessagedCoach,
                link: "/messages?to=sarah",
                action: null,
                icon: MessageSquare,
                color: "emerald",
                emoji: "👋",
                reward: "+50 XP",
                locked: !videoWatched,
            },
            {
                id: "lesson",
                label: "Start Your First Lesson",
                description: courseName
                    ? `Begin ${courseName}`
                    : "Jump into your learning journey",
                completed: false, // We'd need to track this - for now always show as actionable
                link: firstLessonUrl || "/courses",
                action: null,
                icon: BookOpen,
                color: "blue",
                emoji: "📚",
                reward: "+25 XP",
                locked: !hasMessagedCoach,
            },
        ];

    const completedCount = checklist.filter(item => item.completed).length;
    const progress = (completedCount / checklist.length) * 100;
    const allComplete = completedCount === checklist.length;
    const showBonusTimer = timeRemaining && !timeRemaining.expired && !allComplete;

    const quickLinks = [
        { href: "/courses", label: "Browse Courses", icon: BookOpen, color: "burgundy", description: "Explore our certifications" },
        { href: "/my-personal-roadmap-by-coach-sarah", label: "Your Roadmap", icon: Map, color: "blue", description: "See your learning path" },
        { href: "/messages", label: "Mentor Chat", icon: MessageSquare, color: "green", description: "Connect with your coach" },
        { href: "/community", label: "Community", icon: Heart, color: "pink", description: "Meet fellow students" },
    ];

    return (
        <>


            {/* Questions Wizard Modal */}
            {showQuestionsWizard && (
                <OnboardingWizard
                    onComplete={handleQuestionsComplete}
                    userName={user?.firstName || ""}
                    userId={userId}
                />
            )}

            <div className="space-y-6 animate-fade-in">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Getting Started Checklist */}
                    <div className="lg:col-span-2">
                        <Card className="card-premium overflow-hidden border-0 shadow-xl">
                            <CardContent className="p-0">
                                {/* Header - Welcome + Checklist */}
                                <div className="bg-white border-b border-gray-100 p-6 lg:p-8">
                                    {/* Welcome badge */}
                                    <div className="inline-flex items-center gap-2 text-burgundy-600 text-sm font-medium mb-3 bg-burgundy-50 px-3 py-1 rounded-full">
                                        <Sparkles className="w-4 h-4" />
                                        Welcome to AccrediPro Academy
                                    </div>

                                    {/* Main heading */}
                                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                                        <div>
                                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                                                Let's Get You Started, {user?.firstName || "Future Coach"}! 🎉
                                            </h1>
                                            <p className="text-gray-500 text-sm lg:text-base">
                                                Complete 3 quick steps to unlock your learning journey
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-burgundy-50 rounded-xl px-4 py-3 border border-burgundy-100">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-burgundy-600">{completedCount}/{checklist.length}</div>
                                                <div className="text-xs text-gray-500">Steps Done</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 24-Hour Bonus Timer */}
                                    {showBonusTimer && (
                                        <div className="mb-4 p-3 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border border-gold-200 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">🎁 Day 1 Bonus Active!</p>
                                                    <p className="text-xs text-gray-600">Complete all 3 steps for +100 XP total</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gold-600">
                                                    {timeRemaining!.hours}h {timeRemaining!.minutes}m
                                                </div>
                                                <div className="text-xs text-gray-500">remaining</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress bar */}
                                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-burgundy-600 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Rocket className="w-3 h-3 text-burgundy-500" /> Your journey begins here
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-gold-500" /> Earn +100 XP!
                                        </span>
                                    </div>
                                </div>

                                {/* Checklist Items */}
                                <div className="p-6 space-y-3">
                                    {/* Sarah Welcome Video */}
                                    <div className="mb-6 rounded-xl overflow-hidden bg-burgundy-50 border border-burgundy-200">
                                        <div className="p-4 border-b border-burgundy-200 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                                    <img src="/coaches/sarah-coach.webp" alt="Coach Sarah" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-white">
                                                    <p className="font-semibold text-sm">Welcome from Coach Sarah 👋</p>
                                                    <p className="text-xs text-burgundy-200">Watch this first before getting started</p>
                                                </div>
                                            </div>
                                        </div>
                                        <WistiaPlayer mediaId="7w51vpdty2" />
                                    </div>

                                    {checklist.map((item, index) => {
                                        const stepNumber = index + 1;
                                        const IconComponent = item.icon;
                                        const isNextStep = !item.completed && !item.locked && checklist.slice(0, index).every(i => i.completed);
                                        const isLocked = item.locked && !item.completed;

                                        const content = (
                                            <div className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${item.completed
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                                                : isLocked
                                                    ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                                                    : isNextStep
                                                        ? "bg-gradient-to-r from-gold-50 to-amber-50 border-gold-300 shadow-md shadow-gold-100 hover:shadow-lg hover:shadow-gold-200 cursor-pointer"
                                                        : "bg-gray-50 border-gray-200 hover:border-burgundy-200 hover:bg-burgundy-50/50 cursor-pointer"
                                                }`}>
                                                {/* Step indicator */}
                                                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${item.completed
                                                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                                    : isLocked
                                                        ? "bg-gray-200"
                                                        : isNextStep
                                                            ? "bg-gradient-to-br from-gold-400 to-amber-500 animate-pulse"
                                                            : `bg-${item.color}-100`
                                                    }`}>
                                                    {item.completed ? (
                                                        <CheckCircle className="w-7 h-7 text-white" />
                                                    ) : isLocked ? (
                                                        <Lock className="w-6 h-6 text-gray-400" />
                                                    ) : (
                                                        <IconComponent className={`w-6 h-6 ${isNextStep ? "text-white" : `text-${item.color}-600`}`} />
                                                    )}
                                                    {/* Step number badge */}
                                                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${item.completed
                                                        ? "bg-green-600 text-white"
                                                        : isLocked
                                                            ? "bg-gray-300 text-gray-500"
                                                            : "bg-white shadow border border-gray-200 text-gray-600"
                                                        }`}>
                                                        {item.completed ? "✓" : isLocked ? "🔒" : stepNumber}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{item.emoji}</span>
                                                        <h3 className={`font-semibold text-base ${item.completed ? "text-green-700" : isLocked ? "text-gray-400" : "text-gray-900"
                                                            }`}>
                                                            {item.label}
                                                        </h3>
                                                    </div>
                                                    <p className={`text-sm mt-0.5 ${item.completed ? "text-green-600" : isLocked ? "text-gray-400" : "text-gray-500"
                                                        }`}>
                                                        {isLocked ? "Complete previous step to unlock" : item.description}
                                                    </p>
                                                </div>

                                                {/* Right side - XP reward or completed badge */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    {item.completed ? (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                                            Completed
                                                        </Badge>
                                                    ) : isLocked ? (
                                                        <Badge className="bg-gray-100 text-gray-400 border-gray-200">
                                                            {item.reward}
                                                        </Badge>
                                                    ) : (
                                                        <>
                                                            <Badge className={`${isNextStep
                                                                ? "bg-gold-100 text-gold-700 border-gold-300"
                                                                : "bg-gray-100 text-gray-600 border-gray-200"
                                                                }`}>
                                                                {item.reward}
                                                            </Badge>
                                                            <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isNextStep ? "text-gold-600" : "text-gray-400"
                                                                }`} />
                                                        </>
                                                    )}
                                                </div>

                                                {/* "Next step" indicator */}
                                                {isNextStep && !item.completed && (
                                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-gold-400 rounded-r-full" />
                                                )}
                                            </div>
                                        );

                                        // Don't allow click if locked
                                        if (isLocked) {
                                            return <div key={item.id}>{content}</div>;
                                        }

                                        if (item.action) {
                                            return (
                                                <div key={item.id} onClick={item.action}>
                                                    {content}
                                                </div>
                                            );
                                        } else if (item.link) {
                                            return (
                                                <Link key={item.id} href={item.link}>
                                                    {content}
                                                </Link>
                                            );
                                        } else {
                                            return <div key={item.id}>{content}</div>;
                                        }
                                    })}
                                </div>

                                {/* Celebration Section - when all complete */}
                                {completedCount === checklist.length && (
                                    <div className="px-6 pb-6 space-y-4">
                                        {/* Celebration Banner */}
                                        <div className="p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl text-white text-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="absolute top-2 left-10 text-4xl">🎉</div>
                                                <div className="absolute top-8 right-16 text-3xl">⭐</div>
                                                <div className="absolute bottom-4 left-20 text-2xl">🏆</div>
                                                <div className="absolute bottom-2 right-10 text-4xl">🎊</div>
                                            </div>
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Award className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">You're All Set! +95 XP Earned!</h3>
                                                <p className="text-white/90 text-sm max-w-md mx-auto">
                                                    Congratulations! You've completed all getting started steps. Now let's begin your learning journey!
                                                </p>
                                            </div>
                                        </div>

                                        {/* What's Next CTA */}
                                        <Link href="/my-personal-roadmap-by-coach-sarah">
                                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-burgundy-50 to-purple-50 rounded-xl border border-burgundy-200 hover:border-burgundy-300 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center group-hover:bg-burgundy-200 transition-colors">
                                                    <Map className="w-6 h-6 text-burgundy-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">View Your Personalized Roadmap</p>
                                                    <p className="text-sm text-gray-500">See your next steps and certification path</p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-burgundy-400 group-hover:text-burgundy-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Video Introduction - temporarily hidden */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Links */}
                        <Card className="card-premium">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                                <div className="space-y-3">
                                    {quickLinks.map((link) => (
                                        <Link key={link.href} href={link.href}>
                                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                                <div className={`p-2 rounded-lg bg-${link.color}-100`}>
                                                    <link.icon className={`w-5 h-5 text-${link.color}-600`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{link.label}</p>
                                                    <p className="text-xs text-gray-500">{link.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Need Help */}
                        <Card className="card-premium bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Our team is here to support you every step of the way.
                                </p>
                                <Link href="/help">
                                    <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                        Contact Support
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Your Profile & Goals - Comprehensive display */}
                        <Card className="card-premium">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-burgundy-600" />
                                    Your Profile & Goals
                                </h3>

                                <div className="space-y-4">
                                    {/* Primary Goal */}
                                    {user?.learningGoal && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-burgundy-50">
                                                <Flame className="w-4 h-4 text-burgundy-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Primary Goal</p>
                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                    {user.learningGoal.replace(/_/g, " ")}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Income Goal */}
                                    {onboardingData.incomeGoal && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-green-50">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Income Target</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatIncomeGoal(onboardingData.incomeGoal)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    {onboardingData.timeline && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-blue-50">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Timeline</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatTimeline(onboardingData.timeline)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Current Situation */}
                                    {onboardingData.situation && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-purple-50">
                                                <Briefcase className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Current Situation</p>
                                                <p className="text-sm font-semibold text-gray-900 capitalize">
                                                    {onboardingData.situation.replace(/_/g, " ")}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Location */}
                                    {user?.location && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-orange-50">
                                                <MapPin className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                                                <p className="text-sm font-semibold text-gray-900">{user.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Focus Areas / Interests */}
                                    {(onboardingData.interests.length > 0 || (user?.focusAreas && user.focusAreas.length > 0)) && (
                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-gold-600" />
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Focus Areas</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {(onboardingData.interests.length > 0 ? onboardingData.interests : user?.focusAreas || []).slice(0, 4).map((interest, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 capitalize">
                                                        {interest.replace(/_/g, " ")}
                                                    </Badge>
                                                ))}
                                                {(onboardingData.interests.length > 4 || (user?.focusAreas?.length || 0) > 4) && (
                                                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                                                        +{Math.max(onboardingData.interests.length, user?.focusAreas?.length || 0) - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Motivational Message based on timeline/readiness */}
                                    {(onboardingData.timeline || onboardingData.investmentReadiness) && (
                                        <div className="mt-4 p-3 rounded-xl bg-burgundy-50 border border-burgundy-100">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-burgundy-600" />
                                                <p className="text-xs font-medium text-burgundy-700">
                                                    {getMotivationalMessage(onboardingData.timeline, onboardingData.investmentReadiness)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
