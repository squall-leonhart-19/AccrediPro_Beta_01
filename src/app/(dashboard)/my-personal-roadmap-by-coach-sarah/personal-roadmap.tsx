"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    GraduationCap,
    DollarSign,
    ArrowRight,
    CheckCircle,
    Lock,
    Play,
    Rocket,
    Target,
    Sparkles,
    ChevronRight,
    TrendingUp,
    Users,
    Award,
    Star,
    MessageCircle,
    Clock,
    Heart,
    Quote,
    Zap,
    Trophy,
    Timer,
    AlertTriangle,
    Flame,
    ArrowUpRight,
    CircleDollarSign,
    Briefcase,
} from "lucide-react";
import type { SpecializationTrack } from "@/lib/specialization-tracks";

// EXPANDED Mock data for Live Success Feed (rotating notifications)
const LIVE_SUCCESS_FEED = [
    { name: "Jennifer K.", action: "completed Step 2", result: "Now earning $6,800/month", time: "3 min ago", emoji: "🎉" },
    { name: "Amanda R.", action: "landed her 15th client", result: "", time: "12 min ago", emoji: "🔥" },
    { name: "Sarah T.", action: "quit her hospital job", result: "Full-time practitioner", time: "1 hr ago", emoji: "🚀" },
    { name: "Maria S.", action: "hit $8,000 this month", result: "", time: "2 hrs ago", emoji: "💰" },
    { name: "Lisa P.", action: "got certified", result: "Ready for clients", time: "3 hrs ago", emoji: "🏆" },
    { name: "Rachel M.", action: "signed 3 new clients", result: "This week alone!", time: "4 hrs ago", emoji: "✨" },
    { name: "Emily W.", action: "crossed $10K", result: "Best month ever", time: "5 hrs ago", emoji: "🌟" },
    { name: "Diana C.", action: "launched her practice", result: "First client booked!", time: "6 hrs ago", emoji: "🎯" },
    { name: "Karen L.", action: "replaced her salary", result: "$7,200/month", time: "8 hrs ago", emoji: "💪" },
    { name: "Nicole F.", action: "finished Module 5", result: "Ahead of schedule!", time: "10 hrs ago", emoji: "⚡" },
];

// Mock peer comparison data
const PEER_COMPARISON = [
    { name: "Maria S.", progress: "Step 2", income: "$5,400/mo", avatar: "👩‍⚕️" },
    { name: "Jennifer L.", progress: "Step 2", income: "12 clients", avatar: "👩‍💼" },
    { name: "Amanda K.", progress: "Step 1", income: "First client!", avatar: "👩‍🔬" },
];

// Income goal mapping based on learning goals
const INCOME_GOAL_MAP: Record<string, { monthly: string; yearly: string; description: string }> = {
    career_change: { monthly: "$5,000-$8,000", yearly: "$60K-$100K", description: "Replace your income" },
    side_income: { monthly: "$2,000-$4,000", yearly: "$24K-$48K", description: "Supplemental income" },
    start_practice: { monthly: "$8,000-$15,000", yearly: "$100K-$180K", description: "Full practice" },
    help_family: { monthly: "$1,000-$3,000", yearly: "$12K-$36K", description: "Flexible schedule" },
    personal_health: { monthly: "$3,000-$6,000", yearly: "$36K-$72K", description: "Health + Income" },
    add_to_practice: { monthly: "$10,000-$20,000", yearly: "$120K-$240K", description: "Expand services" },
    default: { monthly: "$5,000-$10,000", yearly: "$60K-$120K", description: "Your potential" },
};

// Helper to calculate days since a date
function daysSince(dateString: string | null): number {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

interface CareerStep {
    step: number;
    id: string;
    title: string;
    subtitle: string;
    description: string;
    incomeVision: string;
    courseSlugs: string[];
}

interface RoadmapData {
    state: string;
    currentStep: number;
    currentStepProgress: number;
    currentCourse: {
        id: string;
        slug: string;
        title: string;
        progress: number;
        nextModule?: string;
    } | null;
    completedSteps: number[];
    enrolledSteps: number[];
    totalProgress: number;
    userName: string;
    userEmail: string;
    memberSince: string;
    // Dynamic date fields
    enrolledAt: string | null;
    daysToCompletion: number | null;
    targetDate: string | null;
    hoursPerWeek: number;
    lessonsCompleted: number;
    totalLessons: number;
    // Onboarding personalization data
    onboarding: {
        learningGoal: string | null;
        currentField: string | null;
        focusAreas: string[];
    };
}

interface PersonalRoadmapProps {
    data: RoadmapData;
    steps: CareerStep[];
    specialization: SpecializationTrack;
}

// State-based CTAs optimized for conversion
const STATE_CTA: Record<string, {
    label: string;
    href: string;
    icon: typeof Play;
    urgency: string;
    sarahQuote: string;
}> = {
    exploration: {
        label: "Start Your Certification Now",
        href: "/courses/functional-medicine-complete-certification",
        icon: Rocket,
        urgency: "Your career transformation is just one click away",
        sarahQuote: "I've watched thousands of women just like you transform their lives through this certification. You're ready — I can feel it.",
    },
    step1_in_progress: {
        label: "Continue My Training",
        href: "/my-courses",
        icon: Play,
        urgency: "You're making incredible progress!",
        sarahQuote: "Every lesson you complete brings you closer to helping real clients. I'm so proud of how far you've come!",
    },
    step1_completed: {
        label: "Unlock Step 2: Start Earning",
        href: "/courses/fm-pro-accelerator",
        icon: TrendingUp,
        urgency: "You're certified! Now let's build your income",
        sarahQuote: "You've done the hard part! Now let's turn your certification into real income. Your first clients are waiting.",
    },
    step2_in_progress: {
        label: "Continue Building Your Practice",
        href: "/my-courses",
        icon: Play,
        urgency: "Your practice is taking shape!",
        sarahQuote: "You're building something real. The systems you're learning now will generate income for years.",
    },
    step2_completed: {
        label: "Advance to Expert Level",
        href: "/tracks/functional-medicine",
        icon: Award,
        urgency: "Ready for premium rates?",
        sarahQuote: "You've proven yourself. The Advanced track is where you become the expert everyone refers to.",
    },
    step3_available: {
        label: "View Advanced & Master Track",
        href: "/tracks/functional-medicine",
        icon: Award,
        urgency: "Expert status awaits",
        sarahQuote: "This is where practitioners become legends. Are you ready?",
    },
    step3_in_progress: {
        label: "Continue Advanced Training",
        href: "/my-courses",
        icon: Play,
        urgency: "You're in expert territory now!",
        sarahQuote: "The skills you're building set you apart for life. Keep pushing!",
    },
    step4_available: {
        label: "Apply for Business Scaler",
        href: "/tracks/functional-medicine#step-4",
        icon: Trophy,
        urgency: "Scale your impact",
        sarahQuote: "You've mastered the practice. Let's build an empire.",
    },
    step4_active: {
        label: "Continue with Mentorship",
        href: "/messages",
        icon: Users,
        urgency: "Focus on scaling",
        sarahQuote: "Focus on the systems. I'm here to help every step of the way.",
    },
};

// Testimonial type
interface Testimonial {
    quote: string;
    name: string;
    role: string;
    income: string;
    field?: string;
}

// Field-specific testimonials for matched social proof
const TESTIMONIALS_BY_FIELD: Record<string, Testimonial[]> = {
    healthcare: [
        { quote: "As a nurse for 15 years, I was burned out. Now I run my own functional medicine practice and earn $8K/month doing what I love.", name: "Sarah T.", role: "Former RN → FM Practitioner", income: "$8,200/month", field: "healthcare" },
        { quote: "My medical background gave me a head start. Within 4 months I had 12 paying clients and replaced my hospital income.", name: "Dr. Amanda L.", role: "Former PA → FM Coach", income: "$11,500/month", field: "healthcare" },
        { quote: "I went from physical therapy to functional medicine. Best career move ever - more income, better hours, happier clients.", name: "Karen W.", role: "Former PT → FM Practitioner", income: "$9,800/month", field: "healthcare" },
    ],
    teacher: [
        { quote: "Teaching skills transferred perfectly to coaching. I explain complex health concepts in ways clients actually understand.", name: "Jennifer M.", role: "Former Teacher → FM Coach", income: "$7,500/month", field: "teacher" },
        { quote: "After 20 years in education, I wanted something new. Now I help families transform their health and earn twice my teaching salary.", name: "Linda R.", role: "Retired Educator → Practitioner", income: "$6,800/month", field: "teacher" },
        { quote: "Summer breaks became my certification time. Now I coach full-time and never looked back.", name: "Patricia S.", role: "Former High School Teacher", income: "$8,200/month", field: "teacher" },
    ],
    corporate: [
        { quote: "I went from corporate burnout to earning $10K/month helping executives optimize their health. Best pivot of my life.", name: "Michelle K.", role: "Former Corporate Manager", income: "$10,400/month", field: "corporate" },
        { quote: "My business background helped me scale fast. Year one I replaced my corporate salary. Year two I doubled it.", name: "Jessica H.", role: "Former Marketing Director", income: "$14,200/month", field: "corporate" },
        { quote: "Left my cubicle, kept my income. Now I work from anywhere helping busy professionals transform their health.", name: "Emily B.", role: "Former HR Executive", income: "$9,500/month", field: "corporate" },
    ],
    stay_at_home: [
        { quote: "Started while my kids napped. 8 months later, I'm earning $5K/month on my own schedule. Mom life + career is possible!", name: "Rebecca L.", role: "Mom of 3 → FM Coach", income: "$5,200/month", field: "stay_at_home" },
        { quote: "I wanted to contribute financially without sacrificing family time. Now I see clients evenings only and earn $6K/month.", name: "Amanda J.", role: "Stay-at-Home Mom → Practitioner", income: "$6,100/month", field: "stay_at_home" },
        { quote: "Nap time became study time. Now I have a thriving practice that fits around school pickups.", name: "Christina M.", role: "Full-Time Mom → Wellness Coach", income: "$4,800/month", field: "stay_at_home" },
    ],
    entrepreneur: [
        { quote: "Added FM coaching to my existing business. It's now my highest-margin service at $12K/month.", name: "Diana P.", role: "Business Owner", income: "$12,500/month", field: "entrepreneur" },
        { quote: "My third business is finally the one that lights me up. Helping others get healthy while building wealth is the dream.", name: "Nicole F.", role: "Serial Entrepreneur", income: "$15,800/month", field: "entrepreneur" },
        { quote: "I sold my previous business to pursue this. Best investment I ever made in myself.", name: "Rachel D.", role: "Former Business Owner", income: "$11,200/month", field: "entrepreneur" },
    ],
    fitness: [
        { quote: "Personal training maxed out at $4K/month. Adding functional medicine coaching doubled my income immediately.", name: "Tiffany R.", role: "Personal Trainer → FM Coach", income: "$9,200/month", field: "fitness" },
        { quote: "My gym clients wanted nutrition help. Now I offer complete wellness packages at premium rates.", name: "Stephanie G.", role: "Gym Owner → Integrated Coach", income: "$13,500/month", field: "fitness" },
        { quote: "Went from $50/hour training sessions to $300/hour functional medicine consultations.", name: "Ashley M.", role: "Former CrossFit Coach", income: "$10,800/month", field: "fitness" },
    ],
    wellness: [
        { quote: "My yoga studio income was unpredictable. Now I have consistent $8K months with nutrition and lifestyle coaching.", name: "Samantha K.", role: "Yoga Instructor → FM Practitioner", income: "$8,400/month", field: "wellness" },
        { quote: "Added functional medicine to my massage practice. Clients get better results and I doubled my rates.", name: "Lauren W.", role: "Massage Therapist → Holistic Coach", income: "$7,600/month", field: "wellness" },
        { quote: "Acupuncture certification + FM certification = clients who pay premium and get premium results.", name: "Christine L.", role: "Acupuncturist → Integrative Practitioner", income: "$11,200/month", field: "wellness" },
    ],
    default: [
        { quote: "I went from corporate burnout to earning $6K/month helping clients transform their health. Sarah's roadmap made it possible.", name: "Jennifer M.", role: "Certified FM Practitioner", income: "$6,200/month", field: "" },
        { quote: "Within 6 months of certification, I had a waitlist of clients. The step-by-step approach removed all the guesswork.", name: "Lisa R.", role: "Working Practitioner", income: "$8,500/month", field: "" },
        { quote: "This isn't just a certification — it's a complete business blueprint. I'm now making more than my corporate job.", name: "Michelle K.", role: "Advanced Practitioner", income: "$12,000/month", field: "" },
    ],
};

// Default testimonials
const TESTIMONIALS = TESTIMONIALS_BY_FIELD.default;

export function PersonalRoadmap({ data, steps, specialization }: PersonalRoadmapProps) {
    const cta = STATE_CTA[data.state] || STATE_CTA.exploration;
    const currentStepData = steps.find((s) => s.step === data.currentStep) || steps[0];

    // Live Success Feed rotation state
    const [feedIndex, setFeedIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setFeedIndex((prev) => (prev + 1) % Math.max(LIVE_SUCCESS_FEED.length - 2, 1));
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Get income goal based on user's learning goal
    const incomeGoal = INCOME_GOAL_MAP[data.onboarding.learningGoal || 'default'] || INCOME_GOAL_MAP.default;

    const isStepCompleted = (step: number) => data.completedSteps.includes(step);
    const isStepEnrolled = (step: number) => data.enrolledSteps.includes(step);
    const isStepCurrent = (step: number) => data.currentStep === step && !isStepCompleted(step);
    const isStepLocked = (step: number) => !isStepCompleted(step) && !isStepEnrolled(step) && step > Math.max(data.currentStep, 1);

    const stepColors = ["emerald", "amber", "blue", "burgundy"];
    const stepIcons = [GraduationCap, DollarSign, Award, Trophy];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* ========== HERO: Coach Sarah Personal Greeting ========== */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-burgundy-900/40 rounded-full blur-3xl" />
                </div>

                <CardContent className="relative p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Sarah's Photo */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gold-400/30 shadow-xl">
                                <img
                                    src="/coaches/sarah-coach.webp"
                                    alt="Coach Sarah"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <Heart className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>

                        {/* Personal Greeting */}
                        <div className="flex-1">
                            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-3">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Your Personal Journey
                            </Badge>

                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Hi {data.userName}! 👋
                            </h1>

                            <p className="text-burgundy-100 text-lg mb-4 max-w-xl">
                                {cta.sarahQuote}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-burgundy-200">
                                {data.enrolledAt && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Started {data.enrolledAt}
                                    </span>
                                )}
                                {!data.enrolledAt && data.memberSince && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Member since {data.memberSince}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Target className="w-4 h-4 text-gold-400" />
                                    Step {Math.max(data.currentStep, 1)} of 4
                                </span>
                                {data.daysToCompletion !== null && data.daysToCompletion > 0 && (
                                    <span className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full">
                                        <Zap className="w-4 h-4 text-green-300" />
                                        <span className="text-green-200 font-medium">Cert by {data.targetDate}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex flex-col gap-2 text-right">
                            {data.daysToCompletion !== null && data.daysToCompletion > 0 && (
                                <div className="px-4 py-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-400/30">
                                    <p className="text-2xl font-bold text-green-300">{data.daysToCompletion} days</p>
                                    <p className="text-xs text-green-200">to certification • {data.targetDate}</p>
                                </div>
                            )}
                            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <p className="text-2xl font-bold text-gold-400">{data.totalProgress}%</p>
                                <p className="text-xs text-burgundy-200">Overall Progress</p>
                            </div>
                            {data.currentStep > 0 && currentStepData && (
                                <div className="px-4 py-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
                                    <p className="text-lg font-bold text-green-300">{currentStepData.incomeVision}</p>
                                    <p className="text-xs text-green-200">Income Potential</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ========== 🔔 LIVE SUCCESS FEED (FOMO + Social Proof) ========== */}
            <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-green-700">🔥 Happening Now in AccrediPro</span>
                        <Badge className="ml-auto bg-green-100 text-green-700 text-xs">Live</Badge>
                    </div>

                    <div className="space-y-2 transition-all duration-500">
                        {LIVE_SUCCESS_FEED.slice(feedIndex, feedIndex + 3).map((item, i) => (
                            <div
                                key={`${feedIndex}-${i}`}
                                className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 border border-green-100 hover:bg-white transition-all duration-300"
                            >
                                <span className="text-xl animate-bounce">{item.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold text-green-700">{item.name}</span>
                                        {' '}{item.action}
                                        {item.result && <span className="text-green-600 font-medium"> — {item.result}</span>}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span className="font-semibold">47 practitioners certified</span> this week • <span className="font-semibold">$127,400</span> earned by community
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ========== ⚠️ COST OF WAITING (Loss Aversion) ========== */}
            <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/50 to-transparent rounded-bl-full" />

                <CardContent className="p-5 relative">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                The Cost of Waiting
                                <Badge className="bg-red-100 text-red-700 text-xs animate-pulse">Important</Badge>
                            </h3>
                            <p className="text-sm text-gray-500">Every day you wait is opportunity missed</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-xl border border-amber-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Timer className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-2xl font-bold text-amber-700">{daysSince(data.memberSince) || 47}</p>
                            <p className="text-xs text-gray-500">Days since you joined</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl border border-red-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <CircleDollarSign className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">${(Math.round((daysSince(data.memberSince) || 47) * 140)).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Potential income missed*</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-xl border border-purple-200">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Heart className="w-4 h-4 text-purple-500" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">8+</p>
                            <p className="text-xs text-gray-500">Clients you could have helped</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 italic">
                        *Based on average graduate income of $4,200/month (47 days = ~$6,580 potential income)
                    </p>
                </CardContent>
            </Card>

            {/* ========== 🔀 TWO FUTURES (Pain/Pleasure Contrast) ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LEFT: If You Stop */}
                <Card className="border-2 border-gray-300 bg-gray-100/70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 to-transparent" />
                    <CardContent className="p-5 relative">
                        <div className="text-center">
                            <div className="text-5xl mb-3">😔</div>
                            <h4 className="font-bold text-gray-500 text-lg mb-4">If You Stop Now...</h4>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2 text-gray-500">
                                    <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">✕</span>
                                    Same job, same stress
                                </li>
                                <li className="flex items-center gap-2 text-gray-500">
                                    <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">✕</span>
                                    $0 extra income
                                </li>
                                <li className="flex items-center gap-2 text-gray-500">
                                    <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">✕</span>
                                    0 clients helped
                                </li>
                                <li className="flex items-center gap-2 text-gray-500">
                                    <span className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs">✕</span>
                                    Still wondering "what if..."
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT: If You Finish */}
                <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 relative overflow-hidden ring-2 ring-green-400/50 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-transparent" />
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white animate-pulse">Your Future ✨</Badge>
                    </div>
                    <CardContent className="p-5 relative">
                        <div className="text-center">
                            <div className="text-5xl mb-3">🌟</div>
                            <h4 className="font-bold text-green-700 text-lg mb-4">If You Keep Going...</h4>
                            <ul className="space-y-3 text-left">
                                <li className="flex items-center gap-2 text-green-700">
                                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                                    Work from anywhere
                                </li>
                                <li className="flex items-center gap-2 text-green-700">
                                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                                    <span className="font-semibold">$6,200/month</span> average income
                                </li>
                                <li className="flex items-center gap-2 text-green-700">
                                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                                    <span className="font-semibold">47+</span> lives transformed
                                </li>
                                <li className="flex items-center gap-2 text-green-700">
                                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                                    Living YOUR dream career
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ========== YOUR PROFILE: Personalized Goals (PREMIUM REDESIGN) ========== */}
            <Card className="border-2 border-burgundy-200 bg-gradient-to-br from-white via-burgundy-50/30 to-purple-50/50 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-100/30 to-transparent rounded-bl-full" />

                <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center shadow-md">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Your Success Blueprint</h3>
                                <p className="text-sm text-gray-500">Customized for your transformation</p>
                            </div>
                        </div>
                        <Badge className="bg-burgundy-100 text-burgundy-700 font-semibold">Personalized</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* 💰 Income Goal - FEATURED */}
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                    <CircleDollarSign className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-bold text-green-700 uppercase">Income Target</span>
                            </div>
                            <p className="text-xl font-bold text-green-700">{incomeGoal.monthly}</p>
                            <p className="text-xs text-green-600">/month • <span className="font-semibold">{incomeGoal.yearly}</span>/year</p>
                            <p className="text-xs text-gray-500 mt-1 italic">{incomeGoal.description}</p>
                        </div>

                        {/* 🎯 Learning Goal */}
                        <div className="p-4 bg-white rounded-xl border border-burgundy-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-burgundy-100 flex items-center justify-center">
                                    <Rocket className="w-4 h-4 text-burgundy-600" />
                                </div>
                                <span className="text-xs font-bold text-burgundy-600 uppercase">Your Goal</span>
                            </div>
                            <p className="font-semibold text-gray-900 capitalize">
                                {data.onboarding.learningGoal?.replace(/_/g, ' ') || 'Build a practice'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Primary objective</p>
                        </div>

                        {/* 👩‍💼 Background */}
                        <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <Briefcase className="w-4 h-4 text-purple-600" />
                                </div>
                                <span className="text-xs font-bold text-purple-600 uppercase">Background</span>
                            </div>
                            <p className="font-semibold text-gray-900 capitalize">
                                {data.onboarding.currentField?.replace(/_/g, ' ') || 'Professional'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Your expertise</p>
                        </div>

                        {/* ⚡ Focus Areas */}
                        <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-amber-600" />
                                </div>
                                <span className="text-xs font-bold text-amber-600 uppercase">Specialties</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {(data.onboarding.focusAreas.length > 0
                                    ? data.onboarding.focusAreas.slice(0, 2)
                                    : ['Functional Medicine']
                                ).map((area, i) => (
                                    <Badge key={i} className="text-xs bg-amber-100 text-amber-700 border-amber-200">{area}</Badge>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Focus areas</p>
                        </div>
                    </div>

                    {/* Certification Target Date */}
                    {data.daysToCompletion && data.targetDate && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-xl text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold">Your Certification Date</p>
                                    <p className="text-burgundy-200 text-sm">Complete in <span className="font-bold text-white">{data.daysToCompletion} days</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{data.targetDate}</p>
                                <p className="text-xs text-burgundy-200">Target date</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ========== PRIMARY CTA: Your Next Action ========== */}
            <Card className="border-2 border-gold-300 bg-gradient-to-r from-gold-50 via-amber-50 to-gold-50 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-200/50 to-transparent rounded-bl-full" />

                <CardContent className="p-6 md:p-8 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Icon */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center shadow-lg transform -rotate-3">
                            <cta.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Your Next Step
                                </Badge>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                {cta.urgency}
                            </h2>

                            {data.currentCourse && (
                                <div className="mb-4">
                                    <p className="text-gray-600 text-sm mb-2">
                                        Currently working on: <span className="font-semibold">{data.currentCourse.title}</span>
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Progress value={data.currentStepProgress} className="h-2 flex-1 max-w-xs" />
                                        <span className="text-sm font-semibold text-burgundy-700">{data.currentStepProgress}%</span>
                                    </div>
                                </div>
                            )}

                            <Link href={cta.href}>
                                <Button size="lg" className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 shadow-lg text-lg px-8 h-14 group">
                                    {cta.label}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>

                        {/* Income Target */}
                        {data.currentStep > 0 && currentStepData && (
                            <div className="hidden md:block text-right p-4 bg-white/70 rounded-xl border border-gold-200">
                                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-green-600">{currentStepData.incomeVision}</p>
                                <p className="text-xs text-gray-500">Your Current Target</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* ========== YOUR CERTIFICATION JOURNEY: Unified Credentials + Income ========== */}
            <Card className="border-2 border-burgundy-200 bg-gradient-to-br from-white via-burgundy-50/20 to-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Award className="w-6 h-6 text-gold-400" />
                                Your Certification Journey
                            </h2>
                            <p className="text-burgundy-200 text-sm mt-1">
                                From FM-FC™ to MC-FMP™ — credentials + income growth
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                            {data.completedSteps.filter(s => s > 0).length > 0 ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-white font-semibold">{data.completedSteps.filter(s => s > 0).length}/4 Complete</span>
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-5 h-5 text-gold-400" />
                                    <span className="text-white font-semibold">Starting Your Journey</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="space-y-3">
                        {/* Unified Journey Steps with Credentials + Income */}
                        {[
                            {
                                id: 'fm-fc',
                                acronym: 'FM-FC™',
                                title: 'Foundation Certified',
                                description: 'Get certified with clinical knowledge, ethical scope, and practitioner tools.',
                                income: '$3K–$5K/month',
                                step: 1,
                                color: 'emerald'
                            },
                            {
                                id: 'fm-cp',
                                acronym: 'FM-CP™',
                                title: 'Certified Practitioner',
                                description: 'Build your practice with client acquisition, branding, and income systems.',
                                income: '$5K–$10K/month',
                                step: 2,
                                color: 'blue'
                            },
                            {
                                id: 'bc-fmp',
                                acronym: 'BC-FMP™',
                                title: 'Board Certified',
                                description: 'Handle complex cases, charge premium rates, become an industry expert.',
                                income: '$10K–$30K/month',
                                step: 3,
                                color: 'purple'
                            },
                            {
                                id: 'mc-fmp',
                                acronym: 'MC-FMP™',
                                title: 'Master Certified',
                                description: 'Scale beyond 1:1 with teams, group programs, and passive income.',
                                income: '$30K–$50K/month',
                                step: 4,
                                color: 'gold'
                            },
                        ].map((credential, index, arr) => {
                            const isCompleted = data.currentStep > credential.step;
                            const isCurrent = data.currentStep === credential.step || (data.currentStep === 0 && credential.step === 1);
                            const isLocked = data.currentStep < credential.step && !(data.currentStep === 0 && credential.step === 1);

                            // Calculate progress for current credential
                            const progressPercent = isCurrent ? (data.currentStepProgress || 0) : isCompleted ? 100 : 0;

                            const colorClasses: Record<string, { bg: string; border: string; text: string; light: string; gradient: string }> = {
                                emerald: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-700', light: 'bg-emerald-50', gradient: 'from-emerald-50 to-emerald-100' },
                                blue: { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50', gradient: 'from-blue-50 to-blue-100' },
                                purple: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-700', light: 'bg-purple-50', gradient: 'from-purple-50 to-purple-100' },
                                gold: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-700', light: 'bg-amber-50', gradient: 'from-amber-50 to-amber-100' },
                            };
                            const c = colorClasses[credential.color];

                            return (
                                <div key={credential.id} className="relative">
                                    {/* Vertical connector line */}
                                    {index < arr.length - 1 && (
                                        <div className={`absolute left-6 top-[76px] w-0.5 h-3 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
                                    )}

                                    <div className={`flex items-stretch gap-0 rounded-xl overflow-hidden transition-all ${isCurrent
                                        ? `bg-gradient-to-r ${c.gradient} border-2 ${c.border} shadow-lg ring-2 ring-offset-2 ring-${credential.color}-200`
                                        : isCompleted
                                            ? 'bg-green-50 border border-green-200'
                                            : isLocked
                                                ? 'bg-gray-50 border border-gray-200 opacity-60'
                                                : 'bg-white border border-gray-200 hover:border-gray-300'
                                        }`}>
                                        {/* Left: Status + Info */}
                                        <div className="flex items-center gap-4 flex-1 p-4">
                                            {/* Step Number / Status Icon */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted
                                                ? 'bg-green-500'
                                                : isCurrent
                                                    ? `${c.bg}`
                                                    : 'bg-gray-200'
                                                }`}>
                                                {isCompleted ? (
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                ) : isCurrent ? (
                                                    <span className="text-white font-bold text-lg">{credential.step}</span>
                                                ) : (
                                                    <Lock className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Credential Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`font-bold text-lg ${isCompleted ? 'text-green-700' : isCurrent ? c.text : 'text-gray-500'
                                                        }`}>
                                                        {credential.acronym}
                                                    </span>
                                                    <span className="text-gray-400">—</span>
                                                    <span className={`font-medium ${isCompleted ? 'text-green-600' : isCurrent ? 'text-gray-800' : 'text-gray-500'
                                                        }`}>
                                                        {credential.title}
                                                    </span>
                                                    {isCurrent && (
                                                        <Badge className={`${c.bg} text-white text-[10px]`}>YOU ARE HERE</Badge>
                                                    )}
                                                </div>
                                                <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {credential.description}
                                                </p>

                                                {/* Progress bar for current credential */}
                                                {isCurrent && (
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <Progress value={progressPercent} className="h-2 flex-1 max-w-xs" />
                                                        <span className={`text-sm font-bold ${c.text}`}>{progressPercent}%</span>
                                                    </div>
                                                )}

                                                {/* Locked message */}
                                                {isLocked && (
                                                    <p className="text-xs text-gray-400 mt-1 italic">
                                                        Unlocks after completing previous level
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Income Badge */}
                                        <div className={`flex flex-col items-center justify-center px-4 py-3 min-w-[120px] ${isCompleted
                                            ? 'bg-green-100 border-l border-green-200'
                                            : isCurrent
                                                ? `${c.light} border-l ${c.border}`
                                                : 'bg-gray-100 border-l border-gray-200'
                                            }`}>
                                            <DollarSign className={`w-5 h-5 mb-1 ${isCompleted ? 'text-green-600' : isCurrent ? c.text : 'text-gray-400'
                                                }`} />
                                            <span className={`font-bold text-sm ${isCompleted ? 'text-green-700' : isCurrent ? c.text : 'text-gray-400'
                                                }`}>
                                                {credential.income}
                                            </span>
                                            <span className="text-[10px] text-gray-400">per month</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-burgundy-500" />
                                Your Overall Journey
                            </span>
                            <span className="font-bold text-burgundy-700">
                                {data.totalProgress === 0 ? (
                                    <span className="text-amber-600">Just Getting Started!</span>
                                ) : data.totalProgress < 25 ? (
                                    `${data.totalProgress}% - Building Momentum!`
                                ) : data.totalProgress < 50 ? (
                                    `${data.totalProgress}% - Making Great Progress!`
                                ) : data.totalProgress < 75 ? (
                                    `${data.totalProgress}% - Over Halfway There!`
                                ) : data.totalProgress < 100 ? (
                                    `${data.totalProgress}% - Almost There!`
                                ) : (
                                    `100% - You Made It!`
                                )}
                            </span>
                        </div>
                        <Progress value={Math.max(data.totalProgress, 5)} className="h-3" />
                    </div>

                    {/* Current Status Summary */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-burgundy-200 text-sm">Your Current Status</p>
                                <p className="text-xl font-bold">
                                    {data.currentStep === 0 || data.currentStep === 1
                                        ? '🎯 Working toward FM-FC™'
                                        : data.currentStep === 2
                                            ? '🏆 FM-FC™ earned • Working toward FM-CP™'
                                            : data.currentStep === 3
                                                ? '🏆 FM-CP™ earned • Working toward BC-FMP™'
                                                : '🏆 BC-FMP™ earned • Working toward MC-FMP™'}
                                </p>
                            </div>
                            <Link href="/my-credentials">
                                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                    View Credentials
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ========== 👥 PEER COMPARISON (Competitive Drive) ========== */}
            <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">👥 Students Who Joined When You Did</h3>
                            <p className="text-sm text-gray-500">See where they are now...</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {PEER_COMPARISON.map((peer, i) => (
                            <div key={i} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{peer.avatar}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{peer.name}</p>
                                        <p className="text-xs text-gray-500">Joined same month as you</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className="bg-green-100 text-green-700">{peer.progress}</Badge>
                                    <p className="text-xs text-green-600 font-semibold mt-1">{peer.income}</p>
                                </div>
                            </div>
                        ))}

                        {/* YOU */}
                        <div className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-3 border-2 border-amber-300">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">👤</span>
                                <div>
                                    <p className="font-bold text-amber-700">YOU</p>
                                    <p className="text-xs text-amber-600">Your current position</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-amber-100 text-amber-700">Step {data.currentStep || 1}</Badge>
                                <p className="text-xs text-amber-600 font-semibold mt-1">{data.totalProgress}% complete</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                            <Flame className="w-4 h-4" />
                            <span><span className="font-semibold">Time to catch up?</span> They started where you are now. 🔥</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ========== 🎭 IDENTITY TRANSFORMATION (Progress Bar) ========== */}
            <Card className="border border-burgundy-200 bg-gradient-to-r from-burgundy-50 via-purple-50 to-indigo-50 overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-burgundy-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">🎭 Your Identity Transformation</h3>
                            <p className="text-sm text-gray-500">You're not just learning — you're becoming someone new</p>
                        </div>
                    </div>

                    {/* Identity Timeline */}
                    <div className="relative mb-6">
                        <div className="flex justify-between items-center">
                            {/* Before */}
                            <div className="text-center flex-shrink-0" style={{ width: '80px' }}>
                                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2 border-2 border-gray-300">
                                    <span className="text-2xl">👤</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Where You Started</p>
                            </div>

                            {/* Progress Track */}
                            <div className="flex-1 mx-3 relative">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.max(data.totalProgress, 10)}%` }}
                                    />
                                </div>
                                {/* Position Marker */}
                                <div
                                    className="absolute -top-1 transform -translate-x-1/2"
                                    style={{ left: `${Math.max(data.totalProgress, 10)}%` }}
                                >
                                    <div className="w-5 h-5 bg-gold-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                        <Star className="w-3 h-3 text-white fill-white" />
                                    </div>
                                </div>
                            </div>

                            {/* After */}
                            <div className="text-center flex-shrink-0" style={{ width: '80px' }}>
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-2 border-2 border-emerald-300 shadow-lg">
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <p className="text-xs text-emerald-600 font-bold">Practice Owner</p>
                            </div>
                        </div>
                    </div>

                    {/* Credentials Unlocking */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-500" />
                            Credentials Unlocking:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.completedSteps.includes(1) ? (
                                <Badge className="bg-green-100 text-green-700">✓ Foundation Certified</Badge>
                            ) : data.currentStep >= 1 ? (
                                <Badge className="bg-amber-100 text-amber-700">🔓 Foundation ({data.totalProgress}%)</Badge>
                            ) : (
                                <Badge className="bg-gray-100 text-gray-400">🔒 Foundation</Badge>
                            )}

                            {data.completedSteps.includes(2) ? (
                                <Badge className="bg-green-100 text-green-700">✓ Practice Builder</Badge>
                            ) : data.currentStep >= 2 ? (
                                <Badge className="bg-amber-100 text-amber-700">🔓 Practice Builder</Badge>
                            ) : (
                                <Badge className="bg-gray-100 text-gray-400">🔒 Practice Builder</Badge>
                            )}

                            {data.completedSteps.includes(3) ? (
                                <Badge className="bg-green-100 text-green-700">✓ Advanced Expert</Badge>
                            ) : (
                                <Badge className="bg-gray-100 text-gray-400">🔒 Advanced Expert</Badge>
                            )}

                            {data.completedSteps.includes(4) ? (
                                <Badge className="bg-gradient-to-r from-gold-400 to-amber-400 text-white">🏆 MASTER PRACTITIONER</Badge>
                            ) : (
                                <Badge className="bg-gray-100 text-gray-400">🔒 Master Title</Badge>
                            )}
                        </div>
                    </div>

                    {/* Transformation Statement */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-purple-700">
                            <span className="font-semibold">{data.userName}</span>, you're transforming from
                            <span className="text-gray-500"> {data.onboarding.currentField?.replace(/_/g, ' ') || 'a professional'}</span> into
                            <span className="text-emerald-600 font-bold"> Certified FM Practitioner</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ========== SOCIAL PROOF: Success Stories (Matched to Field) ========== */}
            <Card className="border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">
                                {data.onboarding.currentField
                                    ? "People Like You Who Succeeded"
                                    : "Success Stories"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {data.onboarding.currentField
                                    ? `From ${data.onboarding.currentField.replace(/_/g, ' ')}s who made the leap`
                                    : "From practitioners just like you"}
                            </p>
                        </div>
                        <Badge className="ml-auto bg-purple-100 text-purple-700">2,847+ Certified</Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Use matched testimonials if field is set, otherwise use default */}
                        {(TESTIMONIALS_BY_FIELD[data.onboarding.currentField || ''] || TESTIMONIALS).map((testimonial, i) => (
                            <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                <Quote className="w-6 h-6 text-gold-400 mb-2" />
                                <p className="text-sm text-gray-700 mb-3 line-clamp-4">{testimonial.quote}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-xs">{testimonial.income}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ========== ASK SARAH CTA ========== */}
            <Card className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 border-0 overflow-hidden relative">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl" />
                </div>

                <CardContent className="p-6 relative">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-gold-400/40 flex-shrink-0">
                            <img
                                src="/coaches/sarah-coach.webp"
                                alt="Coach Sarah"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-white mb-1">Questions About Your Path?</h3>
                            <p className="text-burgundy-200 mb-4">
                                I'm here to help you navigate every step. Don't hesitate to reach out!
                            </p>
                        </div>

                        <Link href="/messages">
                            <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Ask Sarah Anything
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* ========== QUICK LINKS ========== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/my-courses">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                <Play className="w-6 h-6 text-emerald-600" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">My Courses</p>
                            <p className="text-xs text-gray-500">Continue learning</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/career-center">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">Career Center</p>
                            <p className="text-xs text-gray-500">Income opportunities</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/community">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">Community</p>
                            <p className="text-xs text-gray-500">Connect with peers</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/catalog">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">All Courses</p>
                            <p className="text-xs text-gray-500">Browse catalog</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div >
    );
}
