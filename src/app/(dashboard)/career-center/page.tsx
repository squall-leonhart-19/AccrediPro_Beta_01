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

// The 4-Step Career Ladder (removed Step 0 - Free Mini Diploma)
const careerSteps = [
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
        perfectFor: "Stay-at-home moms, nurses looking for side income, corporate professionals testing the waters",
    },
    {
        level: "Full-Time Coach",
        range: "$5K – $10K/month",
        description: "15–25 clients, full practice",
        step: "Step 2",
        stepColor: "amber",
        perfectFor: "Career changers, burned-out healthcare workers, retired professionals seeking purpose",
    },
    {
        level: "Group Programs",
        range: "$10K – $25K/month",
        description: "Courses + group coaching",
        step: "Step 3",
        stepColor: "blue",
        perfectFor: "Established coaches ready to scale, educators, wellness entrepreneurs seeking leverage",
    },
    {
        level: "Agency Owner",
        range: "$25K – $100K+/month",
        description: "Team of coaches, multiple programs",
        step: "Step 4",
        stepColor: "burgundy",
        perfectFor: "Ambitious entrepreneurs, former business owners, leaders ready to build a wellness empire",
    },
];

// Success Stories using zombie profiles with real AccrediPro avatars
const successStories = [
    {
        name: "Tiffany R.",
        role: "FM Health Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg",
        quote: "I went from corporate burnout to $8K/month in just 6 months. Best decision ever!",
        income: "$96K/year",
        rating: 5,
    },
    {
        name: "Addison T.",
        role: "Gut Health Specialist",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg",
        quote: "The certification gave me the credibility I needed. Now I have a waitlist!",
        income: "$120K/year",
        rating: 5,
    },
    {
        name: "Martha W.",
        role: "Hormone Health Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
        quote: "Finally helping women with PCOS and perimenopause. My clients love me!",
        income: "$84K/year",
        rating: 5,
    },
    {
        name: "Teresa L.",
        role: "Nutrition Specialist",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg",
        quote: "Left my corporate job at 45. Now earning more helping people heal.",
        income: "$108K/year",
        rating: 5,
    },
    {
        name: "Emilia F.",
        role: "Wellness Practitioner",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg",
        quote: "Started with zero experience. Now running my own virtual practice!",
        income: "$72K/year",
        rating: 5,
    },
    {
        name: "Janet H.",
        role: "FM Business Owner",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/89C2493E-DCEC-43FB-9A61-1FB969E45B6F_1_105_c.jpeg",
        quote: "Built a team of 3 coaches. AccrediPro gave me the blueprint!",
        income: "$180K/year",
        rating: 5,
    },
    {
        name: "Ashley E.",
        role: "Stress & HPA Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Cover-photo-for-Functional-Wellness.jpg",
        quote: "Helping burned-out executives reclaim their health. So fulfilling!",
        income: "$96K/year",
        rating: 5,
    },
    {
        name: "Luna C.",
        role: "Autoimmune Specialist",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/mini-diploma-functional-medicine.jpeg",
        quote: "Complex cases, premium rates. The advanced training was worth it!",
        income: "$144K/year",
        rating: 5,
    },
    {
        name: "Jade P.",
        role: "Thyroid Health Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Integrative-Health.jpeg",
        quote: "Specialized in Hashimoto's. Clients fly in from other states!",
        income: "$132K/year",
        rating: 5,
    },
    {
        name: "Caroline J.",
        role: "Sleep Wellness Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
        quote: "Found my niche in circadian health. 20 clients and growing!",
        income: "$78K/year",
        rating: 5,
    },
    {
        name: "Samantha K.",
        role: "Metabolic Health Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
        quote: "Helping clients with insulin resistance. Results speak for themselves!",
        income: "$90K/year",
        rating: 5,
    },
    {
        name: "Sandra M.",
        role: "Brain Health Specialist",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background.jpg",
        quote: "Gut-brain axis is my specialty. Changed my life and my clients' lives!",
        income: "$102K/year",
        rating: 5,
    },
    {
        name: "Katherine C.",
        role: "Women's Health Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1695.jpeg",
        quote: "From stay-at-home mom to 6-figure practitioner. Dreams do come true!",
        income: "$114K/year",
        rating: 5,
    },
    {
        name: "Grace W.",
        role: "Detox Specialist",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_9036-1.jpeg",
        quote: "Mold and heavy metals are my focus. Premium clients only!",
        income: "$156K/year",
        rating: 5,
    },
    {
        name: "Abigail D.",
        role: "Integrative Wellness Coach",
        avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1120.jpeg",
        quote: "Left nursing after 15 years. Now I actually help people heal!",
        income: "$88K/year",
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
                    text: "Start Your Certification",
                    link: "/tracks/functional-medicine",
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
                    text: "Start Your Certification",
                    link: "/tracks/functional-medicine",
                    variant: "primary",
                };
        }
    };

    const personalizedCTA = getPersonalizedCTA();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Compact Header - Matching Catalog Style */}
            <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 border-0 overflow-hidden">
                <CardContent className="px-5 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Icon + Title + Subtitle */}
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gold-400/20 flex items-center justify-center border border-gold-400/30 flex-shrink-0">
                                <Briefcase className="w-5 h-5 text-gold-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-[10px]">
                                        AccrediPro Career Center
                                    </Badge>
                                </div>
                                <h1 className="text-xl font-bold text-white">
                                    Your <span className="text-gold-400">Career Roadmap</span>
                                </h1>
                                <p className="text-xs text-burgundy-200 mt-0.5 max-w-md hidden sm:block">
                                    Discover income paths, specializations, and your next steps.
                                </p>
                            </div>
                        </div>

                        {/* Right: Stats + CTA */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Users className="w-3 h-3 mr-1.5 text-gold-400" />
                                    1,447 Certified
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <DollarSign className="w-3 h-3 mr-1.5 text-green-400" />
                                    $8K Avg/mo
                                </Badge>
                                <Badge className="bg-white/10 text-white border-0 px-3 py-1.5">
                                    <Star className="w-3 h-3 mr-1.5 text-gold-400" />
                                    4.9 Rating
                                </Badge>
                            </div>
                            <Link href="/my-personal-roadmap-by-coach-sarah">
                                <Button size="sm" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold h-9">
                                    <Map className="w-4 h-4 mr-1.5" />
                                    My Roadmap
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 1 - HOW ACCREDIPRO WORKS (IMPROVED) */}
            <Card className="border-2 border-burgundy-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-gold-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">How AccrediPro Works</h2>
                            <p className="text-burgundy-100 text-sm">The proven 4-step career ladder to wellness success</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl p-4 mb-6 border border-gold-200">
                        <p className="text-gray-700 text-center">
                            <span className="font-bold text-burgundy-700">Every successful AccrediPro practitioner</span> follows the same professional ladder.
                            Progress from <span className="font-bold text-green-600">certification to scalable income</span> with our proven 4-step career pathway.
                        </p>
                    </div>

                    {/* Improved Step Cards with YOU ARE HERE marker */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {careerSteps.map((step, index) => {
                            const incomeLabels = ["$3K-5K/mo", "$5K-10K/mo", "$10K-30K/mo", "$30K-50K+/mo"];

                            // Determine step status based on user progress
                            const isCompleted = userProgress.currentStep > step.step;
                            const isCurrent = userProgress.currentStep === step.step ||
                                (userProgress.currentStep === 0 && step.step === 1) ||
                                (userProgress.currentStep === 1 && step.step === 1);
                            const isUpcoming = userProgress.currentStep < step.step && !isCurrent;

                            return (
                                <div key={step.step} className="relative">
                                    {/* Connector Arrow */}
                                    {index < careerSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <ArrowRight className={`w-4 h-4 ${isCompleted ? 'text-green-400' : 'text-gray-300'}`} />
                                        </div>
                                    )}

                                    <div className={`p-4 rounded-xl border-2 h-full transition-all hover:shadow-md relative ${isCurrent
                                            ? "ring-4 ring-gold-300/50 border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-lg shadow-gold-100"
                                            : isCompleted
                                                ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
                                                : step.color === "emerald" ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 opacity-75" :
                                                    step.color === "amber" ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 opacity-75" :
                                                        step.color === "blue" ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-75" :
                                                            "border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-rose-50 opacity-75"
                                        }`}>
                                        {/* YOU ARE HERE Badge */}
                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                                <Badge className="bg-gold-500 text-white border-0 shadow-md animate-pulse whitespace-nowrap">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    YOU ARE HERE
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Completed Checkmark */}
                                        {isCompleted && (
                                            <div className="absolute -top-3 -right-3 z-20">
                                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Step Badge */}
                                        <div className="flex items-center justify-between mb-3 mt-2">
                                            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isCurrent ? "bg-gradient-to-r from-gold-400 to-amber-500 text-white shadow-sm" :
                                                    isCompleted ? "bg-green-500 text-white" :
                                                        step.color === "emerald" ? "bg-emerald-500 text-white" :
                                                            step.color === "amber" ? "bg-amber-500 text-white" :
                                                                step.color === "blue" ? "bg-blue-500 text-white" :
                                                                    "bg-burgundy-600 text-white"
                                                }`}>
                                                {isCompleted && <CheckCircle className="w-3 h-3 mr-1" />}
                                                STEP {step.step}
                                            </div>
                                        </div>

                                        {/* Title & Subtitle */}
                                        <h3 className="font-bold text-sm mb-1 text-gray-900">{step.title}</h3>
                                        <p className={`text-xs font-semibold mb-2 ${isCurrent ? "text-gold-700" :
                                                isCompleted ? "text-green-700" :
                                                    step.color === "emerald" ? "text-emerald-700" :
                                                        step.color === "amber" ? "text-amber-700" :
                                                            step.color === "blue" ? "text-blue-700" :
                                                                "text-burgundy-700"
                                            }`}>{step.subtitle}</p>

                                        {/* Description */}
                                        <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.description}</p>

                                        {/* Income Potential */}
                                        <div className={`mt-auto pt-2 border-t ${isCurrent ? "border-gold-200" :
                                                isCompleted ? "border-green-200" :
                                                    step.color === "emerald" ? "border-emerald-200" :
                                                        step.color === "amber" ? "border-amber-200" :
                                                            step.color === "blue" ? "border-blue-200" :
                                                                "border-burgundy-200"
                                            }`}>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Earning Potential</p>
                                            <p className="text-sm font-bold text-green-600">
                                                {incomeLabels[index]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/my-personal-roadmap-by-coach-sarah">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700 shadow-md">
                                <Map className="w-4 h-4 mr-2" />
                                View Your Personalized Roadmap
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/tracks/functional-medicine">
                            <Button variant="outline" className="border-gold-300 text-gold-700 hover:bg-gold-50">
                                <Play className="w-4 h-4 mr-2" />
                                Start Your Certification
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

            {/* SECTION 3 - FM SPECIALIZATIONS - IMPROVED */}
            <Card className="border-2 border-gold-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-burgundy-900">AccrediPro FM Specializations</h2>
                            <p className="text-burgundy-800 text-sm">Master Your Niche, Transform Your Career, Build Authority</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-xl p-4 mb-6 border border-burgundy-200">
                        <p className="text-gray-700 text-center">
                            <span className="font-bold text-burgundy-700">AccrediPro offers 10 specialized FM tracks</span> to help you build authority,
                            <span className="font-bold text-green-600"> earn premium income</span>, and create a
                            <span className="font-bold text-burgundy-700"> completely new life</span> doing what you love.
                        </p>
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
                                <Card key={spec.id} className={`overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 ${spec.borderColor} border-2`}>
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
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-400">Market Demand</span>
                                                <span className={`font-semibold ${spec.textColor}`}>{spec.marketDemand}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-green-50 rounded px-2 py-1">
                                                <span className="text-[10px] text-green-600">Earning Potential</span>
                                                <span className="text-xs font-bold text-green-700">{spec.incomeRange}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    <div className="text-center mt-6">
                        <Link href="/tracks/functional-medicine">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700 shadow-md">
                                Explore All Specialization Tracks
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 4 - INCOME PATHS (Tied to Steps) */}
            <Card className="border-2 border-gray-100">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">AccrediPro Income Paths</h2>
                            <p className="text-sm text-gray-500">Each income level maps to a step in your AccrediPro journey</p>
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
                                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 h-full flex flex-col">
                                    <Badge className={`mb-2 w-fit ${path.stepColor === "emerald" ? "bg-emerald-100 text-emerald-700" :
                                        path.stepColor === "amber" ? "bg-amber-100 text-amber-700" :
                                            path.stepColor === "blue" ? "bg-blue-100 text-blue-700" :
                                                "bg-burgundy-100 text-burgundy-700"
                                        }`}>
                                        {path.step}
                                    </Badge>
                                    <Badge className="mb-2 bg-green-100 text-green-700 w-fit">{path.range}</Badge>
                                    <h4 className="font-semibold text-gray-900">{path.level}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{path.description}</p>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex-1">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium mb-1">Perfect for:</p>
                                        <p className="text-xs text-gray-600 leading-relaxed">{path.perfectFor}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 5 - SUCCESS STORIES - IMPROVED with zombie profiles */}
            <Card className="border-2 border-green-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AccrediPro Graduate Success Stories</h2>
                            <p className="text-green-100 text-sm">Real transformations from our certified practitioners</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {successStories.map((story, index) => (
                            <Card key={story.name} className="border hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                                <CardContent className="p-4">
                                    {/* Star Rating */}
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} className={`w-3 h-3 ${idx < story.rating ? "text-gold-400 fill-gold-400" : "text-gray-200"}`} />
                                        ))}
                                    </div>

                                    <p className="text-gray-600 italic text-xs mb-3 line-clamp-3">&ldquo;{story.quote}&rdquo;</p>

                                    <div className="flex items-center gap-2">
                                        <img
                                            src={story.avatar}
                                            alt={story.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-xs truncate">{story.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{story.role}</p>
                                        </div>
                                    </div>
                                    <Badge className="mt-2 bg-green-100 text-green-700 text-[10px] font-bold w-full justify-center">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {story.income}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

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
                                Start your <strong className="text-gold-300">certification journey</strong> and transform your career in wellness.
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
                            <Link href="/my-personal-roadmap-by-coach-sarah">
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

            {/* COACH CHAT CTA - Bottom of Page */}
            <Card className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 border-0 shadow-xl overflow-hidden">
                <CardContent className="p-8 relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-white">
                                <h3 className="text-2xl md:text-3xl font-bold mb-1">
                                    Any Questions or Doubts?
                                </h3>
                                <p className="text-white/90 text-lg">
                                    Chat with your coach now to find your best career track!
                                </p>
                            </div>
                        </div>
                        <Link href="/messages">
                            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg font-bold text-lg px-8 h-14">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                                </svg>
                                Chat Your Coach Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
