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
import { detectUserCategory, CategoryConfig } from "@/lib/category-configs";

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

// Background to success story mapping
const BACKGROUND_TO_STORIES: Record<string, number[]> = {
    healthcare: [14, 4, 7], // Abigail (nurse), Teresa, Luna
    teacher: [0, 4, 12], // Tiffany (corporate->coach), Teresa, Katherine
    corporate: [0, 3, 6], // Tiffany, Teresa, Ashley
    stay_at_home: [12, 4, 9], // Katherine (stay-at-home mom), Teresa, Caroline
    entrepreneur: [5, 13, 2], // Janet (business owner), Grace, Martha
    fitness: [1, 10, 6], // Addison, Samantha, Ashley
    wellness: [2, 8, 11], // Martha, Jade, Sandra
    student: [4, 0, 9], // Emilia, Tiffany, Caroline
    transition: [0, 3, 4], // Tiffany, Teresa, Emilia
    health_professional: [14, 7, 2], // Abigail, Luna, Martha
    other: [0, 1, 2], // Default: first 3
};

// Niche to specialization mapping (from onboarding interests)
const NICHE_TO_SPEC: Record<string, string[]> = {
    "Gut Health & Digestion": ["gut-health"],
    "Hormone Balance": ["hormone-health", "womens-health"],
    "Women's Health": ["womens-health", "hormone-health"],
    "Weight Management": ["metabolic-health", "functional-nutrition"],
    "Functional Nutrition": ["functional-nutrition", "gut-health"],
    "Mental Wellness & Anxiety": ["brain-health", "stress-hpa"],
    "Stress & Burnout": ["stress-hpa", "sleep-circadian"],
    "Sleep Optimization": ["sleep-circadian"],
    "Autoimmune Conditions": ["autoimmune", "gut-health"],
    "Sports & Fitness Nutrition": ["metabolic-health", "functional-nutrition"],
    "Anti-Aging & Longevity": ["detox-biotransformation", "metabolic-health"],
    "Holistic Wellness": ["functional-nutrition", "stress-hpa"],
};

// Course slug to specialization mapping (from ACTUAL enrollment)
// Uses actual slugs from database
const COURSE_TO_SPECS: Record<string, string[]> = {
    // FM Main Certification - all specializations
    "functional-medicine-complete-certification": ["gut-health", "functional-nutrition", "hormone-health", "metabolic-health", "stress-hpa", "brain-health", "womens-health", "autoimmune", "sleep-circadian", "detox-biotransformation"],
    "fm-preview": ["gut-health", "functional-nutrition", "hormone-health", "metabolic-health", "stress-hpa", "brain-health", "womens-health", "autoimmune", "sleep-circadian", "detox-biotransformation"],

    // FM Pro Tracks
    "fm-pro-practice-path": ["gut-health", "functional-nutrition", "hormone-health", "metabolic-health", "stress-hpa"],
    "fm-pro-advanced-clinical": ["autoimmune", "brain-health", "detox-biotransformation"],
    "fm-pro-master-depth": ["gut-health", "hormone-health", "autoimmune", "brain-health", "detox-biotransformation"],
    "fm-client-guarantee": ["gut-health", "functional-nutrition"],

    // Specialized Certifications
    "womens-hormone-health-coach": ["hormone-health", "womens-health"],
    "womens-hormone-health-coach-certification": ["hormone-health", "womens-health"],
    "gut-health-digestive-wellness-coach": ["gut-health", "functional-nutrition"],
    "gut-health-practitioner-certification": ["gut-health"],
    "gut-health-microbiome-coach-certification": ["gut-health", "functional-nutrition"],
    "holistic-nutrition-coach-certification": ["functional-nutrition", "metabolic-health"],
    "womens-health-mini-diploma": ["womens-health", "hormone-health"],

    // NARC Recovery (not FM but still show something)
    "narc-recovery-coach-certification": ["stress-hpa", "brain-health"],
    "narc-pro-practice-path": ["stress-hpa", "brain-health"],
    "narc-pro-advanced-clinical": ["brain-health"],
    "narc-pro-master-depth": ["brain-health", "stress-hpa"],
};

// Income goal to target step mapping
const INCOME_TO_STEP: Record<string, number> = {
    "3k_5k": 1,
    "5k_10k": 2,
    "10k_30k": 3,
    "30k_50k": 4,
    "50k_plus": 4,
};

// Get user's full personalization data
async function getUserPersonalization(userId: string) {
    const [user, enrollments, userTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                hasCompletedOnboarding: true,
                learningGoal: true,
                focusAreas: true,
            },
        }),
        prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: { slug: true, title: true },
                },
            },
        }),
        prisma.userTag.findMany({
            where: { userId },
            select: { tag: true, value: true },
        }),
    ]);

    // Extract onboarding data from tags
    const incomeGoalTag = userTags.find(t => t.tag.startsWith('income_goal:'));
    const timelineTag = userTags.find(t => t.tag.startsWith('timeline:'));
    const situationTag = userTags.find(t => t.tag.startsWith('situation:'));
    const currentFieldTag = userTags.find(t => t.tag.startsWith('current_field:'));
    const obstaclesTags = userTags.filter(t => t.tag.startsWith('obstacle:'));
    const interestsTags = userTags.filter(t => t.tag.startsWith('interest:'));

    // Parse values
    const incomeGoal = incomeGoalTag?.tag.replace('income_goal:', '') || null;
    const timeline = timelineTag?.tag.replace('timeline:', '') || null;
    const situation = situationTag?.tag.replace('situation:', '') || null;
    const currentField = currentFieldTag?.tag.replace('current_field:', '') || null;
    const obstacles = obstaclesTags.map(t => t.tag.replace('obstacle:', ''));
    const interests = interestsTags.map(t => t.tag.replace('interest:', ''));

    // Determine user's current step
    const hasAnyEnrollment = enrollments.length > 0;
    const hasCompletedCourse = enrollments.some((e) => e.status === "COMPLETED");

    let currentStep = 0;
    let nextAction = "start";
    if (!hasAnyEnrollment) {
        currentStep = 0;
        nextAction = "start";
    } else if (!hasCompletedCourse) {
        currentStep = 1;
        nextAction = "continue";
    } else {
        currentStep = 2;
        nextAction = "advance";
    }

    // Determine target step from income goal
    const targetStep = incomeGoal ? INCOME_TO_STEP[incomeGoal] || 2 : null;

    // Get recommended story indices based on background
    const background = situation || currentField || 'other';
    const recommendedStoryIndices = BACKGROUND_TO_STORIES[background] || BACKGROUND_TO_STORIES['other'];

    // PRIORITY 1: Get specialization IDs from ACTUAL course enrollment
    // This takes precedence over onboarding interests
    const enrolledSpecIds: string[] = [];
    const enrolledCourseNames: string[] = [];
    for (const enrollment of enrollments) {
        const courseSlug = enrollment.course.slug;
        const specs = COURSE_TO_SPECS[courseSlug];
        if (specs) {
            enrolledSpecIds.push(...specs);
            enrolledCourseNames.push(enrollment.course.title);
        }
    }

    // PRIORITY 2: Get recommended specialization IDs from onboarding interests (fallback)
    // Only used if user hasn't enrolled in anything yet
    const focusAreas = user?.focusAreas || [];
    const onboardingSpecIds: string[] = [];
    for (const niche of focusAreas) {
        const specs = NICHE_TO_SPEC[niche];
        if (specs) {
            onboardingSpecIds.push(...specs);
        }
    }

    // Final logic: If enrolled, use enrolled specs. Otherwise use onboarding interests.
    const hasEnrolledSpecs = enrolledSpecIds.length > 0;
    const recommendedSpecIds = hasEnrolledSpecs ? enrolledSpecIds : onboardingSpecIds;

    // Check if user is enrolled in comprehensive FM certification (covers all 10 specs)
    const comprehensiveCourses = ["functional-medicine-complete-certification", "fm-preview"];
    const isComprehensiveEnrollment = enrollments.some(e => comprehensiveCourses.includes(e.course.slug));

    // Detect user's category based on enrollments and tags
    const { config: categoryConfig, detection: categoryDetection } = detectUserCategory(
        enrollments.map(e => ({ course: { slug: e.course.slug } })),
        userTags.map(t => ({ tag: t.tag, value: t.value }))
    );

    return {
        firstName: user?.firstName || null,
        hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
        currentStep,
        nextAction,
        targetStep,
        incomeGoal,
        timeline,
        situation,
        currentField,
        obstacles,
        focusAreas,
        recommendedStoryIndices: [...new Set(recommendedStoryIndices)],
        recommendedSpecIds: [...new Set(recommendedSpecIds)],
        // New: Track whether recommendations come from enrollment or onboarding
        isFromEnrollment: hasEnrolledSpecs,
        enrolledCourseNames,
        enrolledSpecIds: [...new Set(enrolledSpecIds)],
        // Flag for comprehensive FM enrollment (all 10 specs included)
        isComprehensiveEnrollment,
        // Category config for dynamic content
        categoryConfig,
        categoryDetection,
    };
}

// Helper to format income goal for display
function formatIncomeGoal(goal: string | null): string {
    const labels: Record<string, string> = {
        "3k_5k": "$3K-$5K/month",
        "5k_10k": "$5K-$10K/month",
        "10k_30k": "$10K-$30K/month",
        "30k_50k": "$30K-$50K/month",
        "50k_plus": "$50K+/month",
        // Old format compatibility
        "10k_plus": "$10K+/month",
        "2k_5k": "$2K-$5K/month",
    };
    return goal ? labels[goal] || goal : "";
}

// Helper to format timeline for display
function formatTimeline(timeline: string | null): string {
    const labels: Record<string, string> = {
        "asap": "as soon as possible",
        "1_3_months": "within 1-3 months",
        "3_6_months": "within 3-6 months",
        "exploring": "exploring options",
    };
    return timeline ? labels[timeline] || timeline : "";
}

// Helper to format situation for display
function formatSituation(situation: string | null): string {
    const labels: Record<string, string> = {
        "employed_unhappy": "career changer",
        "employed_stable": "side income builder",
        "stay_at_home": "stay-at-home parent",
        "already_coach": "existing practitioner",
        "health_professional": "healthcare professional",
        "other": "wellness enthusiast",
    };
    return situation ? labels[situation] || "wellness enthusiast" : "";
}

export default async function CareerCenterPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const personalization = await getUserPersonalization(session.user.id);

    // Determine personalized CTA
    const getPersonalizedCTA = () => {
        switch (personalization.nextAction) {
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

    // Get personalized success stories from category config
    const getPersonalizedStories = () => {
        const categoryStories = personalization.categoryConfig.successStories;
        // Mark first 3 as recommended for this category
        return categoryStories.map((story, i) => ({
            ...story,
            isRecommended: i < 3
        }));
    };

    const personalizedStories = getPersonalizedStories();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* PERSONALIZED HERO - Only shows if user has completed onboarding */}
            {personalization.hasCompletedOnboarding && personalization.incomeGoal && (
                <Card className={`${personalization.categoryConfig.colorClasses.bg} border-0 overflow-hidden relative`}>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Left: Personalized greeting */}
                            <div className="flex-1">
                                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-3">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Your Personalized Career Path
                                </Badge>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {personalization.firstName ? `${personalization.firstName}, ` : ""}Your Path to{" "}
                                    <span className="text-gold-400">{formatIncomeGoal(personalization.incomeGoal)}</span>
                                </h1>
                                <p className="text-burgundy-100 text-sm md:text-base max-w-xl">
                                    As a <strong className="text-gold-300">{formatSituation(personalization.situation)}</strong>
                                    {personalization.timeline && (
                                        <> looking to start <strong className="text-gold-300">{formatTimeline(personalization.timeline)}</strong></>
                                    )}
                                    {personalization.isFromEnrollment && personalization.enrolledCourseNames.length > 0 ? (
                                        <>, you're currently enrolled in{" "}
                                            <strong className="text-gold-300">{personalization.enrolledCourseNames[0]}</strong>
                                        </>
                                    ) : personalization.focusAreas.length > 0 ? (
                                        <>, we've tailored your journey based on your interest in{" "}
                                            <strong className="text-gold-300">{personalization.focusAreas.slice(0, 2).join(" & ")}</strong>
                                        </>
                                    ) : null}.
                                </p>

                                {/* Target step indicator */}
                                {personalization.targetStep && (
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
                                            <Target className="w-4 h-4 text-gold-400" />
                                            <span className="text-white text-sm font-medium">
                                                Your target: <strong>Step {personalization.targetStep}</strong>
                                            </span>
                                        </div>
                                        {personalization.obstacles.includes("time") && (
                                            <Badge className="bg-green-500/20 text-green-300 border-0">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Flexible self-paced learning
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right: Quick stats */}
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                <div className="bg-white/10 rounded-xl p-3 text-center min-w-[120px]">
                                    <p className="text-2xl font-bold text-gold-400">{personalization.targetStep || 2}</p>
                                    <p className="text-xs text-burgundy-200">Target Step</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 text-center min-w-[120px]">
                                    <p className="text-2xl font-bold text-green-400">{formatIncomeGoal(personalization.incomeGoal).split("/")[0]}</p>
                                    <p className="text-xs text-burgundy-200">Income Goal</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ONBOARDING PROMPT - Only shows if user hasn't completed onboarding */}
            {!personalization.hasCompletedOnboarding && (
                <Card className="bg-gradient-to-r from-amber-50 to-gold-50 border-2 border-gold-200">
                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-gold-600" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 mb-1">Personalize Your Career Path</h3>
                                <p className="text-sm text-gray-600">
                                    Take our 2-minute quiz to see career paths, success stories, and specializations tailored just for you.
                                </p>
                            </div>
                            <Link href="/start-here">
                                <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                                    <Target className="w-4 h-4 mr-2" />
                                    Take the Quiz
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Compact Header - Only show when personalized hero is NOT shown */}
            {!(personalization.hasCompletedOnboarding && personalization.incomeGoal) && (
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
            )}

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
                            const isCompleted = personalization.currentStep > step.step;
                            const isCurrent = personalization.currentStep === step.step ||
                                (personalization.currentStep === 0 && step.step === 1) ||
                                (personalization.currentStep === 1 && step.step === 1);
                            const isUpcoming = personalization.currentStep < step.step && !isCurrent;
                            const isTarget = personalization.targetStep === step.step;

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

                                        {/* YOUR TARGET Badge */}
                                        {isTarget && !isCurrent && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                                <Badge className="bg-purple-500 text-white border-0 shadow-md whitespace-nowrap">
                                                    <Target className="w-3 h-3 mr-1" />
                                                    YOUR TARGET
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

            {/* SECTION 3 - FM SPECIALIZATIONS - PERSONALIZED */}
            <Card className="border-2 border-gold-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-burgundy-900">
                                {personalization.isComprehensiveEnrollment
                                    ? "Specializations in Your FM Certification"
                                    : personalization.isFromEnrollment
                                        ? "Specializations You're Learning"
                                        : personalization.hasCompletedOnboarding && personalization.recommendedSpecIds.length > 0
                                            ? "Recommended Specializations for You"
                                            : "AccrediPro FM Specializations"}
                            </h2>
                            <p className="text-burgundy-800 text-sm">
                                {personalization.isComprehensiveEnrollment
                                    ? "Your certification covers all 10 FM specializations"
                                    : personalization.isFromEnrollment && personalization.enrolledCourseNames.length > 0
                                        ? `Part of your ${personalization.enrolledCourseNames[0]}`
                                        : personalization.hasCompletedOnboarding && personalization.focusAreas.length > 0
                                            ? `Based on your interest in ${personalization.focusAreas.slice(0, 2).join(" & ")}`
                                            : "Master Your Niche, Transform Your Career, Build Authority"}
                            </p>
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

                            const isRecommended = personalization.recommendedSpecIds.includes(spec.id);
                            const isFromEnrollment = personalization.isFromEnrollment && personalization.enrolledSpecIds.includes(spec.id);

                            // Don't show individual badges for comprehensive FM enrollment (all specs are included)
                            const showBadge = !personalization.isComprehensiveEnrollment && isRecommended && personalization.hasCompletedOnboarding;

                            // Don't show ring highlight for comprehensive enrollment either
                            const showRing = !personalization.isComprehensiveEnrollment && isRecommended && personalization.hasCompletedOnboarding;

                            return (
                                <Card key={spec.id} className={`overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border-2 relative ${showRing ? (isFromEnrollment ? "ring-2 ring-emerald-400 ring-offset-2 " : "ring-2 ring-gold-400 ring-offset-2 ") + spec.borderColor : spec.borderColor}`}>
                                    {/* Badge: Only show for non-comprehensive enrollment */}
                                    {showBadge && (
                                        <div className="absolute -top-2 -right-2 z-10">
                                            {isFromEnrollment ? (
                                                <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 shadow-md">
                                                    <GraduationCap className="w-2.5 h-2.5 mr-0.5" />
                                                    Learning
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gold-500 text-white text-[9px] px-1.5 py-0.5 shadow-md">
                                                    <Star className="w-2.5 h-2.5 mr-0.5 fill-white" />
                                                    For You
                                                </Badge>
                                            )}
                                        </div>
                                    )}
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

            {/* SUCCESS STORIES - PERSONALIZED */}
            <Card className="border-2 border-green-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Star className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {personalization.hasCompletedOnboarding
                                    ? "Success Stories from Women Like You"
                                    : "AccrediPro Graduate Success Stories"}
                            </h2>
                            <p className="text-green-100 text-sm">
                                {personalization.hasCompletedOnboarding && personalization.situation
                                    ? `Real transformations from ${formatSituation(personalization.situation)}s`
                                    : "Real transformations from our certified practitioners"}
                            </p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {personalizedStories.slice(0, 15).map((story) => (
                            <Card key={story.name} className={`border hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden relative ${story.isRecommended ? "ring-2 ring-gold-400 ring-offset-2" : ""}`}>
                                {/* Recommended Badge */}
                                {story.isRecommended && personalization.hasCompletedOnboarding && (
                                    <div className="absolute -top-2 -right-2 z-10">
                                        <Badge className="bg-gold-500 text-white text-[9px] px-1.5 py-0.5 shadow-md">
                                            <Heart className="w-2.5 h-2.5 mr-0.5 fill-white" />
                                            For You
                                        </Badge>
                                    </div>
                                )}
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
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                {personalization.hasCompletedOnboarding && personalization.firstName
                                    ? `${personalization.firstName}, Ready to Begin?`
                                    : "Ready to Begin?"}
                            </h3>
                            <p className="text-burgundy-100 max-w-lg">
                                {personalization.hasCompletedOnboarding && personalization.incomeGoal ? (
                                    <>
                                        Your path to <strong className="text-gold-300">{formatIncomeGoal(personalization.incomeGoal)}</strong> starts with Step {personalization.targetStep || 1}.
                                        {personalization.timeline === "asap" && " You said you want to start ASAP - let's go!"}
                                        {personalization.obstacles.includes("time") && " Don't worry - our flexible schedule fits your life."}
                                    </>
                                ) : (
                                    <>
                                        Start your <strong className="text-gold-300">certification journey</strong> and transform your career in wellness.
                                        {personalization.currentStep === 0 && " Choose your specialization and get started today!"}
                                        {personalization.currentStep === 1 && " You're already on your way. Keep going!"}
                                        {personalization.currentStep >= 2 && " Great progress! Consider advancing to the next level."}
                                    </>
                                )}
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
