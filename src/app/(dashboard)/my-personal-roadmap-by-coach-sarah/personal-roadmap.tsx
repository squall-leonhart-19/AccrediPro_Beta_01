"use client";

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
} from "lucide-react";
import type { SpecializationTrack } from "@/lib/specialization-tracks";

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

// Success testimonials for social proof
const TESTIMONIALS = [
    {
        quote: "I went from corporate burnout to earning $6K/month helping clients transform their health. Sarah's roadmap made it possible.",
        name: "Jennifer M.",
        role: "Certified FM Practitioner",
        income: "$6,200/month",
    },
    {
        quote: "Within 6 months of certification, I had a waitlist of clients. The step-by-step approach removed all the guesswork.",
        name: "Lisa R.",
        role: "Working Practitioner",
        income: "$8,500/month",
    },
    {
        quote: "This isn't just a certification — it's a complete business blueprint. I'm now making more than my corporate job.",
        name: "Michelle K.",
        role: "Advanced Practitioner",
        income: "$12,000/month",
    },
];

export function PersonalRoadmap({ data, steps, specialization }: PersonalRoadmapProps) {
    const cta = STATE_CTA[data.state] || STATE_CTA.exploration;
    const currentStepData = steps.find((s) => s.step === data.currentStep) || steps[0];

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
                                {data.memberSince && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Member since {data.memberSince}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Target className="w-4 h-4 text-gold-400" />
                                    Step {Math.max(data.currentStep, 1)} of 4
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex flex-col gap-2 text-right">
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

            {/* ========== CAREER LADDER: Visual Progress ========== */}
            <Card className="border-2 border-burgundy-100 overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Target className="w-6 h-6 text-gold-400" />
                                Your Career Ladder
                            </h2>
                            <p className="text-burgundy-200 text-sm mt-1">
                                From certification to $50K+/month — your complete path
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-white font-semibold">{data.completedSteps.filter(s => s > 0).length}/4 Complete</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const completed = isStepCompleted(step.step);
                            const current = isStepCurrent(step.step) || (data.state === "exploration" && step.step === 1);
                            const enrolled = isStepEnrolled(step.step);
                            const locked = isStepLocked(step.step);
                            const StepIcon = stepIcons[index];
                            const color = stepColors[index];

                            const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
                                emerald: { bg: "bg-emerald-500", border: "border-emerald-300", text: "text-emerald-700", light: "bg-emerald-50" },
                                amber: { bg: "bg-amber-500", border: "border-amber-300", text: "text-amber-700", light: "bg-amber-50" },
                                blue: { bg: "bg-blue-500", border: "border-blue-300", text: "text-blue-700", light: "bg-blue-50" },
                                burgundy: { bg: "bg-burgundy-600", border: "border-burgundy-300", text: "text-burgundy-700", light: "bg-burgundy-50" },
                            };
                            const c = colorClasses[color];

                            return (
                                <div key={step.id} className="relative">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className={`absolute left-8 top-[80px] w-0.5 h-4 ${completed ? "bg-green-400" : "bg-gray-200"}`} />
                                    )}

                                    <div className={`flex items-center gap-4 rounded-xl border-2 transition-all ${current
                                        ? `p-5 ${c.border} ${c.light} shadow-lg ring-2 ring-offset-2 ring-${color}-400`
                                        : completed
                                            ? "p-5 border-green-300 bg-green-50"
                                            : enrolled
                                                ? `p-5 ${c.border} bg-white`
                                                : locked
                                                    ? "p-5 border-gray-200 bg-gray-50 opacity-60"
                                                    : "p-5 border-gray-200 bg-white hover:border-gray-300"
                                        }`}>
                                        {/* Step Icon */}
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${completed
                                            ? "bg-green-500"
                                            : current
                                                ? `${c.bg}`
                                                : locked
                                                    ? "bg-gray-200"
                                                    : `${c.bg}`
                                            }`}>
                                            {completed ? (
                                                <CheckCircle className="w-8 h-8 text-white" />
                                            ) : locked ? (
                                                <Lock className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <StepIcon className="w-8 h-8 text-white" />
                                            )}
                                        </div>

                                        {/* Step Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-xs font-bold uppercase ${locked ? "text-gray-400" : c.text}`}>
                                                    Step {step.step}
                                                </span>
                                                {current && (
                                                    <Badge className="bg-gold-400 text-burgundy-900 text-xs font-bold animate-pulse">
                                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                                        YOU ARE HERE
                                                    </Badge>
                                                )}
                                                {completed && (
                                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Complete
                                                    </Badge>
                                                )}
                                            </div>

                                            <h3 className={`text-lg font-bold ${locked ? "text-gray-400" : "text-gray-900"}`}>
                                                {step.title}
                                            </h3>
                                            <p className={`text-sm ${locked ? "text-gray-400" : "text-gray-600"}`}>
                                                {step.description}
                                            </p>

                                            {/* Action Button for Current/Available Steps */}
                                            {(current || (step.step === 1 && data.state === "exploration")) && (
                                                <Link href={cta.href} className="mt-3 inline-block">
                                                    <Button size="sm" className={`${c.bg} hover:opacity-90`}>
                                                        {step.step === 1 && !enrolled ? "Enroll Now" : "Continue"}
                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Income Vision */}
                                        <div className={`text-right hidden sm:block ${locked ? "opacity-40" : ""}`}>
                                            <p className={`text-xl font-bold ${completed ? "text-green-600" :
                                                current ? c.text :
                                                    locked ? "text-gray-400" : "text-gray-700"
                                                }`}>
                                                {step.incomeVision}
                                            </p>
                                            <p className="text-xs text-gray-500">per month</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Your Overall Journey</span>
                            <span className="font-bold text-burgundy-700">{data.totalProgress}% Complete</span>
                        </div>
                        <Progress value={data.totalProgress} className="h-3" />
                    </div>
                </CardContent>
            </Card>

            {/* ========== SOCIAL PROOF: Success Stories ========== */}
            <Card className="border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Success Stories</h3>
                            <p className="text-sm text-gray-500">From practitioners just like you</p>
                        </div>
                        <Badge className="ml-auto bg-purple-100 text-purple-700">2,847+ Certified</Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                <Quote className="w-6 h-6 text-gold-400 mb-2" />
                                <p className="text-sm text-gray-700 mb-3 line-clamp-3">{testimonial.quote}</p>
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
        </div>
    );
}
