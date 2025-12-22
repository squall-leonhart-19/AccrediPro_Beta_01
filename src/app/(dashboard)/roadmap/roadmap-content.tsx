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
    Phone,
    BookOpen,
    Star,
    Gift,
    Shield,
    Heart,
    MessageCircle,
    Briefcase,
    Clock,
    Leaf,
    Activity,
    Flower2,
    Flame,
    Eye,
} from "lucide-react";
import type { SpecializationTrack } from "@/lib/specialization-tracks";

interface CareerStep {
    step: number;
    id: string;
    title: string;
    subtitle: string;
    description: string;
    incomeVision: string;
    color: string;
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
    specialization: SpecializationTrack;
}

interface RoadmapContentProps {
    data: RoadmapData;
    steps: CareerStep[];
    userName: string;
    specialization: SpecializationTrack;
}

// Helper to get mini diploma based on specialization
const getMiniDiploma = (specialization: SpecializationTrack) => ({
    step: 0,
    id: "mini-diploma",
    title: specialization.miniDiploma.title,
    subtitle: "Free Introduction",
    description: specialization.miniDiploma.description,
    incomeVision: "Free",
    color: "purple",
    slug: specialization.miniDiploma.slug,
});

// Graduate Training - understanding what's possible
const GRADUATE_TRAINING = {
    step: 0.5,
    id: "graduate-training",
    title: "Graduate Training",
    subtitle: "45 Minutes",
    description: "Understand what's possible, how practitioners succeed, and what certification unlocks.",
    incomeVision: "Clarity",
    color: "burgundy",
    slug: "/training",
    isRecommended: true,
    mindset: "People like me are doing this. This could work.",
};

// TEMPORARILY HIDDEN - Re-enable when videos arrive (5-7 days from Dec 16, 2024)
// See: /docs/CHALLENGES_REACTIVATION.md
// Practitioner Activation Challenge - building confidence
// const ACTIVATION_CHALLENGE = {
//     step: 0.75,
//     id: "activation-challenge",
//     title: "Practitioner Activation Challenge",
//     subtitle: "7 Days • Graduate Gift",
//     description: "Experience what this path actually feels like — short daily videos, reflections, and guidance.",
//     incomeVision: "Confidence",
//     color: "amber",
//     slug: "/challenges",
//     isGift: true,
//     mindset: "I can see myself doing this.",
// };

// State-based messaging configuration - First person, warm tone for 35-40+ women
const STATE_CONFIG: Record<string, {
    welcomeMessage: string;
    actionLabel: string;
    actionHref: string;
    actionIcon: typeof Play;
    motivation: string;
    nextUnlockTitle: string;
    nextUnlockBenefits: string[];
    idealFor: string[];
}> = {
    exploration: {
        welcomeMessage: "I'm so glad you're here. This is where your transformation begins — at your own pace, with full support.",
        actionLabel: "Start Certification",
        actionHref: "/courses/functional-medicine-complete-certification",
        actionIcon: Rocket,
        motivation: "Your path to becoming a Certified Practitioner starts here. Join the program to unlock your career.",
        nextUnlockTitle: "Step 1: Certified Practitioner",
        nextUnlockBenefits: [
            "Full clinical certification with practitioner status",
            "21 modules of professional training",
            "Income potential: $3K–$5K/month",
        ],
        idealFor: [
            "Career changers ready for a meaningful profession",
            "Health enthusiasts wanting to help others professionally",
            "Existing practitioners adding functional medicine to their toolkit",
        ],
    },
    step1_in_progress: {
        welcomeMessage: "You're doing amazing work. Every lesson brings you closer to the confidence and credibility you deserve.",
        actionLabel: "Continue My Training",
        actionHref: "/my-courses",
        actionIcon: Play,
        motivation: "You're building real clinical skills. Keep going — your certification unlocks the ability to work with paying clients.",
        nextUnlockTitle: "Step 2: Practice & Income Path",
        nextUnlockBenefits: [
            "Client acquisition systems that actually work",
            "Ethical marketing without the sleaze",
            "Income potential: $5K–$10K/month",
        ],
        idealFor: [
            "Those who want to turn certification into real income",
            "Practitioners ready for their first paying clients",
            "Anyone wanting a sustainable, ethical practice",
        ],
    },
    step1_completed: {
        welcomeMessage: "Congratulations! You've earned your certification. Now it's time to turn that knowledge into real income.",
        actionLabel: "Activate My Practice Path",
        actionHref: "/courses/functional-medicine-complete-certification",
        actionIcon: Rocket,
        motivation: "You have the clinical foundation. Now let's build the practice and income you deserve — ethically and sustainably.",
        nextUnlockTitle: "Step 2: Working Practitioner",
        nextUnlockBenefits: [
            "Complete practice setup blueprint",
            "Client attraction without paid ads",
            "Income potential: $5K–$10K/month",
        ],
        idealFor: [
            "Certified practitioners ready for real clients",
            "Those wanting consistent monthly income",
            "Anyone tired of trading time for money",
        ],
    },
    step2_in_progress: {
        welcomeMessage: "You're in the income-building phase now. This is where everything starts to come together.",
        actionLabel: "Continue Building",
        actionHref: "/my-courses",
        actionIcon: Play,
        motivation: "Every system you build now creates income for years to come. You're building something real.",
        nextUnlockTitle: "Step 3: Advanced & Master",
        nextUnlockBenefits: [
            "Handle complex cases others can't",
            "Charge premium rates ($300–$500+/session)",
            "Income potential: $10K–$30K/month",
        ],
        idealFor: [
            "Practitioners wanting to specialize deeper",
            "Those ready for premium positioning",
            "Anyone wanting to become the go-to expert",
        ],
    },
    step2_completed: {
        welcomeMessage: "Look how far you've come! Your foundation is solid. Ready to charge what you're truly worth?",
        actionLabel: "Explore Advanced Track",
        actionHref: "/tracks/functional-medicine",
        actionIcon: TrendingUp,
        motivation: "The Advanced track is where practitioners become the experts everyone refers to — and pays premium for.",
        nextUnlockTitle: "Step 3: Advanced & Master",
        nextUnlockBenefits: [
            "Advanced clinical protocols",
            "Authority positioning in your market",
            "Income potential: $10K–$30K/month",
        ],
        idealFor: [
            "Successful practitioners ready to level up",
            "Those wanting to handle complex cases",
            "Anyone ready for expert-level income",
        ],
    },
    step3_available: {
        welcomeMessage: "You've earned this. The Advanced track is where practitioners become the experts everyone refers to.",
        actionLabel: "View Advanced & Master",
        actionHref: "/tracks/functional-medicine",
        actionIcon: Award,
        motivation: "This is where you become the practitioner others look up to — and refer their hardest cases to.",
        nextUnlockTitle: "Step 3: Advanced & Master",
        nextUnlockBenefits: [
            "Complex case mastery",
            "Premium client attraction",
            "Income potential: $10K–$30K/month",
        ],
        idealFor: [
            "Practitioners ready for expert status",
            "Those wanting waitlist-worthy practices",
            "Anyone ready to be the best in their area",
        ],
    },
    step3_in_progress: {
        welcomeMessage: "You're in expert territory now. The skills you're building set you apart for years.",
        actionLabel: "Continue Advanced Training",
        actionHref: "/my-courses",
        actionIcon: Play,
        motivation: "Every module deepens your expertise. You're becoming the practitioner others aspire to be.",
        nextUnlockTitle: "Step 4: Business Scaler",
        nextUnlockBenefits: [
            "Done-for-you business systems",
            "Scale beyond 1:1 client work",
            "Income potential: $30K–$50K/month",
        ],
        idealFor: [
            "Experts ready to scale their impact",
            "Those wanting passive income streams",
            "Anyone ready to build a real business",
        ],
    },
    step4_available: {
        welcomeMessage: "You've mastered the practice. Now it's time to build something bigger — without burning out.",
        actionLabel: "Apply for Business Scaler",
        actionHref: "/tracks/functional-medicine#step-4",
        actionIcon: Phone,
        motivation: "Let's build systems that work for you, so you can help more people without sacrificing yourself.",
        nextUnlockTitle: "Step 4: Business Scaler",
        nextUnlockBenefits: [
            "Done-for-you funnels and marketing",
            "Team building and delegation",
            "Income potential: $30K–$50K/month+",
        ],
        idealFor: [
            "Successful practitioners ready to scale",
            "Those wanting leverage and freedom",
            "Anyone building a legacy practice",
        ],
    },
    step4_active: {
        welcomeMessage: "You're in the scaling phase now. This is about leverage, freedom, and impact.",
        actionLabel: "Continue with Mentorship",
        actionHref: "/messages",
        actionIcon: Users,
        motivation: "Focus on the systems that multiply your impact. Your mentor is here to help every step.",
        nextUnlockTitle: "Faculty & Mentor Status",
        nextUnlockBenefits: [
            "Teach and mentor other practitioners",
            "Build institutional authority",
            "Create lasting impact in the field",
        ],
        idealFor: [
            "Leaders ready to give back",
            "Those wanting to shape the industry",
            "Anyone building a legacy",
        ],
    },
};

export function RoadmapContent({ data, steps, userName, specialization }: RoadmapContentProps) {
    // Use specialization-specific config if available, fallback to default
    const specConfig = specialization.stateConfig[data.state];
    const defaultConfig = STATE_CONFIG[data.state] || STATE_CONFIG.exploration;

    // Merge specialization config with defaults (specialization takes priority)
    const config = specConfig ? {
        welcomeMessage: specConfig.welcomeMessage,
        actionLabel: specConfig.actionLabel,
        actionHref: specConfig.actionHref,
        actionIcon: defaultConfig.actionIcon,
        motivation: specConfig.motivation,
        nextUnlockTitle: specConfig.nextUnlockTitle,
        nextUnlockBenefits: specConfig.nextUnlockBenefits,
        idealFor: specConfig.idealFor,
    } : defaultConfig;

    const currentStepData = steps.find((s) => s.step === data.currentStep) || steps[0];
    const firstName = userName.split(" ")[0];

    // Get mini diploma based on specialization
    const MINI_DIPLOMA = getMiniDiploma(specialization);

    const getStepColor = (step: number, type: "bg" | "text" | "border" | "gradient" | "light") => {
        const colors: Record<string, Record<string, string>> = {
            purple: {
                bg: "bg-purple-500",
                text: "text-purple-700",
                border: "border-purple-200",
                gradient: "from-purple-500 to-purple-600",
                light: "bg-purple-50",
            },
            emerald: {
                bg: "bg-emerald-500",
                text: "text-emerald-700",
                border: "border-emerald-200",
                gradient: "from-emerald-500 to-emerald-600",
                light: "bg-emerald-50",
            },
            amber: {
                bg: "bg-amber-500",
                text: "text-amber-700",
                border: "border-amber-200",
                gradient: "from-amber-500 to-amber-600",
                light: "bg-amber-50",
            },
            blue: {
                bg: "bg-blue-500",
                text: "text-blue-700",
                border: "border-blue-200",
                gradient: "from-blue-500 to-blue-600",
                light: "bg-blue-50",
            },
            burgundy: {
                bg: "bg-burgundy-600",
                text: "text-burgundy-700",
                border: "border-burgundy-200",
                gradient: "from-burgundy-600 to-burgundy-700",
                light: "bg-burgundy-50",
            },
            rose: {
                bg: "bg-rose-500",
                text: "text-rose-700",
                border: "border-rose-200",
                gradient: "from-rose-500 to-rose-600",
                light: "bg-rose-50",
            },
            fuchsia: {
                bg: "bg-fuchsia-500",
                text: "text-fuchsia-700",
                border: "border-fuchsia-200",
                gradient: "from-fuchsia-500 to-fuchsia-600",
                light: "bg-fuchsia-50",
            },
            teal: {
                bg: "bg-teal-500",
                text: "text-teal-700",
                border: "border-teal-200",
                gradient: "from-teal-500 to-teal-600",
                light: "bg-teal-50",
            },
            pink: {
                bg: "bg-pink-500",
                text: "text-pink-700",
                border: "border-pink-200",
                gradient: "from-pink-500 to-pink-600",
                light: "bg-pink-50",
            },
        };
        const miniDiploma = getMiniDiploma(specialization);
        const stepData = step === 0 ? miniDiploma : steps.find((s) => s.step === step);
        const color = stepData?.color || "emerald";
        return colors[color]?.[type] || colors.emerald[type];
    };

    const isStepCompleted = (step: number) => data.completedSteps.includes(step);
    const isStepEnrolled = (step: number) => data.enrolledSteps.includes(step);
    const isStepCurrent = (step: number) => data.currentStep === step && !isStepCompleted(step);
    const isStepLocked = (step: number) => !isStepCompleted(step) && !isStepEnrolled(step) && step > Math.max(data.currentStep, 1);

    // All steps including Mini Diploma, Graduate Training
    // Steps 1-4 from props are the main certification steps
    // NOTE: ACTIVATION_CHALLENGE temporarily hidden - re-add when videos arrive
    // See: /docs/CHALLENGES_REACTIVATION.md
    // NOTE: Removed MINI_DIPLOMA (Step 0) and GRADUATE_TRAINING (Step 0.5) to focus on Paid Tracks
    const allSteps = [...steps];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Compact Hero Header - Matching Catalog Style */}
            <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 border-0 overflow-hidden relative">
                <CardContent className="px-5 py-4 relative">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Icon + Title + Subtitle */}
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/30 flex-shrink-0">
                                <Target className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px]">
                                        {specialization.name} Track
                                    </Badge>
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    My <span className="text-gold-400">Career Roadmap</span>
                                </h1>
                                <p className="text-xs text-burgundy-200 mt-0.5 max-w-md hidden sm:block">
                                    Welcome back, {firstName}! {config.welcomeMessage.slice(0, 60)}...
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats + CTA */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Stats as pills */}
                            <div className="hidden md:flex items-center gap-2">
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <CheckCircle className="w-3 h-3 mr-1.5 text-gold-400" />
                                    Step {data.currentStep}/4
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <TrendingUp className="w-3 h-3 mr-1.5 text-gold-400" />
                                    {data.totalProgress}% Complete
                                </Badge>
                                {currentStepData && (
                                    <Badge className="bg-green-500/20 text-green-300 border-0 px-3 py-1.5">
                                        <DollarSign className="w-3 h-3 mr-1.5" />
                                        {currentStepData.incomeVision}
                                    </Badge>
                                )}
                            </div>
                            {/* CTA */}
                            <Link href={config.actionHref}>
                                <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-9">
                                    <config.actionIcon className="w-4 h-4 mr-1.5" />
                                    Continue
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* YOUR NEXT ACTION (Primary CTA) - MOVED TO TOP */}
            <Card className="border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-amber-50 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-gold-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                            <config.actionIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Your Next Step</h3>
                            <p className="text-gray-600 text-sm mb-4">{config.motivation}</p>

                            <Link href={config.actionHref}>
                                <Button size="lg" className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 shadow-lg">
                                    <config.actionIcon className="w-5 h-5 mr-2" />
                                    {config.actionLabel}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {/* Current Step Income */}
                        {data.currentStep > 0 && currentStepData && (
                            <div className="text-right hidden md:block">
                                <div className="flex items-center gap-2 mb-1">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="text-xl font-bold text-green-600">
                                        {currentStepData.incomeVision}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">Your Current Income Potential</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* YOUR CAREER LADDER - IMPROVED */}
            <Card className="border-2 border-burgundy-100 overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-gold-400" />
                        Your Career Ladder
                    </h2>
                    <p className="text-burgundy-100 text-sm mt-1">
                        Each step unlocks new income potential. Complete one, unlock the next.
                    </p>
                </div>
                <CardContent className="p-6">
                    <div className="space-y-3">
                        {allSteps.map((step, index) => {
                            const completed = isStepCompleted(step.step);
                            const current = isStepCurrent(step.step) || (data.state === "exploration" && step.step === 0);
                            const enrolled = isStepEnrolled(step.step);
                            const locked = isStepLocked(step.step);
                            const isMiniDiploma = step.step === 0;
                            const isGraduateTraining = step.id === "graduate-training";
                            const isActivationChallenge = step.id === "activation-challenge";
                            const isIntermediateStep = isGraduateTraining || isActivationChallenge;
                            const isCertificationStep = step.step >= 1;

                            // Graduate Training is recommended after mini diploma complete
                            const isRecommended = isGraduateTraining && data.completedSteps.includes(0);
                            // Challenge is available after mini diploma complete
                            const isChallengeAvailable = isActivationChallenge && data.completedSteps.includes(0);

                            return (
                                <div key={step.id} className="relative">
                                    {/* Connector Line */}
                                    {index < allSteps.length - 1 && (
                                        <div className={`absolute left-7 top-[72px] w-0.5 h-3 ${completed ? "bg-green-400" : "bg-gray-200"
                                            }`} />
                                    )}

                                    <div className={`flex items-center gap-4 rounded-xl border-2 transition-all ${isRecommended
                                        ? "p-5 border-burgundy-300 bg-gradient-to-r from-burgundy-50 to-purple-50 shadow-md ring-2 ring-burgundy-200"
                                        : isChallengeAvailable
                                            ? "p-4 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                                            : current
                                                ? `p-4 ${getStepColor(step.step, "border")} ${getStepColor(step.step, "light")} shadow-md ring-2 ring-offset-2 ${step.color === "purple" ? "ring-purple-400" :
                                                    step.color === "emerald" ? "ring-emerald-400" :
                                                        step.color === "amber" ? "ring-amber-400" :
                                                            step.color === "blue" ? "ring-blue-400" :
                                                                "ring-burgundy-400"
                                                }`
                                                : completed
                                                    ? "p-4 border-green-200 bg-green-50"
                                                    : enrolled
                                                        ? `p-4 ${getStepColor(step.step, "border")} bg-white`
                                                        : isCertificationStep && !completed && !enrolled
                                                            ? "p-4 border-gray-200 bg-white hover:border-gray-300"
                                                            : locked || (isIntermediateStep && !data.completedSteps.includes(0))
                                                                ? "p-4 border-gray-200 bg-gray-50 opacity-50"
                                                                : "p-4 border-gray-200 bg-white"
                                        }`}>
                                        {/* Step Icon */}
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${completed
                                            ? "bg-green-500"
                                            : isRecommended
                                                ? "bg-gradient-to-br from-burgundy-600 to-purple-600"
                                                : isChallengeAvailable
                                                    ? "bg-gradient-to-br from-orange-500 to-amber-500"
                                                    : current
                                                        ? `bg-gradient-to-r ${getStepColor(step.step, "gradient")}`
                                                        : locked || (isIntermediateStep && !data.completedSteps.includes(0))
                                                            ? "bg-gray-200"
                                                            : isCertificationStep
                                                                ? "bg-gradient-to-br from-gold-400 to-amber-500"
                                                                : "bg-gray-100"
                                            }`}>
                                            {completed ? (
                                                <CheckCircle className="w-7 h-7 text-white" />
                                            ) : locked || (isIntermediateStep && !data.completedSteps.includes(0)) ? (
                                                <Lock className="w-5 h-5 text-gray-400" />
                                            ) : isMiniDiploma ? (
                                                <Gift className={`w-6 h-6 ${current ? "text-white" : "text-purple-500"}`} />
                                            ) : isGraduateTraining ? (
                                                <GraduationCap className="w-6 h-6 text-white" />
                                            ) : isActivationChallenge ? (
                                                <Flame className="w-6 h-6 text-white" />
                                            ) : isCertificationStep ? (
                                                <Rocket className="w-6 h-6 text-white" />
                                            ) : (
                                                <span className={`text-xl font-bold ${current ? "text-white" : "text-gray-400"
                                                    }`}>{step.step}</span>
                                            )}
                                        </div>

                                        {/* Step Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className={`font-bold ${completed ? "text-green-700" :
                                                    isRecommended ? "text-burgundy-800" :
                                                        isChallengeAvailable ? "text-orange-800" :
                                                            current ? "text-gray-900" :
                                                                locked ? "text-gray-400" : "text-gray-700"
                                                    }`}>{step.title}</h3>

                                                {/* Badges based on step type */}
                                                {isMiniDiploma && !completed && (
                                                    <Badge className="bg-purple-100 text-purple-700 text-xs">Free</Badge>
                                                )}
                                                {isRecommended && (
                                                    <Badge className="bg-burgundy-600 text-white border-0 text-xs animate-pulse">Recommended</Badge>
                                                )}
                                                {isChallengeAvailable && (
                                                    <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white border-0 text-xs">
                                                        <Gift className="w-3 h-3 mr-1" /> Graduate Gift
                                                    </Badge>
                                                )}
                                                {isCertificationStep && !completed && !enrolled && step.step === 1 && (
                                                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">Available Now</Badge>
                                                )}
                                                {current && !isRecommended && !isChallengeAvailable && (
                                                    <Badge className="bg-gold-400 text-burgundy-900 text-xs font-semibold">
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
                                            <p className={`text-sm ${locked || (isIntermediateStep && !data.completedSteps.includes(0)) ? "text-gray-400" : "text-gray-600"
                                                }`}>{step.description}</p>

                                            {/* Action buttons for intermediate steps */}
                                            {isRecommended && (
                                                <div className="flex items-center gap-3 mt-3">
                                                    <Badge variant="outline" className="text-xs border-burgundy-300 text-burgundy-600">
                                                        <Play className="w-3 h-3 mr-1" /> 45 minutes
                                                    </Badge>
                                                    <Link href="/training">
                                                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                                                            Watch Training <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                            {isChallengeAvailable && (
                                                <div className="flex items-center gap-3 mt-3">
                                                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                                                        7 Days • 10-15 min/day
                                                    </Badge>
                                                    <Link href="/challenges">
                                                        <Button size="sm" variant="outline" className="border-orange-400 text-orange-700 hover:bg-orange-50">
                                                            Start Day 1 <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                            {isCertificationStep && !completed && !enrolled && step.step === 1 && (
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="text-lg font-bold text-gray-700">$197</span>
                                                    <Link href="/courses/functional-medicine-complete-certification">
                                                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                                                            <Eye className="w-4 h-4 mr-1" /> View Program Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        {/* Income Vision / Status */}
                                        <div className={`text-right hidden sm:block ${locked || (isIntermediateStep && !data.completedSteps.includes(0)) ? "opacity-40" : ""}`}>
                                            <p className={`font-bold text-lg ${completed ? "text-green-600" :
                                                isRecommended ? "text-burgundy-600" :
                                                    isChallengeAvailable ? "text-orange-600" :
                                                        current ? getStepColor(step.step, "text") :
                                                            isMiniDiploma ? "text-purple-600" :
                                                                isCertificationStep ? "text-gray-700" :
                                                                    "text-gray-400"
                                                }`}>{step.incomeVision}</p>
                                            {isCertificationStep && (
                                                <p className="text-xs text-gray-400">per month</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trust Note */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">No pressure.</span> Take your time exploring each step.
                            The training and challenge help you decide with confidence — enrollment is available whenever you're ready.
                        </p>
                    </div>

                    {/* Total Progress */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Your Overall Progress</span>
                            <span className="font-bold text-burgundy-700">{data.completedSteps.length} of 4 Steps Complete</span>
                        </div>
                        <Progress value={data.totalProgress} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* WHAT UNLOCKS NEXT - IMPROVED WITH BENEFITS + IDEAL FOR */}
            {data.currentStep < 4 && (
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">What Unlocks Next</h3>
                                <p className="text-blue-700 font-semibold">{config.nextUnlockTitle}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Benefits */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What You'll Get</p>
                                <ul className="space-y-2">
                                    {config.nextUnlockBenefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Ideal For */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Perfect For You If</p>
                                <ul className="space-y-2">
                                    {config.idealFor.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Links - IMPROVED */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/career-center">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-5 h-5 text-burgundy-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">Career Center</p>
                                    <p className="text-xs text-gray-500">Explore career outcomes & income paths</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href={`/tracks/${specialization.slug}`}>
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">{specialization.name} Track</p>
                                    <p className="text-xs text-gray-500">See curriculum, pricing & what's included</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/messages">
                    <Card className="border border-gray-200 hover:border-burgundy-200 hover:shadow-md transition-all cursor-pointer h-full">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-200 flex-shrink-0">
                                    <img src="/coaches/sarah-coach.webp" alt="Coach Sarah" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">Ask Sarah Anything</p>
                                    <p className="text-xs text-gray-500">Your coach is here to help!</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Your Dedicated Coach - Personal Connection */}
            <Card className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden">
                <CardContent className="p-6 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        {/* Coach Photo & Badge */}
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-gold-400/30 shadow-xl">
                                <img
                                    src="/coaches/sarah-coach.webp"
                                    alt="Your Coach Sarah"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-burgundy-700 flex items-center justify-center">
                                <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* Coach Message */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                <h3 className="text-xl font-bold text-white">Hi {firstName}, I&apos;m Sarah!</h3>
                                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-xs">Your Coach</Badge>
                            </div>
                            <p className="text-burgundy-100 mb-4 max-w-lg">
                                I created your personalized roadmap based on your goals. I&apos;m here to guide you every step of the way — from your first lesson to your first client. <span className="text-gold-300 font-medium">Any questions? I&apos;m just a message away!</span>
                            </p>
                            <Link href="/messages">
                                <Button className="bg-white text-burgundy-700 hover:bg-gold-50 shadow-lg font-semibold">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with Sarah Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex flex-col gap-2 text-right">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <p className="text-2xl font-bold text-white">1,400+</p>
                                <p className="text-xs text-burgundy-200">Students Guided</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <p className="text-2xl font-bold text-gold-300">&lt; 24h</p>
                                <p className="text-xs text-burgundy-200">Response Time</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
