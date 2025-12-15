"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Flame,
    Clock,
    Users,
    Trophy,
    CheckCircle2,
    Sparkles,
    Play,
    Star,
    Heart,
    GraduationCap,
    ArrowRight,
    Target,
    Zap,
    Lock,
    Calendar,
    MessageSquare,
    Send,
    CheckCircle,
    Rocket,
    Download,
    FileText,
    Video,
    BookOpen,
    Crown,
    DollarSign,
    Timer,
    RefreshCw,
    User,
    BadgeCheck,
    Bell,
    Gift,
    TrendingUp,
    Award,
    Shield,
    Headphones,
    ChevronRight,
    Quote,
    Circle,
    PlayCircle,
    Volume2,
} from "lucide-react";

interface Challenge {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    durationDays: number;
    isFeatured: boolean;
    isEnrolled: boolean;
    currentDay: number;
    completedDays: number[];
    enrollmentCount: number;
    startedAt?: Date;
    modules: Array<{
        id: string;
        day: number;
        title: string;
    }>;
    badges: Array<{
        id: string;
        day: number;
        name: string;
        icon: string;
    }>;
}

interface ChallengesClientProps {
    challenges: Challenge[];
    userId: string;
    isChallengeUnlocked?: boolean;
    hasCompletedMiniDiploma?: boolean;
    miniDiplomaCompletedAt?: string | null;
}

// Coach Sarah - The face of the challenge
const COACH_SARAH = {
    name: "Dr. Sarah Mitchell",
    title: "Lead FM Coach & Challenge Host",
    avatar: "/coaches/sarah.jpg",
    bio: "Board-certified FM practitioner who has guided 500+ students through launching successful practices. She'll be with you every step of this challenge.",
    quote: "This challenge changed everything for me when I started. Now I get to help YOU have that same breakthrough.",
    stats: {
        studentsHelped: 500,
        challengeCompletions: "2,847+",
        successRate: "87%",
    },
};

// The ONE flagship challenge - 7-Day Practitioner Activation Challenge
const ACTIVATION_CHALLENGE = {
    title: "7-Day Practitioner Activation Challenge",
    subtitle: "From Graduate to Confident Practitioner",
    tagline: "Not a course. Not education. This is decision compression.",
    description: "7 days to go from 'maybe someday' to 'I'm doing this.' Watch one short video, complete one reflection, take one action — every day for 7 days.",
    duration: "7 Days",
    timePerDay: "10-15 min/day",
    format: "1 video + 1 reflection + 1 action daily",
    earningPotential: {
        firstClient: "$500-$1,500",
        monthOne: "$2,000-$5,000",
        monthThree: "$5,000-$10,000",
        yearOne: "$60,000-$120,000",
    },
    structure: [
        {
            day: 1,
            title: "The Identity Shift",
            focus: "Identity",
            purpose: "You're not 'learning to become' a practitioner. You already are one. Today we unlock the mindset shift that changes everything.",
            videoLength: "8 min",
            reflection: "Write down 3 reasons you started this journey. What's the deeper why behind your why?",
            action: "Share your 'why' in the Q&A — inspire others and get your first feedback from Coach Sarah.",
            voiceNote: true,
            icon: User,
            color: "from-purple-500 to-violet-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
        },
        {
            day: 2,
            title: "Your First Client Is Waiting",
            focus: "Confidence",
            purpose: "Your first client isn't a test — they're someone who needs YOU. Today we remove the fear that's holding you back.",
            videoLength: "10 min",
            reflection: "Who in your life could benefit from what you've learned? Write down 5 names right now.",
            action: "Reach out to ONE person this week just to share what you're doing (no selling — just sharing).",
            icon: Heart,
            color: "from-pink-500 to-rose-600",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-200",
        },
        {
            day: 3,
            title: "See Yourself Helping",
            focus: "First Client Clarity",
            purpose: "Visualization exercise: Walk through your first session. What does it look like? How does it feel?",
            videoLength: "12 min",
            reflection: "Describe your ideal first client. What are they struggling with? How will you help them transform?",
            action: "Write a 2-sentence 'I help...' statement and post it for feedback from Coach Sarah.",
            voiceNote: true,
            icon: Target,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
        {
            day: 4,
            title: "Remove the Blockers",
            focus: "Overcoming Fears",
            purpose: "What's REALLY stopping you? Let's name it, face it, and move past it together.",
            videoLength: "10 min",
            reflection: "What's your biggest fear about starting? Write it down, then write why it won't stop you.",
            action: "Share one fear you're releasing in the Q&A — you'll find you're not alone.",
            icon: Zap,
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
        },
        {
            day: 5,
            title: "Your 90-Day Sprint",
            focus: "Simple Action Plan",
            purpose: "No complex business plans. Just: What are you doing in the next 90 days to get your first clients?",
            videoLength: "12 min",
            reflection: "What are 3 concrete actions you can take in the next 2 weeks to move forward?",
            action: "Pick ONE action to complete THIS WEEK and commit publicly. Accountability = results.",
            icon: Rocket,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
        },
        {
            day: 6,
            title: "The Money Conversation",
            focus: "Pricing & Value",
            purpose: "How to price your services without guilt. Your expertise has real value — let's own it.",
            videoLength: "10 min",
            reflection: "What would charging $200/session mean for your life? $500? Write it down and feel it.",
            action: "Write your pricing and post it — get feedback from Coach Sarah and own your worth.",
            voiceNote: true,
            icon: DollarSign,
            color: "from-emerald-500 to-teal-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
        },
        {
            day: 7,
            title: "Decision Day",
            focus: "Commitment",
            purpose: "Are you in? Not 'someday'. Today. This is the moment you decide to change your life.",
            videoLength: "15 min",
            reflection: "What would your life look like 1 year from now if you committed fully today?",
            action: "Make your decision. Share it. Then take the next step with us.",
            icon: Crown,
            color: "from-gold-500 to-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-gold-200",
            isDecisionDay: true,
            liveQA: true,
        },
    ],
};

// Success stories with real results
const SUCCESS_STORIES = [
    {
        name: "Maria Rodriguez",
        avatar: "MR",
        location: "Austin, TX",
        result: "First client on Day 4",
        income: "$1,200",
        quote: "I was scared to reach out to anyone. Day 2's exercise changed everything — I had a paying client before the challenge even ended!",
        daysToFirstClient: 4,
        verified: true,
    },
    {
        name: "Jennifer Thompson",
        avatar: "JT",
        location: "Denver, CO",
        result: "$3,200 in first month",
        income: "$3,200/mo",
        quote: "The Decision Day video hit different. I enrolled in the full certification that night. Best decision I ever made.",
        daysToFirstClient: 6,
        verified: true,
    },
    {
        name: "David Chen",
        avatar: "DC",
        location: "Seattle, WA",
        result: "Quit corporate job",
        income: "$8,500/mo",
        quote: "From 'maybe someday' to handing in my notice in 3 weeks. This challenge compressed years of indecision into days.",
        daysToFirstClient: 3,
        verified: true,
    },
    {
        name: "Amanda Foster",
        avatar: "AF",
        location: "Miami, FL",
        result: "5 clients in 30 days",
        income: "$4,800/mo",
        quote: "Day 3's visualization exercise made it real. I could SEE myself helping people. Then it just... happened.",
        daysToFirstClient: 7,
        verified: true,
    },
];

// Earning potential breakdown - optimized for trust & CRO
const EARNING_BREAKDOWN = [
    { label: "Early Stage", range: "Clarity & Confidence", timeline: "Client readiness", icon: User },
    { label: "Month 1–2", range: "$2,000 - $5,000", timeline: "First programs or early clients", icon: TrendingUp },
    { label: "Month 3–6", range: "$5,000 - $10,000", timeline: "Part-time to consistent income", icon: Rocket },
    { label: "Year 1", range: "$60K - $120K", timeline: "Sustainable full-time practice", icon: Crown },
];

export function ChallengesClient({
    challenges,
    userId,
    isChallengeUnlocked = true,
    hasCompletedMiniDiploma = false,
    miniDiplomaCompletedAt
}: ChallengesClientProps) {
    const [enrolling, setEnrolling] = useState(false);
    const [currentDay, setCurrentDay] = useState(0);
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [hasGraduateTraining, setHasGraduateTraining] = useState(false);
    const [activeQAPrompt, setActiveQAPrompt] = useState("");
    const [showQASection, setShowQASection] = useState(false);
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [unlockedDays, setUnlockedDays] = useState<number[]>([1]);
    const [guideAdded, setGuideAdded] = useState(false);
    const [addingGuide, setAddingGuide] = useState(false);

    // Calculate unlock countdown if mini diploma is completed but 24h haven't passed
    const getUnlockCountdown = () => {
        if (!miniDiplomaCompletedAt || isChallengeUnlocked) return null;
        const completedDate = new Date(miniDiplomaCompletedAt);
        const unlockDate = new Date(completedDate.getTime() + 24 * 60 * 60 * 1000);
        const now = new Date();
        const remainingMs = unlockDate.getTime() - now.getTime();
        if (remainingMs <= 0) return null;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
    };

    // Check if user is enrolled in the challenge from DB data
    useEffect(() => {
        const activationChallenge = challenges.find(c => c.slug === "7-day-activation" || c.isFeatured);
        if (activationChallenge) {
            setIsEnrolled(activationChallenge.isEnrolled);
            setCurrentDay(activationChallenge.currentDay || 1);
            setCompletedDays(activationChallenge.completedDays || []);
            if (activationChallenge.startedAt) {
                setStartedAt(new Date(activationChallenge.startedAt));
            }
        }
    }, [challenges]);

    // Calculate unlocked days based on hybrid drip (24h time-based)
    useEffect(() => {
        if (startedAt) {
            const daysSinceStart = Math.floor((Date.now() - startedAt.getTime()) / (1000 * 60 * 60 * 24));
            const unlocked = Array.from({ length: Math.min(daysSinceStart + 1, 7) }, (_, i) => i + 1);
            // Day 7 requires Day 6 complete OR 6 days elapsed
            if (daysSinceStart >= 6 || completedDays.includes(6)) {
                if (!unlocked.includes(7)) unlocked.push(7);
            }
            setUnlockedDays(unlocked);
        }
    }, [startedAt, completedDays]);

    const handleStartChallenge = async () => {
        setEnrolling(true);
        // Simulate enrollment
        setTimeout(() => {
            setIsEnrolled(true);
            setCurrentDay(1);
            setStartedAt(new Date());
            setUnlockedDays([1]);
            setEnrolling(false);
        }, 1500);
    };

    const handleCompleteDay = (day: number) => {
        if (!completedDays.includes(day)) {
            const newCompleted = [...completedDays, day];
            setCompletedDays(newCompleted);
            if (day < 7) {
                setCurrentDay(day + 1);
                // Unlock next day on completion (soft gate)
                if (!unlockedDays.includes(day + 1)) {
                    setUnlockedDays([...unlockedDays, day + 1]);
                }
            }
        }
    };

    const isDayUnlocked = (day: number) => unlockedDays.includes(day);
    const progressPercent = (completedDays.length / 7) * 100;

    // Get encouraging message based on progress
    const getProgressMessage = () => {
        if (completedDays.length === 0) return "Let's begin your transformation!";
        if (completedDays.length < 3) return "Great start! Keep the momentum going.";
        if (completedDays.length < 5) return "You're doing amazing — more than halfway there!";
        if (completedDays.length < 7) return "Almost there! The finish line is in sight.";
        return "Congratulations! You've completed the challenge!";
    };

    // Handle adding free guide to library
    const handleAddToLibrary = async () => {
        setAddingGuide(true);
        try {
            const response = await fetch("/api/user/library", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resourceId: "fm-practitioner-decision-guide",
                    resourceType: "free-guide"
                })
            });

            if (response.ok) {
                setGuideAdded(true);
                // Also store in localStorage for immediate UI feedback
                localStorage.setItem("fm-decision-guide-added", "true");
            } else {
                console.error("Failed to add guide to library");
            }
        } catch (error) {
            console.error("Error adding guide to library:", error);
        } finally {
            setAddingGuide(false);
        }
    };

    // Check if guide was already added on mount
    useEffect(() => {
        const checkGuideStatus = async () => {
            // First check localStorage for immediate feedback
            if (localStorage.getItem("fm-decision-guide-added") === "true") {
                setGuideAdded(true);
                return;
            }

            // Then verify with API
            try {
                const response = await fetch("/api/user/library?resourceId=fm-practitioner-decision-guide");
                if (response.ok) {
                    const data = await response.json();
                    if (data.hasResource) {
                        setGuideAdded(true);
                        localStorage.setItem("fm-decision-guide-added", "true");
                    }
                }
            } catch (error) {
                console.error("Error checking guide status:", error);
            }
        };

        checkGuideStatus();
    }, []);

    const countdown = getUnlockCountdown();

    // Show locked state if challenge is not unlocked
    if (!isChallengeUnlocked) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <Card className="max-w-2xl mx-auto border-2 border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center">
                                <Lock className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-700">7-Day Challenge Locked</h2>
                                <p className="text-gray-500 text-sm">Complete prerequisites to unlock</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-6 space-y-6">
                        {!hasCompletedMiniDiploma ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-amber-800">Step 1: Complete Your Mini Diploma</p>
                                        <p className="text-sm text-amber-700">Finish your free mini diploma to unlock the training</p>
                                    </div>
                                </div>
                                <Link href="/my-mini-diploma">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                                        <GraduationCap className="w-4 h-4 mr-2" /> Go to Mini Diploma
                                    </Button>
                                </Link>
                            </div>
                        ) : countdown ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-blue-800">Challenge Unlocks Soon!</p>
                                        <p className="text-sm text-blue-700">
                                            Watch the Training video OR wait for automatic unlock
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 mb-4 text-center">
                                    <p className="text-3xl font-bold text-blue-700">
                                        {countdown.hours}h {countdown.minutes}m
                                    </p>
                                    <p className="text-sm text-blue-500">until automatic unlock</p>
                                </div>
                                <Link href="/training">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        <Play className="w-4 h-4 mr-2" /> Watch Training to Unlock Now
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-800">Almost There!</p>
                                        <p className="text-sm text-green-700">Watch the Training video to unlock the challenge</p>
                                    </div>
                                </div>
                                <Link href="/training">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                        <Play className="w-4 h-4 mr-2" /> Watch Training Now
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <div className="border-t pt-6">
                            <h3 className="font-bold text-gray-900 mb-4">Your Path to the Challenge:</h3>
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 p-3 rounded-lg ${hasCompletedMiniDiploma ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                    {hasCompletedMiniDiploma ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                    <span className={hasCompletedMiniDiploma ? 'text-green-800' : 'text-gray-600'}>
                                        Complete Mini Diploma
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <Circle className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-600">Watch Graduate Training (or wait 24h)</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-600">Start 7-Day Challenge</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="relative mb-8 bg-gradient-to-br from-burgundy-900 via-burgundy-800 to-purple-900 rounded-3xl overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="relative z-10 p-8 md:p-12">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-sm px-4 py-1.5 backdrop-blur-sm">
                            <Flame className="w-4 h-4 mr-1.5" /> Flagship Challenge
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-sm px-4 py-1.5 backdrop-blur-sm">
                            <RefreshCw className="w-4 h-4 mr-1.5" /> Start Anytime
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm px-4 py-1.5 backdrop-blur-sm">
                            <Gift className="w-4 h-4 mr-1.5" /> 100% Free
                        </Badge>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-10">
                        {/* Left: Content (3 cols) */}
                        <div className="lg:col-span-3 text-white">
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                                {ACTIVATION_CHALLENGE.title}
                            </h1>
                            <p className="text-xl text-gold-300 font-medium mb-4">
                                {ACTIVATION_CHALLENGE.subtitle}
                            </p>
                            <p className="text-lg text-white/70 mb-2 italic">
                                "{ACTIVATION_CHALLENGE.tagline}"
                            </p>
                            <p className="text-base text-white/80 mb-8 leading-relaxed max-w-2xl">
                                {ACTIVATION_CHALLENGE.description}
                            </p>

                            {/* Key Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <Calendar className="w-6 h-6 text-gold-400 mb-2" />
                                    <p className="font-bold text-white">{ACTIVATION_CHALLENGE.duration}</p>
                                    <p className="text-xs text-white/60">Commitment</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <Timer className="w-6 h-6 text-gold-400 mb-2" />
                                    <p className="font-bold text-white">{ACTIVATION_CHALLENGE.timePerDay}</p>
                                    <p className="text-xs text-white/60">Per Day</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <Video className="w-6 h-6 text-gold-400 mb-2" />
                                    <p className="font-bold text-white">1 Video/Day</p>
                                    <p className="text-xs text-white/60">Short & Focused</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                    <Headphones className="w-6 h-6 text-gold-400 mb-2" />
                                    <p className="font-bold text-white">Coach Support</p>
                                    <p className="text-xs text-white/60">Guided support & decision clarity</p>
                                </div>
                            </div>

                            {/* Earning Potential Highlight */}
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-5 border border-green-400/30 mb-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-green-300 uppercase tracking-wide">Earning Potential</p>
                                        <p className="text-xl font-bold text-white">$60,000 - $120,000 /year</p>
                                    </div>
                                </div>
                                <p className="text-sm text-green-200/80">
                                    Build a sustainable practice with clarity, confidence, and real client-getting skills.
                                </p>
                            </div>

                            {/* CTA */}
                            {isEnrolled ? (
                                <div className="space-y-4">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-sm text-white/60">Your Progress</span>
                                                <p className="text-lg font-bold text-white">{completedDays.length}/7 Days Complete</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-gold-400">{Math.round(progressPercent)}%</span>
                                            </div>
                                        </div>
                                        <Progress value={progressPercent} className="h-3 mb-3" />
                                        <p className="text-sm text-white/70 italic">{getProgressMessage()}</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="w-full bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold text-lg py-6"
                                        onClick={() => document.getElementById('day-content')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        <Play className="w-5 h-5 mr-2" /> Continue Day {currentDay}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Button
                                        size="lg"
                                        onClick={handleStartChallenge}
                                        disabled={enrolling}
                                        className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold text-lg py-6 px-10"
                                    >
                                        {enrolling ? (
                                            <>Starting Your Journey...</>
                                        ) : (
                                            <>
                                                <Flame className="w-5 h-5 mr-2" /> Start the Challenge — Free
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-white/50 text-center">
                                        Join 2,847+ practitioners who've completed this challenge
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Coach Sarah Card (2 cols) */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden">
                                <div className="bg-gradient-to-r from-gold-500/20 to-amber-500/20 px-5 py-3 border-b border-white/10">
                                    <p className="text-xs font-bold text-gold-300 uppercase tracking-wide">Your Challenge Host</p>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="w-16 h-16 ring-2 ring-gold-400/50">
                                            <AvatarImage src={COACH_SARAH.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-purple-600 text-white font-bold text-lg">
                                                SM
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{COACH_SARAH.name}</h3>
                                                <BadgeCheck className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <p className="text-sm text-white/60">{COACH_SARAH.title}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-white/80 mb-4 leading-relaxed">
                                        {COACH_SARAH.bio}
                                    </p>

                                    <div className="bg-white/5 rounded-lg p-3 mb-4 border-l-2 border-gold-400">
                                        <p className="text-sm text-white/90 italic">
                                            "{COACH_SARAH.quote}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-2 bg-white/5 rounded-lg">
                                            <p className="text-xl font-bold text-gold-400">{COACH_SARAH.stats.studentsHelped}+</p>
                                            <p className="text-[10px] text-white/50 uppercase">Practitioners</p>
                                        </div>
                                        <div className="text-center p-2 bg-white/5 rounded-lg">
                                            <p className="text-xl font-bold text-green-400">{COACH_SARAH.stats.challengeCompletions}</p>
                                            <p className="text-[10px] text-white/50 uppercase">Completions</p>
                                        </div>
                                        <div className="text-center p-2 bg-white/5 rounded-lg">
                                            <p className="text-xl font-bold text-purple-400">{COACH_SARAH.stats.successRate}</p>
                                            <p className="text-[10px] text-white/50 uppercase">Success</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* What You'll Get Mini Card */}
                            <Card className="mt-4 bg-white/10 backdrop-blur-md border-white/20 text-white">
                                <CardContent className="p-4">
                                    <p className="text-xs font-bold text-gold-300 uppercase mb-3">What You Get</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-white/80">7 focused video lessons</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-white/80">Daily reflections & actions</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-white/80">Voice notes from Coach Sarah</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-white/80">Community Q&A access</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                            <span className="text-white/80">Day 7 Live Q&A (optional)</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earning Potential Section */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Your Earning Potential</h2>
                        <p className="text-sm text-gray-600">What challenge completers typically earn</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {EARNING_BREAKDOWN.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Card key={idx} className="border-2 border-gray-100 hover:border-green-200 transition-colors">
                                <CardContent className="p-5">
                                    <Icon className="w-8 h-8 text-green-600 mb-3" />
                                    <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{item.range}</p>
                                    <p className="text-xs text-gray-400">{item.timeline}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* 7-Day Content (when enrolled) */}
            {isEnrolled && (
                <section id="day-content" className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Your 7-Day Journey</h2>
                                <p className="text-sm text-gray-600">One day unlocks every 24 hours • Complete at your pace</p>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                            {completedDays.length}/7 Complete
                        </Badge>
                    </div>

                    {/* Catch-up Reassurance */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-blue-800">You don't need to be perfect. Just keep going.</p>
                            <p className="text-xs text-blue-600">Previous days stay unlocked — catch up at your own pace.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {ACTIVATION_CHALLENGE.structure.map((day) => {
                            const Icon = day.icon;
                            const isCompleted = completedDays.includes(day.day);
                            const isCurrent = currentDay === day.day;
                            const isUnlocked = isDayUnlocked(day.day);
                            const isLocked = !isUnlocked;

                            return (
                                <Card
                                    key={day.day}
                                    className={`overflow-hidden transition-all ${
                                        isCurrent ? 'ring-2 ring-burgundy-500 shadow-xl' :
                                        isCompleted ? `${day.bgColor} ${day.borderColor} border-2` :
                                        isLocked ? 'opacity-50 bg-gray-50' : 'hover:shadow-md'
                                    }`}
                                >
                                    <div className={`h-1.5 bg-gradient-to-r ${day.color}`} />
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                            {/* Day Badge */}
                                            <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:w-28">
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${day.color} flex items-center justify-center shadow-lg relative`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                                    ) : isLocked ? (
                                                        <Lock className="w-8 h-8 text-white/70" />
                                                    ) : (
                                                        <Icon className="w-8 h-8 text-white" />
                                                    )}
                                                    {isCurrent && !isCompleted && (
                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="lg:text-center">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Day</p>
                                                    <p className="text-3xl font-bold text-gray-900">{day.day}</p>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                                                            {day.voiceNote && (
                                                                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                                                                    <Volume2 className="w-3 h-3 mr-1" /> Voice Note
                                                                </Badge>
                                                            )}
                                                            {day.liveQA && (
                                                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                                                    <PlayCircle className="w-3 h-3 mr-1" /> Live Q&A
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Badge className="bg-gray-100 text-gray-600 border-0">
                                                            Focus: {day.focus}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Video className="w-4 h-4" />
                                                        {day.videoLength}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 mb-4">{day.purpose}</p>

                                                {!isLocked && (
                                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                                            <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                                                                <BookOpen className="w-3 h-3" /> Reflection
                                                            </p>
                                                            <p className="text-sm text-blue-800">{day.reflection}</p>
                                                        </div>
                                                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                                            <p className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1">
                                                                <Rocket className="w-3 h-3" /> Action
                                                            </p>
                                                            <p className="text-sm text-green-800">{day.action}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex flex-wrap gap-3">
                                                    {isCompleted ? (
                                                        <Badge className="bg-green-100 text-green-700 border-0 py-2 px-4">
                                                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed
                                                        </Badge>
                                                    ) : isLocked ? (
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="py-2 px-4 text-gray-400">
                                                                <Lock className="w-4 h-4 mr-1.5" /> Unlocks in {day.day - unlockedDays.length} day(s)
                                                            </Badge>
                                                            <span className="text-xs text-gray-400">or complete previous days</span>
                                                        </div>
                                                    ) : isCurrent ? (
                                                        <>
                                                            <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                                                <Play className="w-4 h-4 mr-2" /> Watch Video
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => handleCompleteDay(day.day)}
                                                                className="border-green-500 text-green-600 hover:bg-green-50"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Complete
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => setShowQASection(true)}
                                                            >
                                                                <MessageSquare className="w-4 h-4 mr-2" /> Share Reflection
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button variant="outline" onClick={() => setCurrentDay(day.day)}>
                                                            <Play className="w-4 h-4 mr-2" /> Start Day {day.day}
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Decision Day Special CTA */}
                                                {day.isDecisionDay && isCurrent && (
                                                    <div className="mt-6 bg-gradient-to-r from-burgundy-600 to-purple-700 rounded-xl p-6 text-white">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Crown className="w-6 h-6 text-gold-400" />
                                                            <h4 className="font-bold text-lg">Ready to Go All In?</h4>
                                                        </div>
                                                        <p className="text-white/80 mb-4">
                                                            You've done the work. You've faced your fears. You've seen what's possible.
                                                            Now it's time to commit fully and join our certified practitioners.
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <Link href="/catalog">
                                                                <Button className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold">
                                                                    <GraduationCap className="w-4 h-4 mr-2" />
                                                                    Enroll in Full Certification — $997
                                                                </Button>
                                                            </Link>
                                                            <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                Talk to Coach Sarah First
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Q&A Section */}
            {showQASection && isEnrolled && (
                <Card className="mb-10 border-2 border-purple-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Day {currentDay} Reflection Q&A
                        </h3>
                        <button onClick={() => setShowQASection(false)} className="text-white/70 hover:text-white">
                            ×
                        </button>
                    </div>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">SM</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Coach Sarah asks:</p>
                                <p className="text-gray-800 font-medium">
                                    {ACTIVATION_CHALLENGE.structure[currentDay - 1]?.reflection}
                                </p>
                            </div>
                        </div>
                        <textarea
                            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-700"
                            placeholder="Share your reflection here... Be honest — that's where the growth happens."
                            value={activeQAPrompt}
                            onChange={(e) => setActiveQAPrompt(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-500">
                                Coach Sarah responds to reflections within 24 hours
                            </p>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Send className="w-4 h-4 mr-2" /> Post Reflection
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Success Stories */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-100 to-amber-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-gold-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Challenge Success Stories</h2>
                        <p className="text-sm text-gray-600">Real results from real practitioners</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {SUCCESS_STORIES.map((story, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-all border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="w-14 h-14 ring-2 ring-gold-200">
                                        <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-purple-600 text-white font-bold">
                                            {story.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900">{story.name}</p>
                                            {story.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <p className="text-xs text-gray-500">{story.location}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                                {story.result}
                                            </Badge>
                                            <Badge className="bg-gold-100 text-gold-700 border-0 text-xs">
                                                {story.income}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-burgundy-400">
                                    <Quote className="w-4 h-4 text-burgundy-300 mb-2" />
                                    <p className="text-gray-700 text-sm italic leading-relaxed">"{story.quote}"</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-3">
                                    First paying client: Day {story.daysToFirstClient}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Decision Guide - Add to Library */}
            <Card className="mb-10 bg-gradient-to-r from-blue-50 via-white to-cyan-50 border-2 border-blue-200 overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-cyan-600 p-8 flex items-center justify-center">
                            <div className="text-center text-white">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
                                <p className="font-bold text-lg">Free Resource</p>
                                <p className="text-sm text-blue-100">2-4 Page PDF Guide</p>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                FM Practitioner Decision Guide
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Not 100% sure this path is right for you? Get our free guide to help you decide with clarity.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2 mb-6">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    Is FM Coaching Right for Me? (Self-Assessment Quiz)
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    The 5 Signs You're Ready to Start
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    What to Expect: Timeline & Investment Breakdown
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    Success Stories & Realistic Earning Potential
                                </li>
                            </ul>
                            {guideAdded ? (
                                <Button className="bg-green-600 hover:bg-green-600 text-white px-8" disabled>
                                    <CheckCircle className="w-4 h-4 mr-2" /> Added to Library!
                                </Button>
                            ) : (
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                    onClick={handleAddToLibrary}
                                    disabled={addingGuide}
                                >
                                    {addingGuide ? (
                                        <>Adding...</>
                                    ) : (
                                        <><BookOpen className="w-4 h-4 mr-2" /> Add to My Library</>
                                    )}
                                </Button>
                            )}
                            {guideAdded && (
                                <p className="text-sm text-green-600 mt-2">
                                    View it anytime in your <a href="/my-library" className="underline font-medium">My Library</a> page.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Final CTA */}
            {!isEnrolled && (
                <Card className="bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-purple-900 border-0 text-white overflow-hidden">
                    <CardContent className="p-8 md:p-12 relative">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-4">
                                    Ready to Stop Waiting and Start Doing?
                                </h2>
                                <p className="text-lg text-white/80 mb-6 max-w-xl">
                                    The 7-Day Practitioner Activation Challenge is free, evergreen, and waiting for you.
                                    Join 2,847+ practitioners who've already made their decision.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                    <Button
                                        size="lg"
                                        onClick={handleStartChallenge}
                                        disabled={enrolling}
                                        className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold text-lg py-6 px-10"
                                    >
                                        {enrolling ? "Starting..." : (
                                            <>
                                                <Flame className="w-5 h-5 mr-2" /> Begin Your Activation
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="bg-white/10 border border-white/30 text-white hover:bg-white/20"
                                    >
                                        <MessageSquare className="w-5 h-5 mr-2" /> Ask Coach Sarah
                                    </Button>
                                </div>
                                <p className="text-sm text-white/50 mt-4">
                                    7 days • 10-15 min/day • 100% Free • Start anytime
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                    <div className="text-center">
                                        <Flame className="w-16 h-16 text-gold-400 mx-auto mb-2" />
                                        <p className="text-gold-300 font-bold">Day 1</p>
                                        <p className="text-xs text-white/60">Starts Today</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* What Happens After */}
            <section className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-burgundy-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">What Happens After Day 7?</h2>
                        <p className="text-sm text-gray-600">Your next steps after the challenge</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-2 border-gray-100 hover:border-burgundy-300 hover:shadow-lg transition-all group">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-burgundy-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-burgundy-200 transition-colors">
                                <GraduationCap className="w-7 h-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Full Certification</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Ready to go all in? Enroll in our comprehensive FM Practitioner Certification with Coach Sarah.
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-burgundy-600 font-bold text-lg">$997</p>
                                <ChevronRight className="w-5 h-5 text-burgundy-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all group">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                <Users className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Join Community</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Connect with fellow practitioners, share wins, and get ongoing support from our community.
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-purple-600 font-bold text-lg">Free Access</p>
                                <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-gray-100 hover:border-green-300 hover:shadow-lg transition-all group">
                        <CardContent className="p-6">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                <Rocket className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Start Practicing</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Some challengers sign their first client before Day 7 even ends! Your journey starts now.
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-green-600 font-bold text-lg">Your Decision</p>
                                <ChevronRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* AccrediPro Branding */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 bg-burgundy-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span>AccrediPro Academy</span>
                    <span>•</span>
                    <span>Transforming Health Coaches Since 2019</span>
                </div>
            </div>
        </div>
    );
}
