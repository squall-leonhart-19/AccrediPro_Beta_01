import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Briefcase,
    TrendingUp,
    Star,
    Users,
    DollarSign,
    ArrowRight,
    CheckCircle,
    Target,
    Sparkles,
    Heart,
    Zap,
    Leaf,
    ChevronRight,
    GraduationCap,
    Award,
    Rocket,
    Play,
    Map,
    Apple,
    Brain,
    Shield,
    Moon,
    Droplets,
} from "lucide-react";
import { FM_SPECIALIZATIONS } from "@/lib/specializations-data";

// The 5-Step Career Ladder (Step 0 = Free Mini Diploma Entry)
const careerSteps = [
    {
        step: 0,
        title: "Free Mini Diploma",
        subtitle: "Explore & Discover",
        description: "Start your journey with a free mini diploma. Discover your specialization and see if this career is for you.",
        color: "gold",
        isFree: true,
    },
    {
        step: 1,
        title: "Certified Practitioner",
        subtitle: "Become Legitimate",
        description: "Get certified with clinical knowledge, ethical scope, and practitioner tools.",
        color: "emerald",
    },
    {
        step: 2,
        title: "Working Practitioner",
        subtitle: "Work With Real Clients",
        description: "Build your practice with client acquisition, branding, and income systems.",
        color: "amber",
    },
    {
        step: 3,
        title: "Advanced & Master",
        subtitle: "Gain Authority",
        description: "Handle complex cases, charge premium rates, become an industry expert.",
        color: "blue",
    },
    {
        step: 4,
        title: "Business Scaler",
        subtitle: "Build Leverage",
        description: "Scale beyond 1:1 with teams, group programs, and passive income.",
        color: "burgundy",
    },
];

// Career Outcomes (NOT Tracks - these are destinations)
const careerOutcomes = [
    {
        id: "health-coach",
        title: "Functional Medicine Health Coach",
        subtitle: "Transform lives through root-cause health coaching",
        description: "Help clients identify and address the underlying causes of their health issues using functional medicine principles. Work with clients on nutrition, lifestyle, and behavior change.",
        icon: Heart,
        color: "burgundy",
        gradient: "from-burgundy-500 to-burgundy-600",
        income: "$50K – $120K",
        timeline: "6–12 months",
        clientTypes: "Chronic fatigue, digestive issues, weight management",
        deliveredThrough: [
            "14-Module FM Certification (Step 1)",
            "Health Coaching Core Specialization",
        ],
        ctaText: "Start FM Track",
        ctaLink: "/tracks/functional-medicine",
    },
    {
        id: "nutrition-specialist",
        title: "Functional Nutrition Specialist",
        subtitle: "Master dietary protocols and therapeutic nutrition",
        description: "Specialize in creating personalized nutrition plans, elimination diets, and food-as-medicine protocols. High demand in gut health and metabolic conditions.",
        icon: Zap,
        color: "emerald",
        gradient: "from-emerald-500 to-emerald-600",
        income: "$60K – $150K",
        timeline: "8–14 months",
        clientTypes: "Gut issues, autoimmune, blood sugar, weight loss",
        deliveredThrough: [
            "FM Certification + Nutrition Modules",
            "Gut Health or Metabolic Specialization",
        ],
        ctaText: "Explore Nutrition Path",
        ctaLink: "/tracks/functional-medicine",
    },
    {
        id: "wellness-entrepreneur",
        title: "Wellness Practice Owner",
        subtitle: "Build a thriving coaching business with multiple revenue streams",
        description: "Go beyond 1:1 coaching to build courses, group programs, and eventually a team of coaches. Create passive income and impact thousands.",
        icon: Briefcase,
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
        income: "$80K – $250K+",
        timeline: "12–18 months",
        clientTypes: "Corporate wellness, online audiences, group coaching",
        deliveredThrough: [
            "Complete any FM Specialization (Steps 1–3)",
            "Business Scaler Program (Step 4)",
        ],
        ctaText: "View Business Scaler",
        ctaLink: "/tracks/functional-medicine#step-4",
    },
];

// Income Paths tied to Steps
const incomePaths = [
    {
        level: "Part-Time Coach",
        range: "$1K – $3K/month",
        description: "5–10 clients, flexible hours",
        step: "Step 1–2",
        stepColor: "emerald",
    },
    {
        level: "Full-Time Coach",
        range: "$5K – $10K/month",
        description: "15–25 clients, full practice",
        step: "Step 2",
        stepColor: "amber",
    },
    {
        level: "Group Programs",
        range: "$10K – $25K/month",
        description: "Courses + group coaching",
        step: "Step 3",
        stepColor: "blue",
    },
    {
        level: "Agency Owner",
        range: "$25K – $100K+/month",
        description: "Team of coaches, multiple programs",
        step: "Step 4",
        stepColor: "burgundy",
    },
];

// Success Stories mapped to Steps
const successStories = [
    {
        name: "Sarah M.",
        role: "Certified FM Health Coach",
        step: 2,
        stepLabel: "Step 2: Working Practitioner",
        quote: "I went from $0 to $8K/month in just 6 months following the AccrediPro system.",
        income: "$96K/year",
        rating: 5,
    },
    {
        name: "Michael T.",
        role: "Advanced Practitioner",
        step: 3,
        stepLabel: "Step 3: Advanced",
        quote: "The certifications gave me credibility. Now I have a waitlist of clients!",
        income: "$150K/year",
        rating: 5,
    },
    {
        name: "Lisa R.",
        role: "Business Owner",
        step: 4,
        stepLabel: "Step 4: Business Scaler",
        quote: "Built a team of 5 coaches. AccrediPro changed my life completely.",
        income: "$300K+/year",
        rating: 5,
    },
];

// Get user's enrollment status for personalization
async function getUserProgress(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: { slug: true, title: true },
            },
        },
    });

    // Simple logic to determine user's current step
    const hasAnyEnrollment = enrollments.length > 0;
    const hasCompletedCourse = enrollments.some((e) => e.status === "COMPLETED");

    if (!hasAnyEnrollment) return { currentStep: 0, nextAction: "start" };
    if (!hasCompletedCourse) return { currentStep: 1, nextAction: "continue" };
    return { currentStep: 2, nextAction: "advance" };
}

export default async function CareerCenterPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const userProgress = await getUserProgress(session.user.id);

    // Determine personalized CTA
    const getPersonalizedCTA = () => {
        switch (userProgress.nextAction) {
            case "start":
                return {
                    text: "Get Your Free Mini Diploma",
                    link: "/courses",
                    variant: "primary",
                };
            case "continue":
                return {
                    text: "Continue Your Training",
                    link: "/my-courses",
                    variant: "secondary",
                };
            case "advance":
                return {
                    text: "Explore Advanced Tracks",
                    link: "/tracks/functional-medicine",
                    variant: "primary",
                };
            default:
                return {
                    text: "Get Your Free Mini Diploma",
                    link: "/courses",
                    variant: "primary",
                };
        }
    };

    const personalizedCTA = getPersonalizedCTA();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero */}
            <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                </div>
                <CardContent className="p-8 lg:p-10 relative">
                    <div className="max-w-2xl">
                        <Badge className="bg-gold-400/20 text-gold-200 mb-4">
                            <Briefcase className="w-3 h-3 mr-1" />
                            Career Center
                        </Badge>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Build Your Career with AccrediPro
                        </h1>
                        <p className="text-burgundy-100 text-lg mb-6">
                            Discover real career outcomes, income paths, and the exact <strong>professional tracks</strong> that lead there.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/roadmap">
                                <Button className="bg-gold-400 text-burgundy-900 hover:bg-gold-500">
                                    <Map className="w-4 h-4 mr-2" />
                                    View My Roadmap
                                </Button>
                            </Link>
                            <Link href="/tracks/functional-medicine">
                                <Button className="bg-white/20 border border-white/30 text-white hover:bg-white/30">
                                    Explore Specialization Tracks
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 1 - HOW ACCREDIPRO WORKS (NEW) */}
            <Card className="border-2 border-burgundy-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                        How AccrediPro Works
                    </h2>
                    <p className="text-burgundy-100 text-sm mt-1">Your career, step by step</p>
                </div>
                <CardContent className="p-6">
                    <p className="text-gray-600 mb-6 text-center max-w-2xl mx-auto">
                        Every AccrediPro career follows the same professional ladder. <strong className="text-burgundy-700">Start with a free mini diploma</strong> to explore, then progress from certification to scalable income.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {careerSteps.map((step, index) => (
                            <div key={step.step} className="relative">
                                {/* Connector Arrow */}
                                {index < careerSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-1.5 transform -translate-y-1/2 z-10">
                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                    </div>
                                )}

                                <div className={`p-3 rounded-xl border-2 h-full transition-all ${
                                    step.color === "gold" ? "border-gold-300 bg-gradient-to-br from-gold-50 to-amber-50 ring-2 ring-gold-200" :
                                    step.color === "emerald" ? "border-emerald-200 bg-emerald-50" :
                                    step.color === "amber" ? "border-amber-200 bg-amber-50" :
                                    step.color === "blue" ? "border-blue-200 bg-blue-50" :
                                    "border-burgundy-200 bg-burgundy-50"
                                }`}>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                            step.color === "gold" ? "bg-gradient-to-r from-gold-400 to-amber-500 text-white" :
                                            step.color === "emerald" ? "bg-emerald-500 text-white" :
                                            step.color === "amber" ? "bg-amber-500 text-white" :
                                            step.color === "blue" ? "bg-blue-500 text-white" :
                                            "bg-burgundy-600 text-white"
                                        }`}>
                                            {step.step === 0 ? "Start" : `Step ${step.step}`}
                                        </div>
                                        {step.color === "gold" && (
                                            <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">FREE</Badge>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-sm mb-1 text-gray-900">{step.title}</h3>
                                    <p className={`text-xs font-medium mb-1.5 ${
                                        step.color === "gold" ? "text-gold-700" :
                                        step.color === "emerald" ? "text-emerald-700" :
                                        step.color === "amber" ? "text-amber-700" :
                                        step.color === "blue" ? "text-blue-700" :
                                        "text-burgundy-700"
                                    }`}>{step.subtitle}</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <Link href="/roadmap">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                                <Map className="w-4 h-4 mr-2" />
                                View Your Personalized Roadmap
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 2 - CAREER OUTCOMES (NOT TRACKS) */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-6 h-6 text-burgundy-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Career Destinations</h2>
                        <p className="text-sm text-gray-500">These are outcomes, not courses. Each destination is reached through our specialization tracks.</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {careerOutcomes.map((outcome) => (
                        <Card key={outcome.id} className="overflow-hidden hover:shadow-xl transition-all border-2 border-gray-100 group">
                            {/* Colored header */}
                            <div className={`bg-gradient-to-r ${outcome.gradient} p-5 text-white`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <outcome.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{outcome.title}</h3>
                                    </div>
                                </div>
                                <p className="text-sm text-white/90">{outcome.subtitle}</p>
                            </div>

                            <CardContent className="p-5">
                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{outcome.description}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Income Potential</p>
                                        <p className="font-bold text-green-600">{outcome.income}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Timeline</p>
                                        <p className="font-bold text-blue-600">{outcome.timeline}</p>
                                    </div>
                                </div>

                                {/* Client Types */}
                                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <p className="text-xs font-medium text-amber-700 mb-1">Typical Clients:</p>
                                    <p className="text-sm text-gray-700">{outcome.clientTypes}</p>
                                </div>

                                {/* Delivered Through */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-500 mb-2">How to Get There:</p>
                                    <ul className="space-y-1.5">
                                        {outcome.deliveredThrough.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href={outcome.ctaLink}>
                                    <Button className={`w-full bg-gradient-to-r ${outcome.gradient} hover:opacity-90 group-hover:shadow-md transition-all`}>
                                        {outcome.ctaText}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SECTION 3 - FM SPECIALIZATIONS */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-6 h-6 text-gold-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">FM Specializations</h2>
                        <p className="text-sm text-gray-500">Choose your niche based on market demand and passion</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {FM_SPECIALIZATIONS.slice(0, 10).map((spec) => {
                        const IconComponent = spec.icon === "Apple" ? Apple :
                            spec.icon === "Leaf" ? Leaf :
                            spec.icon === "Heart" ? Heart :
                            spec.icon === "Brain" ? Brain :
                            spec.icon === "Zap" ? Zap :
                            spec.icon === "TrendingUp" ? TrendingUp :
                            spec.icon === "Shield" ? Shield :
                            spec.icon === "Moon" ? Moon :
                            spec.icon === "Droplets" ? Droplets : Target;

                        return (
                            <Card key={spec.id} className={`overflow-hidden hover:shadow-md transition-shadow ${spec.borderColor} border-2`}>
                                <div className={`bg-gradient-to-r ${spec.gradient} p-3 text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-xs">#{spec.rank}</span>
                                        </div>
                                        <Badge className="bg-white/20 text-white text-[10px] border-0">
                                            {spec.badge}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-3">
                                    <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{spec.shortTitle}</h4>
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{spec.description}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className={`font-medium ${spec.textColor}`}>{spec.marketDemand}</span>
                                        <span className="text-green-600 font-semibold">{spec.incomeRange.split(" - ")[0]}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="text-center mt-6">
                    <Link href="/tracks/functional-medicine">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Explore All Specialization Tracks
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* SECTION 4 - INCOME PATHS (Tied to Steps) */}
            <Card className="border-2 border-gray-100">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Income Paths</h2>
                            <p className="text-sm text-gray-500">Each income level maps to a step in your journey</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                        {incomePaths.map((path, index) => (
                            <div key={path.level} className="relative">
                                {index < incomePaths.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                )}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 h-full">
                                    <Badge className={`mb-2 ${
                                        path.stepColor === "emerald" ? "bg-emerald-100 text-emerald-700" :
                                        path.stepColor === "amber" ? "bg-amber-100 text-amber-700" :
                                        path.stepColor === "blue" ? "bg-blue-100 text-blue-700" :
                                        "bg-burgundy-100 text-burgundy-700"
                                    }`}>
                                        {path.step}
                                    </Badge>
                                    <Badge className="mb-2 ml-2 bg-green-100 text-green-700">{path.range}</Badge>
                                    <h4 className="font-semibold text-gray-900">{path.level}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{path.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 5 - SUCCESS STORIES (Mapped to Steps) */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Success Stories</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {successStories.map((story) => (
                        <Card key={story.name} className="border hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                {/* Step Label */}
                                <Badge variant="outline" className={`mb-3 text-xs ${
                                    story.step === 2 ? "border-amber-200 text-amber-700 bg-amber-50" :
                                    story.step === 3 ? "border-blue-200 text-blue-700 bg-blue-50" :
                                    "border-burgundy-200 text-burgundy-700 bg-burgundy-50"
                                }`}>
                                    {story.stepLabel}
                                </Badge>

                                {/* Star Rating */}
                                <div className="flex mb-3">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} className={`w-4 h-4 ${idx < story.rating ? "text-gold-400 fill-gold-400" : "text-gray-200"}`} />
                                    ))}
                                </div>

                                <p className="text-gray-600 italic mb-4">"{story.quote}"</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {story.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{story.name}</p>
                                            <p className="text-xs text-gray-500">{story.role}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {story.income}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* SECTION 6 - YOUR NEXT STEP (Personalized) */}
            <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 border-0 text-white overflow-hidden">
                <CardContent className="p-8 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-3">
                                <Rocket className="w-3 h-3 mr-1" />
                                Your Next Step
                            </Badge>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Begin?</h3>
                            <p className="text-burgundy-100 max-w-lg">
                                Start with a <strong className="text-gold-300">free mini diploma</strong> to explore your specialization. No risk, no commitment.
                                {userProgress.currentStep === 0 && " Choose your specialization and get started today!"}
                                {userProgress.currentStep === 1 && " You're already on your way. Keep going!"}
                                {userProgress.currentStep >= 2 && " Great progress! Consider advancing to the next level."}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href={personalizedCTA.link}>
                                <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 shadow-lg font-semibold">
                                    {personalizedCTA.text}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/roadmap">
                                <Button size="lg" className="bg-white/20 border border-white/30 text-white hover:bg-white/30">
                                    <Map className="w-4 h-4 mr-2" />
                                    View My Roadmap
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DFY Note (Contextual, Not Primary) */}
            <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-gold-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">Looking to Accelerate?</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Once you're ready, done-for-you resources and business acceleration are available in Step 4. Focus on your foundation first.
                            </p>
                            <Link href="/tracks/functional-medicine#step-4" className="text-sm text-burgundy-600 font-medium hover:text-burgundy-700 inline-flex items-center gap-1">
                                Learn about Business Scaler <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
