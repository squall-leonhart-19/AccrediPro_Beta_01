"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Flame,
    Clock,
    Users,
    ChevronRight,
    Trophy,
    Lock,
    CheckCircle2,
    Sparkles,
    Zap,
    Play,
    Star,
    Calendar,
    Heart,
    Brain,
    Leaf,
    TrendingUp,
    GraduationCap,
    BookOpen,
    ArrowRight,
    Target,
    Award,
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
}

// Challenge categories with coming soon items
const CHALLENGE_CATEGORIES = [
    {
        name: "Functional Medicine",
        icon: Leaf,
        color: "emerald",
        challenges: [
            { title: "7-Day FM Career Launch Challenge", available: true, slug: "fm-career-challenge" },
            { title: "7-Day Gut Reset Challenge", available: false },
            { title: "Root Cause Discovery Challenge", available: false },
        ],
    },
    {
        name: "Women's Health",
        icon: Heart,
        color: "pink",
        challenges: [
            { title: "Hormone Harmony Challenge", available: false },
            { title: "5-Day Menopause Reset", available: false },
        ],
    },
    {
        name: "Neurodiversity Support",
        icon: Brain,
        color: "purple",
        challenges: [
            { title: "7-Day ND Support Challenge", available: false },
            { title: "Sensory Awareness Challenge", available: false },
        ],
    },
    {
        name: "Mental Health & Trauma",
        icon: Sparkles,
        color: "blue",
        challenges: [
            { title: "Nervous System Reset", available: false },
            { title: "Anxiety & Emotional Balance", available: false },
        ],
    },
];

// Badges that can be earned
const AVAILABLE_BADGES = [
    { name: "Challenge Accepted", icon: "🎯", description: "Start your first challenge" },
    { name: "Day 1 Champion", icon: "🌟", description: "Complete Day 1" },
    { name: "Halfway Hero", icon: "🔥", description: "Reach Day 4" },
    { name: "Money Mindset", icon: "💰", description: "Complete income training" },
    { name: "Full Graduate", icon: "🎓", description: "Finish all 7 days" },
    { name: "Transformation Master", icon: "👑", description: "Complete 3 challenges" },
];

// Bonus trainings
const BONUS_TRAININGS = [
    { title: "How FM Coaches Earn $10K/Month", duration: "45 min", icon: "💰" },
    { title: "Secret Case Studies Walkthrough", duration: "30 min", icon: "📊" },
    { title: "Gut Health Masterclass Replay", duration: "60 min", icon: "🧬" },
    { title: "Women's Hormone Blueprint", duration: "45 min", icon: "💜" },
];

export function ChallengesClient({ challenges, userId }: ChallengesClientProps) {
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const [localChallenges, setLocalChallenges] = useState(challenges);

    const handleEnroll = async (challengeId: string) => {
        setEnrolling(challengeId);
        try {
            const res = await fetch("/api/challenges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ challengeId }),
            });
            const data = await res.json();
            if (data.success) {
                setLocalChallenges((prev) =>
                    prev.map((c) =>
                        c.id === challengeId
                            ? { ...c, isEnrolled: true, currentDay: 1, completedDays: [] }
                            : c
                    )
                );
            }
        } catch (error) {
            console.error("Enroll error:", error);
        } finally {
            setEnrolling(null);
        }
    };

    const inProgressChallenges = localChallenges.filter(
        (c) => c.isEnrolled && c.completedDays.length < c.durationDays
    );
    const featuredChallenge = localChallenges.find((c) => c.isFeatured) || localChallenges[0];
    const completedChallenges = localChallenges.filter(
        (c) => c.isEnrolled && c.completedDays.length === c.durationDays
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 🔥 HERO HEADER - BRANDED */}
            <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                {/* Logo */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 opacity-80">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gold-400">A</span>
                    </div>
                    <span className="text-sm font-semibold text-white/80 hidden md:block">AccrediPro Academy</span>
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-gold-400/30">
                        <Flame className="w-5 h-5 text-gold-400" />
                        <span className="font-semibold text-gold-200">7-Day Transformations</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Challenge Hub
                    </h1>
                    <p className="text-lg text-white/90 mb-6">
                        Transform your health, mindset, and coaching skills one day at a time.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-500">
                            <Flame className="w-5 h-5 mr-2" /> Start a Challenge
                        </Button>
                        <Button size="lg" variant="outline" className="border-gold-400/30 text-gold-200 hover:bg-gold-400/10">
                            Browse All Challenges
                        </Button>
                        <Button size="lg" variant="outline" className="border-gold-400/30 text-gold-200 hover:bg-gold-400/10">
                            <Trophy className="w-5 h-5 mr-2" /> Your Progress
                        </Button>
                    </div>
                </div>
            </div>

            {/* ⭐ FEATURED CHALLENGE */}
            {featuredChallenge && (
                <section className="mb-10">
                    <div className="bg-gradient-to-br from-gold-50 to-amber-50 rounded-3xl border-2 border-gold-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-2">
                            <div className="flex items-center gap-2 text-gold-900">
                                <Star className="w-4 h-4" />
                                <span className="text-sm font-bold">FEATURED CHALLENGE</span>
                            </div>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Flame className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {featuredChallenge.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        {featuredChallenge.description || "Reset your body, discover your calling, and learn how to build a career in Functional Medicine in just 7 days."}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <Badge className="bg-green-100 text-green-700 border-0">
                                            ✓ Available Now
                                        </Badge>
                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" /> {featuredChallenge.durationDays} days
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                            <Users className="w-4 h-4" /> {featuredChallenge.enrollmentCount}+ enrolled
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-gray-500">
                                            <Trophy className="w-4 h-4" /> {featuredChallenge.badges.length} badges
                                        </span>
                                    </div>

                                    {/* Day Preview */}
                                    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">WHAT YOU'LL DO:</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center text-xs font-bold text-burgundy-600">1</span>
                                                <span className="text-gray-700">Root Cause Awakening</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center text-xs font-bold text-burgundy-600">2</span>
                                                <span className="text-gray-700">Gut Reset Tool</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center text-xs font-bold text-burgundy-600">3</span>
                                                <span className="text-gray-700">Hormone Reboot</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center text-xs font-bold text-burgundy-600">7</span>
                                                <span className="text-gray-700">Graduation</span>
                                            </div>
                                        </div>
                                    </div>

                                    {featuredChallenge.isEnrolled ? (
                                        <Link href={`/challenges/${featuredChallenge.slug}`}>
                                            <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700">
                                                <Play className="w-5 h-5 mr-2" /> Continue Day {featuredChallenge.currentDay}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            size="lg"
                                            onClick={() => handleEnroll(featuredChallenge.id)}
                                            disabled={enrolling === featuredChallenge.id}
                                            className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
                                        >
                                            {enrolling === featuredChallenge.id ? "Starting..." : (
                                                <>
                                                    <Flame className="w-5 h-5 mr-2" /> Start This Challenge
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 📊 YOUR PROGRESS */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Your Challenge Progress
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    {inProgressChallenges.length > 0 ? (
                        <div className="space-y-4">
                            {inProgressChallenges.map((challenge) => (
                                <Link key={challenge.id} href={`/challenges/${challenge.slug}`}>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-14 h-14 bg-gradient-to-br from-burgundy-500 to-burgundy-700 rounded-xl flex items-center justify-center">
                                            <Flame className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                                                <Badge className="bg-green-100 text-green-700 border-0">Day {challenge.currentDay}</Badge>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Progress value={(challenge.completedDays.length / challenge.durationDays) * 100} className="h-2 flex-1 max-w-xs" />
                                                <span className="text-sm text-gray-500">{challenge.completedDays.length}/{challenge.durationDays} days</span>
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                                            <Play className="w-4 h-4 mr-1" /> Continue
                                        </Button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Flame className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Ready to Transform?</h3>
                            <p className="text-gray-500 text-sm mb-4">Start your first 7-day challenge and begin your transformation journey.</p>
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                <Flame className="w-4 h-4 mr-2" /> Start Your First Challenge
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* 🗂️ CHALLENGE CATEGORIES */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Browse by Category
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {CHALLENGE_CATEGORIES.map((category) => (
                        <div key={category.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className={`px-5 py-3 bg-${category.color}-50 border-b border-${category.color}-100`}>
                                <div className="flex items-center gap-2">
                                    <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {category.challenges.map((challenge, i) => (
                                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${challenge.available ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
                                        <div className="flex items-center gap-3">
                                            <Flame className={`w-4 h-4 ${challenge.available ? "text-green-600" : "text-gray-400"}`} />
                                            <span className={`text-sm ${challenge.available ? "font-medium text-gray-900" : "text-gray-500"}`}>
                                                {challenge.title}
                                            </span>
                                        </div>
                                        {challenge.available ? (
                                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">Start →</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs text-gray-400">Coming Soon</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🏆 BADGES YOU CAN EARN */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold-500" />
                    Badges You Can Earn
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {AVAILABLE_BADGES.map((badge, i) => (
                            <div key={i} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-gold-50 transition-colors">
                                <span className="text-3xl block mb-2">{badge.icon}</span>
                                <p className="text-sm font-semibold text-gray-900">{badge.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🎥 BONUS TRAININGS */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-500" />
                    Bonus Trainings Included
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BONUS_TRAININGS.map((training, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer">
                            <span className="text-2xl block mb-2">{training.icon}</span>
                            <p className="font-medium text-gray-900 text-sm mb-1">{training.title}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {training.duration}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ✅ COMPLETED CHALLENGES */}
            <section className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Completed Challenges
                </h2>
                {completedChallenges.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {completedChallenges.map((challenge) => (
                            <Link key={challenge.id} href={`/challenges/${challenge.slug}`}>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-5 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        <h3 className="font-bold text-gray-900">{challenge.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        ✅ All {challenge.durationDays} days completed!
                                    </p>
                                    <div className="flex gap-1">
                                        {challenge.badges.map((badge) => (
                                            <span key={badge.id} className="text-lg" title={badge.name}>
                                                {badge.icon}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-gold-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Your Achievements Will Shine Here ✨</h3>
                        <p className="text-gray-500 text-sm mb-4">Complete your first challenge to earn badges and see your progress!</p>
                        <Button variant="outline">
                            <Flame className="w-4 h-4 mr-2" /> Start Your First Challenge
                        </Button>
                    </div>
                )}
            </section>

            {/* 🎓 UPGRADE CTA */}
            <section className="mb-10">
                <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-purple-800 rounded-3xl p-8 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Become a Certified Coach 🎓</h3>
                            <p className="text-white/80">Upgrade your journey with professional certifications & DFY tools</p>
                        </div>
                        <Link href="/courses">
                            <Button size="lg" className="bg-white text-burgundy-700 hover:bg-white/90">
                                Browse Certifications <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
